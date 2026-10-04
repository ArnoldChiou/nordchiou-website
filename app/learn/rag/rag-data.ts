// RAG 互動教學用的示範資料與簡化版演算法（全部在瀏覽器執行，不呼叫任何 API）

export const SAMPLE_TITLE = "晨光貿易員工手冊（虛構範例）";

// 段落以空行分隔；「依段落切」策略會用到
export const SAMPLE_DOC = [
  "一、特休假：到職滿半年給 3 天特休，滿一年給 7 天，滿兩年給 10 天。特休需於 3 天前在 HR 系統提出申請，經直屬主管核准。年底未休完的特休，依日薪折算工資發放。",
  "二、病假：一年內未住院者，病假合計不超過 30 天。連續請病假 3 天以上，需附醫院證明。病假期間工資折半發給。",
  "三、出差：國內出差可搭高鐵標準車廂，住宿每晚上限 2,500 元。出差前需填寫出差申請單，並由部門主管核准。",
  "四、報帳：費用需於發生後 30 天內，檢附發票或收據在報帳系統申請。單筆超過 5,000 元需部門主管簽核。每月 5 日前送出的申請，於當月 25 日隨薪資撥款。",
  "五、遠端工作：每週最多 2 天可在家工作，需於前一天告知主管。在家工作期間，通訊軟體須保持上線。",
].join("\n\n");

// 教學用的「概念維度」：真實嵌入模型的維度是訓練出來的，人看不懂；這裡用 8 個看得懂的概念代替
// 排列順序決定在意義地圖上的方向，目前的順序讓地圖上的遠近盡量貼近實際的相似度排名
export type Dimension = { key: string; label: string; keywords: string[] };

export const DIMENSIONS: Dimension[] = [
  { key: "leave", label: "休假", keywords: ["特休", "休假", "請假", "病假", "放假", "休完", "沒休"] },
  { key: "health", label: "健康", keywords: ["病", "醫院", "證明", "住院", "看醫生", "身體"] },
  { key: "travel", label: "出差", keywords: ["出差", "高鐵", "住宿", "飯店", "旅館", "車廂", "交通"] },
  { key: "money", label: "金額", keywords: ["元", "工資", "薪資", "薪水", "扣薪", "撥款", "折算", "多少錢", "多少", "錢", "金額"] },
  { key: "approval", label: "核准", keywords: ["主管", "核准", "簽核", "同意", "告知", "誰"] },
  { key: "expense", label: "報帳", keywords: ["報帳", "發票", "收據", "費用", "請款", "報銷"] },
  { key: "remote", label: "在家", keywords: ["遠端", "在家", "居家", "通訊軟體", "上線", "WFH"] },
  { key: "time", label: "期限", keywords: ["天", "前", "期限", "年底", "多久", "何時", "什麼時候", "幾號"] },
];

export type Vector = number[];

export function embed(text: string): { vector: Vector; hits: string[][] } {
  const hits = DIMENSIONS.map((dim) => dim.keywords.filter((word) => text.includes(word)));
  const raw = DIMENSIONS.map((dim) => dim.keywords.reduce((sum, word) => sum + countOf(text, word), 0));
  const length = Math.hypot(...raw);
  return { vector: length === 0 ? raw : raw.map((value) => value / length), hits };
}

function countOf(text: string, word: string) {
  let count = 0;
  for (let at = text.indexOf(word); at !== -1; at = text.indexOf(word, at + word.length)) count++;
  return count;
}

// 兩個向量都已正規化，內積就是餘弦相似度
export const cosine = (a: Vector, b: Vector) => a.reduce((sum, value, index) => sum + value * b[index], 0);

export type Chunk = { id: number; start: number; end: number; text: string };
export type ChunkStrategy = "fixed" | "paragraph";
export type ChunkSettings = { strategy: ChunkStrategy; size: number; overlap: number };

export function chunkDocument(doc: string, { strategy, size, overlap }: ChunkSettings): Chunk[] {
  if (strategy === "paragraph") {
    const chunks: Chunk[] = [];
    let start = 0;
    for (const paragraph of doc.split("\n\n")) {
      chunks.push({ id: chunks.length + 1, start, end: start + paragraph.length, text: paragraph });
      start += paragraph.length + 2;
    }
    return chunks;
  }
  const step = Math.max(1, size - overlap);
  const chunks: Chunk[] = [];
  for (let start = 0; start < doc.length; start += step) {
    const end = Math.min(doc.length, start + size);
    chunks.push({ id: chunks.length + 1, start, end, text: doc.slice(start, end) });
    if (end === doc.length) break;
  }
  return chunks;
}

const SENTENCE_END = /[。！？\n]/;

// 段落結尾不在句號或換行上，代表有句子被切成兩半
export const isCutMidSentence = (doc: string, chunk: Chunk) => chunk.end < doc.length && !SENTENCE_END.test(doc[chunk.end - 1]) && !SENTENCE_END.test(doc[chunk.end] ?? "");

// 2D「意義地圖」：每個概念維度在圓周上占一個方向，向量的位置就是各方向的加權總和
export function project(vector: Vector, jitterSeed = 0): { x: number; y: number } {
  let x = 0;
  let y = 0;
  vector.forEach((value, index) => {
    const angle = (index / vector.length) * Math.PI * 2 - Math.PI / 2;
    x += value * Math.cos(angle);
    y += value * Math.sin(angle);
  });
  // 固定的小偏移，避免內容相近的點完全重疊
  const jitter = jitterSeed === 0 ? 0 : 0.05;
  return { x: x + Math.cos(jitterSeed * 2.4) * jitter, y: y + Math.sin(jitterSeed * 2.4) * jitter };
}

export type Preset = { question: string; fact: string; answer: string };

// fact 是答案所需的關鍵句；檢索到的段落要完整包含它，才算「找得到答案」
export const PRESETS: Preset[] = [
  { question: "特休沒休完，年底會怎麼處理？", fact: "依日薪折算工資發放", answer: "依員工手冊，年底沒有休完的特休，公司會依日薪折算成工資發放給你。" },
  { question: "出差住飯店，一晚最多可以報多少錢？", fact: "住宿每晚上限 2,500 元", answer: "國內出差的住宿費，每晚上限是 2,500 元；出差前記得先填寫出差申請單。" },
  { question: "報帳金額比較大時，需要誰簽核？", fact: "單筆超過 5,000 元需部門主管簽核", answer: "單筆費用超過 5,000 元時，需要部門主管簽核後才會撥款。" },
  { question: "生病請假要附什麼文件？", fact: "需附醫院證明", answer: "連續請病假 3 天以上需要附醫院證明；3 天以內則手冊沒有要求附文件。" },
  { question: "一週可以在家工作幾天？", fact: "每週最多 2 天可在家工作", answer: "每週最多可以在家工作 2 天，並且要在前一天告知主管。" },
];

export const SYSTEM_PROMPT = "你是晨光貿易的內部助理。只能根據下方「參考資料」回答，並用 [編號] 標註出處；資料中沒有答案時，請直接說「手冊中找不到相關規定」，不要自行推測。";

// 自訂問題沒有預寫答案時，挑出檢索段落中與問題最相近的一句話（摘錄式示範）
export function bestSentence(question: Vector, chunks: Chunk[]): { sentence: string; chunkId: number } | null {
  let best: { sentence: string; chunkId: number; score: number } | null = null;
  for (const chunk of chunks) {
    for (const sentence of chunk.text.split(/(?<=[。！？])/)) {
      const trimmed = sentence.trim();
      if (trimmed.length < 6) continue;
      const score = cosine(question, embed(trimmed).vector);
      if (score > 0 && (!best || score > best.score)) best = { sentence: trimmed, chunkId: chunk.id, score };
    }
  }
  return best && { sentence: best.sentence, chunkId: best.chunkId };
}
