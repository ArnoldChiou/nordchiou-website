"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Explain, LabShell, Recap } from "../LabShell";
import { DEFAULT_PRICING, costPerCall } from "../tokens/tokens-data";
import {
  type AgentEvent, type Decision, type Permission, type RunOptions, DEFAULT_PERMISSIONS, RISK_LABEL, SCENARIOS, TOOLS,
  getTool, roundTokens, toolSchema,
} from "./agent-data";

const STEPS = [
  { short: "總覽", title: "會聊天的 AI，和會做事的 AI" },
  { short: "工具", title: "Agent 手上有哪些工具？" },
  { short: "決策迴圈", title: "思考 → 行動 → 觀察，直到完成" },
  { short: "出錯換方法", title: "查不到、出錯時怎麼辦？" },
  { short: "權限核准", title: "高風險動作，先停下來等人核准" },
  { short: "成本界線", title: "每一輪都要錢：回合上限與適用範圍" },
];

const fmt = (value: number) => value.toLocaleString("zh-TW");

export default function AgentLesson() {
  return (
    <LabShell label="AI Agent 工具呼叫互動教學" steps={STEPS} restartStep={4} restartLabel="回到權限設定再試">
      {(step, go) => (
        <>
          {step === 0 && <Overview onJump={go} />}
          {step === 1 && <ToolsStep />}
          {step === 2 && <LoopStep />}
          {step === 3 && <RetryStep />}
          {step === 4 && <ApprovalStep />}
          {step === 5 && <LimitStep />}
        </>
      )}
    </LabShell>
  );
}

function Overview({ onJump }: { onJump: (step: number) => void }) {
  return (
    <>
      <Explain
        what={<>一般的聊天機器人只能「說」：它根據訓練資料或你給的文件回答問題。AI Agent（代理）則可以「做」：它手上有一組工具（tool），例如查訂單、查庫存、寄信、建立退款，會自己判斷該用哪個工具、拿到結果後再決定下一步，直到把事情辦完。</>}
        analogy={<>聊天機器人像只能看手冊回答的總機；Agent 像有系統權限的客服專員，會自己登入後台查資料、填單、寄信。也因為它能動手，「它被允許做什麼」就變得非常重要。</>}
      />
      <div className="agent-compare">
        <div>
          <p className="agent-compare-label">一般聊天機器人</p>
          <p className="lab-bubble user">訂單 A1024 到哪了？</p>
          <p className="lab-bubble ai"><span className="lab-speaker">✦ AI 回覆</span>您可以到官網「訂單查詢」頁面，輸入訂單編號查詢物流狀態。</p>
        </div>
        <div className="agent">
          <p className="agent-compare-label">AI Agent</p>
          <p className="lab-bubble user">訂單 A1024 到哪了？</p>
          <p className="agent-mini-call"><span>⚙</span>get_order(order_id: &quot;A1024&quot;)</p>
          <p className="lab-bubble ai found"><span className="lab-speaker">✦ AI 回覆</span>已於 10/1 由黑貓宅急便出貨，單號 8823-1167-0045，預計 10/6 送達。</p>
        </div>
      </div>
      <div className="lab-cards">
        {([[1, "工具", "Agent 能做什麼，取決於你給它哪些工具。"], [2, "決策迴圈", "反覆「思考、行動、觀察」，直到完成任務。"], [4, "權限與核准", "動到錢、對外發送的動作，要先讓人看過。"]] as const).map(([target, name, text], index) => (
          <button key={name} type="button" onClick={() => onJump(target)} style={{ animationDelay: `${index * 120}ms` }}>
            <b>{name}</b><span>{text}</span><small>前往第 {target} 步 →</small>
          </button>
        ))}
      </div>
      <p className="lab-note">這份教學全部在你的瀏覽器裡執行，使用虛構的訂單資料。真實的 Agent 每一步由語言模型即時決定，這裡把典型的決策過程做成可以逐步播放的示範。</p>
    </>
  );
}

function ToolsStep() {
  const [selected, setSelected] = useState(TOOLS[0].name);
  const tool = getTool(selected);
  return (
    <>
      <Explain
        what={<>每個工具其實就是一段程式（通常是呼叫公司系統的 API），再加上一份給模型看的「說明書」：工具名稱、用途描述、需要哪些參數。模型看不到程式碼，只看得到這份說明書，並根據描述判斷什麼時候該用、參數該怎麼填。</>}
        analogy={<>像給新人一本「後台操作手冊」：每個按鈕叫什麼、什麼情況按、要填哪些欄位。手冊寫得含糊，新人就會按錯按鈕。</>}
        tip={<>工具描述的品質直接決定 Agent 的表現。描述要寫清楚「何時該用、何時不該用、找不到時會回傳什麼」；高風險工具（退款、刪除、對外發信）要另外設權限，不能只靠描述提醒模型小心。</>}
      />
      <div className="agent-tools">
        <ul className="agent-tool-list" aria-label="工具清單">
          {TOOLS.map((item) => (
            <li key={item.name}>
              <button type="button" aria-pressed={item.name === selected} onClick={() => setSelected(item.name)}>
                <span className={`agent-risk ${item.risk}`} aria-hidden="true" />
                <b>{item.label}</b>
                <code>{item.name}</code>
                <small>{RISK_LABEL[item.risk]}</small>
              </button>
            </li>
          ))}
        </ul>
        <div className="agent-tool-detail">
          <p className="agent-tool-desc"><b>{tool.label}</b>{tool.description}</p>
          <p className="agent-tool-caption">模型實際看到的工具定義（JSON Schema）：</p>
          <pre className="agent-json" key={tool.name}>{JSON.stringify(toolSchema(tool), null, 2)}</pre>
        </div>
      </div>
      <p className="lab-note">所有工具的定義在每一輪都會一起送給模型，所以工具越多，每一輪的 token 也越多，模型選錯工具的機率也會上升。實務上一個 Agent 通常只給完成任務必要的少數工具。</p>
    </>
  );
}

// 逐步播放執行過程；遇到等待核准時停下，由使用者按核准或拒絕
function Player({ events, decisions, onDecide, autoplay = false }: { events: AgentEvent[]; decisions: Record<string, Decision>; onDecide?: (tool: string, decision: Decision) => void; autoplay?: boolean }) {
  const [cursor, setCursor] = useState(2);
  const [playing, setPlaying] = useState(autoplay);
  const traceRef = useRef<HTMLOListElement>(null);
  const visible = events.slice(0, cursor);
  const last = visible.at(-1);
  const waiting = last?.type === "approval" && !decisions[last.tool];
  const done = cursor >= events.length && !waiting;

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setCursor((value) => {
      const previous = events[value - 1];
      const blocked = previous?.type === "approval" && !decisions[previous.tool];
      return value >= events.length || blocked ? value : value + 1;
    }), 1100);
    return () => window.clearInterval(timer);
  }, [playing, events, decisions]);

  // 只捲動過程框本身，讓最新一步保持在畫面內
  useEffect(() => {
    const trace = traceRef.current;
    if (trace) trace.scrollTo({ top: trace.scrollHeight, behavior: "smooth" });
  }, [cursor, decisions]);

  // 播到盡頭或停在核准關卡時暫停
  const atEnd = cursor >= events.length;
  const effectivePlaying = playing && !atEnd;
  const rounds = visible.filter((event) => event.type === "think").length;
  const phase = !last ? "" : last.type === "think" ? "think" : last.type === "result" ? "observe" : last.type === "answer" ? "answer" : last.type === "limit" ? "stop" : last.type === "user" ? "" : "act";

  return (
    <div className="agent-player">
      <div className="agent-loop" aria-label="決策迴圈目前階段">
        <span className={phase === "think" ? "on" : undefined}>思考</span>
        <i aria-hidden="true">→</i>
        <span className={phase === "act" ? "on" : undefined}>行動</span>
        <i aria-hidden="true">→</i>
        <span className={phase === "observe" ? "on" : undefined}>觀察</span>
        <i aria-hidden="true" className="back">↺</i>
        <span className={`exit${phase === "answer" ? " on" : ""}${phase === "stop" ? " stop" : ""}`}>{phase === "stop" ? "強制停止" : "回答"}</span>
        <b>第 {rounds} 輪</b>
      </div>
      <ol className="agent-trace" ref={traceRef} aria-live="polite">
        {visible.map((event, index) => <EventCard key={index} event={event} decision={event.type === "approval" ? decisions[event.tool] : undefined} onDecide={onDecide} />)}
      </ol>
      <div className="agent-controls">
        <button type="button" className="button primary" onClick={() => setCursor(cursor + 1)} disabled={atEnd || waiting}>下一個動作 <span>→</span></button>
        <button type="button" className="button secondary" onClick={() => setPlaying(!effectivePlaying)} disabled={atEnd || waiting}>{effectivePlaying ? "暫停" : "自動播放"}</button>
        <button type="button" className="button secondary" onClick={() => { setPlaying(false); setCursor(events.length); }} disabled={atEnd || waiting}>全部顯示</button>
        <button type="button" className="lab-link" onClick={() => { setPlaying(false); setCursor(2); }}>從頭播放</button>
        {waiting && <span className="agent-wait">⏸ 等待人工核准，請在上方卡片按「核准」或「拒絕」</span>}
        {done && <span className="agent-done">✓ 播放完畢</span>}
      </div>
    </div>
  );
}

function EventCard({ event, decision, onDecide }: { event: AgentEvent; decision?: Decision; onDecide?: (tool: string, decision: Decision) => void }) {
  switch (event.type) {
    case "user":
      return <li className="agent-event user"><p className="lab-bubble user">{event.text}</p></li>;
    case "think":
      return <li className="agent-event think"><span className="agent-tag">思考</span><p>{event.text}</p></li>;
    case "call": {
      const tool = getTool(event.tool);
      return (
        <li className="agent-event call">
          <span className="agent-tag">呼叫工具</span>
          <p><span className={`agent-risk ${tool.risk}`} aria-hidden="true" /><b>{tool.label}</b><code>{event.tool}({JSON.stringify(event.args)})</code></p>
        </li>
      );
    }
    case "result":
      return (
        <li className={`agent-event result ${event.ok ? "ok" : "fail"}`}>
          <span className="agent-tag">{event.ok ? "工具回傳" : "工具回傳錯誤"}</span>
          <pre className="agent-json">{JSON.stringify(event.data, null, 2)}</pre>
        </li>
      );
    case "approval":
      return (
        <li className={`agent-event approval${decision ? ` ${decision}` : ""}`}>
          <span className="agent-tag">需要人工核准</span>
          <p><b>{event.summary}</b>Agent 想執行「{getTool(event.tool).label}」，依權限設定必須先由人確認。</p>
          {decision ? (
            <p className="agent-decision">{decision === "approve" ? "✓ 已核准，繼續執行" : "✕ 已拒絕，Agent 會收到「被拒絕」的結果"}</p>
          ) : onDecide && (
            <div className="agent-approval-actions">
              <button type="button" className="button primary" onClick={() => onDecide(event.tool, "approve")}>核准 <span>✓</span></button>
              <button type="button" className="button secondary" onClick={() => onDecide(event.tool, "reject")}>拒絕</button>
            </div>
          )}
        </li>
      );
    case "blocked":
      return <li className="agent-event blocked"><span className="agent-tag">已被權限擋下</span><p>「{getTool(event.tool).label}」在權限設定中為「禁止使用」，這次呼叫不會執行。</p></li>;
    case "answer":
      return <li className="agent-event answer"><p className="lab-bubble ai found"><span className="lab-speaker">✦ AI 回覆</span>{event.text}</p></li>;
    case "limit":
      return <li className="agent-event limit"><span className="agent-tag">達到回合上限</span><p>已執行 {event.rounds} 輪仍未完成，程式強制停止迴圈，改回覆「系統暫時無法查詢，已轉交真人客服」。</p></li>;
  }
}


const baseOptions = (overrides: Partial<RunOptions> = {}): RunOptions => ({ permissions: DEFAULT_PERMISSIONS, decisions: {}, maxRounds: 20, ...overrides });

const SHIPPING_EVENTS = SCENARIOS.shipping.build(baseOptions()).events;
const RETRY_EVENTS = SCENARIOS.retry.build(baseOptions()).events;
const NO_DECISIONS: Record<string, Decision> = {};

function LoopStep() {
  const events = SHIPPING_EVENTS;
  return (
    <>
      <Explain
        what={<>Agent 的核心是一個迴圈：模型先「思考」現在缺什麼資訊，決定呼叫哪個工具（行動），程式實際執行工具並把結果交回模型（觀察），模型再根據結果決定下一步。重複這個過程，直到模型判斷資訊足夠，才寫出最後的回答。</>}
        analogy={<>像客服專員接到電話：先查訂單系統、再查庫存系統，兩邊資料都拿到了，才回覆客人。每查一次就是一輪。</>}
        tip={<>模型本身並不會真的執行任何東西，它只是「說出」想呼叫哪個工具與參數；真正執行的是你的程式。所以權限控管、記錄與錯誤處理，都能在程式這一層做，不必完全信任模型。</>}
      />
      <Player events={events} decisions={NO_DECISIONS} />
      <p className="lab-note">按「下一個動作」一步步看，或用「自動播放」。這個問題包含兩件事，所以 Agent 用了兩個工具、跑了三輪。</p>
    </>
  );
}

function RetryStep() {
  const events = RETRY_EVENTS;
  return (
    <>
      <Explain
        what={<>真實世界的工具常常會失敗：查無資料、系統逾時、參數錯誤。好的 Agent 會讀懂錯誤訊息並換方法，例如換一個搜尋條件；更重要的是，遇到不確定的情況要「回頭問人」，而不是自己猜一個答案。</>}
        tip={<>工具的回傳內容要設計得讓模型看得懂：與其只回「錯誤 500」，不如回「訂單系統逾時，請稍後再試」或「查無此客戶，可改用電話號碼搜尋」。清楚的錯誤訊息，能大幅減少 Agent 亂猜。</>}
      />
      <Player events={events} decisions={NO_DECISIONS} />
      <p className="lab-note">注意第三輪：搜尋結果是「王曉明」而不是「王小明」。Agent 沒有直接當成同一人處理，而是請使用者確認。這種「不確定就問」的行為，可以在系統規則裡明確要求。</p>
    </>
  );
}

const PERMISSION_LABEL: Record<Permission, string> = { auto: "自動執行", approve: "需人工核准", deny: "禁止使用" };

function ApprovalStep() {
  const [permissions, setPermissions] = useState(DEFAULT_PERMISSIONS);
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});
  const events = useMemo(() => SCENARIOS.refund.build(baseOptions({ permissions, decisions })).events, [permissions, decisions]);
  const setPermission = (tool: string, value: Permission) => {
    setPermissions({ ...permissions, [tool]: value });
    setDecisions({});
  };
  return (
    <>
      <Explain
        what={<>Agent 能動手做事，也就可能做錯事。常見的做法是依風險分級設定權限：查詢類工具自動執行；對外寄信、退款、修改資料這類動作，執行前先暫停，交給人按「核准」；完全不該讓 AI 碰的功能，乾脆不給或設為禁止。</>}
        analogy={<>像公司的簽核制度：專員可以自己查資料，但退款要主管簽名。AI 再聰明，也應該走同一套流程。</>}
        tip={<>被拒絕或被擋下時，Agent 不應該卡住或繞路硬做，而是要能「優雅降級」：說明情況、轉交真人並附上已確認的資訊。試著把「建立退款」改成「禁止使用」或在核准時按「拒絕」，看看 Agent 怎麼收尾。</>}
      />
      <div className="agent-perms" aria-label="工具權限設定">
        {(["create_refund", "send_email"] as const).map((name) => {
          const tool = getTool(name);
          return (
            <div key={name} className="agent-perm">
              <p><span className={`agent-risk ${tool.risk}`} aria-hidden="true" /><b>{tool.label}</b><small>{RISK_LABEL[tool.risk]}</small></p>
              <div className="lab-segment" role="radiogroup" aria-label={`${tool.label}的權限`}>
                {(["auto", "approve", "deny"] as const).map((value) => (
                  <button key={value} type="button" role="radio" aria-checked={permissions[name] === value} onClick={() => setPermission(name, value)}>{PERMISSION_LABEL[value]}</button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <Player key={JSON.stringify(permissions)} events={events} decisions={decisions} onDecide={(tool, decision) => setDecisions({ ...decisions, [tool]: decision })} />
    </>
  );
}

function LimitStep() {
  const [maxRounds, setMaxRounds] = useState(3);
  const [unlimited, setUnlimited] = useState(false);
  const limit = unlimited ? 12 : maxRounds;
  const events = useMemo(() => SCENARIOS.timeout.build(baseOptions({ maxRounds: limit })).events, [limit]);
  const rounds = roundTokens(events);
  const totalInput = rounds.reduce((sum, round) => sum + round.input, 0);
  const totalOutput = rounds.reduce((sum, round) => sum + round.output, 0);
  const max = Math.max(...rounds.map((round) => round.input));
  return (
    <>
      <Explain
        what={<>Agent 每跑一輪，都要把系統規則、全部工具定義和到目前為止的完整過程重新送給模型一次（上一課提到的上下文）。所以輪數越多，每一輪越貴，總花費會越滾越大。如果工具一直失敗、模型又一直重試，沒有上限就會無止境地燒錢。</>}
        tip={<>一定要在程式裡設定「最多幾輪」與「同一個錯誤最多重試幾次」，達到上限就停止並轉交真人；同時記錄每一輪的工具呼叫，方便事後檢查 Agent 為什麼這樣做。</>}
      />
      <div className="lab-controls">
        <label className="lab-range">
          <span>回合上限 <b>{unlimited ? "不設上限" : `${maxRounds} 輪`}</b></span>
          <input type="range" min={2} max={8} value={maxRounds} disabled={unlimited} onChange={(event) => setMaxRounds(Number(event.target.value))} />
        </label>
        <label className="lab-switch"><input type="checkbox" checked={unlimited} onChange={(event) => setUnlimited(event.target.checked)} />不設上限（示範到第 12 輪為止）</label>
      </div>
      <figure className="agent-rounds">
        <figcaption>整段跑完時，每一輪送給模型的輸入 token（系統規則＋工具定義＋目前為止的過程）</figcaption>
        <ol>
          {rounds.map((round, index) => (
            <li key={index}>
              <span>第 {index + 1} 輪</span>
              <div><i style={{ width: `${(round.input / max) * 100}%` }} /></div>
              <b>{fmt(round.input)}</b>
            </li>
          ))}
        </ol>
        <p>合計輸入 {fmt(totalInput)} token、輸出 {fmt(totalOutput)} token，這一次對話約 NT$ {costPerCall(totalInput, totalOutput, DEFAULT_PRICING).toFixed(2)}（以上一課的示意價格計算）。{unlimited && <strong> 沒有上限時，這筆錢換來的只是 12 次失敗的重試。</strong>}</p>
      </figure>
      <Player key={limit} events={events} decisions={NO_DECISIONS} />
      <div className="agent-fit">
        <div className="good">
          <p>適合交給 Agent</p>
          <ul>
            <li>查詢與彙整：訂單、庫存、報表、跨系統比對</li>
            <li>規則清楚、結果可以核對的例行流程</li>
            <li>產生草稿，交給人確認後再送出</li>
          </ul>
        </div>
        <div className="care">
          <p>要人工把關或不要交給 Agent</p>
          <ul>
            <li>動到錢、對外發送、刪除或修改重要資料</li>
            <li>涉及法律責任、合約承諾的決定</li>
            <li>規則模糊、需要情緒判斷或例外處理的客訴</li>
          </ul>
        </div>
      </div>
      <Recap
        items={[
          ["工具", "決定 Agent 能做什麼，模型只看得到工具的名稱、描述與參數。"],
          ["決策迴圈", "反覆「思考、行動、觀察」，每一輪都由程式實際執行工具。"],
          ["出錯處理", "清楚的錯誤訊息讓 Agent 能換方法；不確定時要回頭問人。"],
          ["權限與核准", "依風險分級，高風險動作先暫停等人核准，被拒絕時要能優雅轉交。"],
          ["回合上限", "每一輪都重送完整上下文，沒有上限就可能無止境地燒錢。"],
        ]}
        conclusion="導入 Agent 的關鍵不是模型多聰明，而是工具、權限與失敗處理設計得是否周全。"
      />
    </>
  );
}
