import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // 第 39 週週報與第 40 週重複，已刪除
      {
        source: "/news/2026-w39",
        destination: "/news/2026-w40",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
