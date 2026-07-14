const portfolio = [
  { tag: "CRYPTO / RUST", title: "Alpharnold Quant Trading System", description: "面向 Binance Futures 的多策略量化交易引擎，涵蓋即時行情、策略執行、下單、狀態回滾與部位對帳。", features: ["多幣種、多策略併行", "斷線與失敗狀態回復", "交易所倉位自動對帳"], accent: "lime", image: "/portfolio/alpharnold-system.webp", alt: "Alpharnold 量化交易引擎系統架構與執行狀態展示", width: 1280, height: 720 },
  { tag: "BACKTEST / GPU + CPU", title: "Backtest Studio", description: "支援加密貨幣與台指期的桌面回測平台，讓使用者自行調整參數、比較策略，並輸出績效與交易明細。", features: ["突破、均線", "CPU / GPU 參數最佳化", "成本、滑價與轉倉模型"], accent: "blue", image: "/portfolio/backtest-studio.webp", alt: "Backtest Studio 實際授權登入與回測工作台畫面", width: 1280, height: 614 },
  { tag: "STOCK FUTURES / SHIOAJI", title: "個股期貨下單機", description: "串接永豐金 Shioaji 的個股期貨交易系統，具備盤前篩選、即時訊號、風控、委託狀態與持倉管理。", features: ["網頁化監控與參數調整", "模擬、訊號、正式下單分級", "委託回報與風控狀態機"], accent: "amber", image: "/portfolio/api-trade.webp", alt: "個股期貨下單機實際策略參數與監控介面", width: 1280, height: 720 },
];

const process = [
  ["01", "需求拆解", "確認市場、券商或交易所、資料來源、進出場邏輯與執行環境。"],
  ["02", "規格與報價", "把策略條件寫成可驗收規格，列出策略數量、系統範圍與交付內容。"],
  ["03", "開發與模擬", "先完成資料、回測或模擬下單，逐步驗證訊號、成本與風險限制。"],
  ["04", "交付與保固", "完成操作說明與驗收；交付日起提供三個月程式錯誤保固。"],
];

const faq = [
  { q: "開發一套下單機或回測程式的費用怎麼計算？", a: "專案啟動費 NT$20,000，每一條策略加收 NT$5,000。一條策略的專案起價為 NT$25,000；報價範例：啟動費 NT$20,000 加 2 條策略 NT$10,000，共 NT$30,000。實際金額依資料來源、API、介面與部署難度確認。" },
  { q: "支援哪些市場與券商、交易所？", a: "支援台灣股票、期貨與加密貨幣市場，包含永豐金 Shioaji 個股期貨下單、Binance Futures 量化交易引擎，以及台指期與加密貨幣的策略回測。" },
  { q: "保固範圍是什麼？", a: "保固期自專案驗收交付日起算三個月。在已確認的功能範圍、操作方式與執行環境下，可重現且由程式本身造成的錯誤、異常或與驗收規格不符，保固內免費修復。新增功能、第三方 API 規格變更、資料品質、網路與主機故障等不在程式錯誤保固範圍內，另行評估報價。" },
  { q: "策略邏輯改動怎麼收費？", a: "保固期內每次 NT$1,000，保固期外每次 NT$3,000。每次改動的範圍與驗收方式於施工前確認。" },
  { q: "保固到期後的維護費用是多少？", a: "三個月保固到期後，每月維護費 NT$1,000，涵蓋既有系統的一般維護與運行協助；新增功能另行報價。" },
  { q: "開發流程是什麼？", a: "四個步驟：一、需求拆解，確認市場、券商或交易所、資料來源、進出場邏輯與執行環境；二、規格與報價，把策略條件寫成可驗收規格；三、開發與模擬，先完成資料、回測或模擬下單，逐步驗證；四、交付與保固，完成操作說明與驗收，交付日起提供三個月程式錯誤保固。" },
];

const businessJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "諾秋工作室",
  alternateName: "Nordchiou Studio",
  url: "https://nordchiou.com/",
  logo: "https://nordchiou.com/logo.png",
  image: "https://nordchiou.com/og.png",
  description: "專注股票、期貨、加密貨幣的自動下單機、策略回測與客製化量化交易系統開發。",
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
  priceRange: "NT$20,000 起",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "交易系統開發服務",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "自動下單機開發", description: "串接券商或交易所 API，處理即時行情、進出場、委託回報、持倉同步、斷線重連與風控。" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "策略回測程式開發", description: "將策略規則轉成可重複驗證的回測引擎，納入手續費、滑價、口數與市場制度。" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "客製化策略整合", description: "將 TradingView、Python、Excel 或人工規則程式化，補齊風控並接上下單流程。" } },
      { "@type": "Offer", price: "20000", priceCurrency: "TWD", itemOffered: { "@type": "Service", name: "專案啟動費" } },
      { "@type": "Offer", price: "5000", priceCurrency: "TWD", itemOffered: { "@type": "Service", name: "每一條策略" } },
      { "@type": "Offer", price: "1000", priceCurrency: "TWD", itemOffered: { "@type": "Service", name: "保固後每月維護費" } },
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

export default function Home() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <nav className="nav shell" aria-label="主要導覽">
        <a className="brand" href="#top" aria-label="諾秋工作室首頁"><img className="brand-mark" src="/logo.png" alt="諾秋工作室標誌" width={42} height={42} /><span><strong>諾秋工作室</strong><small>TRADE SYSTEMS</small></span></a>
        <div className="nav-links"><a href="#services">服務</a><a href="#work">作品</a><a href="#pricing">報價</a><a href="#warranty">保固</a><a href="#faq">常見問題</a></div>
        <a className="nav-cta" href="mailto:nordchiou@gmail.com?subject=交易系統專案諮詢">討論專案 <span aria-hidden="true">↗</span></a>
      </nav>

      <header className="hero shell" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span /> 股票・期貨・加密貨幣</p>
          <h1>把交易策略，<br />做成<span>真正能跑</span>的系統。</h1>
          <p className="hero-lead">我們是一支專注於下單機與回測程式的開發團隊。從策略規格、歷史驗證、風控，到 API 串接與正式執行，替你的交易流程打造可靠工具。</p>
          <div className="hero-actions"><a className="button primary" href="mailto:nordchiou@gmail.com?subject=交易系統專案諮詢">開始討論需求 <span>→</span></a><a className="button secondary" href="#work">查看實作案例</a></div>
          <div className="market-list" aria-label="支援市場"><span>TAIWAN STOCKS</span><i /><span>FUTURES</span><i /><span>CRYPTO</span></div>
        </div>
        <div className="terminal" aria-label="交易系統示意面板">
          <div className="terminal-top"><div className="window-dots"><i /><i /><i /></div><span>strategy_engine / live</span><b>CONNECTED</b></div>
          <div className="ticker-row"><div><small>MARKET</small><strong>TXF</strong></div><div><small>LAST</small><strong>23,842</strong></div><div><small>STATUS</small><strong className="positive">RUNNING</strong></div></div>
          <div className="chart" aria-hidden="true"><div className="grid-lines" /><div className="bars">{[36,52,43,68,57,75,61,86,70,92,78,105,94,118,109,132,120,146].map((h,i)=><i key={i} style={{height:`${h}px`}} className={i%4===0?"down":"up"} />)}</div><span className="chart-label one">ENTRY</span><span className="chart-label two">TRAILING +2.8%</span></div>
          <div className="terminal-log"><p><span>09:03:18</span> signal validated <b>LONG</b></p><p><span>09:03:19</span> risk guard <b>PASS</b></p><p><span>09:03:20</span> order status <b>FILLED</b></p></div>
        </div>
      </header>

      <section className="proof-strip"><div className="shell proof-grid"><div><strong>3</strong><span>實作系統案例</span></div><div><strong>3</strong><span>主要市場類型</span></div><div><strong>3 個月</strong><span>程式錯誤保固</span></div><div><strong>客製</strong><span>策略與執行流程</span></div></div></section>

      <section className="section shell" id="services">
        <div className="section-heading split"><div><p className="kicker">WHAT WE BUILD</p><h2>從想法到可執行的<br />交易工具</h2></div><p>不販售罐頭策略。我們根據你的規則、資料與交易環境，打造能夠驗證、監控、維護的專屬系統。</p></div>
        <div className="service-grid">
          <article><span className="service-no">01</span><div className="service-icon">ORD</div><h3>自動下單機</h3><p>串接券商或交易所 API，處理即時行情、進出場、委託回報、持倉同步、斷線重連與風控。</p><ul><li>股票 / 期貨 / 加密貨幣</li><li>模擬與正式環境</li><li>監控面板與通知</li></ul></article>
          <article><span className="service-no">02</span><div className="service-icon">BT</div><h3>策略回測程式</h3><p>將策略規則轉成可重複驗證的回測引擎，納入手續費、滑價、口數與市場制度。</p><ul><li>單組參數與最佳化</li><li>績效、明細與圖表</li><li>自備資料格式整合</li></ul></article>
          <article><span className="service-no">03</span><div className="service-icon">API</div><h3>客製化策略整合</h3><p>已有 TradingView、Python、Excel 或人工規則？我們協助定義訊號、補齊風控並接上下單流程。</p><ul><li>既有策略程式化</li><li>多策略與多商品</li><li>既有系統擴充</li></ul></article>
        </div>
      </section>

      <section className="work-section" id="work"><div className="shell section">
        <div className="section-heading"><p className="kicker">SELECTED WORK</p><h2>已落地的交易系統</h2><p>不是概念展示，而是針對真實市場流程設計的完整作品。</p></div>
        <div className="portfolio-list">{portfolio.map((item,index)=><article className={`portfolio-card ${item.accent}`} key={item.title}><div className="portfolio-index">0{index+1}</div><div className="portfolio-visual"><img src={item.image} alt={item.alt} width={item.width} height={item.height} loading="lazy" /></div><div className="portfolio-main"><span>{item.tag}</span><h3>{item.title}</h3><p>{item.description}</p><ul>{item.features.map(feature=><li key={feature}>{feature}</li>)}</ul></div></article>)}</div>
      </div></section>

      <section className="section shell" id="pricing">
        <div className="section-heading split"><div><p className="kicker">CLEAR PRICING</p><h2>報價簡單，範圍先說清楚</h2></div><p>實際金額依資料來源、API、介面與部署難度確認；以下為標準專案的基本計價方式。</p></div>
        <div className="pricing-wrap">
          <div className="price-card featured"><p>PROJECT START</p><h3><small>NT$</small>20,000</h3><span>專案啟動費</span><ul><li>需求與策略規格拆解</li><li>系統基礎架構</li><li>操作介面與交付說明</li><li>三個月程式錯誤保固</li></ul></div>
          <div className="price-card"><p>PER STRATEGY</p><h3><small>+ NT$</small>5,000</h3><span>每一條策略</span><p className="price-note">一條策略的專案起價為 <strong>NT$25,000</strong>。多一條策略，再加 NT$5,000。</p></div>
          <div className="price-card"><p>AFTER WARRANTY</p><h3><small>NT$</small>1,000</h3><span>每月維護費</span><p className="price-note">三個月保固到期後開始計收，涵蓋既有系統的一般維護與運行協助；新增功能另行報價。</p></div>
        </div>
        <p className="pricing-example"><b>報價範例</b> 啟動費 NT$20,000 ＋ 2 條策略 NT$10,000 ＝ <strong>NT$30,000</strong></p>
      </section>

      <section className="warranty-section" id="warranty"><div className="shell section warranty-grid">
        <div className="warranty-copy"><p className="kicker">WARRANTY POLICY</p><h2>保固的是程式品質，<br />策略調整則清楚計價。</h2><p>保固期自專案驗收交付日起算三個月。為避免認知落差，以下範圍會寫入專案確認內容。</p><a href="mailto:nordchiou@gmail.com?subject=索取交易系統規格與保固說明">索取完整專案說明 <span>→</span></a></div>
        <div className="warranty-card">
          <div className="warranty-row included"><span>✓</span><div><h3>保固內免費修復</h3><p>在已確認的功能範圍、操作方式與執行環境下，可重現且由程式本身造成的錯誤、異常或與驗收規格不符。</p></div></div>
          <div className="warranty-row change"><span>↻</span><div><h3>策略邏輯改動</h3><p>保固期內每次 <b>NT$1,000</b>；保固期外每次 <b>NT$3,000</b>。每次改動的範圍與驗收方式於施工前確認。</p></div></div>
          <div className="warranty-row excluded"><span>—</span><div><h3>不屬於程式錯誤保固</h3><p>新增功能或商品、第三方 API／券商／交易所規格變更、資料品質、網路與主機故障、帳號權限、非約定環境或不當操作所造成的問題，另行評估報價。</p></div></div>
          <div className="warranty-row risk"><span>!</span><div><h3>交易風險聲明</h3><p>系統開發與回測結果不代表獲利保證。實盤交易仍可能受滑價、流動性、斷線與市場波動影響；策略與交易決策由客戶自行負責。</p></div></div>
        </div>
      </div></section>

      <section className="section shell process-section"><div className="section-heading"><p className="kicker">HOW WE WORK</p><h2>四步驟，讓需求可驗收</h2></div><div className="process-grid">{process.map(([no,title,desc])=><article key={no}><span>{no}</span><h3>{title}</h3><p>{desc}</p></article>)}</div></section>

      <section className="section shell faq-section" id="faq">
        <div className="section-heading"><p className="kicker">FAQ</p><h2>常見問題</h2></div>
        <div className="faq-list">{faq.map(({q,a})=><details key={q}><summary>{q}<span aria-hidden="true">+</span></summary><p>{a}</p></details>)}</div>
      </section>

      <section className="cta-section"><div className="shell cta-inner"><div><p className="kicker">LET&apos;S BUILD</p><h2>你有策略，我們把它變成系統。</h2><p>來信簡述交易市場、策略數量、資料來源與希望的執行方式，我們會協助整理下一步。</p></div><div className="contact-actions"><a className="button primary" href="mailto:nordchiou@gmail.com?subject=交易系統專案諮詢">nordchiou@gmail.com <span>↗</span></a><a href="tel:0926192178">0926-192-178</a><small>服務時間：週一至週日 07:00–24:00</small></div></div></section>
      <footer className="footer shell"><div className="brand"><img className="brand-mark" src="/logo.png" alt="諾秋工作室標誌" width={42} height={42} /><span><strong>諾秋工作室</strong><small>NORDCHIOU STUDIO</small></span></div><p>統一編號 00884771</p><p>© 2026 諾秋工作室. All rights reserved.</p></footer>
    </main>
  );
}
