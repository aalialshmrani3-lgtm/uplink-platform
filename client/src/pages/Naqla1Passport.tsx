import { useMemo, useState } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { toast } from "sonner";
import { BrainCircuit, FileCheck2, FlaskConical, Gauge, Loader2, ShieldCheck, Upload, Zap } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const submissionTypes = [
  { value: "early_idea", label: "فكرة أولية" },
  { value: "technical_innovation", label: "ابتكار أو تقنية" },
  { value: "research_output", label: "ناتج بحثي" },
  { value: "commercial_solution", label: "حل تجاري" },
  { value: "digital_ai_product", label: "منتج رقمي أو ذكاء اصطناعي" },
  { value: "startup", label: "شركة ناشئة" },
  { value: "ip_asset", label: "أصل ملكية فكرية" },
  { value: "challenge", label: "تحدٍ" },
  { value: "organization", label: "جهة" },
  { value: "event", label: "فعالية" },
  { value: "ready_asset", label: "أصل جاهز" },
] as const;

const evidenceTypes = [
  ["research_reference", "مرجع علمي أو نتائج أولية"], ["technical_description", "وصف تقني"], ["architecture", "معمارية أو تصميم"],
  ["proof_of_concept", "إثبات مفهوم"], ["prototype", "نموذج أولي"], ["lab_test_report", "تقرير اختبار مختبري"],
  ["relevant_environment_test", "اختبار في بيئة ذات صلة"], ["pilot_data", "بيانات Pilot"], ["operational_deployment", "تشغيل فعلي"],
  ["performance_data", "بيانات أداء"], ["patent_document", "وثيقة ملكية فكرية"], ["pitch_deck", "عرض أو وثيقة فريق"],
  ["customer_interview", "مقابلات عملاء"], ["commercial_document", "وثيقة تجارية"], ["other", "دليل آخر"],
] as const;

const scoreLabel: Record<string, string> = {
  innovationIndex: "مؤشر الابتكار", commercialReadiness: "الجاهزية التجارية", marketValidation: "تحقق السوق",
  ipReadiness: "جاهزية الملكية الفكرية", regulatoryReadiness: "الجاهزية التنظيمية", teamReadiness: "جاهزية الفريق", saudiStrategicFit: "الملاءمة الاستراتيجية السعودية",
};

export default function Naqla1Passport() {
  const [, params] = useRoute("/naqla1/passport/:id");
  const [, setLocation] = useLocation();
  const ideaId = Number(params?.id || 0);
  const [submissionType, setSubmissionType] = useState<(typeof submissionTypes)[number]["value"]>("technical_innovation");
  const [technicalPrinciple, setTechnicalPrinciple] = useState("");
  const [prototypeStatus, setPrototypeStatus] = useState("");
  const [testEnvironment, setTestEnvironment] = useState("");
  const [performanceSummary, setPerformanceSummary] = useState("");
  const [customerEvidence, setCustomerEvidence] = useState("");
  const [revenueModel, setRevenueModel] = useState("");
  const [tractionSummary, setTractionSummary] = useState("");
  const [saipNumber, setSaipNumber] = useState("");
  const [claimedTrl, setClaimedTrl] = useState("5");
  const [evidence, setEvidence] = useState({ evidenceType: "lab_test_report" as (typeof evidenceTypes)[number][0], title: "", summary: "", sourceUrl: "", supportedTrl: "4", evidenceStrength: "high" as "low" | "medium" | "high" });
  const [upload, setUpload] = useState<{ name: string; mimeType: string; base64: string } | null>(null);

  const bundleQuery = trpc.cr01.getBundle.useQuery({ ideaId }, { enabled: ideaId > 0 });
  const utils = trpc.useUtils();
  const createDemo = trpc.cr01.createEnergyDemo.useMutation({
    onSuccess: ({ ideaId: newIdeaId }) => { toast.success("تم إنشاء ملف AI Energy Optimizer التجريبي"); setLocation(`/naqla1/passport/${newIdeaId}`); },
    onError: (error) => toast.error(error.message),
  });
  const saveSubmission = trpc.cr01.upsertSubmission.useMutation({
    onSuccess: () => { toast.success("تم حفظ نوع المدخل وملف الحقائق"); utils.cr01.getBundle.invalidate({ ideaId }); },
    onError: (error) => toast.error(error.message),
  });
  const uploadFile = trpc.cr01.uploadEvidenceFile.useMutation();
  const addEvidence = trpc.cr01.addEvidence.useMutation({
    onSuccess: () => { toast.success("تم حفظ الدليل كتصريح من صاحب المشروع"); setEvidence({ evidenceType: "lab_test_report", title: "", summary: "", sourceUrl: "", supportedTrl: "4", evidenceStrength: "high" }); setUpload(null); utils.cr01.getBundle.invalidate({ ideaId }); },
    onError: (error) => toast.error(error.message),
  });
  const refreshPassport = trpc.cr01.refreshPassport.useMutation({
    onSuccess: () => { toast.success("تم تحديث NAQLA Innovation Passport"); utils.cr01.getBundle.invalidate({ ideaId }); },
    onError: (error) => toast.error(error.message),
  });

  const bundle = bundleQuery.data;
  const trlApplicable = ["technical_innovation", "research_output", "digital_ai_product", "ip_asset", "ready_asset"].includes(submissionType);
  const scoreCards = useMemo(() => bundle?.passport ? Object.entries(scoreLabel).map(([key, label]) => ({ label, value: Number((bundle.passport as any)[key] ?? 0) })) : [], [bundle]);

  const handleEvidenceSubmit = async () => {
    if (!evidence.title || !evidence.summary) return toast.error("أدخل عنوان الدليل وملخصه أولاً");
    let fileKey: string | undefined;
    let sourceUrl = evidence.sourceUrl || undefined;
    if (upload) {
      const uploaded = await uploadFile.mutateAsync({ ideaId, fileName: upload.name, mimeType: upload.mimeType, dataBase64: upload.base64 });
      fileKey = uploaded.fileKey;
      sourceUrl = uploaded.url;
    }
    addEvidence.mutate({ ideaId, evidenceType: evidence.evidenceType, title: evidence.title, summary: evidence.summary, sourceUrl, fileKey, supportedTrl: evidence.supportedTrl ? Number(evidence.supportedTrl) : undefined, evidenceStrength: evidence.evidenceStrength });
  };

  if (!ideaId) {
    return <div className="min-h-screen bg-slate-950 text-white p-6" dir="rtl"><div className="max-w-3xl mx-auto py-20 text-center"><BrainCircuit className="w-14 h-14 text-violet-400 mx-auto mb-5" /><h1 className="text-3xl font-bold mb-3">NAQLA Innovation Passport</h1><p className="text-slate-300 mb-7">افتح ملف جاهزية لفكرة محللة، أو أنشئ نموذج AI Energy Optimizer التجريبي لعرض رحلة CR-01.</p><div className="flex gap-3 justify-center"><Button onClick={() => createDemo.mutate()} disabled={createDemo.isPending} className="bg-violet-600 hover:bg-violet-500">{createDemo.isPending ? <Loader2 className="animate-spin" /> : <Zap className="ml-2 w-4 h-4" />} إنشاء Demo Data</Button><Link href="/naqla1/dashboard"><Button variant="outline">العودة إلى لوحة نقلة 1</Button></Link></div></div></div>;
  }

  return <div className="min-h-screen bg-slate-950 text-white py-10 px-4" dir="rtl">
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"><div><Badge className="bg-violet-500/15 text-violet-200 border-violet-400/30 mb-3">CR-01 — ملف الجاهزية</Badge><h1 className="text-3xl font-bold">NAQLA Innovation Passport</h1><p className="text-slate-400 mt-2">الأدلة المضافة هي تصريحات من صاحب المشروع، ولا تمثل توثيقاً خارجياً أو قبولاً من أي جهة.</p></div><Link href={`/naqla1/ideas/${ideaId}`}><Button variant="outline">عودة إلى الفكرة</Button></Link></div>

      {bundleQuery.isLoading ? <Card className="bg-slate-900 border-slate-700"><CardContent className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-violet-400" /></CardContent></Card> : !bundle ? <Card className="bg-amber-950/30 border-amber-600/30"><CardContent className="p-6">ابدأ بحفظ نوع المدخل للفكرة رقم {ideaId}. يلزم أن تكون مالك الفكرة.</CardContent></Card> : <>
        <Card className="bg-slate-900/80 border-slate-700"><CardHeader><CardTitle className="flex items-center gap-2"><FileCheck2 className="text-violet-400" /> نوع المدخل وملف الحقائق</CardTitle></CardHeader><CardContent className="grid md:grid-cols-2 gap-4">
          <div><Label>نوع المدخل</Label><Select value={submissionType} onValueChange={(value) => setSubmissionType(value as any)}><SelectTrigger className="mt-2 bg-slate-950 border-slate-700"><SelectValue /></SelectTrigger><SelectContent>{submissionTypes.map((type) => <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>)}</SelectContent></Select></div>
          <div><Label>رقم طلب الملكية الفكرية — تصريح المستخدم فقط</Label><Input value={saipNumber} onChange={(e) => setSaipNumber(e.target.value)} className="mt-2 bg-slate-950 border-slate-700" placeholder="لا يعني تحققاً أو تقديماً رسمياً" /></div>
          {trlApplicable && <><div><Label>المبدأ التقني</Label><Textarea value={technicalPrinciple} onChange={(e) => setTechnicalPrinciple(e.target.value)} className="mt-2 bg-slate-950 border-slate-700" /></div><div><Label>حالة النموذج الأولي</Label><Input value={prototypeStatus} onChange={(e) => setPrototypeStatus(e.target.value)} className="mt-2 bg-slate-950 border-slate-700" /></div><div><Label>بيئة الاختبار</Label><Textarea value={testEnvironment} onChange={(e) => setTestEnvironment(e.target.value)} className="mt-2 bg-slate-950 border-slate-700" /></div><div><Label>ملخص الأداء</Label><Textarea value={performanceSummary} onChange={(e) => setPerformanceSummary(e.target.value)} className="mt-2 bg-slate-950 border-slate-700" /></div></>}
          {!trlApplicable && <><div><Label>دليل العميل أو السوق</Label><Textarea value={customerEvidence} onChange={(e) => setCustomerEvidence(e.target.value)} className="mt-2 bg-slate-950 border-slate-700" /></div><div><Label>نموذج الإيراد أو الجذب</Label><Textarea value={revenueModel} onChange={(e) => setRevenueModel(e.target.value)} className="mt-2 bg-slate-950 border-slate-700" /></div></>}
          <div className="md:col-span-2"><Button onClick={() => saveSubmission.mutate({ ideaId, submissionType, technicalPrinciple: technicalPrinciple || null, prototypeStatus: prototypeStatus || null, testEnvironment: testEnvironment || null, performanceSummary: performanceSummary || null, customerEvidence: customerEvidence || null, revenueModel: revenueModel || null, tractionSummary: tractionSummary || null, saipApplicationNumberDeclared: saipNumber || null })} disabled={saveSubmission.isPending} className="bg-violet-600 hover:bg-violet-500">حفظ ملف الحقائق</Button></div>
        </CardContent></Card>

        <div className="grid lg:grid-cols-2 gap-6"><Card className="bg-slate-900/80 border-slate-700"><CardHeader><CardTitle className="flex items-center gap-2"><Upload className="text-cyan-400" /> Evidence Vault</CardTitle></CardHeader><CardContent className="space-y-3"><Select value={evidence.evidenceType} onValueChange={(value) => setEvidence({ ...evidence, evidenceType: value as any })}><SelectTrigger className="bg-slate-950 border-slate-700"><SelectValue /></SelectTrigger><SelectContent>{evidenceTypes.map(([value,label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select><Input value={evidence.title} onChange={(e) => setEvidence({ ...evidence, title: e.target.value })} placeholder="عنوان الدليل" className="bg-slate-950 border-slate-700" /><Textarea value={evidence.summary} onChange={(e) => setEvidence({ ...evidence, summary: e.target.value })} placeholder="اشرح ما الذي يثبته هذا الدليل" className="bg-slate-950 border-slate-700" /><div className="grid grid-cols-2 gap-3"><Input value={evidence.sourceUrl} onChange={(e) => setEvidence({ ...evidence, sourceUrl: e.target.value })} placeholder="رابط اختياري" className="bg-slate-950 border-slate-700" /><Select value={evidence.supportedTrl} onValueChange={(value) => setEvidence({ ...evidence, supportedTrl: value })}><SelectTrigger className="bg-slate-950 border-slate-700"><SelectValue /></SelectTrigger><SelectContent>{[1,2,3,4,5,6,7,8,9].map((level) => <SelectItem key={level} value={String(level)}>يدعم TRL {level}</SelectItem>)}</SelectContent></Select></div><Input type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" onChange={(event) => { const file = event.target.files?.[0]; if (!file) return; if (file.size > 4 * 1024 * 1024) return toast.error('الحد الأقصى للملف 4MB'); const reader = new FileReader(); reader.onload = () => setUpload({ name: file.name, mimeType: file.type || 'application/octet-stream', base64: String(reader.result).split(',')[1] }); reader.readAsDataURL(file); }} className="bg-slate-950 border-slate-700" /><Button onClick={handleEvidenceSubmit} disabled={addEvidence.isPending || uploadFile.isPending} className="bg-cyan-600 hover:bg-cyan-500">إضافة الدليل</Button></CardContent></Card>
          <Card className="bg-slate-900/80 border-slate-700"><CardHeader><CardTitle className="flex items-center gap-2"><FlaskConical className="text-amber-400" /> الأدلة المسجلة</CardTitle></CardHeader><CardContent className="space-y-3">{bundle.evidence.length === 0 ? <p className="text-slate-400">لا توجد أدلة مسجلة بعد.</p> : bundle.evidence.map((item: any) => <div key={item.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800"><div className="flex justify-between gap-3"><strong>{item.title}</strong><Badge variant="outline">TRL {item.supportedTrl || '—'}</Badge></div><p className="text-sm text-slate-400 mt-1">{item.summary}</p><p className="text-xs text-amber-300 mt-2">حالة الدليل: تصريح المستخدم — {item.reviewStatus}</p></div>)}</CardContent></Card></div>

        <Card className="bg-gradient-to-br from-violet-950/70 to-slate-900 border-violet-500/30"><CardHeader><CardTitle className="flex items-center gap-2"><Gauge className="text-violet-300" /> تحديث Passport وTRL</CardTitle></CardHeader><CardContent className="flex flex-col md:flex-row gap-4 items-end"><div className="w-full md:w-64"><Label>TRL المعلن من صاحب المشروع</Label><Select value={claimedTrl} onValueChange={setClaimedTrl} disabled={!trlApplicable}><SelectTrigger className="mt-2 bg-slate-950 border-slate-700"><SelectValue /></SelectTrigger><SelectContent>{[1,2,3,4,5,6,7,8,9].map((level) => <SelectItem key={level} value={String(level)}>TRL {level}</SelectItem>)}</SelectContent></Select></div><Button onClick={() => refreshPassport.mutate({ ideaId, claimedTrl: trlApplicable ? Number(claimedTrl) : undefined })} disabled={refreshPassport.isPending} className="bg-violet-600 hover:bg-violet-500">إنشاء أو تحديث Passport</Button><p className="text-xs text-slate-400 max-w-xl">التقدير يستخدم حقول المشروع والأدلة المصرح بها في هذه المرحلة؛ لا يعد تحققاً خارجياً ولا وثيقة ملكية فكرية.</p></CardContent></Card>

        {bundle.passport && <><div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3">{scoreCards.map((score) => <Card key={score.label} className="bg-slate-900 border-slate-700"><CardContent className="p-4"><p className="text-xs text-slate-400">{score.label}</p><p className="text-2xl font-bold text-violet-300 mt-2">{score.value}%</p></CardContent></Card>)}</div><Card className="bg-slate-900/80 border-slate-700"><CardContent className="p-5 grid md:grid-cols-3 gap-4"><div><p className="text-sm text-slate-400">Technology Readiness</p><p className="font-semibold mt-1">{bundle.passport.technologyReadinessApplicable ? bundle.assessment?.estimatedTrl ? `TRL تقديري ${bundle.assessment.estimatedTrl}` : 'أضف أدلة لتقدير TRL' : 'غير منطبق'}</p></div><div><p className="text-sm text-slate-400">حالة التوثيق</p><p className="font-semibold mt-1">{bundle.assessment?.verificationStatus === 'verified' ? 'موثق' : 'غير موثق — يحتاج مراجعة'}</p></div><div><p className="text-sm text-slate-400">المسار المقترح</p><p className="font-semibold mt-1">{bundle.passport.suggestedRoute}</p></div><div className="md:col-span-3"><p className="text-sm text-slate-400 mb-2">الإجراءات التالية</p><ul className="list-disc pr-5 text-sm text-slate-200 space-y-1">{(bundle.passport.nextBestActions as string[] || []).map((action, index) => <li key={index}>{action}</li>)}</ul></div></CardContent></Card></>}
        <div className="flex items-center gap-2 text-xs text-slate-500"><ShieldCheck className="w-4 h-4" /> رقم طلب الملكية الفكرية إن وجد هو تصريح مستخدم فقط. لا يوجد تحقق حي أو تقديم رسمي عبر NAQLA في CR-01.</div>
      </>}
    </div>
  </div>;
}
