---
title: "前沿模型是什麼？2026 Claude、GPT、Gemini、Grok 四大家族比較與企業選擇方式"
description: "Claude Opus 5.5、GPT-6 Astra、Gemini 4 Argon、Grok 4.7……前沿模型每幾個月就換一輪冠軍，企業到底該怎麼選？這篇先說明前沿模型是什麼、和 ChatGPT 這類產品差在哪，再整理四大家族的最新陣容、分級與價格，最後給出企業選擇的原則。"
date: "2026-10-07"
category: "產業觀察"
topic: "ai-models"
cover: "/content-images/blog/frontier-models-2026/cover.jpg"
coverAlt: "前沿模型比較：Claude、GPT、Gemini、Grok 四大家族怎麼選，示意圖為 2026 年 9 月四週內相繼推出的 GPT-6 Astra、Grok 4.7、Claude Opus 5.5 與 Gemini 4 Argon"
tags: ["大型語言模型", "生成式 AI", "工具比較"]
---

九月是 AI 圈特別熱鬧的一個月。短短四週內，四家公司相繼推出新模型，而且每一家都宣稱自己是「目前最強」：

| 日期 | 公司 | 推出的模型 |
| --- | --- | --- |
| 9 月 3 日 | OpenAI | GPT-6 Astra |
| 9 月 21 日 | xAI | Grok 4.7 |
| 9 月 22 日 | Anthropic | Claude Opus 5.5 |
| 9 月 22 日 | OpenAI | GPT-6 Sol、GPT-6 Luna |
| 9 月 28 日 | Anthropic | Claude Sonnet 5.5 |
| 9 月 29 日 | OpenAI | GPT-6.1 Sol |
| 9 月 30 日 | Google | Gemini 4 Argon |

客戶最常問我們的是：「Claude、ChatGPT、Gemini 到底哪個比較好？我們公司該選哪一個？」

先說結論：

> **前沿模型之間的能力差距，已經小到每幾個月就換一次冠軍。企業真正該比較的不是「誰最強」，而是「哪個生態系最貼近你的工作、資料能不能安心交出去、用哪一級的模型就夠」，並且保留隨時換模型的彈性。**

這篇是「AI 模型種類」系列的第一篇，先從最受關注的前沿模型開始；開源模型、小型模型與特定用途的模型，會在後續文章分別介紹。

*本文資訊截至 2026 年 10 月 7 日。模型更新非常快，數字與名稱請以各家官方公告為準。*

## 1. 什麼是前沿模型？

前沿模型（frontier model）指的是**各家 AI 公司能力最強、站在技術最前線的模型**。它們通常有四個共同特徵：

| 特徵 | 說明 |
| --- | --- |
| 訓練成本極高 | 動輒需要數萬到十萬張以上的 GPU（繪圖處理器，AI 運算的主要晶片）。例如 GPT-6 Astra 就是用超過 10 萬張 GPU 訓練的，全世界只有少數公司負擔得起 |
| 閉源（closed-source） | 模型本身不公開，只能透過官方的聊天產品，或 API（應用程式介面，讓你的系統用程式呼叫模型）使用 |
| 能力最全面 | 寫作、分析、寫程式、看圖、操作電腦都能做，也是各種 AI Agent 背後的「大腦」 |
| 更新很快 | 各家大約每兩到四個月就推出新版本，排行榜第一名經常易主 |

用汽車來比喻：前沿模型就像各車廠的**旗艦車款**，代表這家公司的最高技術水準。但就像不是每個人都需要開旗艦車，企業日常大部分的工作，也不一定需要用到最頂級的模型（第 5 節會再說明）。

## 2. 模型和產品不一樣：ChatGPT 不是模型

討論之前，先釐清一個常見的混淆：**你每天打開的 ChatGPT、Claude、Gemini，是「產品」；背後真正在思考的，是「模型」。**

![模型與產品的關係：Anthropic 的 Claude 模型（Fable、Opus、Sonnet、Haiku）用在 Claude App、Claude Code 與 Claude Cowork；OpenAI 的 GPT 模型（GPT-6 Astra、GPT-6.1 Sol、GPT-6 Luna）用在 ChatGPT 與 Codex；Google 的 Gemini 模型（Gemini 4 Argon、3.x Pro、Flash）用在 Gemini App 與 Google Workspace；同一個模型也能透過 API 或 AWS、Google Cloud、Azure 等雲端平台，接進企業自己的系統；Microsoft 365 Copilot 這類產品則會同時使用不同公司的模型](/content-images/blog/frontier-models-2026/model-vs-product.webp "/content-images/blog/frontier-models-2026/model-vs-product-mobile.webp")

| 你用的產品 | 公司 | 背後的模型 |
| --- | --- | --- |
| ChatGPT、Codex | OpenAI | GPT 系列（GPT-6 Astra、GPT-6.1 Sol 等） |
| Claude App、Claude Code、Claude Cowork | Anthropic | Claude 系列（Fable、Opus、Sonnet、Haiku） |
| Gemini App、Google Workspace | Google | Gemini 系列（Gemini 4 Argon、3.1 Pro、Flash 等） |
| Microsoft 365 Copilot | 微軟 | 同時使用 OpenAI 與 Anthropic 的模型 |

這個區分對企業很重要，原因有兩個：

1. **同一個模型，可以從很多地方用到。** 例如 Claude 的模型也能透過 AWS、Google Cloud、Microsoft Azure 使用。公司已經有雲端合約與資安審查的話，通常可以直接在上面用，不必另外簽約。
2. **產品好不好用，不只取決於模型。** 介面設計、能串接哪些工具、記憶與檔案管理方式都有影響。我們在 [AI Agent 比較](/blog/ai-agent-comparison) 一文中也提過：Agent 產品之間的差別，主要不在背後用哪個模型。

## 3. 四大家族的最新陣容（2026 年 10 月）

目前公認站在最前線的，主要是以下四家：

| 家族 | 公司 | 目前主力 | 一句話特色 |
| --- | --- | --- | --- |
| Claude | Anthropic | Fable 5.1、Opus 5.5 | 寫程式與長時間 Agent 任務最強，三大雲端都能用 |
| GPT | OpenAI | GPT-6 Astra、GPT-6.1 Sol | 使用者最多，主打操作電腦與專業工作 |
| Gemini | Google | Gemini 4 Argon、3.1 Pro | 多模態與長文本見長，Google Workspace 整合最深 |
| Grok | xAI | Grok 4.7 | 價格低，可搜尋 X 的即時內容 |

另外，Meta 也在 9 月擠進前沿行列，放在本節最後介紹。以下各家都用同樣的格式整理：**模型陣容 → 強項 → 要注意的地方**。

### Claude（Anthropic）

Claude 5 系列分成四個等級，由強到弱是 Fable、Opus、Sonnet、Haiku：

| 等級 | 模型 | 推出 | 重點 |
| --- | --- | --- | --- |
| 最高級 | **Fable 5.1** | 9 月 | 一般使用者能用到的最強 Claude，等級在 Opus 之上 |
| 旗艦 | **Opus 5.5** | 9 月 22 日 | 大部分工作已達 Fable 水準，成本比上一代低約 40% |
| 中階 | **Sonnet 5.5** | 9 月 28 日 | 速度快 30% 以上，部分程式測試勝過 Opus 5.5 |
| 輕量 | **Haiku 5.5** | 尚未推出 | 官方表示未來幾週推出 |

**強項：**

- **寫程式與長時間的 Agent 任務**：Claude Code 與 Claude Cowork 都建立在這個能力之上。
- **通路最廣**：同時上架 AWS、Google Cloud 和 Microsoft Azure，不論公司用哪一家雲端，都能在既有的合約與資安框架內使用。

**要注意：**

- Fable 有一個同模型、但限制較寬鬆的版本 **Claude Mythos 5.1**，只開放給通過審核的資安與生命科學機構。一般版的 Fable 遇到滲透測試、漏洞利用這類請求，會自動轉給 Opus 處理。
- 對多數企業來說，**Opus 5.5 或 Sonnet 5.5 就是性價比最好的選擇**，不一定要用到 Fable。

### GPT（OpenAI）

OpenAI 今年的節奏最快：3 月 GPT-5.4、4 月 GPT-5.5、7 月 GPT-5.6，9 月推出新一代 GPT-6。GPT-6 分成三個等級：

| 等級 | 模型 | 推出 | 重點 |
| --- | --- | --- | --- |
| 最高級 | **GPT-6 Astra** | 9 月 3 日 | 電腦操作、軟體工程、資安全面領先 |
| 旗艦 | **GPT-6.1 Sol** | 9 月 29 日 | 表現「幾乎追平 Astra」，價格只有五分之一 |
| 輕量 | **GPT-6 Luna** | 9 月 22 日 | 最快、最便宜，適合大量、單純的任務 |

**強項：**

- **GPT-6 Astra 全面領先**：在電腦操作、瀏覽器操作、軟體工程、資安與科學上都達到最先進水準，總裁 Greg Brockman 形容這是「世代級的躍進」。
- **使用者基礎最大**：ChatGPT 是全世界最多人用的 AI 產品，員工最熟悉、教育成本最低。
- **Agent 產品完整**：Codex 與 ChatGPT Work，讓 GPT 模型直接延伸到工作流程中。

**要注意：**

- **GPT-6.1 Sol 目前只在 ChatGPT Work 與 Codex 提供**給付費方案用戶，一般的 ChatGPT 對話介面還沒上線。
- 原本預期會推出的 **GPT-6.1 Astra 已取消**：據《華爾街日報》報導，原因是內部測試發現安全疑慮。
- 上一代 **GPT-5.6**（分成 Sol、Terra、Luna 三級）仍可使用，但新專案建議直接評估 GPT-6：GPT-6 Sol 推出時，價格就比 GPT-5.6 Sol 降了一半。

### Gemini（Google）

Google 的策略是「一個旗艦、很多台工作馬」：

| 等級 | 模型 | 推出 | 重點 |
| --- | --- | --- | --- |
| 最高級 | **Gemini 4 Argon** | 9 月 30 日 | 程式與資安大幅進步，能自動修補軟體漏洞 |
| 旗艦 | **Gemini 3.1 Pro** | 2 月 | 一般企業目前實際用得到的主力 |
| 中階 | **Gemini 3.8 Flash** | 9 月 2 日 | Google 的「工作馬」，快又便宜 |
| 輕量 | **Gemini 3.5 Flash-Lite** | 7 月 | 適合大量、即時性高的任務 |

**強項：**

- **最強的資安能力**：Gemini 4 Argon 特別針對資安防禦訓練，能自動找出、驗證並修補軟體漏洞；單次輸出上限也提高到 100 萬 token。
- **多模態**（multimodal）：同時看得懂文字、圖片、影片與聲音。
- **長文本**：一次可讀入約 100 萬個 token，大約是好幾本書的份量。
- **整合最深**：已內建在 Gmail、Google 文件、試算表與 Meet 裡，Gemini App 月活躍用戶超過 10 億。公司本來就用 Google Workspace 的話，幾乎是零門檻。

**要注意：**

- **Gemini 4 Argon 目前只開放給 Google 資安合作計畫的夥伴**，一般 API 與 Gemini App 都還用不到。

### Grok（xAI）

xAI 是馬斯克創立的 AI 公司，目前的主力是 9 月 21 日推出的 **Grok 4.7**：

| 項目 | 內容 |
| --- | --- |
| API 價格 | 每百萬 token 輸入 2 美元、輸出 6 美元，同等級中最便宜的一群 |
| 即時資訊 | 可直接搜尋 X（前 Twitter）上的貼文，適合需要掌握即時輿論的應用 |
| 上下文長度 | 50 萬 token，雖不及 Gemini，但足以處理大部分文件 |

**要注意**：在台灣企業的實務上，Grok 的普及度與企業管理功能仍不如前三家，比較常見的用法是在開發者工具（例如 Cursor）中使用，或在重視成本的應用中作為備選。

### 也值得留意：Meta Muse Spark

Meta 過去以開源的 Llama 系列聞名，今年改推閉源的 **Muse Spark** 系列：

| 項目 | 內容 |
| --- | --- |
| 最新版本 | Muse Spark 1.3（9 月 2 日推出） |
| 實力 | Meta 宣稱程式測試勝過 GPT-5.6 Sol 與 Claude Opus 5；在第三方綜合排名中僅次於前三大家族（見第 4 節） |
| API 價格 | 每百萬 token 輸入 1.25 美元、輸出 4.25 美元 |
| 取得方式 | 目前只有 Meta 自家的 API 與 Muse Code；Meta 表示之後會推出開放權重的版本 |

**要注意**：企業級管理功能與雲端平台通路都還在起步，比較適合先觀察、小規模試用。

## 4. 綜合實力排名：目前誰最強？

各家都說自己最強，那有沒有一個中立的比較？最常被引用的，是獨立評測機構 **Artificial Analysis** 的「智力指數」（Intelligence Index）：它把推理、知識、數學、科學、寫程式等多項測驗的成績，合成一個 0～100 的綜合分數，而且用同一套方法測所有模型。

以下是 2026 年 10 月 7 日查詢的排名（每個模型取它表現最好的設定）：

![前沿模型綜合實力排名長條圖（Artificial Analysis Intelligence Index，2026 年 10 月 7 日）：Claude Opus 5.5 58 分、Claude Sonnet 5.5 56 分、Claude Fable 5.1 53 分、GPT-6 Astra 53 分、Gemini 4 Argon 53 分、GPT-6.1 Sol 52 分，前六名只差 6 分；接著是 Meta Muse Spark 1.3 48 分、Grok 4.7 46 分、Kimi K3 44 分、Gemini 3.8 Flash 41 分、GPT-6 Luna 38 分、DeepSeek V4 Pro 36 分](/content-images/blog/frontier-models-2026/ranking.webp "/content-images/blog/frontier-models-2026/ranking-mobile.webp")

完整名次與各模型的等級如下：

| 名次 | 模型 | 公司 | 綜合分數 | 備註 |
| --- | --- | --- | --- | --- |
| 1 | **Claude Opus 5.5** | Anthropic | **58** | 旗艦 |
| 2 | **Claude Sonnet 5.5** | Anthropic | **56** | 中階 |
| 3 | **Claude Fable 5.1** | Anthropic | **53** | 最高級 |
| 3 | **GPT-6 Astra** | OpenAI | **53** | 最高級 |
| 3 | **Gemini 4 Argon** | Google | **53** | 最高級，目前有限開放 |
| 6 | GPT-6.1 Sol | OpenAI | 52 | 旗艦 |
| 7 | Muse Spark 1.3 | Meta | 48 | 旗艦 |
| 8 | Grok 4.7 | xAI | 46 | 旗艦 |
| 9 | Kimi K3 | 月之暗面 | 44 | 開源 |
| 10 | Gemini 3.8 Flash | Google | 41 | 中階 |
| 11 | GPT-6 Luna | OpenAI | 38 | 輕量 |
| 12 | DeepSeek V4 Pro | DeepSeek | 36 | 開源 |

從這張表可以看出幾件事：

- **前六名只差 6 分**：Anthropic、OpenAI、Google 的頂級模型幾乎並駕齊驅。這也是為什麼我們說「冠軍每幾個月就換一輪」，下一次新模型推出，排名很可能又會洗牌。
- **新一代的中階，可以勝過上一代的頂級**：Opus 5.5 與 Sonnet 5.5 都是 9 月下旬才推出的新世代，分數反而高過等級更高、但早幾週推出的 Fable 5.1。同樣地，Google 2 月推出的旗艦 Gemini 3.1 Pro 只有 30 分，已被 9 月的 3.8 Flash（41 分）超越。**看模型不能只看等級，也要看推出時間。**
- **開源模型已經進入同一張表**：Kimi K3 的分數已接近 Grok 4.7，和閉源前沿模型的差距正在縮小（第 7 節會再說明）。

> **怎麼看這張排名：綜合分數適合用來「縮小候選名單」，不適合直接拿來「決定用誰」。**
>
> 分數是在最高推理強度下測出來的，實際使用較低設定（較快、較便宜）時分數會比較低；而且標準化測驗不一定代表你的工作。建議從前幾名裡挑兩三個，再用公司自己的任務實測（見第 8 節）。

## 5. 不是只有「最強的那一個」：每一家都分等級

前面提到，每一家都同時提供好幾個等級的模型。把它們放在一起看會更清楚：

![前沿模型的分級：最高級是 Claude Fable 5.1、GPT-6 Astra、Gemini 4 Argon，能力最強但最貴，部分有限開放；旗艦級是 Claude Opus 5.5、GPT-6.1 Sol、Gemini 3.1 Pro、Grok 4.7，大多數專業工作的主力；中階是 Claude Sonnet、Gemini Flash（GPT-6 沒有中階）；輕量級是 Claude Haiku、GPT-6 Luna、Gemini Flash-Lite，速度最快、最便宜，適合大量、簡單、重複的任務](/content-images/blog/frontier-models-2026/tiers.webp "/content-images/blog/frontier-models-2026/tiers-mobile.webp")

為什麼要分等級？因為**越強的模型越貴、也越慢**。API 是以 token（AI 計算文字的單位，一個中文字大約是一到兩個 token）計費，不同等級的價格可以差到上百倍：

| 等級 | 模型 | 輸入 | 輸出 |
| --- | --- | --- | --- |
| 最高級 | Claude Fable 5.1 | 10 | 50 |
| 最高級 | GPT-6 Astra | 10 | 50 |
| 最高級 | Gemini 4 Argon | 4（首發優惠價 2） | 20（首發優惠價 10） |
| 旗艦 | Claude Opus 5.5 | 4 | 20 |
| 旗艦 | GPT-6.1 Sol | 2 | 10 |
| 旗艦 | Grok 4.7 | 2 | 6 |
| 旗艦 | Meta Muse Spark 1.3 | 1.25 | 4.25 |
| 中階 | Claude Sonnet 5.5 | 2 | 10 |
| 輕量 | GPT-6 Luna | 0.1 | 0.5 |

*單位：每百萬 token，美元。Gemini 4 Argon 的 API 尚未全面開放，首發優惠價未說明截止日期。實際費用還會受快取、長文本加價、批次處理折扣等因素影響。*

> **實務建議：先用中階或旗艦模型把流程跑通，再看哪些步驟可以換成更便宜的模型。**
>
> 例如一個 [AI 客服](/blog/ai-customer-service-architecture) 系統，「判斷客人問的是哪一類問題」這種簡單分類，用輕量模型就夠了；只有真正需要推理的複雜問題，才交給旗艦模型。這樣混用，成本往往能降到原本的幾分之一，品質卻差不多。

## 6. 新趨勢：最強的模型，不一定拿得到

今年出現了一個以前沒有的現象：**最強的模型，一推出就「有限開放」。**

| 公司 | 最強模型 | 目前開放對象 |
| --- | --- | --- |
| Anthropic | Claude Mythos 5.1 | 只開放給通過審核的資安與生命科學機構；一般版 Fable 有額外安全限制 |
| OpenAI | GPT-6 Astra | 先開放給資安防禦計畫 Daybreak 的成員，再逐步擴大到付費用戶與 API |
| Google | Gemini 4 Argon | 目前只開放給 Google 資安合作計畫的夥伴 |

原因很一致：這一代模型找出並利用軟體漏洞的能力已經強到，**落到攻擊者手中會造成實際危害**。所以各家選擇先讓防守方用，再逐步開放，並在高風險用途上加上限制。

這對企業有兩個實際意義：

1. **「最新的模型」不等於「你能用的模型」。** 看新聞時要留意它是正式推出、預覽，還是只開放給特定對象，以及在台灣能不能用。
2. **資安的攻防節奏變快了。** 攻擊者遲早也會拿到同等能力的工具，公司系統的更新與漏洞修補不能再拖。

## 7. 開源陣營正在快速追上

前沿模型以外，另一股不能忽視的力量是**開源模型**（open-weight model，公開模型本身、可以下載到自己的伺服器上執行）：

| 模型 | 公司 | 推出 |
| --- | --- | --- |
| Kimi K3 | 月之暗面（Moonshot AI） | 7 月公開完整模型 |
| DeepSeek V4 Pro | DeepSeek | 8 月 |

它們在多項測試中，已經和閉源前沿模型互有勝負，而且使用成本低得多。對資料不能出公司、或用量非常大的企業來說，開源模型是值得認真評估的選項。這部分我們會在系列的下一篇詳細介紹。

## 8. 企業該怎麼選前沿模型？

![企業選擇前沿模型的五個原則：一、先看公司已經在用哪個生態系（Microsoft 365、Google Workspace、哪家雲端）；二、確認資料治理，使用不拿資料訓練的企業方案；三、依任務選等級，簡單任務用輕量模型；四、保留切換彈性，不要把系統綁死在單一模型；五、用自己的任務實測，不要只看排行榜](/content-images/blog/frontier-models-2026/how-to-choose.webp "/content-images/blog/frontier-models-2026/how-to-choose-mobile.webp")

| 原則 | 具體做法 |
| --- | --- |
| **1. 先看生態系，再看模型** | 用 Microsoft 365 就從 Copilot 開始；用 Google Workspace 就從 Gemini 開始；已有 AWS 或 Azure 合約，就看上面有哪些模型。這通常是阻力最小、資安審查最快的路 |
| **2. 確認資料治理** | 一定要用企業方案（Business、Team、Enterprise），確認條款承諾不拿你的資料訓練模型，並有管理後台控管帳號。員工各自用個人帳號處理公司資料，是最常見的資安漏洞 |
| **3. 依任務選等級** | 寫信、摘要、分類用中階或輕量模型就很好；複雜分析、寫程式、長時間的 Agent 任務，才值得用旗艦 |
| **4. 保留切換彈性** | 開發自己的 AI 應用時，讓模型可以替換（例如透過統一的介面呼叫），不要把某一家的寫法散落在程式各處 |
| **5. 用自己的任務實測** | 排行榜是標準化測驗，不一定代表你的工作。挑三到五個每週真的要做的任務，讓兩三個模型各做一輪，結果往往一目了然 |

## 結語：與其追冠軍，不如打好隨時換車的基礎

九月短短四週，四家公司輪番推出新模型、各自宣稱第一。可以預見的是，三個月後這份名單又會換一輪。

對企業來說，比「現在選哪個最強」更重要的，是建立一套**換模型也不會傷筋動骨**的做法：

- 清楚的資料治理規範
- 可以替換模型的系統架構
- 一組能快速評估新模型的公司內部測試任務

有了這些，不論下一個冠軍是誰，你都能在幾天內判斷要不要換。

如果你正在評估公司該用哪一家的模型，或是想知道現有的 AI 應用能不能改用更便宜的模型，可以從**導入診斷**開始：我們會盤點你們目前的工作流程、使用的系統與資料規範，建議適合的模型組合與導入順序。

## 參考資料

- Anthropic，〈[Introducing Claude Opus 5.5](https://www.anthropic.com/claude-opus-5-5)〉，2026
- Anthropic，〈[Introducing Claude Fable 5.1 and Claude Mythos 5.1](https://www.anthropic.com/claude-fable-and-mythos-5-1)〉，2026
- TechCrunch，〈[Anthropic releases Opus 5.5 with lower prices and Fable-level performance](https://techcrunch.com/2026/09/22/anthropic-releases-opus-5-5-with-lower-prices-and-fable-level-performance/)〉，2026
- SiliconANGLE，〈[Anthropic debuts Claude Sonnet 5.5 running 30% faster than the previous-generation AI model](https://siliconangle.com/2026/09/28/anthropic-debuts-claude-sonnet-5-5-running-30-faster-than-the-previous-generation-ai-model/)〉，2026
- OpenAI，〈[GPT-6 Astra](https://openai.com/index/gpt-6-astra/)〉，2026
- Constellation Research，〈[OpenAI launches GPT-6 Astra](https://www.constellationr.com/insights/news/openai-launches-gpt-6-astra)〉，2026
- CNBC，〈[OpenAI announces rollout of GPT-6 Astra model](https://www.cnbc.com/2026/09/03/open-ai-astra-gpt-6-cyber.html)〉，2026
- TechCrunch，〈[OpenAI launches GPT-6.1 Sol, says it nearly matches GPT-6 Astra and costs less](https://techcrunch.com/2026/09/29/openai-launches-gpt-6-1-sol-says-it-nearly-matches-gpt-6-astra-and-costs-less/)〉，2026
- The New Stack，〈[OpenAI releases GPT-6 Sol and Luna — and cuts token prices in half](https://thenewstack.io/openai-gpt-6-sol-luna-release/)〉，2026
- Wikipedia，〈[GPT-5.6](https://en.wikipedia.org/wiki/GPT-5.6)〉
- TechCrunch，〈[Google releases Gemini 4 Argon, called its most powerful model yet](https://techcrunch.com/2026/09/30/google-releases-gemini-4-argon-called-its-most-powerful-model-yet/)〉，2026
- eesel AI，〈[Gemini 4 Argon: benchmarks, pricing, and how to get access](https://www.eesel.ai/blog/gemini-4-argon)〉，2026
- TechCrunch，〈[Google releases three new Gemini models — but no 3.5 Pro](https://techcrunch.com/2026/07/21/google-releases-three-new-gemini-models-but-no-3-5-pro/)〉，2026
- Wikipedia，〈[Gemini (language model)](https://en.wikipedia.org/wiki/Gemini_%28language_model%29)〉
- xAI Docs，〈[Grok 4.7](https://docs.x.ai/developers/grok-4-7)〉
- MarkTechPost，〈[SpaceXAI Releases Grok 4.7](https://www.marktechpost.com/2026/09/21/spacexai-releases-grok-4-7/)〉，2026
- Artificial Analysis，〈[LLM Leaderboard](https://artificialanalysis.ai/leaderboards/models)〉，2026 年 10 月 7 日查詢
- GIGAZINE，〈[Metaが「Muse Spark 1.3」を発表](https://gigazine.net/news/20260903-meta-muse-spark-1-3/)〉，2026
