import type { MetadataRoute } from "next";
import { type Collection, getPosts, getTopicPosts } from "@/lib/content";
import { BLOG_TOPICS } from "@/lib/taxonomy";
import { PRIVACY_UPDATED, SITE_URL } from "@/lib/site";

// 首頁內容變更時請同步更新
const HOME_UPDATED = "2026-09-23";

function section(collection: Collection): MetadataRoute.Sitemap {
  const posts = getPosts(collection).filter((post) => !post.draft);
  const latest = posts[0]?.updated ?? posts[0]?.date ?? HOME_UPDATED;
  return [
    { url: `${SITE_URL}/${collection}`, lastModified: latest },
    ...posts.map((post) => ({
      url: `${SITE_URL}/${collection}/${post.slug}`,
      lastModified: post.updated ?? post.date,
    })),
  ];
}

function topics(): MetadataRoute.Sitemap {
  return BLOG_TOPICS.flatMap((topic) => {
    const posts = getTopicPosts(topic.slug).filter((post) => !post.draft);
    if (posts.length === 0) return [];
    const latest = posts.map((post) => post.updated ?? post.date).sort().at(-1);
    return [{ url: `${SITE_URL}/blog/topic/${topic.slug}`, lastModified: latest }];
  });
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, lastModified: HOME_UPDATED },
    ...section("blog"),
    ...topics(),
    ...section("news"),
    { url: `${SITE_URL}/privacy-policy`, lastModified: PRIVACY_UPDATED },
  ];
}
