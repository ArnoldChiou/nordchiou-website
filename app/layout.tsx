import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "諾秋工作室｜下單機與策略回測程式",
  description: "專注股票、期貨、加密貨幣的自動下單機、策略回測與客製化量化交易系統開發。",
  icons: { icon: "/favicon.ico", shortcut: "/favicon.ico" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-Hant"><body>{children}</body></html>;
}
