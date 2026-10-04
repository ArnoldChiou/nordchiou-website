// Token 互動教學用的示範資料與簡化版演算法（全部在瀏覽器執行，不呼叫任何 API）

// ---------- 示意分詞器 ----------
// 真實分詞器（例如 BPE）有十幾萬個詞彙；這裡用小型詞表模擬常見行為：
// 常見英文單字 1 個 token、長單字拆成字首／字根／字尾，中文常見詞 1 個 token、其餘一字一 token，
// 數字每 3 位一組，表情符號這類罕見字元會被拆成好幾個位元組碎片。

const COMMON_WORDS = new Set(
  ("the a an is are was were be been to of and or in on at for from with by as it its this that these those what which who how why when where " +
    "our your my their his her we you they i he she can could will would should may might do does did have has had not no yes " +
    "company customer customers return policy request within days day of item items order price cost data model language answer " +
    "question questions document documents file files system team time year month week new use used using make get set " +
    "ai api app chat email report sales product service support help please thank thanks hello hi").split(" "),
);

const PREFIXES = ["inter", "trans", "under", "over", "pre", "dis", "re", "un"];
const SUFFIXES = ["ization", "ation", "tion", "sion", "ment", "ness", "able", "ible", "ing", "ers", "est", "ize", "ed", "er", "ly", "es", "s"];

const COMMON_ZH = new Set(
  ("我們 你們 他們 公司 可以 什麼 這個 那個 一個 沒有 因為 所以 如果 時候 已經 問題 客戶 系統 資料 文件 人工 智慧 員工 工作 需要 進行 使用 " +
    "服務 產品 管理 主管 報告 會議 時間 今天 明天 謝謝 你好 請問 價格 訂單 合約 模型 語言 回答 知識 導入 企業 台灣 中文 英文 成本 每個 " +
    "自己 這些 那些 還是 就是 不是 但是 以及 以上 以下 發票 付款 商品 政策 申請 收到 協助 下次 金額 期限 編號 退貨").split(" "),
);

export type Token = { text: string; kind: "word" | "piece" | "zh" | "num" | "punct" | "space" | "byte" };

const PRE_SPLIT = / ?[A-Za-z]+| ?\d{1,3}|[㐀-鿿]|\s+|[^\sA-Za-z\d㐀-鿿]/gu;
const isCjk = (char: string) => /[㐀-鿿]/u.test(char);

export function tokenize(text: string): Token[] {
  const tokens: Token[] = [];
  const pieces = text.match(PRE_SPLIT) ?? [];
  for (let index = 0; index < pieces.length; index++) {
    const piece = pieces[index];
    if (isCjk(piece)) {
      const next = pieces[index + 1];
      if (next && isCjk(next) && COMMON_ZH.has(piece + next)) {
        tokens.push({ text: piece + next, kind: "zh" });
        index++;
      } else tokens.push({ text: piece, kind: "zh" });
    } else if (/^ ?[A-Za-z]+$/.test(piece)) tokens.push(...splitWord(piece));
    else if (/^ ?\d+$/.test(piece)) tokens.push({ text: piece, kind: "num" });
    else if (/^\s+$/.test(piece)) tokens.push({ text: piece, kind: "space" });
    else if (piece.codePointAt(0)! > 0xffff) {
      // 罕見字元（如表情符號）在詞表裡沒有對應，會退回 UTF-8 位元組，通常拆成 2–3 個 token
      tokens.push({ text: piece, kind: "byte" }, { text: "·", kind: "byte" });
    } else tokens.push({ text: piece, kind: "punct" });
  }
  return tokens;
}

function splitWord(word: string): Token[] {
  const lead = word.startsWith(" ") ? " " : "";
  const bare = word.trimStart();
  if (COMMON_WORDS.has(bare.toLowerCase())) return [{ text: word, kind: "word" }];
  const parts: string[] = [];
  let stem = bare;
  const prefix = PREFIXES.find((item) => stem.toLowerCase().startsWith(item) && stem.length - item.length >= 3);
  if (prefix) {
    parts.push(stem.slice(0, prefix.length));
    stem = stem.slice(prefix.length);
  }
  const suffix = SUFFIXES.find((item) => stem.toLowerCase().endsWith(item) && stem.length - item.length >= 3);
  const core = suffix ? stem.slice(0, -suffix.length) : stem;
  if (COMMON_WORDS.has(core.toLowerCase()) || core.length <= 6) parts.push(core);
  else for (let at = 0; at < core.length; at += 4) parts.push(core.slice(at, at + 4));
  if (suffix) parts.push(stem.slice(-suffix.length));
  parts[0] = lead + parts[0];
  return parts.map((text, index) => ({ text, kind: parts.length === 1 ? "word" : index === 0 ? "word" : "piece" }));
}

// 依文字算出固定的示意編號；真實模型的編號來自詞表位置
export function tokenId(text: string) {
  let hash = 2166136261;
  for (const char of text) hash = Math.imul(hash ^ char.codePointAt(0)!, 16777619);
  return (hash >>> 0) % 200000;
}

export const SAMPLES = [
  { label: "中文問句", text: "請問我們公司的退貨政策是什麼？客戶在收到商品後 7 天內可以申請退貨。" },
  { label: "同一段英文", text: "What is our company's return policy? Customers can request a return within 7 days of receiving the item." },
  { label: "訂單與數字", text: "訂單編號 A-20261004-0087，金額 NT$128,500，付款期限 2026/10/31。" },
  { label: "表情符號", text: "謝謝你的協助！🙏🎉 下次見 👋" },
];

// ---------- BPE 詞表學習 ----------
// 從單一字元開始，反覆把「最常一起出現的相鄰兩個片段」合併成新詞彙，這就是 BPE（Byte Pair Encoding）

export type Corpus = { label: string; words: [string, number][] };

export const CORPORA: Corpus[] = [
  { label: "中文範例", words: [["知識庫問答", 5], ["知識庫系統", 3], ["客服系統", 4], ["客服機器人", 3], ["系統導入", 2]] },
  { label: "英文範例", words: [["low", 5], ["lower", 2], ["newest", 6], ["widest", 3]] },
];

export type BpeState = { words: { symbols: string[]; count: number }[]; merges: { pair: [string, string]; count: number }[] };

export function initBpe(corpus: Corpus): BpeState {
  return { words: corpus.words.map(([word, count]) => ({ symbols: [...word], count })), merges: [] };
}

export function bestPair(state: BpeState): { pair: [string, string]; count: number } | null {
  const counts = new Map<string, { pair: [string, string]; count: number }>();
  for (const { symbols, count } of state.words) {
    for (let index = 0; index < symbols.length - 1; index++) {
      const key = `${symbols[index]}\u0000${symbols[index + 1]}`;
      const entry = counts.get(key) ?? { pair: [symbols[index], symbols[index + 1]] as [string, string], count: 0 };
      entry.count += count;
      counts.set(key, entry);
    }
  }
  let best: { pair: [string, string]; count: number } | null = null;
  for (const entry of counts.values()) if (entry.count > 1 && (!best || entry.count > best.count)) best = entry;
  return best;
}

export function mergeStep(state: BpeState): BpeState {
  const best = bestPair(state);
  if (!best) return state;
  const [left, right] = best.pair;
  const words = state.words.map(({ symbols, count }) => {
    const next: string[] = [];
    for (let index = 0; index < symbols.length; index++) {
      if (symbols[index] === left && symbols[index + 1] === right) {
        next.push(left + right);
        index++;
      } else next.push(symbols[index]);
    }
    return { symbols: next, count };
  });
  return { words, merges: [...state.merges, best] };
}

export const totalTokens = (state: BpeState) => state.words.reduce((sum, { symbols, count }) => sum + symbols.length * count, 0);

// ---------- 上下文視窗 ----------

export const WINDOWS = [
  { label: "8K", size: 8_000, note: "早期或小型模型" },
  { label: "128K", size: 128_000, note: "目前常見規格" },
  { label: "1M", size: 1_000_000, note: "超長上下文模型" },
];

export const OUTPUT_RESERVE = 4_000;
export const SYSTEM_TOKENS = 600;
export const TURN_TOKENS = 350;
export const SUMMARY_TOKENS = 800;
export const RAG_DOC_TOKENS = 2_500;

export type ContextItem = { id: number; kind: "turn" | "doc"; label: string; tokens: number; hasName?: boolean };

export const DOCS = [
  { label: "採購合約 PDF（20 頁）", tokens: 15_000 },
  { label: "員工手冊（300 頁）", tokens: 240_000 },
];

export type Strategy = "drop" | "summarize" | "error";

export type Packed = { kept: ContextItem[]; dropped: ContextItem[]; summary: number; used: number; overflow: boolean; rememberName: boolean };

// 依策略決定哪些內容能留在上下文裡；系統規則和預留的回答空間一定要保留
export function pack(items: ContextItem[], window: number, strategy: Strategy, useRag: boolean): Packed {
  const sized = items.map((item) => (item.kind === "doc" && useRag ? { ...item, tokens: RAG_DOC_TOKENS } : item));
  const budget = window - OUTPUT_RESERVE - SYSTEM_TOKENS;
  const total = sized.reduce((sum, item) => sum + item.tokens, 0);
  if (total <= budget) return { kept: sized, dropped: [], summary: 0, used: SYSTEM_TOKENS + total, overflow: false, rememberName: sized.some((item) => item.hasName) };
  if (strategy === "error") return { kept: sized, dropped: [], summary: 0, used: SYSTEM_TOKENS + total, overflow: true, rememberName: false };

  const summary = strategy === "summarize" ? SUMMARY_TOKENS : 0;
  const kept = [...sized];
  const dropped: ContextItem[] = [];
  let used = total + summary;
  while (used > budget && kept.length > 0) {
    const item = kept.shift()!;
    dropped.push(item);
    used -= item.tokens;
  }
  // 摘要會保留舊對話裡的重點（例如對方的名字），但長文件的細節無法塞進摘要
  const rememberName = kept.some((item) => item.hasName) || (summary > 0 && dropped.some((item) => item.hasName));
  return { kept, dropped, summary, used: SYSTEM_TOKENS + used, overflow: false, rememberName };
}

// ---------- 成本 ----------

export type Pricing = { input: number; output: number; fx: number };

// 價格為示意值（美元／每百萬 token），實際請以各家最新公告為準
export const DEFAULT_PRICING: Pricing = { input: 3, output: 15, fx: 32 };

export const costPerCall = (inputTokens: number, outputTokens: number, pricing: Pricing) =>
  ((inputTokens * pricing.input + outputTokens * pricing.output) / 1_000_000) * pricing.fx;
