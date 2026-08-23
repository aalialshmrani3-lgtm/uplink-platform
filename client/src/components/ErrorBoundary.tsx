import { cn } from "@/lib/utils";
import { AlertTriangle, RotateCcw, SlidersHorizontal } from "lucide-react";
import { Component, ReactNode } from "react";
import { isStaleChunkError, STALE_CHUNK_RECOVERY_KEY } from "@shared/staleChunkRecovery";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    if (!isStaleChunkError(error)) return;
    try {
      if (sessionStorage.getItem(STALE_CHUNK_RECOVERY_KEY) === "1") return;
      sessionStorage.setItem(STALE_CHUNK_RECOVERY_KEY, "1");
      window.location.reload();
    } catch {
      // Keep the user-facing recovery view available when storage is unavailable.
    }
  }

  render() {
    if (this.state.hasError) {
      const technicalId = `UI-${Date.now().toString(36).toUpperCase()}`;
      const selectContext = () => {
        sessionStorage.removeItem("naqla_active_context");
        window.location.assign("/");
      };
      return (
        <main className="flex items-center justify-center min-h-screen p-8 bg-background" dir="rtl" aria-live="assertive">
          <div className="flex flex-col items-center w-full max-w-2xl p-8 text-center">
            <AlertTriangle
              size={48}
              className="text-destructive mb-6 flex-shrink-0"
            />

            <p className="text-xs font-semibold tracking-[0.18em] text-cyan-500">NAQLA</p>
            <h2 className="text-xl mb-3">تعذر تجهيز مساحة العمل</h2>
            <p className="mb-5 text-sm text-muted-foreground">حدث خطأ أثناء تحميل هذه الصفحة. يمكنك إعادة المحاولة أو العودة لاختيار السياق.</p>

            {import.meta.env.DEV && (
              <div className="p-4 w-full rounded bg-muted overflow-auto mb-6 text-right" dir="ltr">
                <p className="mb-2 text-xs text-muted-foreground">Technical error ID: {technicalId}</p>
                <pre className="text-sm text-muted-foreground whitespace-break-spaces">{this.state.error?.stack}</pre>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button onClick={() => window.location.reload()} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 cursor-pointer">
                <RotateCcw size={16} /> إعادة المحاولة
              </button>
              <button onClick={selectContext} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted cursor-pointer">
                <SlidersHorizontal size={16} /> العودة لاختيار السياق
              </button>
            </div>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
