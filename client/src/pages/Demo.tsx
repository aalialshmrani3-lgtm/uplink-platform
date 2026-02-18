import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { 
  Lightbulb, 
  Target, 
  Store, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Play
} from "lucide-react";

export default function Demo() {
  const [, setLocation] = useLocation();

  const scenarios = [
    {
      id: 1,
      title: "مسار الابتكار الحقيقي",
      subtitle: "Innovation Path (≥70%)",
      icon: Lightbulb,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
      score: "88%",
      classification: "ابتكار حقيقي",
      description: "فكرة مبتكرة بتقييم عالٍ (≥70%) تمثل ابتكاراً حقيقياً مع إمكانات كبيرة",
      steps: [
        { icon: Lightbulb, text: "تقديم الفكرة في UPLINK 1", status: "done" },
        { icon: CheckCircle2, text: "تحليل بالذكاء الاصطناعي (88%)", status: "done" },
        { icon: AlertCircle, text: "تصنيف: ابتكار حقيقي", status: "done" },
        { icon: ArrowRight, text: "خيار 1: الذهاب لـ UPLINK 2 (مطابقة مع التحديات)", status: "option" },
        { icon: ArrowRight, text: "خيار 2: الذهاب مباشرة لـ UPLINK 3 (السوق)", status: "option" },
      ],
      demoUrl: "/uplink1/ideas/120002/analysis",
      exampleIdea: {
        title: "نظام ذكاء اصطناعي متقدم",
        description: "نظام ذكاء اصطناعي متقدم لتحليل البيانات الضخمة في الوقت الفعلي باستخدام تقنيات التعلم العميق والحوسبة الكمومية",
        scores: {
          novelty: 92,
          impact: 88,
          feasibility: 85,
          market: 87
        }
      }
    },
    {
      id: 2,
      title: "مسار الحل التجاري",
      subtitle: "Commercial Path (50-70%)",
      icon: Store,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      score: "60%",
      classification: "حل تجاري",
      description: "فكرة تجارية بتقييم متوسط (50-70%) تمثل حلاً تجارياً قابلاً للتطبيق",
      steps: [
        { icon: Store, text: "تقديم الفكرة في UPLINK 1", status: "done" },
        { icon: CheckCircle2, text: "تحليل بالذكاء الاصطناعي (60%)", status: "done" },
        { icon: AlertCircle, text: "تصنيف: حل تجاري", status: "done" },
        { icon: ArrowRight, text: "خيار 1: الذهاب لـ UPLINK 2 (مطابقة مع التحديات)", status: "option" },
        { icon: ArrowRight, text: "خيار 2: الذهاب مباشرة لـ UPLINK 3 (السوق)", status: "option" },
      ],
      demoUrl: "/uplink1/browse",
      exampleIdea: {
        title: "تطبيق توصيل طعام صحي",
        description: "تطبيق جوال لتوصيل الطعام الصحي مع نظام توصيات غذائية مخصصة",
        scores: {
          novelty: 50,
          impact: 65,
          feasibility: 80,
          market: 75
        }
      }
    },
    {
      id: 3,
      title: "مسار التطوير والإرشاد",
      subtitle: "Guidance Path (<50%)",
      icon: XCircle,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
      score: "35%",
      classification: "تحتاج تطوير",
      description: "فكرة ضعيفة بتقييم منخفض (<50%) تحتاج إلى تطوير وتحسين",
      steps: [
        { icon: XCircle, text: "تقديم الفكرة في UPLINK 1", status: "done" },
        { icon: CheckCircle2, text: "تحليل بالذكاء الاصطناعي (35%)", status: "done" },
        { icon: AlertCircle, text: "تصنيف: تحتاج تطوير", status: "done" },
        { icon: XCircle, text: "رفض مؤقت مع توصيات تفصيلية", status: "reject" },
        { icon: ArrowRight, text: "إعادة تقديم الفكرة بعد التحسين", status: "retry" },
      ],
      demoUrl: "/uplink1/browse",
      exampleIdea: {
        title: "تطبيق دردشة بسيط",
        description: "فكرة بسيطة لتطبيق دردشة عادي بدون ميزات مميزة",
        scores: {
          novelty: 15,
          impact: 25,
          feasibility: 60,
          market: 30
        }
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                🎬 عرض توضيحي - مسارات الأفكار
              </h1>
              <p className="text-slate-400">
                شرح تفصيلي لجميع السيناريوهات الممكنة في UPLINK 1, 2, 3
              </p>
            </div>
            <Button 
              onClick={() => setLocation("/uplink1")}
              variant="outline"
              className="border-slate-700 hover:bg-slate-800"
            >
              العودة إلى UPLINK 1
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Introduction */}
        <Card className="bg-slate-900/50 border-slate-800 p-8 mb-12">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">
              كيف تعمل منصة UPLINK 5.0؟
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed">
              بعد تقديم فكرتك في <strong>UPLINK 1</strong>، يقوم نظام الذكاء الاصطناعي بتحليلها وتصنيفها إلى أحد المسارات الثلاثة التالية بناءً على التقييم الشامل. كل مسار له خيارات مختلفة تساعدك على المضي قدماً بفكرتك.
            </p>
          </div>
        </Card>

        {/* Scenarios */}
        <div className="grid gap-8">
          {scenarios.map((scenario, index) => (
            <Card 
              key={scenario.id}
              className={`bg-slate-900/50 border-2 ${scenario.borderColor} overflow-hidden`}
            >
              {/* Scenario Header */}
              <div className={`${scenario.bgColor} p-6 border-b ${scenario.borderColor}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`${scenario.bgColor} p-3 rounded-lg`}>
                      <scenario.icon className={`w-8 h-8 ${scenario.color}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-white">
                          {scenario.title}
                        </h3>
                        <Badge variant="outline" className={`${scenario.color} border-current`}>
                          {scenario.subtitle}
                        </Badge>
                      </div>
                      <p className="text-slate-300 text-lg">
                        {scenario.description}
                      </p>
                    </div>
                  </div>
                  <Badge className={`${scenario.bgColor} ${scenario.color} text-lg px-4 py-2`}>
                    {scenario.score}
                  </Badge>
                </div>
              </div>

              {/* Scenario Content */}
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Steps */}
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Play className="w-5 h-5" />
                      خطوات المسار
                    </h4>
                    <div className="space-y-3">
                      {scenario.steps.map((step, stepIndex) => (
                        <div 
                          key={stepIndex}
                          className={`flex items-start gap-3 p-3 rounded-lg ${
                            step.status === 'done' ? 'bg-green-500/10 border border-green-500/20' :
                            step.status === 'option' ? 'bg-blue-500/10 border border-blue-500/20' :
                            step.status === 'reject' ? 'bg-red-500/10 border border-red-500/20' :
                            'bg-slate-800/50 border border-slate-700'
                          }`}
                        >
                          <step.icon className={`w-5 h-5 mt-0.5 ${
                            step.status === 'done' ? 'text-green-500' :
                            step.status === 'option' ? 'text-blue-500' :
                            step.status === 'reject' ? 'text-red-500' :
                            'text-slate-400'
                          }`} />
                          <span className={`text-sm ${
                            step.status === 'option' ? 'font-semibold text-white' : 'text-slate-300'
                          }`}>
                            {step.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Example Idea */}
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">
                      مثال على الفكرة
                    </h4>
                    <Card className="bg-slate-800/50 border-slate-700 p-4">
                      <h5 className="font-semibold text-white mb-2">
                        {scenario.exampleIdea.title}
                      </h5>
                      <p className="text-sm text-slate-300 mb-4">
                        {scenario.exampleIdea.description}
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(scenario.exampleIdea.scores).map(([key, value]) => (
                          <div key={key} className="bg-slate-900/50 p-2 rounded">
                            <div className="text-xs text-slate-400 mb-1">
                              {key === 'novelty' ? 'الجدة' :
                               key === 'impact' ? 'التأثير' :
                               key === 'feasibility' ? 'الجدوى' : 'السوق'}
                            </div>
                            <div className={`text-lg font-bold ${scenario.color}`}>
                              {value}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-6 pt-6 border-t border-slate-800">
                  <Button
                    onClick={() => setLocation(scenario.demoUrl)}
                    className={`w-full ${scenario.bgColor} ${scenario.color} hover:opacity-80 border ${scenario.borderColor}`}
                    size="lg"
                  >
                    <Play className="w-5 h-5 ml-2" />
                    جرب هذا السيناريو الآن
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* UPLINK 2 Flow */}
        <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/20 p-8 mt-12">
          <div className="text-center">
            <Target className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">
              مسار UPLINK 2 → UPLINK 3
            </h3>
            <p className="text-slate-300 text-lg mb-6 max-w-2xl mx-auto">
              عند اختيار <strong>UPLINK 2</strong> (مطابقة مع التحديات)، إذا وجد النظام توافقاً بين فكرتك وأحد التحديات المطروحة، سيظهر لك زر <strong>"انتقل إلى UPLINK 3"</strong> لإكمال الصفقة مباشرة في سوق الابتكارات.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <Badge variant="outline" className="bg-purple-500/10 text-purple-300 border-purple-500/30">
                UPLINK 2: مطابقة التحديات
              </Badge>
              <ArrowRight className="w-5 h-5 text-slate-400" />
              <Badge variant="outline" className="bg-blue-500/10 text-blue-300 border-blue-500/30">
                توافق مع تحدي
              </Badge>
              <ArrowRight className="w-5 h-5 text-slate-400" />
              <Badge variant="outline" className="bg-green-500/10 text-green-300 border-green-500/30">
                UPLINK 3: إكمال الصفقة
              </Badge>
            </div>
            <Button
              onClick={() => setLocation("/uplink2")}
              className="mt-6 bg-purple-600 hover:bg-purple-700"
              size="lg"
            >
              استكشف UPLINK 2
            </Button>
          </div>
        </Card>

        {/* Footer Note */}
        <div className="mt-12 text-center text-slate-400">
          <p className="text-sm">
            💡 <strong>ملاحظة:</strong> جميع السيناريوهات أعلاه تعمل بشكل فعلي في المنصة. جرّب أي سيناريو لترى كيف يعمل النظام!
          </p>
        </div>
      </div>
    </div>
  );
}
