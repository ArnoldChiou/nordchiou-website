import Link from "next/link";
import MobileMenu from "./MobileMenu";

export const LINE_URL = "https://lin.ee/65uAD7mm";

// 用 /# 開頭，部落格等子頁面也能跳回首頁區塊
const navLinks: [string, string][] = [
  ["/#services", "服務"], ["/#scenarios", "應用情境"], ["/#pricing", "方案"], ["/#work", "實績"],
  ["/#about", "關於"], ["/#faq", "常見問題"], ["/news", "AI 新聞"], ["/blog", "部落格"],
];

export function SiteNav() {
  return (
    <div className="nav-wrap">
      <nav className="nav shell" aria-label="主要導覽">
        <Link className="brand" href="/" aria-label="諾秋工作室首頁"><img className="brand-mark" src="/logo.png" alt="諾秋工作室標誌" width={42} height={42} /><span><strong>諾秋工作室</strong><small>AI SOLUTIONS</small></span></Link>
        <div className="nav-links">{navLinks.map(([href, label]) => <a key={href} href={href}>{label}</a>)}</div>
        <Link className="nav-cta" href="/#contact" data-plan="導入診斷">預約診斷 <span aria-hidden="true">→</span></Link>
        <MobileMenu links={navLinks} lineUrl={LINE_URL} />
      </nav>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="footer shell"><div className="brand"><img className="brand-mark" src="/logo.png" alt="諾秋工作室標誌" width={42} height={42} /><span><strong>諾秋工作室</strong><small>NORDCHIOU STUDIO</small></span></div><p>統一編號 00884771</p><p>© 2026 諾秋工作室. All rights reserved.</p></footer>
  );
}
