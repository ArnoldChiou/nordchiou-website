// 部落格分類：每篇文章必填且只能選一個，新增分類前先確認現有分類真的放不下
export const BLOG_CATEGORIES = ["導入規劃", "技術實作", "案例分享", "產業觀察"] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

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
