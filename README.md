# nordchiou-website

諾秋工作室（下單機與策略回測程式）官網。以 [vinext](https://github.com/cloudflare/vinext)（Next.js on Vite）開發，靜態匯出後部署到 GitHub Pages，不依賴資料庫或 ChatGPT 登入。

## 開發

```bash
npm install
npm run dev     # 本機開發
npm run build   # 驗證 vinext build 產物
npm run lint
```

網站內容在 [app/page.tsx](app/page.tsx)，樣式在 [app/globals.css](app/globals.css)，靜態資源在 `public/`。

## 部署

推送到 `main` 後，GitHub Actions（[.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml)）會執行
[scripts/export-github-pages.mjs](scripts/export-github-pages.mjs)：先 `vinext build`，
啟動本機伺服器擷取渲染後的靜態 HTML，再連同 `public/` 中的圖片一起輸出到 `docs/`，由 GitHub Pages 直接發布該資料夾。

要在本機預覽最終發布結果，可直接打開 `docs/index.html` 或用任意靜態伺服器啟動 `docs/`，不需要登入 ChatGPT 或任何帳號。

## 保留但未使用的基礎設施

`vite.config.ts` 仍會讀取 `.openai/hosting.json` 並載入 `build/sites-vite-plugin.ts`、`worker/index.ts` ——
這些是 vinext/Codex 專案模板的建置基礎設施，`vinext build` 需要它們才能執行，即使目前沒有啟用 D1／R2 資料庫，也保留原樣以維持建置流程正常運作。
