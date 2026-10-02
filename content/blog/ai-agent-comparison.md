---
title: "AI Agent 是什麼？2026 主流 AI Agent 比較：通用助理、辦公套件、自建平台到程式開發工具"
description: "ChatGPT Work、Claude Cowork、Copilot Cowork、n8n、Claude Code、Codex……AI Agent 產品越來越多，到底差在哪？這篇先說明 AI Agent 和聊天機器人的差別，再把主流產品分成四種類型比較，幫你判斷該從哪一種開始。"
date: "2026-10-02"
category: "產業觀察"
cover: "/content-images/blog/ai-agent-comparison/cover.jpg"
coverAlt: "AI Agent 比較：通用助理、辦公套件、自建平台到程式開發工具，示意圖為 AI Agent 依序完成搜尋競品、整理表格、產出簡報，最後等待使用者確認後寄出"
tags: ["AI Agent", "生成式 AI", "工具比較"]
---

2026 年幾乎每一家 AI 公司都在推「Agent」：OpenAI 有 ChatGPT Work，Anthropic 有 Claude Cowork，微軟有 Copilot Cowork，Google 有 Gemini Spark 和 Antigravity，寫程式的工具更是一字排開。

客戶最常問我們的是：「這些到底差在哪？我們公司該用哪一個？」

先說結論：

> **AI Agent 的差別，主要不在背後用哪個模型，而在它在哪裡執行、能碰到哪些資料與系統、以及誰來管它。先選對類型，再挑品牌。**

這篇是 AI Agent 系列的第一篇，先把概念和主流產品攤開來比較；各類型的導入細節，會在後續文章分別深入。

## 1. AI Agent 和聊天機器人差在哪？

![聊天機器人與 AI Agent 的差別：聊天機器人是你問、它答、結束，動手的是你；AI Agent 從目標出發，規劃步驟、使用工具（搜尋、讀寫檔案、操作瀏覽器、呼叫系統 API）、檢查結果，不夠好就回到規劃，最後交付成果，關鍵步驟會停下來請你確認](/content-images/blog/ai-agent-comparison/what-is-agent.webp "/content-images/blog/ai-agent-comparison/what-is-agent-mobile.webp")

一般的 AI 聊天機器人是**一問一答**：你問「競品 A 的價格是多少」，它回答，接下來整理表格、做簡報、寄信，都還是你自己來。

AI Agent（AI 代理）則是**給它一個目標，讓它自己把事情做完**。你說「幫我整理五家競品的價格與功能，做成簡報」，它會：

1. **規劃步驟**：先找哪幾家、要比較哪些欄位、簡報分幾頁。
2. **使用工具（tool use）**：搜尋網頁、打開檔案、操作瀏覽器、呼叫公司系統的 API。
3. **檢查結果**：資料缺了就再查，表格對不起來就重做。
4. **交付成果**：一份可以直接用的檔案，而不只是一段文字回覆。

這個「規劃 → 動手 → 檢查」的循環，就是 Agent 和聊天機器人最根本的差別。也因為它真的會動手，**權限與確認機制**變得跟能力一樣重要：好的 Agent 產品，都會在寄信、付款、刪除資料這類關鍵步驟前停下來，請你確認。

### 三個判斷一個產品「夠不夠 Agent」的問題

- **它能使用哪些工具？** 只能搜尋網頁，還是能讀寫你的檔案、操作公司系統？
- **它能自己跑多久？** 幾分鐘的小任務，還是可以在背後連續工作好幾個小時、甚至排程定期執行？
- **出錯時誰看得到？** 有沒有執行紀錄、能不能設定哪些動作一定要人確認？

## 2. AI Agent 的四種類型

市面上的產品雖然多，但依照「給誰用、在哪裡執行」，大致可以分成四類：

![AI Agent 的四種類型：通用型助理（ChatGPT Work、Claude Cowork、Gemini Spark）適合研究、整理資料、做簡報與報表；辦公套件內建（Microsoft 365 Copilot 的 Copilot Cowork、Gemini in Google Workspace）適合已在用 M365 或 Google Workspace 的公司；自建流程平台（n8n、Dify、Copilot Studio）適合固定流程與串接內部系統；程式開發 Agent（Claude Code、OpenAI Codex、Google Antigravity、Cursor、GitHub Copilot）給工程團隊使用](/content-images/blog/ai-agent-comparison/landscape.webp "/content-images/blog/ai-agent-comparison/landscape-mobile.webp")

| 類型 | 代表產品 | 適合的工作 | 主要取捨 |
| --- | --- | --- | --- |
| 通用型助理 | ChatGPT Work、Claude Cowork、Gemini Spark | 研究、整理資料、做簡報與報表 | 開箱即用，但公司資料要另外接進來 |
| 辦公套件內建 | Copilot Cowork、Gemini in Google Workspace | 信件、行事曆、文件、會議相關工作 | 權限與稽核沿用既有管理，但綁定該套件 |
| 自建流程平台 | n8n、Dify、Copilot Studio | 固定流程、客服、串接內部系統 | 可控、可自架，但需要有人設計與維護 |
| 程式開發 Agent | Claude Code、Codex、Antigravity、Cursor、GitHub Copilot | 寫程式、修 bug、審查程式碼 | 生產力提升最明顯，但只適合工程團隊 |

以下分別說明。

## 3. 通用型助理 Agent：開箱即用的數位助理

這一類是個人或小團隊最容易上手的 Agent：訂閱就能用，不需要開發。

| 產品 | 推出 | 在哪裡執行 | 特色 |
| --- | --- | --- | --- |
| ChatGPT Work（OpenAI） | 2026 年 7 月 | OpenAI 的雲端虛擬機器 | 從 Agent 模式演進而來，可串接 Gmail、Slack、Google Drive 等工具，長時間處理多步驟任務，直接產出試算表、簡報、報告 |
| Claude Cowork（Anthropic） | 2026 年 1 月預覽、4 月正式推出 | 桌面版在你電腦上的隔離虛擬機器執行；網頁與手機版在雲端 | 可直接處理電腦上的檔案，有外掛（plugin）與連接器（connector），企業版有細緻的管理權限 |
| Gemini Spark（Google） | 2026 年 5 月 Google I/O 發表 | Google 雲端 | 主打 24 小時在背景工作，跨 Gmail、文件、試算表處理例行事務 |

另外值得一提的是 **Manus**：2025 年以「通用型 Agent」爆紅的新創，2026 年初被 Meta 以超過 20 億美元收購，可以看出各大公司對這個市場的重視。

**選擇重點：**

- **雲端執行 vs. 在你電腦上執行**：雲端的好處是關機也能繼續跑、手機也能下指令；在本機執行的好處是可以直接處理你電腦裡的檔案，資料不必先上傳。
- **公司資料怎麼接進來**：這類產品預設看不到公司內部系統，要靠連接器或外掛授權。授權範圍越大，越要注意權限設定。
- **個人帳號 vs. 企業帳號**：員工用個人訂閱處理公司資料，是很常見的資安漏洞。正式使用前，建議統一採用有管理後台、且承諾不拿資料訓練模型的企業方案。

## 4. 辦公套件內建 Agent：權限跟著公司帳號走

如果公司已經全面使用 Microsoft 365 或 Google Workspace，這一類通常是阻力最小的選擇。

- **Microsoft 365 Copilot（Copilot Cowork）**：微軟在 2026 年 3 月與 Anthropic 合作推出，把 Claude Cowork 的技術整合進 Microsoft 365，6 月正式推出。可以處理排會議、準備會議簡報、整理研究資料這類跨 Outlook、Word、Excel、PowerPoint 的工作，執行過程中會在關鍵步驟停下來請使用者確認。
- **Gemini in Google Workspace**：Gemini 已內建在 Gmail、文件、試算表、簡報、雲端硬碟與 Meet 中，可以在任一個應用程式裡下指令，完成跨應用程式的任務。

這一類最大的優勢是**治理（governance）**：Agent 看得到什麼資料，取決於使用者本來就有的權限；操作紀錄、資料保留與合規政策，都沿用公司既有的管理設定。對 IT 人力有限的中小企業來說，這點往往比功能差異更重要。

缺點是**綁定生態系**：Copilot 處理 Google 文件、Gemini 處理 Office 檔案，體驗都不如在自家套件裡順暢。

## 5. 自建流程平台：把固定流程變成 Agent

前兩類是「人給指令，Agent 執行」；這一類則是**把公司固定的流程設計成 Agent**，讓它自動接單、自動處理。我們之前介紹的 [AI 客服](/blog/ai-customer-service-guide)，就屬於這一類。

| 平台 | 定位 | 適合 |
| --- | --- | --- |
| n8n | 流程自動化平台，以拖拉節點的方式串接各種系統，可在流程中放入 AI Agent | 需要串接很多系統的自動化流程，可自架 |
| Dify | 專注於 AI 應用的開發平台，內建知識庫（RAG）、對話管理與監控 | 客服機器人、內部知識問答這類「對話本身就是產品」的應用，可自架 |
| Copilot Studio（Microsoft） | 在 Microsoft 生態系內建立自訂 Agent | 已在用 Microsoft 365 與 Power Platform 的企業 |

**選擇重點：**

- **流程是不是夠固定**：「每天把新訂單整理成報表」適合；「幫我想想下季行銷策略」不適合，交給通用型助理比較好。
- **資料能不能出公司**：n8n 和 Dify 都可以架在公司自己的伺服器上，對資料有落地要求的產業特別重要。
- **誰來維護**：平台本身不貴，真正的成本是設計流程、測試、上線後持續調整的人力。

## 6. 程式開發 Agent：目前最成熟的一類

寫程式是 AI Agent 目前效果最明顯的領域，因為程式碼有一個很好的特性：**對不對可以自動驗證**——跑測試、編譯、執行，Agent 自己就能檢查結果、修正錯誤，完整走完「規劃 → 動手 → 檢查」的循環。

| 產品 | 使用方式 | 特色 |
| --- | --- | --- |
| Claude Code（Anthropic） | 終端機為主，也有桌面版與 IDE 外掛 | 擅長理解整個程式碼庫、處理跨多個檔案的複雜修改，可同時協調多個子代理（subagent） |
| Codex（OpenAI） | 終端機、ChatGPT 桌面版的 Codex 模式、雲端 | 適合交辦長時間任務、在雲端平行執行，稍後再回來檢查成果 |
| Antigravity（Google） | 以 Agent 為核心的開發平台與 Antigravity CLI | 2026 年起取代 Gemini CLI，主打多個 Agent 在背景非同步協作 |
| Cursor | 以 AI 為核心的程式編輯器 | 適合習慣在編輯器裡工作的開發者，補全、編輯與 Agent 整合在同一個介面 |
| GitHub Copilot | 編輯器外掛，以及 GitHub 上的 coding agent | 和 GitHub 流程整合最深：可以把 issue 直接指派給它，由它開 PR |

**選擇重點：**

- **團隊習慣在哪裡工作**：終端機派、編輯器派，還是以 GitHub issue 與 PR 為中心，會直接決定哪個工具最順手。
- **程式碼能不能交給雲端**：雲端執行方便平行處理，但程式碼與機密資料會離開公司環境，要先確認公司政策。
- **費用模型**：多數以訂閱制加用量上限計費，重度使用時差異很大，建議以實際專案試用一到兩週再決定。

對非工程背景的讀者，這一類也值得留意：很多「通用型助理」的能力，其實是從程式開發 Agent 演變而來的。例如 ChatGPT Work 就整合了 Codex 的技術，Claude Cowork 則源自 Claude Code 的架構。**今天工程師在用的工作方式，往往就是明年一般上班族的工作方式。**

## 7. 該從哪一種開始？

![該從哪一種 AI Agent 開始的決策流程：主要是寫程式、維護系統嗎？是的話選程式開發 Agent；否則再問，是固定、重複的流程，而且要串接公司系統嗎？是的話選自建流程平台；否則再問，公司主要用 Microsoft 365 或 Google Workspace 嗎？是的話選辦公套件內建 Agent，不是的話選通用型助理 Agent；不論哪一種，都先從低風險、結果容易檢查的任務開始](/content-images/blog/ai-agent-comparison/decision.webp "/content-images/blog/ai-agent-comparison/decision-mobile.webp")

實務上，大部分企業最後會**同時用到兩到三類**：員工日常用辦公套件或通用型助理，工程團隊用程式開發 Agent，客服或訂單處理這類固定流程再用自建平台做成自動化。

不論從哪一類開始，有三個原則是共通的：

1. **從低風險、容易檢查的任務開始**：整理資料、寫初稿、產生報表，錯了也看得出來、改得回來。先不要讓 Agent 直接寄信給客戶或動到正式資料。
2. **先想清楚權限**：Agent 能看到什麼、能改什麼、哪些動作一定要人確認，要在導入前就決定，而不是出事後才補。
3. **用自己的任務實測**：廣告上的展示都很漂亮，但只有拿你們每週真的要做的工作試一輪，才知道哪個產品適合。

## 結語：先選類型，再選品牌

AI Agent 的產品更新速度非常快，今天的功能差異，可能三個月後就被追上。但「在哪裡執行、能碰到哪些資料、誰來管它」這三個問題的答案，不會因為模型升級而改變，也是企業評估時最該先釐清的事。

接下來的系列文章，我們會分別深入每一類 Agent 的導入方式、費用試算與常見的坑。

如果你正在評估公司適合哪一種 AI Agent，可以從**導入診斷**開始：我們會盤點你們目前的工作流程、使用的系統與資料，建議最值得先交給 Agent 的任務，以及適合的產品組合。

## 參考資料

- OpenAI，〈[ChatGPT is now a partner for your most ambitious work](https://openai.com/index/chatgpt-for-your-most-ambitious-work/)〉，2026
- VentureBeat，〈[OpenAI introduces ChatGPT Work, a cloud-based AI agent that manages tasks across email, Slack and calendars](https://venturebeat.com/orchestration/openai-introduces-chatgpt-work-a-cloud-based-ai-agent-that-manages-tasks-across-email-slack-and-calendars)〉，2026
- Claude Help Center，〈[Use Claude Cowork on Team and Enterprise plans](https://support.claude.com/en/articles/13455879-use-claude-cowork-on-team-and-enterprise-plans)〉
- 9to5Mac，〈[Anthropic scales up with enterprise features for Claude Cowork and Managed Agents](https://9to5mac.com/2026/04/09/anthropic-scales-up-with-enterprise-features-for-claude-cowork-and-managed-agents/)〉，2026
- Microsoft，〈[Copilot Cowork: A new way of getting work done](https://www.microsoft.com/en-us/microsoft-365/blog/2026/03/09/copilot-cowork-a-new-way-of-getting-work-done/)〉，2026
- Google，〈[The Gemini app becomes more agentic, delivering proactive, 24/7 help](https://blog.google/innovation-and-ai/products/gemini-app/next-evolution-gemini-app/)〉，2026
- Google Developers Blog，〈[An important update: Transitioning Gemini CLI to Antigravity CLI](https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/)〉，2026
- OpenAI，〈[Codex for (almost) everything](https://openai.com/index/codex-for-almost-everything/)〉，2026
- CNBC，〈[Meta faces China probe over acquisition of AI agent startup Manus](https://www.cnbc.com/2026/01/08/china-investigate-meta-acquisition-manus-export.html)〉，2026
