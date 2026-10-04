// AI Agent 互動教學用的示範工具與情境（全部在瀏覽器執行，不呼叫任何 API）
// 真實的 Agent 每一步由語言模型即時決定；這裡把典型的決策過程寫成腳本，並依權限設定與核准結果分支

import { tokenize } from "../tokens/tokens-data";

export type Risk = "low" | "medium" | "high";
export type Permission = "auto" | "approve" | "deny";

export type Tool = {
  name: string;
  label: string;
  description: string;
  parameters: Record<string, { type: string; description: string; required?: boolean }>;
  risk: Risk;
};

export const TOOLS: Tool[] = [
  {
    name: "get_order",
    label: "查詢訂單",
    description: "依訂單編號查詢訂單狀態、品項、金額、送達日期與物流資訊。",
    parameters: { order_id: { type: "string", description: "訂單編號，例如 A1024", required: true } },
    risk: "low",
  },
  {
    name: "search_orders",
    label: "搜尋訂單",
    description: "依客戶姓名或商品關鍵字搜尋最近的訂單。找不到時回傳空清單。",
    parameters: {
      customer: { type: "string", description: "客戶姓名" },
      keyword: { type: "string", description: "商品名稱關鍵字" },
      days: { type: "number", description: "搜尋最近幾天，預設 30" },
    },
    risk: "low",
  },
  {
    name: "check_inventory",
    label: "查庫存",
    description: "查詢指定商品與顏色目前的庫存數量。",
    parameters: {
      product: { type: "string", description: "商品名稱", required: true },
      color: { type: "string", description: "顏色" },
    },
    risk: "low",
  },
  {
    name: "send_email",
    label: "寄送 Email",
    description: "寄 Email 給客戶。內容會直接送到客戶信箱，送出後無法收回。",
    parameters: {
      to: { type: "string", description: "收件人", required: true },
      subject: { type: "string", description: "主旨", required: true },
      body: { type: "string", description: "內文", required: true },
    },
    risk: "medium",
  },
  {
    name: "create_refund",
    label: "建立退款",
    description: "對指定訂單建立退款，款項會退回客戶原付款方式。",
    parameters: {
      order_id: { type: "string", description: "訂單編號", required: true },
      amount: { type: "number", description: "退款金額（新台幣）", required: true },
      reason: { type: "string", description: "退款原因", required: true },
    },
    risk: "high",
  },
  {
    name: "handoff_to_human",
    label: "轉交真人",
    description: "把案件轉給真人客服，附上目前為止的處理摘要。",
    parameters: { summary: { type: "string", description: "案件摘要", required: true } },
    risk: "low",
  },
];

export const getTool = (name: string) => TOOLS.find((tool) => tool.name === name)!;

export const RISK_LABEL: Record<Risk, string> = { low: "低風險・不改動資料", medium: "中風險・對外發送", high: "高風險・動到錢" };

export const DEFAULT_PERMISSIONS: Record<string, Permission> = {
  get_order: "auto",
  search_orders: "auto",
  check_inventory: "auto",
  send_email: "approve",
  create_refund: "approve",
  handoff_to_human: "auto",
};

// 模型實際看到的工具定義（JSON Schema 格式），所有工具每一輪都會一起送出
export function toolSchema(tool: Tool) {
  const required = Object.entries(tool.parameters).filter(([, param]) => param.required).map(([key]) => key);
  return {
    name: tool.name,
    description: tool.description,
    input_schema: {
      type: "object",
      properties: Object.fromEntries(Object.entries(tool.parameters).map(([key, { type, description }]) => [key, { type, description }])),
      ...(required.length > 0 && { required }),
    },
  };
}

// ---------- 執行過程 ----------

export type AgentEvent =
  | { type: "user"; text: string }
  | { type: "think"; text: string }
  | { type: "call"; tool: string; args: Record<string, unknown> }
  | { type: "result"; ok: boolean; data: unknown }
  | { type: "approval"; tool: string; summary: string }
  | { type: "blocked"; tool: string }
  | { type: "answer"; text: string }
  | { type: "limit"; rounds: number };

export type Decision = "approve" | "reject";
export type RunOptions = { permissions: Record<string, Permission>; decisions: Record<string, Decision>; maxRounds: number };

// 寫腳本用的小幫手：處理權限、核准與「等待人工」時暫停
class Run {
  events: AgentEvent[] = [];
  paused = false;
  rounds = 0;
  private options: RunOptions;
  constructor(options: RunOptions) {
    this.options = options;
  }

  user(text: string) {
    this.events.push({ type: "user", text });
  }
  // 每次模型開口（思考後決定呼叫工具或回答）算一輪
  think(text: string) {
    if (this.paused) return false;
    if (this.rounds >= this.options.maxRounds) {
      this.events.push({ type: "limit", rounds: this.rounds });
      this.paused = true;
      return false;
    }
    this.rounds++;
    this.events.push({ type: "think", text });
    return true;
  }
  // 回傳 "done"、"rejected"、"blocked" 或 "paused"
  call(tool: string, args: Record<string, unknown>, result: { ok: boolean; data: unknown }, summary = ""): "done" | "rejected" | "blocked" | "paused" {
    if (this.paused) return "paused";
    const permission = this.options.permissions[tool] ?? "auto";
    this.events.push({ type: "call", tool, args });
    if (permission === "deny") {
      this.events.push({ type: "blocked", tool }, { type: "result", ok: false, data: { error: "permission_denied", message: "此工具已被管理者停用" } });
      return "blocked";
    }
    if (permission === "approve") {
      this.events.push({ type: "approval", tool, summary });
      const decision = this.options.decisions[tool];
      if (!decision) {
        this.paused = true;
        return "paused";
      }
      if (decision === "reject") {
        this.events.push({ type: "result", ok: false, data: { error: "rejected_by_reviewer", message: "審核人員拒絕執行此動作" } });
        return "rejected";
      }
    }
    this.events.push({ type: "result", ...result });
    return "done";
  }
  answer(text: string) {
    if (!this.paused) this.events.push({ type: "answer", text });
  }
}

export type Scenario = { id: string; label: string; prompt: string; build: (options: RunOptions) => Run };

const ORDER_A1024 = { order_id: "A1024", status: "已出貨", item: "藍牙耳機（黑色）", amount: 2490, shipped_at: "2026-10-01", carrier: "黑貓宅急便", tracking: "8823-1167-0045", eta: "2026-10-06" };
const ORDER_A1031 = { order_id: "A1031", status: "已送達", item: "義式咖啡機", amount: 8900, delivered_at: "2026-09-30", return_window_days: 7 };

export const SCENARIOS: Record<string, Scenario> = {
  shipping: {
    id: "shipping",
    label: "查物流＋問庫存",
    prompt: "我的訂單 A1024 還沒收到，可以幫我查一下嗎？另外同款白色還有貨嗎？",
    build(options) {
      const run = new Run(options);
      run.user(this.prompt);
      if (run.think("客人問了兩件事：物流進度和白色庫存。先用 get_order 查 A1024 的狀態。"))
        run.call("get_order", { order_id: "A1024" }, { ok: true, data: ORDER_A1024 });
      if (run.think("訂單 10/1 已出貨，預計 10/6 送達。再用 check_inventory 查同款白色的庫存。"))
        run.call("check_inventory", { product: "藍牙耳機", color: "白色" }, { ok: true, data: { product: "藍牙耳機", color: "白色", stock: 12 } });
      if (run.think("兩個問題都有資料了，整理成回覆，附上物流單號方便客人自行追蹤。"))
        run.answer("您的訂單 A1024（黑色藍牙耳機）已於 10/1 由黑貓宅急便出貨，單號 8823-1167-0045，預計 10/6 送達。同款白色目前有 12 件庫存，需要的話可以直接下單。");
      return run;
    },
  },
  retry: {
    id: "retry",
    label: "查無資料時換方法",
    prompt: "幫我查一下王小明的訂單，他說上個月買了兩台除濕機。",
    build(options) {
      const run = new Run(options);
      run.user(this.prompt);
      if (run.think("用客戶姓名「王小明」搜尋最近 30 天的訂單。"))
        run.call("search_orders", { customer: "王小明", days: 30 }, { ok: true, data: { orders: [] } });
      if (run.think("用姓名找不到。可能是名字寫法不同，改用商品關鍵字「除濕機」搜尋，並把範圍放寬到 45 天。"))
        run.call("search_orders", { keyword: "除濕機", days: 45 }, { ok: true, data: { orders: [{ order_id: "A0987", customer: "王曉明", item: "除濕機", qty: 2, date: "2026-09-12" }, { order_id: "A0912", customer: "陳美華", item: "除濕機", qty: 1, date: "2026-09-03" }] } });
      if (run.think("找到一筆「王曉明」買了 2 台除濕機，名字很像但不同字。不能自己假設是同一人，應該先跟使用者確認。"))
        run.answer("用「王小明」查不到訂單。不過有一筆 9/12 的訂單 A0987，客戶是「王曉明」，買了 2 台除濕機。請問是同一位客戶嗎？確認後我再幫您查詳細內容。");
      return run;
    },
  },
  refund: {
    id: "refund",
    label: "退款需要核准",
    prompt: "訂單 A1031 的咖啡機收到就壞了，我要退款。",
    build(options) {
      const run = new Run(options);
      run.user(this.prompt);
      if (run.think("先用 get_order 確認訂單內容、金額與送達日期，判斷是否在鑑賞期內。"))
        run.call("get_order", { order_id: "A1031" }, { ok: true, data: ORDER_A1031 });
      if (!run.think("9/30 送達，今天 10/4，在 7 天鑑賞期內，金額 8,900 元，符合退款條件。呼叫 create_refund。")) return run;
      const refund = run.call("create_refund", { order_id: "A1031", amount: 8900, reason: "商品到貨即故障" }, { ok: true, data: { refund_id: "R-55120", status: "已建立", expected_days: 7 } }, "退款 NT$ 8,900 給訂單 A1031");
      if (refund === "paused") return run;
      if (refund !== "done") {
        if (run.think(refund === "blocked" ? "退款工具被停用，我沒有權限處理，轉交真人客服並附上已確認的資訊。" : "審核人員拒絕了退款，可能需要先檢查商品。轉交真人客服接手。"))
          run.call("handoff_to_human", { summary: "A1031 咖啡機到貨故障，在鑑賞期內，客人要求退款 8,900 元，待人工處理。" }, { ok: true, data: { ticket: "CS-3381", queue: "退換貨組" } });
        if (run.think("已建立客服單，告訴客人接下來會怎麼處理。"))
          run.answer("已幫您把退款需求轉給退換貨專員（案件編號 CS-3381），我們已確認訂單在鑑賞期內，專員會在一個工作天內與您聯繫。");
        return run;
      }
      if (!run.think("退款已建立。寄一封確認信給客人，留下書面紀錄。")) return run;
      const mail = run.call("send_email", { to: "客戶信箱", subject: "退款確認：訂單 A1031", body: "您的退款 NT$ 8,900 已受理，預計 7 個工作天內退回原付款方式。" }, { ok: true, data: { sent: true } }, "寄退款確認信給客戶");
      if (mail === "paused") return run;
      if (run.think(mail === "done" ? "退款和確認信都完成了，回覆客人。" : "退款已完成，但確認信沒有寄出，在回覆中直接告知退款資訊。"))
        run.answer(`已為您建立退款（編號 R-55120），NT$ 8,900 預計 7 個工作天內退回原付款方式。${mail === "done" ? "確認信已寄到您的信箱。" : ""}造成不便很抱歉！`);
      return run;
    },
  },
  timeout: {
    id: "timeout",
    label: "工具一直失敗",
    prompt: "幫我查訂單 B2207 的物流。",
    build(options) {
      const run = new Run(options);
      run.user(this.prompt);
      const notes = [
        "用 get_order 查 B2207。",
        "系統逾時，可能是暫時性問題，再試一次。",
        "又逾時了，再試一次看看。",
        "還是逾時，再試一次。",
        "持續逾時，再試一次。",
        "仍然失敗，再試一次。",
      ];
      for (let attempt = 0; attempt < 12; attempt++) {
        if (!run.think(notes[Math.min(attempt, notes.length - 1)])) return run;
        run.call("get_order", { order_id: "B2207" }, { ok: false, data: { error: "timeout", message: "訂單系統逾時，請稍後再試" } });
      }
      return run;
    },
  },
};

// ---------- 每一輪送給模型的 token ----------

// 每一輪都要重送：系統規則 + 所有工具定義 + 到目前為止的完整過程
export const SYSTEM_PROMPT = "你是晨光貿易的客服 Agent。可以使用提供的工具查詢與處理訂單。不確定時先向使用者確認；高風險動作需等待人工核准。";

const countTokens = (value: unknown) => tokenize(typeof value === "string" ? value : JSON.stringify(value)).length;

export const BASE_TOKENS = countTokens(SYSTEM_PROMPT) + countTokens(TOOLS.map(toolSchema));

export function roundTokens(events: AgentEvent[]) {
  const rounds: { input: number; output: number }[] = [];
  let history = 0;
  let current: { input: number; output: number } | null = null;
  for (const event of events) {
    const size = event.type === "limit" ? 0 : countTokens(event.type === "call" ? { tool: event.tool, args: event.args } : "text" in event ? event.text : "data" in event ? event.data : event.type);
    if (event.type === "think") {
      current = { input: BASE_TOKENS + history, output: size };
      rounds.push(current);
    } else if ((event.type === "call" || event.type === "answer") && current) current.output += size;
    history += size;
  }
  return rounds;
}
