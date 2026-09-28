import type { Metadata } from "next";
import Link from "next/link";
import { formatDate } from "@/lib/content";
import { ORG_REF, PRIVACY_UPDATED, SITE_URL } from "@/lib/site";
import { SiteFooter, SiteNav } from "../SiteChrome";
import "../content.css";

const EMAIL = "nordchiou@gmail.com";
const TITLE = "隱私權政策｜諾秋工作室";
const DESCRIPTION =
  "諾秋工作室如何蒐集、使用與保護你透過網站詢價表單、Email 與 LINE 提供的個人資料，以及你依個人資料保護法可行使的權利。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/privacy-policy" },
  openGraph: { type: "website", url: "/privacy-policy", siteName: "諾秋工作室", locale: "zh_TW", title: TITLE, description: DESCRIPTION, images: [{ url: "/og.png", width: 1200, height: 630, alt: TITLE }] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/og.png"] },
};

export default function PrivacyPolicy() {
  const url = `${SITE_URL}/privacy-policy`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: "隱私權政策",
      description: DESCRIPTION,
      inLanguage: "zh-Hant",
      dateModified: PRIVACY_UPDATED,
      publisher: ORG_REF,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "首頁", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "隱私權政策", item: url },
      ],
    },
  ];

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteNav />
      <article className="post shell">
        <nav className="post-crumbs" aria-label="麵包屑"><Link href="/">首頁</Link><span aria-hidden="true">/</span><span>隱私權政策</span></nav>
        <header className="post-header">
          <h1>隱私權政策</h1>
          <p className="post-lead">
            諾秋工作室（以下稱「本工作室」）重視你的隱私。本政策依《個人資料保護法》說明我們蒐集哪些資料、如何使用與保存，以及你可以行使的權利。
          </p>
          <p className="blog-meta">
            <span>最後更新 <time dateTime={PRIVACY_UPDATED}>{formatDate(PRIVACY_UPDATED)}</time></span>
          </p>
        </header>
        <div className="post-body">
          <h2>一、蒐集者</h2>
          <p>
            諾秋工作室（統一編號 00884771），聯絡 Email：<a href={`mailto:${EMAIL}`}>{EMAIL}</a>，電話：0926-192-178。
          </p>

          <h2>二、蒐集的資料與方式</h2>
          <ul>
            <li>
              <strong>詢價與聯絡資料</strong>：你在網站詢價表單填寫的姓名或稱呼、公司或產業、聯絡方式（LINE ID、Email 或電話）、有興趣的方案與需求描述，以及你透過 Email、LINE 或電話主動提供的內容。
            </li>
            <li>
              <strong>網站連線紀錄</strong>：網站由 Cloudflare 代管，瀏覽時伺服器會自動產生 IP 位址、瀏覽器類型、造訪網址與時間等連線紀錄，用於維運、除錯與防範攻擊。
            </li>
          </ul>
          <p>
            網站詢價表單<strong>不會</strong>把資料傳到本工作室的伺服器，而是由你的裝置開啟 Gmail、預設郵件程式或 LINE，經你確認後才送出。本網站也<strong>未使用</strong> Google Analytics 等流量分析或廣告追蹤工具，不會設定追蹤用 Cookie。
          </p>

          <h2>三、蒐集目的</h2>
          <p>
            回覆你的詢價與諮詢、評估需求與報價、履行合作契約（含開發、交付、保固與維運），以及開立發票等法定帳務作業。
          </p>
          <p>
            我們<strong>不會</strong>將你的資料用於寄送行銷訊息、電子報或活動邀請，也不會出售或出租給任何第三方。
          </p>

          <h2>四、保存期間</h2>
          <ul>
            <li><strong>未成交的詢價</strong>：自最後一次聯繫起保存 1 年，期滿後刪除。</li>
            <li><strong>成交的客戶</strong>：於契約存續期間保存；契約結束後，依《商業會計法》等法令規定的期限保存必要的帳務資料，其餘資料於合作結束後刪除。</li>
            <li><strong>網站連線紀錄</strong>：依 Cloudflare 的保存期限自動刪除，本工作室不會用來識別個人。</li>
          </ul>

          <h2>五、利用地區、對象與方式</h2>
          <p>
            資料僅由本工作室在履行上述目的的範圍內使用。為了收發訊息與代管網站，資料會存放於下列服務提供者，其伺服器可能位於台灣以外的地區：
          </p>
          <ul>
            <li>Google（Gmail）：收發 Email。</li>
            <li>LY Corporation（LINE）：透過 LINE 官方帳號與你聯繫。</li>
            <li>Cloudflare：網站代管與連線紀錄。</li>
          </ul>
          <p>除非法律要求或經你同意，我們不會將你的資料提供給其他第三方。</p>

          <h2>六、你的權利</h2>
          <p>依《個人資料保護法》第 3 條，你可以隨時向我們請求：</p>
          <ul>
            <li>查詢或請求閱覽你的個人資料</li>
            <li>請求製給複製本</li>
            <li>請求補充或更正</li>
            <li>請求停止蒐集、處理或利用</li>
            <li>請求刪除</li>
          </ul>
          <p>
            請來信 <a href={`mailto:${EMAIL}`}>{EMAIL}</a> 或透過 LINE 官方帳號提出，我們會在確認身分後盡速處理。
          </p>

          <h2>七、不提供資料的影響</h2>
          <p>
            你可以自由選擇是否提供個人資料。若未提供聯絡方式或需求內容，我們將無法回覆詢價或提供服務。
          </p>

          <h2>八、資料安全</h2>
          <p>
            我們採取合理的技術與管理措施保護你的資料，並限制只有處理你案件的人員可以存取。專案執行期間若需要存取你公司的系統或文件，將另依雙方契約與保密約定處理。
          </p>

          <h2>九、政策修訂</h2>
          <p>
            本政策可能因法令或服務調整而修訂，修訂後會公布於本頁並更新上方日期。若有重大變更，我們會以網站公告或 Email 通知進行中的客戶。
          </p>
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}
