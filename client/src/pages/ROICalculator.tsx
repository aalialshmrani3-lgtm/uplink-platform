import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { TrendingUp, Users, Clock, DollarSign } from "lucide-react";

export default function ROICalculator() {
  const [employees, setEmployees] = useState(100);
  const [avgSalary, setAvgSalary] = useState(50000);
  const [ideasPerYear, setIdeasPerYear] = useState(50);
  const [timePerIdea, setTimePerIdea] = useState(10);

  // Calculations
  const currentCost = (employees * avgSalary * 0.1) + (ideasPerYear * timePerIdea * 100);
  const uplinkCost = 5000 + (employees * 50); // Base + per user
  const timeSaved = ideasPerYear * timePerIdea * 0.7; // 70% time reduction
  const timeSavingValue = timeSaved * 100;
  const efficiencyGain = currentCost * 0.4; // 40% efficiency improvement
  const totalSavings = timeSavingValue + efficiencyGain;
  const netBenefit = totalSavings - uplinkCost;
  const roi = ((netBenefit / uplinkCost) * 100).toFixed(0);
  const paybackMonths = (uplinkCost / (totalSavings / 12)).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            حاسبة العائد على الاستثمار
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            اكتشف كم ستوفر مؤسستك باستخدام UPLINK 5.0
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">معلومات مؤسستك</h2>
            
            <div className="space-y-8">
              {/* Employees */}
              <div>
                <div className="flex justify-between mb-2">
                  <Label>عدد الموظفين</Label>
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
                  عدد الموظفين المشاركين في عملية الابتكار
                </p>
              </div>

              {/* Average Salary */}
              <div>
                <Label className="mb-2 block">متوسط الراتب السنوي ($)</Label>
                <Input
                  type="number"
                  value={avgSalary}
                  onChange={(e) => setAvgSalary(Number(e.target.value))}
                  min={10000}
                  max={500000}
                  step={5000}
                />
                <p className="text-sm text-muted-foreground mt-2">
                  متوسط راتب الموظف المشارك في الابتكار
                </p>
              </div>

              {/* Ideas Per Year */}
              <div>
                <div className="flex justify-between mb-2">
                  <Label>عدد الأفكار سنوياً</Label>
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
                  عدد الأفكار المقدمة سنوياً
                </p>
              </div>

              {/* Time Per Idea */}
              <div>
                <div className="flex justify-between mb-2">
                  <Label>ساعات التقييم لكل فكرة</Label>
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
                  الوقت المستغرق لتقييم كل فكرة يدوياً
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
                <h3 className="text-2xl font-bold mb-2">العائد على الاستثمار</h3>
                <div className="text-6xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {roi}%
                </div>
                <p className="text-muted-foreground">
                  استرداد الاستثمار في {paybackMonths} شهر فقط
                </p>
              </div>
            </Card>

            {/* Detailed Breakdown */}
            <Card className="p-8">
              <h3 className="text-2xl font-bold mb-6">التفاصيل المالية</h3>
              
              <div className="space-y-6">
                {/* Current Cost */}
                <div className="flex items-start gap-4 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                  <DollarSign className="text-red-600 mt-1" size={24} />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold">التكلفة الحالية</span>
                      <span className="text-xl font-bold text-red-600">
                        ${currentCost.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      تكلفة إدارة الابتكار بالطرق التقليدية
                    </p>
                  </div>
                </div>

                {/* UPLINK Cost */}
                <div className="flex items-start gap-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <DollarSign className="text-blue-600 mt-1" size={24} />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold">تكلفة UPLINK</span>
                      <span className="text-xl font-bold text-blue-600">
                        ${uplinkCost.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      الاشتراك السنوي في المنصة
                    </p>
                  </div>
                </div>

                {/* Time Savings */}
                <div className="flex items-start gap-4 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <Clock className="text-purple-600 mt-1" size={24} />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold">توفير الوقت</span>
                      <span className="text-xl font-bold text-purple-600">
                        {timeSaved.toLocaleString()} ساعة
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      قيمة: ${timeSavingValue.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Efficiency Gain */}
                <div className="flex items-start gap-4 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                  <Users className="text-green-600 mt-1" size={24} />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold">تحسين الكفاءة</span>
                      <span className="text-xl font-bold text-green-600">
                        ${efficiencyGain.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      زيادة 40% في إنتاجية الفريق
                    </p>
                  </div>
                </div>

                {/* Total Savings */}
                <div className="pt-6 border-t-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-bold">إجمالي التوفير السنوي</span>
                    <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      ${totalSavings.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">صافي الفائدة</span>
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
                جاهز لبدء التوفير؟
              </p>
              <button className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-lg hover:shadow-lg transition-all">
                ابدأ تجربتك المجانية
              </button>
            </Card>
          </div>
        </div>

        {/* Additional Benefits */}
        <Card className="mt-12 p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">فوائد إضافية غير قابلة للقياس</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">🚀</div>
              <h3 className="font-bold mb-2">تسريع الابتكار</h3>
              <p className="text-sm text-muted-foreground">
                تقليل وقت التسويق بنسبة 50%
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="font-bold mb-2">قرارات أفضل</h3>
              <p className="text-sm text-muted-foreground">
                تقييمات AI دقيقة وموضوعية
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🌟</div>
              <h3 className="font-bold mb-2">رضا الموظفين</h3>
              <p className="text-sm text-muted-foreground">
                زيادة المشاركة والتحفيز
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
