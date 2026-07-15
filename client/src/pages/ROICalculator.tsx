import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { TrendingUp, Users, Clock, DollarSign } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ROICalculator() {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const [employees, setEmployees] = useState(100);
  const [avgSalary, setAvgSalary] = useState(50000);
  const [ideasPerYear, setIdeasPerYear] = useState(50);
  const [timePerIdea, setTimePerIdea] = useState(10);

  // Calculations
  const currentCost = (employees * avgSalary * 0.1) + (ideasPerYear * timePerIdea * 100);
  const naqlaCost = 5000 + (employees * 50); // Base + per user
  const timeSaved = ideasPerYear * timePerIdea * 0.7; // 70% time reduction
  const timeSavingValue = timeSaved * 100;
  const efficiencyGain = currentCost * 0.4; // 40% efficiency improvement
  const totalSavings = timeSavingValue + efficiencyGain;
  const netBenefit = totalSavings - naqlaCost;
  const roi = ((netBenefit / naqlaCost) * 100).toFixed(0);
  const paybackMonths = (naqlaCost / (totalSavings / 12)).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {isAr ? "حاسبة العائد على الاستثمار" : "ROI Calculator"}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {isAr ? "اكتشف كم ستوفر مؤسستك باستخدام NAQLA 5.0" : "Discover how much your organization will save using NAQLA 5.0"}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">{isAr ? "معلومات مؤسستك" : "Your Organization Info"}</h2>
            
            <div className="space-y-8">
              {/* Employees */}
              <div>
                <div className="flex justify-between mb-2">
                  <Label>{isAr ? "عدد الموظفين" : "Number of Employees"}</Label>
                  <span className="font-bold text-blue-600">{employees}</span>
                </div>
                <Slider
                  value={[employees]}
                  onValueChange={(v) => setEmployees(v[0])}
                  min={10}
                  max={10000}
                  step={10}
                  className="mb-2"
                />
                <p className="text-sm text-muted-foreground">
                  {isAr ? "عدد الموظفين المشاركين في عملية الابتكار" : "Number of employees participating in the innovation process"}
                </p>
              </div>

              {/* Average Salary */}
              <div>
                <Label className="mb-2 block">{isAr ? "متوسط الراتب السنوي ($)" : "Average Annual Salary ($)"}</Label>
                <Input
                  type="number"
                  value={avgSalary}
                  onChange={(e) => setAvgSalary(Number(e.target.value))}
                  min={10000}
                  max={500000}
                  step={5000}
                />
                <p className="text-sm text-muted-foreground mt-2">
                  {isAr ? "متوسط راتب الموظف المشارك في الابتكار" : "Average salary of employees participating in innovation"}
                </p>
              </div>

              {/* Ideas Per Year */}
              <div>
                <div className="flex justify-between mb-2">
                  <Label>{isAr ? "عدد الأفكار سنوياً" : "Ideas Per Year"}</Label>
                  <span className="font-bold text-blue-600">{ideasPerYear}</span>
                </div>
                <Slider
                  value={[ideasPerYear]}
                  onValueChange={(v) => setIdeasPerYear(v[0])}
                  min={10}
                  max={1000}
                  step={10}
                  className="mb-2"
                />
                <p className="text-sm text-muted-foreground">
                  {isAr ? "عدد الأفكار المقدمة سنوياً" : "Number of ideas submitted annually"}
                </p>
              </div>

              {/* Time Per Idea */}
              <div>
                <div className="flex justify-between mb-2">
                  <Label>{isAr ? "ساعات التقييم لكل فكرة" : "Evaluation Hours Per Idea"}</Label>
                  <span className="font-bold text-blue-600">{timePerIdea}</span>
                </div>
                <Slider
                  value={[timePerIdea]}
                  onValueChange={(v) => setTimePerIdea(v[0])}
                  min={1}
                  max={100}
                  step={1}
                  className="mb-2"
                />
                <p className="text-sm text-muted-foreground">
                  {isAr ? "الوقت المستغرق لتقييم كل فكرة يدوياً" : "Time spent manually evaluating each idea"}
                </p>
              </div>
            </div>
          </Card>

          {/* Results Section */}
          <div className="space-y-6">
            {/* ROI Highlight */}
            <Card className="p-8 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-2 border-green-500/20">
              <div className="text-center">
                <TrendingUp className="mx-auto mb-4 text-green-600" size={48} />
                <h3 className="text-2xl font-bold mb-2">{isAr ? "العائد على الاستثمار" : "Return on Investment"}</h3>
                <div className="text-6xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {roi}%
                </div>
                <p className="text-muted-foreground">
                  {isAr ? `استرداد الاستثمار في ${paybackMonths} شهر فقط` : `Investment recovery in only ${paybackMonths} months`}
                </p>
              </div>
            </Card>

            {/* Detailed Breakdown */}
            <Card className="p-8">
              <h3 className="text-2xl font-bold mb-6">{isAr ? "التفاصيل المالية" : "Financial Details"}</h3>
              
              <div className="space-y-6">
                {/* Current Cost */}
                <div className="flex items-start gap-4 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                  <DollarSign className="text-red-600 mt-1" size={24} />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold">{isAr ? "التكلفة الحالية" : "Current Cost"}</span>
                      <span className="text-xl font-bold text-red-600">
                        ${currentCost.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {isAr ? "تكلفة إدارة الابتكار بالطرق التقليدية" : "Cost of managing innovation using traditional methods"}
                    </p>
                  </div>
                </div>

                {/* NAQLA Cost */}
                <div className="flex items-start gap-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <DollarSign className="text-blue-600 mt-1" size={24} />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold">{isAr ? "تكلفة NAQLA" : "NAQLA Cost"}</span>
                      <span className="text-xl font-bold text-blue-600">
                        ${naqlaCost.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {isAr ? "الاشتراك السنوي في المنصة" : "Annual platform subscription"}
                    </p>
                  </div>
                </div>

                {/* Time Savings */}
                <div className="flex items-start gap-4 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <Clock className="text-purple-600 mt-1" size={24} />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold">{isAr ? "توفير الوقت" : "Time Savings"}</span>
                      <span className="text-xl font-bold text-purple-600">
                        {timeSaved.toLocaleString()} {isAr ? "ساعة" : "hours"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {isAr ? "قيمة:" : "Value:"} ${timeSavingValue.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Efficiency Gain */}
                <div className="flex items-start gap-4 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                  <Users className="text-green-600 mt-1" size={24} />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold">{isAr ? "تحسين الكفاءة" : "Efficiency Improvement"}</span>
                      <span className="text-xl font-bold text-green-600">
                        ${efficiencyGain.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {isAr ? "زيادة 40% في إنتاجية الفريق" : "40% increase in team productivity"}
                    </p>
                  </div>
                </div>

                {/* Total Savings */}
                <div className="pt-6 border-t-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-bold">{isAr ? "إجمالي التوفير السنوي" : "Total Annual Savings"}</span>
                    <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      ${totalSavings.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">{isAr ? "صافي الفائدة" : "Net Benefit"}</span>
                    <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      ${netBenefit.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* CTA */}
            <Card className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-2 border-blue-500/20 text-center">
              <p className="text-lg mb-4 font-semibold">
                {isAr ? "جاهز لبدء التوفير؟" : "Ready to start saving?"}
              </p>
              <button className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-lg hover:shadow-lg transition-all">
                {isAr ? "ابدأ تجربتك المجانية" : "Start Your Free Trial"}
              </button>
            </Card>
          </div>
        </div>

        {/* Additional Benefits */}
        <Card className="mt-12 p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">{isAr ? "فوائد إضافية غير قابلة للقياس" : "Additional Intangible Benefits"}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">🚀</div>
              <h3 className="font-bold mb-2">{isAr ? "تسريع الابتكار" : "Accelerate Innovation"}</h3>
              <p className="text-sm text-muted-foreground">
                {isAr ? "تقليل وقت التسويق بنسبة 50%" : "Reduce time to market by 50%"}
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="font-bold mb-2">{isAr ? "قرارات أفضل" : "Better Decisions"}</h3>
              <p className="text-sm text-muted-foreground">
                {isAr ? "تقييمات AI دقيقة وموضوعية" : "Accurate and objective AI evaluations"}
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🌟</div>
              <h3 className="font-bold mb-2">{isAr ? "رضا الموظفين" : "Employee Satisfaction"}</h3>
              <p className="text-sm text-muted-foreground">
                {isAr ? "زيادة المشاركة والتحفيز" : "Increased engagement and motivation"}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}