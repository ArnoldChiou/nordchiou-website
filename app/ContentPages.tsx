import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { type Collection, formatDate, getPost, getPosts, renderMarkdown } from "@/lib/content";
import { ORG_REF, SITE_URL } from "@/lib/site";
import { SiteFooter, SiteNav } from "./SiteChrome";
import "./content.css";

export type SectionConfig = {
  collection: Collection;
  path: string;
  name: string;
  feedTitle: string;
  title: string;
  description: string;
  kicker: string;
  heading: [string, string];
  intro: string;
  empty: string;
  // 文章沒有指定 cover 時使用
  defaultCover: string;
};

export const BLOG: SectionConfig = {
  collection: "blog",
  path: "/blog",
  name: "部落格",
  feedTitle: "諾秋工作室部落格",
  title: "部落格｜企業 AI 導入實務筆記｜諾秋工作室",
  description: "諾秋工作室的企業 AI 導入實務筆記：知識庫問答（RAG）、AI Agent 流程自動化、AI 客服與導入規劃的做法、踩雷經驗與評估方式。",
  kicker: "BLOG",
  heading: ["企業 AI 導入", "實務筆記"],
  intro: "我們在導入現場整理出來的做法、判斷標準與踩過的雷。不談空泛趨勢，只寫能直接拿來評估、規劃與執行的內容。",
  empty: "第一篇文章準備中，敬請期待。",
  defaultCover: "/og.png",
};

export const NEWS: SectionConfig = {
  collection: "news",
  path: "/news",
  name: "AI 新聞",
  feedTitle: "諾秋工作室 AI 新聞週報",
  title: "AI 新聞週報｜每週企業 AI 重點精選｜諾秋工作室",
  description: "每週精選 5–8 則對台灣企業真正有影響的 AI 新聞，附繁體中文重點摘要與「對企業導入的意義」短評，並連結原始來源。",
  kicker: "AI NEWS WEEKLY",
  heading: ["每週 AI 新聞", "企業觀點精選"],
  intro: "從原廠公告、國際媒體與台灣科技媒體中，挑出對企業導入真正有影響的消息，整理重點並說明對你的公司代表什麼。每則都附原文連結。",
  empty: "第一期週報準備中，敬請期待。",
  defaultCover: "/content-images/news/cover.jpg",
};

const breadcrumbs = (items: [string, string][]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map(([name, item], index) => ({ "@type": "ListItem", position: index + 1, name, item })),
});

export function indexMetadata(section: SectionConfig): Metadata {
  return {
    title: section.title,
    description: section.description,
    alternates: { canonical: section.path, types: { "application/rss+xml": `${section.path}/rss.xml` } },
    openGraph: { type: "website", url: section.path, siteName: "諾秋工作室", locale: "zh_TW", title: section.title, description: section.description, images: [{ url: section.defaultCover, width: 1200, height: 630, alt: section.title }] },
    twitter: { card: "summary_large_image", title: section.title, description: section.description, images: [section.defaultCover] },
  };
}

export function ContentIndex({ section }: { section: SectionConfig }) {
  const posts = getPosts(section.collection);
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      "@id": `${SITE_URL}${section.path}#blog`,
      url: `${SITE_URL}${section.path}`,
      name: section.feedTitle,
      description: section.description,
      inLanguage: "zh-Hant",
      publisher: ORG_REF,
      blogPost: posts.filter((post) => !post.draft).map((post) => ({ "@type": "BlogPosting", headline: post.title, url: `${SITE_URL}${section.path}/${post.slug}`, datePublished: post.date })),
    },
    breadcrumbs([["首頁", `${SITE_URL}/`], [section.name, `${SITE_URL}${section.path}`]]),
  ];

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteNav />
      <header className="blog-hero shell">
        <p className="kicker">{section.kicker}</p>
        <h1>{section.heading[0]}<br />{section.heading[1]}</h1>
        <p>{section.intro}</p>
      </header>
      <section className="shell blog-list" aria-label={`${section.name}列表`}>
        {posts.length === 0 ? (
          <p className="blog-empty">{section.empty}</p>
        ) : (
          posts.map((post) => (
            <article className={`blog-card${post.cover ? " has-cover" : ""}`} key={post.slug}>
              {post.cover && <Link className="blog-card-cover" href={`${section.path}/${post.slug}`} tabIndex={-1} aria-hidden="true"><img src={post.cover} alt="" width={1200} height={630} loading="lazy" /></Link>}
              <div className="blog-card-body">
              <p className="blog-meta">
                {post.category && <span className="blog-category">{post.category}</span>}
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span>約 {post.readingMinutes} 分鐘閱讀</span>
                {post.draft && <span className="blog-draft">草稿</span>}
              </p>
              <h2><Link href={`${section.path}/${post.slug}`}>{post.title}</Link></h2>
              <p>{post.description}</p>
              {post.tags.length > 0 && <ul className="blog-tags">{post.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>}
              </div>
            </article>
          ))
        )}
      </section>
      <SiteFooter />
    </main>
  );
}

export function postParams(section: SectionConfig) {
  return getPosts(section.collection).map((post) => ({ slug: post.slug }));
}

export function postMetadata(section: SectionConfig, slug: string): Metadata {
  const post = getPost(section.collection, slug);
  if (!post) return {};
  const url = `${section.path}/${post.slug}`;
  const title = `${post.title}｜諾秋工作室`;
  return {
    title,
    description: post.description,
    alternates: { canonical: url },
    // 草稿不讓搜尋引擎收錄
    robots: post.draft ? { index: false, follow: false } : undefined,
    openGraph: { type: "article", url, siteName: "諾秋工作室", locale: "zh_TW", title, description: post.description, publishedTime: post.date, modifiedTime: post.updated ?? post.date, tags: post.tags, images: [{ url: post.cover ?? section.defaultCover, width: 1200, height: 630, alt: post.coverAlt ?? post.title }] },
    twitter: { card: "summary_large_image", title, description: post.description, images: [post.cover ?? section.defaultCover] },
  };
}

export async function ContentPost({ section, slug }: { section: SectionConfig; slug: string }) {
  const post = getPost(section.collection, slug);
  if (!post) notFound();
  const html = await renderMarkdown(post.body);
  const url = `${SITE_URL}${section.path}/${post.slug}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "@id": `${url}#article`,
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      dateModified: post.updated ?? post.date,
      inLanguage: "zh-Hant",
      keywords: post.tags.join(", "),
      ...(post.category && { articleSection: post.category }),
      image: `${SITE_URL}${post.cover ?? section.defaultCover}`,
      mainEntityOfPage: url,
      author: ORG_REF,
      publisher: { ...ORG_REF, logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` } },
      isPartOf: { "@id": `${SITE_URL}${section.path}#blog` },
    },
    breadcrumbs([["首頁", `${SITE_URL}/`], [section.name, `${SITE_URL}${section.path}`], [post.title, url]]),
  ];

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteNav />
      <article className="post shell">
        <nav className="post-crumbs" aria-label="麵包屑"><Link href="/">首頁</Link><span aria-hidden="true">/</span><Link href={section.path}>{section.name}</Link></nav>
        <header className="post-header">
          {post.draft && <p className="blog-draft">草稿：尚未發布，僅在開發環境可見</p>}
          <h1>{post.title}</h1>
          <p className="post-lead">{post.description}</p>
          <p className="blog-meta">
            {post.category && <span className="blog-category">{post.category}</span>}
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            {post.updated && <span>更新於 <time dateTime={post.updated}>{formatDate(post.updated)}</time></span>}
            <span>約 {post.readingMinutes} 分鐘閱讀</span>
            <span>諾秋工作室</span>
          </p>
          {post.tags.length > 0 && <ul className="blog-tags">{post.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>}
        </header>
        {post.cover && <img className="post-cover" src={post.cover} alt={post.coverAlt} width={1200} height={630} />}
        <div className="post-body" dangerouslySetInnerHTML={{ __html: html }} />
        <aside className="post-cta">
          <p className="kicker">NEXT STEP</p>
          <h2>想知道你的流程適不適合導入 AI？</h2>
          <p>從導入診斷開始：盤點流程與資料現況，評估可行性與預期效益，再決定要不要進入開發。</p>
          <div className="post-cta-actions"><Link className="button primary" href="/#contact" data-plan="導入診斷">預約導入診斷 <span>→</span></Link><Link className="button secondary" href={section.path}>看更多{section.name}</Link></div>
        </aside>
      </article>
      <SiteFooter />
    </main>
  );
}

const escapeXml = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function rssResponse(section: SectionConfig): Response {
  const items = getPosts(section.collection)
    .filter((post) => !post.draft)
    .map((post) => {
      const url = `${SITE_URL}${section.path}/${post.slug}`;
      return `<item><title>${escapeXml(post.title)}</title><link>${url}</link><guid>${url}</guid><pubDate>${new Date(`${post.date}T00:00:00+08:00`).toUTCString()}</pubDate><description>${escapeXml(post.description)}</description></item>`;
    })
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${escapeXml(section.feedTitle)}</title><link>${SITE_URL}${section.path}</link><description>${escapeXml(section.description)}</description><language>zh-TW</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
