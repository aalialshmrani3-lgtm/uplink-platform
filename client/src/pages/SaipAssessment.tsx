import { useState, useEffect, useRef } from 'react';
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
type SaipStatus = 'pending' | 'under_review' | 'approved' | 'rejected' | 'withdrawn';

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

// ---- Config ----
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
  eligible: { label: 'مؤهل للتسجيل في SAIP', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', icon: '✅' },
  needs_improvement: { label: 'يحتاج تحسينات قبل التسجيل', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30', icon: '⚠️' },
  not_eligible: { label: 'غير مؤهل للتسجيل حالياً', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30', icon: '❌' },
};

const statusConfig = {
  pass: { label: 'اجتاز', color: 'text-emerald-400', bg: 'bg-emerald-500/20', dot: 'bg-emerald-400' },
  partial: { label: 'جزئي', color: 'text-amber-400', bg: 'bg-amber-500/20', dot: 'bg-amber-400' },
  fail: { label: 'لم يجتز', color: 'text-red-400', bg: 'bg-red-500/20', dot: 'bg-red-400' },
};

const saipStatusConfig: Record<SaipStatus, { label: string; color: string; bg: string; icon: string }> = {
  pending: { label: 'في الانتظار', color: 'text-slate-400', bg: 'bg-slate-500/20 border-slate-500/30', icon: '⏳' },
  under_review: { label: 'قيد المراجعة', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30', icon: '🔍' },
  approved: { label: 'مقبول ✨', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', icon: '🎉' },
  rejected: { label: 'مرفوض', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30', icon: '❌' },
  withdrawn: { label: 'تم السحب', color: 'text-slate-500', bg: 'bg-slate-700/30 border-slate-600/30', icon: '↩️' },
};

// ---- Analysis Steps (for loading indicator) ----
const ANALYSIS_STEPS = [
  { id: 1, label: 'البحث في قواعد بيانات براءات الاختراع العالمية', icon: '🔍', duration: 2200 },
  { id: 2, label: 'تحليل معيار الجِدة (Novelty)', icon: '🆕', duration: 2800 },
  { id: 3, label: 'تقييم خطوة الابتكار (Inventive Step)', icon: '💡', duration: 2500 },
  { id: 4, label: 'فحص قابلية التطبيق الصناعي', icon: '🏭', duration: 2000 },
  { id: 5, label: 'مقارنة بالحلول الموجودة في السوق', icon: '📊', duration: 2300 },
  { id: 6, label: 'إعداد توصيات SAIP المخصصة', icon: '🏛️', duration: 1800 },
  { id: 7, label: 'إنشاء تقرير التقييم الشامل', icon: '📋', duration: 1500 },
];

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
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={8}
          strokeDasharray={`${progress} ${circumference}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.8s ease' }} />
      </svg>
      <span className="absolute text-sm font-bold" style={{ color }}>{score}%</span>
    </div>
  );
}

// ---- Animated Loading Indicator ----
function AnalysisLoader({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [dots, setDots] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Dots animation
    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 400);

    // Step progression
    let stepIndex = 0;
    const advanceStep = () => {
      if (stepIndex < ANALYSIS_STEPS.length) {
        setCurrentStep(stepIndex);
        const step = ANALYSIS_STEPS[stepIndex];
        timerRef.current = setTimeout(() => {
          setCompletedSteps(prev => [...prev, stepIndex]);
          stepIndex++;
          advanceStep();
        }, step.duration);
      }
    };
    advanceStep();

    return () => {
      clearInterval(dotsInterval);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const progress = Math.round(((completedSteps.length) / ANALYSIS_STEPS.length) * 100);

  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8 text-center">
      {/* Main spinner */}
      <div className="relative w-24 h-24 mx-auto mb-6">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r="40" fill="none" stroke="#1e293b" strokeWidth="8" />
          <circle cx="48" cy="48" r="40" fill="none" stroke="#10b981" strokeWidth="8"
            strokeDasharray={`${(progress / 100) * 251} 251`} strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.5s ease' }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-emerald-400">{progress}%</span>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-white mb-1">
        جاري التحليل بالذكاء الاصطناعي{dots}
      </h3>
      <p className="text-slate-400 text-sm mb-6">قد يستغرق هذا 15-30 ثانية</p>

      {/* Steps list */}
      <div className="space-y-2 text-right max-w-sm mx-auto">
        {ANALYSIS_STEPS.map((step, index) => {
          const isCompleted = completedSteps.includes(index);
          const isActive = currentStep === index && !isCompleted;
          return (
            <div key={step.id} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 ${
              isActive ? 'bg-emerald-500/10 border border-emerald-500/20' :
              isCompleted ? 'opacity-60' : 'opacity-30'
            }`}>
              <span className="text-base flex-shrink-0">
                {isCompleted ? '✅' : isActive ? (
                  <span className="inline-block w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                ) : step.icon}
              </span>
              <span className={`text-sm flex-1 ${isActive ? 'text-emerald-300 font-medium' : isCompleted ? 'text-slate-400' : 'text-slate-600'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---- PDF Export Function ----
function exportToPdf(assessment: AssessmentResult, formData: { title: string; field: string; ipType: IpType }) {
  const recCfg = recommendationConfig[assessment.recommendation];
  const date = new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' });

  const html = `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
<meta charset="UTF-8">
<title>تقرير تقييم الملكية الفكرية - ${formData.title}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Tajawal', sans-serif; background: #fff; color: #1e293b; direction: rtl; }
  .page { width: 210mm; min-height: 297mm; padding: 20mm; margin: 0 auto; }
  .cover { text-align: center; padding: 40mm 20mm; }
  .cover .logo { font-size: 48px; margin-bottom: 16px; }
  .cover h1 { font-size: 28px; font-weight: 800; color: #0f172a; margin-bottom: 8px; }
  .cover .subtitle { font-size: 16px; color: #64748b; margin-bottom: 32px; }
  .cover .title-box { background: #f0fdf4; border: 2px solid #10b981; border-radius: 12px; padding: 20px 32px; display: inline-block; margin-bottom: 24px; }
  .cover .title-box h2 { font-size: 22px; font-weight: 700; color: #065f46; }
  .cover .meta { display: flex; gap: 24px; justify-content: center; flex-wrap: wrap; margin-top: 24px; }
  .cover .meta-item { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 20px; font-size: 14px; color: #475569; }
  .cover .meta-item strong { color: #0f172a; display: block; font-size: 12px; margin-bottom: 2px; }
  .section { margin-bottom: 28px; }
  .section-title { font-size: 18px; font-weight: 700; color: #0f172a; border-bottom: 2px solid #10b981; padding-bottom: 8px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
  .score-banner { background: linear-gradient(135deg, #f0fdf4, #ecfdf5); border: 2px solid #10b981; border-radius: 12px; padding: 20px 24px; display: flex; align-items: center; gap: 24px; margin-bottom: 24px; }
  .score-circle { width: 80px; height: 80px; border-radius: 50%; background: conic-gradient(#10b981 ${assessment.overall_score * 3.6}deg, #e2e8f0 0deg); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .score-inner { width: 60px; height: 60px; border-radius: 50%; background: white; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 800; color: #10b981; }
  .score-text h3 { font-size: 20px; font-weight: 700; color: #065f46; }
  .score-text p { font-size: 14px; color: #64748b; margin-top: 4px; }
  .criteria-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 24px; }
  .criterion { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; }
  .criterion .c-header { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
  .criterion .c-icon { font-size: 20px; }
  .criterion .c-title { font-size: 14px; font-weight: 700; color: #0f172a; }
  .criterion .c-score { font-size: 22px; font-weight: 800; margin-bottom: 6px; }
  .criterion .c-status { font-size: 12px; font-weight: 600; padding: 2px 10px; border-radius: 20px; display: inline-block; margin-bottom: 8px; }
  .criterion .c-analysis { font-size: 12px; color: #64748b; line-height: 1.6; }
  .pass { color: #10b981; } .partial { color: #f59e0b; } .fail { color: #ef4444; }
  .status-pass { background: #d1fae5; color: #065f46; } .status-partial { background: #fef3c7; color: #92400e; } .status-fail { background: #fee2e2; color: #991b1b; }
  .strengths-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
  .strength-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 16px; }
  .weakness-box { background: #fff7ed; border: 1px solid #fed7aa; border-radius: 10px; padding: 16px; }
  .box-title { font-size: 14px; font-weight: 700; margin-bottom: 10px; }
  .strength-box .box-title { color: #065f46; } .weakness-box .box-title { color: #9a3412; }
  ul { list-style: none; padding: 0; }
  ul li { font-size: 13px; color: #475569; padding: 4px 0; padding-right: 16px; position: relative; line-height: 1.6; }
  ul li::before { content: '•'; position: absolute; right: 0; font-weight: bold; }
  .strength-box ul li::before { color: #10b981; } .weakness-box ul li::before { color: #f97316; }
  .recommendation-box { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 20px; margin-bottom: 24px; }
  .recommendation-box h4 { font-size: 15px; font-weight: 700; color: #1e40af; margin-bottom: 10px; }
  .recommendation-box p { font-size: 13px; color: #1e3a8a; line-height: 1.8; }
  .links-section { margin-top: 16px; }
  .link-item { display: inline-block; background: #f0fdf4; border: 1px solid #10b981; border-radius: 6px; padding: 6px 14px; font-size: 12px; color: #065f46; margin: 4px; text-decoration: none; }
  .footer { text-align: center; margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; }
  .warning-box { background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 16px; margin-bottom: 24px; }
  .warning-box h4 { font-size: 14px; font-weight: 700; color: #92400e; margin-bottom: 6px; }
  .warning-box p { font-size: 13px; color: #78350f; line-height: 1.6; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>
<div class="page">
  <!-- Cover -->
  <div class="cover">
    <div class="logo">🏛️</div>
    <h1>تقرير تقييم الملكية الفكرية</h1>
    <p class="subtitle">الهيئة السعودية للملكية الفكرية (SAIP) — تحليل بالذكاء الاصطناعي</p>
    <div class="title-box">
      <h2>${formData.title}</h2>
    </div>
    <div class="meta">
      <div class="meta-item"><strong>المجال</strong>${formData.field}</div>
      <div class="meta-item"><strong>نوع الحماية</strong>${ipTypeLabels[formData.ipType]}</div>
      <div class="meta-item"><strong>تاريخ التقييم</strong>${date}</div>
      <div class="meta-item"><strong>النتيجة الإجمالية</strong>${assessment.overall_score}%</div>
    </div>
  </div>

  <!-- Score Banner -->
  <div class="section">
    <div class="section-title">📊 ملخص التقييم</div>
    <div class="score-banner">
      <div class="score-circle"><div class="score-inner">${assessment.overall_score}%</div></div>
      <div class="score-text">
        <h3>${recCfg.icon} ${recCfg.label}</h3>
        <p>تكلفة التقديم التقديرية: ${assessment.estimated_filing_cost}</p>
      </div>
    </div>
  </div>

  <!-- Criteria -->
  <div class="section">
    <div class="section-title">🔬 تفصيل معايير SAIP</div>
    <div class="criteria-grid">
      ${[
        { key: 'novelty', label: 'الجِدة', icon: '🆕', data: assessment.criteria.novelty },
        { key: 'inventive_step', label: 'خطوة الابتكار', icon: '💡', data: assessment.criteria.inventive_step },
        { key: 'industrial_applicability', label: 'قابلية التطبيق', icon: '🏭', data: assessment.criteria.industrial_applicability },
      ].map(c => `
      <div class="criterion">
        <div class="c-header"><span class="c-icon">${c.icon}</span><span class="c-title">${c.label}</span></div>
        <div class="c-score ${c.data.status}">${c.data.score}%</div>
        <div class="c-status status-${c.data.status}">${statusConfig[c.data.status].label}</div>
        <div class="c-analysis">${c.data.analysis}</div>
      </div>`).join('')}
    </div>
  </div>

  <!-- Strengths & Weaknesses -->
  <div class="section">
    <div class="section-title">⚖️ نقاط القوة والضعف</div>
    <div class="strengths-grid">
      <div class="strength-box">
        <div class="box-title">✅ نقاط القوة</div>
        <ul>${assessment.strengths.map(s => `<li>${s}</li>`).join('')}</ul>
      </div>
      <div class="weakness-box">
        <div class="box-title">⚠️ نقاط الضعف والمخاطر</div>
        <ul>${assessment.weaknesses.map(w => `<li>${w}</li>`).join('')}</ul>
      </div>
    </div>
  </div>

  <!-- SAIP Recommendation -->
  <div class="section">
    <div class="section-title">🏛️ توصية SAIP والخطوات التالية</div>
    <div class="recommendation-box">
      <h4>توصية الذكاء الاصطناعي:</h4>
      <p>${assessment.saip_recommendation}</p>
    </div>
    <div class="links-section">
      <p style="font-size:13px;color:#64748b;margin-bottom:8px;">روابط SAIP المباشرة:</p>
      ${saipServiceLinks[formData.ipType].map(l => `<a class="link-item" href="${l.url}">${l.label}</a>`).join('')}
    </div>
  </div>

  <!-- Warning -->
  <div class="warning-box">
    <h4>⚠️ تنبيه قانوني مهم</h4>
    <p>لا تُفصح عن تفاصيل ابتكارك علناً (سوشيال ميديا، مؤتمرات، نشر علمي) قبل إيداع طلب البراءة في SAIP. أي كشف علني يُلغي شرط الجِدة ويُسقط حقك في الحماية. هذا التقرير للاستخدام الشخصي فقط ولا يُعدّ استشارة قانونية رسمية.</p>
  </div>

  <div class="footer">
    <p>تم إنشاء هذا التقرير بواسطة منصة NAQLA 5.0 — الذكاء الاصطناعي للابتكار الوطني</p>
    <p style="margin-top:4px;">للتسجيل الرسمي: <strong>eservices.saip.gov.sa</strong> | للاستفسار: <strong>1900</strong></p>
  </div>
</div>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');
  if (win) {
    win.onload = () => {
      setTimeout(() => {
        win.print();
        URL.revokeObjectURL(url);
      }, 500);
    };
  }
}

// ---- Main Component ----
export default function SaipAssessment() {
  const { toast } = useToast();

  const [form, setForm] = useState({
    title: '',
    description: '',
    field: '',
    existingSolutions: '',
    technicalDetails: '',
    ipType: 'patent' as IpType,
  });

  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [savedAssessmentId, setSavedAssessmentId] = useState<number | null>(null);
  const [showRefModal, setShowRefModal] = useState(false);
  const [saipRef, setSaipRef] = useState('');
  const [refNotes, setRefNotes] = useState('');
  const [refSaved, setRefSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'result' | 'history'>('form');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [editingStatusId, setEditingStatusId] = useState<number | null>(null);
  const [statusNotes, setStatusNotes] = useState('');

  const utils = trpc.useUtils();

  const evaluateMutation = trpc.saipAssessment.evaluateInnovation.useMutation({
    onSuccess: (data: any) => {
      setIsAnalyzing(false);
      setResult(data);
      if (data.assessmentId) setSavedAssessmentId(data.assessmentId);
      setActiveTab('result');
      toast({ title: 'تم التقييم بنجاح', description: `النتيجة الإجمالية: ${data.overall_score}%` });
    },
    onError: (err: any) => {
      setIsAnalyzing(false);
      toast({ title: 'خطأ في التقييم', description: err.message, variant: 'destructive' });
    },
  });

  const saveRefMutation = trpc.saipAssessment.saveApplicationRef.useMutation({
    onSuccess: () => {
      setRefSaved(true);
      setShowRefModal(false);
      utils.saipAssessment.getMyAssessments.invalidate();
      toast({ title: '✅ تم حفظ رقم الطلب', description: 'تم ربط طلب SAIP بسجلك في المنصة' });
    },
    onError: (err: any) => {
      toast({ title: 'خطأ', description: err.message, variant: 'destructive' });
    },
  });

  const updateStatusMutation = trpc.saipAssessment.updateSaipStatus.useMutation({
    onSuccess: (data: any) => {
      setEditingStatusId(null);
      setStatusNotes('');
      utils.saipAssessment.getMyAssessments.invalidate();
      const cfg = saipStatusConfig[data.status as SaipStatus];
      toast({ title: `${cfg.icon} تم تحديث الحالة`, description: cfg.label });
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
    setIsAnalyzing(true);
    evaluateMutation.mutate(form);
  };

  const handleSaveRef = () => {
    if (!saipRef.trim() || !savedAssessmentId) return;
    saveRefMutation.mutate({ assessmentId: savedAssessmentId, saipRefNumber: saipRef, ipType: form.ipType, notes: refNotes || undefined });
  };

  const handleUpdateStatus = (assessmentId: number, status: SaipStatus) => {
    updateStatusMutation.mutate({ assessmentId, status, notes: statusNotes || undefined });
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white p-6" dir="rtl">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/20">
            🏛️
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">تقييم الملكية الفكرية — SAIP</h1>
            <p className="text-slate-400 text-sm mt-0.5">تحقق من أهلية ابتكارك وفق معايير الهيئة السعودية للملكية الفكرية</p>
          </div>
          <div className="mr-auto">
            <a href="https://www.saip.gov.sa" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm hover:bg-emerald-500/20 transition-colors">
              <span>🔗</span><span>بوابة SAIP الرسمية</span>
            </a>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-800/50 rounded-xl p-1 mb-6 w-fit">
          {[
            { id: 'form', label: '📝 تقييم جديد' },
            { id: 'result', label: '📊 نتيجة التقييم', disabled: !result && !isAnalyzing },
            { id: 'history', label: '📁 سجل التقييمات' },
          ].map((tab) => (
            <button key={tab.id}
              onClick={() => { if (!(tab as any).disabled) { setActiveTab(tab.id as any); if (tab.id === 'history') refetchHistory(); } }}
              disabled={(tab as any).disabled}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                : (tab as any).disabled ? 'text-slate-600 cursor-not-allowed'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ===== FORM TAB ===== */}
        {activeTab === 'form' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 space-y-5">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-bold">1</span>
                  معلومات الابتكار الأساسية
                </h2>
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">عنوان الابتكار <span className="text-red-400">*</span></label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="مثال: نظام ذكاء اصطناعي لتحسين سلاسل الإمداد"
                    className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1.5">مجال الابتكار <span className="text-red-400">*</span></label>
                    <Input value={form.field} onChange={(e) => setForm({ ...form, field: e.target.value })}
                      placeholder="مثال: تقنية المعلومات، الطاقة، الصحة"
                      className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500" />
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
                  <label className="block text-sm text-slate-400 mb-1.5">وصف الابتكار التفصيلي <span className="text-red-400">*</span></label>
                  <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="صف ابتكارك بالتفصيل: ما المشكلة التي يحلها؟ كيف يعمل؟ ما الذي يجعله فريداً؟"
                    rows={5} className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 resize-none" />
                  <p className="text-xs text-slate-500 mt-1">{form.description.length} / 50+ حرف</p>
                </div>
              </div>
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 space-y-5">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-bold">2</span>
                  معلومات إضافية (اختيارية)
                </h2>
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">الحلول الموجودة حالياً في السوق</label>
                  <Textarea value={form.existingSolutions} onChange={(e) => setForm({ ...form, existingSolutions: e.target.value })}
                    placeholder="ما هي المنتجات أو الحلول المشابهة الموجودة؟ وكيف يختلف ابتكارك عنها؟"
                    rows={3} className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 resize-none" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">التفاصيل التقنية</label>
                  <Textarea value={form.technicalDetails} onChange={(e) => setForm({ ...form, technicalDetails: e.target.value })}
                    placeholder="المكونات التقنية، الخوارزميات، المواد، العمليات..."
                    rows={3} className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 resize-none" />
                </div>
              </div>
              <Button onClick={handleEvaluate} disabled={evaluateMutation.isPending || isAnalyzing}
                className="w-full py-4 text-base font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/20 rounded-xl">
                {isAnalyzing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    جاري التحليل...
                  </span>
                ) : '🔍 تقييم الابتكار وفق معايير SAIP'}
              </Button>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><span>📋</span> معايير SAIP الثلاثة</h3>
                <div className="space-y-4">
                  {[
                    { title: 'الجِدة (Novelty)', desc: 'الاختراع يجب أن يكون جديداً ولم يُكشف عنه في أي مكان بالعالم قبل تاريخ الإيداع', icon: '🆕' },
                    { title: 'خطوة الابتكار (Inventive Step)', desc: 'يجب أن يكون غير بديهي لمتخصص في المجال — تحسين بسيط لشيء معروف لا يكفي', icon: '💡' },
                    { title: 'قابلية التطبيق الصناعي', desc: 'يجب أن يكون قابلاً للتصنيع أو الاستخدام في الصناعة', icon: '🏭' },
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
                <h3 className="text-sm font-semibold text-amber-400 mb-2 flex items-center gap-2"><span>⚠️</span> تنبيه مهم</h3>
                <p className="text-xs text-slate-400 leading-relaxed">لا تُفصح عن تفاصيل ابتكارك علناً قبل إيداع طلب البراءة في SAIP. أي كشف علني يُلغي شرط الجِدة.</p>
              </div>
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><span>💰</span> رسوم SAIP التقريبية</h3>
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

        {/* ===== RESULT TAB — Loading or Result ===== */}
        {activeTab === 'result' && (
          <>
            {isAnalyzing ? (
              <AnalysisLoader onComplete={() => {}} />
            ) : result ? (
              <div className="space-y-6">
                {/* Score Banner */}
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
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <Button onClick={() => exportToPdf(result, form)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold">
                        📄 تصدير PDF
                      </Button>
                      {result.recommendation !== 'not_eligible' && !refSaved && (
                        <Button onClick={() => setShowRefModal(true)}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold">
                          📋 سجّل في SAIP
                        </Button>
                      )}
                      {refSaved && (
                        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-2 text-center">
                          <p className="text-emerald-400 text-xs font-semibold">✅ تم الإيداع في SAIP</p>
                        </div>
                      )}
                    </div>
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
                          <ScoreRing score={criterion.data.score} size={50} />
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
                    <h3 className="text-sm font-semibold text-emerald-400 mb-3 flex items-center gap-2"><span>✅</span> نقاط القوة</h3>
                    <ul className="space-y-2">
                      {result.strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                          <span className="text-emerald-400 mt-0.5 flex-shrink-0">•</span>{s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5">
                    <h3 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2"><span>⚠️</span> نقاط الضعف والمخاطر</h3>
                    <ul className="space-y-2">
                      {result.weaknesses.map((w, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                          <span className="text-red-400 mt-0.5 flex-shrink-0">•</span>{w}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* SAIP Recommendation */}
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
                  <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2"><span>🏛️</span> توصية SAIP — الخطوات التالية</h3>
                  <p className="text-sm text-slate-300 leading-relaxed mb-4">{result.saip_recommendation}</p>
                  <div className="border-t border-slate-700/50 pt-4">
                    <p className="text-xs text-slate-400 mb-3">روابط SAIP المباشرة لـ {ipTypeLabels[form.ipType]}:</p>
                    <div className="flex flex-wrap gap-2">
                      {saipServiceLinks[form.ipType].map((link) => (
                        <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs hover:bg-emerald-500/20 transition-colors">
                          <span>🔗</span>{link.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button onClick={() => { setActiveTab('form'); setResult(null); setRefSaved(false); }}
                    variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                    📝 تقييم ابتكار آخر
                  </Button>
                  <Button onClick={() => exportToPdf(result, form)}
                    className="bg-blue-500 hover:bg-blue-600 text-white">
                    📄 تصدير تقرير PDF
                  </Button>
                  {result.recommendation !== 'not_eligible' && !refSaved && (
                    <Button onClick={() => setShowRefModal(true)} className="bg-emerald-500 hover:bg-emerald-600 text-white">
                      📋 أدخل رقم طلب SAIP
                    </Button>
                  )}
                </div>
              </div>
            ) : null}
          </>
        )}

        {/* ===== HISTORY TAB ===== */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">سجل تقييماتك</h2>
            {!history || history.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                <p className="text-4xl mb-3">📁</p>
                <p>لا توجد تقييمات سابقة</p>
                <Button onClick={() => setActiveTab('form')} className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white">
                  ابدأ تقييمك الأول
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {history.map((item: any) => {
                  const rec = item.recommendation as Recommendation;
                  const recCfg = recommendationConfig[rec];
                  const currentStatus = item.saipStatus as SaipStatus | null;
                  const isEditingThis = editingStatusId === item.id;

                  return (
                    <div key={item.id} className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
                      <div className="flex items-start gap-4">
                        <ScoreRing score={item.overallScore} size={60} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-white">{item.title}</p>
                              <div className="flex gap-2 mt-1 flex-wrap">
                                <Badge className="bg-slate-700/50 text-slate-400 text-xs">{item.field}</Badge>
                                <Badge className="bg-slate-700/50 text-slate-400 text-xs">{ipTypeLabels[item.ipType as IpType]}</Badge>
                                <span className={`text-xs font-medium ${recCfg.color}`}>{recCfg.icon} {recCfg.label}</span>
                              </div>
                            </div>
                            <p className="text-xs text-slate-500 flex-shrink-0">
                              {new Date(item.createdAt).toLocaleDateString('ar-SA')}
                            </p>
                          </div>

                          {/* SAIP Status Section */}
                          {item.saipRefNumber && (
                            <div className="mt-3 pt-3 border-t border-slate-700/50">
                              <div className="flex items-center gap-3 flex-wrap">
                                <span className="text-xs text-slate-400">رقم SAIP: <span className="text-emerald-400 font-mono">{item.saipRefNumber}</span></span>

                                {/* Current Status Badge */}
                                {currentStatus && (
                                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${saipStatusConfig[currentStatus].bg} ${saipStatusConfig[currentStatus].color}`}>
                                    {saipStatusConfig[currentStatus].icon} {saipStatusConfig[currentStatus].label}
                                  </div>
                                )}

                                {/* Update Status Button */}
                                {!isEditingThis && (
                                  <button onClick={() => { setEditingStatusId(item.id); setStatusNotes(item.saipRefNotes || ''); }}
                                    className="text-xs text-blue-400 hover:text-blue-300 underline">
                                    {currentStatus ? 'تحديث الحالة' : 'تعيين الحالة'}
                                  </button>
                                )}
                              </div>

                              {/* Status Editor */}
                              {isEditingThis && (
                                <div className="mt-3 bg-slate-900/50 rounded-xl p-4 space-y-3">
                                  <p className="text-xs text-slate-400 font-medium">تحديث حالة طلب SAIP:</p>
                                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {(Object.entries(saipStatusConfig) as [SaipStatus, typeof saipStatusConfig[SaipStatus]][]).map(([statusKey, cfg]) => (
                                      <button key={statusKey}
                                        onClick={() => handleUpdateStatus(item.id, statusKey)}
                                        disabled={updateStatusMutation.isPending}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                                          currentStatus === statusKey
                                            ? `${cfg.bg} ${cfg.color} border-current`
                                            : 'bg-slate-800 border-slate-600 text-slate-400 hover:border-slate-500 hover:text-slate-300'
                                        }`}>
                                        <span>{cfg.icon}</span>
                                        <span>{cfg.label}</span>
                                      </button>
                                    ))}
                                  </div>
                                  <div>
                                    <Input value={statusNotes} onChange={(e) => setStatusNotes(e.target.value)}
                                      placeholder="ملاحظات اختيارية..."
                                      className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 text-xs" />
                                  </div>
                                  <button onClick={() => setEditingStatusId(null)}
                                    className="text-xs text-slate-500 hover:text-slate-400">
                                    إلغاء
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
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
                <p className="text-xs text-slate-400 mt-0.5">أدخل رقم الطلب بعد تقديمه في SAIP</p>
              </div>
            </div>
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 mb-5">
              <p className="text-xs text-slate-400 mb-2">للتسجيل في SAIP:</p>
              <ol className="space-y-1.5 text-xs text-slate-300">
                <li className="flex items-start gap-2"><span className="text-emerald-400 font-bold flex-shrink-0">1.</span>
                  اذهب إلى <a href="https://eservices.saip.gov.sa" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline">eservices.saip.gov.sa</a></li>
                <li className="flex items-start gap-2"><span className="text-emerald-400 font-bold flex-shrink-0">2.</span>سجّل دخولك بحساب النفاذ الوطني (Nafath)</li>
                <li className="flex items-start gap-2"><span className="text-emerald-400 font-bold flex-shrink-0">3.</span>اختر نوع الحماية وأكمل نموذج الطلب</li>
                <li className="flex items-start gap-2"><span className="text-emerald-400 font-bold flex-shrink-0">4.</span>احفظ رقم الطلب الصادر وأدخله أدناه</li>
              </ol>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">رقم طلب SAIP <span className="text-red-400">*</span></label>
                <Input value={saipRef} onChange={(e) => setSaipRef(e.target.value)} placeholder="مثال: SA-2025-12345"
                  className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">ملاحظات (اختياري)</label>
                <Textarea value={refNotes} onChange={(e) => setRefNotes(e.target.value)}
                  placeholder="أي ملاحظات حول الطلب أو الخطوات التالية..." rows={3}
                  className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 resize-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <Button onClick={handleSaveRef} disabled={!saipRef.trim() || saveRefMutation.isPending}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white">
                {saveRefMutation.isPending ? 'جاري الحفظ...' : '✅ حفظ رقم الطلب'}
              </Button>
              <Button onClick={() => setShowRefModal(false)} variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700">
                إلغاء
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
