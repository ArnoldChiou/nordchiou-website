---
title: "同時開好幾個 AI 助理怎麼管？Herdr 介紹與 Windows、Mac 安裝教學"
description: "我每天同時讓 Claude Code、Codex 等多個 AI 助理一起工作，靠的是一個叫 Herdr 的終端機工作區管理工具。這篇介紹 Herdr 是什麼、解決什麼問題、我實際怎麼配置，以及從安裝到第一次使用的完整步驟。"
date: "2026-10-10"
category: "技術實作"
topic: "ai-workflow"
tags: ["AI Agent", "Claude Code", "Codex", "工具介紹"]
---

常有人問我：「你平常到底怎麼用 AI 工作？」

我的答案通常讓對方有點意外：我很少只開一個 AI 對話視窗，而是**同時讓好幾個 AI 助理各自做事**：一個在改網站程式、一個在產生圖片、一個在幫我檢查文章有沒有錯，另一個專案的 AI 則在背景跑別的任務。

問題是，AI 一多，管理就變成新的麻煩：

- 視窗開了一堆，不知道哪個 AI 做完了、哪個卡在那邊等我按「同意」。
- 不小心關掉視窗，跑到一半的工作就斷了。
- 要請 A 檢查 B 的成果，只能自己在兩個視窗之間複製貼上。

先說結論：

> **Herdr 是專門用來「管理一群 AI 助理」的終端機工作區工具。它把每個 AI 放進同一個畫面的不同格子裡，即時標示誰在工作、誰在等你、誰已經做完；關掉視窗工作也不會中斷；AI 之間還可以透過它互相交辦工作。它開源免費，Windows、Mac、Linux 都能用，安裝只要一行指令。**

這篇是「我的 AI 工作方式」系列的第一篇，先從我每天打開電腦第一個啟動的工具開始。

*本文資訊截至 2026 年 10 月 10 日，以 Herdr 0.9 版為準。工具更新很快，指令如有出入請以[官方文件](https://herdr.dev/docs/)為準。*

## 1. Herdr 是什麼？

### 先認識「終端機」

Claude Code、Codex 這類「程式開發 AI 助理」（coding agent，詳見〈[AI Agent 是什麼？](/blog/ai-agent-comparison)〉），大多是在**終端機**（terminal）裡執行的：就是那個黑底白字、用打字下指令操作電腦的視窗。Windows 上的 PowerShell、Mac 上的「終端機」App 都是。

在終端機裡，AI 助理可以直接讀寫你電腦上的檔案、執行程式、跑測試，所以能完成的事情遠比網頁版的聊天機器人多。

### Herdr：AI 助理的「監控中心」

Herdr 屬於一種叫「終端機多工器」（terminal multiplexer）的工具：**在一個視窗裡切出好幾個格子，每格都是一個獨立的終端機**。工程師圈很早就有 tmux 這類工具，Herdr 的不同之處在於，它是**專門為 AI 助理設計的**。

用比喻來說：如果每個 AI 助理是一位員工，Herdr 就像一間有監視螢幕牆的辦公室，加上一位會主動通報的秘書：

- **螢幕牆**：所有 AI 都在同一個畫面裡，各占一格，一眼看完。
- **狀態燈號**：側邊欄即時顯示每個 AI 現在的狀態。
- **秘書通報**：某個 AI 卡住需要你決定時，Herdr 會發通知提醒你。
- **辦公室不關門**：你下班（關掉視窗）後，員工繼續做事；回來重新打開，畫面原封不動。

Herdr 偵測到的 AI 狀態有這幾種：

| 狀態 | 意思 | 你該做什麼 |
| --- | --- | --- |
| `working` | 正在工作 | 不用管它 |
| `blocked` | 卡住了，需要你回答問題或同意某個操作 | **優先處理** |
| `done` | 做完了，你還沒看過 | 去看成果 |
| `idle` | 閒置中，等待下一個指令 | 可以交辦新工作 |
| `unknown` | Herdr 無法判斷 | 點進去看一下 |

### 基本資料

| 項目 | 說明 |
| --- | --- |
| **價格** | 免費，開源（Apache-2.0 授權，可商用） |
| **支援系統** | Windows、macOS、Linux |
| **支援的 AI 助理** | Claude Code、Codex、Gemini CLI、Cursor Agent CLI、GitHub Copilot CLI、OpenCode、Kimi Code CLI、Qwen Code 等二十多種（狀態偵測與對話恢復的支援程度依各 AI 而異） |
| **怎麼操作** | 滑鼠點擊、拖曳就能用；熟練後也可以用快捷鍵 |
| **技術特性** | 以 Rust 撰寫，不需要另外安裝 Node.js 之類的執行環境，在你原本的終端機裡執行 |

Herdr 本身**不是** AI，也不會取代 Claude Code 或 Codex。它只負責「管理這些 AI 所在的終端機」，你原本怎麼用那些 AI，裝了 Herdr 之後還是一樣。

## 2. 它解決了我哪些問題？

### 問題一：不知道哪個 AI 在等我

AI 助理在執行比較敏感的操作前（例如刪除檔案、執行陌生指令），會停下來問「可以嗎？」。以前我開四、五個視窗，常常某個 AI 等了二十分鐘我才發現。

Herdr 的側邊欄會把**所有專案**的 AI 狀態都列出來。只要看到 `blocked`，我就知道該去哪裡處理，不用一個一個視窗點開檢查。

### 問題二：關掉視窗，工作就斷了

一般情況下，終端機視窗一關，裡面的 AI 就跟著結束。Herdr 的架構分成兩部分：

- **伺服器**（server）：在背景執行，真正負責保管所有終端機和 AI。
- **畫面**（client）：你看到的那個視窗，只是「連上」伺服器去看。

所以關掉畫面只是「離開」（detach），背景的 AI 會繼續做完手上的工作。下次輸入 `herdr` 重新連上，所有格子和進度都還在。

就算電腦重開機，背景程式真的被關掉了，Herdr 也會記住原本的版面配置。若有安裝對應的整合（下面安裝步驟會說明），對於支援的 AI，它還能**重新啟動並接回原本的對話**，不用從頭交代。不過要注意，重開機後原本正在執行的程式與做到一半的操作已經結束，接回的是「對話紀錄」，不是接續原本跑到一半的工作。

### 問題三：AI 之間沒辦法互相合作

這是我覺得 Herdr 最有價值的地方。Herdr 提供一套指令，**讓 AI 也能操作 Herdr**：AI 可以查看隔壁格子在做什麼、在隔壁格子執行指令，甚至直接把工作交辦給另一個 AI，並等它做完再讀取結果。

例如我請 Claude 寫完一篇文章後，它可以自己對隔壁的 Codex 說「幫我檢查這篇文章的事實與數字」，等 Codex 回報後再根據意見修改。整個過程我只要看結果就好，不用在兩個視窗之間複製貼上。

## 3. 我實際的配置方式

### 一個專案一個工作區

Herdr 有三層結構：

| 層級 | 說明 | 我的用法 |
| --- | --- | --- |
| **工作區**（workspace） | 最上層的容器，通常一個專案一個 | 公司官網一個、客戶專案一個 |
| **分頁**（tab） | 工作區裡的不同版面 | 大多只用一個分頁 |
| **窗格**（pane） | 分頁裡的每一個格子，都是獨立的終端機 | 每個 AI、每個指令列各占一格 |

以我寫這個官網的工作區為例，畫面切成三格：

```text
┌──────────────────────────┬────────────────────┐
│                          │                    │
│   Claude Code            │   Codex            │
│   主力：寫文章、改程式   │   配圖、交叉審稿   │
│                          │                    │
│                          │                    │
├──────────────────────────┤                    │
│   指令列：開發伺服器     │                    │
└──────────────────────────┴────────────────────┘
```

- **左上：Claude Code**。我主要對話的對象，負責寫文章、改網站程式、規劃工作。
- **右邊：Codex**。負責產生封面與圖表，以及在文章發布前做第二輪事實查核。用不同公司的模型互相檢查，比較容易抓到單一模型的盲點。
- **左下：指令列**。用來跑本機預覽網站的開發伺服器，Claude 改完東西後可以自己來這裡重開伺服器、讀錯誤訊息。

另一個客戶專案在第二個工作區，也有自己的 Claude。我切到哪個專案，就只看到那個專案的格子；但側邊欄會同時顯示兩個專案的狀態，所以我在寫官網時，也知道另一邊的 AI 是不是做完了。

### 讓 Claude 指揮 Codex

AI 之間的交辦，背後其實就是 Herdr 的指令。例如 Claude 要請隔壁名叫 `codex` 的 AI 做事，會執行類似這樣的指令：

```bash
herdr agent prompt codex "幫我檢查 content/blog/xxx.md 的事實與數字，只列出需要修改的地方" --wait
```

`--wait` 的意思是「送出後等對方停下來」：可能是做完了，也可能是卡住需要有人回答或批准。所以 Claude 會先用 `herdr agent read codex` 讀取畫面內容，確認 Codex 是真的做完、還是在等人處理，再決定下一步。這些指令我自己幾乎不會打，都是 AI 照著 Herdr 提供的「技能說明」自己操作的（安裝方式見下一節的步驟 5）。

## 4. 安裝步驟

以下以 Windows 為主，Mac 與 Linux 的差異會另外標示。

### 步驟 0：事前準備

- **一個好用的終端機**：Windows 建議使用 Windows Terminal（Windows 11 內建，Windows 10 可從 Microsoft Store 免費安裝）；Mac 用內建的「終端機」即可，也可以用 iTerm2、Ghostty 等。
- **至少一個 AI 助理**：例如已經安裝好 Claude Code 或 Codex，並且在終端機輸入 `claude` 或 `codex` 能正常啟動。Herdr 只負責管理，不包含 AI 本身。

### 步驟 1：安裝 Herdr

**Windows**：打開 PowerShell，貼上這行並按 Enter：

```powershell
powershell -ExecutionPolicy Bypass -c "irm https://herdr.dev/install.ps1 | iex"
```

如果公司電腦的防毒或資安軟體擋下這個指令，可以改開「命令提示字元」（cmd）執行：

```cmd
curl.exe -fsSLo install.cmd https://herdr.dev/install.cmd && install.cmd && del install.cmd
```

**Mac / Linux**：打開終端機，執行：

```bash
curl -fsSL https://herdr.dev/install.sh | sh
```

Mac 上已經在用 Homebrew 的話，也可以用 `brew install herdr`。

> 這類「一行安裝」指令會從網路下載程式並直接執行。如果是公司電腦，建議先確認符合內部資安規範；也可以到 [GitHub 發布頁面](https://github.com/herdrdev/herdr/releases)手動下載。Windows 版下載的是 ZIP 壓縮檔，裡面除了 `herdr.exe` 還有它需要的配套檔案，請整個資料夾一起解壓縮保留，不要只複製 `herdr.exe`。另外，Herdr 的 Windows 版目前沒有數位簽章，第一次執行時可能跳出 SmartScreen 警告。

### 步驟 2：確認安裝成功

**關掉終端機再重新打開**（讓系統讀到新的程式路徑），然後輸入：

```bash
herdr --version
```

看到類似 `herdr 0.9.3` 的版本號就代表安裝成功。如果出現「找不到指令」，通常重開一次終端機就能解決。

### 步驟 3：安裝 AI 整合（建議）

Herdr 不需要額外設定就能偵測 AI 狀態，但安裝「整合」（integration）之後，**電腦重開機或 Herdr 重新啟動時，它可以重新啟動支援的 AI 並接回原本的對話**：

```bash
herdr integration install claude
herdr integration install codex
```

只需安裝你有在用的那幾個。裝完可以用這個指令確認：

```bash
herdr integration status
```

看到 `claude: current` 之類的字樣就代表整合檔案已經裝好。也可以在 Herdr 的設定畫面裡，從「整合」分頁一鍵安裝。

整合是在 AI 啟動時載入的，所以建議**先裝整合、再啟動 AI**。如果 AI 已經開著，先存好工作、把它關掉重開，整合才會生效。

### 步驟 4：第一次啟動

先切換到你的專案資料夾，再啟動 Herdr：

```bash
cd C:\my-project
herdr
```

第一次啟動時（還沒有任何工作區），Herdr 會自動以這個資料夾建立第一個工作區；之後再執行 `herdr`，則是重新連上原本的畫面，不會因為你換了資料夾就自動新增工作區（要新增工作區可按 `Ctrl+B` → `Shift+N`）。接著在格子裡直接啟動你的 AI 助理：

```bash
claude
```

這時左側的側邊欄就會出現這個 AI，並顯示它目前的狀態。想再開一格放其他 AI，在格子上按**滑鼠右鍵**選擇分割即可，不用記任何快捷鍵。

### 步驟 5：讓 AI 學會操作 Herdr（進階）

想要第 2 節提到的「AI 互相交辦工作」，需要把 Herdr 官方提供的「技能說明檔」（skill）安裝給你的 AI。這個檔案是一份給 AI 看的操作手冊，教它怎麼查看、建立格子，以及怎麼跟其他 AI 溝通：

```bash
npx skills add herdrdev/herdr --skill herdr -g
```

這行指令需要電腦已安裝 Node.js。`-g` 代表裝到全域，所有專案都能用；拿掉 `-g` 則只裝在目前的專案。

安裝後，在 Herdr 的格子裡啟動 Claude Code，就可以直接用中文對它說：「在右邊開一格，啟動 Codex，請它幫我審查這次的修改。」

### 步驟 6：個人化設定（可選）

設定檔位置：

- Windows：`%APPDATA%\herdr\config.toml`
- Mac / Linux：`~/.config/herdr/config.toml`

例如我把配色主題換成 Dracula：

```toml
[theme]
name = "dracula"
```

改完存檔後執行 `herdr server reload-config` 套用。想看所有可調整的項目，可以執行 `herdr --default-config`。

## 5. 日常操作：滑鼠就夠用

Herdr 的設計是**以滑鼠為主**：點格子切換、拖曳邊框調整大小、按右鍵開選單、用滑鼠選取文字就會自動複製。剛開始完全不用學快捷鍵。

熟悉之後，可以學這幾個最常用的。以下是預設的快捷鍵：先按「前置鍵」`Ctrl+B`，**放開**，再按功能鍵（前置鍵與每個快捷鍵都可以在設定檔自訂）：

| 動作 | 按鍵 |
| --- | --- |
| 往右分割一格 | `Ctrl+B` → `v` |
| 往下分割一格 | `Ctrl+B` → `-` |
| 開新分頁 | `Ctrl+B` → `c` |
| 切換工作區 | `Ctrl+B` → `w` |
| 放大／還原目前這格 | `Ctrl+B` → `z` |
| 離開（AI 繼續在背景工作） | `Ctrl+B` → `q` |
| 查看所有快捷鍵 | `Ctrl+B` → `?` |

為什麼要先按前置鍵？因為格子裡的程式本身也會用到很多組合鍵（例如 `Ctrl+C` 是中斷），Herdr 只占用一個按鍵，就不會跟它們搶。

幾個要記得的指令：

| 指令 | 作用 |
| --- | --- |
| `herdr` | 啟動，或重新連上原本的畫面 |
| `herdr update` | 更新到最新版（限用官方安裝指令安裝的；用 Homebrew 安裝的請改用 `brew upgrade herdr`） |
| `herdr server stop` | **完全關閉** Herdr，所有格子裡的程式都會結束，平常不需要用 |

## 6. Windows 使用者的注意事項

Herdr 一開始是為 Mac 和 Linux 設計的，Windows 版目前已正式支援，但有幾個地方要注意：

- **中文輸入法的選字框位置可能跑掉**：在預設設定下，注音、倉頡等輸入法的選字框可能出現在錯誤的位置。如果很困擾，可以在設定檔加上下面這段，代價是游標偶爾會閃爍或跳動：

  ```toml
  [ui]
  host_cursor = "native"
  ```

- **貼上文字用 `Ctrl+Shift+V`**：在 Windows Terminal 裡，多行文字會被當成一整段貼上，不會被逐行執行。
- **在 PowerShell 用 `cd` 切換資料夾後，Herdr 不一定能即時得知**：新開格子時可能還是用舊的資料夾。建議一個專案一個工作區，從專案資料夾啟動。
- **從剪貼簿貼圖片給 AI**：在 Windows 本機能不能直接貼圖，取決於你用的終端機和 AI 助理，不一定每種組合都能成功。

## 7. 適合誰用？

| 情境 | 建議 |
| --- | --- |
| 偶爾用 AI 問問題、寫寫信 | 不需要，網頁版或桌面版 App 就夠了 |
| 常用 Claude Code、Codex 等工具，一次只開一個 | 可以先試試「關掉視窗不中斷」這個功能，就很值得 |
| 同時開兩個以上 AI 助理，或同時處理多個專案 | **非常推薦**，狀態總覽會大幅減少等待與遺漏 |
| 想讓不同 AI 分工、互相審查 | **非常推薦**，Herdr 原生支援 AI 之間互相交辦工作 |

## 結語：管理 AI，也是一種工作方式

AI 助理越來越強之後，我發現瓶頸常常不是 AI 不夠聰明，而是**我同時管不了那麼多個**。Herdr 解決的就是這一段：讓我像主管看團隊進度表一樣，隨時知道每個 AI 在做什麼、誰需要我，並讓它們彼此合作。

這套「一個人帶一群 AI」的模式，不只適合工程師。很多企業正在評估的 AI 導入，本質上也是同一個問題：**AI 要放在哪個環節、由誰監督、做錯了誰負責、不同工具之間怎麼銜接**。

如果你的團隊也開始同時使用多個 AI 工具，想建立一套可管理、可追蹤的工作流程，可以從**導入診斷**開始：我們會盤點你們目前的工作流程與工具，建議適合的 AI 分工方式與管理機制。

## 參考資料

- Herdr，〈[官方網站與文件](https://herdr.dev/docs/)〉，2026 年 10 月 10 日查詢
- Herdr，〈[Install Herdr](https://herdr.dev/docs/install/)〉
- Herdr，〈[Quick start](https://herdr.dev/docs/quick-start/)〉
- Herdr，〈[Concepts](https://herdr.dev/docs/concepts/)〉
- Herdr，〈[Keyboard](https://herdr.dev/docs/keyboard/)〉
- Herdr，〈[Integrations](https://herdr.dev/docs/integrations/)〉
- Herdr，〈[Agent skill file](https://herdr.dev/docs/agent-skill/)〉
- Herdr，〈[Session state and restore](https://herdr.dev/docs/session-state/)〉
- Herdr，〈[Windows support](https://herdr.dev/docs/windows-beta/)〉
- herdrdev，〈[herdr GitHub 原始碼](https://github.com/herdrdev/herdr)〉，Apache-2.0 授權
