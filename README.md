# nordchiou-website

諾秋工作室（企業 AI 導入方案）官網。以 [vinext](https://github.com/cloudflare/vinext)（Next.js on Vite）開發，部署在 Cloudflare Workers（nordchiou.com）。不依賴資料庫或 ChatGPT 登入。

## 開發

```bash
npm install
npm run dev     # 本機開發
npm run build   # 驗證 vinext build 產物
npm run lint
```

網站內容在 [app/page.tsx](app/page.tsx)，樣式在 [app/globals.css](app/globals.css)，靜態資源在 `public/`。

## 部署

推送到 `main` 後，GitHub Actions（[.github/workflows/deploy-cloudflare.yml](.github/workflows/deploy-cloudflare.yml)）會執行 `vinext build`，再用 wrangler 部署 Worker（入口為 [worker/index.ts](worker/index.ts)）到 **nordchiou.com**（`vite.config.ts` 設定 custom domain）。

## 保留但未使用的基礎設施

`vite.config.ts` 仍會讀取 `.openai/hosting.json` 並載入 `build/sites-vite-plugin.ts` ——
這些是 vinext/Codex 專案模板的建置基礎設施，`vinext build` 需要它們才能執行。目前沒有啟用 D1／R2 資料庫，相關設定與 `worker/index.ts` 中的 `DB` 綁定型別都保留原樣，以維持建置流程正常運作。
