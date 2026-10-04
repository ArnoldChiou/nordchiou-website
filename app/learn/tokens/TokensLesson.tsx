"use client";

import { useEffect, useMemo, useState } from "react";
import { Explain, LabShell, Recap } from "../LabShell";
import {
  type BpeState, type ContextItem, type Pricing, type Strategy, CORPORA, DEFAULT_PRICING, DOCS, OUTPUT_RESERVE, RAG_DOC_TOKENS,
  SAMPLES, SUMMARY_TOKENS, SYSTEM_TOKENS, TURN_TOKENS, WINDOWS, bestPair, costPerCall, initBpe, mergeStep, pack, tokenId, tokenize, totalTokens,
} from "./tokens-data";

const STEPS = [
  { short: "總覽", title: "AI 讀的不是字，是 token" },
  { short: "切成 token", title: "一段文字會被切成幾個 token？" },
  { short: "詞表", title: "切法是怎麼學出來的（BPE）" },
  { short: "上下文視窗", title: "AI 一次能讀多少：上下文視窗" },
  { short: "塞滿了", title: "超過上限時會發生什麼事？" },
  { short: "算成本", title: "token 怎麼變成你的帳單" },
];

const TOKEN_COLORS = ["lime", "blue", "amber", "violet"];
const fmt = (value: number) => value.toLocaleString("zh-TW");

const FIRST_TURN: ContextItem = { id: 1, kind: "turn", label: "第 1 輪：「我叫小陳，負責採購」", tokens: TURN_TOKENS, hasName: true };

export default function TokensLesson() {
  const [items, setItems] = useState<ContextItem[]>([FIRST_TURN, ...turns(2, 4)]);
  const [windowSize, setWindowSize] = useState(WINDOWS[0].size);
  const [strategy, setStrategy] = useState<Strategy>("drop");
  const [useRag, setUseRag] = useState(false);

  return (
    <LabShell label="Token 與上下文視窗互動教學" steps={STEPS} restartStep={3} restartLabel="回到上下文視窗再試">
      {(step, go) => (
        <>
          {step === 0 && <Overview onJump={go} />}
          {step === 1 && <TokenizeStep />}
          {step === 2 && <BpeStep />}
          {step === 3 && <WindowStep items={items} setItems={setItems} windowSize={windowSize} setWindowSize={setWindowSize} />}
          {step === 4 && <OverflowStep items={items} setItems={setItems} windowSize={windowSize} setWindowSize={setWindowSize} strategy={strategy} setStrategy={setStrategy} useRag={useRag} setUseRag={setUseRag} />}
          {step === 5 && <CostStep />}
        </>
      )}
    </LabShell>
  );
}

function turns(from: number, count: number): ContextItem[] {
  return Array.from({ length: count }, (_, index) => ({ id: from + index, kind: "turn", label: `第 ${from + index} 輪對話`, tokens: TURN_TOKENS }));
}

function Overview({ onJump }: { onJump: (step: number) => void }) {
  const cards = [
    [1, "token 數", "同一段話，中文、英文、數字被切成的 token 數不一樣。"],
    [3, "上下文視窗", "模型一次最多能讀幾個 token，超過就得捨棄或另想辦法。"],
    [5, "每百萬 token 價格", "API 按 token 計費，讀進去和寫出來的價格不同。"],
  ] as const;
  return (
    <>
      <Explain
        what={<>語言模型不是一個字一個字讀，而是先把文字切成一塊塊的「token」（詞元），再把每個 token 換成編號來處理。token 可能是一個完整的英文單字、半個單字、一個中文字、一個常見中文詞，或是一個標點符號。導入 AI 時有三個跟 token 有關的數字一定會遇到：</>}
        analogy={<>token 就像搬家公司用的「標準箱」。東西（文字）要先裝箱才能上車；卡車（上下文視窗）有容量上限，運費（API 費用）也按箱數算。</>}
      />
      <div className="lab-cards">
        {cards.map(([target, name, text], index) => (
          <button key={name} type="button" onClick={() => onJump(target)} style={{ animationDelay: `${index * 120}ms` }}>
            <b>{name}</b><span>{text}</span><small>前往第 {target} 步 →</small>
          </button>
        ))}
      </div>
      <p className="lab-note">這份教學全部在你的瀏覽器裡執行，不會傳送任何資料。分詞與價格為教學用的示意值，實際數字依各家模型而不同。</p>
    </>
  );
}

function TokenizeStep() {
  const [text, setText] = useState(SAMPLES[0].text);
  const [showIds, setShowIds] = useState(false);
  const tokens = useMemo(() => tokenize(text), [text]);
  const chars = [...text].length;
  return (
    <>
      <Explain
        what={<>模型內建一份「詞表」（vocabulary），通常有 10 萬到 20 萬個詞彙。分詞器（tokenizer）會盡量用詞表裡最長的片段去對應文字：常見的英文單字是 1 個 token，少見的長單字會拆成好幾段；中文大多一字一個 token，常見詞可能合成一個；表情符號這類罕見字元則可能被拆成 2–3 個碎片。</>}
        tip={<>同樣意思的內容，不同語言、不同模型切出的 token 數可能差很多，也就代表費用和可放入的內容量不同。評估成本時，請用自己的實際文件、在目標模型上實測。</>}
      />
      <div className="lab-chips">
        {SAMPLES.map((sample) => (
          <button key={sample.label} type="button" aria-pressed={sample.text === text} onClick={() => setText(sample.text)}>{sample.label}</button>
        ))}
      </div>
      <label className="lab-textarea">
        <span>也可以直接修改文字：</span>
        <textarea value={text} onChange={(event) => setText(event.target.value)} rows={3} maxLength={400} />
      </label>
      <div className="lab-stats">
        <div><strong>{chars}</strong><span>個字元</span></div>
        <div className="ok"><strong>{tokens.length}</strong><span>個 token</span></div>
        <div><strong>{tokens.length ? (chars / tokens.length).toFixed(1) : "0"}</strong><span>平均每個 token 幾個字元</span></div>
      </div>
      <div className="lab-tokens-head">
        <p>切好的 token（每個色塊是一個 token）</p>
        <label className="lab-switch"><input type="checkbox" checked={showIds} onChange={(event) => setShowIds(event.target.checked)} />顯示編號</label>
      </div>
      <div className="lab-tokens" aria-label="分詞結果">
        {tokens.map((token, index) => (
          <span key={`${index}-${token.text}`} className={`lab-token ${token.kind === "byte" ? "byte" : TOKEN_COLORS[index % TOKEN_COLORS.length]}`} style={{ animationDelay: `${Math.min(index, 40) * 25}ms` }}>
            {token.text.replace(/ /g, "␣").replace(/\n/g, "↵")}
            {showIds && <small>{tokenId(token.text)}</small>}
          </span>
        ))}
      </div>
      <p className="lab-note">␣ 代表空白，空白也會占用 token；灰色虛線框是被拆成位元組碎片的罕見字元。打開「顯示編號」就能看到模型實際處理的東西：它看到的只是一串數字（此處編號為示意）。</p>
    </>
  );
}

function BpeStep() {
  const [corpusIndex, setCorpusIndex] = useState(0);
  const [state, setState] = useState<BpeState>(() => initBpe(CORPORA[0]));
  const [playing, setPlaying] = useState(false);
  const next = bestPair(state);
  const start = totalTokens(initBpe(CORPORA[corpusIndex]));

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setState((current) => {
      if (!bestPair(current)) {
        setPlaying(false);
        return current;
      }
      return mergeStep(current);
    }), 900);
    return () => window.clearInterval(timer);
  }, [playing]);

  const reset = (index: number) => {
    setPlaying(false);
    setCorpusIndex(index);
    setState(initBpe(CORPORA[index]));
  };

  return (
    <>
      <Explain
        what={<>詞表不是人工編的，而是用大量文字「統計」出來的，最常見的方法叫 BPE（Byte Pair Encoding，位元組對編碼）。做法很單純：一開始每個字元各自是一個 token，接著反覆找出「最常相鄰出現的兩個片段」，把它們合併成一個新詞彙，直到詞表夠大為止。</>}
        analogy={<>像整理倉庫：一開始每個零件分開放；發現「螺絲」和「螺帽」總是一起拿，就先把它們包成一組。常一起出現的東西越包越大，最後最常用的整套直接一次拿走。</>}
        tip={<>這解釋了為什麼訓練資料以英文為主的模型，處理中文常常比較「貴」：中文詞組在訓練資料裡出現得少，被合併的機會也少，同樣的意思就要用更多 token。</>}
      />
      <div className="lab-controls">
        <div className="lab-segment" role="radiogroup" aria-label="範例語料">
          {CORPORA.map((corpus, index) => (
            <button key={corpus.label} type="button" role="radio" aria-checked={index === corpusIndex} onClick={() => reset(index)}>{corpus.label}</button>
          ))}
        </div>
        <button type="button" className="button primary" onClick={() => setState(mergeStep)} disabled={!next || playing}>合併一次 <span>+</span></button>
        <button type="button" className="button secondary" onClick={() => setPlaying(!playing)} disabled={!next}>{playing ? "暫停" : "自動播放"}</button>
        <button type="button" className="button secondary" onClick={() => reset(corpusIndex)}>重來</button>
      </div>
      <div className="lab-bpe">
        <div>
          <p className="lab-bpe-next">
            {next ? <>下一個要合併：<b>{next.pair[0]}</b> + <b>{next.pair[1]}</b> → <b className="new">{next.pair.join("")}</b>（一起出現 {next.count} 次）</> : "已經沒有重複出現兩次以上的組合，詞表學習完成。"}
          </p>
          <ul className="lab-bpe-words" aria-label="語料目前的切法">
            {state.words.map(({ symbols, count }, wordIndex) => (
              <li key={wordIndex}>
                <span className="lab-bpe-pieces">
                  {symbols.map((symbol, index) => <span key={`${index}-${symbol}`} className={`lab-token ${TOKEN_COLORS[(symbol.length - 1) % TOKEN_COLORS.length]}`}>{symbol}</span>)}
                </span>
                <small>× {count} 次 ＝ {symbols.length * count} 個 token</small>
              </li>
            ))}
          </ul>
          <div className="lab-meter">
            <span>整份語料的 token 數</span>
            <div><i style={{ width: `${(totalTokens(state) / start) * 100}%` }} /></div>
            <b>{totalTokens(state)} / {start}</b>
          </div>
        </div>
        <div className="lab-bpe-vocab">
          <p>學到的新詞彙（{state.merges.length}）</p>
          {state.merges.length === 0 ? <small>按「合併一次」開始</small> : (
            <ol>{state.merges.map(({ pair, count }) => <li key={pair.join("")}><b>{pair.join("")}</b><small>{pair[0]} + {pair[1]}・{count} 次</small></li>)}</ol>
          )}
        </div>
      </div>
      <p className="lab-note">真實的 BPE 從「位元組」開始合併，所以一個中文字（UTF-8 編碼為 3 個位元組）要先合併成一個字，才有機會再合併成詞。這裡為了好懂，直接從字元開始。</p>
    </>
  );
}

type WindowProps = { items: ContextItem[]; setItems: (items: ContextItem[]) => void; windowSize: number; setWindowSize: (size: number) => void };

function ContextControls({ items, setItems, windowSize, setWindowSize }: WindowProps) {
  const nextId = Math.max(0, ...items.map((item) => item.id)) + 1;
  const turnCount = items.filter((item) => item.kind === "turn").length;
  return (
    <div className="lab-controls">
      <div className="lab-segment" role="radiogroup" aria-label="上下文視窗大小">
        {WINDOWS.map((option) => (
          <button key={option.label} type="button" role="radio" aria-checked={option.size === windowSize} onClick={() => setWindowSize(option.size)} title={option.note}>{option.label}</button>
        ))}
      </div>
      <button type="button" className="button secondary" onClick={() => setItems([...items, ...turns(turnCount + 1, 5).map((item, index) => ({ ...item, id: nextId + index }))])}>再聊 5 輪</button>
      {DOCS.map((doc, index) => (
        <button key={doc.label} type="button" className="button secondary" onClick={() => setItems([...items, { id: nextId, kind: "doc", label: doc.label, tokens: doc.tokens }])}>放入{index === 0 ? "合約" : "手冊"}</button>
      ))}
      <button type="button" className="lab-link" onClick={() => setItems([FIRST_TURN, ...turns(2, 4)])}>清空重來</button>
    </div>
  );
}

function WindowStep(props: WindowProps) {
  const { items, windowSize } = props;
  const used = SYSTEM_TOKENS + items.reduce((sum, item) => sum + item.tokens, 0);
  const free = windowSize - used - OUTPUT_RESERVE;
  return (
    <>
      <Explain
        what={<>上下文視窗（context window）是模型「一次」能處理的 token 上限，而且是輸入加輸出一起算：系統規則、之前的每一輪對話、你貼進去的文件，加上模型準備要寫的回答，全部都要擠進同一個視窗。模型本身不會記得上一次對話，每次提問時，聊天程式都會把整段歷史重新送一次。</>}
        analogy={<>像一張辦公桌：桌面大小固定，所有要參考的文件都得攤在桌上才看得到。桌子越大能放越多，但東西攤得越多，找重點也越吃力。</>}
        tip={<>視窗大不代表讀得好。研究發現，長內容「中間」的資訊比開頭和結尾更容易被忽略（lost in the middle）。重要的規則與資料，放在開頭或結尾比較保險。</>}
      />
      <ContextControls {...props} />
      <ContextBar items={items} windowSize={windowSize} />
      <div className="lab-stats">
        <div><strong>{fmt(used)}</strong><span>已使用 token</span></div>
        <div><strong>{fmt(OUTPUT_RESERVE)}</strong><span>預留給回答</span></div>
        <div className={free < 0 ? "warn" : "ok"}><strong>{fmt(free)}</strong><span>{free < 0 ? "已超出上限" : "剩餘空間"}</span></div>
      </div>
      <p className="lab-note">試試看：在 8K 視窗多按幾次「再聊 5 輪」，或放入一份合約；再切到 128K、1M 比較。300 頁的員工手冊約 24 萬 token，連 128K 都放不下。</p>
    </>
  );
}

function ContextBar({ items, windowSize, dropped = [], summary = 0 }: { items: ContextItem[]; windowSize: number; dropped?: ContextItem[]; summary?: number }) {
  const total = SYSTEM_TOKENS + summary + items.reduce((sum, item) => sum + item.tokens, 0) + OUTPUT_RESERVE;
  const scale = Math.max(windowSize, total);
  const width = (tokens: number) => `max(${(tokens / scale) * 100}%, 3px)`;
  return (
    <figure className="lab-context">
      <div className="lab-context-track">
        <span className="lab-context-limit" style={{ left: `${(windowSize / scale) * 100}%` }}><small>上限 {fmt(windowSize)}</small></span>
        {total > windowSize && <span className="lab-context-over" style={{ left: `${(windowSize / scale) * 100}%` }} title={`超出 ${fmt(total - windowSize)} token`} />}
        <div className="lab-context-fill">
          <i className="system" style={{ width: width(SYSTEM_TOKENS) }} title={`系統規則 ${fmt(SYSTEM_TOKENS)} token`} />
          {summary > 0 && <i className="summary" style={{ width: width(summary) }} title={`舊對話摘要 ${fmt(summary)} token`} />}
          {items.map((item) => (
            <i key={item.id} className={`${item.kind}${item.hasName ? " name" : ""}`} style={{ width: width(item.tokens) }} title={`${item.label} ${fmt(item.tokens)} token`} />
          ))}
          <i className="reserve" style={{ width: width(OUTPUT_RESERVE) }} title={`預留回答 ${fmt(OUTPUT_RESERVE)} token`} />
        </div>
      </div>
      {dropped.length > 0 && (
        <p className="lab-context-dropped">已被移出視窗：{dropped.map((item) => <span key={item.id} className={item.hasName ? "name" : undefined}>{item.label}</span>)}</p>
      )}
      <figcaption className="lab-legend">
        <i className="system" />系統規則
        <i className="turn" />對話
        <i className="name" />含名字的那一輪
        <i className="doc" />文件
        {summary > 0 && <><i className="summary" />舊對話摘要</>}
        <i className="reserve" />預留回答
      </figcaption>
    </figure>
  );
}

function OverflowStep({ strategy, setStrategy, useRag, setUseRag, ...props }: WindowProps & { strategy: Strategy; setStrategy: (value: Strategy) => void; useRag: boolean; setUseRag: (value: boolean) => void }) {
  const result = pack(props.items, props.windowSize, strategy, useRag);
  const full = SYSTEM_TOKENS + props.items.reduce((sum, item) => sum + item.tokens, 0) + OUTPUT_RESERVE > props.windowSize;
  const strategies: [Strategy, string, string][] = [
    ["drop", "丟掉最舊的內容", "最常見的做法，簡單但會「失憶」"],
    ["summarize", "把舊對話壓成摘要", "保留重點，但細節會流失"],
    ["error", "直接回報錯誤", "API 的預設行為，由程式自行處理"],
  ];
  const answer = result.overflow ? "（錯誤：輸入超過模型的上下文上限，請求被拒絕）" : result.rememberName ? "你叫小陳，負責採購。" : "抱歉，我不知道你的名字。可以再告訴我一次嗎？";
  return (
    <>
      <Explain
        what={<>內容超過上下文視窗時，模型本身不會自動處理，要由應用程式決定怎麼辦。下面用同一段對話比較三種常見策略。第 1 輪對話裡，使用者說了自己的名字；看看哪一種策略下，AI 還記得。</>}
        tip={<>企業應用中，文件通常不該整份塞進對話，而是用上一課的 RAG 只放入相關段落。打開下方的「用 RAG 只放相關段落」，看看空間差多少。</>}
      />
      <ContextControls {...props} />
      <div className="lab-strategies" role="radiogroup" aria-label="超過上限時的處理策略">
        {strategies.map(([value, name, hint]) => (
          <button key={value} type="button" role="radio" aria-checked={strategy === value} onClick={() => setStrategy(value)}><b>{name}</b><small>{hint}</small></button>
        ))}
      </div>
      <label className="lab-switch"><input type="checkbox" checked={useRag} onChange={(event) => setUseRag(event.target.checked)} />用 RAG 只放相關段落（每份文件改為約 {fmt(RAG_DOC_TOKENS)} token）</label>
      <ContextBar items={result.kept} windowSize={props.windowSize} dropped={result.dropped} summary={result.summary} />
      {!full && !useRag && <p className="lab-warn">目前還沒超過上限。先多按幾次「再聊 5 輪」或放入文件，把視窗塞滿。</p>}
      <div className="lab-chat">
        <p className="lab-bubble user">我叫什麼名字？</p>
        <p className={`lab-bubble ai ${result.overflow || !result.rememberName ? "missing" : "found"}`}><span className="lab-speaker">✦ AI 回覆</span>{answer}</p>
      </div>
      {strategy === "summarize" && result.summary > 0 && <p className="lab-note">摘要占 {fmt(SUMMARY_TOKENS)} token，記住了「小陳、負責採購」這類重點；但若被移出的是整份文件，摘要裝不下條款細節，仍需要 RAG 回頭查原文。</p>}
    </>
  );
}

function CostStep() {
  const [pricing, setPricing] = useState<Pricing>(DEFAULT_PRICING);
  const [people, setPeople] = useState(50);
  const [perDay, setPerDay] = useState(5);
  const [outputTokens, setOutputTokens] = useState(500);
  const calls = people * perDay * 22;
  const scenarios = [
    { name: "每次都把整本手冊塞進去", input: SYSTEM_TOKENS + 240_000 + 50 },
    { name: "用 RAG 只放 3 個相關段落", input: SYSTEM_TOKENS + RAG_DOC_TOKENS + 50 },
  ].map((item) => ({ ...item, perCall: costPerCall(item.input, outputTokens, pricing) }));
  const max = Math.max(...scenarios.map((item) => item.perCall * calls));
  const price = (key: keyof Pricing) => (
    <input type="number" min={0} step="any" value={pricing[key]} onChange={(event) => setPricing({ ...pricing, [key]: Math.max(0, Number(event.target.value)) })} />
  );
  return (
    <>
      <Explain
        what={<>雲端模型的 API 按 token 計費，而且分兩種價格：讀進去的「輸入 token」，和模型寫出來的「輸出 token」，輸出通常貴好幾倍。報價單上常見的單位是「每百萬 token 多少美元」。因為每次提問都會重送整段內容，放進提示的東西越多，每一次問答都越貴。</>}
        tip={<>除了 RAG，「提示快取」（prompt caching）也能大幅降低重複內容的費用：固定不變的規則與文件放在提示開頭，重複送出時只收較低的快取價格。內容越長，回應速度也越慢，這也是要控制 token 的原因。</>}
      />
      <div className="lab-cost-form">
        <label className="lab-range"><span>使用人數 <b>{people} 人</b></span><input type="range" min={5} max={500} step={5} value={people} onChange={(event) => setPeople(Number(event.target.value))} /></label>
        <label className="lab-range"><span>每人每天提問 <b>{perDay} 次</b></span><input type="range" min={1} max={30} value={perDay} onChange={(event) => setPerDay(Number(event.target.value))} /></label>
        <label className="lab-range"><span>每次回答長度 <b>{fmt(outputTokens)} token</b></span><input type="range" min={100} max={3000} step={100} value={outputTokens} onChange={(event) => setOutputTokens(Number(event.target.value))} /></label>
        <div className="lab-prices">
          <label>輸入價格<span>US$ {price("input")} / 百萬 token</span></label>
          <label>輸出價格<span>US$ {price("output")} / 百萬 token</span></label>
          <label>匯率<span>1 美元 = {price("fx")} 元</span></label>
        </div>
      </div>
      <div className="lab-cost">
        {scenarios.map((item) => (
          <div key={item.name}>
            <p><b>{item.name}</b><small>每次輸入約 {fmt(item.input)} token</small></p>
            <div className="lab-cost-bar"><i style={{ width: `max(${(item.perCall * calls / max) * 100}%, 4px)` }} /></div>
            <p className="lab-cost-num">每次 NT$ {item.perCall.toFixed(2)}<strong>每月約 NT$ {fmt(Math.round(item.perCall * calls))}</strong></p>
          </div>
        ))}
      </div>
      <p className="lab-note">以每月 22 個工作天、共 {fmt(calls)} 次提問計算。預設價格為示意值，請改成你評估中的模型最新公告價格。</p>
      <Recap
        items={[
          ["token", "是模型處理文字的單位，中英文、數字、符號的切法都不同。"],
          ["詞表", "由 BPE 這類方法從大量文字統計而來，常見組合會變成一個 token。"],
          ["上下文視窗", "是輸入加輸出的總上限，每次提問都會重送整段歷史。"],
          ["超過上限", "時要由應用程式決定丟棄、摘要或報錯，選錯策略 AI 就會「失憶」。"],
          ["成本", "與每次放進提示的 token 數成正比，RAG 與提示快取是最直接的省錢方法。"],
        ]}
        conclusion="把對的資料、用最少的 token 放進視窗，是企業 AI 同時兼顧準確度與成本的關鍵。"
      />
    </>
  );
}
