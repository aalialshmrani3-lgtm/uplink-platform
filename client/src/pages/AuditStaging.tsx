import { useMemo, useState } from "react";
import { Link } from "wouter";

type AuditRole =
  | "innovator"
  | "company"
  | "investor"
  | "accelerator"
  | "organizer"
  | "admin";

type RoleDefinition = {
  id: AuditRole;
  title: string;
  subtitle: string;
  scope: string;
  reviewRoutes: Array<{ label: string; route: string; module: string }>;
};

const roles: RoleDefinition[] = [
  {
    id: "innovator",
    title: "المبتكر",
    subtitle: "Innovator",
    scope: "تقديم الفكرة، قراءة التقييم، متابعة المسار، والانتقال إلى الفرص.",
    reviewRoutes: [
      { label: "نقلة 1", route: "/naqla1", module: "تقديم وتحليل الفكرة" },
      { label: "تقديم فكرة", route: "/naqla1/submit", module: "نموذج الإدخال" },
      { label: "تقييم SAIP", route: "/saip-assessment", module: "تقييم قابلية الملكية الفكرية" },
      { label: "الأفكار الموجهة", route: "/naqla2/routed-ideas", module: "الفرص بعد التأهيل" },
    ],
  },
  {
    id: "company",
    title: "شركة / صاحبة تحدٍ",
    subtitle: "Company / Challenge Owner",
    scope: "إنشاء التحديات، استعراض الحلول، وفتح فرص التعاون أو الفعالية.",
    reviewRoutes: [
      { label: "تحديات نقلة 2", route: "/naqla2/challenges", module: "استعراض التحديات" },
      { label: "إرسال تحدٍ", route: "/naqla2/submit-challenge", module: "إنشاء تحدٍ" },
      { label: "الفعاليات", route: "/naqla2/events", module: "فعاليات واحتياجات" },
      { label: "غرفة الصفقة", route: "/naqla2/deal-room", module: "التفاوض" },
    ],
  },
  {
    id: "investor",
    title: "مستثمر",
    subtitle: "Investor",
    scope: "الاطلاع على الفرص، ملف المستثمر، المطابقة، والأصول التجارية.",
    reviewRoutes: [
      { label: "ملف المستثمر", route: "/naqla2/investor-profile", module: "بيانات المستثمر" },
      { label: "المطابقة", route: "/naqla2/matching", module: "Smart Matching" },
      { label: "سوق نقلة 3", route: "/naqla3/marketplace", module: "الأصول التجارية" },
      { label: "العقود", route: "/naqla3/contracts", module: "العقود والمراحل" },
    ],
  },
  {
    id: "accelerator",
    title: "مسرعة / حاضنة",
    subtitle: "Accelerator / Incubator",
    scope: "البحث عن ابتكارات وفرزها ومراجعة فرص المطابقة.",
    reviewRoutes: [
      { label: "فرص نقلة 1", route: "/naqla1/opportunities", module: "فرص الابتكار" },
      { label: "مركز المطابقة", route: "/naqla2/matching-hub", module: "فرز المطابقات" },
      { label: "المشاريع", route: "/naqla2/projects/1", module: "مراجعة مشروع" },
      { label: "لوحة نقلة 2", route: "/naqla2/dashboard", module: "مؤشرات تشغيلية" },
    ],
  },
  {
    id: "organizer",
    title: "منظم فعالية / هاكاثون",
    subtitle: "Event / Hackathon Organizer",
    scope: "إنشاء الهاكاثونات والفعاليات، واستعراض التسجيلات والاحتياجات.",
    reviewRoutes: [
      { label: "إنشاء هاكاثون", route: "/naqla2/hackathons/create", module: "إدخال هاكاثون" },
      { label: "إنشاء فعالية", route: "/naqla2/events/create", module: "إدخال فعالية" },
      { label: "لوحة الفعاليات", route: "/naqla2/events-dashboard", module: "إدارة فعالية" },
      { label: "لوحة الاحتياجات", route: "/naqla2/events-needs-board", module: "احتياجات ورعاة" },
    ],
  },
  {
    id: "admin",
    title: "إدارة المنصة",
    subtitle: "Admin",
    scope: "مراجعة لوحات المؤشرات والسجلات وصحة النظام وواجهات الإدارة.",
    reviewRoutes: [
      { label: "لوحة الإدارة", route: "/admin/dashboard", module: "إدارة المنصة" },
      { label: "سجل التدقيق", route: "/admin/audit-logs", module: "Audit Logs" },
      { label: "صحة النظام", route: "/admin/system-health", module: "System Health" },
      { label: "التحليلات", route: "/analytics-dashboard", module: "Analytics" },
    ],
  },
];

const statusStyle: Record<string, string> = {
  "Production implemented": "bg-emerald-500/15 text-emerald-200 border-emerald-400/40",
  Partial: "bg-amber-500/15 text-amber-100 border-amber-300/40",
  Demo: "bg-orange-500/15 text-orange-100 border-orange-300/40",
  "UI only": "bg-slate-500/15 text-slate-100 border-slate-300/40",
  "Planned/TODO": "bg-sky-500/15 text-sky-100 border-sky-300/40",
};

const scenarioCases = [
  {
    key: "A",
    score: "42%",
    title: "تحتاج تطويرًا",
    status: "Partial",
    detail: "ملاحظات، معلومات ناقصة، توصيات، وإعادة تقييم ضمن سيناريو التدقيق.",
  },
  {
    key: "B",
    score: "63%",
    title: "حل تجاري واعد",
    status: "Demo",
    detail: "مسار تجاري يتطلب اختبارًا على البيانات الفعلية عند إجراء التدقيق الخارجي.",
  },
  {
    key: "C",
    score: "78%",
    title: "ابتكار مؤهل",
    status: "Demo",
    detail: "القصة التجريبية الوحيدة: الانتقال الموثق إلى نقلة 2 لعرض فرص المطابقة.",
  },
];

export default function AuditStaging() {
  const [role, setRole] = useState<AuditRole>("innovator");
  const [selectedCase, setSelectedCase] = useState("C");
  const selectedRole = useMemo(() => roles.find((item) => item.id === role) ?? roles[0], [role]);
  const selectedScenario = scenarioCases.find((item) => item.key === selectedCase) ?? scenarioCases[2];

  return (
    <main dir="rtl" className="min-h-screen bg-[#071221] text-slate-100 selection:bg-cyan-300/30">
      <section className="border-b border-cyan-300/20 bg-gradient-to-l from-cyan-500/15 via-[#0d1d31] to-[#071221]">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-bold tracking-[0.22em] text-cyan-300">NAQLA AUDIT STAGING · BASELINE ONLY</p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">وضع تدقيق خارجي للمنصة</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                هذه بيئة مراجعة منظمة ومقيدة ببيانات تجريبية. لا تستدعي حسابات حقيقية، ولا تكتب في قاعدة البيانات، ولا تستخدم مفاتيح أو بيانات إنتاجية.
              </p>
            </div>
            <div className="max-w-sm border border-amber-300/35 bg-amber-400/10 px-4 py-3 text-sm leading-6 text-amber-50">
              <strong className="block text-amber-200">تنبيه للمراجع</strong>
              اختيار الدور هنا عدسة مراجعة فقط؛ لا يغيّر صلاحيات الإنتاج ولا ينشئ حسابًا أو جلسة دخول.
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-8 px-6 py-8 lg:px-10">
        <section aria-labelledby="roles-title" className="rounded-2xl border border-slate-700/80 bg-slate-900/55 p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="roles-title" className="text-lg font-bold text-white">مبدل الدور التدقيقي</h2>
              <p className="mt-1 text-sm text-slate-400">اختر الدور لمراجعة المداخل والصفحات المرتبطة به كما هي في النسخة الحالية.</p>
            </div>
            <span className="text-xs text-slate-500">Audit-only role lens</span>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {roles.map((item) => (
              <button
                key={item.id}
                data-testid={`audit-role-${item.id}`}
                type="button"
                onClick={() => setRole(item.id)}
                className={`rounded-xl border px-3 py-4 text-right transition ${role === item.id ? "border-cyan-300 bg-cyan-300/10 ring-1 ring-cyan-300/35" : "border-slate-700 bg-slate-950/40 hover:border-slate-500"}`}
              >
                <span className="block text-sm font-bold text-white">{item.title}</span>
                <span className="mt-1 block text-xs text-slate-400" dir="ltr">{item.subtitle}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
          <article className="rounded-2xl border border-slate-700/80 bg-slate-900/55 p-6">
            <p className="text-xs font-bold tracking-[0.18em] text-cyan-300">ROLE VIEW</p>
            <h2 className="mt-2 text-2xl font-bold text-white">{selectedRole.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">{selectedRole.scope}</p>
            <p className="mt-5 border-t border-slate-700 pt-4 text-xs leading-6 text-slate-500">
              لا يفترض هذا القسم أن الصفحات أو الأذونات تعمل كاملة؛ حالة كل رحلة ستوثّق في الحزمة النهائية من الاختبارات الفعلية.
            </p>
          </article>
          <article className="rounded-2xl border border-slate-700/80 bg-slate-900/55 p-6">
            <h2 className="text-lg font-bold text-white">مداخل المراجعة المتاحة</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {selectedRole.reviewRoutes.map((item) => (
                <Link
                  key={`${selectedRole.id}-${item.route}`}
                  href={item.route}
                  data-testid={`audit-route-${item.route.replaceAll("/", "-")}`}
                  className="group rounded-xl border border-slate-700 bg-slate-950/45 p-4 transition hover:border-cyan-300/70 hover:bg-cyan-300/5"
                >
                  <span className="block text-sm font-bold text-white group-hover:text-cyan-200">{item.label}</span>
                  <span className="mt-1 block text-xs text-slate-400">{item.module}</span>
                  <span className="mt-3 block text-[11px] text-cyan-300" dir="ltr">{item.route}</span>
                </Link>
              ))}
            </div>
          </article>
        </section>

        <section aria-labelledby="story-title" className="rounded-2xl border border-slate-700/80 bg-gradient-to-l from-slate-900/75 to-[#0d1d31] p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold tracking-[0.18em] text-cyan-300">CONNECTED DEMO STORY</p>
              <h2 id="story-title" className="mt-2 text-2xl font-bold text-white">حل ذكي لإدارة كفاءة الطاقة</h2>
            </div>
            <span className="rounded-full border border-orange-300/40 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-100">بيانات تجريبية فقط</span>
          </div>
          <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-slate-950/45 p-4"><dt className="text-slate-500">المبتكر</dt><dd className="mt-1 font-semibold text-white">سلمان العتيبي</dd></div>
            <div className="rounded-xl bg-slate-950/45 p-4"><dt className="text-slate-500">القطاع</dt><dd className="mt-1 font-semibold text-white">الطاقة والاستدامة</dd></div>
            <div className="rounded-xl bg-slate-950/45 p-4"><dt className="text-slate-500">المرحلة</dt><dd className="mt-1 font-semibold text-white">TRL 5 · نموذج أولي</dd></div>
            <div className="rounded-xl bg-slate-950/45 p-4"><dt className="text-slate-500">معرّف القصة</dt><dd className="mt-1 font-semibold text-white" dir="ltr">AUDIT-ENERGY-001</dd></div>
          </dl>
          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-bold">
            <span className="rounded-full bg-cyan-300/15 px-3 py-2 text-cyan-100">NAQLA 1 · تحليل</span>
            <span className="text-slate-500">←</span>
            <span className="rounded-full bg-cyan-300/15 px-3 py-2 text-cyan-100">NAQLA 2 · مطابقة/فرصة</span>
            <span className="text-slate-500">←</span>
            <span className="rounded-full bg-cyan-300/15 px-3 py-2 text-cyan-100">NAQLA 3 · أصل/اتفاق</span>
          </div>
        </section>

        <section aria-labelledby="cases-title" className="rounded-2xl border border-slate-700/80 bg-slate-900/55 p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="cases-title" className="text-lg font-bold text-white">حالات تقييم NAQLA 1</h2>
              <p className="mt-1 text-sm text-slate-400">هذه حالات مراجعة موثقة، ولا تمثل نتيجة تشغيلية أو تقييمًا حقيقيًا.</p>
            </div>
            <span className="text-xs text-slate-500">Demo scenario selector</span>
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {scenarioCases.map((item) => (
              <button
                key={item.key}
                type="button"
                data-testid={`audit-case-${item.key.toLowerCase()}`}
                onClick={() => setSelectedCase(item.key)}
                className={`rounded-xl border p-5 text-right transition ${selectedCase === item.key ? "border-cyan-300 bg-cyan-300/10" : "border-slate-700 bg-slate-950/35 hover:border-slate-500"}`}
              >
                <span className="text-xs font-bold text-slate-500">CASE {item.key}</span>
                <span className="mt-2 block text-4xl font-black text-white" dir="ltr">{item.score}</span>
                <span className="mt-3 block text-base font-bold text-white">{item.title}</span>
                <span className="mt-2 block text-sm leading-6 text-slate-400">{item.detail}</span>
              </button>
            ))}
          </div>
          <div className="mt-5 rounded-xl border border-cyan-300/20 bg-cyan-300/5 p-4 text-sm leading-7 text-cyan-50">
            <strong>الحالة المحددة: </strong>{selectedScenario.title} ({selectedScenario.score}).
            <span className={`mr-3 inline-flex rounded-full border px-2 py-0.5 text-xs ${statusStyle[selectedScenario.status]}`}>{selectedScenario.status}</span>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3" aria-label="حدود البيئة">
          {[
            ["قاعدة البيانات", "لا يوجد اتصال كتابة من صفحة التدقيق. القصة المعروضة محلية وثابتة."],
            ["التكاملات", "لا يتم استدعاء SAIP أو مزود دفع أو Escrow أو Blockchain من هذه الصفحة."],
            ["الأسرار والهوية", "لا تعرض البيئة أسرارًا أو بيانات شخصية أو كلمات مرور أو مفاتيح API."],
          ].map(([title, body]) => (
            <article key={title} className="rounded-xl border border-slate-700 bg-slate-900/55 p-5">
              <h2 className="font-bold text-white">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
