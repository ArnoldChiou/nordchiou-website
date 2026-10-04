"use client";

import { useState, type ReactNode } from "react";

// 各互動教學共用的外框：上方步驟列、中間內容、下方上一步／下一步
export type LabStep = { short: string; title: string };

export function LabShell({ label, steps, restartStep = 1, restartLabel = "從頭再玩一次", children }: {
  label: string;
  steps: LabStep[];
  // 最後一步的按鈕要跳回哪一步
  restartStep?: number;
  restartLabel?: string;
  children: (step: number, go: (step: number) => void) => ReactNode;
}) {
  const [step, setStep] = useState(0);
  const go = (next: number) => {
    setStep(Math.max(0, Math.min(steps.length - 1, next)));
    document.getElementById("lab")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="lab" id="lab" aria-label={label}>
      <ol className="lab-stepper">
        {steps.map((item, index) => (
          <li key={item.short}>
            <button type="button" onClick={() => go(index)} aria-current={index === step ? "step" : undefined} className={index < step ? "done" : undefined}>
              <span>{index}</span>{item.short}
            </button>
          </li>
        ))}
      </ol>

      <div className="lab-panel" key={step}>
        <header className="lab-panel-head">
          <p className="kicker">{step === 0 ? "OVERVIEW" : `STEP ${step} / ${steps.length - 1}`}</p>
          <h2>{steps[step].title}</h2>
        </header>
        {children(step, go)}
      </div>

      <nav className="lab-pager" aria-label="教學步驟切換">
        <button type="button" className="button secondary" onClick={() => go(step - 1)} disabled={step === 0}>← 上一步</button>
        <span>{step + 1} / {steps.length}</span>
        {step < steps.length - 1 ? (
          <button type="button" className="button primary" onClick={() => go(step + 1)}>下一步：{steps[step + 1].short} <span>→</span></button>
        ) : (
          <button type="button" className="button primary" onClick={() => go(restartStep)}>{restartLabel} <span>↺</span></button>
        )}
      </nav>
    </section>
  );
}

export function Explain({ what, analogy, tip }: { what: ReactNode; analogy?: ReactNode; tip?: ReactNode }) {
  return (
    <div className="lab-explain">
      <p>{what}</p>
      {analogy && <p className="lab-analogy"><b>白話比喻</b>{analogy}</p>}
      {tip && <p className="lab-tip"><b>導入時要注意</b>{tip}</p>}
    </div>
  );
}

export function Recap({ items, conclusion }: { items: [string, string][]; conclusion: string }) {
  return (
    <div className="lab-recap">
      <p className="kicker">RECAP</p>
      <ol>{items.map(([term, text]) => <li key={term}><b>{term}</b>{text}</li>)}</ol>
      <p>{conclusion}</p>
    </div>
  );
}
