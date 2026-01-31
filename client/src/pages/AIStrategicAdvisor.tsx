import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, TrendingUp, AlertTriangle, CheckCircle2, Target, Lightbulb } from 'lucide-react';
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const analyzeMutation = trpc.ai.analyzeStrategic.useMutation();

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
        </div>
      )}
    </div>
  );
}
