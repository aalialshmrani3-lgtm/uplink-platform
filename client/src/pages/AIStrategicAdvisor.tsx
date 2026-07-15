import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, TrendingUp, AlertTriangle, CheckCircle2, Target, Lightbulb, FileDown } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { useLanguage } from "@/contexts/LanguageContext"; // Rule 1

export default function AIStrategicAdvisor() {
  const { language } = useLanguage(); // Rule 2
  const isAr = language === 'ar'; // Rule 2

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

  const exportPdfMutation = trpc.ai.exportPdf.useMutation();
  const exportExcelMutation = trpc.ai.exportExcel.useMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const analyzeMutation = trpc.ai.analyzeStrategic.useMutation();
  const whatIfMutation = trpc.ai.simulateWhatIf.useMutation();

  const handleAnalyze = async () => {
    // Validation
    if (!formData.title || !formData.description || !formData.budget || !formData.team_size) {
      toast.error(isAr ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill in all required fields'); // Rule 3
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Call tRPC endpoint for strategic analysis
      const result = await analyzeMutation.mutateAsync(formData);
      
      setAnalysis(result);
      toast.success(isAr ? 'تم التحليل الاستراتيجي بنجاح' : 'Strategic analysis completed successfully'); // Rule 3
      
    } catch (apiError) {
      console.error('Analysis API error:', apiError);
      
      // Fallback to mock data if API fails
      const mockAnalysis = {
        ici_score: 59.0,
        ici_level: isAr ? 'متوسط' : 'Medium', // Rule 5
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
            title: isAr ? 'فجوة تمويلية حرجة تهدد مرحلة التوسع' : 'Critical funding gap threatens expansion phase', // Rule 5
            severity: 'CRITICAL',
            impact: isAr ? 'احتمالية الفشل: 85% | خطر نفاد السيولة: مرتفع جداً' : 'Failure probability: 85% | High risk of liquidity depletion', // Rule 5
            recommendation: isAr ? 'تأمين تمويل إضافي فوري أو تخفيض Burn Rate بنسبة 30%' : 'Secure immediate additional funding or reduce Burn Rate by 30%' // Rule 5
          },
          {
            title: isAr ? 'غياب التحقق من صحة الفرضيات السوقية' : 'Lack of market hypothesis validation', // Rule 5
            severity: 'CRITICAL',
            impact: isAr ? 'احتمالية بناء منتج لا يحتاجه السوق: 95%' : '95% probability of building a product the market doesn\'t need', // Rule 5
            recommendation: isAr ? 'إطلاق MVP وإجراء 50+ مقابلة مع عملاء محتملين خلال 4 أسابيع' : 'Launch MVP and conduct 50+ interviews with potential customers within 4 weeks' // Rule 5
          },
          {
            title: isAr ? 'ضعف في منهجية RAT (Ready-Aim-Target)' : 'Weakness in RAT (Ready-Aim-Target) methodology', // Rule 5
            severity: 'HIGH',
            impact: isAr ? 'خطر تجاوز الميزانية: 90% | احتمالية فشل التنفيذ: 85%' : '90% risk of budget overrun | 85% probability of execution failure', // Rule 5
            recommendation: isAr ? 'تطبيق Agile Sprints مع مراجعة أسبوعية للأهداف' : 'Implement Agile Sprints with weekly goal reviews' // Rule 5
          }
        ],
        
        roadmap: {
          total_timeline: '3 أشهر', // This is a duration, not a label, keep as is or translate if needed. "3 months"
          priority: 'HIGH',
          steps: [
            {
              title: isAr ? 'تحسين Financial Model وإعداد Pitch Deck احترافي' : 'Improve Financial Model and prepare a professional Pitch Deck', // Rule 5
              timeline: '2-3 أسابيع', // "2-3 weeks"
              cost: '15K-25K ريال', // "15K-25K SAR"
              deliverables: ['Financial Model', 'Pitch Deck', 'One-pager'],
              iso_clause: 'Clause 5.2 - Innovation Strategy'
            },
            {
              title: isAr ? 'استهداف برامج التسريع السعودية' : 'Target Saudi acceleration programs', // Rule 5
              timeline: '1-2 أشهر', // "1-2 months"
              cost: '5K-10K ريال', // "5K-10K SAR"
              deliverables: isAr ? ['تقديم طلبات', 'حضور Demo Days'] : ['Submit applications', 'Attend Demo Days'], // Rule 5
              iso_clause: 'Clause 7.4 - Collaboration'
            },
            {
              title: isAr ? 'تخفيض Burn Rate عبر Lean Operations' : 'Reduce Burn Rate through Lean Operations', // Rule 5
              timeline: '1 شهر', // "1 month"
              cost: '10K-15K ريال', // "10K-15K SAR"
              deliverables: isAr ? ['خطة تخفيض التكاليف', 'تحسين العمليات'] : ['Cost reduction plan', 'Process improvement'], // Rule 5
              iso_clause: 'Clause 8.3 - Innovation Process'
            }
          ]
        },
        
        investment: {
          valuation_range: '6.7M - 12.4M ريال', // "6.7M - 12.4M SAR"
          funding_potential: '1.3M - 2.5M ريال', // "1.3M - 2.5M SAR"
          recommended_investors: [
            {
              type: isAr ? 'مستثمرون ملائكة' : 'Angel Investors', // Rule 5
              probability: 0.30,
              amount: '300K ريال', // "300K SAR"
              dilution: '15.7%',
              timeline: isAr ? 'شهر واحد' : 'One month' // Rule 5
            },
            {
              type: isAr ? 'البرامج الحكومية' : 'Government Programs', // Rule 5
              probability: 0.30,
              amount: '275K ريال', // "275K SAR"
              dilution: '14.4%',
              timeline: isAr ? 'شهرين' : 'Two months' // Rule 5
            }
          ]
        },
        
        critical_path: [
          {
            phase: isAr ? 'معالجة المخاطر الحرجة' : 'Critical Risk Management', // Rule 5
            duration: '1-3 أشهر', // "1-3 months"
            status: 'current'
          },
          {
            phase: isAr ? 'بناء Product-Market Fit' : 'Build Product-Market Fit', // Rule 5
            duration: '3-6 أشهر', // "3-6 months"
            status: 'upcoming'
          },
          {
            phase: isAr ? 'تأمين التمويل' : 'Secure Funding', // Rule 5
            duration: '2-4 أشهر', // "2-4 months"
            status: 'upcoming'
          },
          {
            phase: isAr ? 'التوسع والنمو' : 'Expansion and Growth', // Rule 5
            duration: '6-12 شهر', // "6-12 months"
            status: 'upcoming'
          }
        ]
      };
      
      setAnalysis(mockAnalysis);
      toast.warning(isAr ? 'فشل الاتصال بالخادم - استخدام بيانات تجريبية' : 'Server connection failed - using mock data'); // Rule 3
    } finally {
      setIsAnalyzing(false);
    }
  };

  const feedbackMutation = trpc.ai.submitFeedback.useMutation();

  const handleExportPdf = async () => {
    if (!analysis?.analysis_id) {
      toast.error(isAr ? 'لا يوجد تحليل لتصديره' : 'No analysis to export'); // Rule 3
      return;
    }

    setIsExporting(true);
    try {
      const result = await exportPdfMutation.mutateAsync({
        analysisId: analysis.analysis_id
      });
      
      if (result.success) {
        toast.success(isAr ? 'تم تصدير التقرير إلى PDF بنجاح!' : 'Report exported to PDF successfully!'); // Rule 3
        // Download file
        window.open(result.filePath, '_blank');
      }
    } catch (error: any) {
      console.error('PDF export error:', error);
      toast.error(isAr ? 'فشل تصدير التقرير. يرجى المحاولة مرة أخرى.' : 'Failed to export report. Please try again.'); // Rule 3
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportExcel = async () => {
    if (!analysis?.analysis_id) {
      toast.error(isAr ? 'لا يوجد تحليل لتصديره' : 'No analysis to export'); // Rule 3
      return;
    }

    setIsExporting(true);
    try {
      const result = await exportExcelMutation.mutateAsync({
        analysisId: analysis.analysis_id
      });
      
      if (result.success) {
        toast.success(isAr ? 'تم تصدير التقرير إلى Excel بنجاح!' : 'Report exported to Excel successfully!'); // Rule 3
        // Download file
        window.open(result.filePath, '_blank');
      }
    } catch (error: any) {
      console.error('Excel export error:', error);
      toast.error(isAr ? 'فشل تصدير التقرير. يرجى المحاولة مرة أخرى.' : 'Failed to export report. Please try again.'); // Rule 3
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
      
      toast.success(isAr ? 'شكراً لملاحظاتك! ستساعدنا في تحسين النظام.' : 'Thank you for your feedback! It will help us improve the system.'); // Rule 3
      
      if (feedback.type === 'general') {
        setGeneralFeedback('');
      }
    } catch (error: any) {
      console.error('Feedback submission error:', error);
      toast.error(isAr ? 'فشل إرسال الملاحظات. يرجى المحاولة مرة أخرى.' : 'Failed to submit feedback. Please try again.'); // Rule 3
    }
  };

  const handleWhatIfScenario = async (modifications: any) => {
    if (!analysis) {
      toast.error(isAr ? 'يرجى تحليل المشروع أولاً' : 'Please analyze the project first'); // Rule 3
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
      toast.success(`${isAr ? 'تم محاكاة سيناريو:' : 'Scenario simulated:'} ${modifications.name}`); // Rule 3
    } catch (error: any) {
      console.error('What-If simulation error:', error);
      toast.error(isAr ? 'فشلت المحاكاة. يرجى المحاولة مرة أخرى.' : 'Simulation failed. Please try again.'); // Rule 3
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
    <div className="container mx-auto py-8 space-y-8" dir={isAr ? "rtl" : "ltr"}> {/* Rule 3 */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-right">{isAr ? "المستشار الاستراتيجي بالذكاء الاصطناعي" : "AI Strategic Advisor"}</h1> {/* Rule 3 */}
        <p className="text-muted-foreground text-right">
          {isAr ? "تحليل شامل لمشروعك مع توصيات استراتيجية قابلة للتنفيذ" : "Comprehensive analysis of your project with actionable strategic recommendations"} {/* Rule 3 */}
        </p>
      </div>

      {/* Input Form */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-6 text-right">{isAr ? "معلومات المشروع" : "Project Information"}</h2> {/* Rule 3 */}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-right block">{isAr ? "عنوان المشروع *" : "Project Title *"}</Label> {/* Rule 3 */}
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder={isAr ? "مثال: منصة ذكية لإدارة الطاقة المتجددة" : "Example: Smart platform for renewable energy management"} // Rule 4
              className="text-right"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget" className="text-right block">{isAr ? "الميزانية (ريال) *" : "Budget (SAR) *"}</Label> {/* Rule 3 */}
            <Input
              id="budget"
              name="budget"
              type="number"
              value={formData.budget}
              onChange={handleInputChange}
              placeholder={isAr ? "مثال: 500000" : "Example: 500000"} // Rule 4
              className="text-right"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="team_size" className="text-right block">{isAr ? "حجم الفريق *" : "Team Size *"}</Label> {/* Rule 3 */}
            <Input
              id="team_size"
              name="team_size"
              type="number"
              value={formData.team_size}
              onChange={handleInputChange}
              placeholder={isAr ? "مثال: 5" : "Example: 5"} // Rule 4
              className="text-right"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeline_months" className="text-right block">{isAr ? "المدة الزمنية (أشهر) *" : "Timeline (months) *"}</Label> {/* Rule 3 */}
            <Input
              id="timeline_months"
              name="timeline_months"
              type="number"
              value={formData.timeline_months}
              onChange={handleInputChange}
              placeholder={isAr ? "مثال: 12" : "Example: 12"} // Rule 4
              className="text-right"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="market_demand" className="text-right block">{isAr ? "الطلب السوقي (0-100)" : "Market Demand (0-100)"}</Label> {/* Rule 3 */}
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
            <Label htmlFor="technical_feasibility" className="text-right block">{isAr ? "الجدوى التقنية (0-100)" : "Technical Feasibility (0-100)"}</Label> {/* Rule 3 */}
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
            <Label htmlFor="description" className="text-right block">{isAr ? "وصف المشروع *" : "Project Description *"}</Label> {/* Rule 3 */}
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder={isAr ? "اشرح فكرة مشروعك بالتفصيل..." : "Explain your project idea in detail..."} // Rule 4
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
              {isAr ? "جارٍ التحليل..." : "Analyzing..."} {/* Rule 3 */}
            </>
          ) : (
            <>
              <Target className="ml-2 h-4 w-4" />
              {isAr ? "تحليل استراتيجي شامل" : "Comprehensive Strategic Analysis"} {/* Rule 3 */}
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
                <h2 className="text-2xl font-semibold">{isAr ? "مؤشر الثقة في الابتكار (ICI)" : "Innovation Confidence Index (ICI)"}</h2> {/* Rule 3 */}
                <p className="text-muted-foreground">Innovation Confidence Index</p>
              </div>
              <div className="text-left">
                <div className="text-5xl font-bold text-primary">{analysis.ici_score}</div>
                <div className="text-sm text-muted-foreground">{isAr ? "من 100" : "out of 100"}</div> {/* Rule 3 */}
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
                  {isAr ? "تصدير PDF" : "Export PDF"} {/* Rule 3 */}
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
                  {isAr ? "تصدير Excel" : "Export Excel"} {/* Rule 3 */}
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{analysis.dimensions.success_probability}</div>
                <div className="text-sm text-muted-foreground mt-1">{isAr ? "احتمالية النجاح" : "Success Probability"}</div> {/* Rule 3 */}
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{analysis.dimensions.market_fit}</div>
                <div className="text-sm text-muted-foreground mt-1">{isAr ? "ملاءمة السوق" : "Market Fit"}</div> {/* Rule 3 */}
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{analysis.dimensions.execution_readiness}</div>
                <div className="text-sm text-muted-foreground mt-1">{isAr ? "جاهزية التنفيذ" : "Execution Readiness"}</div> {/* Rule 3 */}
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{analysis.dimensions.investor_readiness}</div>
                <div className="text-sm text-muted-foreground mt-1">{isAr ? "جاهزية المستثمر" : "Investor Readiness"}</div> {/* Rule 3 */}
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{analysis.dimensions.financial_sustainability}</div>
                <div className="text-sm text-muted-foreground mt-1">{isAr ? "الاستدامة المالية" : "Financial Sustainability"}</div> {/* Rule 3 */}
              </div>
            </div>
          </Card>

          {/* CEO Insights */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4 text-right flex items-center justify-end">
              <span>{isAr ? "الرؤى التنفيذية" : "Executive Insights"}</span> {/* Rule 3 */}
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
                      <p className="text-sm font-medium">💡 {isAr ? "التوصية:" : "Recommendation:"} {insight.recommendation}</p> {/* Rule 3 */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Roadmap */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4 text-right">{isAr ? "خارطة الطريق التنفيذية" : "Executive Roadmap"}</h2> {/* Rule 3 */}
            <p className="text-muted-foreground mb-6 text-right">
              {isAr ? "الجدول الزمني:" : "Timeline:"} {analysis.roadmap.total_timeline} | {isAr ? "الأولوية:" : "Priority:"} {analysis.roadmap.priority} {/* Rule 3 */}
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
                    {isAr ? "التكلفة:" : "Cost:"} {step.cost} {/* Rule 3 */}
                  </div>
                  <div className="text-sm text-right">
                    <span className="font-medium">{isAr ? "المخرجات: " : "Deliverables: "}</span> {/* Rule 3 */}
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
            <h2 className="text-2xl font-semibold mb-4 text-right">{isAr ? "التحليل الاستثماري" : "Investment Analysis"}</h2> {/* Rule 3 */}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-muted rounded-lg text-right">
                <div className="text-sm text-muted-foreground mb-1">{isAr ? "نطاق التقييم" : "Valuation Range"}</div> {/* Rule 3 */}
                <div className="text-xl font-bold">{analysis.investment.valuation_range}</div>
              </div>
              <div className="p-4 bg-muted rounded-lg text-right">
                <div className="text-sm text-muted-foreground mb-1">{isAr ? "إمكانية التمويل" : "Funding Potential"}</div> {/* Rule 3 */}
                <div className="text-xl font-bold">{analysis.investment.funding_potential}</div>
              </div>
              <div className="p-4 bg-muted rounded-lg text-right">
                <div className="text-sm text-muted-foreground mb-1">{isAr ? "جاهزية المستثمر" : "Investor Readiness"}</div> {/* Rule 3 */}
                <div className="text-xl font-bold">Grade {analysis.irl_grade}</div>
              </div>
            </div>

            <h3 className="font-semibold mb-3 text-right">{isAr ? "المستثمرون الموصى بهم" : "Recommended Investors"}</h3> {/* Rule 3 */}
            <div className="space-y-3">
              {analysis.investment.recommended_investors.map((investor: any, index: number) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-muted-foreground">
                      {isAr ? "احتمالية:" : "Probability:"} {(investor.probability * 100).toFixed(0)}% {/* Rule 3 */}
                    </div>
                    <h4 className="font-semibold">{investor.type}</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm text-right">
                    <div>
                      <span className="text-muted-foreground">{isAr ? "المبلغ: " : "Amount: "}</span> {/* Rule 3 */}
                      <span className="font-medium">{investor.amount}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{isAr ? "التخفيف: " : "Dilution: "}</span> {/* Rule 3 */}
                      <span className="font-medium">{investor.dilution}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{isAr ? "المدة: " : "Duration: "}</span> {/* Rule 3 */}
                      <span className="font-medium">{investor.timeline}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Critical Path */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4 text-right">{isAr ? "المسار الحرج للنجاح" : "Critical Path to Success"}</h2> {/* Rule 3 */}
            
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
                          {isAr ? "المرحلة الحالية" : "Current Phase"} {/* Rule 3 */}
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
              <h2 className="text-2xl font-semibold text-right">{isAr ? `محاكي "ماذا لو؟"` : `What-If Simulator`}</h2> {/* Rule 3 */}
              <Button
                onClick={() => setShowWhatIf(!showWhatIf)}
                variant="outline"
              >
                {showWhatIf ? (isAr ? 'إخفاء' : 'Hide') : (isAr ? 'عرض' : 'Show')} {isAr ? 'المحاكي' : 'Simulator'} {/* Rule 3 */}
              </Button>
            </div>

            {showWhatIf && (
              <div className="space-y-4">
                <p className="text-muted-foreground text-right">
                  {isAr ? "جرّب سيناريوهات مختلفة وانظر تأثيرها على ICI و IRL" : "Try different scenarios and see their impact on ICI and IRL"} {/* Rule 3 */}
                </p>

                {/* Predefined Scenarios */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={() => handleWhatIfScenario({
                      name: isAr ? 'زيادة الميزانية 50%' : 'Increase Budget by 50%', // Rule 5
                      budget: '+50%'
                    })}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-end"
                    disabled={isSimulating}
                  >
                    <span className="font-semibold">{isAr ? 'زيادة الميزانية 50%' : 'Increase Budget by 50%'}</span> {/* Rule 3 */}
                    <span className="text-sm text-muted-foreground">{isAr ? 'ماذا لو حصلت على تمويل إضافي؟' : 'What if you secured additional funding?'}</span> {/* Rule 3 */}
                  </Button>

                  <Button
                    onClick={() => handleWhatIfScenario({
                      name: isAr ? 'توظيف 3 أعضاء جدد' : 'Hire 3 New Team Members', // Rule 5
                      team_size: '+3'
                    })}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-end"
                    disabled={isSimulating}
                  >
                    <span className="font-semibold">{isAr ? 'توظيف 3 أعضاء جدد' : 'Hire 3 New Team Members'}</span> {/* Rule 3 */}
                    <span className="text-sm text-muted-foreground">{isAr ? 'ماذا لو قمت بتوسيع الفريق؟' : 'What if you expanded the team?'}</span> {/* Rule 3 */}
                  </Button>

                  <Button
                    onClick={() => handleWhatIfScenario({
                      name: isAr ? 'تحسين التحقق من الفرضيات' : 'Improve Hypothesis Validation', // Rule 5
                      hypothesis_validation_rate: '+0.3'
                    })}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-end"
                    disabled={isSimulating}
                  >
                    <span className="font-semibold">{isAr ? 'تحسين التحقق من الفرضيات' : 'Improve Hypothesis Validation'}</span> {/* Rule 3 */}
                    <span className="text-sm text-muted-foreground">{isAr ? 'ماذا لو قمت باختبار أفضل؟' : 'What if you performed better testing?'}</span> {/* Rule 3 */}
                  </Button>

                  <Button
                    onClick={() => handleWhatIfScenario({
                      name: isAr ? 'سيناريو شامل' : 'Comprehensive Scenario', // Rule 5
                      budget: '+50%',
                      team_size: '+2',
                      hypothesis_validation_rate: '+0.3',
                      rat_completion_rate: '+0.3'
                    })}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-end"
                    disabled={isSimulating}
                  >
                    <span className="font-semibold">{isAr ? 'سيناريو شامل' : 'Comprehensive Scenario'}</span> {/* Rule 3 */}
                    <span className="text-sm text-muted-foreground">{isAr ? 'تحسينات متعددة' : 'Multiple Improvements'}</span> {/* Rule 3 */}
                  </Button>
                </div>

                {/* Scenario Results */}
                {whatIfScenarios.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <h3 className="text-lg font-semibold text-right">{isAr ? "نتائج المحاكاة" : "Simulation Results"}</h3> {/* Rule 3 */}
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
                            <div className="text-muted-foreground">{isAr ? "احتمالية النجاح" : "Success Probability"}</div> {/* Rule 3 */}
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
                    <span className="mr-3">{isAr ? "جارٍ محاكاة السيناريو..." : "Simulating scenario..."}</span> {/* Rule 3 */}
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Feedback System */}
          <Card className="p-6 mt-6">
            <h2 className="text-2xl font-semibold mb-4 text-right">{isAr ? "نظام الملاحظات" : "Feedback System"}</h2> {/* Rule 3 */}
            <p className="text-muted-foreground text-right mb-4">
              {isAr ? "ساعدنا في تحسين النظام من خلال مشاركة ملاحظاتك حول التوصيات" : "Help us improve the system by sharing your feedback on the recommendations"} {/* Rule 3 */}
            </p>

            <div className="space-y-4">
              {/* Feedback on CEO Insights */}
              {analysis?.ceo_insights && analysis.ceo_insights.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-right">{isAr ? "قيّم الرؤى الاستراتيجية" : "Rate Strategic Insights"}</h3> {/* Rule 3 */}
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
                            {isAr ? "✅ مفيدة" : "✅ Helpful"} {/* Rule 3 */}
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
                            {isAr ? "❌ غير مفيدة" : "❌ Not Helpful"} {/* Rule 3 */}
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
                  <h3 className="font-semibold text-right">{isAr ? "قيّم خارطة الطريق" : "Rate Roadmap"}</h3> {/* Rule 3 */}
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
                          {isAr ? "✅ قابلة للتنفيذ" : "✅ Actionable"} {/* Rule 3 */}
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
                          {isAr ? "❌ غير قابلة للتنفيذ" : "❌ Not Actionable"} {/* Rule 3 */}
                        </Button>
                      </div>
                      <p className="text-sm font-medium text-right">{isAr ? "خارطة الطريق العملية" : "Actionable Roadmap"}</p> {/* Rule 3 */}
                    </div>
                  </div>
                </div>
              )}

              {/* General Feedback */}
              <div className="space-y-3">
                <h3 className="font-semibold text-right">{isAr ? "ملاحظات عامة" : "General Feedback"}</h3> {/* Rule 3 */}
                <Textarea
                  placeholder={isAr ? "شاركنا ملاحظاتك لتحسين النظام..." : "Share your feedback to improve the system..."} // Rule 4
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
                  {isAr ? "إرسال الملاحظات" : "Submit Feedback"} {/* Rule 3 */}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}