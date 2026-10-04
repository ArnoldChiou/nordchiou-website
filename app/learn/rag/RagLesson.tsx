"use client";

import { useEffect, useMemo, useState } from "react";
import { Explain, LabShell, Recap } from "../LabShell";
import {
  type Chunk, type ChunkSettings, DIMENSIONS, PRESETS, SAMPLE_DOC, SAMPLE_TITLE, SYSTEM_PROMPT,
  bestSentence, chunkDocument, cosine, embed, isCutMidSentence, project,
} from "./rag-data";

const STEPS = [
  { short: "總覽", title: "RAG 的兩條流水線" },
  { short: "文件", title: "準備公司文件" },
  { short: "切塊", title: "把文件切成小段落（Chunking）" },
  { short: "向量化", title: "把文字變成一串數字（Embedding）" },
  { short: "提問", title: "使用者提問，問題也要向量化" },
  { short: "檢索", title: "找出意思最接近的段落（Retrieval）" },
  { short: "組合提示", title: "把段落和問題組成提示（Augmentation）" },
  { short: "生成", title: "語言模型根據資料回答（Generation）" },
];

const CHUNK_COLORS = ["lime", "blue", "amber", "violet"];
const chunkColor = (id: number) => CHUNK_COLORS[(id - 1) % CHUNK_COLORS.length];

type Ranked = { chunk: Chunk; score: number };

export default function RagLesson() {
  const [settings, setSettings] = useState<ChunkSettings>({ strategy: "fixed", size: 80, overlap: 16 });
  const [question, setQuestion] = useState(PRESETS[0].question);
  const [draft, setDraft] = useState("");
  const [topK, setTopK] = useState(3);
  const [selected, setSelected] = useState(1);

  const chunks = useMemo(() => chunkDocument(SAMPLE_DOC, settings), [settings]);
  const embedded = useMemo(() => chunks.map((chunk) => ({ chunk, ...embed(chunk.text) })), [chunks]);
  const query = useMemo(() => embed(question), [question]);
  const ranked: Ranked[] = useMemo(
    () => embedded.map(({ chunk, vector }) => ({ chunk, score: cosine(query.vector, vector) })).sort((a, b) => b.score - a.score),
    [embedded, query],
  );
  const retrieved = ranked.slice(0, topK);

  // 切塊設定改變後，原本選取的段落編號可能已不存在
  const selectedChunk = embedded.find(({ chunk }) => chunk.id === selected) ?? embedded[0];

  const ask = (text: string) => {
    const trimmed = text.trim();
    if (trimmed) setQuestion(trimmed);
  };

  return (
    <LabShell label="RAG 互動教學" steps={STEPS} restartStep={2} restartLabel="回到切塊，換個設定再試">
      {(step, go) => (
        <>
          {step === 0 && <Overview onJump={go} />}
          {step === 1 && <DocumentStep />}
          {step === 2 && <ChunkStep settings={settings} onChange={setSettings} chunks={chunks} />}
          {step === 3 && <EmbedStep embedded={embedded} selected={selectedChunk} onSelect={setSelected} />}
          {step === 4 && <QueryStep question={question} draft={draft} setDraft={setDraft} onAsk={ask} query={query} embedded={embedded} />}
          {step === 5 && <RetrieveStep question={question} query={query.vector} embedded={embedded} ranked={ranked} topK={topK} setTopK={setTopK} />}
          {step === 6 && <PromptStep question={question} retrieved={retrieved} />}
          {step === 7 && <AnswerStep question={question} query={query.vector} retrieved={retrieved} settings={settings} topK={topK} onJump={go} />}
        </>
      )}
    </LabShell>
  );
}

function Overview({ onJump }: { onJump: (step: number) => void }) {
  const offline = [[1, "文件", "PDF、Word、SOP"], [2, "切塊", "切成小段落"], [3, "向量化", "文字 → 數字"], [3, "向量資料庫", "存起來備查"]] as const;
  const online = [[4, "提問", "問題也向量化"], [5, "檢索", "找最相近段落"], [6, "組合提示", "段落 + 問題"], [7, "生成", "模型寫出答案"]] as const;
  return (
    <>
      <Explain
        what={<>RAG（Retrieval-Augmented Generation，檢索增強生成）是讓 AI「先查資料、再回答」的做法。語言模型本身不認識你公司的內部文件，所以我們先把文件整理成可以快速查找的形式；有人提問時，先找出相關段落，再連同問題一起交給模型回答。整個系統分成兩條流水線：</>}
        analogy={<>像是一位新進員工參加開卷考：考前先把手冊做好索引標籤（準備階段），考試時翻到相關頁面、照著內容作答並註明頁數（問答階段）。</>}
      />
      <div className="lab-pipelines">
        <Pipeline label="準備階段：事先做一次，文件更新時重做" items={offline} onJump={onJump} tone="ink" />
        <Pipeline label="問答階段：每次有人提問都會跑一次" items={online} onJump={onJump} tone="lime" />
      </div>
      <p className="lab-note">點任一個方塊可以直接跳到該步驟。這份教學全部在你的瀏覽器裡執行，用的是一份虛構的員工手冊，不會傳送任何資料。</p>
    </>
  );
}

function Pipeline({ label, items, onJump, tone }: { label: string; items: readonly (readonly [number, string, string])[]; onJump: (step: number) => void; tone: string }) {
  return (
    <div className={`lab-pipeline ${tone}`}>
      <p>{label}</p>
      <ol>
        {items.map(([target, name, hint], index) => (
          <li key={name} style={{ animationDelay: `${index * 120}ms` }}>
            <button type="button" onClick={() => onJump(target)}><b>{name}</b><small>{hint}</small></button>
          </li>
        ))}
      </ol>
    </div>
  );
}

function DocumentStep() {
  return (
    <>
      <Explain
        what={<>RAG 的原料是公司自己的文件：員工手冊、產品規格、合約、客服紀錄、SOP。這一步要把各種格式（PDF、Word、網頁、掃描檔）轉成乾淨的純文字，並記下每段文字來自哪份文件、哪一頁，之後回答時才能附上出處。</>}
        tip={<>文件品質決定答案品質。過期版本、重複的檔案、掃描檔辨識錯字，都會原封不動地變成錯誤答案。導入前先盤點「哪份才是最新版」，往往比調整模型更有效。</>}
      />
      <article className="lab-doc">
        <header><span aria-hidden="true">▤</span>{SAMPLE_TITLE}<small>{SAMPLE_DOC.length} 字</small></header>
        {SAMPLE_DOC.split("\n\n").map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </article>
    </>
  );
}

function ChunkStep({ settings, onChange, chunks }: { settings: ChunkSettings; onChange: (settings: ChunkSettings) => void; chunks: Chunk[] }) {
  const cut = chunks.filter((chunk) => isCutMidSentence(SAMPLE_DOC, chunk)).length;
  const fixed = settings.strategy === "fixed";
  return (
    <>
      <Explain
        what={<>整份文件太長，無法每次都塞給模型，而且檢索時需要「精準指出是哪一段」。所以要把文件切成一塊塊的小段落（chunk）。切多大、段落之間要不要重疊（overlap），會直接影響後面能不能找到答案。</>}
        analogy={<>像把一本書剪成索引卡。卡片太大，一張卡混了好幾個主題，很難判斷哪張最相關；卡片太小，一句話被剪成兩張，任何一張都看不懂。重疊就是讓相鄰卡片多抄幾個字，降低句子被剪斷的機率。</>}
      />

      <div className="lab-controls">
        <div className="lab-segment" role="radiogroup" aria-label="切塊方式">
          <button type="button" role="radio" aria-checked={fixed} onClick={() => onChange({ ...settings, strategy: "fixed" })}>固定字數切</button>
          <button type="button" role="radio" aria-checked={!fixed} onClick={() => onChange({ ...settings, strategy: "paragraph" })}>依段落切</button>
        </div>
        {fixed && (
          <>
            <label className="lab-range">
              <span>每段字數 <b>{settings.size}</b></span>
              <input type="range" min={30} max={200} step={10} value={settings.size} onChange={(event) => { const size = Number(event.target.value); onChange({ ...settings, size, overlap: Math.min(settings.overlap, Math.floor(size / 2)) }); }} />
            </label>
            <label className="lab-range">
              <span>重疊字數 <b>{settings.overlap}</b></span>
              <input type="range" min={0} max={Math.floor(settings.size / 2)} step={2} value={settings.overlap} onChange={(event) => onChange({ ...settings, overlap: Number(event.target.value) })} />
            </label>
          </>
        )}
      </div>

      <div className="lab-stats">
        <div><strong>{chunks.length}</strong><span>個段落</span></div>
        <div className={cut > 0 ? "warn" : "ok"}><strong>{cut}</strong><span>個段落在句子中間被切斷</span></div>
        <div><strong>{Math.round(SAMPLE_DOC.length / chunks.length)}</strong><span>平均每段字數</span></div>
      </div>

      <HighlightedDoc chunks={chunks} />

      <div className="lab-chunk-grid">
        {chunks.map((chunk, index) => (
          <article key={`${chunk.id}-${chunk.start}`} className={`lab-chunk ${chunkColor(chunk.id)}`} style={{ animationDelay: `${Math.min(index, 12) * 50}ms` }}>
            <header><b>#{chunk.id}</b><small>{chunk.text.length} 字{isCutMidSentence(SAMPLE_DOC, chunk) && <em> ・ 句子被切斷</em>}</small></header>
            <p>{chunk.text}</p>
          </article>
        ))}
      </div>

      <p className="lab-note">試試看：把「每段字數」拉到 40、重疊拉到 0，再一路走到第 7 步，看看 AI 還答不答得出來。實務上常見的設定是每段 300–800 個中文字、重疊 10–20%，或依標題與段落結構切（語意切塊）。</p>
    </>
  );
}

// 依每個字被哪些段落涵蓋來上色，重疊的部分另外標示
function HighlightedDoc({ chunks }: { chunks: Chunk[] }) {
  const spans: { text: string; ids: number[] }[] = [];
  for (let index = 0; index < SAMPLE_DOC.length; index++) {
    const ids = chunks.filter((chunk) => index >= chunk.start && index < chunk.end).map((chunk) => chunk.id);
    const last = spans.at(-1);
    if (last && last.ids.join() === ids.join()) last.text += SAMPLE_DOC[index];
    else spans.push({ text: SAMPLE_DOC[index], ids });
  }
  return (
    <div className="lab-highlight" aria-label="原文切塊結果">
      {spans.map((span, index) => (
        <mark key={index} className={span.ids.length > 1 ? "overlap" : span.ids.length === 1 ? chunkColor(span.ids[0]) : "none"} title={span.ids.length ? `段落 #${span.ids.join("、#")}` : undefined}>{span.text}</mark>
      ))}
      <p className="lab-legend"><i className="lime" /><i className="blue" /><i className="amber" />不同顏色是不同段落<i className="overlap" />斜線是兩段重疊的文字</p>
    </div>
  );
}

function VectorBars({ vector, hits, compact }: { vector: number[]; hits?: string[][]; compact?: boolean }) {
  return (
    <div className={`lab-vector${compact ? " compact" : ""}`} aria-label={`向量：${vector.map((value) => value.toFixed(2)).join(", ")}`}>
      {DIMENSIONS.map((dim, index) => (
        <div key={dim.key} className="lab-vector-col" title={hits?.[index]?.length ? `命中：${hits[index].join("、")}` : undefined}>
          <span className="lab-vector-bar"><i style={{ height: `${Math.max(vector[index] * 100, 2)}%` }} /></span>
          {!compact && <><b>{vector[index].toFixed(2)}</b><small>{dim.label}</small></>}
        </div>
      ))}
    </div>
  );
}

type Embedded = { chunk: Chunk; vector: number[]; hits: string[][] };

function EmbedStep({ embedded, selected, onSelect }: { embedded: Embedded[]; selected: Embedded; onSelect: (id: number) => void }) {
  return (
    <>
      <Explain
        what={<>電腦無法直接比較「兩段文字意思像不像」，所以要用嵌入模型（embedding model）把每個段落轉成一串數字，稱為向量（vector）。意思相近的文字，轉出來的數字也會相近。這一步在準備階段做完後，向量會存進向量資料庫（vector database），之後查詢就不用重算。</>}
        analogy={<>像替每張索引卡打上座標。「病假要附證明」和「生病請假的規定」會被放在地圖上很靠近的位置，「出差住宿上限」則在另一區。</>}
        tip={<>真實的嵌入模型有 768 到 3,072 個維度，每個維度的意義是模型自己學出來的，人看不懂，也能理解同義詞與上下文。這裡為了看得懂，改用 8 個概念當維度、以關鍵字計分，原理相同：方向相近就代表意思相近。</>}
      />
      <div className="lab-embed">
        <ul className="lab-embed-list" aria-label="段落與向量">
          {embedded.map((item) => (
            <li key={`${item.chunk.id}-${item.chunk.start}`}>
              <button type="button" onClick={() => onSelect(item.chunk.id)} aria-pressed={item.chunk.id === selected.chunk.id}>
                <b className={`lab-dot ${chunkColor(item.chunk.id)}`}>#{item.chunk.id}</b>
                <span>{item.chunk.text.slice(0, 22)}…</span>
                <VectorBars vector={item.vector} compact />
              </button>
            </li>
          ))}
        </ul>
        <div className="lab-embed-detail">
          <p className="lab-embed-source"><b className={`lab-dot ${chunkColor(selected.chunk.id)}`}>#{selected.chunk.id}</b>{selected.chunk.text}</p>
          <p className="lab-arrow" aria-hidden="true">↓ 嵌入模型 ↓</p>
          <VectorBars key={selected.chunk.id} vector={selected.vector} hits={selected.hits} />
          <p className="lab-mono">[{selected.vector.map((value) => value.toFixed(2)).join(", ")}]</p>
          <p className="lab-note">滑過長條可以看到這個段落命中了哪些詞。全部為 0 代表這段文字太短或太零碎，模型抓不到意思。</p>
        </div>
      </div>
      <MeaningMap embedded={embedded} />
    </>
  );
}

const MAP_SIZE = 1.45;

function MeaningMap({ embedded, query, highlight = [], lineKey }: { embedded: Embedded[]; query?: number[]; highlight?: number[]; lineKey?: string }) {
  const points = embedded.map((item) => ({ ...item, ...project(item.vector, item.chunk.id) }));
  const q = query && project(query);
  return (
    <figure className="lab-map">
      <svg viewBox={`${-MAP_SIZE} ${-MAP_SIZE} ${MAP_SIZE * 2} ${MAP_SIZE * 2}`} role="img" aria-label="意義地圖：每個點是一個段落，越靠近某個概念代表內容越偏向該主題">
        <circle cx={0} cy={0} r={1} className="lab-map-ring" />
        <circle cx={0} cy={0} r={0.5} className="lab-map-ring" />
        {DIMENSIONS.map((dim, index) => {
          const angle = (index / DIMENSIONS.length) * Math.PI * 2 - Math.PI / 2;
          return (
            <g key={dim.key}>
              <line x1={0} y1={0} x2={Math.cos(angle)} y2={Math.sin(angle)} className="lab-map-axis" />
              <text x={Math.cos(angle) * 1.3} y={Math.sin(angle) * 1.3} className="lab-map-label">{dim.label}</text>
            </g>
          );
        })}
        {q && highlight.map((id, index) => {
          const point = points.find((item) => item.chunk.id === id);
          return point && <line key={`${lineKey}-${id}`} x1={q.x} y1={q.y} x2={point.x} y2={point.y} className="lab-map-link" style={{ animationDelay: `${index * 160}ms` }} />;
        })}
        {points.map((point) => (
          <g key={`${point.chunk.id}-${point.chunk.start}`} className={`lab-map-point ${chunkColor(point.chunk.id)}${highlight.includes(point.chunk.id) ? " hit" : ""}`} style={{ transform: `translate(${point.x}px, ${point.y}px)` }}>
            <circle r={0.075} />
            <text y={0.028}>{point.chunk.id}</text>
          </g>
        ))}
        {q && (
          <g className="lab-map-query" style={{ transform: `translate(${q.x}px, ${q.y}px)` }}>
            <rect x={-0.07} y={-0.07} width={0.14} height={0.14} rx={0.02} transform="rotate(45)" />
            <text y={0.028}>Q</text>
          </g>
        )}
      </svg>
      <figcaption>意義地圖（簡化示意）：點越靠近哪個概念，代表內容越偏向那個主題。{q && " 菱形 Q 是你的問題。"}把 8 個維度壓成平面難免失真，實際排名以相似度分數為準。</figcaption>
    </figure>
  );
}

function QueryStep({ question, draft, setDraft, onAsk, query, embedded }: { question: string; draft: string; setDraft: (value: string) => void; onAsk: (value: string) => void; query: { vector: number[]; hits: string[][] }; embedded: Embedded[] }) {
  const empty = query.vector.every((value) => value === 0);
  return (
    <>
      <Explain
        what={<>現在進入問答階段。使用者的問題會用「同一個」嵌入模型轉成向量，這樣問題和段落才在同一張地圖上、可以互相比較距離。注意：問題不需要和文件用字完全一樣，例如問「飯店」也能找到寫著「住宿」的段落。</>}
        tip={<>準備階段和問答階段一定要用同一個嵌入模型。換了模型，所有文件都要重新向量化，否則就像拿台北的地圖找高雄的地址。</>}
      />
      <div className="lab-ask">
        <p className="lab-ask-label">選一個問題，或自己輸入：</p>
        <div className="lab-chips">
          {PRESETS.map((preset) => (
            <button key={preset.question} type="button" aria-pressed={preset.question === question} onClick={() => onAsk(preset.question)}>{preset.question}</button>
          ))}
        </div>
        <form className="lab-ask-form" onSubmit={(event) => { event.preventDefault(); onAsk(draft); setDraft(""); }}>
          <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="例如：請病假會扣薪水嗎？" aria-label="自訂問題" maxLength={60} />
          <button type="submit" className="button primary">送出 <span>→</span></button>
        </form>
      </div>
      <div className="lab-query">
        <div>
          <p className="lab-query-text"><span>Q</span>{question}</p>
          <p className="lab-arrow" aria-hidden="true">↓ 同一個嵌入模型 ↓</p>
          <VectorBars key={question} vector={query.vector} hits={query.hits} />
          {empty && <p className="lab-warn">這個簡化版只認得示範手冊裡的詞彙（休假、病假、出差、報帳、在家工作等），換個說法試試。真實的嵌入模型沒有這個限制。</p>}
        </div>
        <MeaningMap embedded={embedded} query={query.vector} />
      </div>
    </>
  );
}

function RetrieveStep({ question, query, embedded, ranked, topK, setTopK }: { question: string; query: number[]; embedded: Embedded[]; ranked: Ranked[]; topK: number; setTopK: (value: number) => void }) {
  const ids = ranked.slice(0, topK).map(({ chunk }) => chunk.id);
  return (
    <>
      <Explain
        what={<>系統計算問題向量和每個段落向量的「餘弦相似度」（cosine similarity）：兩個箭頭指的方向越一致，分數越接近 1；毫不相關就接近 0。接著取分數最高的前 K 段（Top-K），交給下一步。</>}
        analogy={<>像在地圖上以問題為中心，圈出最近的幾家店。圈太小可能漏掉答案；圈太大，會把不相干的內容也帶進來，讓模型分心、成本也變高。</>}
        tip={<>實務上常再加一層「重新排序」（rerank）模型做精選，並搭配關鍵字搜尋處理產品型號、法條編號這類需要精準比對的字詞（混合檢索）。</>}
      />
      <div className="lab-controls">
        <label className="lab-range">
          <span>取前 K 段 <b>K = {topK}</b></span>
          <input type="range" min={1} max={Math.min(5, ranked.length)} value={Math.min(topK, ranked.length)} onChange={(event) => setTopK(Number(event.target.value))} />
        </label>
        <p className="lab-query-text small"><span>Q</span>{question}</p>
      </div>
      <div className="lab-retrieve">
        <ol className="lab-rank">
          {ranked.map(({ chunk, score }, index) => (
            <li key={`${chunk.id}-${chunk.start}`} className={index < topK ? "picked" : undefined}>
              <b className={`lab-dot ${chunkColor(chunk.id)}`}>#{chunk.id}</b>
              <span className="lab-rank-text">{chunk.text}</span>
              <span className="lab-score"><i style={{ width: `${Math.max(score, 0) * 100}%` }} /><em>{score.toFixed(2)}</em></span>
            </li>
          ))}
        </ol>
        <MeaningMap embedded={embedded} query={query} highlight={ids} lineKey={`${question}-${topK}`} />
      </div>
    </>
  );
}

function PromptStep({ question, retrieved }: { question: string; retrieved: Ranked[] }) {
  return (
    <>
      <Explain
        what={<>檢索到的段落不會直接當成答案，而是和問題一起組成一份提示（prompt）交給語言模型。提示通常包含三部分：給模型的規則（只能根據資料回答、要標出處）、參考資料、使用者的問題。這就是 RAG 中的「增強」（Augmented）。</>}
        tip={<>「找不到就說找不到」這條規則非常重要。少了它，模型在資料不足時會用自己的常識補上，產生看似合理但不正確的答案（幻覺，hallucination）。</>}
      />
      <div className="lab-prompt" aria-label="送給語言模型的完整提示">
        <p className="lab-prompt-tag system">規則（System）</p>
        <p>{SYSTEM_PROMPT}</p>
        <p className="lab-prompt-tag context">參考資料（檢索結果）</p>
        {retrieved.map(({ chunk }, index) => (
          <p key={`${chunk.id}-${chunk.start}`} className="lab-prompt-chunk" style={{ animationDelay: `${index * 150}ms` }}><b>[{chunk.id}]</b>{chunk.text}</p>
        ))}
        <p className="lab-prompt-tag user">使用者問題</p>
        <p>{question}</p>
      </div>
      <p className="lab-note">這份提示約 {SYSTEM_PROMPT.length + question.length + retrieved.reduce((sum, { chunk }) => sum + chunk.text.length, 0)} 字。語言模型按字數（token）計費，所以切塊大小和 K 值也直接影響每次問答的成本。</p>
    </>
  );
}

function AnswerStep({ question, query, retrieved, settings, topK, onJump }: { question: string; query: number[]; retrieved: Ranked[]; settings: ChunkSettings; topK: number; onJump: (step: number) => void }) {
  const preset = PRESETS.find((item) => item.question === question);
  const chunks = retrieved.map(({ chunk }) => chunk);
  let answer: string;
  let status: "found" | "missing" | "extract";
  if (preset) {
    const sources = chunks.filter((chunk) => chunk.text.includes(preset.fact)).map((chunk) => chunk.id);
    status = sources.length > 0 ? "found" : "missing";
    answer = sources.length > 0 ? `${preset.answer} ${sources.map((id) => `[${id}]`).join("")}` : "手冊中找不到相關規定。建議洽詢人資部門確認。";
  } else {
    const best = bestSentence(query, chunks);
    status = best ? "extract" : "missing";
    answer = best ? `根據手冊：「${best.sentence}」[${best.chunkId}]` : "手冊中找不到相關規定。建議洽詢人資部門確認。";
  }
  const { typed, done } = useTypewriter(answer);

  return (
    <>
      <Explain
        what={<>語言模型讀完提示後寫出答案，並依規則標註出處編號。使用者可以點出處回頭核對原文，這是企業 RAG 和一般聊天機器人最大的差別：答案可以被驗證。</>}
      />
      <div className="lab-chat">
        <p className="lab-bubble user">{question}</p>
        <p className={`lab-bubble ai ${status}`}><span className="lab-speaker">✦ AI 回覆</span>{typed}{!done && <i className="lab-caret" aria-hidden="true" />}</p>
      </div>
      {status === "found" && <p className="lab-result ok">✓ 檢索到的段落中包含答案所需的完整句子，模型能正確回答並附上出處。</p>}
      {status === "extract" && <p className="lab-result ok">這是自訂問題，示範版不會真的呼叫語言模型，而是從檢索結果中摘出最相關的一句。真實系統會由模型改寫成通順的回答。</p>}
      {status === "missing" && (
        <div className="lab-result warn">
          <p><b>答不出來，而且這是正確的反應。</b>檢索到的 {topK} 個段落裡，沒有任何一段完整包含答案。因為有「找不到就說找不到」的規則，模型沒有亂編。</p>
          <p>可能原因：{settings.strategy === "fixed" && settings.size < 60 ? "段落切得太小，答案那句話被切成兩半，任何一段都不完整。" : "K 值太小，或問題的用字和文件差太多。"}</p>
          <div className="lab-result-actions">
            <button type="button" className="button secondary" onClick={() => onJump(2)}>調整切塊</button>
            <button type="button" className="button secondary" onClick={() => onJump(5)}>調整 K 值</button>
          </div>
        </div>
      )}
      <Recap
        items={[
          ["切塊", "決定資訊的最小單位：太大會混雜，太小會斷句。"],
          ["向量化", "把「意思」變成可以計算距離的座標。"],
          ["檢索", "用相似度找出最相關的 K 段。"],
          ["組合提示", "把資料和規則交給模型，限制它只能照資料回答。"],
          ["生成", "產出附出處、可回頭核對的答案。"],
        ]}
        conclusion="答案出錯時，問題多半出在前面的步驟（文件、切塊、檢索），而不是語言模型本身。"
      />
    </>
  );
}

// 逐字顯示答案；設定為減少動態效果時直接顯示全文
function useTypewriter(text: string) {
  const [shown, setShown] = useState({ text: "", length: 0 });
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setInterval(() => setShown((prev) => {
      const length = prev.text === text ? prev.length : 0;
      const next = reduced ? text.length : Math.min(length + 1, text.length);
      if (next >= text.length) window.clearInterval(timer);
      return { text, length: next };
    }), 35);
    return () => window.clearInterval(timer);
  }, [text]);
  const length = shown.text === text ? shown.length : 0;
  return { typed: text.slice(0, length), done: length >= text.length };
}
