import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { type Post, getPost } from "@/lib/content";
import { LESSONS, UPCOMING_LESSONS, type Lesson } from "@/lib/lessons";
import { ORG_REF, SITE_URL } from "@/lib/site";
import { SiteFooter, SiteNav } from "../SiteChrome";
import "../content.css";
import "./learn.css";

const PATH = "/learn";
const NAME = "AI 教學";
const TITLE = "AI 原理互動教學｜動手看懂 RAG 等 AI 技術｜諾秋工作室";
const DESCRIPTION = "用互動動畫一步一步拆解 AI 背後的原理：RAG 知識庫問答如何切塊、向量化、檢索與生成。不用寫程式，拖拉滑桿就能看懂。";
const COVER = "/content-images/learn/cover.jpg";

const breadcrumbs = (items: [string, string][]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map(([name, item], index) => ({ "@type": "ListItem", position: index + 1, name, item })),
});

export const learnIndexMetadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { type: "website", url: PATH, siteName: "諾秋工作室", locale: "zh_TW", title: TITLE, description: DESCRIPTION, images: [{ url: COVER, width: 1200, height: 630, alt: TITLE }] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [COVER] },
};

export function LearnIndex() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      url: `${SITE_URL}${PATH}`,
      name: NAME,
      description: DESCRIPTION,
      inLanguage: "zh-Hant",
      publisher: ORG_REF,
      hasPart: LESSONS.map((lesson) => ({ "@type": "LearningResource", name: lesson.title, url: `${SITE_URL}${PATH}/${lesson.slug}` })),
    },
    breadcrumbs([["首頁", `${SITE_URL}/`], [NAME, `${SITE_URL}${PATH}`]]),
  ];

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteNav />
      <header className="blog-hero shell learn-hero">
        <div>
          <p className="kicker">INTERACTIVE AI LAB</p>
          <h1>動手玩一次<br />就看懂 AI 原理</h1>
          <p>把 AI 系統背後的每個步驟拆開來，用動畫和互動操作親自體驗。拖拉滑桿、換個問題，看看結果怎麼變。不用寫程式，也不需要技術背景。</p>
        </div>
        <img src={COVER} alt="插圖：文件被拆成小方塊，轉成座標點，再連到 AI 回答" width={1200} height={630} />
      </header>
      <section className="shell learn-list" aria-label="互動教學列表">
        {LESSONS.map((lesson) => <LessonCard key={lesson.slug} lesson={lesson} />)}
        {UPCOMING_LESSONS.map((lesson) => (
          <article key={lesson.title} className="learn-card upcoming">
            <div className="learn-card-body">
              <p className="learn-card-meta"><span className="learn-kicker">{lesson.kicker}</span><span className="learn-soon">準備中</span></p>
              <h2>{lesson.title}</h2>
              <p>{lesson.description}</p>
            </div>
          </article>
        ))}
      </section>
      <SiteFooter />
    </main>
  );
}

function LessonCard({ lesson }: { lesson: Lesson }) {
  const href = `${PATH}/${lesson.slug}`;
  return (
    <article className="learn-card">
      {lesson.cover && <Link className="learn-card-cover" href={href} tabIndex={-1} aria-hidden="true"><img src={lesson.cover} alt="" width={1200} height={630} loading="lazy" /></Link>}
      <div className="learn-card-body">
        <p className="learn-card-meta"><span className="learn-kicker">{lesson.kicker}</span><span>{lesson.steps} 個步驟</span><span>約 {lesson.minutes} 分鐘</span></p>
        <h2><Link href={href}>{lesson.title}</Link></h2>
        <p>{lesson.description}</p>
        <Link className="button primary" href={href}>開始互動教學 <span>→</span></Link>
      </div>
    </article>
  );
}

export function lessonMetadata(lesson: Lesson): Metadata {
  const url = `${PATH}/${lesson.slug}`;
  const title = `${lesson.title}｜互動教學｜諾秋工作室`;
  const cover = lesson.cover ?? COVER;
  return {
    title,
    description: lesson.description,
    alternates: { canonical: url },
    openGraph: { type: "article", url, siteName: "諾秋工作室", locale: "zh_TW", title, description: lesson.description, publishedTime: lesson.date, modifiedTime: lesson.updated ?? lesson.date, images: [{ url: cover, width: 1200, height: 630, alt: lesson.coverAlt ?? lesson.title }] },
    twitter: { card: "summary_large_image", title, description: lesson.description, images: [cover] },
  };
}

export function LessonPage({ lesson, children }: { lesson: Lesson; children: ReactNode }) {
  const url = `${SITE_URL}${PATH}/${lesson.slug}`;
  const related = (lesson.related ?? []).map((slug) => getPost("blog", slug)).filter((post): post is Post => post !== undefined && !post.draft);
  const others = LESSONS.filter((item) => item.slug !== lesson.slug);
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "LearningResource",
      "@id": `${url}#lesson`,
      name: lesson.title,
      description: lesson.description,
      url,
      inLanguage: "zh-Hant",
      learningResourceType: "Interactive simulation",
      interactivityType: "active",
      timeRequired: `PT${lesson.minutes}M`,
      datePublished: lesson.date,
      dateModified: lesson.updated ?? lesson.date,
      isAccessibleForFree: true,
      ...(lesson.cover && { image: `${SITE_URL}${lesson.cover}` }),
      author: ORG_REF,
      publisher: ORG_REF,
    },
    breadcrumbs([["首頁", `${SITE_URL}/`], [NAME, `${SITE_URL}${PATH}`], [lesson.title, url]]),
  ];

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteNav />
      <div className="shell lesson">
        <nav className="post-crumbs" aria-label="麵包屑"><Link href="/">首頁</Link><span aria-hidden="true">/</span><Link href={PATH}>{NAME}</Link></nav>
        <header className="lesson-header">
          <p className="kicker">{lesson.kicker}</p>
          <h1>{lesson.title}</h1>
          <p className="post-lead">{lesson.description}</p>
          <p className="blog-meta"><span className="blog-category">互動教學</span><span>{lesson.steps} 個步驟</span><span>約 {lesson.minutes} 分鐘</span><span>諾秋工作室</span></p>
        </header>
        {children}
        {others.length > 0 && (
          <aside className="post-related" aria-label="其他互動教學">
            <p className="kicker">MORE LESSONS</p>
            <h2>其他互動教學</h2>
            <ul>
              {others.map((item) => (
                <li key={item.slug}>
                  <Link href={`${PATH}/${item.slug}`}>{item.title}</Link>
                  <span>{item.steps} 個步驟・約 {item.minutes} 分鐘</span>
                </li>
              ))}
            </ul>
          </aside>
        )}
        {related.length > 0 && (
          <aside className="post-related" aria-label="延伸閱讀">
            <p className="kicker">FURTHER READING</p>
            <h2>延伸閱讀</h2>
            <ul>
              {related.map((post) => (
                <li key={post.slug}>
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  <span>{post.category}・約 {post.readingMinutes} 分鐘閱讀</span>
                </li>
              ))}
            </ul>
          </aside>
        )}
        <aside className="post-cta">
          <p className="kicker">NEXT STEP</p>
          <h2>想把公司文件變成可以提問的知識庫？</h2>
          <p>從導入診斷開始：盤點文件與資料現況，評估切塊、檢索與權限的做法，再決定要不要進入開發。</p>
          <div className="post-cta-actions"><Link className="button primary" href="/#contact" data-plan="導入診斷">預約導入診斷 <span>→</span></Link><Link className="button secondary" href={PATH}>看其他互動教學</Link></div>
        </aside>
      </div>
      <SiteFooter />
    </main>
  );
}
