import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://nordchiou.com";
const TITLE = "企業 AI 導入方案｜知識庫問答・AI 客服・流程自動化｜諾秋工作室";
const DESCRIPTION =
  "諾秋工作室提供企業 AI 導入方案：知識庫問答（RAG）、流程自動化與 AI Agent、" +
  "AI 客服與 LINE 機器人、AI 顧問與教育訓練。從流程盤點、系統串接到上線維運，" +
  "分階段報價，並提供三個月程式錯誤保固；亦承接客製化量化交易系統開發。";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "諾秋工作室",
    locale: "zh_TW",
    title: TITLE,
    description: DESCRIPTION,
    images: [
      { url: "/og.png", width: 1200, height: 630, alt: "諾秋工作室｜企業 AI 導入方案" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.png"],
  },
  icons: { icon: "/favicon.ico", shortcut: "/favicon.ico", apple: "/apple-touch-icon.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-Hant"><body>{children}</body></html>;
}
