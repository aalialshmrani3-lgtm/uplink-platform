import React, { useMemo, useState } from "react";
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
  const [interestMessage, setInterestMessage] = useState("");
  const [matchQuery, setMatchQuery] = useState("");
  const [serverDemoId, setServerDemoId] = useState<number | null>(null);
  const [naqla1RecordId, setNaqla1RecordId] = useState<number | null>(null);
  const [applicationId, setApplicationId] = useState<number | null>(null);
  const [notice, setNotice] = useState(copy("ابدأ بتوثيق السجل الاصطناعي.", "Start by documenting the synthetic record.", isArabic));
  const current = labels[state.stage];
  const progress = Math.round((state.completed.length / JOURNEY_STAGES.length) * 100);
  const personaLabel = personas.find((item) => item.value === persona);
  const contextsQuery = trpc.organizationContext.myContexts.useQuery(undefined, { enabled: Boolean(user) });
  const pendingInvitationsQuery = trpc.organizationContext.myPendingInvitations.useQuery(undefined, { enabled: Boolean(user) });
  const serverDemoBundleQuery = trpc.cr01.getBundle.useQuery({ ideaId: serverDemoId ?? 1 }, { enabled: Boolean(user && serverDemoId) });
  const naqla1RecordsQuery = trpc.naqla1Qualification.getMyRecords.useQuery(undefined, { enabled: Boolean(user) });
  const naqla1PassportQuery = trpc.naqla1Qualification.getPassport.useQuery({ recordId: naqla1RecordId ?? 1 }, { enabled: Boolean(user && naqla1RecordId) });
  const publishedTeasersQuery = trpc.naqla2.marketplace.getApprovedIPs.useQuery();
  const matchRunsQuery = trpc.naqla2.deterministicMatching.getMyRuns.useQuery(undefined, { enabled: Boolean(user) });
  const latestMatchRunId = matchRunsQuery.data?.[0]?.id;
  const latestMatchRunQuery = trpc.naqla2.deterministicMatching.getRun.useQuery({ runId: latestMatchRunId ?? 1 }, { enabled: Boolean(user && latestMatchRunId) });
  const matchingRequestsQuery = trpc.naqla2.matching.getMyMatches.useQuery(undefined, { enabled: Boolean(user) });
  const applicationsQuery = trpc.naqla2.applications.getMyApplications.useQuery(undefined, { enabled: Boolean(user) });
  const interestRequestsQuery = trpc.naqla2.engagements.getMyInterestRequests.useQuery(undefined, { enabled: Boolean(user) });
  const engagementsQuery = trpc.naqla2.engagements.getMyEngagements.useQuery(undefined, { enabled: Boolean(user) });
  const commercialAssetsQuery = trpc.naqla3.commercial.getMyAssets.useQuery(undefined, { enabled: Boolean(user) });
  const commercialTransactionsQuery = trpc.naqla3.commercial.getMyTransactions.useQuery(undefined, { enabled: Boolean(user) });
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
  const createNaqla1Record = trpc.naqla1Qualification.createRecord.useMutation({
    onSuccess: (result) => {
      setNaqla1RecordId(result.recordId);
      void naqla1RecordsQuery.refetch();
      setNotice(copy("أُنشئ سجل NAQLA1 اصطناعي خادمي مملوك؛ لا يحتوي دليلاً خاماً أو قراراً قانونياً.", "An owner-governed synthetic NAQLA1 record was created server-side; it contains no raw evidence or legal conclusion.", isArabic));
    },
    onError: () => setNotice(copy("تعذر إنشاء سجل NAQLA1؛ لم يُنشأ بديل محلي.", "The NAQLA1 record could not be created; no local substitute was created.", isArabic)),
  });
  const addNaqla1Evidence = trpc.naqla1Qualification.addEvidence.useMutation({
    onSuccess: () => {
      void naqla1PassportQuery.refetch();
      setNotice(copy("أُضيفت بيانات وصفية لدليل اصطناعي مفوض؛ لا تُخزن المنصة محتوى الدليل هنا.", "Authorized synthetic evidence metadata was added; no raw evidence content is stored here.", isArabic));
    },
    onError: () => setNotice(copy("تعذر إضافة الدليل؛ لم يُمنح تفويض بديل.", "Evidence could not be added; no substitute authorization was granted.", isArabic)),
  });
  const createNaqla1Version = trpc.naqla1Qualification.createImmutableVersion.useMutation({
    onSuccess: () => {
      void naqla1PassportQuery.refetch();
      setNotice(copy("حُفظت نسخة NAQLA1 ثابتة ببصمة خادمية.", "An immutable NAQLA1 version was saved with a server-side hash.", isArabic));
    },
    onError: () => setNotice(copy("تعذر حفظ النسخة؛ لم يُعدل سجل قائم.", "The immutable version could not be saved; no existing record was altered.", isArabic)),
  });
  const assessNaqla1 = trpc.naqla1Qualification.assess.useMutation({
    onSuccess: () => {
      void naqla1PassportQuery.refetch();
      setNotice(copy("اكتمل تقييم NAQLA1 الحتمي؛ راجع الجواز والفجوات وNext Best Action.", "Deterministic NAQLA1 assessment completed; review the passport, gaps, and Next Best Action.", isArabic));
    },
    onError: () => setNotice(copy("تعذر تشغيل التقييم الحتمي؛ بقي السجل دون قرار بديل.", "The deterministic assessment could not run; the record received no substitute decision.", isArabic)),
  });
  const submitTeaserInterest = trpc.naqla2.marketplace.requestPurchase.useMutation({
    onSuccess: () => {
      setInterestMessage("");
      setNotice(copy("سُجل الاهتمام خادمياً. لا ينشئ ذلك عقداً أو دفعة أو حق إفصاح.", "Interest was recorded server-side. It creates no contract, payment, or disclosure right.", isArabic));
    },
    onError: () => setNotice(copy("تعذر تسجيل الاهتمام؛ لم يُمنح أي حق وصول أو إفصاح.", "Interest could not be recorded; no access or disclosure right was granted.", isArabic)),
  });
  const createMatchRun = trpc.naqla2.deterministicMatching.createRun.useMutation({
    onSuccess: (result) => {
      void matchRunsQuery.refetch();
      setMatchQuery("");
      setNotice(copy(`اكتمل MatchRun حتمي بـ${result.candidateCount} مرشحاً من Teaser فقط.`, `A deterministic MatchRun completed with ${result.candidateCount} teaser-only candidates.`, isArabic));
    },
    onError: () => setNotice(copy("تعذر إنشاء MatchRun؛ لم يُنشأ أي مرشح أو حق إفصاح بديل.", "The MatchRun could not be created; no candidate or substitute disclosure right was created.", isArabic)),
  });
  const createMatchingRequest = trpc.naqla2.matching.request.useMutation({
    onSuccess: (result) => {
      void matchingRequestsQuery.refetch();
      createMatchRun.mutate({ requestId: result.requestId });
    },
    onError: () => setNotice(copy("تعذر حفظ طلب المطابقة؛ لم يُشغّل MatchRun من نص حر.", "The matching request could not be saved; no MatchRun was run from free text.", isArabic)),
  });
  const createApplication = trpc.naqla2.applications.create.useMutation({
    onSuccess: (result) => {
      setApplicationId(result.applicationId);
      void applicationsQuery.refetch();
      setNotice(copy("أُنشئ تقديم خادمي من مرشح Teaser مصرح به؛ لا يمنح ذلك دليلاً أو قبولاً.", "A server application was created from an authorized teaser candidate; it grants neither evidence nor acceptance.", isArabic));
    },
    onError: () => setNotice(copy("تعذر إنشاء التقديم؛ يلزم مرشح MatchRun مملوك ومصرح.", "The application could not be created; an owned, authorized MatchRun candidate is required.", isArabic)),
  });
  const createApplicationVersion = trpc.naqla2.applications.createImmutableVersion.useMutation({
    onSuccess: () => setNotice(copy("حُفظت نسخة تقديم ثابتة ببصمة خادمية.", "An immutable application version was saved with a server-side hash.", isArabic)),
    onError: () => setNotice(copy("تعذر حفظ نسخة التقديم؛ لا يُعدل أي إصدار قائم.", "The application version could not be saved; no existing version was changed.", isArabic)),
  });
  const submitApplication = trpc.naqla2.applications.submit.useMutation({
    onSuccess: () => {
      void applicationsQuery.refetch();
      setNotice(copy("أُرسل التقديم بعد وجود نسخة ثابتة؛ لا يمثل قبولاً أو حق إفصاح.", "The application was submitted after an immutable version existed; it is not acceptance or a disclosure right.", isArabic));
    },
    onError: () => setNotice(copy("تعذر إرسال التقديم؛ يلزم إصدار ثابت وتفويض المقدم.", "The application could not be submitted; an immutable version and applicant authorization are required.", isArabic)),
  });
  const setInterestStatus = trpc.naqla2.engagements.setInterestStatus.useMutation({
    onSuccess: () => {
      void interestRequestsQuery.refetch();
      setNotice(copy("سُجل قرار Interest خادمياً؛ لا ينشئ ذلك Engagement تلقائياً.", "The interest decision was recorded server-side; it does not create an engagement automatically.", isArabic));
    },
    onError: () => setNotice(copy("تعذر تسجيل قرار Interest؛ بقيت الأذونات كما هي.", "The interest decision could not be recorded; permissions remain unchanged.", isArabic)),
  });
  const establishEngagement = trpc.naqla2.engagements.establish.useMutation({
    onSuccess: () => {
      void engagementsQuery.refetch();
      setNotice(copy("أُنشئ Engagement خادمي من Interest مقبولة؛ لا يوجد عقد أو دفعة تلقائية.", "A server engagement was created from accepted interest; no contract or payment was created.", isArabic));
    },
    onError: () => setNotice(copy("تعذر إنشاء Engagement؛ يلزم Interest مقبولة وملكية صريحة.", "The engagement could not be created; accepted interest and explicit ownership are required.", isArabic)),
  });
  const createPilot = trpc.naqla2.engagements.createPilot.useMutation({
    onSuccess: () => setNotice(copy("سُجلت Pilot مخططة خادمياً دون عقد أو التزام قانوني.", "A planned pilot was recorded server-side without a contract or legal commitment.", isArabic)),
    onError: () => setNotice(copy("تعذر إنشاء Pilot؛ يلزم أن تكون طرفاً في Engagement منشأة.", "The pilot could not be created; you must be a participant in an established engagement.", isArabic)),
  });
  const createCommercialAsset = trpc.naqla3.commercial.createAsset.useMutation({
    onSuccess: () => {
      void commercialAssetsQuery.refetch();
      setNotice(copy("أُنشئ أصل تجاري خادمي للمراجعة البشرية؛ لا ينشئ ذلك عقداً أو حق ملكية أو معاملة.", "A server-side commercial asset was created for human review; it creates no contract, ownership right, or transaction.", isArabic));
    },
    onError: () => setNotice(copy("تعذر إنشاء الأصل التجاري؛ لم يُنشأ سجل محلي بديل.", "The commercial asset could not be created; no local substitute record was created.", isArabic)),
  });
  const updateCommercialAsset = trpc.naqla3.commercial.setAssetStatus.useMutation({
    onSuccess: () => {
      void commercialAssetsQuery.refetch();
      setNotice(copy("تغيرت حالة الأصل التجاري في السجل الخادمي للمراجعة البشرية فقط.", "The commercial asset status changed in the server record for human review only.", isArabic));
    },
    onError: () => setNotice(copy("تعذر تحديث الأصل؛ لم يُغيّر أي سجل لا تملكه.", "The asset could not be updated; no record you do not own was changed.", isArabic)),
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

      {user && <section className="mx-auto max-w-7xl px-4 pt-5 sm:px-8" aria-label={copy("التقديمات الخادمية", "Server applications", isArabic)}>
        <div className="rounded-2xl border border-violet-300/20 bg-violet-300/5 p-4">
          <h2 className="font-semibold text-violet-100">{copy("Application ثم نسخة ثابتة ثم إرسال", "Application, immutable version, then submit", isArabic)}</h2>
          {latestMatchRunQuery.isLoading || applicationsQuery.isLoading ? <p className="mt-2 text-xs text-slate-400">{copy("يجري تحميل مرشحي MatchRun والتقديمات…", "Loading MatchRun candidates and applications…", isArabic)}</p> : latestMatchRunQuery.isError || applicationsQuery.isError ? <p className="mt-2 text-xs text-rose-200">{copy("تعذر تحميل التقديمات؛ لم يُنشأ مسار بديل.", "Applications could not load; no fallback path was created.", isArabic)}</p> : <div className="mt-3 flex flex-wrap gap-2">{latestMatchRunQuery.data?.candidates.slice(0, 3).map((candidate) => <button key={candidate.id} type="button" disabled={createApplication.isPending} onClick={() => createApplication.mutate({ matchCandidateId: candidate.id })} className="rounded border border-violet-300/40 px-2 py-1 text-xs font-semibold text-violet-100 disabled:opacity-50">{copy(`إنشاء Application من مرشح #${candidate.id}`, `Create application from candidate #${candidate.id}`, isArabic)}</button>)}{applicationId && <><button type="button" disabled={createApplicationVersion.isPending} onClick={() => createApplicationVersion.mutate({ applicationId, summary: copy("نسخة تقديم اصطناعية للمراجعة البشرية ضمن تفويض المقدم فقط.", "Synthetic application version for human review within applicant authorization only.", isArabic) })} className="rounded border border-violet-300/40 px-2 py-1 text-xs font-semibold text-violet-100 disabled:opacity-50">{copy("حفظ نسخة تقديم", "Save application version", isArabic)}</button><button type="button" disabled={submitApplication.isPending} onClick={() => submitApplication.mutate({ applicationId })} className="rounded border border-violet-300/40 px-2 py-1 text-xs font-semibold text-violet-100 disabled:opacity-50">{copy("إرسال التقديم", "Submit application", isArabic)}</button></>}{!latestMatchRunQuery.data?.candidates.length && <p className="text-xs text-slate-400">{copy("لا يوجد مرشح MatchRun مصرح لإنشاء تقديم.", "No authorized MatchRun candidate is available for an application.", isArabic)}</p>}</div>}
        </div>
      </section>}

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
              <select id="persona" aria-label={copy("دور العرض الاصطناعي", "Synthetic demo role", isArabic)} value={persona} disabled={Boolean(activeServerContext)} onChange={(event) => setPersona(event.target.value as NaqlaPersona)} className="mt-2 w-full rounded-xl border border-white/15 bg-slate-950 px-3 py-2.5 text-sm text-white disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-cyan-300">
                {personas.map((item) => <option key={item.value} value={item.value}>{isArabic ? item.ar : item.en}</option>)}
              </select>
              <p className="mt-3 text-xs leading-5 text-slate-400">{activeServerContext ? copy(`الدور الفعّال مشتق من عضويتك الخادمية: ${activeServerContext.role}. لا يمكن للعرض المحلي تغييره.`, `The active role is derived from your server membership: ${activeServerContext.role}. Local demo selection cannot change it.`, isArabic) : personaCanReviewEvidence(effectivePersona) ? copy("دور العرض يمكنه مراجعة الدليل عند وجود تفويض مستقل.", "The demo role may review evidence only after independent authorization.", isArabic) : copy("هذا الدور لا يحصل على حق الدليل تلقائياً.", "This role receives no evidence right by implication.", isArabic)}</p>
              {user && !activeServerContext && <button type="button" disabled={createDemoContext.isPending || contextsQuery.isLoading} onClick={() => createDemoContext.mutate({ nameAr: "سياق عرض اصطناعي", nameEn: "Synthetic demo context", type: "supporting", scope: "local" })} className="mt-3 w-full rounded-lg border border-violet-300/40 px-3 py-2 text-xs font-semibold text-violet-100 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-violet-300">{copy("إنشاء سياق عرض خادمي", "Create server demo context", isArabic)}</button>}
              <div className="mt-4 rounded-xl border border-white/10 bg-slate-950/60 p-3"><p className="text-xs font-semibold text-slate-300">{copy("دعوة عضوية خادمية", "Server membership invitation", isArabic)}</p>{activeServerContext ? <>{serverInvitationManager ? <><label className="mt-3 block text-xs text-slate-400" htmlFor="invite-email">{copy("البريد الإلكتروني للحساب المدعو", "Invited account email", isArabic)}</label><input id="invite-email" type="email" value={invitedEmail} onChange={(event) => setInvitedEmail(event.target.value)} placeholder="name@example.com" className="mt-2 w-full rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-300" /><button type="button" disabled={!invitedEmail || inviteServerMember.isPending} onClick={() => inviteServerMember.mutate({ organizationId: activeServerContext.id, invitedEmail, role: 'member' })} className="mt-3 rounded-lg border border-cyan-300/40 px-3 py-2 text-xs font-semibold text-cyan-100 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-cyan-300">{copy("تسجيل دعوة معلقة", "Record pending invitation", isArabic)}</button></> : <p className="mt-1 text-xs leading-5 text-slate-400">{copy("دعوات الأعضاء مقصورة على المالك أو المدير في السياق الخادمي.", "Member invitations are limited to an owner or manager in the server context.", isArabic)}</p>}</> : <p className="mt-1 text-xs leading-5 text-slate-400">{copy("سجّل الدخول وأنشئ أو اختر سياقاً خادمياً قبل إرسال دعوة. لا توجد دعوة محلية بديلة.", "Sign in and create or select a server context before inviting a member. No local invitation fallback exists.", isArabic)}</p>}</div>
              {user && pendingInvitationsQuery.isLoading && <p className="mt-3 text-xs text-slate-400">{copy("يجري تحميل الدعوات المعلقة…", "Loading pending invitations…", isArabic)}</p>}
              {user && pendingInvitationsQuery.isError && <p className="mt-3 text-xs text-rose-200">{copy("تعذر تحميل الدعوات؛ لم يُمنح أي وصول بديل.", "Pending invitations could not load; no substitute access was granted.", isArabic)}</p>}
              {user && !pendingInvitationsQuery.isLoading && !pendingInvitationsQuery.isError && (pendingInvitationsQuery.data?.length ?? 0) === 0 && <p className="mt-3 text-xs text-slate-400">{copy("لا توجد دعوات معلقة لهذا الحساب.", "There are no pending invitations for this account.", isArabic)}</p>}
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

            <section className="mt-4 rounded-2xl border border-white/10 bg-slate-950/40 p-4"><div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-emerald-300" /><h3 className="font-semibold">{copy("جواز الابتكار ومستوى الجاهزية", "Innovation Passport and TRL", isArabic)}</h3></div><p className="mt-2 text-sm leading-6 text-slate-300">{copy("يعرض الجواز القرار الحتمي والنواقص وخطوة العمل التالية. عند انطباق TRL يبقى مستوى المُدّعي ودعم الدليل والمراجعة البشرية حقولاً منفصلة؛ لا يحولها النظام إلى قرار تلقائي.", "The passport presents the deterministic outcome, gaps, and next action. When TRL applies, claimed level, evidence support, and human review remain separate fields; the system does not turn them into an automatic decision.", isArabic)}</p></section>

            <section className="mt-4 grid gap-3 md:grid-cols-2" aria-label={copy("حالة التسويق", "Commercialization status", isArabic)}><article className="rounded-2xl border border-violet-300/25 bg-violet-300/5 p-4"><p className="text-xs font-semibold tracking-[0.14em] text-violet-200">{copy("الأصل التجاري", "COMMERCIAL ASSET", isArabic)}</p><h3 className="mt-2 font-semibold">{copy("الأصل التجاري", "Commercial asset", isArabic)}</h3><p className="mt-2 text-sm leading-6 text-slate-300">{state.commercialAssetPrepared ? copy("تم إعداد نطاق الأصل للمراجعة البشرية. لا توجد نتيجة ملكية فكرية تلقائية.", "The asset scope is prepared for human review. No automatic IP conclusion exists.", isArabic) : copy("لم يُعد نطاق الأصل بعد؛ يبقى مسار العناية الواجبة محجوباً.", "The asset scope is not yet prepared; due diligence remains blocked.", isArabic)}</p></article><article className="rounded-2xl border border-fuchsia-300/25 bg-fuchsia-300/5 p-4"><p className="text-xs font-semibold tracking-[0.14em] text-fuchsia-200">{copy("المعاملة التجارية", "COMMERCIAL TRANSACTION", isArabic)}</p><h3 className="mt-2 font-semibold">{copy("المعاملة التجارية", "Commercial transaction", isArabic)}</h3><p className="mt-2 text-sm leading-6 text-slate-300">{state.commercialTransactionStarted ? copy("بدأ التتبع فقط؛ لا ينشئ النظام عقداً أو دفعة أو التزاماً قانونياً تلقائياً.", "Tracking has started only; the system creates no automated contract, payment, or legal commitment.", isArabic) : copy("لم يبدأ تتبع المعاملة؛ يظل الأصل منفصلاً عنها.", "Transaction tracking has not started; the asset remains separate from it.", isArabic)}</p></article></section>

            {serverDemoId && <section className="mt-4 rounded-2xl border border-cyan-300/25 bg-cyan-300/5 p-4" aria-live="polite"><h3 className="font-semibold text-cyan-100">{copy("ملف العرض الخادمي", "Server demo record", isArabic)}</h3>{serverDemoBundleQuery.isLoading ? <p className="mt-2 text-sm text-slate-300">{copy("يجري تحميل سجل العرض وأدلته من الخادم…", "Loading the server demo record and its evidence…", isArabic)}</p> : serverDemoBundleQuery.isError ? <p className="mt-2 text-sm text-rose-200">{copy("تعذر تحميل ملف العرض؛ لم يُستبدل بسجل محلي.", "The server demo record could not load; it was not replaced with local data.", isArabic)}</p> : serverDemoBundleQuery.data ? <div className="mt-2 grid gap-2 text-sm text-slate-200 sm:grid-cols-3"><p>{copy("نوع المدخل: ", "Submission type: ", isArabic)}<span className="font-semibold">{serverDemoBundleQuery.data.submission?.submissionType ?? copy("غير متاح", "Unavailable", isArabic)}</span></p><p>{copy("عدد الأدلة: ", "Evidence count: ", isArabic)}<span className="font-semibold">{serverDemoBundleQuery.data.evidence.length}</span></p><p>{copy("TRL التقديري: ", "Estimated TRL: ", isArabic)}<span className="font-semibold">{serverDemoBundleQuery.data.assessment?.estimatedTrl ?? copy("غير منطبق", "Not applicable", isArabic)}</span></p></div> : <p className="mt-2 text-sm text-amber-100">{copy("لا يوجد ملف خادمي متاح ضمن تفويض الحساب الحالي.", "No server record is available within this account authorization.", isArabic)}</p>}</section>}

            <section className="mt-4 grid gap-3 lg:grid-cols-2" aria-label={copy("قراءات تشغيلية خادمية", "Server operating reads", isArabic)}><article className="rounded-2xl border border-amber-300/20 bg-amber-300/5 p-4"><h3 className="font-semibold text-amber-100">{copy("NAQLA2 — فرص Teaser مصرح بها", "NAQLA2 — authorized teaser opportunities", isArabic)}</h3>{publishedTeasersQuery.isLoading ? <p className="mt-2 text-sm text-slate-300">{copy("يجري تحميل فرص Teaser…", "Loading teaser opportunities…", isArabic)}</p> : publishedTeasersQuery.isError ? <p className="mt-2 text-sm text-rose-200">{copy("تعذر تحميل فرص Teaser؛ لم يُعرض أي دليل خاص.", "Teaser opportunities could not load; no private evidence was shown.", isArabic)}</p> : publishedTeasersQuery.data?.length ? <div className="mt-2 space-y-3">{publishedTeasersQuery.data.slice(0, 3).map((teaser) => <div key={teaser.id} className="rounded-xl border border-amber-200/15 bg-slate-950/35 p-3"><p className="text-sm font-semibold text-slate-100">{teaser.title}</p><p className="mt-1 text-xs leading-5 text-slate-300">{teaser.summary}</p>{user && <div className="mt-3 flex flex-col gap-2 sm:flex-row"><input aria-label={copy("رسالة اهتمام", "Interest message", isArabic)} value={interestMessage} onChange={(event) => setInterestMessage(event.target.value)} placeholder={copy("رسالة اهتمام من 10 أحرف على الأقل", "Interest message of at least 10 characters", isArabic)} className="min-w-0 flex-1 rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-300" /><button type="button" disabled={interestMessage.trim().length < 10 || submitTeaserInterest.isPending} onClick={() => submitTeaserInterest.mutate({ listingId: teaser.id, message: interestMessage.trim() })} className="rounded-lg border border-amber-300/40 px-3 py-2 text-xs font-semibold text-amber-100 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-amber-300">{copy("تسجيل اهتمام", "Record interest", isArabic)}</button></div>}</div>)}</div> : <p className="mt-2 text-sm text-slate-300">{copy("لا توجد فرص منشورة؛ لا تعرض المنصة مسودات أو أدلة غير مصرح بها.", "No published opportunities are available; drafts and unauthorized evidence are not shown.", isArabic)}</p>}</article><article className="rounded-2xl border border-fuchsia-300/20 bg-fuchsia-300/5 p-4"><h3 className="font-semibold text-fuchsia-100">{copy("NAQLA3 — سجلاتك التجارية", "NAQLA3 — your commercial records", isArabic)}</h3>{!user ? <p className="mt-2 text-sm text-slate-300">{copy("سجّل الدخول لقراءة أصولك ومعاملاتك المملوكة فقط.", "Sign in to read only the commercial assets and transactions you own.", isArabic)}</p> : commercialAssetsQuery.isLoading || commercialTransactionsQuery.isLoading ? <p className="mt-2 text-sm text-slate-300">{copy("يجري تحميل السجلات التجارية…", "Loading commercial records…", isArabic)}</p> : commercialAssetsQuery.isError || commercialTransactionsQuery.isError ? <p className="mt-2 text-sm text-rose-200">{copy("تعذر تحميل سجلاتك التجارية؛ لم يُعرض أي سجل لمالك آخر.", "Commercial records could not load; no other owner record was shown.", isArabic)}</p> : <><p className="mt-2 text-sm text-slate-200">{copy(`الأصول: ${commercialAssetsQuery.data?.length ?? 0} · المعاملات: ${commercialTransactionsQuery.data?.length ?? 0}.`, `Assets: ${commercialAssetsQuery.data?.length ?? 0} · Transactions: ${commercialTransactionsQuery.data?.length ?? 0}.`, isArabic)}</p>{(commercialAssetsQuery.data?.length ?? 0) === 0 && <button type="button" disabled={createCommercialAsset.isPending} onClick={() => createCommercialAsset.mutate({ title: copy("نطاق تجاري اصطناعي", "Synthetic commercial scope", isArabic), scope: copy("نطاق تجاري اصطناعي مخصص للمراجعة البشرية ولا يثبت أي حق قانوني أو ملكية.", "A synthetic commercial scope for human review that establishes no legal right or ownership.", isArabic) })} className="mt-3 rounded-lg border border-fuchsia-300/40 px-3 py-2 text-xs font-semibold text-fuchsia-100 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-fuchsia-300">{copy("إنشاء أصل تجاري خادمي", "Create server commercial asset", isArabic)}</button>}{commercialAssetsQuery.data?.slice(0, 3).map((asset) => <div key={asset.id} className="mt-3 rounded-xl border border-fuchsia-200/15 bg-slate-950/35 p-3"><p className="text-xs font-semibold text-slate-100">{asset.title}</p><p className="mt-1 text-xs text-slate-300">{copy("الحالة: ", "Status: ", isArabic)}{asset.status}</p>{asset.status === "prepared" && <button type="button" disabled={updateCommercialAsset.isPending} onClick={() => updateCommercialAsset.mutate({ assetId: asset.id, status: "due_diligence" })} className="mt-2 rounded-lg border border-fuchsia-300/40 px-2 py-1 text-xs font-semibold text-fuchsia-100 disabled:opacity-50">{copy("بدء العناية الواجبة", "Start due diligence", isArabic)}</button>}{asset.status === "due_diligence" && <button type="button" disabled={updateCommercialAsset.isPending} onClick={() => updateCommercialAsset.mutate({ assetId: asset.id, status: "contract_ready" })} className="mt-2 rounded-lg border border-fuchsia-300/40 px-2 py-1 text-xs font-semibold text-fuchsia-100 disabled:opacity-50">{copy("تسجيل جاهزية العقد للمراجعة", "Record contract-ready for review", isArabic)}</button>}</div>)}<p className="mt-3 text-xs leading-5 text-slate-400">{copy("إنشاء المعاملة يتطلب اختيار طرف مقابل من مسار جهات محكوم؛ لا يقبل هذا العرض رقماً أو عقداً أو دفعة تلقائية.", "Creating a transaction requires a governed counterparty selection path; this workspace accepts no raw identifier, contract, or payment automation.", isArabic)}</p></>}</article></section>

            {user && <section className="mt-4 rounded-2xl border border-cyan-300/20 bg-cyan-300/5 p-4" aria-label={copy("تأهيل NAQLA1", "NAQLA1 qualification", isArabic)}><div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center"><div><h3 className="font-semibold text-cyan-100">{copy("سجل · دليل · نسخة ثابتة · جواز", "Record · evidence · immutable version · passport", isArabic)}</h3><p className="mt-1 text-xs leading-5 text-slate-300">{copy("كل خطوة تكتب خادمياً تحت ملكية السجل. التقييم حتمي ولا يستدعي نموذجاً خارجياً.", "Each step writes server-side under record ownership. Assessment is deterministic and calls no external model.", isArabic)}</p></div><span className="text-xs text-cyan-200">{copy(`السجلات: ${naqla1RecordsQuery.data?.length ?? 0}`, `Records: ${naqla1RecordsQuery.data?.length ?? 0}`, isArabic)}</span></div><div className="mt-3 flex flex-wrap gap-2"><button type="button" disabled={createNaqla1Record.isPending} onClick={() => createNaqla1Record.mutate({ title: "Synthetic NAQLA1 qualification record", problemStatement: "A complete synthetic problem statement for deterministic NAQLA1 qualification.", desiredOutcome: "A complete synthetic desired outcome for deterministic NAQLA1 qualification." })} className="rounded border border-cyan-300/40 px-2 py-1 text-xs font-semibold text-cyan-100 disabled:opacity-50">{copy("إنشاء سجل", "Create record", isArabic)}</button>{naqla1RecordId && <><button type="button" disabled={addNaqla1Evidence.isPending} onClick={() => addNaqla1Evidence.mutate({ recordId: naqla1RecordId, label: "Synthetic authorized evidence metadata", evidenceType: "synthetic_note", contentSha256: "0".repeat(64) })} className="rounded border border-cyan-300/40 px-2 py-1 text-xs font-semibold text-cyan-100 disabled:opacity-50">{copy("تفويض دليل", "Authorize evidence", isArabic)}</button><button type="button" disabled={createNaqla1Version.isPending} onClick={() => createNaqla1Version.mutate({ recordId: naqla1RecordId })} className="rounded border border-cyan-300/40 px-2 py-1 text-xs font-semibold text-cyan-100 disabled:opacity-50">{copy("حفظ نسخة", "Save version", isArabic)}</button><button type="button" disabled={assessNaqla1.isPending} onClick={() => assessNaqla1.mutate({ recordId: naqla1RecordId })} className="rounded border border-cyan-300/40 px-2 py-1 text-xs font-semibold text-cyan-100 disabled:opacity-50">{copy("تقييم حتمي", "Assess deterministically", isArabic)}</button></>}</div>{naqla1RecordsQuery.isLoading || naqla1PassportQuery.isLoading ? <p className="mt-2 text-xs text-slate-400">{copy("يجري تحميل سجل NAQLA1…", "Loading the NAQLA1 record…", isArabic)}</p> : naqla1RecordsQuery.isError || naqla1PassportQuery.isError ? <p className="mt-2 text-xs text-rose-200">{copy("تعذر تحميل NAQLA1؛ لم تعرض المنصة جوازاً غير مصرح به.", "NAQLA1 could not load; no unauthorized passport was shown.", isArabic)}</p> : naqla1PassportQuery.data?.passport ? <p className="mt-2 text-xs text-cyan-100">{copy(`TRL ${naqla1PassportQuery.data.passport.currentTrl} · الإجراء التالي: ${naqla1PassportQuery.data.passport.nextBestAction} · فجوات مفتوحة: ${naqla1PassportQuery.data.gaps.length}`, `TRL ${naqla1PassportQuery.data.passport.currentTrl} · Next: ${naqla1PassportQuery.data.passport.nextBestAction} · Open gaps: ${naqla1PassportQuery.data.gaps.length}`, isArabic)}</p> : <p className="mt-2 text-xs text-slate-400">{copy("أنشئ السجل ثم أضف الدليل والنسخة وشغّل التقييم لإنتاج الجواز.", "Create the record, then add evidence and a version before assessing to produce a passport.", isArabic)}</p>}</section>}

            {user && <section className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-300/5 p-4" aria-label={copy("تشغيل المطابقة الحتمية", "Run deterministic matching", isArabic)}><div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center"><div><h3 className="font-semibold text-amber-100">{copy("MatchRun من Teaser فقط", "Teaser-only MatchRun", isArabic)}</h3><p className="mt-1 text-xs leading-5 text-slate-300">{copy("يحفظ النظام طلب المطابقة أولاً ثم يرتب Teaser المنشورة بتقاطع المصطلحات فقط؛ لا يقيّم الدليل ولا يمنح حق إفصاح.", "The platform saves a matching request first, then ranks published teasers by term overlap only; it does not evaluate evidence or grant disclosure.", isArabic)}</p></div><span className="text-xs text-amber-200">{copy(`الطلبات: ${matchingRequestsQuery.data?.length ?? 0} · Runs: ${matchRunsQuery.data?.length ?? 0}`, `Requests: ${matchingRequestsQuery.data?.length ?? 0} · Runs: ${matchRunsQuery.data?.length ?? 0}`, isArabic)}</span></div><div className="mt-3 flex flex-col gap-2 sm:flex-row"><input aria-label={copy("وصف احتياج المطابقة", "Match need description", isArabic)} value={matchQuery} onChange={(event) => setMatchQuery(event.target.value)} placeholder={copy("مثال: تحسين كفاءة الطاقة", "Example: energy efficiency", isArabic)} className="min-w-0 flex-1 rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-300" /><button type="button" disabled={matchQuery.trim().length < 3 || createMatchingRequest.isPending || createMatchRun.isPending} onClick={() => createMatchingRequest.mutate({ seekingType: "partner", requirements: matchQuery.trim() })} className="rounded-lg border border-amber-300/40 px-3 py-2 text-xs font-semibold text-amber-100 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-amber-300">{copy("حفظ الطلب وتشغيل MatchRun", "Save request and run MatchRun", isArabic)}</button></div>{matchRunsQuery.isLoading || matchingRequestsQuery.isLoading ? <p className="mt-2 text-xs text-slate-400">{copy("يجري تحميل طلبات وMatchRuns…", "Loading requests and MatchRuns…", isArabic)}</p> : matchRunsQuery.isError || matchingRequestsQuery.isError ? <p className="mt-2 text-xs text-rose-200">{copy("تعذر تحميل سجل المطابقة؛ لم تعرض المنصة أي مرشحات غير مصرح بها.", "The matching record could not load; no unauthorized candidates were shown.", isArabic)}</p> : null}</section>}

            {user && <section className="mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-300/5 p-4" aria-label={copy("Interest وEngagement وPilot", "Interest, engagement, and pilot", isArabic)}><h3 className="font-semibold text-emerald-100">{copy("Interest ثم Engagement ثم Pilot", "Interest, engagement, then pilot", isArabic)}</h3><p className="mt-1 text-xs leading-5 text-slate-300">{copy("لا ينتقل المسار إلا بقرار Interest من المالك ثم Engagement محكوم؛ Pilot تخطيط فقط.", "The flow advances only after an owner interest decision and governed engagement; pilot is planning only.", isArabic)}</p>{interestRequestsQuery.isLoading || engagementsQuery.isLoading ? <p className="mt-2 text-xs text-slate-400">{copy("يجري تحميل حالة الاتصال…", "Loading connection status…", isArabic)}</p> : interestRequestsQuery.isError || engagementsQuery.isError ? <p className="mt-2 text-xs text-rose-200">{copy("تعذر تحميل حالة الاتصال؛ لم ينشأ مسار بديل.", "Connection status could not load; no fallback path was created.", isArabic)}</p> : <div className="mt-3 space-y-2">{interestRequestsQuery.data?.filter((interest) => interest.ownerUserId === user.id && interest.status === "submitted").map((interest) => <div key={interest.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-emerald-200/15 bg-slate-950/35 p-2 text-xs"><span>{copy(`Interest #${interest.id} بانتظار قرارك`, `Interest #${interest.id} awaiting your decision`, isArabic)}</span><button type="button" disabled={setInterestStatus.isPending} onClick={() => setInterestStatus.mutate({ interestRequestId: interest.id, status: "accepted" })} className="rounded border border-emerald-300/40 px-2 py-1 font-semibold text-emerald-100 disabled:opacity-50">{copy("قبول", "Accept", isArabic)}</button></div>)}{interestRequestsQuery.data?.filter((interest) => interest.ownerUserId === user.id && interest.status === "accepted").map((interest) => <button key={`engagement-${interest.id}`} type="button" disabled={establishEngagement.isPending} onClick={() => establishEngagement.mutate({ interestRequestId: interest.id })} className="rounded border border-emerald-300/40 px-2 py-1 text-xs font-semibold text-emerald-100 disabled:opacity-50">{copy(`إنشاء Engagement لـInterest #${interest.id}`, `Establish engagement for interest #${interest.id}`, isArabic)}</button>)}{engagementsQuery.data?.filter((engagement) => engagement.status === "established").map((engagement) => <button key={`pilot-${engagement.id}`} type="button" disabled={createPilot.isPending} onClick={() => createPilot.mutate({ engagementId: engagement.id, scope: copy("نطاق Pilot اصطناعي للمراجعة البشرية دون عقد أو دفعة.", "Synthetic pilot scope for human review without a contract or payment.", isArabic) })} className="block rounded border border-emerald-300/40 px-2 py-1 text-xs font-semibold text-emerald-100 disabled:opacity-50">{copy(`تهيئة Pilot لـEngagement #${engagement.id}`, `Plan pilot for engagement #${engagement.id}`, isArabic)}</button>)}{!interestRequestsQuery.data?.length && !engagementsQuery.data?.length && <p className="text-xs text-slate-400">{copy("لا توجد Interests أو Engagements ضمن تفويض حسابك.", "No interests or engagements exist within your account authorization.", isArabic)}</p>}</div>}</section>}

            <div className="mt-8 rounded-2xl border border-white/10 bg-slate-950/70 p-4" aria-live="polite"><div className="flex gap-3"><CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" /><p className="text-sm leading-6 text-slate-200">{notice}</p></div></div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              {control && <button type="button" onClick={act} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-cyan-300/40 bg-cyan-300/10 px-5 py-3 font-semibold text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-300"><control.icon className="h-4 w-4" />{control.label}</button>}
              <button type="button" onClick={advance} disabled={state.stage === "scale"} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-cyan-100">{copy("متابعة الخطوة الحتمية", "Continue deterministic step", isArabic)} {isRTL ? <ArrowRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}</button>
              {user && !serverDemoId && <button type="button" disabled={createServerDemo.isPending} onClick={() => createServerDemo.mutate()} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-violet-300/40 px-5 py-3 font-semibold text-violet-100 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-violet-300"><FileCheck2 className="h-4 w-4" />{copy("إنشاء ملف عرض اصطناعي خادمي", "Create server synthetic demo record", isArabic)}</button>}
              {serverDemoId && <span className="inline-flex min-h-11 items-center rounded-xl border border-emerald-300/30 px-4 py-3 text-sm text-emerald-100">{copy("تم إنشاء ملف العرض الخادمي.", "Server demo record created.", isArabic)}</span>}
              {state.evidenceAuthorized && <button type="button" onClick={() => { setState((previous) => applyJourneyControl(previous, "revoke_evidence")); setNotice(copy("أُلغي تفويض الدليل؛ يلزم تفويض جديد قبل استمرار المرحلة التابعة.", "Evidence authorization was revoked; a new authorization is required before the dependent stage can continue.", isArabic)); }} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-rose-300/40 px-5 py-3 font-semibold text-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-300"><LockKeyhole className="h-4 w-4" />{copy("إلغاء تفويض الدليل", "Revoke evidence authorization", isArabic)}</button>}
            </div>

            <div className="mt-10 border-t border-white/10 pt-6"><h3 className="font-semibold">{copy("خريطة journey", "Journey map", isArabic)}</h3><ol className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">{JOURNEY_STAGES.map((stage) => <li key={stage} className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${stage === state.stage ? "border-cyan-300/50 bg-cyan-300/10 text-white" : state.completed.includes(stage) ? "border-emerald-400/25 bg-emerald-400/5 text-emerald-100" : "border-white/10 text-slate-400"}`}>{state.completed.includes(stage) ? <CheckCircle2 className="h-4 w-4" /> : <span className="h-4 w-4 rounded-full border border-current" />}{isArabic ? labels[stage].ar : labels[stage].en}</li>)}</ol></div>
          </section>
        </div>
      </section>
    </main>
  );
}
