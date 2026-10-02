---
title: "OpenClaw、Hermes Agent 怎麼選？2026 開源自架 AI Agent 比較與安全指南"
description: "OpenClaw 爆紅之後，Hermes Agent、NanoClaw、ZeroClaw、Nanobot 一一出現。這篇說明這類「住在你電腦上」的開源 AI Agent 是什麼、五個主流專案差在哪，以及安裝前一定要先做好的安全設定。"
date: "2026-10-02"
category: "產業觀察"
cover: "/content-images/blog/open-source-ai-agents/cover.jpg"
coverAlt: "OpenClaw、Hermes Agent 怎麼選：開源自架 AI Agent 比較與安全指南，示意圖為使用者在通訊軟體請 Agent 每天早上 8 點整理產業新聞，Agent 回覆已建立排程任務"
tags: ["AI Agent", "OpenClaw", "開源"]
---

2026 年初，一隻「龍蝦」讓整個 AI 圈陷入瘋狂。開源專案 OpenClaw 在一月底單日暴增兩萬多顆 GitHub 星，很多人特地買一台 Mac mini，只為了讓它 24 小時待命：在 Telegram 傳一句話，它就幫你回信、整理檔案、查資料、定時寄報告。

緊接著，Hermes Agent、NanoClaw、ZeroClaw、Nanobot 這些替代品一一出現；同一時間，惡意技能、大量暴露在網路上的實例、政府禁用令，也讓「安全」成為討論這類工具時繞不開的話題。

先說結論：

> **這幾個開源 Agent 的功能越來越像，真正的差別在「安全預設」與「誰來維護」。它們很適合個人與技術團隊實驗，但要放進公司正式使用，得用管理伺服器的標準來管理它。**

如果你想看的是 ChatGPT Work、Copilot Cowork 這類商業產品，可以參考上一篇〈[AI Agent 是什麼？2026 主流 AI Agent 比較](/blog/ai-agent-comparison)〉；這篇專門談開源、自架的這一類。

## 1. 這類 Agent 和 ChatGPT 有什麼不同？

![開源自架 AI Agent 的運作方式：你從 Telegram、WhatsApp、Slack、Discord、LINE 下指令，訊息進到你自己電腦或伺服器上的 Gateway 閘道，再交給 Agent 核心；Agent 核心有記憶、技能、排程與工具，透過 API 呼叫 Claude、GPT、DeepSeek 或本地模型思考，然後動手操作檔案、終端機、瀏覽器、Email 與行事曆](/content-images/blog/open-source-ai-agents/how-it-works.webp "/content-images/blog/open-source-ai-agents/how-it-works-mobile.webp")

ChatGPT、Claude 這類服務跑在廠商的雲端，你打開網頁或 App 才會用到它。OpenClaw 這一類則是**裝在你自己的電腦或伺服器上、24 小時待命的程式**，幾個共同特徵：

- **從通訊軟體下指令**：不用打開特定網站，直接在 Telegram、WhatsApp、Slack、Discord 傳訊息給它。OpenClaw 也有 LINE 外掛，台灣使用者可以直接從 LINE 指揮它。
- **模型自己選**：程式本身不含 AI 模型，而是透過 API 接上 Claude、GPT、DeepSeek，或是跑在自己機器上的本地模型。換模型只要改設定。
- **有長期記憶**：記得你的偏好、之前做過的事，對話紀錄與設定都存在你自己的機器上。
- **技能（skill）擴充**：每個技能是一個資料夾，裡面寫好指令與說明，教它怎麼做某件事，例如「整理發票」、「發布部落格文章」。
- **排程執行**：可以設定「每天早上 8 點整理新聞」、「每週一彙整上週銷售數字」，不用每次都有人下指令。
- **真的能動手**：讀寫檔案、執行終端機指令、操作瀏覽器、收發 Email。

最後一點是它最大的價值，也是最大的風險：**它擁有你給它的所有權限，而且是在你看不到的時候執行。**

## 2. 五個主流專案比較

![五個主流開源自架 AI Agent：OpenClaw 由 OpenClaw 基金會維護，以 TypeScript 開發，生態最大、通道最多，有技能市集 ClawHub；Hermes Agent 由 Nous Research 以 Python 開發，主打長期記憶並會從經驗自己寫技能；NanoClaw 以 TypeScript 開發，每個 Agent 跑在獨立容器，以 Claude Agent SDK 打造；ZeroClaw 以 Rust 開發，單一執行檔、極省資源，高風險操作預設要確認；Nanobot 由香港大學 HKUDS 以 Python 開發，核心精簡易讀，適合學習與二次開發](/content-images/blog/open-source-ai-agents/landscape.webp "/content-images/blog/open-source-ai-agents/landscape-mobile.webp")

| 專案         | 開發者          | 語言       | GitHub 星數 | 最大特色                             | 安全預設                                           |
| ------------ | --------------- | ---------- | ----------- | ------------------------------------ | -------------------------------------------------- |
| OpenClaw     | OpenClaw 基金會 | TypeScript | 約 39 萬    | 生態最大、通道與技能最多             | 主要對話的工具預設直接在主機上執行，沙箱需自行設定 |
| Hermes Agent | Nous Research   | Python     | 約 25 萬    | 長期記憶、會自己寫技能               | 指令需確認，可選 Docker、SSH 等隔離環境            |
| NanoClaw     | 開源社群        | TypeScript | —           | 程式碼極少，以 Claude Agent SDK 打造 | 每個 Agent 跑在獨立容器，只看得到明確掛載的資料夾  |
| ZeroClaw     | 開源社群        | Rust       | 約 3.3 萬   | 單一執行檔、極省資源                 | 預設「監督模式」：中風險要確認、高風險直接封鎖     |
| Nanobot      | 香港大學 HKUDS  | Python     | 約 4.9 萬   | 核心精簡易讀、提供 OpenAI 相容 API   | 沒有完整的沙箱設計，適合在受信任的環境使用         |

_星數為 2026 年 10 月初 GitHub 上的數字，僅反映熱門程度，不代表品質。五個專案皆為 MIT 或 MIT／Apache 2.0 授權，可商用。_

### OpenClaw：開創者，生態最大

由奧地利工程師 Peter Steinberger 開發，2025 年底以 **Clawdbot** 之名推出。2026 年 1 月因為名稱和 Claude 太像，收到 Anthropic 的商標疑慮，先改名 Moltbot（龍蝦「蛻殼」），三天後再改成現在的 OpenClaw。2 月 Steinberger 宣布加入 OpenAI，專案轉由非營利的 OpenClaw 基金會維護；8 月底推出 2.0 版，大幅簡化安裝與介面。

**優點**是生態最完整：支援的通訊軟體最多（WhatsApp、Telegram、Slack、Discord、Signal、iMessage，以及 LINE 外掛等），有技能市集 ClawHub、各平台的原生 App，網路上的教學與社群討論也最多。騰訊等中國企業也推出了以 OpenClaw 為基礎的服務。

**缺點**是程式碼龐大、安全預設偏寬鬆，這部分在第 3 節詳談。

### Hermes Agent：會「成長」的 Agent

開源模型團隊 Nous Research 在 2026 年 2 月推出，口號是「與你一起成長的 Agent」。最大的特色是**學習迴圈**：完成任務後，它會把做法整理成可重複使用的技能，下次遇到類似的事直接套用，並在使用中持續修正；搭配跨對話的全文搜尋與使用者偏好模型，用得越久越懂你。

其他值得注意的設計：

- **七種執行環境**：本機、Docker、SSH 遠端主機，以及 Modal、Daytona 等雲端沙箱，可以把「動手」的部分和你的電腦隔開。
- **模型選擇彈性**：可接 OpenAI、OpenRouter 上的數百個模型或自訂端點。
- **一鍵從 OpenClaw 搬家**：內建遷移指令，可以匯入 OpenClaw 的設定、記憶與技能。
- **原生支援 Windows**：有 PowerShell 一行安裝，不必先裝 WSL。

如果你想要 OpenClaw 那種「什麼都能做」的完整度，但希望架構更乾淨，Hermes 是目前最接近的選擇。

### NanoClaw：安全優先的極簡版

NanoClaw 的作者直接點出 OpenClaw 的問題：將近 50 萬行程式碼、53 個設定檔、70 多個相依套件，沒有人真的看得完。NanoClaw 的做法是**只保留一個程序和少數幾個檔案**，並建構在 Anthropic 的 Claude Agent SDK 上。

它的安全模型很直接：**每個 Agent 都跑在獨立的 Linux 容器裡，只能看到你明確掛載進去的資料夾**。權限邊界由作業系統的容器隔離保證，而不是靠程式內部的權限檢查。通訊軟體方面也支援 WhatsApp、Telegram、Slack、Teams、微信等。

適合：在意安全、能接受以 Claude 為主要模型的使用者。

### ZeroClaw：用 Rust 寫的輕量版

ZeroClaw 用 Rust 開發，編譯成單一執行檔，資源占用極低，適合長期跑在低規格的主機上，還支援 GPIO 等硬體介面，適合物聯網應用。

安全設計上，它的預設自主程度是**監督模式（supervised）**：中風險操作需要你確認、高風險操作直接封鎖，並搭配作業系統層級的沙箱（Linux 的 Landlock、Bubblewrap，macOS 的 Seatbelt，或 Docker）。支援 30 多種通訊管道。

適合：想在低規格機器或邊緣裝置上長期運行的使用者。

### Nanobot：適合學習與二次開發

由香港大學數據智能實驗室（HKUDS）開發，核心是一個精簡、可讀的 Agent 迴圈，支援長期記憶、MCP、多 Agent 協作、排程，以及 OpenAI 相容的 API 與 Python SDK，方便整合進自己的系統。

但它**沒有完整的沙箱設計**，比較適合當作學習 Agent 原理的範本，或是在受信任的內部環境裡二次開發。

## 3. 安全：這一類工具最該先談的事

OpenClaw 在 2026 年初幾乎是以「安全事件」的速度爆紅：

- **惡意技能**：2026 年 2 月，資安公司 Koi Security 檢查了技能市集 ClawHub 上的 2,857 個技能，發現 **341 個是惡意程式**，其中 335 個來自同一波攻擊。它們偽裝成加密貨幣錢包、交易機器人、YouTube 工具、Google Workspace 整合等熱門功能，誘導使用者執行指令或下載檔案，最後在電腦上植入竊取密碼與資料的惡意軟體。
- **大量實例暴露在網路上**：多份資安調查發現，有數萬台 OpenClaw 的管理介面直接暴露在公開網路，其中不少沒有設定任何驗證。
- **預設權限寬鬆**：依官方說明，主要對話的工具預設**直接在主機上執行**，除非你自己設定沙箱。
- **政府禁用**：2026 年 3 月，中國限制國營企業、政府機關與銀行在辦公電腦上使用 OpenClaw，理由包括資料外洩與未經授權刪除資料的風險。
- **擅自行動**：同年 2 月，有使用者發現自己的 OpenClaw 在沒有明確授權的情況下，替他在一個實驗性的 AI 交友平台上建立了個人檔案。

這些問題不是 OpenClaw 獨有，而是**所有「能動手、會自己跑」的 Agent 共通的風險**。差別只在預設值：有些專案預設把門關好，有些預設把門打開，要你自己記得關。

![安裝開源 AI Agent 前先做好的 6 件事：一、用獨立的機器或容器，不要裝在存有公司資料的主力電腦；二、打開沙箱隔離，OpenClaw 預設工具直接在主機上執行；三、不要把管理介面公開到網路，曾有數萬台因此暴露；四、只裝看得懂的技能，ClawHub 曾被發現 341 個惡意技能；五、專用帳號、最小權限，不要交出主要信箱與網銀；六、關鍵動作要人確認，寄信、刪檔、付款前先停下來](/content-images/blog/open-source-ai-agents/security.webp "/content-images/blog/open-source-ai-agents/security-mobile.webp")

具體來說：

1. **用獨立的機器或容器**：不要裝在存有公司資料、網銀登入、密碼管理器的主力電腦上。一台專用的小主機、虛擬機或雲端主機，出事時影響範圍有限。
2. **打開沙箱隔離**：OpenClaw 要自己設定；Hermes 選 Docker 或 SSH 執行環境；NanoClaw、ZeroClaw 預設就有隔離。
3. **不要把管理介面公開到網路**：需要從外面連回去，用 VPN 或 Tailscale 這類私有網路，而不是直接開放連接埠。
4. **只裝看得懂的技能**：技能本質上就是會被執行的指令。安裝前打開來看一遍，特別小心要求你「先執行某段指令」或「先下載某個檔案」的技能。
5. **專用帳號、最小權限**：給它一個專用的 Email 和雲端硬碟帳號，而不是你的主要帳號；API 金鑰設定用量上限。
6. **關鍵動作要人確認**：寄信給外部、刪除檔案、付款、對外發文，都設定成需要你按下確認。

## 4. 該選哪一個？

| 你的情況                                     | 建議                              |
| -------------------------------------------- | --------------------------------- |
| 想要功能最完整、教學最多、要接 LINE          | OpenClaw（務必做好第 3 節的設定） |
| 想要長期使用、越用越聰明，或從 OpenClaw 搬家 | Hermes Agent                      |
| 最在意安全，主要用 Claude                    | NanoClaw                          |
| 要跑在低規格主機或物聯網裝置               | ZeroClaw                          |
| 想學 Agent 原理，或整合進自己的 Python 系統  | Nanobot                           |

### 企業適合直接用嗎？

我們的建議是：**很適合拿來實驗，但不建議直接讓員工各自安裝、接上公司帳號。**

這類工具的設計出發點是「一個人、一台機器、完全信任自己」，缺少企業需要的東西：集中管理誰能用、統一的權限控管、完整的操作紀錄、資料外洩防護。當每個員工都在自己電腦上跑一個擁有信箱權限的 Agent，IT 部門其實看不到它們在做什麼。

比較穩健的做法是：

- **先由技術人員在隔離環境中試用**，找出真正有價值的使用情境。
- **確認情境後，再評估做法**：需要全公司使用、接觸敏感資料的，考慮有管理後台的商業產品（如上一篇介紹的 Copilot Cowork、Claude Cowork 企業版）；流程固定、需要串接內部系統的，則可以參考這些開源專案的設計，做成有權限控管與紀錄的正式系統。

## 結語：先把門關好，再讓它進來

OpenClaw 的爆紅證明了一件事：大家想要的不只是一個會聊天的 AI，而是一個**真的會幫你做事、隨時待命**的助理。這個方向不會退燒，商業公司也正在快速跟進。

但「會做事」的另一面是「會做錯事」。選擇哪一個開源專案，重要性遠不如**怎麼部署它**：放在哪台機器、給它哪些權限、哪些動作要人確認。這三件事想清楚，這類工具就能是很有用的助手；沒想清楚，它就是你親手開的一扇後門。

如果你的團隊正在評估是否導入這類 AI Agent，歡迎從**導入診斷**開始：我們會協助盤點適合交給 Agent 的工作、評估開源與商業方案的取捨，並規劃安全的部署方式。

## 參考資料

- OpenClaw，[GitHub 專案頁](https://github.com/openclaw/openclaw)與[LINE 通道說明文件](https://docs.openclaw.ai/channels/line)
- Wikipedia，〈[OpenClaw](https://en.wikipedia.org/wiki/OpenClaw)〉
- Trending Topics，〈[Clawdbot Becomes Moltbot After Anthropic Trademark Issue](https://www.trendingtopics.eu/clawdbot-moltbot-anthropic/)〉，2026
- Nous Research，[Hermes Agent GitHub 專案頁](https://github.com/NousResearch/hermes-agent)
- NanoClaw，[GitHub 專案頁](https://github.com/qwibitai/nanoclaw)
- ZeroClaw，[GitHub 專案頁](https://github.com/zeroclaw-labs/zeroclaw)
- HKUDS，[Nanobot GitHub 專案頁](https://github.com/HKUDS/nanobot)
- The Hacker News，〈[Researchers Find 341 Malicious ClawHub Skills Stealing Data from OpenClaw Users](https://thehackernews.com/2026/02/researchers-find-341-malicious-clawhub.html)〉，2026
- Palo Alto Networks Unit 42，〈[OpenClaw's Skill Marketplace and the Emerging AI Supply Chain Threat](https://unit42.paloaltonetworks.com/openclaw-ai-supply-chain-risk/)〉
- Pinggy，〈[Best OpenClaw Alternatives in 2026](https://pinggy.io/blog/best_openclaw_alternatives/)〉
