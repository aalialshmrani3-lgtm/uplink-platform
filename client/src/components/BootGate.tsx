import { AlertTriangle, RefreshCw, SlidersHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type BootStatus = "booting" | "ready" | "error" | "context_required";

type BootIssue = {
  id: string;
  reason: string;
};

const MAX_BOOT_TIME_MS = 4000;

function errorId(prefix: string) {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}`;
}

function initialBootStatus(): BootStatus {
  if (!import.meta.env.DEV) return "booting";
  const forced = new URLSearchParams(window.location.search).get("boot");
  if (forced === "context_required") return "context_required";
  if (forced === "error") return "error";
  return "booting";
}

function BootRecovery({ status, issue }: { status: Exclude<BootStatus, "booting" | "ready">; issue: BootIssue }) {
  const retry = () => window.location.reload();
  const selectContext = () => {
    sessionStorage.removeItem("naqla_active_context");
    window.location.assign("/");
  };

  const isContext = status === "context_required";
  return (
    <main className="min-h-screen bg-[#030712] text-white flex items-center justify-center px-6" data-boot-state={status}>
      <section className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-950/80 p-8 text-center shadow-2xl" aria-live="assertive">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/15 text-amber-300">
          {isContext ? <SlidersHorizontal className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
        </div>
        <p className="text-xs font-semibold tracking-[0.18em] text-cyan-300">NAQLA</p>
        <h1 className="mt-2 text-2xl font-bold">{isContext ? "يلزم اختيار مساحة عمل" : "تعذر تجهيز مساحة العمل"}</h1>
        <p className="mt-3 text-sm leading-7 text-slate-300">
          {isContext ? "اختر سياقاً صالحاً للمتابعة. لا يمكن للمنصة تحميل بيانات سياق غير محدد." : issue.reason}
        </p>
        {import.meta.env.DEV && <p className="mt-4 text-xs text-slate-500">Technical error ID: {issue.id}</p>}
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row" dir="rtl">
          <button type="button" onClick={retry} className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950">
            <RefreshCw className="h-4 w-4" /> إعادة المحاولة
          </button>
          <button type="button" onClick={selectContext} className="rounded-lg border border-white/15 px-4 py-2.5 text-sm font-semibold text-white">
            العودة لاختيار السياق
          </button>
        </div>
      </section>
    </main>
  );
}

export function BootGate({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<BootStatus>(initialBootStatus);
  const [issue, setIssue] = useState<BootIssue>(() => ({ id: errorId("BOOT"), reason: "تعذر إكمال التهيئة الأولية للمنصة." }));
  const completed = useRef(false);

  useEffect(() => {
    if (status !== "booting") return;

    const timeout = window.setTimeout(() => {
      if (completed.current) return;
      setIssue({ id: errorId("BOOT_TIMEOUT"), reason: "انتهت مهلة تجهيز التطبيق قبل اكتمال التهيئة. يمكنك إعادة المحاولة أو اختيار السياق من جديد." });
      setStatus("error");
    }, MAX_BOOT_TIME_MS);

    const frame = window.requestAnimationFrame(() => {
      try {
        if (!document.getElementById("root")) throw new Error("ROOT_NOT_FOUND");
        completed.current = true;
        window.clearTimeout(timeout);
        setStatus("ready");
      } catch (error) {
        const message = error instanceof Error ? error.message : "BOOTSTRAP_FAILED";
        setIssue({ id: errorId("BOOT_INIT"), reason: `فشلت تهيئة الواجهة (${message}).` });
        setStatus("error");
      }
    });

    return () => {
      window.clearTimeout(timeout);
      window.cancelAnimationFrame(frame);
    };
  }, [status]);

  // A healthy client must never be hidden behind a cosmetic bootstrap screen.
  // Keep the asynchronous guard for failure reporting, but render the route
  // immediately while that guard completes.
  if (status === "ready" || status === "booting") return <>{children}</>;
  if (status === "error" || status === "context_required") return <BootRecovery status={status} issue={issue} />;
  return null;
}

export { MAX_BOOT_TIME_MS };
