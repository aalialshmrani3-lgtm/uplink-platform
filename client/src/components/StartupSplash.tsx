import React, { useEffect, useState } from "react";

const PARTICLES = [
  [8, 17, 0.1, 4.8], [18, 69, 1.1, 5.6], [27, 35, 0.5, 6.2], [35, 80, 2.1, 5.1],
  [44, 14, 1.4, 6.8], [57, 63, 0.7, 5.4], [66, 27, 2.4, 6.6], [74, 74, 1.8, 5.8],
  [83, 39, 0.3, 6.1], [92, 17, 1.6, 5.2], [12, 48, 2.6, 6.4], [31, 57, 1.2, 5.7],
  [51, 86, 0.9, 6.7], [62, 9, 2.2, 5.3], [78, 54, 1.5, 6.3], [89, 85, 0.4, 5.5],
] as const;

type StartupSplashProps = {
  onComplete: () => void;
};

/**
 * Restored from the original NAQLA splash treatment. It owns no routing,
 * auth, or network state: the requested route remains mounted behind it.
 */
export function StartupSplash({ onComplete }: StartupSplashProps) {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const duration = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? 80 : 1250;
    const startedAt = performance.now();
    let animationFrame = 0;
    let finishTimeout = 0;

    const finish = () => {
      setProgress(100);
      setLeaving(true);
      finishTimeout = window.setTimeout(onComplete, 420);
    };

    const tick = (now: number) => {
      const next = Math.min(100, Math.round(((now - startedAt) / duration) * 100));
      setProgress(next);
      if (next >= 100) {
        finish();
        return;
      }
      animationFrame = window.requestAnimationFrame(tick);
    };

    animationFrame = window.requestAnimationFrame(tick);
    const hardStop = window.setTimeout(finish, 2200);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(hardStop);
      window.clearTimeout(finishTimeout);
    };
  }, [onComplete]);

  return (
    <section
      aria-label="NAQLA loading screen"
      className={`startup-splash ${leaving ? "startup-splash--leaving" : ""}`}
      data-testid="startup-splash"
    >
      <div aria-hidden="true" className="startup-splash__halo startup-splash__halo--primary" />
      <div aria-hidden="true" className="startup-splash__halo startup-splash__halo--secondary" />
      <div aria-hidden="true" className="startup-splash__particles">
        {PARTICLES.map(([left, top, delay, duration], index) => (
          <i
            className="startup-splash__particle"
            key={index}
            style={{ left: `${left}%`, top: `${top}%`, animationDelay: `${delay}s`, animationDuration: `${duration}s` }}
          />
        ))}
      </div>

      <div className="startup-splash__content">
        <div className="startup-splash__mark" aria-hidden="true">
          <div className="startup-splash__mark-glow" />
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.55">
            <path d="M12 2 2 7l10 5 10-5L12 2Z" />
            <path d="m2 12 10 5 10-5" />
            <path d="m2 17 10 5 10-5" />
          </svg>
        </div>
        <h1 className="startup-splash__brand"><span>NAQLA</span><small>5.0</small></h1>
        <p className="startup-splash__tagline">Global Innovation Platform</p>
        <div className="startup-splash__progress" aria-label={`${progress}% loaded`}>
          <span style={{ transform: `scaleX(${progress / 100})` }} />
        </div>
        <p className="startup-splash__status">{progress < 100 ? "جاري التحميل..." : "مرحباً بك"}</p>
      </div>
    </section>
  );
}
