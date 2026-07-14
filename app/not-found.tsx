export default function NotFound() {
  return (
    <main className="notfound">
      <div>
        <p className="eyebrow">
          <span /> 404 NOT FOUND
        </p>
        <h1>這個頁面不存在</h1>
        <p className="notfound-lead">
          網址可能已變更或輸入錯誤。回到首頁看看我們的交易系統作品與服務。
        </p>
        <a className="button primary" href="/">
          回到首頁 <span>→</span>
        </a>
      </div>
    </main>
  );
}
