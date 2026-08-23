import { useMemo, useState } from "react";
import { ArrowRight, BadgeCheck, Building2, CheckCircle2, ChevronLeft, CircleAlert, FileCheck2, Landmark, LockKeyhole, Rocket, ShieldCheck, Sparkles, UsersRound } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { INITIAL_JOURNEY_STATE, JOURNEY_STAGES, JourneyStage, NaqlaPersona, advanceJourney, applyJourneyControl, canAdvanceJourney, personaCanReviewEvidence } from "@shared/naqlaJourney";

const labels: Record<JourneyStage, { ar: string; en: string; engine: "NAQLA1" | "NAQLA2" | "NAQLA3" }> = {
  understand: { ar: "فهم السجل", en: "Understand record", engine: "NAQLA1" },
  evidence: { ar: "تفويض الدليل", en: "Authorize evidence", engine: "NAQLA1" },
  evaluate: { ar: "تقييم حتمي", en: "Deterministic evaluation", engine: "NAQLA1" },
  improve: { ar: "معالجة النواقص", en: "Address gaps", engine: "NAQLA1" },
  qualify: { ar: "تأهيل", en: "Qualify", engine: "NAQLA1" },
  route: { ar: "توجيه", en: "Route", engine: "NAQLA1" },
  discover: { ar: "اكتشاف فرصة", en: "Discover opportunity", engine: "NAQLA2" },
  match: { ar: "مطابقة قابلة للتفسير", en: "Explainable match", engine: "NAQLA2" },
  apply: { ar: "نسخة تقديم ثابتة", en: "Immutable application", engine: "NAQLA2" },
  pilot: { ar: "تهيئة Pilot", en: "Prepare pilot", engine: "NAQLA2" },
  prepare: { ar: "إعداد الأصل", en: "Prepare asset", engine: "NAQLA3" },
  diligence: { ar: "تحقق بشري", en: "Human due diligence", engine: "NAQLA3" },
  contract: { ar: "مسار العقد", en: "Contract track", engine: "NAQLA3" },
  execute: { ar: "تنفيذ", en: "Execute", engine: "NAQLA3" },
  scale: { ar: "توسع", en: "Scale", engine: "NAQLA3" },
};

const personas: Array<{ value: NaqlaPersona; ar: string; en: string }> = [
  { value: "innovator", ar: "مبتكر", en: "Innovator" },
  { value: "researcher", ar: "باحث", en: "Researcher" },
  { value: "startup", ar: "شركة ناشئة", en: "Startup" },
  { value: "university", ar: "جامعة", en: "University" },
  { value: "company", ar: "شركة", en: "Company" },
  { value: "investor", ar: "مستثمر", en: "Investor" },
  { value: "government", ar: "جهة حكومية", en: "Government entity" },
  { value: "reviewer", ar: "مراجع", en: "Reviewer" },
  { value: "program_manager", ar: "مدير برنامج", en: "Program manager" },
  { value: "admin", ar: "مدير نظام", en: "Administrator" },
];

const nextActions: Record<JourneyStage, { ar: string; en: string }> = {
  understand: { ar: "وثّق مشكلة الابتكار ضمن مساحة العمل الاصطناعية.", en: "Document the innovation problem in the synthetic workspace." },
  evidence: { ar: "أرفق دليلاً اصطناعياً مصرحاً به بشكل مستقل.", en: "Attach an independently authorized synthetic evidence item." },
  evaluate: { ar: "شغّل التقييم الحتمي للجاهزية.", en: "Run the deterministic readiness evaluation." },
  improve: { ar: "عالج النقص الموثق قبل التأهيل.", en: "Address the documented gap before qualification." },
  qualify: { ar: "أكد نتيجة التأهيل الحتمية.", en: "Confirm the deterministic qualification outcome." },
  route: { ar: "راجع teaser الفرصة دون كشف الدليل.", en: "Review the opportunity teaser without exposing evidence." },
  discover: { ar: "شغّل المطابقة القابلة للتفسير.", en: "Run the explainable deterministic match." },
  match: { ar: "أنشئ نسخة تقديم اصطناعية ثابتة.", en: "Create an immutable synthetic application version." },
  apply: { ar: "راجع الأهلية وانتقل لتخطيط Pilot.", en: "Review eligibility and move the engagement to pilot planning." },
  pilot: { ar: "أعد نطاق أصل تجاري؛ لا يوجد استنتاج قانوني هنا.", en: "Prepare a commercial asset scope; no legal conclusion is produced." },
  prepare: { ar: "أكمل تحقق العناية الواجبة بأدلة مصرح بها فقط.", en: "Complete due-diligence checklist items with authorized evidence only." },
  diligence: { ar: "سجّل قرار الجاهزية للعقد للمراجعة البشرية.", en: "Record a contract-ready decision for human review." },
  contract: { ar: "ابدأ التنفيذ بعد مسار العقد المملوك للبشر.", en: "Start execution only after the human-owned contract process." },
  execute: { ar: "سجل جاهزية التوسع من دون إنشاء معاملة آلية.", en: "Record scale readiness without creating an automated transaction." },
  scale: { ar: "اكتملت الرحلة. حافظ على تفويض الدليل وسجل التدقيق.", en: "Journey completed. Keep evidence authorization and audit history intact." },
};

function copy(ar: string, en: string, isArabic: boolean) {
  return isArabic ? ar : en;
}

export default function NaqlaJourneyWorkspace() {
  const { language, setLanguage, isRTL } = useLanguage();
  const { user } = useAuth();
  const isArabic = language === "ar";
  const [persona, setPersona] = useState<NaqlaPersona>("innovator");
  const [state, setState] = useState(INITIAL_JOURNEY_STATE);
  const [invitedEmail, setInvitedEmail] = useState("");
  const [serverDemoId, setServerDemoId] = useState<number | null>(null);
  const [notice, setNotice] = useState(copy("ابدأ بتوثيق السجل الاصطناعي.", "Start by documenting the synthetic record.", isArabic));
  const current = labels[state.stage];
  const progress = Math.round((state.completed.length / JOURNEY_STAGES.length) * 100);
  const personaLabel = personas.find((item) => item.value === persona);
  const contextsQuery = trpc.organizationContext.myContexts.useQuery(undefined, { enabled: Boolean(user) });
  const pendingInvitationsQuery = trpc.organizationContext.myPendingInvitations.useQuery(undefined, { enabled: Boolean(user) });
  const serverContexts = (contextsQuery.data ?? []).filter((context): context is NonNullable<typeof context> => Boolean(context));
  const activeServerContext = serverContexts.find((context) => context.isActiveContext) ?? serverContexts[0];
  const serverInvitationManager = activeServerContext ? ['owner', 'manager'].includes(activeServerContext.role) : false;
  const effectivePersona: NaqlaPersona = activeServerContext ? (activeServerContext.role === 'reviewer' ? 'reviewer' : activeServerContext.role === 'manager' || activeServerContext.role === 'owner' ? 'program_manager' : 'innovator') : persona;
  const createDemoContext = trpc.organizationContext.create.useMutation({
    onSuccess: () => {
      void contextsQuery.refetch();
      setNotice(copy("تم إنشاء سياق عرض اصطناعي خادمي وربطه بعضويتك.", "A server-side synthetic demo context was created and linked to your membership.", isArabic));
    },
    onError: () => setNotice(copy("تعذر إنشاء السياق الخادمي؛ استمر العرض المحلي دون بديل خفي.", "The server context could not be created; the local demo continues with no hidden fallback.", isArabic)),
  });
  const setActiveServerContext = trpc.organizationContext.setActive.useMutation({
    onSuccess: () => {
      void contextsQuery.refetch();
      setNotice(copy("تم تبديل السياق النشط بعد تحقق العضوية.", "The active context was switched after membership verification.", isArabic));
    },
    onError: () => setNotice(copy("تعذر تبديل السياق؛ لا يُقبل أي سياق دون عضوية نشطة.", "The context could not be switched; no context is accepted without active membership.", isArabic)),
  });
  const inviteServerMember = trpc.organizationContext.invite.useMutation({
    onSuccess: () => {
      setInvitedEmail("");
      setNotice(copy("سُجلت الدعوة الخادمية بحالة معلقة؛ لا تمنح وصولاً قبل قبول الحساب المدعو.", "The server invitation is pending and grants no access until the invited account accepts it.", isArabic));
    },
    onError: () => setNotice(copy("تعذر تسجيل الدعوة؛ لم تُنشأ صلاحية وصول بديلة.", "The invitation could not be recorded; no substitute access permission was created.", isArabic)),
  });
  const acceptServerInvitation = trpc.organizationContext.acceptInvitation.useMutation({
    onSuccess: () => {
      void Promise.all([contextsQuery.refetch(), pendingInvitationsQuery.refetch()]);
      setNotice(copy("قُبلت الدعوة وأُنشئت العضوية الخادمية؛ يمكنك الآن تبديل السياق وفق العضوية النشطة.", "The invitation was accepted and a server membership was created; you can now switch context according to active membership.", isArabic));
    },
    onError: () => setNotice(copy("تعذر قبول الدعوة؛ لم تُنشأ أي عضوية بديلة.", "The invitation could not be accepted; no substitute membership was created.", isArabic)),
  });
  const createServerDemo = trpc.cr01.createEnergyDemo.useMutation({
    onSuccess: (result) => {
      setServerDemoId(result.ideaId);
      setNotice(copy("أُنشئ سيناريو عرض اصطناعي في مساحة عملك الخادمية.", "A synthetic demo scenario was created in your server workspace.", isArabic));
    },
    onError: () => setNotice(copy("تعذر إنشاء العرض الخادمي؛ لم يُنشأ أي سجل محلي بديل.", "The server demo could not be created; no local substitute record was created.", isArabic)),
  });

  const control = useMemo(() => {
    if (state.stage === "understand") return { id: "save_record_version" as const, label: copy("حفظ نسخة سجل الابتكار", "Save innovation record version", isArabic), icon: FileCheck2 };
    if (state.stage === "evidence") return { id: "authorize_evidence" as const, label: copy("تفويض الدليل الاصطناعي", "Authorize synthetic evidence", isArabic), icon: LockKeyhole };
    if (state.stage === "evaluate") return { id: "evaluate_readiness" as const, label: copy("تشغيل تقييم الجاهزية الحتمي", "Run deterministic readiness evaluation", isArabic), icon: BadgeCheck };
    if (state.stage === "improve") return { id: "address_gaps" as const, label: copy("تأكيد معالجة النواقص", "Confirm documented gaps addressed", isArabic), icon: CheckCircle2 };
    if (state.stage === "qualify") return { id: "qualify_record" as const, label: copy("تأكيد التأهيل الحتمي", "Confirm deterministic qualification", isArabic), icon: ShieldCheck };
    if (state.stage === "match") return { id: "generate_match_run" as const, label: copy("إنشاء MatchRun قابل للتفسير", "Generate explainable MatchRun", isArabic), icon: UsersRound };
    if (state.stage === "apply") return { id: "create_application_version" as const, label: copy("إنشاء نسخة تقديم ثابتة", "Create immutable application version", isArabic), icon: FileCheck2 };
    if (state.stage === "pilot" && !state.interestAccepted) return { id: "accept_interest" as const, label: copy("قبول Interest ضمن السياق", "Accept interest in this context", isArabic), icon: UsersRound };
    if (state.stage === "pilot" && !state.engagementEstablished) return { id: "establish_engagement" as const, label: copy("إنشاء Engagement", "Establish engagement", isArabic), icon: Building2 };
    if (state.stage === "pilot") return { id: "ready_for_pilot" as const, label: copy("تأكيد جاهزية Pilot", "Confirm pilot readiness", isArabic), icon: UsersRound };
    if (state.stage === "diligence") return { id: "prepare_asset" as const, label: copy("إعداد نطاق الأصل التجاري", "Prepare commercial asset scope", isArabic), icon: Building2 };
    if (state.stage === "contract") return { id: "start_transaction" as const, label: copy("بدء تتبع المعاملة", "Start transaction tracking", isArabic), icon: Landmark };
    return null;
  }, [isArabic, state.stage]);

  const advance = () => {
    if (!canAdvanceJourney(state)) {
      setNotice(copy("يلزم إكمال الإجراء الحتمي الحالي قبل الانتقال. لا يوجد تجاوز إداري ضمن هذا السيناريو.", "Complete the current deterministic control before continuing. This scenario has no administrator bypass.", isArabic));
      return;
    }
    const next = advanceJourney(state);
    setState(next);
    setNotice(copy(`انتقلت الرحلة إلى: ${labels[next.stage].ar}.`, `Journey advanced to: ${labels[next.stage].en}.`, isArabic));
  };

  const act = () => {
    if (!control) return;
    setState((previous) => applyJourneyControl(previous, control.id));
    setNotice(copy("تم تسجيل الإجراء في سيناريو العرض الاصطناعي فقط.", "The action is recorded in the synthetic demo scenario only.", isArabic));
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100" dir={isRTL ? "rtl" : "ltr"}>
      <header className="border-b border-white/10 bg-slate-950/95 px-4 py-4 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-slate-950"><Sparkles className="h-5 w-5" /></div>
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300">NAQLA OPERATING JOURNEY</p>
              <h1 className="text-xl font-bold">{copy("مساحة تشغيل المنصة", "Platform operating workspace", isArabic)}</h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1.5 text-xs font-semibold text-amber-200">{copy("عرض اصطناعي — دون بيانات حقيقية أو تكامل خارجي", "Synthetic demo — no real data or external integration", isArabic)}</span>
            {user && <button type="button" disabled={createServerDemo.isPending || serverDemoId !== null} onClick={() => createServerDemo.mutate()} className="rounded-lg border border-emerald-300/40 px-3 py-1.5 text-xs font-semibold text-emerald-100 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-emerald-300">{serverDemoId ? copy("عرض خادمي جاهز", "Server demo ready", isArabic) : copy("إنشاء عرض خادمي", "Create server demo", isArabic)}</button>}
            <button type="button" onClick={() => setLanguage(isArabic ? "en" : "ar")} className="rounded-lg border border-white/15 px-3 py-1.5 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-cyan-300">
              {isArabic ? "English" : "العربية"}
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
        <div className="grid gap-5 xl:grid-cols-[1.1fr_1.9fr]">
          <aside className="space-y-5">
            <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-5">
              <div className="flex items-center justify-between gap-4">
                <div><p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">{copy("السياق النشط", "Active context", isArabic)}</p><h2 className="mt-1 font-semibold">{contextsQuery.isLoading ? copy("جار تحميل السياق…", "Loading context…", isArabic) : contextsQuery.isError ? copy("تعذر تحميل السياق", "Context could not be loaded", isArabic) : activeServerContext ? (isArabic ? activeServerContext.nameAr : activeServerContext.nameEn || activeServerContext.nameAr) : user ? copy("لا يوجد سياق خادمي", "No server context", isArabic) : copy("منظمة العرض الاصطناعي", "Synthetic demo organization", isArabic)}</h2></div>
                <ShieldCheck className="h-6 w-6 text-emerald-300" aria-label={copy("سياق معزول", "Isolated context", isArabic)} />
              </div>
              {user && serverContexts.length > 1 && <label className="mt-4 block text-xs font-medium text-slate-300" htmlFor="server-context">{copy("تبديل السياق الخادمي", "Switch server context", isArabic)}<select id="server-context" value={activeServerContext?.id ?? ""} disabled={setActiveServerContext.isPending} onChange={(event) => setActiveServerContext.mutate({ organizationId: Number(event.target.value) })} className="mt-2 w-full rounded-xl border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-300">{serverContexts.map((context) => <option key={context.id} value={context.id}>{isArabic ? context.nameAr : context.nameEn || context.nameAr}</option>)}</select></label>}
              <label className="mt-5 block text-sm font-medium text-slate-300" htmlFor="persona">{copy("الدور", "Persona", isArabic)}</label>
              <select id="persona" value={persona} onChange={(event) => setPersona(event.target.value as NaqlaPersona)} className="mt-2 w-full rounded-xl border border-white/15 bg-slate-950 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-300">
                {personas.map((item) => <option key={item.value} value={item.value}>{isArabic ? item.ar : item.en}</option>)}
              </select>
              <p className="mt-3 text-xs leading-5 text-slate-400">{personaCanReviewEvidence(effectivePersona) ? copy("الدور الخادمي أو دور العرض يمكنه مراجعة الدليل عند وجود تفويض مستقل.", "The server role or demo role may review evidence only after independent authorization.", isArabic) : copy("هذا الدور لا يحصل على حق الدليل تلقائياً.", "This role receives no evidence right by implication.", isArabic)}</p>
              {user && !activeServerContext && <button type="button" disabled={createDemoContext.isPending} onClick={() => createDemoContext.mutate({ nameAr: "سياق عرض اصطناعي", nameEn: "Synthetic demo context", type: "supporting", scope: "local" })} className="mt-3 w-full rounded-lg border border-violet-300/40 px-3 py-2 text-xs font-semibold text-violet-100 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-violet-300">{copy("إنشاء سياق عرض خادمي", "Create server demo context", isArabic)}</button>}
              <div className="mt-4 rounded-xl border border-white/10 bg-slate-950/60 p-3"><p className="text-xs font-semibold text-slate-300">{copy("دعوة عضوية خادمية", "Server membership invitation", isArabic)}</p>{activeServerContext ? <>{serverInvitationManager ? <><label className="mt-3 block text-xs text-slate-400" htmlFor="invite-email">{copy("البريد الإلكتروني للحساب المدعو", "Invited account email", isArabic)}</label><input id="invite-email" type="email" value={invitedEmail} onChange={(event) => setInvitedEmail(event.target.value)} placeholder="name@example.com" className="mt-2 w-full rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-300" /><button type="button" disabled={!invitedEmail || inviteServerMember.isPending} onClick={() => inviteServerMember.mutate({ organizationId: activeServerContext.id, invitedEmail, role: 'member' })} className="mt-3 rounded-lg border border-cyan-300/40 px-3 py-2 text-xs font-semibold text-cyan-100 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-cyan-300">{copy("تسجيل دعوة معلقة", "Record pending invitation", isArabic)}</button></> : <p className="mt-1 text-xs leading-5 text-slate-400">{copy("دعوات الأعضاء مقصورة على المالك أو المدير في السياق الخادمي.", "Member invitations are limited to an owner or manager in the server context.", isArabic)}</p>}</> : <p className="mt-1 text-xs leading-5 text-slate-400">{copy("سجّل الدخول وأنشئ أو اختر سياقاً خادمياً قبل إرسال دعوة. لا توجد دعوة محلية بديلة.", "Sign in and create or select a server context before inviting a member. No local invitation fallback exists.", isArabic)}</p>}</div>
              {user && (pendingInvitationsQuery.data?.length ?? 0) > 0 && <div className="mt-3 rounded-xl border border-emerald-300/25 bg-emerald-300/5 p-3"><p className="text-xs font-semibold text-emerald-100">{copy("دعواتك المعلقة", "Your pending invitations", isArabic)}</p>{pendingInvitationsQuery.data?.map((invitation) => <div key={invitation.id} className="mt-2 flex items-center justify-between gap-2 text-xs text-slate-300"><span>{copy("سياق مؤسسة بانتظار القبول", "Organization context awaiting acceptance", isArabic)}</span><button type="button" disabled={acceptServerInvitation.isPending} onClick={() => acceptServerInvitation.mutate({ invitationId: invitation.id })} className="rounded-lg border border-emerald-300/40 px-2 py-1 font-semibold text-emerald-100 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-emerald-300">{copy("قبول", "Accept", isArabic)}</button></div>)}</div>}
            </section>

            <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-5">
              <div className="flex items-center justify-between"><h2 className="font-semibold">{copy("محركات NAQLA", "NAQLA engines", isArabic)}</h2><span className="text-sm text-cyan-300">{progress}%</span></div>
              <div className="mt-3 h-2 rounded-full bg-white/10"><div className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" style={{ width: `${progress}%` }} /></div>
              <div className="mt-5 space-y-3">
                {(["NAQLA1", "NAQLA2", "NAQLA3"] as const).map((engine) => {
                  const complete = JOURNEY_STAGES.filter((stage) => labels[stage].engine === engine && state.completed.includes(stage)).length;
                  const total = JOURNEY_STAGES.filter((stage) => labels[stage].engine === engine).length;
                  return <div key={engine} className={`rounded-2xl border p-3 ${current.engine === engine ? "border-cyan-300/50 bg-cyan-300/10" : "border-white/10 bg-white/[0.03]"}`}><div className="flex items-center justify-between"><span className="font-semibold">{engine}</span><span className="text-xs text-slate-400">{complete}/{total}</span></div><p className="mt-1 text-xs text-slate-300">{engine === "NAQLA1" ? copy("التأهيل", "Qualify", isArabic) : engine === "NAQLA2" ? copy("الاتصال", "Connect", isArabic) : copy("التسويق", "Commercialize", isArabic)}</p></div>;
                })}
              </div>
            </section>
          </aside>

          <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/50 p-5 sm:p-8">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div>
                <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300">{current.engine}</p>
                <h2 className="mt-2 text-3xl font-bold">{isArabic ? current.ar : current.en}</h2>
                <p className="mt-3 max-w-2xl leading-7 text-slate-300">{isArabic ? nextActions[state.stage].ar : nextActions[state.stage].en}</p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-2 text-sm font-semibold text-emerald-200"><BadgeCheck className="h-4 w-4" />{copy("قرار حتمي", "Deterministic decision", isArabic)}</span>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <article className="rounded-2xl border border-white/10 bg-slate-950/50 p-4"><FileCheck2 className="h-5 w-5 text-cyan-300" /><h3 className="mt-3 font-semibold">{copy("سجل الابتكار", "Innovation record", isArabic)}</h3><p className="mt-1 text-sm text-slate-400">{state.recordVersion > 0 ? copy(`نسخة اصطناعية محفوظة: ${state.recordVersion}.`, `Synthetic version saved: ${state.recordVersion}.`, isArabic) : copy("مفهوم موثق، إصدار محدد، ونواقص مرئية.", "Documented concept, versioned record, and visible gaps.", isArabic)}</p></article>
              <article className="rounded-2xl border border-white/10 bg-slate-950/50 p-4"><LockKeyhole className="h-5 w-5 text-violet-300" /><h3 className="mt-3 font-semibold">{copy("إذن الدليل", "Evidence authorization", isArabic)}</h3><p className="mt-1 text-sm text-slate-400">{copy("لا تُعرض الأدلة للمطابقة أو المراجعة ضمنياً.", "Evidence is never disclosed implicitly to matching or review.", isArabic)}</p></article>
              <article className="rounded-2xl border border-white/10 bg-slate-950/50 p-4"><Rocket className="h-5 w-5 text-amber-300" /><h3 className="mt-3 font-semibold">{copy("التوجيه", "Route", isArabic)}</h3><p className="mt-1 text-sm text-slate-400">{copy("يتبع التأهل بمسار فرصة ومطابقة قابل للتفسير.", "Qualification routes into an explainable opportunity and match flow.", isArabic)}</p></article>
            </div>

            <section className="mt-4 rounded-2xl border border-white/10 bg-slate-950/40 p-4"><div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-emerald-300" /><h3 className="font-semibold">{copy("Innovation Passport وTRL", "Innovation Passport and TRL", isArabic)}</h3></div><p className="mt-2 text-sm leading-6 text-slate-300">{copy("يعرض الجواز القرار الحتمي والنواقص وخطوة العمل التالية. عند انطباق TRL يبقى مستوى المُدّعي ودعم الدليل والمراجعة البشرية حقولاً منفصلة؛ لا يحولها النظام إلى قرار تلقائي.", "The passport presents the deterministic outcome, gaps, and next action. When TRL applies, claimed level, evidence support, and human review remain separate fields; the system does not turn them into an automatic decision.", isArabic)}</p></section>

            <section className="mt-4 grid gap-3 md:grid-cols-2" aria-label={copy("حالة التسويق", "Commercialization status", isArabic)}><article className="rounded-2xl border border-violet-300/25 bg-violet-300/5 p-4"><p className="text-xs font-semibold tracking-[0.14em] text-violet-200">COMMERCIAL ASSET</p><h3 className="mt-2 font-semibold">{copy("الأصل التجاري", "Commercial asset", isArabic)}</h3><p className="mt-2 text-sm leading-6 text-slate-300">{state.commercialAssetPrepared ? copy("تم إعداد نطاق الأصل للمراجعة البشرية. لا توجد نتيجة ملكية فكرية تلقائية.", "The asset scope is prepared for human review. No automatic IP conclusion exists.", isArabic) : copy("لم يُعد نطاق الأصل بعد؛ يبقى مسار العناية الواجبة محجوباً.", "The asset scope is not yet prepared; due diligence remains blocked.", isArabic)}</p></article><article className="rounded-2xl border border-fuchsia-300/25 bg-fuchsia-300/5 p-4"><p className="text-xs font-semibold tracking-[0.14em] text-fuchsia-200">COMMERCIAL TRANSACTION</p><h3 className="mt-2 font-semibold">{copy("المعاملة التجارية", "Commercial transaction", isArabic)}</h3><p className="mt-2 text-sm leading-6 text-slate-300">{state.commercialTransactionStarted ? copy("بدأ التتبع فقط؛ لا ينشئ النظام عقداً أو دفعة أو التزاماً قانونياً تلقائياً.", "Tracking has started only; the system creates no automated contract, payment, or legal commitment.", isArabic) : copy("لم يبدأ تتبع المعاملة؛ يظل الأصل منفصلاً عنها.", "Transaction tracking has not started; the asset remains separate from it.", isArabic)}</p></article></section>

            <div className="mt-8 rounded-2xl border border-white/10 bg-slate-950/70 p-4" aria-live="polite"><div className="flex gap-3"><CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" /><p className="text-sm leading-6 text-slate-200">{notice}</p></div></div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              {control && <button type="button" onClick={act} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-cyan-300/40 bg-cyan-300/10 px-5 py-3 font-semibold text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-300"><control.icon className="h-4 w-4" />{control.label}</button>}
              <button type="button" onClick={advance} disabled={state.stage === "scale"} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-cyan-100">{copy("متابعة الخطوة الحتمية", "Continue deterministic step", isArabic)} {isRTL ? <ArrowRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}</button>
              {state.evidenceAuthorized && <button type="button" onClick={() => { setState((previous) => applyJourneyControl(previous, "revoke_evidence")); setNotice(copy("أُلغي تفويض الدليل؛ يلزم تفويض جديد قبل استمرار المرحلة التابعة.", "Evidence authorization was revoked; a new authorization is required before the dependent stage can continue.", isArabic)); }} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-rose-300/40 px-5 py-3 font-semibold text-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-300"><LockKeyhole className="h-4 w-4" />{copy("إلغاء تفويض الدليل", "Revoke evidence authorization", isArabic)}</button>}
            </div>

            <div className="mt-10 border-t border-white/10 pt-6"><h3 className="font-semibold">{copy("خريطة journey", "Journey map", isArabic)}</h3><ol className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">{JOURNEY_STAGES.map((stage) => <li key={stage} className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${stage === state.stage ? "border-cyan-300/50 bg-cyan-300/10 text-white" : state.completed.includes(stage) ? "border-emerald-400/25 bg-emerald-400/5 text-emerald-100" : "border-white/10 text-slate-400"}`}>{state.completed.includes(stage) ? <CheckCircle2 className="h-4 w-4" /> : <span className="h-4 w-4 rounded-full border border-current" />}{isArabic ? labels[stage].ar : labels[stage].en}</li>)}</ol></div>
          </section>
        </div>
      </section>
    </main>
  );
}
