// AI 教學課程清單：新增一課時在這裡加一筆，並建立 app/learn/<slug>/page.tsx
export type Lesson = {
  slug: string;
  title: string;
  description: string;
  // 卡片上的英文小標
  kicker: string;
  steps: number;
  minutes: number;
  date: string;
  updated?: string;
  cover?: string;
  coverAlt?: string;
  // 相關部落格文章的 slug
  related?: string[];
};

export const LESSONS: Lesson[] = [
  {
    slug: "rag",
    title: "RAG 知識庫問答是怎麼運作的？",
    description: "從文件切塊、向量化、相似度檢索到組合提示與生成回答，用一份虛構的員工手冊一步一步操作，親眼看到 AI 怎麼「先查資料、再回答」。",
    kicker: "RAG / RETRIEVAL",
    steps: 7,
    minutes: 10,
    date: "2026-10-04",
    cover: "/content-images/learn/rag/cover.jpg",
    coverAlt: "RAG 流程插圖：文件被切成段落、轉成向量點，再檢索出最相近的段落組成回答",
    related: ["rag-knowledge-base-checklist", "rag-techniques-2026", "is-rag-dead"],
  },
  {
    slug: "tokens",
    title: "Token 與上下文視窗：AI 一次能讀多少？",
    description: "文字怎麼被切成 token、詞表怎麼學出來、上下文視窗塞滿時 AI 為什麼會「失憶」，以及這些數字怎麼變成你的 API 帳單。動手切字、塞爆視窗、試算成本。",
    kicker: "TOKENS / CONTEXT",
    steps: 5,
    minutes: 8,
    date: "2026-10-04",
    cover: "/content-images/learn/tokens/cover.jpg",
    coverAlt: "Token 插圖：文字被切成彩色小方塊，排進一條接近塞滿的長條視窗，最舊的方塊掉出視窗，旁邊是代表費用的硬幣",
    related: ["is-rag-dead", "rag-techniques-2026"],
  },
  {
    slug: "agent",
    title: "AI Agent 如何呼叫工具？",
    description: "從工具說明書、思考與行動的決策迴圈、出錯時換方法，到高風險動作的人工核准與回合上限，逐步播放一個客服 Agent 處理查物流、退款的完整過程。",
    kicker: "AGENT / TOOL USE",
    steps: 5,
    minutes: 10,
    date: "2026-10-04",
    cover: "/content-images/learn/agent/cover.jpg",
    coverAlt: "AI Agent 插圖：中央的 Agent 被思考、行動、觀察的循環箭頭圍繞，連接訂單、Email、物流與退款等工具卡，退款卡上有等待人工核准的標記",
    related: ["ai-agent-comparison", "open-source-ai-agents", "ai-customer-service-architecture"],
  },
];

// 尚未上線的課程，只在教學首頁預告
export const UPCOMING_LESSONS: Pick<Lesson, "title" | "description" | "kicker">[] = [];

export const getLesson = (slug: string) => LESSONS.find((lesson) => lesson.slug === slug);
