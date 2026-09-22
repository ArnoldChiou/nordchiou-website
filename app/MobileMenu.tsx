"use client";

import { useEffect, useRef, useState } from "react";

export default function MobileMenu({ links, lineUrl }: { links: [string, string][]; lineUrl: string }) {
  const menu = useRef<HTMLDetailsElement>(null);
  const [open, setOpen] = useState(false);
  const close = () => menu.current?.removeAttribute("open");

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <details className="mobile-menu" ref={menu} onToggle={(event) => setOpen(event.currentTarget.open)}>
      <summary aria-label={open ? "關閉導覽選單" : "開啟導覽選單"}><i /><i /><i /></summary>
      <div className="mobile-menu-backdrop" aria-hidden="true" onClick={close} />
      <div className="mobile-menu-panel" onClick={(event) => { if ((event.target as Element).closest("a")) close(); }}>
        <nav aria-label="行動版導覽">{links.map(([href, label]) => <a key={href} href={href}>{label}</a>)}</nav>
        <div className="mobile-menu-actions">
          <a className="button primary" href="#contact" data-plan="導入診斷">預約導入診斷 <span>→</span></a>
          <a className="button line" href={lineUrl} target="_blank" rel="noopener">加 LINE 諮詢 <span>↗</span></a>
        </div>
      </div>
    </details>
  );
}
