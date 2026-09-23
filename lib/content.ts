/// <reference types="vite/client" />
import { parse as parseYaml } from "yaml";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import {
  BLOG_CATEGORIES,
  type BlogCategory,
  isBlogCategory,
  normalizeTag,
} from "./taxonomy";

export type Collection = "blog" | "news";

export type Post = {
  collection: Collection;
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  tags: string[];
  category?: BlogCategory;
  cover?: string;
  coverAlt?: string;
  draft: boolean;
  body: string;
  readingMinutes: number;
};

type Files = Record<string, string>;

// 文章在 build 時打包進程式，Cloudflare Workers 上不需要檔案系統。
// import.meta.glob 只接受字面值，所以每個資料夾各寫一次。
// drafts/ 只在開發環境載入，正式 build 會整段移除，草稿不會進入部署產物。
const sources: Record<Collection, { published: Files; drafts: Files }> = {
  blog: {
    published: import.meta.glob("../content/blog/*.md", {
      query: "?raw",
      import: "default",
      eager: true,
    }) as Files,
    drafts: import.meta.env.DEV
      ? (import.meta.glob("../content/blog/drafts/*.md", {
          query: "?raw",
          import: "default",
          eager: true,
        }) as Files)
      : {},
  },
  news: {
    published: import.meta.glob("../content/news/*.md", {
      query: "?raw",
      import: "default",
      eager: true,
    }) as Files,
    drafts: import.meta.env.DEV
      ? (import.meta.glob("../content/news/drafts/*.md", {
          query: "?raw",
          import: "default",
          eager: true,
        }) as Files)
      : {},
  },
};

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

function parseFile(collection: Collection, path: string, raw: string): Post {
  const slug = path.split("/").pop()!.replace(/\.md$/, "");
  const match = raw.match(FRONTMATTER);
  if (!match) throw new Error(`${collection}/${slug}.md 缺少 frontmatter`);
  const meta = parseYaml(match[1]) ?? {};
  for (const key of ["title", "description", "date"]) {
    if (!meta[key]) throw new Error(`${collection}/${slug}.md 缺少 ${key}`);
  }
  // 部落格文章必須有合法分類，寫錯就讓 build 失敗
  if (collection === "blog" && !isBlogCategory(meta.category)) {
    throw new Error(
      `blog/${slug}.md 的 category 必須是：${BLOG_CATEGORIES.join("、")}（目前是 ${meta.category ?? "未填"}）`,
    );
  }
  // 有封面就必須有替代文字（無障礙與 SEO）
  if (meta.cover && !meta.coverAlt)
    throw new Error(`${collection}/${slug}.md 有 cover 但缺少 coverAlt`);
  const body = raw.slice(match[0].length);
  return {
    collection,
    slug,
    title: String(meta.title),
    description: String(meta.description),
    date: String(meta.date),
    updated: meta.updated ? String(meta.updated) : undefined,
    category: collection === "blog" ? meta.category : undefined,
    cover: meta.cover ? String(meta.cover) : undefined,
    coverAlt: meta.coverAlt ? String(meta.coverAlt) : undefined,
    tags: Array.isArray(meta.tags)
      ? [
          ...new Set<string>(
            meta.tags.map((tag: unknown) => normalizeTag(String(tag))),
          ),
        ]
      : [],
    draft: path.includes("/drafts/"),
    body,
    // 中文約每分鐘 400 字
    readingMinutes: Math.max(
      1,
      Math.round(body.replace(/\s+/g, "").length / 400),
    ),
  };
}

const posts = Object.fromEntries(
  (Object.keys(sources) as Collection[]).map((collection) => {
    const { published, drafts } = sources[collection];
    const list = Object.entries({ ...published, ...drafts })
      .map(([path, raw]) => parseFile(collection, path, raw))
      .sort((a, b) => b.date.localeCompare(a.date));
    return [collection, list];
  }),
) as Record<Collection, Post[]>;

export function getPosts(collection: Collection): Post[] {
  return posts[collection];
}

export function getPost(
  collection: Collection,
  slug: string,
): Post | undefined {
  return posts[collection].find((post) => post.slug === slug);
}

type HastNode = {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

// 內文圖片包一層連結，手機上點圖即可開啟原圖放大；圖片也改為延遲載入
function rehypeZoomableImages() {
  const walk = (node: HastNode, insideLink: boolean) => {
    node.children = node.children?.map((child) => {
      if (child.type === "element" && child.tagName === "img") {
        child.properties = { ...child.properties, loading: "lazy" };
        if (!insideLink) {
          return {
            type: "element",
            tagName: "a",
            properties: {
              href: child.properties.src,
              target: "_blank",
              rel: ["noopener"],
              className: ["post-image-link"],
            },
            children: [child],
          };
        }
      }
      walk(child, insideLink || child.tagName === "a");
      return child;
    });
  };
  return (tree: HastNode) => walk(tree, false);
}

// 先消毒（移除 javascript: 連結與危險標籤）再產生標題 id，避免 id 被加上 user-content- 前綴
const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSanitize, { ...defaultSchema, clobberPrefix: "" })
  .use(rehypeZoomableImages)
  .use(rehypeSlug)
  .use(rehypeStringify);

export async function renderMarkdown(markdown: string): Promise<string> {
  return String(await processor.process(markdown));
}

export function formatDate(date: string): string {
  const [y, m, d] = date.split("-");
  return `${y} 年 ${Number(m)} 月 ${Number(d)} 日`;
}
