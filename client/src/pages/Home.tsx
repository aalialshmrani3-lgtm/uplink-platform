import React from "react";
import { ArrowLeft, ArrowRight, BadgeCheck, Building2, ChevronLeft, ChevronRight, Compass, FileCheck2, Landmark, LockKeyhole, Rocket, ShieldCheck, Sparkles, UsersRound } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { getLoginUrl } from "@/const";

function text(ar: string, en: string, arabic: boolean) {
  return arabic ? ar : en;
}

const engines = [
  { id: "NAQLA1", route: "/naqla1", icon: FileCheck2, ar: "التأهيل", en: "Qualify", arDescription: "سجل الابتكار، إصداراته، الأدلة المصرح بها، والجواز وخطوة العمل التالية.", enDescription: "Innovation record, versioning, authorized evidence, passport, and next best action.", color: "from-emerald-300 to-cyan-300", tint: "border-emerald-300/30 bg-emerald-300/5" },
  { id: "NAQLA2", route: "/naqla2", icon: UsersRound, ar: "الاتصال", en: "Connect", arDescription: "فرص وتحديات، teaser مصرح به، مطابقة حتمية، تقديم ثابت وPilot.", enDescription: "Opportunities and challenges, authorized teaser, deterministic match, immutable application, and pilot.", color: "from-cyan-300 to-blue-400", tint: "border-cyan-300/30 bg-cyan-300/5" },
  { id: "NAQLA3", route: "/naqla3", icon: Landmark, ar: "التسويق", en: "Commercialize", arDescription: "أصل تجاري منفصل عن المعاملة، تحقق بشري ومسار تنفيذ دون استنتاج قانوني آلي.", enDescription: "Commercial asset separate from a transaction, human diligence, and execution without automated legal conclusions.", color: "from-violet-300 to-fuchsia-300", tint: "border-violet-300/30 bg-violet-300/5" },
];

export default function Home() {
  const { language, isRTL } = useLanguage();
  const isArabic = language === "ar";
  const DirectionalArrow = isRTL ? ArrowLeft : ArrowRight;

  return (
    <main className="min-h-screen bg-[#020617] text-slate-100" dir={isRTL ? "rtl" : "ltr"}>
      <header className="border-b border-white/10 bg-slate-950/90 px-4 py-4 backdrop-blur sm:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3" aria-label="NAQLA home">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-600 text-slate-950"><Sparkles className="h-5 w-5" /></span>
            <span><span className="block text-xs font-semibold tracking-[0.18em] text-cyan-300">NAQLA</span><span className="block text-sm font-semibold text-white">{text("منظومة تشغيل الابتكار", "Innovation operating system", isArabic)}</span></span>
          </Link>
          <nav className="hidden items-center gap-1 lg:flex" aria-label={text("التنقل التشغيلي", "Operational navigation", isArabic)}>
            <Link href="/dashboard" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-300">{text("لوحة التحكم", "Dashboard", isArabic)}</Link>
            <Link href="/naqla1" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-300">NAQLA1</Link>
            <Link href="/naqla2" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-300">NAQLA2</Link>
            <Link href="/naqla3" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-300">NAQLA3</Link>
            <Link href="/profile" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-300">{text("الملف", "Profile", isArabic)}</Link>
          </nav>
          <div className="flex shrink-0 items-center gap-2">
            <LanguageSwitcher />
            <a href={getLoginUrl()} className="hidden rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-white sm:inline-flex focus:outline-none focus:ring-2 focus:ring-cyan-300">{text("تسجيل الدخول", "Sign in", isArabic)}</a>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden px-4 py-16 sm:px-8 sm:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(34,211,238,0.13),transparent_34%),radial-gradient(circle_at_85%_20%,rgba(139,92,246,0.16),transparent_35%)]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="grid items-center gap-10 lg:grid-cols-[1.25fr_0.75fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1.5 text-xs font-semibold text-cyan-100"><ShieldCheck className="h-4 w-4" />{text("تشغيل حتمي مع تفويض مستقل للأدلة", "Deterministic operation with independent evidence authorization", isArabic)}</span>
              <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">{text("رحلة ابتكار واضحة، من السجل إلى تنفيذٍ منضبط.", "A clear innovation journey, from record to governed execution.", isArabic)}</h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">{text("تجمع NAQLA التأهيل والاتصال والتسويق في مسار واحد قابل للتفسير. القرارات حتمية، وإتاحة الدليل ليست ضمنية، والذكاء الخارجي مؤجل ولا يوقف أي رحلة تشغيلية.", "NAQLA connects qualification, engagement, and commercialization through one explainable path. Decisions are deterministic, evidence access is never implicit, and external AI is deferred without blocking any operational journey.", isArabic)}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/naqla" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 font-semibold text-slate-950 focus:outline-none focus:ring-2 focus:ring-cyan-100"><Compass className="h-4 w-4" />{text("فتح مساحة التشغيل", "Open operating workspace", isArabic)}<DirectionalArrow className="h-4 w-4" /></Link>
                <a href="#engines" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 px-5 py-3 font-semibold text-white focus:outline-none focus:ring-2 focus:ring-cyan-100">{text("استعراض المحركات", "Explore the engines", isArabic)} {isRTL ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}</a>
              </div>
            </div>
            <aside className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/20">
              <p className="text-xs font-semibold tracking-[0.18em] text-cyan-300">{text("مبادئ التشغيل", "OPERATING PRINCIPLES", isArabic)}</p>
              <ul className="mt-5 space-y-4">
                {[{ icon: LockKeyhole, ar: "Default deny ودليل مصرح به صراحةً.", en: "Default deny and explicitly authorized evidence." }, { icon: BadgeCheck, ar: "نسخ تقديم ثابتة وقرارات قابلة للتدقيق.", en: "Immutable application versions and auditable decisions." }, { icon: Building2, ar: "سياق منظمة نشط بلا تبديل صامت.", en: "An active organization context without silent switching." }].map((item) => <li key={item.en} className="flex gap-3"><item.icon className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" /><span className="leading-6 text-slate-200">{text(item.ar, item.en, isArabic)}</span></li>)}
              </ul>
              <p className="mt-6 rounded-xl border border-amber-300/20 bg-amber-300/5 p-3 text-sm leading-6 text-amber-100">{text("مساحة التشغيل تتضمن سيناريو عرض اصطناعياً فقط؛ لا تُعرض بيانات عملاء ولا شراكات أو تكاملات خارجية.", "The operating workspace contains a synthetic demo scenario only; it exposes no customer data, partnerships, or external integrations.", isArabic)}</p>
            </aside>
          </div>
        </div>
      </section>

      <section id="engines" className="border-y border-white/10 bg-slate-950/70 px-4 py-16 sm:px-8">
        <div className="mx-auto max-w-7xl"><div className="max-w-2xl"><p className="text-xs font-semibold tracking-[0.18em] text-cyan-300">{text("المحركات الثلاثة", "THREE ENGINES", isArabic)}</p><h2 className="mt-3 text-3xl font-bold sm:text-4xl">{text("كل مرحلة لها غرض واضح وحدود وصول محددة.", "Each stage has a clear purpose and defined access boundaries.", isArabic)}</h2></div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">{engines.map((engine) => <article key={engine.id} className={`rounded-3xl border p-6 ${engine.tint}`}><div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${engine.color} text-slate-950`}><engine.icon className="h-5 w-5" /></div><p className="mt-5 text-xs font-semibold tracking-[0.18em] text-slate-400">{engine.id}</p><h3 className="mt-2 text-2xl font-bold">{text(engine.ar, engine.en, isArabic)}</h3><p className="mt-3 min-h-20 leading-7 text-slate-300">{text(engine.arDescription, engine.enDescription, isArabic)}</p><Link href={engine.route} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 hover:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-100">{text("فتح المسار", "Open journey", isArabic)}<DirectionalArrow className="h-4 w-4" /></Link></article>)}</div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-8"><div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3"><article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><FileCheck2 className="h-5 w-5 text-emerald-300" /><h3 className="mt-4 font-semibold">{text("NAQLA1 — QUALIFY", "NAQLA1 — QUALIFY", isArabic)}</h3><p className="mt-2 text-sm leading-6 text-slate-400">Understand → Evidence → Evaluate → Improve → Qualify → Route</p></article><article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><UsersRound className="h-5 w-5 text-cyan-300" /><h3 className="mt-4 font-semibold">{text("NAQLA2 — CONNECT", "NAQLA2 — CONNECT", isArabic)}</h3><p className="mt-2 text-sm leading-6 text-slate-400">Demand → Discover → Match → Engage → Pilot → Deal</p></article><article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><Landmark className="h-5 w-5 text-violet-300" /><h3 className="mt-4 font-semibold">{text("NAQLA3 — COMMERCIALIZE", "NAQLA3 — COMMERCIALIZE", isArabic)}</h3><p className="mt-2 text-sm leading-6 text-slate-400">Prepare → Due Diligence → Contract → Execute → Scale</p></article></div></section>

      <footer className="border-t border-white/10 px-4 py-8 text-center text-sm text-slate-500">NAQLA · {text("مسار تشغيل حتمي", "Deterministic operating journey", isArabic)}</footer>
    </main>
  );
}
