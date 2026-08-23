import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  FileCheck2,
  FileText,
  Gauge,
  Handshake,
  Landmark,
  Layers3,
  Settings,
  ShieldCheck,
  Target,
  UsersRound,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface InternalSidebarProps {
  className?: string;
}

type NavigationItem = {
  href: string;
  ar: string;
  en: string;
  icon: typeof Gauge;
};

const navigationGroups: Array<{ ar: string; en: string; items: NavigationItem[] }> = [
  {
    ar: "مساحة العمل",
    en: "Workspace",
    items: [
      { href: "/dashboard", ar: "لوحة التحكم", en: "Dashboard", icon: Gauge },
      { href: "/naqla", ar: "رحلة NAQLA", en: "NAQLA Journey", icon: Layers3 },
      { href: "/organizations/dashboard", ar: "المنظمات", en: "Organizations", icon: Building2 },
    ],
  },
  {
    ar: "NAQLA1 — التأهيل",
    en: "NAQLA1 — Qualify",
    items: [
      { href: "/naqla1", ar: "مركز التأهيل", en: "Qualification hub", icon: FileCheck2 },
      { href: "/my-ideas", ar: "سجلات الابتكار", en: "Innovation records", icon: FileText },
      { href: "/naqla1/passport", ar: "جواز الابتكار", en: "Innovation passport", icon: ShieldCheck },
      { href: "/trl-assessment", ar: "تقييم TRL", en: "TRL assessment", icon: BarChart3 },
    ],
  },
  {
    ar: "NAQLA2 — الاتصال",
    en: "NAQLA2 — Connect",
    items: [
      { href: "/naqla2", ar: "مركز الاتصال", en: "Connect hub", icon: UsersRound },
      { href: "/naqla2/challenges", ar: "التحديات", en: "Challenges", icon: Target },
      { href: "/naqla1/opportunities", ar: "الفرص", en: "Opportunities", icon: BriefcaseBusiness },
      { href: "/naqla2/matching-hub", ar: "المطابقة", en: "Matching", icon: Handshake },
      { href: "/naqla2/vetting", ar: "التقديم والـPilot", en: "Applications & pilots", icon: FileCheck2 },
      { href: "/naqla2/review-assistance", ar: "مساعدة المراجع", en: "Reviewer assistance", icon: ShieldCheck },
      { href: "/naqla2/application-assistance", ar: "مساعدة المتقدم", en: "Applicant assistance", icon: FileText },
    ],
  },
  {
    ar: "NAQLA3 — التسويق",
    en: "NAQLA3 — Commercialize",
    items: [
      { href: "/naqla3", ar: "مركز التسويق", en: "Commercial hub", icon: Landmark },
      { href: "/naqla3/marketplace", ar: "الأصول التجارية", en: "Commercial assets", icon: BriefcaseBusiness },
      { href: "/naqla3/contracts", ar: "المعاملات والعقود", en: "Transactions & contracts", icon: FileText },
      { href: "/admin/dashboard", ar: "الإدارة والمراجعة", en: "Admin & review", icon: ShieldCheck },
      { href: "/user/settings", ar: "الإعدادات", en: "Settings", icon: Settings },
    ],
  },
];

export default function InternalSidebar({ className }: InternalSidebarProps) {
  const [location] = useLocation();
  const { language, isRTL } = useLanguage();
  const isArabic = language === "ar";

  return (
    <aside
      className={cn(
        "h-screen w-72 shrink-0 overflow-y-auto border-e border-border/60 bg-card/95 backdrop-blur-xl",
        className,
      )}
      dir={isRTL ? "rtl" : "ltr"}
      aria-label={isArabic ? "التنقل الداخلي للمنصة" : "Internal platform navigation"}
    >
      <div className="sticky top-0 z-10 border-b border-border/60 bg-card/95 px-5 py-5 backdrop-blur-xl">
        <Link href="/dashboard" className="flex items-center gap-3 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-slate-950"><Layers3 className="h-5 w-5" /></span>
          <span>
            <span className="block text-xs font-semibold tracking-[0.18em] text-cyan-500">NAQLA</span>
            <span className="block text-sm font-bold text-foreground">{isArabic ? "منصة التشغيل" : "Operating platform"}</span>
          </span>
        </Link>
      </div>

      <nav className="space-y-6 p-4">
        {navigationGroups.map((group) => (
          <section key={group.en} aria-label={isArabic ? group.ar : group.en}>
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{isArabic ? group.ar : group.en}</p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const active = location === item.href || (item.href !== "/dashboard" && location.startsWith(`${item.href}/`));
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href} className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    active ? "bg-primary/12 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}>
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="min-w-0 truncate font-medium">{isArabic ? item.ar : item.en}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </nav>
    </aside>
  );
}
