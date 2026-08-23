import * as React from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, CheckCircle2, CircleHelp, Filter, Loader2, Search, ShieldCheck, Sparkles, UsersRound } from "lucide-react";

const text = (ar: string, en: string, isAr: boolean) => isAr ? ar : en;

export default function MatchingIntelligenceHub() {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const { user, loading: authLoading } = useAuth();
  const [requirements, setRequirements] = React.useState("");
  const [industry, setIndustry] = React.useState("");
  const [seekingType, setSeekingType] = React.useState<"partner" | "investor" | "innovator" | "mentor">("partner");
  const [selectedRequestId, setSelectedRequestId] = React.useState<number | null>(null);
  const [selectedRunId, setSelectedRunId] = React.useState<number | null>(() => {
    const value = new URLSearchParams(window.location.search).get("run");
    return value && Number.isInteger(Number(value)) ? Number(value) : null;
  });
  const [rankFilter, setRankFilter] = React.useState("all");
  const [confidenceFilter, setConfidenceFilter] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [interestMessage, setInterestMessage] = React.useState("");
  const [notice, setNotice] = React.useState<string | null>(null);

  const requests = trpc.naqla2.matching.getMyMatches.useQuery(undefined, { enabled: Boolean(user) });
  const runs = trpc.naqla2.deterministicMatching.listRuns.useQuery({ page: 1, limit: 20, sort: "newest" }, { enabled: Boolean(user) });
  const selectedRun = trpc.naqla2.deterministicMatching.getRun.useQuery({ runId: selectedRunId ?? 1 }, { enabled: Boolean(user && selectedRunId) });

  React.useEffect(() => {
    if (!selectedRequestId && requests.data?.[0]?.id) setSelectedRequestId(requests.data[0].id);
  }, [requests.data, selectedRequestId]);
  React.useEffect(() => {
    if (!selectedRunId && runs.data?.items[0]?.id) setSelectedRunId(runs.data.items[0].id);
  }, [runs.data, selectedRunId]);

  const requestMatch = trpc.naqla2.matching.request.useMutation({
    onSuccess: async (result) => {
      setSelectedRequestId(result.requestId);
      setNotice(text("تم حفظ الطلب. يمكنك الآن إنشاء توصية حتمية قابلة للتفسير.", "Request saved. You can now generate a deterministic, explainable recommendation.", isAr));
      await requests.refetch();
    },
    onError: () => setNotice(text("تعذر حفظ طلب المطابقة. لم تُنشأ توصية بديلة.", "The matching request could not be saved. No substitute recommendation was created.", isAr)),
  });
  const createRun = trpc.naqla2.deterministicMatching.createRun.useMutation({
    onSuccess: async (result) => {
      setSelectedRunId(result.runId);
      window.history.replaceState({}, "", `/naqla2/matching-hub?run=${result.runId}`);
      setNotice(result.reused
        ? text("استُخدمت نتيجة محفوظة لنفس المدخلات والإصدار؛ لم يُنشأ run مكرر.", "A saved result for the same input and version was reused; no duplicate run was created.", isAr)
        : text("اكتمل MatchRun حتمي. النتائج توصيات قابلة للتفسير ولا تمنح حق إفصاح أو قبولاً أو عقداً.", "The deterministic MatchRun completed. Results are explainable recommendations and grant no disclosure right, acceptance, or deal.", isAr));
      await Promise.all([runs.refetch(), selectedRun.refetch()]);
    },
    onError: (error) => setNotice(error.message.includes("ActiveContext")
      ? text("اختر سياق مؤسسة نشطاً قبل إنشاء MatchRun.", "Select an active organization context before creating a MatchRun.", isAr)
      : text("تعذر إنشاء MatchRun؛ لم تُنشأ توصية أو صلاحية إفصاح بديلة.", "The MatchRun could not be created; no recommendation or substitute disclosure right was created.", isAr)),
  });
  const recordInterest = trpc.naqla2.marketplace.requestPurchase.useMutation({
    onSuccess: () => {
      setInterestMessage("");
      setNotice(text("سُجل الاهتمام للمراجعة من المالك. لا ينشئ ذلك Engagement أو Pilot تلقائياً.", "Interest was recorded for owner review. It does not create an engagement or pilot automatically.", isAr));
    },
    onError: () => setNotice(text("تعذر تسجيل الاهتمام؛ بقيت حدود الإفصاح والصلاحيات كما هي.", "Interest could not be recorded; disclosure and authorization boundaries remain unchanged.", isAr)),
  });

  const candidates = (selectedRun.data?.candidates ?? []).filter((candidate) => {
    const rankMatches = rankFilter === "all" || candidate.rankBand === rankFilter;
    const confidenceMatches = confidenceFilter === "all" || candidate.evidenceConfidence === confidenceFilter;
    const searchMatches = !search.trim() || `${candidate.title ?? ""} ${candidate.summary ?? ""}`.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase());
    return rankMatches && confidenceMatches && searchMatches;
  });

  if (authLoading) return <div className="flex min-h-[420px] items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-cyan-400" /></div>;
  if (!user) return <Card className="mx-auto my-12 max-w-2xl border-cyan-300/20 bg-slate-950/60"><CardContent className="p-8 text-center text-slate-200"><ShieldCheck className="mx-auto mb-4 h-10 w-10 text-cyan-300" /><p>{text("سجّل الدخول للوصول إلى طلباتك ونتائج مطابقتك المملوكة فقط.", "Sign in to access only your owned matching requests and results.", isAr)}</p></CardContent></Card>;

  return <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6" dir={isAr ? "rtl" : "ltr"}>
    <section className="rounded-3xl border border-cyan-300/20 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/40 p-6 sm:p-8">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start"><div><div className="mb-3 flex flex-wrap gap-2"><Badge className="bg-cyan-400/10 text-cyan-200"><Sparkles className="me-1 h-3.5 w-3.5" />NAQLA 2.2C</Badge><Badge variant="outline">{text("مطابقة حتمية قابلة للتفسير", "Deterministic, explainable matching", isAr)}</Badge></div><h1 className="text-3xl font-bold text-white sm:text-4xl">{text("مركز ذكاء المطابقة", "Matching Intelligence Hub", isAr)}</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">{text("توصيات من نصوص Teaser المنشورة فقط وفق إصدار قواعد محفوظ. لا قبول أو رفض أو عقد أو إفصاح خاص تلقائي.", "Recommendations use published teaser text only under a saved rule version. No automatic acceptance, rejection, contract, or private disclosure.", isAr)}</p></div><div className="flex items-center gap-2 text-xs text-cyan-100"><ShieldCheck className="h-4 w-4" />{text("ActiveContext وصلاحيات المالك مطلوبة", "ActiveContext and owner authorization required", isAr)}</div></div>
      {notice && <div role="status" className="mt-5 rounded-xl border border-cyan-300/20 bg-cyan-300/5 p-3 text-sm text-cyan-50">{notice}</div>}
    </section>

    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.4fr]">
      <Card className="border-slate-700 bg-slate-950/70"><CardHeader><CardTitle>{text("طلب مطابقة", "Matching request", isAr)}</CardTitle><CardDescription>{text("وصف الحاجة أولاً؛ ثم يتم تشغيل MatchRun مع نفس القواعد الحتمية.", "Describe the need first, then run matching under the same deterministic rules.", isAr)}</CardDescription></CardHeader><CardContent className="space-y-3"><Select value={seekingType} onValueChange={(value) => setSeekingType(value as typeof seekingType)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="partner">{text("شريك", "Partner", isAr)}</SelectItem><SelectItem value="investor">{text("مستثمر", "Investor", isAr)}</SelectItem><SelectItem value="innovator">{text("ابتكار", "Innovation", isAr)}</SelectItem><SelectItem value="mentor">{text("مرشد", "Mentor", isAr)}</SelectItem></SelectContent></Select><Input value={industry} onChange={(event) => setIndustry(event.target.value)} placeholder={text("القطاع أو التقنية (اختياري)", "Sector or technology (optional)", isAr)} /><textarea value={requirements} onChange={(event) => setRequirements(event.target.value)} className="min-h-28 w-full rounded-md border border-input bg-background p-3 text-sm" placeholder={text("صف الحاجة التشغيلية أو التحدي دون معلومات حساسة…", "Describe the operating need or challenge without sensitive information…", isAr)} /><Button className="w-full" disabled={requirements.trim().length < 12 || requestMatch.isPending} onClick={() => requestMatch.mutate({ seekingType, industry: industry.trim() || undefined, requirements: requirements.trim() })}>{requestMatch.isPending && <Loader2 className="me-2 h-4 w-4 animate-spin" />}{text("حفظ طلب المطابقة", "Save matching request", isAr)}</Button><div className="border-t border-slate-800 pt-4"><p className="mb-2 text-xs font-semibold text-slate-300">{text("طلباتك المحفوظة", "Your saved requests", isAr)}</p>{requests.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : requests.isError ? <p className="text-xs text-rose-300">{text("تعذر تحميل الطلبات.", "Requests could not load.", isAr)}</p> : <Select value={selectedRequestId ? String(selectedRequestId) : "none"} onValueChange={(value) => setSelectedRequestId(value === "none" ? null : Number(value))}><SelectTrigger><SelectValue placeholder={text("اختر طلباً", "Select a request", isAr)} /></SelectTrigger><SelectContent><SelectItem value="none">{text("لا يوجد اختيار", "No selection", isAr)}</SelectItem>{requests.data?.map((request) => <SelectItem key={request.id} value={String(request.id)}>{request.title}</SelectItem>)}</SelectContent></Select>}</div><Button variant="outline" className="w-full" disabled={!selectedRequestId || createRun.isPending} onClick={() => selectedRequestId && createRun.mutate({ requestId: selectedRequestId })}>{createRun.isPending && <Loader2 className="me-2 h-4 w-4 animate-spin" />}{text("إنشاء MatchRun حتمي", "Create deterministic MatchRun", isAr)}</Button></CardContent></Card>

      <Card className="border-slate-700 bg-slate-950/70"><CardHeader><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><CardTitle>{text("نتائج قابلة للتفسير", "Explainable results", isAr)}</CardTitle><CardDescription>{text("تتغير القواعد بإصدار جديد فقط؛ النتائج المكتملة محفوظة للقراءة.", "Rules change only through a new version; completed results remain read-only.", isAr)}</CardDescription></div><Select value={selectedRunId ? String(selectedRunId) : "none"} onValueChange={(value) => { const next = value === "none" ? null : Number(value); setSelectedRunId(next); if (next) window.history.replaceState({}, "", `/naqla2/matching-hub?run=${next}`); }}><SelectTrigger className="w-full sm:w-52"><SelectValue placeholder={text("اختر نتيجة", "Select a result", isAr)} /></SelectTrigger><SelectContent><SelectItem value="none">{text("لا توجد نتيجة", "No result", isAr)}</SelectItem>{runs.data?.items.map((run) => <SelectItem key={run.id} value={String(run.id)}>{text("MatchRun", "MatchRun", isAr)} · {run.ruleVersion}</SelectItem>)}</SelectContent></Select></div></CardHeader><CardContent>{selectedRun.isLoading ? <div className="flex min-h-52 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-cyan-300" /></div> : selectedRun.isError ? <div className="rounded-xl border border-rose-400/20 bg-rose-400/5 p-5 text-sm text-rose-100">{text("تعذر تحميل النتيجة أو لا تملك حق قراءتها.", "The result could not load or you do not own access to it.", isAr)}</div> : !selectedRun.data ? <div className="rounded-xl border border-dashed border-slate-700 p-8 text-center text-sm text-slate-400">{text("أنشئ أو اختر MatchRun لرؤية توصيات محكومة.", "Create or select a MatchRun to view governed recommendations.", isAr)}</div> : <><div className="mb-4 grid gap-3 sm:grid-cols-3"><div className="rounded-xl bg-slate-900 p-3"><p className="text-xs text-slate-400">{text("إصدار القواعد", "Rule version", isAr)}</p><p className="mt-1 text-sm font-semibold text-white">{selectedRun.data.run.ruleVersion}</p></div><div className="rounded-xl bg-slate-900 p-3"><p className="text-xs text-slate-400">{text("مرشحون مؤهلون", "Eligible candidates", isAr)}</p><p className="mt-1 text-lg font-semibold text-cyan-200">{selectedRun.data.run.candidateCount}</p></div><div className="rounded-xl bg-slate-900 p-3"><p className="text-xs text-slate-400">{text("استبعادات محفوظة", "Recorded exclusions", isAr)}</p><p className="mt-1 text-lg font-semibold text-amber-200">{selectedRun.data.exclusions.length}</p></div></div><div className="mb-4 grid gap-3 md:grid-cols-3"><div className="relative"><Search className="absolute start-3 top-3 h-4 w-4 text-slate-500" /><Input className="ps-9" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={text("ابحث في Teaser", "Search teaser", isAr)} /></div><Select value={rankFilter} onValueChange={setRankFilter}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">{text("كل الرتب", "All rank bands", isAr)}</SelectItem><SelectItem value="high">{text("عالية", "High", isAr)}</SelectItem><SelectItem value="medium">{text("متوسطة", "Medium", isAr)}</SelectItem><SelectItem value="low">{text("منخفضة", "Low", isAr)}</SelectItem></SelectContent></Select><Select value={confidenceFilter} onValueChange={setConfidenceFilter}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">{text("كل حالات الدليل", "All evidence states", isAr)}</SelectItem><SelectItem value="teaser_only">Teaser only</SelectItem><SelectItem value="not_evaluated">{text("غير مقيم", "Not evaluated", isAr)}</SelectItem></SelectContent></Select></div><div className="space-y-3">{candidates.length === 0 ? <div className="rounded-xl border border-dashed border-slate-700 p-7 text-center text-sm text-slate-400">{text("لا توجد نتيجة تلائم عوامل التصفية أو لا توجد Teaser مؤهلة.", "No result matches these filters, or no eligible teaser is available.", isAr)}</div> : candidates.map((candidate) => <article key={candidate.id} className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4"><div className="flex flex-col justify-between gap-3 sm:flex-row"><div className="min-w-0"><div className="mb-2 flex flex-wrap gap-2"><Badge className={candidate.rankBand === "high" ? "bg-emerald-400/15 text-emerald-100" : candidate.rankBand === "medium" ? "bg-amber-400/15 text-amber-100" : "bg-slate-400/15 text-slate-100"}>{text("رتبة", "Rank", isAr)}: {candidate.rankBand}</Badge><Badge variant="outline">{candidate.evidenceConfidence === "teaser_only" ? "Teaser only" : text("غير مقيم", "Not evaluated", isAr)}</Badge>{(candidate.status !== "published" || candidate.disclosureScope !== "teaser_only") && <Badge variant="destructive">{text("معلق/مسحوب", "Stale/revoked", isAr)}</Badge>}</div><h3 className="text-base font-semibold text-white">{candidate.title ?? text("لم تعد Teaser متاحة للعرض", "Teaser is no longer available", isAr)}</h3>{candidate.summary && <p className="mt-1 text-sm leading-6 text-slate-300">{candidate.summary}</p>}<details className="mt-3 rounded-lg bg-slate-950/70 p-3 text-xs text-slate-300"><summary className="cursor-pointer font-semibold text-cyan-200">{text("العوامل والحدود", "Factors and boundaries", isAr)}</summary><pre className="mt-2 overflow-x-auto whitespace-pre-wrap font-sans">{JSON.stringify(candidate.factors, null, 2)}</pre></details></div><div className="min-w-28 text-start sm:text-end"><p className="text-3xl font-bold text-cyan-200">{candidate.score}</p><p className="text-xs text-slate-400">{text("درجة حتمية", "Deterministic score", isAr)}</p>{candidate.status === "published" && candidate.disclosureScope === "teaser_only" && <Button size="sm" className="mt-3" disabled={interestMessage.trim().length < 10 || recordInterest.isPending} onClick={() => recordInterest.mutate({ listingId: candidate.listingId, message: interestMessage.trim() })}><UsersRound className="me-1 h-3.5 w-3.5" />{text("تسجيل اهتمام", "Record interest", isAr)}</Button>}</div></div></article>)}</div><div className="mt-4"><Input value={interestMessage} onChange={(event) => setInterestMessage(event.target.value)} placeholder={text("رسالة اهتمام من 10 أحرف على الأقل؛ يراجعها المالك قبل أي Engagement أو Pilot.", "Interest message of at least 10 characters; the owner reviews it before any engagement or pilot.", isAr)} /></div>{selectedRun.data.exclusions.length > 0 && <details className="mt-4 rounded-xl border border-amber-300/20 bg-amber-300/5 p-3 text-xs text-amber-50"><summary className="cursor-pointer font-semibold">{text("أسباب الاستبعاد المحفوظة", "Recorded exclusion reasons", isAr)}</summary><ul className="mt-2 space-y-1">{selectedRun.data.exclusions.map((exclusion, index) => <li key={`${exclusion.listingId}-${index}`}>{exclusion.reasonCode}</li>)}</ul></details>}</>}</CardContent></Card>
    </div>
    <p className="flex items-start gap-2 text-xs leading-5 text-slate-400"><CircleHelp className="mt-0.5 h-4 w-4 flex-none" />{text("هذه الواجهة توصي وتشرح فقط. shortlist أو interest لا تنشئ قبولاً أو Engagement أو Pilot تلقائياً؛ يلزم قرار مالك وصلاحيات سياق نشط.", "This interface recommends and explains only. Shortlisting or interest never creates acceptance, engagement, or pilot automatically; an owner decision and active-context authorization are required.", isAr)}</p>
  </div>;
}
