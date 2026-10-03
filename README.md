# nordchiou-website

諾秋工作室（企業 AI 導入方案）官網。以 [vinext](https://github.com/cloudflare/vinext)（Next.js on Vite）開發，正式網站 nordchiou.com 跑在 Cloudflare Workers；另有一份靜態匯出版發布到 GitHub Pages。不依賴資料庫或 ChatGPT 登入。

## 開發

```bash
npm install
npm run dev     # 本機開發
npm run build   # 驗證 vinext build 產物
npm run lint
```

網站內容在 [app/page.tsx](app/page.tsx)，樣式在 [app/globals.css](app/globals.css)，靜態資源在 `public/`。

## 部署

推送到 `main` 後，GitHub Actions 會同時跑兩條部署：

| 流程                                                             | 做什麼                                                                                                                                                           | 發布到                                                             |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| [deploy-cloudflare.yml](.github/workflows/deploy-cloudflare.yml) | `vinext build` 後用 wrangler 部署 Worker（入口為 [worker/index.ts](worker/index.ts)）                                                                            | **nordchiou.com**（正式網站，`vite.config.ts` 設定 custom domain） |
| [deploy-pages.yml](.github/workflows/deploy-pages.yml)           | 執行 [scripts/export-github-pages.mjs](scripts/export-github-pages.mjs)：先 `vinext build`，啟動本機伺服器擷取渲染後的 HTML，連同 `public/` 的圖片輸出到 `docs/` | GitHub Pages（靜態版）                                             |

靜態版會移除所有 `<script>`（只保留 JSON-LD 結構化資料），因此沒有前端互動；export 依 `/sitemap.xml` 決定要輸出哪些頁面。`docs/` 有 commit 進 repo，修改內容或樣式後請先執行 export 再一起提交。

要在本機預覽靜態版，可直接打開 `docs/index.html` 或用任意靜態伺服器啟動 `docs/`，不需要登入任何帳號。

## 保留但未使用的基礎設施

`vite.config.ts` 仍會讀取 `.openai/hosting.json` 並載入 `build/sites-vite-plugin.ts` ——
這些是 vinext/Codex 專案模板的建置基礎設施，`vinext build` 需要它們才能執行。目前沒有啟用 D1／R2 資料庫，相關設定與 `worker/index.ts` 中的 `DB` 綁定型別都保留原樣，以維持建置流程正常運作。
