# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 專案概要

諾秋工作室（企業 AI 導入服務）官網，含部落格與每週 AI 新聞。以 vinext（Next.js App Router 跑在 Vite 上）開發，網站文字與程式註解使用繁體中文，commit 訊息使用英文。

## 常用指令

```bash
npm install
npm run dev                          # 本機開發 http://localhost:3000
npm run lint
node scripts/generate-news.mjs --draft     # 產生本週新聞草稿到 content/news/drafts/
node scripts/generate-news.mjs --dry-run   # 只列候選新聞，不呼叫 Claude
```

- 沒有測試框架；驗證方式是 `npx tsc --noEmit -p .`、`npm run lint` 與實際開頁面。
- **Windows 注意**：`npm run dev/build` 的 script 用了 `WRANGLER_LOG_PATH=... vinext dev` 這種 POSIX 寫法，在 cmd/PowerShell 會失敗。PowerShell 請改用 `$env:WRANGLER_LOG_PATH='.wrangler/wrangler.log'; npx vinext dev`。
- dev server 不會即時讀到 `content/**/*.md` 的修改（文章在載入時打包），改完 Markdown 要重開 dev server。
- 既有的 lint 錯誤（`app/not-found.tsx` 的 `<a>`）與 `worker/index.ts` 的型別錯誤是原本就有的，不是新改動造成。

## 部署

- 推到 `main` 會觸發 `.github/workflows/deploy-cloudflare.yml`：`vinext build` 後用 wrangler 部署 Cloudflare Worker（入口 `worker/index.ts`），正式網站 nordchiou.com 由此提供（`vite.config.ts` 設定 custom domain）。發布只需 commit 原始碼，沒有需要另外產生並提交的產物。
- 2026-10 已停用 GitHub Pages 靜態版（移除了 `deploy-pages.yml`、`docs/` 與 export 腳本），不要再加回 `docs/` 產物。
- `public/margin_ratio/` 由外部流程每日自動 commit 更新（"Update margin ratio data to ..."），不要手動修改。
- `.openai/hosting.json`、`build/sites-vite-plugin.ts` 是 vinext 範本的建置基礎設施，build 需要；D1/R2 綁定目前未使用，相關設定（含 `worker/index.ts` 的 `DB` 型別）保持原樣。

## 內容系統架構

- 文章是 `content/blog/*.md` 與 `content/news/*.md`，由 `lib/content.ts` 以 `import.meta.glob` 在 build 時打包（Workers 上沒有檔案系統）。`drafts/` 子資料夾只在開發環境載入，正式 build 不會包含。
- frontmatter 在 `lib/content.ts` 驗證，缺欄位或值不合法會讓 build 直接失敗：
  - 必填：`title`、`description`、`date`；有 `cover` 就必須有 `coverAlt`。
  - 部落格另外必填 `category`（`lib/taxonomy.ts` 的 `BLOG_CATEGORIES`）與 `topic`（`BLOG_TOPICS` 的 slug）。
  - `tags` 會經 `normalizeTag` 統一寫法（別名表在 `lib/taxonomy.ts`）。
- 新增部落格主題：在 `BLOG_TOPICS` 加一筆即可，主題頁 `/blog/topic/<slug>`、選單與 sitemap 會自動產生（只列出有文章的主題）。主題頁依發布日期由舊到新排序（「第 N 篇」即依此編號）。
- 頁面渲染集中在 `app/ContentPages.tsx`：部落格與新聞共用同一套元件，以 `SectionConfig`（`BLOG`、`NEWS`）區分；`app/blog/**`、`app/news/**` 的 page 檔只是薄包裝。metadata、JSON-LD、RSS 也都在這裡產生。
- Markdown 圖片慣例：`![替代文字](/content-images/.../x.webp "/content-images/.../x-mobile.webp")`，title 填手機版路徑時，窄螢幕會自動換成手機版圖片（`rehypeZoomableImages`）。圖片放 `public/content-images/<blog|news>/<slug>/`，部落格內文圖通常為 1600×900 桌機版加 900 寬的手機版 webp，封面為 1200×630 的 `cover.jpg`。

## 部落格寫作

- 讀者多為非工程背景的企業決策者：專有名詞第一次出現時用白話或比喻解釋、英文原文放括號，但不要因此刪減技術細節。
- 文章結構慣例：開頭點出問題 →「先說結論」引言區塊 → 編號章節 → 結語導向「導入診斷」→ 參考資料清單。
- 每週新聞由 `.github/workflows/weekly-news.yml` 排程執行 `scripts/generate-news.mjs`（RSS 來源在 `scripts/news-sources.json`），自動開 PR，merge 即發布。
