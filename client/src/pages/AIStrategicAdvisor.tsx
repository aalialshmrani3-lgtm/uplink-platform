import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, TrendingUp, AlertTriangle, CheckCircle2, Target, Lightbulb, FileDown } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

export default function AIStrategicAdvisor() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    team_size: '',
    timeline_months: '',
    market_demand: '50',
    technical_feasibility: '50',
    user_engagement: '50',
    hypothesis_validation_rate: '0.5',
    rat_completion_rate: '0.5',
    user_count: '0',
    revenue_growth: '0'
  });

  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showWhatIf, setShowWhatIf] = useState(false);
  const [whatIfScenarios, setWhatIfScenarios] = useState<any[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [generalFeedback, setGeneralFeedback] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [emailData, setEmailData] = useState({
    recipients: '',
    cc: '',
    reportType: 'PDF',
    customMessage: ''
  });

  const exportPdfMutation = trpc.ai.exportPdf.useMutation();
  const exportExcelMutation = trpc.ai.exportExcel.useMutation();
  const sendEmailMutation = trpc.ai.sendReportEmail.useMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const analyzeMutation = trpc.ai.analyzeStrategic.useMutation();
  const whatIfMutation = trpc.ai.simulateWhatIf.useMutation();

  const handleAnalyze = async () => {
    // Validation
    if (!formData.title || !formData.description || !formData.budget || !formData.team_size) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Call tRPC endpoint for strategic analysis
      const result = await analyzeMutation.mutateAsync(formData);
      
      setAnalysis(result);
      toast.success('تم التحليل الاستراتيجي بنجاح');
      
    } catch (apiError) {
      console.error('Analysis API error:', apiError);
      
      // Fallback to mock data if API fails
      const mockAnalysis = {
        ici_score: 59.0,
        ici_level: 'متوسط',
        success_probability: 0.65,
        irl_score: 57.9,
        irl_grade: 'C',
        investor_appeal: 'Medium',
        
        dimensions: {
          success_probability: 65.0,
          market_fit: 62.0,
          execution_readiness: 61.5,
          investor_readiness: 57.9,
          financial_sustainability: 34.3
        },
        
        ceo_insights: [
          {
            title: 'فجوة تمويلية حرجة تهدد مرحلة التوسع',
            severity: 'CRITICAL',
            impact: 'احتمالية الفشل: 85% | خطر نفاد السيولة: مرتفع جداً',
            recommendation: 'تأمين تمويل إضافي فوري أو تخفيض Burn Rate بنسبة 30%'
          },
          {
            title: 'غياب التحقق من صحة الفرضيات السوقية',
            severity: 'CRITICAL',
            impact: 'احتمالية بناء منتج لا يحتاجه السوق: 95%',
            recommendation: 'إطلاق MVP وإجراء 50+ مقابلة مع عملاء محتملين خلال 4 أسابيع'
          },
          {
            title: 'ضعف في منهجية RAT (Ready-Aim-Target)',
            severity: 'HIGH',
            impact: 'خطر تجاوز الميزانية: 90% | احتمالية فشل التنفيذ: 85%',
            recommendation: 'تطبيق Agile Sprints مع مراجعة أسبوعية للأهداف'
          }
        ],
        
        roadmap: {
          total_timeline: '3 أشهر',
          priority: 'HIGH',
          steps: [
            {
              title: 'تحسين Financial Model وإعداد Pitch Deck احترافي',
              timeline: '2-3 أسابيع',
              cost: '15K-25K ريال',
              deliverables: ['Financial Model', 'Pitch Deck', 'One-pager'],
              iso_clause: 'Clause 5.2 - Innovation Strategy'
            },
            {
              title: 'استهداف برامج التسريع السعودية',
              timeline: '1-2 أشهر',
              cost: '5K-10K ريال',
              deliverables: ['تقديم طلبات', 'حضور Demo Days'],
              iso_clause: 'Clause 7.4 - Collaboration'
            },
            {
              title: 'تخفيض Burn Rate عبر Lean Operations',
              timeline: '1 شهر',
              cost: '10K-15K ريال',
              deliverables: ['خطة تخفيض التكاليف', 'تحسين العمليات'],
              iso_clause: 'Clause 8.3 - Innovation Process'
            }
          ]
        },
        
        investment: {
          valuation_range: '6.7M - 12.4M ريال',
          funding_potential: '1.3M - 2.5M ريال',
          recommended_investors: [
            {
              type: 'مستثمرون ملائكة',
              probability: 0.30,
              amount: '300K ريال',
              dilution: '15.7%',
              timeline: 'شهر واحد'
            },
            {
              type: 'البرامج الحكومية',
              probability: 0.30,
              amount: '275K ريال',
              dilution: '14.4%',
              timeline: 'شهرين'
            }
          ]
        },
        
        critical_path: [
          {
            phase: 'معالجة المخاطر الحرجة',
            duration: '1-3 أشهر',
            status: 'current'
          },
          {
            phase: 'بناء Product-Market Fit',
            duration: '3-6 أشهر',
            status: 'upcoming'
          },
          {
            phase: 'تأمين التمويل',
            duration: '2-4 أشهر',
            status: 'upcoming'
          },
          {
            phase: 'التوسع والنمو',
            duration: '6-12 شهر',
            status: 'upcoming'
          }
        ]
      };
      
      setAnalysis(mockAnalysis);
      toast.warning('فشل الاتصال بالخادم - استخدام بيانات تجريبية');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const feedbackMutation = trpc.ai.submitFeedback.useMutation();

  const handleExportPdf = async () => {
    if (!analysis?.analysis_id) {
      toast.error('لا يوجد تحليل لتصديره');
      return;
    }

    setIsExporting(true);
    try {
      const result = await exportPdfMutation.mutateAsync({
        analysisId: analysis.analysis_id
      });
      
      if (result.success) {
        toast.success('تم تصدير التقرير إلى PDF بنجاح!');
        // Download file
        window.open(result.filePath, '_blank');
      }
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('فشل تصدير التقرير. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportExcel = async () => {
    if (!analysis?.analysis_id) {
      toast.error('لا يوجد تحليل لتصديره');
      return;
    }

    setIsExporting(true);
    try {
      const result = await exportExcelMutation.mutateAsync({
        analysisId: analysis.analysis_id
      });
      
      if (result.success) {
        toast.success('تم تصدير التقرير إلى Excel بنجاح!');
        // Download file
        window.open(result.filePath, '_blank');
      }
    } catch (error) {
      console.error('Excel export error:', error);
      toast.error('فشل تصدير التقرير. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleSendEmail = async () => {
    if (!analysis?.analysis_id) {
      toast.error('لا يوجد تحليل لإرساله');
      return;
    }

    if (!emailData.recipients.trim()) {
      toast.error('يرجى إدخال عنوان بريد إلكتروني واحد على الأقل');
      return;
    }

    setIsExporting(true);
    try {
      const result = await sendEmailMutation.mutateAsync({
        analysisId: analysis.analysis_id,
        recipients: emailData.recipients,
        cc: emailData.cc || undefined,
        reportType: emailData.reportType as 'PDF' | 'Excel',
        customMessage: emailData.customMessage || undefined
      });
      
      if (result.success) {
        toast.success(`تم إرسال التقرير بنجاح إلى ${result.sent_to} مستلم!`);
        setShowEmailDialog(false);
        // Reset email data
        setEmailData({
          recipients: '',
          cc: '',
          reportType: 'PDF',
          customMessage: ''
        });
      }
    } catch (error) {
      console.error('Email sending error:', error);
      toast.error('فشل إرسال البريد. يرجى التحقق من إعدادات SMTP.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleFeedback = async (feedback: any) => {
    try {
      await feedbackMutation.mutateAsync({
        project_id: formData.title,
        ...feedback
      });
      
      toast.success('شكراً لملاحظاتك! ستساعدنا في تحسين النظام.');
      
      if (feedback.type === 'general') {
        setGeneralFeedback('');
      }
    } catch (error) {
      console.error('Feedback submission error:', error);
      toast.error('فشل إرسال الملاحظات. يرجى المحاولة مرة أخرى.');
    }
  };

  const handleWhatIfScenario = async (modifications: any) => {
    if (!analysis) {
      toast.error('يرجى تحليل المشروع أولاً');
      return;
    }

    setIsSimulating(true);

    try {
      // Call What-If Simulator endpoint
      const result = await whatIfMutation.mutateAsync({
        baseline_features: formData,
        modifications: modifications
      });

      setWhatIfScenarios(prev => [result, ...prev]);
      toast.success(`تم محاكاة سيناريو: ${modifications.name}`);
    } catch (error) {
      console.error('What-If simulation error:', error);
      toast.error('فشلت المحاكاة. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSimulating(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'text-red-600 bg-red-50 border-red-200';
      case 'HIGH': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'LOW': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return <AlertTriangle className="h-5 w-5" />;
      case 'HIGH': return <AlertTriangle className="h-5 w-5" />;
      case 'MEDIUM': return <TrendingUp className="h-5 w-5" />;
      case 'LOW': return <CheckCircle2 className="h-5 w-5" />;
      default: return null;
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8" dir="rtl">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-right">المستشار الاستراتيجي بالذكاء الاصطناعي</h1>
        <p className="text-muted-foreground text-right">
          تحليل شامل لمشروعك مع توصيات استراتيجية قابلة للتنفيذ
        </p>
      </div>

      {/* Input Form */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-6 text-right">معلومات المشروع</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-right block">عنوان المشروع *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="مثال: منصة ذكية لإدارة الطاقة المتجددة"
              className="text-right"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget" className="text-right block">الميزانية (ريال) *</Label>
            <Input
              id="budget"
              name="budget"
              type="number"
              value={formData.budget}
              onChange={handleInputChange}
              placeholder="مثال: 500000"
              className="text-right"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="team_size" className="text-right block">حجم الفريق *</Label>
            <Input
              id="team_size"
              name="team_size"
              type="number"
              value={formData.team_size}
              onChange={handleInputChange}
              placeholder="مثال: 5"
              className="text-right"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeline_months" className="text-right block">المدة الزمنية (أشهر) *</Label>
            <Input
              id="timeline_months"
              name="timeline_months"
              type="number"
              value={formData.timeline_months}
              onChange={handleInputChange}
              placeholder="مثال: 12"
              className="text-right"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="market_demand" className="text-right block">الطلب السوقي (0-100)</Label>
            <Input
              id="market_demand"
              name="market_demand"
              type="number"
              value={formData.market_demand}
              onChange={handleInputChange}
              min="0"
              max="100"
              className="text-right"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="technical_feasibility" className="text-right block">الجدوى التقنية (0-100)</Label>
            <Input
              id="technical_feasibility"
              name="technical_feasibility"
              type="number"
              value={formData.technical_feasibility}
              onChange={handleInputChange}
              min="0"
              max="100"
              className="text-right"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description" className="text-right block">وصف المشروع *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="اشرح فكرة مشروعك بالتفصيل..."
              rows={4}
              className="text-right"
            />
          </div>
        </div>

        <Button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="mt-6 w-full md:w-auto"
          size="lg"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              جارٍ التحليل...
            </>
          ) : (
            <>
              <Target className="ml-2 h-4 w-4" />
              تحليل استراتيجي شامل
            </>
          )}
        </Button>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* ICI Score */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-right">
                <h2 className="text-2xl font-semibold">مؤشر الثقة في الابتكار (ICI)</h2>
                <p className="text-muted-foreground">Innovation Confidence Index</p>
              </div>
              <div className="text-left">
                <div className="text-5xl font-bold text-primary">{analysis.ici_score}</div>
                <div className="text-sm text-muted-foreground">من 100</div>
              </div>
              
              {/* Export Buttons */}
              <div className="flex gap-2 justify-end mt-4">
                <Button
                  onClick={handleExportPdf}
                  disabled={isExporting}
                  variant="outline"
                  size="sm"
                >
                  {isExporting ? (
                    <Loader2 className="h-4 w-4 animate-spin ml-2" />
                  ) : (
                    <FileDown className="h-4 w-4 ml-2" />
                  )}
                  تصدير PDF
                </Button>
                <Button
                  onClick={handleExportExcel}
                  disabled={isExporting}
                  variant="outline"
                  size="sm"
                >
                  {isExporting ? (
                    <Loader2 className="h-4 w-4 animate-spin ml-2" />
                  ) : (
                    <FileDown className="h-4 w-4 ml-2" />
                  )}
                  تصدير Excel
                </Button>
                <Button
                  onClick={() => setShowEmailDialog(true)}
                  disabled={isExporting}
                  variant="default"
                  size="sm"
                >
                  <svg className="h-4 w-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  إرسال عبر البريد
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{analysis.dimensions.success_probability}</div>
                <div className="text-sm text-muted-foreground mt-1">احتمالية النجاح</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{analysis.dimensions.market_fit}</div>
                <div className="text-sm text-muted-foreground mt-1">ملاءمة السوق</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{analysis.dimensions.execution_readiness}</div>
                <div className="text-sm text-muted-foreground mt-1">جاهزية التنفيذ</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{analysis.dimensions.investor_readiness}</div>
                <div className="text-sm text-muted-foreground mt-1">جاهزية المستثمر</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{analysis.dimensions.financial_sustainability}</div>
                <div className="text-sm text-muted-foreground mt-1">الاستدامة المالية</div>
              </div>
            </div>
          </Card>

          {/* CEO Insights */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4 text-right flex items-center justify-end">
              <span>الرؤى التنفيذية</span>
              <Lightbulb className="mr-2 h-6 w-6 text-primary" />
            </h2>
            
            <div className="space-y-4">
              {analysis.ceo_insights.map((insight: any, index: number) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-r-4 ${getSeverityColor(insight.severity)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 text-right">
                      <div className="flex items-center justify-end gap-2 mb-2">
                        {getSeverityIcon(insight.severity)}
                        <h3 className="font-semibold text-lg">{insight.title}</h3>
                      </div>
                      <p className="text-sm mb-2">{insight.impact}</p>
                      <p className="text-sm font-medium">💡 التوصية: {insight.recommendation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Roadmap */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4 text-right">خارطة الطريق التنفيذية</h2>
            <p className="text-muted-foreground mb-6 text-right">
              الجدول الزمني: {analysis.roadmap.total_timeline} | الأولوية: {analysis.roadmap.priority}
            </p>
            
            <div className="space-y-4">
              {analysis.roadmap.steps.map((step: any, index: number) => (
                <div key={index} className="p-4 bg-muted rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-sm text-muted-foreground">{step.timeline}</div>
                    <h3 className="font-semibold text-right flex-1 mr-4">{step.title}</h3>
                    <div className="text-sm font-medium text-primary">{index + 1}</div>
                  </div>
                  <div className="text-sm text-muted-foreground text-right mb-2">
                    التكلفة: {step.cost}
                  </div>
                  <div className="text-sm text-right">
                    <span className="font-medium">المخرجات: </span>
                    {step.deliverables.join(' • ')}
                  </div>
                  <div className="text-xs text-muted-foreground text-right mt-2">
                    ISO 56002: {step.iso_clause}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Investment Analysis */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4 text-right">التحليل الاستثماري</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-muted rounded-lg text-right">
                <div className="text-sm text-muted-foreground mb-1">نطاق التقييم</div>
                <div className="text-xl font-bold">{analysis.investment.valuation_range}</div>
              </div>
              <div className="p-4 bg-muted rounded-lg text-right">
                <div className="text-sm text-muted-foreground mb-1">إمكانية التمويل</div>
                <div className="text-xl font-bold">{analysis.investment.funding_potential}</div>
              </div>
              <div className="p-4 bg-muted rounded-lg text-right">
                <div className="text-sm text-muted-foreground mb-1">جاهزية المستثمر</div>
                <div className="text-xl font-bold">Grade {analysis.irl_grade}</div>
              </div>
            </div>

            <h3 className="font-semibold mb-3 text-right">المستثمرون الموصى بهم</h3>
            <div className="space-y-3">
              {analysis.investment.recommended_investors.map((investor: any, index: number) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-muted-foreground">
                      احتمالية: {(investor.probability * 100).toFixed(0)}%
                    </div>
                    <h4 className="font-semibold">{investor.type}</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm text-right">
                    <div>
                      <span className="text-muted-foreground">المبلغ: </span>
                      <span className="font-medium">{investor.amount}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">التخفيف: </span>
                      <span className="font-medium">{investor.dilution}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">المدة: </span>
                      <span className="font-medium">{investor.timeline}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Critical Path */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4 text-right">المسار الحرج للنجاح</h2>
            
            <div className="space-y-3">
              {analysis.critical_path.map((phase: any, index: number) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-r-4 ${
                    phase.status === 'current'
                      ? 'bg-primary/10 border-primary'
                      : 'bg-muted border-muted-foreground/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">{phase.duration}</div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{phase.phase}</span>
                      {phase.status === 'current' && (
                        <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                          المرحلة الحالية
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* What-If Simulator */}
          <Card className="p-6 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-right">محاكي "ماذا لو؟"</h2>
              <Button
                onClick={() => setShowWhatIf(!showWhatIf)}
                variant="outline"
              >
                {showWhatIf ? 'إخفاء' : 'عرض'} المحاكي
              </Button>
            </div>

            {showWhatIf && (
              <div className="space-y-4">
                <p className="text-muted-foreground text-right">
                  جرّب سيناريوهات مختلفة وانظر تأثيرها على ICI و IRL
                </p>

                {/* Predefined Scenarios */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={() => handleWhatIfScenario({
                      name: 'زيادة الميزانية 50%',
                      budget: '+50%'
                    })}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-end"
                    disabled={isSimulating}
                  >
                    <span className="font-semibold">زيادة الميزانية 50%</span>
                    <span className="text-sm text-muted-foreground">ماذا لو حصلت على تمويل إضافي؟</span>
                  </Button>

                  <Button
                    onClick={() => handleWhatIfScenario({
                      name: 'توظيف 3 أعضاء جدد',
                      team_size: '+3'
                    })}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-end"
                    disabled={isSimulating}
                  >
                    <span className="font-semibold">توظيف 3 أعضاء جدد</span>
                    <span className="text-sm text-muted-foreground">ماذا لو قمت بتوسيع الفريق؟</span>
                  </Button>

                  <Button
                    onClick={() => handleWhatIfScenario({
                      name: 'تحسين التحقق من الفرضيات',
                      hypothesis_validation_rate: '+0.3'
                    })}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-end"
                    disabled={isSimulating}
                  >
                    <span className="font-semibold">تحسين التحقق من الفرضيات</span>
                    <span className="text-sm text-muted-foreground">ماذا لو قمت باختبار أفضل؟</span>
                  </Button>

                  <Button
                    onClick={() => handleWhatIfScenario({
                      name: 'سيناريو شامل',
                      budget: '+50%',
                      team_size: '+2',
                      hypothesis_validation_rate: '+0.3',
                      rat_completion_rate: '+0.3'
                    })}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-end"
                    disabled={isSimulating}
                  >
                    <span className="font-semibold">سيناريو شامل</span>
                    <span className="text-sm text-muted-foreground">تحسينات متعددة</span>
                  </Button>
                </div>

                {/* Scenario Results */}
                {whatIfScenarios.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <h3 className="text-lg font-semibold text-right">نتائج المحاكاة</h3>
                    {whatIfScenarios.map((scenario, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border ${
                          scenario.impact.impact_level.includes('POSITIVE')
                            ? 'bg-green-50 border-green-200'
                            : scenario.impact.impact_level === 'NEGLIGIBLE'
                            ? 'bg-gray-50 border-gray-200'
                            : 'bg-red-50 border-red-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {scenario.impact.impact_level.includes('POSITIVE') ? (
                              <TrendingUp className="h-5 w-5 text-green-600" />
                            ) : scenario.impact.impact_level === 'NEGLIGIBLE' ? (
                              <AlertTriangle className="h-5 w-5 text-gray-600" />
                            ) : (
                              <AlertTriangle className="h-5 w-5 text-red-600" />
                            )}
                            <span className="text-sm text-muted-foreground">
                              {scenario.impact.impact_level}
                            </span>
                          </div>
                          <h4 className="font-semibold">{scenario.scenario_name}</h4>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="text-right">
                            <div className="text-muted-foreground">ICI</div>
                            <div className="font-semibold">
                              {scenario.baseline.ici_score.toFixed(1)} →{' '}
                              {scenario.modified.ici_score.toFixed(1)}
                              <span
                                className={`mr-2 ${
                                  scenario.impact.ici_improvement >= 0
                                    ? 'text-green-600'
                                    : 'text-red-600'
                                }`}
                              >
                                ({scenario.impact.ici_improvement >= 0 ? '+' : ''}
                                {scenario.impact.ici_improvement.toFixed(1)})
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-muted-foreground">IRL</div>
                            <div className="font-semibold">
                              {scenario.baseline.irl_score.toFixed(1)} →{' '}
                              {scenario.modified.irl_score.toFixed(1)}
                              <span
                                className={`mr-2 ${
                                  scenario.impact.irl_improvement >= 0
                                    ? 'text-green-600'
                                    : 'text-red-600'
                                }`}
                              >
                                ({scenario.impact.irl_improvement >= 0 ? '+' : ''}
                                {scenario.impact.irl_improvement.toFixed(1)})
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-muted-foreground">احتمالية النجاح</div>
                            <div className="font-semibold">
                              {(scenario.baseline.success_probability * 100).toFixed(1)}% →{' '}
                              {(scenario.modified.success_probability * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 p-3 bg-white rounded text-right">
                          <p className="text-sm font-medium">{scenario.impact.recommendation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {isSimulating && (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="mr-3">جارٍ محاكاة السيناريو...</span>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Feedback System */}
          <Card className="p-6 mt-6">
            <h2 className="text-2xl font-semibold mb-4 text-right">نظام الملاحظات</h2>
            <p className="text-muted-foreground text-right mb-4">
              ساعدنا في تحسين النظام من خلال مشاركة ملاحظاتك حول التوصيات
            </p>

            <div className="space-y-4">
              {/* Feedback on CEO Insights */}
              {analysis?.ceo_insights && analysis.ceo_insights.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-right">قيّم الرؤى الاستراتيجية</h3>
                  {analysis.ceo_insights.slice(0, 3).map((insight: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleFeedback({
                              type: 'ceo_insight',
                              item_id: index,
                              rating: 'helpful',
                              comment: ''
                            })}
                            className="text-green-600 hover:bg-green-50"
                          >
                            ✅ مفيدة
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleFeedback({
                              type: 'ceo_insight',
                              item_id: index,
                              rating: 'not_helpful',
                              comment: ''
                            })}
                            className="text-red-600 hover:bg-red-50"
                          >
                            ❌ غير مفيدة
                          </Button>
                        </div>
                        <p className="text-sm font-medium text-right">{insight.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Feedback on Roadmap */}
              {analysis?.roadmap && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-right">قيّم خارطة الطريق</h3>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleFeedback({
                            type: 'roadmap',
                            item_id: 0,
                            rating: 'actionable',
                            comment: ''
                          })}
                          className="text-green-600 hover:bg-green-50"
                        >
                          ✅ قابلة للتنفيذ
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleFeedback({
                            type: 'roadmap',
                            item_id: 0,
                            rating: 'not_actionable',
                            comment: ''
                          })}
                          className="text-red-600 hover:bg-red-50"
                        >
                          ❌ غير قابلة للتنفيذ
                        </Button>
                      </div>
                      <p className="text-sm font-medium text-right">خارطة الطريق العملية</p>
                    </div>
                  </div>
                </div>
              )}

              {/* General Feedback */}
              <div className="space-y-3">
                <h3 className="font-semibold text-right">ملاحظات عامة</h3>
                <Textarea
                  placeholder="شاركنا ملاحظاتك لتحسين النظام..."
                  className="text-right min-h-[100px]"
                  value={generalFeedback}
                  onChange={(e) => setGeneralFeedback(e.target.value)}
                />
                <Button
                  onClick={() => handleFeedback({
                    type: 'general',
                    item_id: 0,
                    rating: 'feedback',
                    comment: generalFeedback
                  })}
                  disabled={!generalFeedback.trim()}
                  className="w-full"
                >
                  إرسال الملاحظات
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Email Dialog */}
      {showEmailDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowEmailDialog(false)}>
          <Card className="w-full max-w-2xl mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-right">إرسال التقرير عبر البريد الإلكتروني</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowEmailDialog(false)}>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-right block mb-2">البريد الإلكتروني للمستلمين *</Label>
                  <Input
                    type="text"
                    placeholder="investor@example.com, partner@example.com"
                    className="text-right"
                    value={emailData.recipients}
                    onChange={(e) => setEmailData(prev => ({ ...prev, recipients: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground text-right mt-1">افصل عناوين البريد بفاصلة</p>
                </div>

                <div>
                  <Label className="text-right block mb-2">نسخة إلى (CC)</Label>
                  <Input
                    type="text"
                    placeholder="cc@example.com"
                    className="text-right"
                    value={emailData.cc}
                    onChange={(e) => setEmailData(prev => ({ ...prev, cc: e.target.value }))}
                  />
                </div>

                <div>
                  <Label className="text-right block mb-2">نوع التقرير</Label>
                  <div className="flex gap-4 justify-end">
                    <Button
                      variant={emailData.reportType === 'PDF' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setEmailData(prev => ({ ...prev, reportType: 'PDF' }))}
                    >
                      PDF
                    </Button>
                    <Button
                      variant={emailData.reportType === 'Excel' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setEmailData(prev => ({ ...prev, reportType: 'Excel' }))}
                    >
                      Excel
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-right block mb-2">رسالة مخصصة (اختياري)</Label>
                  <Textarea
                    placeholder="أضف رسالة شخصية للمستلمين..."
                    className="text-right min-h-[120px]"
                    value={emailData.customMessage}
                    onChange={(e) => setEmailData(prev => ({ ...prev, customMessage: e.target.value }))}
                  />
                </div>

                <div className="flex gap-3 justify-end pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowEmailDialog(false)}
                  >
                    إلغاء
                  </Button>
                  <Button
                    onClick={handleSendEmail}
                    disabled={!emailData.recipients.trim() || isExporting}
                  >
                    {isExporting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin ml-2" />
                        جارٍ الإرسال...
                      </>
                    ) : (
                      <>
                        <svg className="h-4 w-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        إرسال
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
