import * as React from "react";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight, CheckCircle2, FileCheck2, Handshake, Landmark, LockKeyhole, ShieldCheck, Sparkles, UserRoundCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import SEOHead from "@/components/SEOHead";

type Copy = { ar: string; en: string };
const choose = (copy: Copy, isAr: boolean) => isAr ? copy.ar : copy.en;

const engines = [
  {
    code: "NAQLA1",
    href: "/naqla1",
    icon: FileCheck2,
    title: { ar: "التأهيل", en: "Qualify" },
    flow: { ar: "فهم → أدلة → تقييم → تحسين → تأهيل → توجيه", en: "Understand → Evidence → Evaluate → Improve → Qualify → Route" },
    body: { ar: "سجل ابتكار ونسخ ثابتة وأدلة مفوضة وجواز ابتكار وخطوة لاحقة حتمية.", en: "Innovation records, immutable versions, authorized evidence, a passport, and a deterministic next action." },
  },
  {
    code: "NAQLA2",
    href: "/naqla2",
    icon: Handshake,
    title: { ar: "الاتصال", en: "Connect" },
    flow: { ar: "طلب → اكتشاف → مطابقة → تفاعل → Pilot → تسليم", en: "Demand → Discover → Match → Engage → Pilot → Handoff" },
    body: { ar: "مطابقة قابلة للتفسير بعوامل وثقة ونطاق؛ تبقى قرارات الاختيار والتفاعل بشرية.", en: "Explainable matching with factors, confidence, and rank bands; selection and engagement remain human decisions." },
  },
  {
    code: "NAQLA3",
    href: "/naqla3",
    icon: Landmark,
    title: { ar: "التسويق والتنفيذ", en: "Commercialize" },
    flow: { ar: "تحضير → عناية واجبة → شروط → تنفيذ → توسع", en: "Prepare → Due diligence → Terms → Execute → Scale" },
    body: { ar: "أصل تجاري ومعاملة منفصلان، مع سجل حوكمة للمراجعة والتنفيذ والتوسع.", en: "Commercial assets remain separate from transactions, with governed records for review, execution, and scale." },
  },
];

export default function Home() {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const { user } = useAuth();
  const DirectionalArrow = isAr ? ArrowLeft : ArrowRight;

  const actionHref = user ? "/naqla" : getLoginUrl();
  const actionLabel = user
    ? choose({ ar: "فتح مساحة التشغيل", en: "Open workspace" }, isAr)
    : choose({ ar: "تسجيل الدخول الآمن", en: "Sign in securely" }, isAr);

  return <main dir={isAr ? "rtl" : "ltr"} className="min-h-screen overflow-x-hidden bg-[#050b1a] text-slate-100">
    <SEOHead />
    <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(14,165,233,0.16),transparent_34%),radial-gradient(circle_at_85%_8%,rgba(99,102,241,0.14),transparent_30%)]" />
    <header className="relative z-10 border-b border-white/10 bg-[#050b1a]/90 backdrop-blur-xl">
      <div className="container flex min-h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 font-bold tracking-wide text-cyan-300" aria-label="NAQLA home">
          <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-slate-950"><Sparkles className="size-5" /></span>
          <span>NAQLA <small className="text-xs text-cyan-100">5.0</small></span>
        </Link>
        <nav aria-label={choose({ ar: "التنقل الأساسي", en: "Primary navigation" }, isAr)} className="hidden items-center gap-5 text-sm text-slate-300 md:flex">
          <Link href="/naqla1" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 hover:text-cyan-200">NAQLA1</Link>
          <Link href="/naqla2" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 hover:text-cyan-200">NAQLA2</Link>
          <Link href="/naqla3" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 hover:text-cyan-200">NAQLA3</Link>
          <Link href="/naqla" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 hover:text-cyan-200">{choose({ ar: "الرحلة", en: "Journey" }, isAr)}</Link>
        </nav>
        <div className="flex items-center gap-2"><LanguageSwitcher /><a href={actionHref}><Button size="sm" className="bg-cyan-400 font-bold text-slate-950 hover:bg-cyan-300">{actionLabel}</Button></a></div>
      </div>
    </header>

    <section className="relative z-10 border-b border-white/10 px-5 py-16 sm:py-24">
      <div className="container grid items-center gap-10 lg:grid-cols-[1.25fr_0.75fr]">
        <div>
          <Badge className="mb-5 border border-cyan-300/30 bg-cyan-300/10 text-cyan-100"><ShieldCheck className="me-1 size-3.5" />{choose({ ar: "تشغيل حتمي مع تفويض مستقل للأدلة", en: "Deterministic operation with independent evidence authorization" }, isAr)}</Badge>
          <h1 className="max-w-4xl text-4xl font-black leading-tight text-white sm:text-6xl">{choose({ ar: "رحلة ابتكار واضحة، من السجل إلى التنفيذ المنضبط.", en: "A clear innovation journey, from record to governed execution." }, isAr)}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">{choose({ ar: "تنظم NAQLA التأهيل والاتصال والتسويق في مسار واحد. كل مرحلة تعمل ضمن عضوية فعالة وسياق نشط وصلاحيات صريحة، ولا تستبدل المراجعة البشرية أو الإجراءات القانونية والخارجية.", en: "NAQLA organizes qualification, connection, and commercialization in one path. Every stage operates through active membership, active context, and explicit capabilities; it does not replace human review or legal and external processes." }, isAr)}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row"><a href={actionHref}><Button size="lg" className="w-full bg-cyan-400 font-bold text-slate-950 hover:bg-cyan-300 sm:w-auto">{actionLabel}<DirectionalArrow className="ms-2 size-4" /></Button></a><a href="#engines"><Button size="lg" variant="outline" className="w-full border-white/20 bg-transparent text-white hover:bg-white/10 sm:w-auto">{choose({ ar: "استعراض المحركات", en: "Explore engines" }, isAr)}</Button></a></div>
        </div>
        <Card className="border-cyan-300/20 bg-slate-950/60 text-slate-100"><CardContent className="space-y-5 p-6"><p className="text-sm font-semibold text-cyan-200">{choose({ ar: "مبادئ التشغيل", en: "Operating principles" }, isAr)}</p>{[
          { icon: LockKeyhole, text: { ar: "Default deny؛ لا تظهر بيانات مقيّدة بلا تفويض.", en: "Default deny; restricted data never appears without authorization." } },
          { icon: UserRoundCheck, text: { ar: "السياق النشط والعضوية الفعالة مطلوبان للإجراءات الحساسة.", en: "Active context and active membership are required for sensitive actions." } },
          { icon: ShieldCheck, text: { ar: "الذكاء الخارجي مؤجل؛ لا يعتمد المسار الحرج عليه.", en: "External AI is deferred; critical journeys do not depend on it." } },
        ].map(({ icon: Icon, text }) => <div key={text.en} className="flex gap-3 text-sm leading-6 text-slate-300"><Icon className="mt-0.5 size-5 shrink-0 text-cyan-300" />{choose(text, isAr)}</div>)}</CardContent></Card>
      </div>
    </section>

    <section id="engines" className="relative z-10 px-5 py-16 sm:py-20"><div className="container"><div className="mb-10 max-w-3xl"><p className="text-sm font-bold tracking-wide text-cyan-300">{choose({ ar: "المحركات الثلاثة", en: "Three engines" }, isAr)}</p><h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">{choose({ ar: "كل مرحلة لها غرض وحدود وصول محددة.", en: "Each stage has a defined purpose and access boundary." }, isAr)}</h2></div><div className="grid gap-5 lg:grid-cols-3">{engines.map((engine) => { const Icon = engine.icon; return <Card key={engine.code} className="flex border-white/10 bg-slate-950/60 text-slate-100"><CardContent className="flex w-full flex-col p-6"><div className="mb-5 flex items-center justify-between"><span className="grid size-11 place-items-center rounded-xl bg-cyan-300/10 text-cyan-200"><Icon className="size-5" /></span><Badge variant="outline" className="border-cyan-300/30 text-cyan-100">{engine.code}</Badge></div><h3 className="text-2xl font-bold">{choose(engine.title, isAr)}</h3><p className="mt-3 font-mono text-xs leading-6 text-cyan-100">{choose(engine.flow, isAr)}</p><p className="mt-4 flex-1 text-sm leading-6 text-slate-300">{choose(engine.body, isAr)}</p><Link href={engine.href} className="mt-7"><Button variant="outline" className="w-full border-white/20 bg-transparent text-white hover:bg-white/10">{choose({ ar: "فتح المسار", en: "Open path" }, isAr)}<DirectionalArrow className="ms-2 size-4" /></Button></Link></CardContent></Card>; })}</div></div></section>

    <section className="relative z-10 border-y border-white/10 bg-slate-950/50 px-5 py-16"><div className="container grid gap-8 lg:grid-cols-2"><div><p className="text-sm font-bold text-cyan-300">{choose({ ar: "كيف تبدأ", en: "How to begin" }, isAr)}</p><h2 className="mt-3 text-3xl font-black text-white">{choose({ ar: "ابدأ بسجل، لا بادعاء أو صفقة تلقائية.", en: "Begin with a record—not a claim or an automatic deal." }, isAr)}</h2><p className="mt-4 max-w-xl leading-7 text-slate-300">{choose({ ar: "ينشئ المبتكر سجل ابتكار، ثم يضيف أدلة مصرحًا بها، ويحفظ نسخة قابلة للتدقيق. بعد ذلك يمكن لفرق مخولة متابعة المطابقة والتفاعل والتسويق وفق السياق والصلاحيات.", en: "An innovator creates a record, adds authorized evidence, and saves an auditable version. Authorized teams can then proceed through matching, engagement, and commercialization according to context and capabilities." }, isAr)}</p></div><ol className="space-y-4">{[
      { number: "01", text: { ar: "سجل الابتكار والأدلة والنسخة الثابتة", en: "Innovation record, evidence, and immutable version" } },
      { number: "02", text: { ar: "اكتشاف ومطابقة قابلة للتفسير وتفاعل بشري", en: "Explainable discovery and matching with human engagement" } },
      { number: "03", text: { ar: "أصل ومعاملة منفصلان مع عناية واجبة وتنفيذ موثق", en: "Separate asset and transaction with due diligence and recorded execution" } },
    ].map((step) => <li key={step.number} className="flex gap-4 rounded-xl border border-white/10 bg-slate-900/60 p-4"><span className="font-mono text-cyan-300">{step.number}</span><span className="text-sm leading-6 text-slate-200">{choose(step.text, isAr)}</span></li>)}</ol></div></section>

    <section className="relative z-10 px-5 py-16"><div className="container rounded-2xl border border-cyan-300/20 bg-gradient-to-br from-cyan-400/10 to-blue-600/10 p-7 text-center sm:p-10"><h2 className="text-3xl font-black text-white">{choose({ ar: "مساحة عمل تحترم الحدود قبل السرعة.", en: "A workspace that respects boundaries before speed." }, isAr)}</h2><p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-slate-300">{choose({ ar: "لا تعرض الصفحة العامة أرقامًا تشغيلية أو شراكات أو تكاملات غير موثقة. تتطلب البيانات والعمليات المقيّدة تسجيل دخول وسياقًا مصرحًا به.", en: "The public page does not present unsourced operational metrics, partnerships, or integrations. Restricted data and actions require sign-in and authorized context." }, isAr)}</p><a className="mt-7 inline-block" href={actionHref}><Button className="bg-cyan-400 font-bold text-slate-950 hover:bg-cyan-300">{actionLabel}<DirectionalArrow className="ms-2 size-4" /></Button></a></div></section>

    <footer className="relative z-10 border-t border-white/10 px-5 py-8 text-sm text-slate-400"><div className="container flex flex-col justify-between gap-4 sm:flex-row"><span>© 2026 NAQLA 5.0</span><div className="flex gap-4"><Link href="/privacy" className="hover:text-cyan-200">{choose({ ar: "الخصوصية", en: "Privacy" }, isAr)}</Link><Link href="/terms" className="hover:text-cyan-200">{choose({ ar: "الشروط", en: "Terms" }, isAr)}</Link><Link href="/contact" className="hover:text-cyan-200">{choose({ ar: "التواصل", en: "Contact" }, isAr)}</Link></div></div></footer>
  </main>;
}
