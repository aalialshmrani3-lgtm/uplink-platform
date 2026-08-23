import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { ReferenceDashboardShell } from "./DashboardLayout";
import InternalSidebar from "./InternalSidebar";

export default function PlatformShell({ children }: { children: React.ReactNode }) {
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
  const [location] = useLocation();
  const { language, isRTL } = useLanguage();
  const isArabic = language === "ar";

  return (
    <div className="min-h-screen bg-background text-foreground" dir={isRTL ? "rtl" : "ltr"}>
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-border/60 bg-background/95 px-4 backdrop-blur lg:hidden">
        <Link href="/dashboard" className="text-sm font-bold tracking-wide text-cyan-500">NAQLA</Link>
        <button type="button" onClick={() => setMobileNavigationOpen((open) => !open)} aria-expanded={mobileNavigationOpen} aria-controls="platform-mobile-navigation" className="rounded-lg p-2 text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          {mobileNavigationOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span className="sr-only">{isArabic ? "فتح التنقل" : "Toggle navigation"}</span>
        </button>
      </header>

      {mobileNavigationOpen ? (
        <div id="platform-mobile-navigation" className="fixed inset-x-0 top-14 z-40 max-h-[calc(100vh-3.5rem)] overflow-y-auto border-b border-border/60 bg-background shadow-xl lg:hidden">
          <InternalSidebar className="h-auto w-full border-0" />
        </div>
      ) : null}

      <ReferenceDashboardShell>
        <main key={location} className="min-w-0 flex-1">{children}</main>
      </ReferenceDashboardShell>
    </div>
  );
}
