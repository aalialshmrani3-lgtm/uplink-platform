import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, TrendingUp, Lightbulb, Users, Cog, DollarSign } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// 15 أسئلة (3 لكل بُعد من أبعاد الابتكار الخمسة)
const questions = [
  // الثقافة (Culture)
  {
    id: 1,
    dimension: "culture",
    icon: Lightbulb,
    question: "Does your organization encourage employees to submit new ideas and experiment?",
    options: [
      { value: 1, label: "Rarely" },
      { value: 2, label: "Sometimes" },
      { value: 3, label: "Often" },
      { value: 4, label: "Always" },
    ],
  },
  {
    id: 2,
    dimension: "culture",
    icon: Lightbulb,
    question: "Are employees allowed to take calculated risks without fear of punishment for failure?",
    options: [
      { value: 1, label: "No, punishment is severe" },
      { value: 2, label: "Rarely" },
      { value: 3, label: "Often" },
      { value: 4, label: "Yes, failure is part of learning" },
    ],
  },
  {
    id: 3,
    dimension: "culture",
    icon: Lightbulb,
    question: "Does your organization celebrate innovative successes and share success stories?",
    options: [
      { value: 1, label: "Never" },
      { value: 2, label: "Rarely" },
      { value: 3, label: "Sometimes" },
      { value: 4, label: "Always" },
    ],
  },

  // القيادة (Leadership)
  {
    id: 4,
    dimension: "leadership",
    icon: Users,
    question: "Does senior leadership support innovation initiatives with resources and decisions?",
    options: [
      { value: 1, label: "No support" },
      { value: 2, label: "Limited support" },
      { value: 3, label: "Good support" },
      { value: 4, label: "Full support" },
    ],
  },
  {
    id: 5,
    dimension: "leadership",
    icon: Users,
    question: "Do leaders themselves participate in innovation and development processes?",
    options: [
      { value: 1, label: "Never" },
      { value: 2, label: "Rarely" },
      { value: 3, label: "Sometimes" },
      { value: 4, label: "Always" },
    ],
  },
  {
    id: 6,
    dimension: "leadership",
    icon: Users,
    question: "Is there a clear vision for innovation from leadership?",
    options: [
      { value: 1, label: "No vision" },
      { value: 2, label: "Vague vision" },
      { value: 3, label: "Clear vision" },
      { value: 4, label: "Clear and communicated vision" },
    ],
  },

  // الكفاءات (Competencies)
  {
    id: 7,
    dimension: "competencies",
    icon: TrendingUp,
    question: "Does the team possess Design Thinking and creative problem-solving skills?",
    options: [
      { value: 1, label: "No" },
      { value: 2, label: "Some individuals" },
      { value: 3, label: "Most of the team" },
      { value: 4, label: "Entire team" },
    ],
  },
  {
    id: 8,
    dimension: "competencies",
    icon: TrendingUp,
    question: "Do employees receive regular training on innovation and modern technologies?",
    options: [
      { value: 1, label: "No training" },
      { value: 2, label: "Rare training" },
      { value: 3, label: "Annual training" },
      { value: 4, label: "Continuous Training" },
    ],
  },
  {
    id: 9,
    dimension: "competencies",
    icon: TrendingUp,
    question: "Is there a dedicated team for innovation and IP management?",
    options: [
      { value: 1, label: "None" },
      { value: 2, label: "One individual" },
      { value: 3, label: "Small team" },
      { value: 4, label: "Full specialized team" },
    ],
  },

  // الهيكل (Structure)
  {
    id: 10,
    dimension: "structure",
    icon: Cog,
    question: "Is the organizational structure flexible and allows cross-departmental collaboration?",
    options: [
      { value: 1, label: "Very rigid structure" },
      { value: 2, label: "Limited flexibility" },
      { value: 3, label: "Good flexibility" },
      { value: 4, label: "Full flexibility" },
    ],
  },
  {
    id: 11,
    dimension: "structure",
    icon: Cog,
    question: "Are there clear channels for submitting and tracking ideas?",
    options: [
      { value: 1, label: "None" },
      { value: 2, label: "Unclear channels" },
      { value: 3, label: "Clear channels" },
      { value: 4, label: "Integrated digital system" },
    ],
  },
  {
    id: 12,
    dimension: "structure",
    icon: Cog,
    question: "Are decisions made quickly or do they require multiple approvals?",
    options: [
      { value: 1, label: "Very slow" },
      { value: 2, label: "Slow" },
      { value: 3, label: "Moderate" },
      { value: 4, label: "Fast and flexible" },
    ],
  },

  // الموارد (Resources)
  {
    id: 13,
    dimension: "resources",
    icon: DollarSign,
    question: "Is there a dedicated budget for innovation, research, and development?",
    options: [
      { value: 1, label: "No budget" },
      { value: 2, label: "Very limited budget" },
      { value: 3, label: "Reasonable budget" },
      { value: 4, label: "Sufficient and sustainable budget" },
    ],
  },
  {
    id: 14,
    dimension: "resources",
    icon: DollarSign,
    question: "Are modern tools and technologies available to support innovation?",
    options: [
      { value: 1, label: "Not available" },
      { value: 2, label: "Outdated tools" },
      { value: 3, label: "Good tools" },
      { value: 4, label: "Latest Technologies" },
    ],
  },
  {
    id: 15,
    dimension: "resources",
    icon: DollarSign,
    question: "Do employees get dedicated time for innovation projects?",
    options: [
      { value: 1, label: "No time" },
      { value: 2, label: "Very limited time" },
      { value: 3, label: "Some time" },
      { value: 4, label: "Dedicated time (e.g., 20%)" },
    ],
  },
];

const dimensionLabels = {
  culture: "Culture",
  leadership: "Leadership",
  competencies: "Capabilities",
  structure: "Structure",
  resources: "Resources",
};

export default function QuickAssessment() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
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
      classification = isAr ? "متقدم (Advanced)" : "Advanced";
      classificationColor = "text-green-600";
    } else if (percentage >= 50) {
      classification = isAr ? "متوسط (Intermediate)" : "Intermediate";
      classificationColor = "text-yellow-600";
    } else {
      classification = isAr ? "مبتدئ (Beginner)" : "Beginner";
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
      culture: "Start workshops to build an innovation culture and encourage experimentation",
      leadership: "Train leadership to support innovation and allocate resources",
      competencies: "Invest in team training on Design Thinking and modern technologies",
      structure: "Restructure processes to accelerate decision-making and facilitate collaboration",
      resources: "Allocate budget and dedicated time for innovation, R&D",
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
              <CardTitle className="text-3xl">{isAr ? isAr ? "نتائج التقييم السريع" : "Quick Assessment Results" : "Quick Evaluation Results"}</CardTitle>
              <CardDescription>{isAr ? isAr ? "تحليل فوري لقدرات الابتكار في مؤسستك" : "Instant analysis of your organization's innovation capabilities" : "Instant analysis of your organization's innovation capabilities"}</CardDescription>
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
                <h3 className="text-xl font-semibold">{isAr ? isAr ? "درجات الأبعاد الخمسة:" : "Five Dimensions Scores:" : "Five Dimensions Scores:"}</h3>
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
                <h3 className="text-xl font-semibold text-blue-900">{isAr ? isAr ? "توصيات فورية:" : "Instant Recommendations:" : "Instant Recommendations:"}</h3>
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
                <h3 className="text-2xl font-bold">{isAr ? isAr ? "هل تريد تقييماً شاملاً؟" : "Want a comprehensive assessment?" : "Want a comprehensive assessment?"}</h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  سجّل في NAQLA للحصول على تقييم كامل (60 سؤال) مع تقرير مفصل ومقارنة معيارية مع الشركات السعودية
                </p>
                <div className="flex gap-4 justify-center">
                  <Button size="lg" onClick={() => setLocation("/register")}>
                    سجّل الآن في NAQLA
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
                <CardTitle>{isAr ? "التقييم السريع لقدرات الابتكار" : "Quick Innovation Capability Assessment"}</CardTitle>
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
                {currentStep === questions.length - 1 ? isAr ? "عرض النتائج" : "View Results" : "Next"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
