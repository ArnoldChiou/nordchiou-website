"use client";

import { useRef } from "react";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  title: string;
};

export default function PortfolioZoom({
  src,
  alt,
  width,
  height,
  title,
}: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const close = () => dialog.current?.close();
  // 開啟時鎖住背景捲動，關閉（含 Esc）時還原
  const open = () => {
    document.body.style.overflow = "hidden";
    dialog.current?.showModal();
  };

  return (
    <>
      <button
        type="button"
        className="portfolio-zoom"
        onClick={open}
        aria-label={`放大檢視 ${title} 截圖`}
      >
        <img src={src} alt={alt} width={width} height={height} loading="lazy" />
        <span className="zoom-hint" aria-hidden="true">
          ⤢ 點擊放大
        </span>
      </button>
      {/* 原生 dialog 支援 Esc 關閉與焦點鎖定；點背景也可關閉 */}
      <dialog
        ref={dialog}
        className="lightbox"
        aria-label={`${title} 截圖`}
        onClose={() => {
          document.body.style.overflow = "";
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <img src={src} alt={alt} loading="lazy" />
        <button type="button" className="lightbox-close" onClick={close}>
          ✕ 關閉
        </button>
      </dialog>
    </>
  );
}
