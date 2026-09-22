"use client";

import { useEffect, useState, type FormEvent } from "react";

const EMAIL = "nordchiou@gmail.com";
const LINE_URL = "https://lin.ee/65uAD7mm";
const SUBJECT = "AI 導入方案諮詢";
const UNDECIDED = "還不確定，想先聊聊";

export default function InquiryForm({ plans }: { plans: string[] }) {
  const [plan, setPlan] = useState(plans[0]);
  const [status, setStatus] = useState("");

  // 價格卡等處的 data-plan 連結會預先帶入方案
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = (event.target as Element | null)?.closest<HTMLElement>(
        "[data-plan]",
      );
      if (target?.dataset.plan) setPlan(target.dataset.plan);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const copy = async (text: string, done: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus(done);
    } catch {
      setStatus(`無法自動複製，請手動複製：${text}`);
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const field = (name: string) =>
      String(data.get(name) ?? "").trim() || "（未填）";
    const body = [
      `姓名／稱呼：${field("name")}`,
      `公司／產業：${field("company")}`,
      `聯絡方式：${field("contact")}`,
      `有興趣的方案：${field("plan")}`,
      "",
      "想改善的流程：",
      field("need"),
    ].join("\n");
    const via = (event.nativeEvent as SubmitEvent).submitter?.getAttribute(
      "value",
    );

    if (via === "line") {
      // 先同步發出複製與開窗，避免 iOS Safari 因失去使用者手勢而擋下彈窗
      const copied = copy(body, "已複製諮詢內容，請在 LINE 對話中貼上送出。");
      window.open(LINE_URL, "_blank", "noopener");
      await copied;
    } else if (via === "gmail") {
      const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}&su=${encodeURIComponent(SUBJECT)}&body=${encodeURIComponent(body)}`;
      window.open(url, "_blank", "noopener");
      setStatus("已開啟 Gmail 撰寫視窗，確認內容後按下傳送即可。");
    } else {
      window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(SUBJECT)}&body=${encodeURIComponent(body)}`;
      setStatus("若沒有開啟郵件程式，請改用 Gmail 或 LINE 送出。");
    }
  };

  return (
    // action 為沒有 JS 時（靜態匯出版）的後備：直接交給郵件程式
    <form
      className="inquiry"
      onSubmit={onSubmit}
      action={`mailto:${EMAIL}?subject=${encodeURIComponent(SUBJECT)}`}
      method="post"
      encType="text/plain"
    >
      <p className="inquiry-title">預約導入診斷</p>
      <div className="inquiry-row">
        <label>
          <span>姓名／稱呼</span>
          <input name="name" autoComplete="name" placeholder="王經理" />
        </label>
        <label>
          <span>公司／產業</span>
          <input
            name="company"
            autoComplete="organization"
            placeholder="精密零件製造"
          />
        </label>
      </div>
      <label>
        <span>
          聯絡方式（LINE ID、Email 或電話）<b aria-hidden="true">*</b>
        </span>
        <input name="contact" required placeholder="怎麼聯絡你最方便？" />
      </label>
      <label>
        <span>有興趣的方案</span>
        <select
          name="plan"
          value={plan}
          onChange={(event) => setPlan(event.target.value)}
        >
          {[...plans, UNDECIDED].map((name) => (
            <option key={name}>{name}</option>
          ))}
        </select>
      </label>
      <label>
        <span>
          想改善的流程<b aria-hidden="true">*</b>
        </span>
        <textarea
          name="need"
          required
          rows={4}
          placeholder="例如：業務每天花 2 小時查產品規格回覆客戶，資料散在共用資料夾的 PDF 裡。"
        />
      </label>
      <div className="inquiry-actions">
        <button className="button primary" type="submit" value="gmail">
          用 Gmail 寄出 <span>→</span>
        </button>
        <button className="button line-outline" type="submit" value="line">
          複製內容並開 LINE <span>↗</span>
        </button>
        <button className="inquiry-link" type="submit" value="mailto">
          使用預設郵件程式
        </button>
      </div>
      <p className="inquiry-note">
        或直接來信 <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        <button
          className="inquiry-link"
          type="button"
          onClick={() => copy(EMAIL, "已複製 Email 地址。")}
        >
          複製
        </button>
      </p>
      <p className="inquiry-status" role="status" aria-live="polite">
        {status}
      </p>
    </form>
  );
}
