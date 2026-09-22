// 報價金額只在這裡維護；價格卡、FAQ 與 JSON-LD 都由 plans 產生。
const plans = [
  { step: "STEP 01", amount: 15000, monthly: false, name: "導入診斷", offerName: "導入診斷", featured: false, desc: "先確認哪些流程值得導入、資料現況如何、預期能省下多少人力，再決定要不要做。費用可全額折抵後續導入專案。", faqNote: "費用可全額折抵後續導入專案", offerDesc: "流程盤點、資料現況與可行性評估、導入路線圖建議；費用可全額折抵後續導入專案。", items: ["1–2 次深度訪談與流程盤點", "資料現況與可行性評估", "導入優先順序建議", "導入路線圖與範圍建議書"] },
  { step: "STEP 02", amount: 80000, monthly: false, name: "方案導入", offerName: "方案導入", featured: true, desc: "從規格、開發、串接到試營運上線的完整導入，交付可驗收的系統。單一場景的起價，依串接系統數量與介面需求調整。", faqNote: "為單一場景的完整導入起價", offerDesc: "單一場景的完整導入起價，含規格、開發、串接、試營運與三個月程式錯誤保固。", items: ["需求規格與驗收標準", "系統開發與既有系統串接", "小範圍試營運與回答調校", "操作說明與團隊教育訓練", "三個月程式錯誤保固"] },
  { step: "STEP 03", amount: 5000, monthly: true, name: "持續維運", offerName: "持續維運（每月）", featured: false, desc: "上線之後才是開始。維持系統穩定、控制用量成本，並持續更新知識內容。三個月保固到期後開始計收。", faqNote: "自三個月保固到期後開始計收", offerDesc: "三個月保固到期後開始計收，涵蓋一般維護、用量監控與知識內容更新。", items: ["一般維護與運行協助", "用量與成本監控", "知識庫與提示內容更新", "新增功能另行報價"] },
];

const CN_NUM = ["零", "一", "二", "三", "四", "五", "六"];
const money = (n: number) => n.toLocaleString("en-US");
const unitLabel = (plan: (typeof plans)[number]) => (plan.monthly ? "／月起" : "起");
const priceLabel = (plan: (typeof plans)[number]) =>
  `${plan.monthly ? "每月 " : ""}NT$${money(plan.amount)} 起`;
const stageCount = CN_NUM[plans.length] ?? String(plans.length);
// 專案起價不計入月費方案
const minAmount = Math.min(...plans.filter((plan) => !plan.monthly).map((plan) => plan.amount));

const services = [
  { no: "01", icon: "KB", title: "企業知識庫問答", desc: "把內部文件、SOP、規章與產品資料變成可以直接提問的知識庫，回答附上來源出處，並支援權限分層。", items: ["文件自動切分與索引", "回答附出處可查核", "網頁、LINE、Slack 介面"] },
  { no: "02", icon: "AGT", title: "流程自動化與 AI Agent", desc: "讓 AI 代理接手報表整理、資料比對、跨系統查詢等重複性工作，並保留失敗重試與人工審核關卡。", items: ["多步驟任務編排", "既有系統 API 串接", "執行紀錄與審核機制"] },
  { no: "03", icon: "BOT", title: "AI 客服與 LINE 機器人", desc: "串接 LINE 官方帳號或網站客服，自動回覆常見問題、收單與預約，判斷處理不了時轉接真人。", items: ["LINE OA／網頁掛件", "意圖判斷與轉真人", "對話紀錄與成效統計"] },
  { no: "04", icon: "ADV", title: "AI 顧問與教育訓練", desc: "協助盤點哪些流程適合導入、工具與模型怎麼選、導入順序怎麼排，並為內部團隊做實作訓練。", items: ["流程盤點與可行性評估", "工具與模型選型", "團隊實作工作坊"] },
];

const capabilities = [
  { no: "C01", title: "檢索增強生成（RAG）", desc: "文件切分、向量索引、重新排序與來源引用，讓每一個回答都能追溯到原始文件，方便查核與稽核。", tags: ["向量資料庫", "Embedding", "Rerank", "來源引用"] },
  { no: "C02", title: "Agent 與工具呼叫", desc: "讓模型安全地呼叫內部 API 與資料庫，含權限控管、逾時處理、失敗重試與送出前的人工放行。", tags: ["Tool Use", "MCP", "任務編排", "人工審核"] },
  { no: "C03", title: "系統與資料串接", desc: "對接 ERP、CRM、Google Workspace、資料庫與既有 API，處理定時同步、資料清洗與報表輸出。", tags: ["REST API", "排程同步", "資料清洗", "報表輸出"] },
  { no: "C04", title: "多入口對話介面", desc: "LINE 官方帳號、網站掛件、Slack 與內部後台共用同一套後端，對話紀錄集中管理。", tags: ["LINE Messaging API", "Web Widget", "Slack"] },
  { no: "C05", title: "效果評測與調校", desc: "建立測試題庫與評分標準，比較不同模型與提示版本的表現，用數據決定哪一版可以上線。", tags: ["測試題庫", "版本比較", "準確率追蹤"] },
  { no: "C06", title: "部署、維運與資安", desc: "雲端或指定環境部署，搭配用量與成本監控、錯誤告警，以及存取權限與資料保留規則設定。", tags: ["雲端部署", "用量監控", "錯誤告警", "權限控管"] },
];

const portfolio = [
  { tag: "CRYPTO / RUST", title: "Alpharnold Quant Trading System", description: "面向 Binance Futures 的多策略量化交易引擎，7×24 無人值守運行，涵蓋即時行情、策略執行、下單、狀態回滾與部位對帳。", stats: [["6 個月", "實盤運行"], ["3 個", "管理交易對"]], features: ["多幣種、多策略併行", "斷線與失敗狀態回復", "交易所倉位自動對帳"], accent: "lime", image: "/portfolio/alpharnold-system.webp", alt: "Alpharnold 量化交易引擎系統架構與執行狀態展示", width: 1280, height: 720 },
  { tag: "DESKTOP APP / GPU + CPU", title: "Backtest Studio", description: "支援加密貨幣與台指期的桌面運算平台，把大量參數組合的運算工作自動化，並輸出可比較的結果與交易明細。", stats: [["30 秒", "跑完 6 年歷史回測"], ["5 位", "授權使用者"]], features: ["大量參數批次運算", "CPU / GPU 平行最佳化", "成本、滑價與轉倉模型"], accent: "blue", image: "/portfolio/backtest-studio.webp", alt: "Backtest Studio 實際授權登入與回測工作台畫面", width: 1280, height: 614 },
  { tag: "AUTOMATION / SHIOAJI API", title: "個股期貨自動下單機", description: "串接永豐金 Shioaji 的自動化交易系統，把原本人工盯盤的流程改成自動篩選、即時判斷與風控攔截。", stats: [["20 筆", "日均處理委託"], ["70%", "省下看盤時間"]], features: ["網頁化監控與參數調整", "模擬、訊號、正式分級執行", "委託回報與風控狀態機"], accent: "amber", image: "/portfolio/api-trade.webp", alt: "個股期貨下單機實際策略參數與監控介面", width: 1280, height: 720 },
];

const process = [
  ["01", "流程盤點", "釐清現在誰做什麼、花多少時間、資料放在哪裡，找出最適合先導入的環節。"],
  ["02", "範圍與報價", "把導入目標寫成可驗收的規格，列出系統範圍、串接對象與交付內容。"],
  ["03", "開發與試營運", "先以小範圍資料和真實情境試跑，驗證回答品質、處理成本與風險限制。"],
  ["04", "上線與維運", "完成教育訓練與驗收；交付日起提供三個月程式錯誤保固，並可接續維運。"],
];

const faq = [
  { q: "我們公司適合導入 AI 嗎？需要先準備什麼？", a: "只要流程中有重複性高、需要反覆查資料或人工整理的環節，就有導入空間。建議從導入診斷開始，我們會盤點流程、資料現況與可行性，再決定是否進入開發。資料不需要事先整理乾淨，資料整備本來就是導入工作的一部分。" },
  { q: "導入 AI 的費用怎麼計算？", a: `分成${stageCount}個階段報價：${plans.map((plan) => `${plan.name}${plan.monthly ? "" : " "}${priceLabel(plan)}，${plan.faqNote}`).join("；")}。實際費用依資料量、需要串接的系統數量、介面需求與部署方式確認。模型 API 的用量費用由供應商按量計收，不含在上述金額內。${stageCount}個階段也可以分開進行。` },
  { q: "導入一套方案大概要多久？", a: "導入診斷通常一到兩週；單一場景的導入方案多為數週到一個多月，實際時程依串接系統數量與資料整備狀況而定。我們會先做最快能看到效果的範圍，而不是一次全做。" },
  { q: "公司內部資料會外流嗎？", a: "可選擇不將資料用於模型訓練的商用 API 方案，或部署在你指定的雲端或內部環境。存取權限、紀錄保留期間與敏感欄位遮蔽規則，都會在規格階段一併確認並寫入文件。" },
  { q: "如果 AI 回答錯誤怎麼辦？", a: "知識庫問答會附上來源出處方便查核，並可設定在信心不足時轉由真人處理。上線前會用測試題庫評測回答品質，上線後持續追蹤並調整知識內容與提示。重要決策仍建議保留人工複核。" },
  { q: "可以接我們現有的系統嗎？", a: "可以。常見的 ERP、CRM、資料庫、Google Workspace、LINE 官方帳號與自有 API 都能串接。若某些系統沒有開放介面，會在診斷階段評估替代做法，例如以定期匯出檔案同步。" },
  { q: "保固範圍是什麼？", a: "保固期自專案驗收交付日起算三個月。在已確認的功能範圍、操作方式與執行環境下，可重現且由程式本身造成的錯誤、異常或與驗收規格不符，保固內免費修復。新增功能、第三方模型或 API 規格變更、來源資料品質、網路與主機故障等不在程式錯誤保固範圍內，另行評估報價。" },
  { q: "你們還有做交易系統開發嗎？", a: "有，持續承接。自動下單機、策略回測程式與客製化量化交易系統開發都仍在服務範圍內，歡迎直接來信說明市場、策略與執行方式。" },
];

const businessJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "諾秋工作室",
  alternateName: "Nordchiou Studio",
  url: "https://nordchiou.com/",
  logo: "https://nordchiou.com/logo.png",
  image: "https://nordchiou.com/og.png",
  description: "企業 AI 導入方案開發：知識庫問答（RAG）、流程自動化與 AI Agent、AI 客服與 LINE 機器人、AI 顧問與教育訓練，並提供客製化量化交易系統開發。",
  email: "nordchiou@gmail.com",
  telephone: "+886-926-192-178",
  taxID: "00884771",
  areaServed: { "@type": "Country", name: "Taiwan" },
  knowsLanguage: "zh-Hant",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "07:00",
      closes: "23:59",
    },
  ],
  priceRange: `NT$${money(minAmount)} 起`,
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "企業 AI 導入服務",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "企業知識庫問答（RAG）", description: "將內部文件、SOP 與產品資料建成可提問的知識庫，回答附來源出處並支援權限分層。" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "流程自動化與 AI Agent", description: "以 AI 代理處理報表整理、資料比對與跨系統查詢，含失敗重試與人工審核關卡。" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "AI 客服與 LINE 機器人", description: "串接 LINE 官方帳號或網站客服，自動回覆常見問題、收單與預約，必要時轉接真人。" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "AI 顧問與教育訓練", description: "流程盤點、可行性評估、工具與模型選型、導入路線圖規劃與團隊實作訓練。" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "客製化量化交易系統開發", description: "自動下單機、策略回測程式與券商、交易所 API 串接開發。" } },
      ...plans.map((plan) => ({
        "@type": "Offer",
        price: String(plan.amount),
        priceCurrency: "TWD",
        itemOffered: { "@type": "Service", name: plan.offerName, description: plan.offerDesc },
      })),
    ],
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

const MAIL = "mailto:nordchiou@gmail.com?subject=AI 導入方案諮詢";

export default function Home() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="nav-wrap">
        <nav className="nav shell" aria-label="主要導覽">
          <a className="brand" href="#top" aria-label="諾秋工作室首頁"><img className="brand-mark" src="/logo.png" alt="諾秋工作室標誌" width={42} height={42} /><span><strong>諾秋工作室</strong><small>AI SOLUTIONS</small></span></a>
          <div className="nav-links"><a href="#services">服務</a><a href="#capability">能力</a><a href="#work">實績</a><a href="#pricing">方案</a><a href="#warranty">保障</a><a href="#about">關於</a><a href="#faq">常見問題</a></div>
          <a className="nav-cta" href={MAIL}>討論導入 <span aria-hidden="true">↗</span></a>
        </nav>
      </div>

      <header className="hero shell" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span /> 知識庫・流程自動化・AI 客服</p>
          <h1>把 AI，裝進你<br />真正在跑的<span>日常流程。</span></h1>
          <p className="hero-lead">我們不交付展示用的 demo。從流程盤點、資料整備、模型選型，到系統串接、試營運與上線維運，替企業打造真正能用、能維護、能驗收的 AI 方案。</p>
          <div className="hero-actions"><a className="button line" href="https://lin.ee/65uAD7mm" target="_blank" rel="noopener">加 LINE 諮詢 <span>↗</span></a><a className="button primary" href={MAIL}>預約導入診斷 <span>→</span></a><a className="button secondary" href="#capability">看我們的能力</a></div>
          <div className="market-list" aria-label="核心方案"><span>KNOWLEDGE BASE</span><i /><span>AI AGENT</span><i /><span>AUTOMATION</span></div>
        </div>
        <div className="terminal" aria-label="AI 導入流程示意面板">
          <div className="terminal-top"><div className="window-dots"><i /><i /><i /></div><span>agent_runtime / live</span><b>CONNECTED</b></div>
          <div className="ticker-row"><div><small>PIPELINE</small><strong>RAG + AGENT</strong></div><div><small>SOURCE</small><strong>內部文件</strong></div><div><small>STATUS</small><strong className="positive">RUNNING</strong></div></div>
          <div className="flow" aria-hidden="true">
            <div className="grid-lines" />
            <div className="flow-step"><i>01</i><strong>文件匯入</strong><small>SOP / 報價 / 合約</small></div>
            <div className="flow-step"><i>02</i><strong>切分與索引</strong><small>EMBEDDING</small></div>
            <div className="flow-step"><i>03</i><strong>語意檢索</strong><small>TOP-K + RERANK</small></div>
            <div className="flow-step"><i>04</i><strong>生成回答</strong><small>附來源出處</small></div>
            <div className="flow-step done"><i>05</i><strong>人工審核關卡</strong><small>可選</small></div>
          </div>
          <div className="terminal-log"><p><span>09:03:18</span> retrieve docs <b>MATCH 5</b></p><p><span>09:03:19</span> tool call erp_query <b>OK</b></p><p><span>09:03:20</span> answer with sources <b>DONE</b></p></div>
        </div>
      </header>

      <section className="proof-strip"><div className="shell proof-grid"><div><strong>4</strong><span>核心導入方案</span></div><div><strong>3</strong><span>自建上線系統</span></div><div><strong>3 個月</strong><span>程式錯誤保固</span></div><div><strong>分階段</strong><span>診斷、導入、維運</span></div></div></section>

      <section className="section shell" id="services">
        <div className="section-heading split"><div><p className="kicker">WHAT WE BUILD</p><h2>四種把 AI<br />接進公司的方式</h2></div><p>不賣訂閱制的罐頭工具。依照你實際的流程、資料與既有系統，打造能驗證、可監控、能維護的專屬方案。</p></div>
        <div className="service-grid quad">
          {services.map((service) => (
            <article key={service.no}>
              <span className="service-no">{service.no}</span>
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
              <ul>{service.items.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>

      <section className="cap-section" id="capability"><div className="shell section">
        <div className="section-heading split"><div><p className="kicker">CAPABILITIES</p><h2>我們實際<br />交付得出來的東西</h2></div><p>與其列客戶名單，不如直接說清楚技術範圍與交付內容。每一項都能獨立拆出來驗收，也能組合成完整方案。</p></div>
        <div className="cap-grid">
          {capabilities.map((cap) => (
            <article className="cap-card" key={cap.no}>
              <span className="cap-no">{cap.no}</span>
              <h3>{cap.title}</h3>
              <p>{cap.desc}</p>
              <div className="cap-tags">{cap.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            </article>
          ))}
        </div>
      </div></section>

      <section className="work-section" id="work"><div className="shell section">
        <div className="section-heading"><p className="kicker">ENGINEERING TRACK RECORD</p><h2>我們自己做出來、<br />而且還在跑的系統</h2><p>導入 AI 之前，我們已經在做必須即時反應、不能停、出錯就是真金白銀的系統。同樣的工程標準——穩定、可監控、可回復——直接沿用到 AI 專案上。</p></div>
        <div className="portfolio-list">{portfolio.map((item,index)=><article className={`portfolio-card ${item.accent}`} key={item.title}><div className="portfolio-index">0{index+1}</div><div className="portfolio-visual"><label className="portfolio-zoom" htmlFor={`lb${index}`}><img src={item.image} alt={item.alt} width={item.width} height={item.height} loading="lazy" /><span className="zoom-hint" aria-hidden="true">⤢ 點擊放大</span></label></div><div className="portfolio-main"><span>{item.tag}</span><h3>{item.title}</h3><p>{item.description}</p><div className="portfolio-stats">{item.stats.map(([num,label])=><div key={label}><strong>{num}</strong><span>{label}</span></div>)}</div><ul>{item.features.map(feature=><li key={feature}>{feature}</li>)}</ul></div></article>)}</div>
        <p className="work-note">交易系統開發（自動下單機、策略回測、API 串接）仍在服務範圍內，歡迎來信詢問。</p>
        {portfolio.map((item,index)=><div key={item.title}>
          <input type="checkbox" id={`lb${index}`} className="lightbox-toggle" aria-label={`放大檢視 ${item.title} 截圖`} />
          <label htmlFor={`lb${index}`} className="lightbox"><img src={item.image} alt={item.alt} loading="lazy" /><span className="lightbox-close">✕ CLOSE</span></label>
        </div>)}
      </div></section>

      <section className="section shell" id="pricing">
        <div className="section-heading split"><div><p className="kicker">ADOPTION PLANS</p><h2>依導入階段<br />分級報價</h2></div><p>先確認範圍，再談金額。{stageCount}個階段可以分開進行——完成{plans[0].name}後，再決定要不要進入開發。</p></div>
        <div className="pricing-wrap">
          {plans.map((plan) => (
            <div className={`price-card${plan.featured ? " featured" : ""}`} key={plan.step}>
              <p>{plan.step}</p>
              <h3><small>NT$</small>{money(plan.amount)}<i>{unitLabel(plan)}</i></h3>
              <span>{plan.name}</span>
              <p className="plan-desc">{plan.desc}</p>
              <ul>{plan.items.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          ))}
        </div>
        <p className="pricing-example"><b>報價方式</b>以上為起價。實際費用依資料量、串接系統數量、介面需求與部署方式確認，<strong>完成導入診斷後提供正式報價</strong>；模型 API 的用量費用由供應商按量計收，不含在上述金額內。</p>
      </section>

      <section className="warranty-section" id="warranty"><div className="shell section warranty-grid">
        <div className="warranty-copy"><p className="kicker">SERVICE TERMS</p><h2>保固的是系統品質，<br />調整與優化清楚計價。</h2><p>保固期自專案驗收交付日起算三個月。為避免認知落差，以下範圍會寫入專案確認內容。</p><a href="mailto:nordchiou@gmail.com?subject=索取 AI 導入方案說明與服務條款">索取完整方案說明 <span>→</span></a></div>
        <div className="warranty-card">
          <div className="warranty-row included"><span>✓</span><div><h3>保固內免費修復</h3><p>在已確認的功能範圍、操作方式與執行環境下，可重現且由程式本身造成的錯誤、異常或與驗收規格不符。</p></div></div>
          <div className="warranty-row change"><span>↻</span><div><h3>知識內容與提示調整</h3><p>上線後的知識庫文件更新、提示詞微調與回答調校，依調整範圍與頻率報價；維運方案內含一定額度的例行更新。</p></div></div>
          <div className="warranty-row excluded"><span>—</span><div><h3>不屬於程式錯誤保固</h3><p>新增功能或場景、第三方模型與 API 的規格變更或費率調整、來源資料品質、網路與主機故障、帳號權限、非約定環境或不當操作所造成的問題，另行評估報價。</p></div></div>
          <div className="warranty-row risk"><span>!</span><div><h3>AI 使用風險聲明</h3><p>生成式 AI 仍可能產生不正確或不完整的內容。系統會盡可能附上來源出處並提供審核機制，但重要決策仍須由人工複核；模型供應商的服務條款、費率與可用性由其自行調整，不在本工作室控制範圍內。</p></div></div>
        </div>
      </div></section>

      <section className="section shell process-section"><div className="section-heading"><p className="kicker">HOW WE WORK</p><h2>四步驟，讓導入可驗收</h2></div><div className="process-grid">{process.map(([no,title,desc])=><article key={no}><span>{no}</span><h3>{title}</h3><p>{desc}</p></article>)}</div></section>

      <section className="section shell about-section" id="about">
        <div className="section-heading split">
          <div><p className="kicker">WHO WE ARE</p><h2>懂 AI，<br />也懂你流程的團隊</h2></div>
          <p>諾秋工作室從量化交易系統起家，長期處理即時資料、外部 API 串接，以及不能停機的系統。我們把同樣的工程標準帶進 AI 導入——交付的不是展示用的 demo，而是能長期運作、可維護、可驗收的系統。</p>
        </div>
        <div className="about-stats">
          <div><strong>6 年</strong><span>軟體開發經歷</span></div>
          <div><strong>3 年</strong><span>金融業經歷</span></div>
          <div><strong>3 套</strong><span>自建上線系統</span></div>
        </div>
      </section>

      <section className="section shell faq-section" id="faq">
        <div className="section-heading"><p className="kicker">FAQ</p><h2>常見問題</h2></div>
        <div className="faq-list">{faq.map(({q,a})=><details key={q}><summary>{q}<span aria-hidden="true">+</span></summary><p>{a}</p></details>)}</div>
      </section>

      <section className="cta-section"><div className="shell cta-inner"><div><p className="kicker">LET&apos;S START</p><h2>你的流程，<br />我們幫你交給 AI。</h2><p>來信簡述你想改善的流程、目前的做法，以及資料放在哪裡，我們會回覆可行的導入方式與下一步。</p></div><div className="contact-actions"><a className="button line" href="https://lin.ee/65uAD7mm" target="_blank" rel="noopener">加 LINE 諮詢 <span>↗</span></a><a className="button primary" href={MAIL}>nordchiou@gmail.com <span>↗</span></a><a href="tel:0926192178">0926-192-178</a><small>服務時間：週一至週日 07:00–24:00</small><span className="line-qr"><img src="/line-qr.png" alt="諾秋工作室 LINE 官方帳號 QR code" width={110} height={110} loading="lazy" /><small>掃描加 LINE</small></span></div></div></section>
      <footer className="footer shell"><div className="brand"><img className="brand-mark" src="/logo.png" alt="諾秋工作室標誌" width={42} height={42} /><span><strong>諾秋工作室</strong><small>NORDCHIOU STUDIO</small></span></div><p>統一編號 00884771</p><p>© 2026 諾秋工作室. All rights reserved.</p></footer>
    </main>
  );
}
