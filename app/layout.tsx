import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://nordchiou.com";
const TITLE = "諾秋工作室｜下單機與策略回測程式";
const DESCRIPTION =
  "諾秋工作室專注台股、期貨與加密貨幣的自動下單機、策略回測程式與" +
  "客製化量化交易系統開發。支援永豐金 Shioaji、幣安 Binance API 串接，" +
  "報價透明，提供三個月程式錯誤保固。";

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
      { url: "/og.png", width: 1200, height: 630, alt: "諾秋工作室｜交易系統開發" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.png"],
  },
  icons: { icon: "/favicon.ico", shortcut: "/favicon.ico" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-Hant"><body>{children}</body></html>;
}
