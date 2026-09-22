import "./hero-demo.css";

export default function HeroDemo() {
  return (
    <section
      className="hd-demo"
      role="img"
      aria-label="情境示意：主管向企業 AI 詢問 A 廠商未付款項與合約付款條件，AI 回覆已比對 ERP 帳款的結果、列出資料來源，並提示信心不足時會轉交真人確認。"
    >
      <header className="hd-topbar">
        <div className="hd-window-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <span>AI ASSISTANT / 情境示意</span>
        <b>虛構資料</b>
      </header>

      <div className="hd-body">
        <div className="hd-context">
          <span className="hd-context-icon" aria-hidden="true">$</span>
          <div>
            <strong>財務與合約查詢</strong>
            <small>示範資料，不含任何真實客戶資訊</small>
          </div>
          <span className="hd-status"><i aria-hidden="true" />系統已連線</span>
        </div>

        <div className="hd-chat">
          <div className="hd-message hd-message-user">
            <span className="hd-speaker">主管提問</span>
            <p>上個月 A 廠商還有哪些未付款項？合約付款條件是什麼？</p>
          </div>

          <div className="hd-message hd-message-ai">
            <span className="hd-speaker"><i aria-hidden="true">✦</i> AI 回覆</span>
            <p>A 廠商目前有 <b>2 筆未付款</b>，合計 <b>NT$ 186,000</b>。合約付款條件為「驗收後 30 天付款」；其中 8 月請款單預計於 9/15 到期。</p>
            <div className="hd-sources" aria-label="回答來源出處">
              <span>來源出處</span>
              <span className="hd-source-tag">2026-08 請款單 p.2</span>
              <span className="hd-source-tag">採購合約 §5</span>
            </div>
          </div>
        </div>

        <div className="hd-checks">
          <div className="hd-verified">
            <span className="hd-checkmark" aria-hidden="true">✓</span>
            <div>
              <strong>已比對 ERP 帳款</strong>
              <small>2 筆待付款・金額一致</small>
            </div>
            <span className="hd-match">已核對</span>
          </div>
          <div className="hd-handoff">
            <span aria-hidden="true">↗</span>
            <p><b>需要人工確認？</b> 信心不足時自動轉真人，保留原始資料與對話脈絡。</p>
          </div>
        </div>
      </div>

      <footer className="hd-footer">
        <span>KNOWLEDGE BASE + ERP</span>
        <span>DEMO ONLY</span>
      </footer>
    </section>
  );
}
