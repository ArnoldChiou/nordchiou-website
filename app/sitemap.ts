import type { MetadataRoute } from "next";
import { type Collection, getPosts } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

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

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, lastModified: HOME_UPDATED },
    ...section("blog"),
    ...section("news"),
  ];
}
