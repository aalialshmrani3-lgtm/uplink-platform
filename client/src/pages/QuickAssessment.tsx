import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, TrendingUp, Lightbulb, Users, Cog, DollarSign } from "lucide-react";

// 15 أسئلة (3 لكل بُعد من أبعاد الابتكار الخمسة)
const questions = [
  // الثقافة (Culture)
  {
    id: 1,
    dimension: "culture",
    icon: Lightbulb,
    question: "هل تشجع مؤسستك الموظفين على تقديم أفكار جديدة والتجريب؟",
    options: [
      { value: 1, label: "نادراً" },
      { value: 2, label: "أحياناً" },
      { value: 3, label: "غالباً" },
      { value: 4, label: "دائماً" },
    ],
  },
  {
    id: 2,
    dimension: "culture",
    icon: Lightbulb,
    question: "هل يُسمح للموظفين بالمخاطرة المحسوبة دون خوف من العقاب عند الفشل؟",
    options: [
      { value: 1, label: "لا، العقاب شديد" },
      { value: 2, label: "نادراً" },
      { value: 3, label: "غالباً" },
      { value: 4, label: "نعم، الفشل جزء من التعلم" },
    ],
  },
  {
    id: 3,
    dimension: "culture",
    icon: Lightbulb,
    question: "هل تحتفل مؤسستك بالنجاحات الابتكارية وتشارك قصص النجاح؟",
    options: [
      { value: 1, label: "أبداً" },
      { value: 2, label: "نادراً" },
      { value: 3, label: "أحياناً" },
      { value: 4, label: "دائماً" },
    ],
  },

  // القيادة (Leadership)
  {
    id: 4,
    dimension: "leadership",
    icon: Users,
    question: "هل تدعم القيادة العليا مبادرات الابتكار بالموارد والقرارات؟",
    options: [
      { value: 1, label: "لا دعم" },
      { value: 2, label: "دعم محدود" },
      { value: 3, label: "دعم جيد" },
      { value: 4, label: "دعم كامل" },
    ],
  },
  {
    id: 5,
    dimension: "leadership",
    icon: Users,
    question: "هل يشارك القادة بأنفسهم في عمليات الابتكار والتطوير؟",
    options: [
      { value: 1, label: "أبداً" },
      { value: 2, label: "نادراً" },
      { value: 3, label: "أحياناً" },
      { value: 4, label: "دائماً" },
    ],
  },
  {
    id: 6,
    dimension: "leadership",
    icon: Users,
    question: "هل توجد رؤية واضحة للابتكار من القيادة؟",
    options: [
      { value: 1, label: "لا توجد رؤية" },
      { value: 2, label: "رؤية غامضة" },
      { value: 3, label: "رؤية واضحة" },
      { value: 4, label: "رؤية واضحة ومُعلنة" },
    ],
  },

  // الكفاءات (Competencies)
  {
    id: 7,
    dimension: "competencies",
    icon: TrendingUp,
    question: "هل يمتلك الفريق مهارات Design Thinking وحل المشكلات الإبداعي؟",
    options: [
      { value: 1, label: "لا يمتلك" },
      { value: 2, label: "بعض الأفراد" },
      { value: 3, label: "معظم الفريق" },
      { value: 4, label: "الفريق بالكامل" },
    ],
  },
  {
    id: 8,
    dimension: "competencies",
    icon: TrendingUp,
    question: "هل يتلقى الموظفون تدريباً منتظماً على الابتكار والتقنيات الحديثة؟",
    options: [
      { value: 1, label: "لا تدريب" },
      { value: 2, label: "تدريب نادر" },
      { value: 3, label: "تدريب سنوي" },
      { value: 4, label: "تدريب مستمر" },
    ],
  },
  {
    id: 9,
    dimension: "competencies",
    icon: TrendingUp,
    question: "هل يوجد فريق متخصص في إدارة الابتكار والملكية الفكرية؟",
    options: [
      { value: 1, label: "لا يوجد" },
      { value: 2, label: "فرد واحد" },
      { value: 3, label: "فريق صغير" },
      { value: 4, label: "فريق متخصص كامل" },
    ],
  },

  // الهيكل (Structure)
  {
    id: 10,
    dimension: "structure",
    icon: Cog,
    question: "هل الهيكل التنظيمي مرن ويسمح بالتعاون بين الأقسام؟",
    options: [
      { value: 1, label: "هيكل صارم جداً" },
      { value: 2, label: "مرونة محدودة" },
      { value: 3, label: "مرونة جيدة" },
      { value: 4, label: "مرونة كاملة" },
    ],
  },
  {
    id: 11,
    dimension: "structure",
    icon: Cog,
    question: "هل توجد قنوات واضحة لتقديم الأفكار ومتابعتها؟",
    options: [
      { value: 1, label: "لا توجد" },
      { value: 2, label: "قنوات غير واضحة" },
      { value: 3, label: "قنوات واضحة" },
      { value: 4, label: "نظام رقمي متكامل" },
    ],
  },
  {
    id: 12,
    dimension: "structure",
    icon: Cog,
    question: "هل تُتخذ القرارات بسرعة أم تتطلب موافقات متعددة؟",
    options: [
      { value: 1, label: "بطيئة جداً" },
      { value: 2, label: "بطيئة" },
      { value: 3, label: "معتدلة" },
      { value: 4, label: "سريعة ومرنة" },
    ],
  },

  // الموارد (Resources)
  {
    id: 13,
    dimension: "resources",
    icon: DollarSign,
    question: "هل هناك ميزانية مخصصة للابتكار والبحث والتطوير؟",
    options: [
      { value: 1, label: "لا توجد ميزانية" },
      { value: 2, label: "ميزانية محدودة جداً" },
      { value: 3, label: "ميزانية معقولة" },
      { value: 4, label: "ميزانية كافية ومستدامة" },
    ],
  },
  {
    id: 14,
    dimension: "resources",
    icon: DollarSign,
    question: "هل تتوفر أدوات وتقنيات حديثة لدعم الابتكار؟",
    options: [
      { value: 1, label: "لا تتوفر" },
      { value: 2, label: "أدوات قديمة" },
      { value: 3, label: "أدوات جيدة" },
      { value: 4, label: "أحدث التقنيات" },
    ],
  },
  {
    id: 15,
    dimension: "resources",
    icon: DollarSign,
    question: "هل يُمنح الموظفون وقتاً مخصصاً للعمل على مشاريع ابتكارية؟",
    options: [
      { value: 1, label: "لا وقت" },
      { value: 2, label: "وقت محدود جداً" },
      { value: 3, label: "بعض الوقت" },
      { value: 4, label: "وقت مخصص (مثل 20%)" },
    ],
  },
];

const dimensionLabels = {
  culture: "الثقافة",
  leadership: "القيادة",
  competencies: "الكفاءات",
  structure: "الهيكل",
  resources: "الموارد",
};

export default function QuickAssessment() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleAnswer = (value: number) => {
    setAnswers({ ...answers, [currentQuestion.id]: value });
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // حساب النتائج
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // حساب النتائج
  const calculateResults = () => {
    const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);
    const maxScore = questions.length * 4; // 15 سؤال × 4 نقاط
    const percentage = Math.round((totalScore / maxScore) * 100);

    // حساب درجات كل بُعد
    const dimensionScores: Record<string, number> = {};
    questions.forEach((q) => {
      if (!dimensionScores[q.dimension]) {
        dimensionScores[q.dimension] = 0;
      }
      dimensionScores[q.dimension] += answers[q.id] || 0;
    });

    // تحويل إلى نسب مئوية
    const dimensionPercentages: Record<string, number> = {};
    Object.keys(dimensionScores).forEach((dim) => {
      dimensionPercentages[dim] = Math.round((dimensionScores[dim] / 12) * 100); // 3 أسئلة × 4 نقاط = 12
    });

    // التصنيف
    let classification = "";
    let classificationColor = "";
    if (percentage >= 75) {
      classification = "متقدم (Advanced)";
      classificationColor = "text-green-600";
    } else if (percentage >= 50) {
      classification = "متوسط (Intermediate)";
      classificationColor = "text-yellow-600";
    } else {
      classification = "مبتدئ (Beginner)";
      classificationColor = "text-red-600";
    }

    // أضعف 3 أبعاد (للتوصيات)
    const weakestDimensions = Object.entries(dimensionPercentages)
      .sort((a, b) => a[1] - b[1])
      .slice(0, 3)
      .map((entry) => entry[0]);

    return {
      percentage,
      classification,
      classificationColor,
      dimensionPercentages,
      weakestDimensions,
    };
  };

  const results = showResults ? calculateResults() : null;

  // التوصيات بناءً على أضعف الأبعاد
  const getRecommendations = (weakestDimensions: string[]) => {
    const recommendations: Record<string, string> = {
      culture: "ابدأ بورش عمل لبناء ثقافة الابتكار وتشجيع التجريب",
      leadership: "قم بتدريب القيادة على دعم الابتكار وتخصيص موارد له",
      competencies: "استثمر في تدريب الفريق على Design Thinking والتقنيات الحديثة",
      structure: "أعد هيكلة العمليات لتسريع اتخاذ القرارات وتسهيل التعاون",
      resources: "خصص ميزانية ووقت مخصص للابتكار والبحث والتطوير",
    };

    return weakestDimensions.map((dim) => recommendations[dim]);
  };

  if (showResults && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-primary/20 shadow-2xl">
            <CardHeader className="text-center bg-gradient-to-r from-primary/10 to-primary/5">
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="h-16 w-16 text-green-600" />
              </div>
              <CardTitle className="text-3xl">نتائج التقييم السريع</CardTitle>
              <CardDescription>تحليل فوري لقدرات الابتكار في مؤسستك</CardDescription>
            </CardHeader>

            <CardContent className="space-y-8 pt-8">
              {/* الدرجة الإجمالية */}
              <div className="text-center">
                <div className="text-6xl font-bold text-primary mb-2">{results.percentage}%</div>
                <div className={`text-2xl font-semibold ${results.classificationColor}`}>
                  {results.classification}
                </div>
              </div>

              {/* درجات الأبعاد */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">درجات الأبعاد الخمسة:</h3>
                {Object.entries(results.dimensionPercentages).map(([dim, score]) => (
                  <div key={dim} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{dimensionLabels[dim as keyof typeof dimensionLabels]}</span>
                      <span className="text-muted-foreground">{score}%</span>
                    </div>
                    <Progress value={score} className="h-2" />
                  </div>
                ))}
              </div>

              {/* التوصيات */}
              <div className="space-y-4 bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-xl font-semibold text-blue-900">توصيات فورية:</h3>
                <ul className="space-y-2">
                  {getRecommendations(results.weakestDimensions).map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span className="text-blue-800">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-8 rounded-lg text-center space-y-4">
                <h3 className="text-2xl font-bold">هل تريد تقييماً شاملاً؟</h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  سجّل في UPLINK للحصول على تقييم كامل (60 سؤال) مع تقرير مفصل ومقارنة معيارية مع الشركات السعودية
                </p>
                <div className="flex gap-4 justify-center">
                  <Button size="lg" onClick={() => setLocation("/register")}>
                    سجّل الآن في UPLINK
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => window.location.reload()}>
                    إعادة التقييم
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Card className="border-2 border-primary/20 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              {currentQuestion && <currentQuestion.icon className="h-8 w-8 text-primary" />}
              <div>
                <CardTitle>التقييم السريع لقدرات الابتكار</CardTitle>
                <CardDescription>
                  السؤال {currentStep + 1} من {questions.length} - {dimensionLabels[currentQuestion?.dimension as keyof typeof dimensionLabels]}
                </CardDescription>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="min-h-[200px]">
              <h3 className="text-xl font-semibold mb-6">{currentQuestion?.question}</h3>

              <RadioGroup
                value={answers[currentQuestion?.id]?.toString()}
                onValueChange={(val) => handleAnswer(parseInt(val))}
              >
                <div className="space-y-3">
                  {currentQuestion?.options.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-2 space-x-reverse p-4 rounded-lg border-2 hover:border-primary/50 transition-colors cursor-pointer"
                    >
                      <RadioGroupItem value={option.value.toString()} id={`option-${option.value}`} />
                      <Label htmlFor={`option-${option.value}`} className="flex-1 cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            <div className="flex justify-between pt-6 border-t">
              <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
                السابق
              </Button>
              <Button
                onClick={handleNext}
                disabled={!answers[currentQuestion?.id]}
                className="min-w-[120px]"
              >
                {currentStep === questions.length - 1 ? "عرض النتائج" : "التالي"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
