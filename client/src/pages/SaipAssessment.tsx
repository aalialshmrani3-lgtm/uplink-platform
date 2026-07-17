import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// ---- Types ----
type IpType = 'patent' | 'trademark' | 'copyright' | 'design' | 'trade_secret';
type Recommendation = 'eligible' | 'needs_improvement' | 'not_eligible';

interface CriterionResult {
  score: number;
  status: 'pass' | 'partial' | 'fail';
  analysis: string;
}

interface AssessmentResult {
  overall_score: number;
  recommendation: Recommendation;
  criteria: {
    novelty: CriterionResult;
    inventive_step: CriterionResult;
    industrial_applicability: CriterionResult;
  };
  strengths: string[];
  weaknesses: string[];
  saip_recommendation: string;
  ip_type_recommendation: string;
  saip_links: string[];
  estimated_filing_cost: string;
}

// ---- Helpers ----
const ipTypeLabels: Record<IpType, string> = {
  patent: 'براءة اختراع',
  trademark: 'علامة تجارية',
  copyright: 'حق مؤلف',
  design: 'تصميم صناعي',
  trade_secret: 'سر تجاري',
};

const saipServiceLinks: Record<IpType, { label: string; url: string }[]> = {
  patent: [
    { label: 'إيداع طلب براءة اختراع', url: 'https://www.saip.gov.sa/services/patents/patent1' },
    { label: 'البحث في براءات الاختراع', url: 'https://ipsearch.saip.gov.sa' },
    { label: 'دليل براءات الاختراع', url: 'https://saip.gov.sa/en/resources/ip-information/digital-guide/ip-category/patents' },
  ],
  trademark: [
    { label: 'تسجيل علامة تجارية', url: 'https://www.saip.gov.sa/services/trademarks' },
    { label: 'البحث في العلامات التجارية', url: 'https://ipsearch.saip.gov.sa' },
  ],
  copyright: [
    { label: 'تسجيل حق مؤلف (برمجيات)', url: 'https://www.saip.gov.sa/services/copyrights/copyr1' },
    { label: 'خدمات حقوق المؤلف', url: 'https://www.saip.gov.sa/services/copyrights' },
  ],
  design: [
    { label: 'تسجيل تصميم صناعي', url: 'https://www.saip.gov.sa/services/industrial-designs' },
  ],
  trade_secret: [
    { label: 'حماية الأسرار التجارية', url: 'https://www.saip.gov.sa/en/resources/ip-information/digital-guide/ip-category/trade-secrets' },
  ],
};

const recommendationConfig: Record<Recommendation, { label: string; color: string; bg: string; icon: string }> = {
  eligible: {
    label: 'مؤهل للتسجيل في SAIP',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/30',
    icon: '✅',
  },
  needs_improvement: {
    label: 'يحتاج تحسينات قبل التسجيل',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/30',
    icon: '⚠️',
  },
  not_eligible: {
    label: 'غير مؤهل للتسجيل حالياً',
    color: 'text-red-400',
    bg: 'bg-red-500/10 border-red-500/30',
    icon: '❌',
  },
};

const statusConfig = {
  pass: { label: 'اجتاز', color: 'text-emerald-400', bg: 'bg-emerald-500/20', dot: 'bg-emerald-400' },
  partial: { label: 'جزئي', color: 'text-amber-400', bg: 'bg-amber-500/20', dot: 'bg-amber-400' },
  fail: { label: 'لم يجتز', color: 'text-red-400', bg: 'bg-red-500/20', dot: 'bg-red-400' },
};

// ---- Score Ring Component ----
function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#1e293b" strokeWidth={8} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth={8}
          strokeDasharray={`${progress} ${circumference}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.8s ease' }}
        />
      </svg>
      <span className="absolute text-sm font-bold" style={{ color }}>{score}%</span>
    </div>
  );
}

// ---- Main Component ----
export default function SaipAssessment() {
  const { toast } = useToast();

  // Form state
  const [form, setForm] = useState({
    title: '',
    description: '',
    field: '',
    existingSolutions: '',
    technicalDetails: '',
    ipType: 'patent' as IpType,
  });

  // Assessment result
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [assessmentId, setAssessmentId] = useState<number | null>(null);

  // SAIP ref number modal
  const [showRefModal, setShowRefModal] = useState(false);
  const [saipRef, setSaipRef] = useState('');
  const [refNotes, setRefNotes] = useState('');
  const [refSaved, setRefSaved] = useState(false);

  // Active tab
  const [activeTab, setActiveTab] = useState<'form' | 'result' | 'history'>('form');

  // Mutations & queries
  const evaluateMutation = trpc.saipAssessment.evaluateInnovation.useMutation({
    onSuccess: (data: any) => {
      setResult(data);
      setActiveTab('result');
      toast({ title: 'تم التقييم بنجاح', description: `النتيجة الإجمالية: ${data.overall_score}%` });
    },
    onError: (err: any) => {
      toast({ title: 'خطأ في التقييم', description: err.message, variant: 'destructive' });
    },
  });

  const saveRefMutation = trpc.saipAssessment.saveApplicationRef.useMutation({
    onSuccess: () => {
      setRefSaved(true);
      setShowRefModal(false);
      toast({ title: '✅ تم حفظ رقم الطلب', description: 'تم ربط طلب SAIP بسجلك في المنصة' });
    },
    onError: (err: any) => {
      toast({ title: 'خطأ', description: err.message, variant: 'destructive' });
    },
  });

  const { data: history, refetch: refetchHistory } = trpc.saipAssessment.getMyAssessments.useQuery(undefined, {
    enabled: activeTab === 'history',
  });

  const handleEvaluate = () => {
    if (!form.title || !form.description || !form.field) {
      toast({ title: 'بيانات ناقصة', description: 'يرجى ملء العنوان والوصف والمجال', variant: 'destructive' });
      return;
    }
    evaluateMutation.mutate(form);
  };

  const handleSaveRef = () => {
    if (!saipRef.trim() || !assessmentId) return;
    saveRefMutation.mutate({
      assessmentId,
      saipRefNumber: saipRef,
      ipType: form.ipType,
      notes: refNotes || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white p-6" dir="rtl">
      {/* Header */}
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/20">
            🏛️
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">تقييم الملكية الفكرية — SAIP</h1>
            <p className="text-slate-400 text-sm mt-0.5">
              تحقق من أهلية ابتكارك لبراءة الاختراع وفق معايير الهيئة السعودية للملكية الفكرية
            </p>
          </div>
          <div className="mr-auto">
            <a
              href="https://www.saip.gov.sa"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm hover:bg-emerald-500/20 transition-colors"
            >
              <span>🔗</span>
              <span>بوابة SAIP الرسمية</span>
            </a>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-800/50 rounded-xl p-1 mb-6 w-fit">
          {[
            { id: 'form', label: '📝 تقييم جديد' },
            { id: 'result', label: '📊 نتيجة التقييم', disabled: !result },
            { id: 'history', label: '📁 سجل التقييمات' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                if (!tab.disabled) {
                  setActiveTab(tab.id as any);
                  if (tab.id === 'history') refetchHistory();
                }
              }}
              disabled={tab.disabled}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                  : tab.disabled
                  ? 'text-slate-600 cursor-not-allowed'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ===== FORM TAB ===== */}
        {activeTab === 'form' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 space-y-5">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-bold">1</span>
                  معلومات الابتكار الأساسية
                </h2>

                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">عنوان الابتكار <span className="text-red-400">*</span></label>
                  <Input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="مثال: نظام ذكاء اصطناعي لتحسين سلاسل الإمداد"
                    className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1.5">مجال الابتكار <span className="text-red-400">*</span></label>
                    <Input
                      value={form.field}
                      onChange={(e) => setForm({ ...form, field: e.target.value })}
                      placeholder="مثال: تقنية المعلومات، الطاقة، الصحة"
                      className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1.5">نوع الحماية المطلوبة</label>
                    <Select value={form.ipType} onValueChange={(v) => setForm({ ...form, ipType: v as IpType })}>
                      <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {Object.entries(ipTypeLabels).map(([k, v]) => (
                          <SelectItem key={k} value={k} className="text-white hover:bg-slate-700">{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">
                    وصف الابتكار التفصيلي <span className="text-red-400">*</span>
                    <span className="text-slate-500 mr-2">(50 حرف على الأقل)</span>
                  </label>
                  <Textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="صف ابتكارك بالتفصيل: ما المشكلة التي يحلها؟ كيف يعمل؟ ما الذي يجعله فريداً؟"
                    rows={5}
                    className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 resize-none"
                  />
                  <p className="text-xs text-slate-500 mt-1">{form.description.length} / 50+ حرف</p>
                </div>
              </div>

              <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 space-y-5">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-bold">2</span>
                  معلومات إضافية (اختيارية — تحسّن دقة التقييم)
                </h2>

                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">الحلول الموجودة حالياً في السوق</label>
                  <Textarea
                    value={form.existingSolutions}
                    onChange={(e) => setForm({ ...form, existingSolutions: e.target.value })}
                    placeholder="ما هي المنتجات أو الحلول المشابهة الموجودة؟ وكيف يختلف ابتكارك عنها؟"
                    rows={3}
                    className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">التفاصيل التقنية</label>
                  <Textarea
                    value={form.technicalDetails}
                    onChange={(e) => setForm({ ...form, technicalDetails: e.target.value })}
                    placeholder="المكونات التقنية، الخوارزميات، المواد، العمليات... أي تفاصيل تقنية تدعم فرادة الابتكار"
                    rows={3}
                    className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 resize-none"
                  />
                </div>
              </div>

              <Button
                onClick={handleEvaluate}
                disabled={evaluateMutation.isPending}
                className="w-full py-4 text-base font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/20 rounded-xl"
              >
                {evaluateMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    جاري التقييم بالذكاء الاصطناعي...
                  </span>
                ) : (
                  '🔍 تقييم الابتكار وفق معايير SAIP'
                )}
              </Button>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-4">
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <span>📋</span> معايير SAIP الثلاثة
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      title: 'الجِدة (Novelty)',
                      desc: 'الاختراع يجب أن يكون جديداً ولم يُكشف عنه في أي مكان بالعالم قبل تاريخ الإيداع',
                      icon: '🆕',
                    },
                    {
                      title: 'خطوة الابتكار (Inventive Step)',
                      desc: 'يجب أن يكون غير بديهي لمتخصص في المجال — تحسين بسيط لشيء معروف لا يكفي',
                      icon: '💡',
                    },
                    {
                      title: 'قابلية التطبيق الصناعي',
                      desc: 'يجب أن يكون قابلاً للتصنيع أو الاستخدام في الصناعة — الأفكار النظرية البحتة مستثناة',
                      icon: '🏭',
                    },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-3">
                      <span className="text-xl flex-shrink-0 mt-0.5">{item.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-white">{item.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-amber-400 mb-2 flex items-center gap-2">
                  <span>⚠️</span> تنبيه مهم
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  لا تُفصح عن تفاصيل ابتكارك علناً (سوشيال ميديا، مؤتمرات) قبل إيداع طلب البراءة في SAIP. أي كشف علني يُلغي شرط الجِدة ويُسقط حقك في البراءة.
                </p>
              </div>

              <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <span>💰</span> رسوم SAIP التقريبية
                </h3>
                <div className="space-y-2 text-xs">
                  {[
                    { type: 'براءة اختراع', cost: '900 — 4,500 ريال' },
                    { type: 'علامة تجارية', cost: '1,000 — 3,000 ريال' },
                    { type: 'حق مؤلف (برمجيات)', cost: '500 — 1,500 ريال' },
                    { type: 'تصميم صناعي', cost: '500 — 2,000 ريال' },
                  ].map((item) => (
                    <div key={item.type} className="flex justify-between">
                      <span className="text-slate-400">{item.type}</span>
                      <span className="text-emerald-400 font-medium">{item.cost}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== RESULT TAB ===== */}
        {activeTab === 'result' && result && (
          <div className="space-y-6">
            {/* Overall Score Banner */}
            <div className={`rounded-2xl border p-6 ${recommendationConfig[result.recommendation].bg}`}>
              <div className="flex items-center gap-6">
                <ScoreRing score={result.overall_score} size={100} />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{recommendationConfig[result.recommendation].icon}</span>
                    <h2 className={`text-xl font-bold ${recommendationConfig[result.recommendation].color}`}>
                      {recommendationConfig[result.recommendation].label}
                    </h2>
                  </div>
                  <p className="text-slate-300 text-sm">{form.title}</p>
                  <div className="flex gap-2 mt-3">
                    <Badge className="bg-slate-700/50 text-slate-300 text-xs">{form.field}</Badge>
                    <Badge className="bg-slate-700/50 text-slate-300 text-xs">{ipTypeLabels[form.ipType]}</Badge>
                    <Badge className="bg-slate-700/50 text-slate-300 text-xs">تكلفة التقديم: {result.estimated_filing_cost}</Badge>
                  </div>
                </div>
                {result.recommendation === 'eligible' && !refSaved && (
                  <Button
                    onClick={() => setShowRefModal(true)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-emerald-500/20 flex-shrink-0"
                  >
                    📋 سجّل في SAIP الآن
                  </Button>
                )}
                {refSaved && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3 text-center flex-shrink-0">
                    <p className="text-emerald-400 text-sm font-semibold">✅ تم الإيداع في SAIP</p>
                    <p className="text-slate-400 text-xs mt-1">رقم الطلب محفوظ</p>
                  </div>
                )}
              </div>
            </div>

            {/* Criteria Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { key: 'novelty', label: 'الجِدة', icon: '🆕', data: result.criteria.novelty },
                { key: 'inventive_step', label: 'خطوة الابتكار', icon: '💡', data: result.criteria.inventive_step },
                { key: 'industrial_applicability', label: 'قابلية التطبيق', icon: '🏭', data: result.criteria.industrial_applicability },
              ].map((criterion) => {
                const cfg = statusConfig[criterion.data.status];
                return (
                  <div key={criterion.key} className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{criterion.icon}</span>
                        <span className="text-sm font-semibold text-white">{criterion.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ScoreRing score={criterion.data.score} size={50} />
                      </div>
                    </div>
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color} mb-3`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{criterion.data.analysis}</p>
                  </div>
                );
              })}
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                  <span>✅</span> نقاط القوة
                </h3>
                <ul className="space-y-2">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <span className="text-emerald-400 mt-0.5 flex-shrink-0">•</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
                  <span>⚠️</span> نقاط الضعف والمخاطر
                </h3>
                <ul className="space-y-2">
                  {result.weaknesses.map((w, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <span className="text-red-400 mt-0.5 flex-shrink-0">•</span>
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* SAIP Recommendation */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
              <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                <span>🏛️</span> توصية SAIP — الخطوات التالية
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">{result.saip_recommendation}</p>

              {/* SAIP Direct Links */}
              <div className="border-t border-slate-700/50 pt-4">
                <p className="text-xs text-slate-400 mb-3">روابط SAIP المباشرة لـ {ipTypeLabels[form.ipType]}:</p>
                <div className="flex flex-wrap gap-2">
                  {saipServiceLinks[form.ipType].map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs hover:bg-emerald-500/20 transition-colors"
                    >
                      <span>🔗</span>
                      {link.label}
                    </a>
                  ))}
                  {result.saip_links?.map((link) => (
                    <a
                      key={link}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700/50 border border-slate-600/50 text-slate-300 text-xs hover:bg-slate-700 transition-colors"
                    >
                      <span>🔗</span>
                      {link.replace('https://www.saip.gov.sa', 'SAIP').replace('https://', '')}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={() => { setActiveTab('form'); setResult(null); setRefSaved(false); }}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                📝 تقييم ابتكار آخر
              </Button>
              {result.recommendation !== 'not_eligible' && !refSaved && (
                <Button
                  onClick={() => setShowRefModal(true)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  📋 أدخل رقم طلب SAIP
                </Button>
              )}
            </div>
          </div>
        )}

        {/* ===== HISTORY TAB ===== */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">سجل تقييماتك</h2>
            {!history || history.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                <p className="text-4xl mb-3">📁</p>
                <p>لا توجد تقييمات سابقة</p>
                <Button
                  onClick={() => setActiveTab('form')}
                  className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  ابدأ تقييمك الأول
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {history.map((item: any) => {
                  const rec = item.recommendation as Recommendation;
                  const cfg = recommendationConfig[rec];
                  return (
                    <div key={item.id} className={`rounded-2xl border p-5 ${cfg.bg}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <ScoreRing score={item.overallScore} size={60} />
                          <div>
                            <p className="text-sm font-semibold text-white">{item.title}</p>
                            <div className="flex gap-2 mt-1">
                              <Badge className="bg-slate-700/50 text-slate-400 text-xs">{item.field}</Badge>
                              <Badge className="bg-slate-700/50 text-slate-400 text-xs">{ipTypeLabels[item.ipType as IpType]}</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-medium ${cfg.color}`}>{cfg.icon} {cfg.label}</p>
                          {item.saipRefNumber && (
                            <p className="text-xs text-emerald-400 mt-1">رقم SAIP: {item.saipRefNumber}</p>
                          )}
                          <p className="text-xs text-slate-500 mt-1">
                            {new Date(item.createdAt).toLocaleDateString('ar-SA')}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ===== SAIP REF MODAL ===== */}
      {showRefModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl" dir="rtl">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-2xl">🏛️</span>
              <div>
                <h3 className="text-base font-bold text-white">ربط طلب SAIP بالمنصة</h3>
                <p className="text-xs text-slate-400 mt-0.5">بعد تقديم طلبك في SAIP، أدخل رقم الطلب هنا لحفظه في سجلك</p>
              </div>
            </div>

            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 mb-5">
              <p className="text-xs text-slate-400 mb-2">للتسجيل في SAIP:</p>
              <ol className="space-y-1.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold flex-shrink-0">1.</span>
                  اذهب إلى{' '}
                  <a href="https://eservices.saip.gov.sa" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline">
                    eservices.saip.gov.sa
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold flex-shrink-0">2.</span>
                  سجّل دخولك بحساب النفاذ الوطني (Nafath)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold flex-shrink-0">3.</span>
                  اختر نوع الحماية وأكمل نموذج الطلب
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold flex-shrink-0">4.</span>
                  احفظ رقم الطلب الصادر وأدخله أدناه
                </li>
              </ol>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">رقم طلب SAIP <span className="text-red-400">*</span></label>
                <Input
                  value={saipRef}
                  onChange={(e) => setSaipRef(e.target.value)}
                  placeholder="مثال: SA-2025-12345"
                  className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">ملاحظات (اختياري)</label>
                <Textarea
                  value={refNotes}
                  onChange={(e) => setRefNotes(e.target.value)}
                  placeholder="أي ملاحظات حول الطلب أو الخطوات التالية..."
                  rows={3}
                  className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <Button
                onClick={handleSaveRef}
                disabled={!saipRef.trim() || saveRefMutation.isPending}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                {saveRefMutation.isPending ? 'جاري الحفظ...' : '✅ حفظ رقم الطلب'}
              </Button>
              <Button
                onClick={() => setShowRefModal(false)}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                إلغاء
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
