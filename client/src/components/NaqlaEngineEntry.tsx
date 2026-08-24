import React, { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";

type Engine = "qualify" | "connect" | "platform";

const details: Record<Engine, { destination: string; ar: { eyebrow: string; title: string; body: string }; en: { eyebrow: string; title: string; body: string } }> = {
  qualify: {
    destination: "/naqla1/submit",
    ar: { eyebrow: "NAQLA1 — التأهيل", title: "سجل الابتكار والأدلة ضمن مساحة مصرح بها.", body: "يتطلب إنشاء السجل أو قراءته أو تعديل أدلته عضوية فعالة وسياقًا نشطًا. لا تعرض هذه الصفحة أي سجلات أو مؤشرات تجريبية عامة." },
    en: { eyebrow: "NAQLA1 — QUALIFY", title: "Innovation records and evidence belong in an authorized workspace.", body: "Creating, reading, or changing a record and its evidence requires active membership and active context. This entry shows no public records or demo metrics." },
  },
  connect: {
    destination: "/naqla2/matching-hub",
    ar: { eyebrow: "NAQLA2 — الاتصال", title: "المطابقة والتفاعل يعملان ضمن صلاحيات صريحة.", body: "طلبات المطابقة والتقديمات والتفاعل لا تعرض من هذا المدخل العام، ولا تمنح أي حق إفصاح أو قرار قبول تلقائي." },
    en: { eyebrow: "NAQLA2 — CONNECT", title: "Matching and engagement operate through explicit authorization.", body: "Match requests, applications, and engagement are not exposed from this public entry and grant no disclosure right or automatic acceptance." },
  },
  platform: {
    destination: "/dashboard",
    ar: { eyebrow: "مساحة NAQLA", title: "ابدأ ضمن السياق الذي تملكه عضويتك.", body: "تُحدد المساحة المتاحة بعد تسجيل الدخول والسياق النشط. لا ينشئ المدخل العام سياقًا اصطناعيًا أو صلاحية بديلة." },
    en: { eyebrow: "NAQLA WORKSPACE", title: "Start inside the context your membership authorizes.", body: "Available workspace is determined after sign-in and active context. This public entry creates neither a synthetic context nor substitute access." },
  },
};

export function NaqlaEngineEntry({ engine }: { engine: Engine }) {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [, setLocation] = useLocation();
  const isArabic = language === "ar";
  const detail = details[engine][isArabic ? "ar" : "en"];
  const DirectionalArrow = isArabic ? ArrowLeft : ArrowRight;

  useEffect(() => {
    if (user) setLocation(details[engine].destination);
  }, [engine, setLocation, user]);

  if (user) {
    return <main className="grid min-h-screen place-items-center bg-slate-950 text-slate-100"><p className="text-sm text-slate-300">{isArabic ? "يجري فتح مساحة العمل…" : "Opening workspace…"}</p></main>;
  }

  return <main dir={isArabic ? "rtl" : "ltr"} className="grid min-h-screen place-items-center bg-[#050b1a] px-5 text-slate-100">
    <section className="w-full max-w-2xl rounded-3xl border border-cyan-300/20 bg-slate-950/70 p-7 shadow-2xl shadow-cyan-950/20 sm:p-10">
      <div className="grid size-12 place-items-center rounded-2xl bg-cyan-300/10 text-cyan-200"><LockKeyhole className="size-6" /></div>
      <p className="mt-6 text-sm font-bold tracking-wide text-cyan-300">{detail.eyebrow}</p>
      <h1 className="mt-3 text-3xl font-black leading-tight text-white sm:text-4xl">{detail.title}</h1>
      <p className="mt-5 leading-8 text-slate-300">{detail.body}</p>
      <div className="mt-7 rounded-2xl border border-emerald-300/20 bg-emerald-300/5 p-4 text-sm leading-6 text-emerald-100"><ShieldCheck className="me-2 inline size-4" />{isArabic ? "لا تُعرض بيانات مقيدة أو مؤشرات تجريبية في المدخل العام." : "No restricted data or demo metrics are displayed on this public entry."}</div>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row"><a href={getLoginUrl()}><Button className="w-full bg-cyan-400 font-bold text-slate-950 hover:bg-cyan-300 sm:w-auto">{isArabic ? "تسجيل الدخول الآمن" : "Sign in securely"}<DirectionalArrow className="ms-2 size-4" /></Button></a><Link href="/"><Button variant="outline" className="w-full border-white/20 bg-transparent text-white hover:bg-white/10 sm:w-auto">{isArabic ? "العودة للرئيسية" : "Back home"}</Button></Link></div>
    </section>
  </main>;
}
