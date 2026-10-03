// 部落格分類：每篇文章必填且只能選一個，新增分類前先確認現有分類真的放不下
export const BLOG_CATEGORIES = ["導入規劃", "技術實作", "案例分享", "產業觀察"] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

// 部落格主題：讀者導覽用，每篇文章必填且只能選一個；網址為 /blog/topic/<slug>
export const BLOG_TOPICS = [
  {
    slug: "rag",
    name: "RAG 知識庫",
    description: "讓 AI 根據公司文件回答問題：導入前要準備什麼、有哪些檢索技術可選，以及「RAG 已死」的爭議怎麼看。",
  },
  {
    slug: "ai-customer-service",
    name: "AI 客服",
    description: "用 AI 自動回覆 LINE 與網站訊息：從問題分流、系統架構、轉接真人到程式實作的完整做法。",
  },
  {
    slug: "ai-agent",
    name: "AI Agent",
    description: "會自己規劃步驟、使用工具、把事情做完的 AI：主流產品怎麼比、開源自架方案怎麼選，以及導入前該注意的安全問題。",
  },
] as const;

export type BlogTopic = (typeof BLOG_TOPICS)[number];
export type BlogTopicSlug = BlogTopic["slug"];

export function isBlogTopic(value: unknown): value is BlogTopicSlug {
  return BLOG_TOPICS.some((topic) => topic.slug === value);
}

export function getBlogTopic(slug: string): BlogTopic | undefined {
  return BLOG_TOPICS.find((topic) => topic.slug === slug);
}

// 主題頁的建議閱讀順序：先看決策與觀念，再看技術細節
export const TOPIC_READING_ORDER: readonly BlogCategory[] = ["導入規劃", "產業觀察", "案例分享", "技術實作"];

// 標籤統一寫法：key 為小寫的常見寫法，value 為網站上顯示的標準寫法
const TAG_ALIASES: Record<string, string> = {
  rag: "RAG",
  "檢索增強生成": "RAG",
  "知識庫問答": "知識庫",
  "企業知識庫": "知識庫",
  agent: "AI Agent",
  "ai agent": "AI Agent",
  "ai 代理": "AI Agent",
  "ai代理": "AI Agent",
  "ai 客服": "AI 客服",
  "ai客服": "AI 客服",
  "line 機器人": "LINE 機器人",
  "line bot": "LINE 機器人",
  "chatbot": "聊天機器人",
  "自動化": "流程自動化",
  llm: "大型語言模型",
  "資安": "資訊安全",
};

export function normalizeTag(tag: string): string {
  const trimmed = tag.trim().replace(/\s+/g, " ");
  return TAG_ALIASES[trimmed.toLowerCase()] ?? trimmed;
}

export function isBlogCategory(value: unknown): value is BlogCategory {
  return BLOG_CATEGORIES.includes(value as BlogCategory);
}
