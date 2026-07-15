import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Lightbulb, 
  Target, 
  Store, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Play,
  Clock,
  TrendingUp,
  Award
} from "lucide-react";

export default function Demo() {
  const [, setLocation] = useLocation();
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const scenarios = [
    {
      id: 1,
      title: isAr ? "مسار الابتكار الحقيقي" : "True Innovation Path",
      subtitle: "Innovation Path (≥70%)",
      icon: Lightbulb,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
      score: "88%",
      classification: isAr ? "ابتكار حقيقي" : "True Innovation",
      description: isAr ? "فكرة مبتكرة بتقييم عالٍ (≥70%) تمثل ابتكاراً حقيقياً مع إمكانات كبيرة" : "Innovative idea with high rating (≥70%) representing true innovation with great potential",
      steps: [
        { icon: Lightbulb, text: isAr ? "تقديم الفكرة في NAQLA 1" : "Submit idea in NAQLA 1", status: "done" },
        { icon: CheckCircle2, text: isAr ? "تحليل بالذكاء الاصطناعي (88%)" : "AI Analysis (88%)", status: "done" },
        { icon: AlertCircle, text: isAr ? "تصنيف: ابتكار حقيقي" : "Classification: True Innovation", status: "done" },
        { icon: ArrowRight, text: isAr ? "خيار 1: الذهاب لـ NAQLA 2 (مطابقة مع التحديات)" : "Option 1: Go to NAQLA 2 (Challenge Matching)", status: "option" },
        { icon: ArrowRight, text: isAr ? "خيار 2: الذهاب مباشرة لـ NAQLA 3 (السوق)" : "Option 2: Go directly to NAQLA 3 (Marketplace)", status: "option" },
      ],
      demoUrl: "/uplink1/ideas/120002/analysis",
      exampleIdea: {
        title: isAr ? "نظام ذكاء اصطناعي متقدم" : "Advanced AI System",
        description: isAr ? "نظام ذكاء اصطناعي متقدم لتحليل البيانات الضخمة في الوقت الفعلي باستخدام تقنيات التعلم العميق والحوسبة الكمومية" : "Advanced AI system for real-time big data analysis using deep learning and quantum computing technologies",
        scores: {
          novelty: 92,
          impact: 88,
          feasibility: 85,
          market: 87
        }
      },
      comparisonData: {
        time: isAr ? "2-4 أسابيع" : "2-4 weeks",
        steps: isAr ? "5 خطوات" : "5 steps",
        successRate: "85%"
      }
    },
    {
      id: 2,
      title: isAr ? "مسار الحل التجاري" : "Commercial Solution Path",
      subtitle: "Commercial Path (50-70%)",
      icon: Store,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      score: "60%",
      classification: isAr ? "حل تجاري" : "Commercial Solution",
      description: isAr ? "فكرة تجارية بتقييم متوسط (50-70%) تمثل حلاً تجارياً قابلاً للتطبيق" : "Commercial idea with medium rating (50-70%) representing a viable commercial solution",
      steps: [
        { icon: Store, text: isAr ? "تقديم الفكرة في NAQLA 1" : "Submit idea in NAQLA 1", status: "done" },
        { icon: CheckCircle2, text: isAr ? "تحليل بالذكاء الاصطناعي (60%)" : "AI Analysis (60%)", status: "done" },
        { icon: AlertCircle, text: isAr ? "تصنيف: حل تجاري" : "Classification: Commercial Solution", status: "done" },
        { icon: ArrowRight, text: isAr ? "خيار 1: الذهاب لـ NAQLA 2 (مطابقة مع التحديات)" : "Option 1: Go to NAQLA 2 (Challenge Matching)", status: "option" },
        { icon: ArrowRight, text: isAr ? "خيار 2: الذهاب مباشرة لـ NAQLA 3 (السوق)" : "Option 2: Go directly to NAQLA 3 (Marketplace)", status: "option" },
      ],
      demoUrl: "/naqla1/browse",
      exampleIdea: {
        title: isAr ? "تطبيق توصيل طعام صحي" : "Healthy Food Delivery App",
        description: isAr ? "تطبيق جوال لتوصيل الطعام الصحي مع نظام توصيات غذائية مخصصة" : "Mobile app for healthy food delivery with personalized dietary recommendations",
        scores: {
          novelty: 50,
          impact: 65,
          feasibility: 80,
          market: 75
        }
      },
      comparisonData: {
        time: isAr ? "1-2 أسابيع" : "1-2 weeks",
        steps: isAr ? "4 خطوات" : "4 steps",
        successRate: "70%"
      }
    },
    {
      id: 3,
      title: isAr ? "مسار التطوير والإرشاد" : "Development & Guidance Path",
      subtitle: "Guidance Path (<50%)",
      icon: XCircle,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
      score: "35%",
      classification: isAr ? "تحتاج تطوير" : "Needs Development",
      description: isAr ? "فكرة ضعيفة بتقييم منخفض (<50%) تحتاج إلى تطوير وتحسين" : "Weak idea with low rating (<50%) that needs development and improvement",
      steps: [
        { icon: XCircle, text: isAr ? "تقديم الفكرة في NAQLA 1" : "Submit idea in NAQLA 1", status: "done" },
        { icon: CheckCircle2, text: isAr ? "تحليل بالذكاء الاصطناعي (35%)" : "AI Analysis (35%)", status: "done" },
        { icon: AlertCircle, text: isAr ? "تصنيف: تحتاج تطوير" : "Classification: Needs Development", status: "done" },
        { icon: XCircle, text: isAr ? "رفض مؤقت مع توصيات تفصيلية" : "Temporary rejection with detailed recommendations", status: "reject" },
        { icon: ArrowRight, text: isAr ? "إعادة تقديم الفكرة بعد التحسين" : "Resubmit idea after improvement", status: "retry" },
      ],
      demoUrl: "/naqla1/browse",
      exampleIdea: {
        title: isAr ? "تطبيق دردشة بسيط" : "Simple Chat App",
        description: isAr ? "فكرة بسيطة لتطبيق دردشة عادي بدون ميزات مميزة" : "Simple idea for a regular chat app without distinctive features",
        scores: {
          novelty: 15,
          impact: 25,
          feasibility: 60,
          market: 30
        }
      },
      comparisonData: {
        time: isAr ? "فوري" : "Immediate",
        steps: isAr ? "3 خطوات" : "3 steps",
        successRate: "40%"
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
                {isAr ? "🎬 عرض توضيحي - مسارات الأفكار" : "🎬 Demo - Idea Paths"}
              </h1>
              <p className="text-slate-400">
                {isAr ? "شرح تفصيلي لجميع السيناريوهات الممكنة في NAQLA 1, 2, 3" : "Detailed explanation of all possible scenarios in NAQLA 1, 2, 3"}
              </p>
            </div>
            <Button 
              onClick={() => setLocation("/naqla1")}
              variant="outline"
              className="border-slate-700 hover:bg-slate-800"
            >
              {isAr ? "العودة إلى NAQLA 1" : "Return to NAQLA 1"}
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
              {isAr ? "كيف تعمل منصة NAQLA 5.0؟" : "How does NAQLA 5.0 platform work?"}
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed">
              {isAr ? (
                <>بعد تقديم فكرتك في <strong>NAQLA 1</strong>، يقوم نظام الذكاء الاصطناعي بتحليلها وتصنيفها إلى أحد المسارات الثلاثة التالية بناءً على التقييم الشامل. كل مسار له خيارات مختلفة تساعدك على المضي قدماً بفكرتك.</>
              ) : (
                <>After submitting your idea in <strong>NAQLA 1</strong>, the AI system analyzes and classifies it into one of the following three paths based on comprehensive evaluation. Each path has different options to help you move forward with your idea.</>
              )}
            </p>
          </div>
        </Card>

        {/* Visual Comparison Table */}
        <Card className="bg-slate-900/50 border-slate-800 p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            {isAr ? "📊 مقارنة بصرية للمسارات الثلاثة" : "📊 Visual Comparison of the Three Paths"}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-right p-4 text-slate-400 font-semibold">{isAr ? "المعيار" : "Criteria"}</th>
                  <th className="text-center p-4">
                    <div className="flex flex-col items-center gap-2">
                      <Lightbulb className="w-6 h-6 text-green-500" />
                      <span className="text-white font-semibold">{isAr ? "ابتكار" : "Innovation"}</span>
                      <Badge className="bg-green-500/10 text-green-500">≥70%</Badge>
                    </div>
                  </th>
                  <th className="text-center p-4">
                    <div className="flex flex-col items-center gap-2">
                      <Store className="w-6 h-6 text-blue-500" />
                      <span className="text-white font-semibold">{isAr ? "تجاري" : "Commercial"}</span>
                      <Badge className="bg-blue-500/10 text-blue-500">50-70%</Badge>
                    </div>
                  </th>
                  <th className="text-center p-4">
                    <div className="flex flex-col items-center gap-2">
                      <XCircle className="w-6 h-6 text-red-500" />
                      <span className="text-white font-semibold">{isAr ? "ضعيف" : "Weak"}</span>
                      <Badge className="bg-red-500/10 text-red-500">&lt;50%</Badge>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-800">
                  <td className="p-4 text-slate-300 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {isAr ? "الوقت المتوقع" : "Expected Time"}
                  </td>
                  <td className="text-center p-4 text-white font-semibold">{isAr ? "2-4 أسابيع" : "2-4 weeks"}</td>
                  <td className="text-center p-4 text-white font-semibold">{isAr ? "1-2 أسابيع" : "1-2 weeks"}</td>
                  <td className="text-center p-4 text-white font-semibold">{isAr ? "فوري" : "Immediate"}</td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="p-4 text-slate-300 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    {isAr ? "عدد الخطوات" : "Number of Steps"}
                  </td>
                  <td className="text-center p-4 text-white font-semibold">{isAr ? "5 خطوات" : "5 steps"}</td>
                  <td className="text-center p-4 text-white font-semibold">{isAr ? "4 خطوات" : "4 steps"}</td>
                  <td className="text-center p-4 text-white font-semibold">{isAr ? "3 خطوات" : "3 steps"}</td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="p-4 text-slate-300 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    {isAr ? "معدل النجاح" : "Success Rate"}
                  </td>
                  <td className="text-center p-4">
                    <Badge className="bg-green-500/20 text-green-400 font-bold">85%</Badge>
                  </td>
                  <td className="text-center p-4">
                    <Badge className="bg-blue-500/20 text-blue-400 font-bold">70%</Badge>
                  </td>
                  <td className="text-center p-4">
                    <Badge className="bg-red-500/20 text-red-400 font-bold">40%</Badge>
                  </td>
                </tr>
                <tr>
                  <td className="p-4 text-slate-300 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    {isAr ? "الخيارات المتاحة" : "Available Options"}
                  </td>
                  <td className="text-center p-4 text-sm text-slate-300">
                    {isAr ? "NAQLA 2 أو 3" : "NAQLA 2 or 3"}
                  </td>
                  <td className="text-center p-4 text-sm text-slate-300">
                    {isAr ? "NAQLA 2 أو 3" : "NAQLA 2 or 3"}
                  </td>
                  <td className="text-center p-4 text-sm text-slate-300">
                    {isAr ? "إعادة تقديم" : "Resubmit"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* Animated Flow Diagrams + Scenarios */}
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

              {/* Animated Flow Diagram */}
              <div className={`${scenario.bgColor} p-6 border-b ${scenario.borderColor}`}>
                <h4 className="text-lg font-semibold text-white mb-4 text-center">
                  {isAr ? "🔄 مخطط تدفق المسار (متحرك)" : "🔄 Path Flow Diagram (Animated)"}
                </h4>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {scenario.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex items-center gap-2">
                      <div 
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all duration-500 hover:scale-105 ${
                          step.status === 'done' ? 'bg-green-500/20 border-green-500/40 animate-pulse' :
                          step.status === 'option' ? 'bg-blue-500/20 border-blue-500/40' :
                          step.status === 'reject' ? 'bg-red-500/20 border-red-500/40' :
                          'bg-slate-800/50 border-slate-700'
                        }`}
                        style={{
                          animationDelay: `${stepIndex * 0.2}s`
                        }}
                      >
                        <step.icon className={`w-4 h-4 ${
                          step.status === 'done' ? 'text-green-400' :
                          step.status === 'option' ? 'text-blue-400' :
                          step.status === 'reject' ? 'text-red-400' :
                          'text-slate-400'
                        }`} />
                        <span className="text-xs text-white font-medium whitespace-nowrap">
                          {step.text.split(':')[0]}
                        </span>
                      </div>
                      {stepIndex < scenario.steps.length - 1 && (
                        <ArrowRight className="w-4 h-4 text-slate-500 animate-pulse" style={{ animationDelay: `${stepIndex * 0.2 + 0.1}s` }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Scenario Content */}
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Steps */}
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Play className="w-5 h-5" />
                      {isAr ? "خطوات المسار التفصيلية" : "Detailed Path Steps"}
                    </h4>
                    <div className="space-y-3">
                      {scenario.steps.map((step, stepIndex) => (
                        <div 
                          key={stepIndex}
                          className={`flex items-start gap-3 p-3 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer ${
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

                  {/* Example Idea (Interactive) */}
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">
                      {isAr ? "💡 مثال حي قابل للنقر" : "💡 Interactive Live Example"}
                    </h4>
                    <Card className="bg-slate-800/50 border-slate-700 p-4 transition-all duration-300 hover:scale-105 hover:border-slate-600 cursor-pointer">
                      <h5 className="font-semibold text-white mb-2">
                        {scenario.exampleIdea.title}
                      </h5>
                      <p className="text-sm text-slate-300 mb-4">
                        {scenario.exampleIdea.description}
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(scenario.exampleIdea.scores).map(([key, value]) => (
                          <div key={key} className="bg-slate-900/50 p-2 rounded hover:bg-slate-900 transition-colors">
                            <div className="text-xs text-slate-400 mb-1">
                              {key === 'novelty' ? (isAr ? 'الجدة' : 'Novelty') :
                               key === 'impact' ? (isAr ? 'التأثير' : 'Impact') :
                               key === 'feasibility' ? (isAr ? 'الجدوى' : 'Feasibility') : (isAr ? 'السوق' : 'Market')}
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

                {/* Action Button (Interactive) */}
                <div className="mt-6 pt-6 border-t border-slate-800">
                  <Button
                    onClick={() => setLocation(scenario.demoUrl)}
                    className={`w-full ${scenario.bgColor} ${scenario.color} hover:opacity-80 border ${scenario.borderColor} transition-all duration-300 hover:scale-105`}
                    size="lg"
                  >
                    <Play className="w-5 h-5 ml-2" />
                    {isAr ? "جرب هذا السيناريو الآن (تفاعلي)" : "Try this scenario now (Interactive)"}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* NAQLA 2 Flow */}
        <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/20 p-8 mt-12">
          <div className="text-center">
            <Target className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">
              {isAr ? "مسار NAQLA 2 → NAQLA 3" : "NAQLA 2 → NAQLA 3 Path"}
            </h3>
            <p className="text-slate-300 text-lg mb-6 max-w-2xl mx-auto">
              {isAr ? (
                <>عند اختيار <strong>NAQLA 2</strong> (مطابقة مع التحديات)، إذا وجد النظام توافقاً بين فكرتك وأحد التحديات المطروحة، سيظهر لك زر <strong>&quot;انتقل إلى NAQLA 3&quot;</strong> لإكمال الصفقة مباشرة في سوق الابتكارات.</>
              ) : (
                <>When choosing <strong>NAQLA 2</strong> (Challenge Matching), if the system finds a match between your idea and one of the posted challenges, a <strong>"Go to NAQLA 3"</strong> button will appear to complete the deal directly in the innovation marketplace.</>
              )}
            </p>
            <div className="flex items-center justify-center gap-4 text-sm flex-wrap">
              <Badge variant="outline" className="bg-purple-500/10 text-purple-300 border-purple-500/30 animate-pulse">
                {isAr ? "NAQLA 2: مطابقة التحديات" : "NAQLA 2: Challenge Matching"}
              </Badge>
              <ArrowRight className="w-5 h-5 text-slate-400 animate-pulse" />
              <Badge variant="outline" className="bg-blue-500/10 text-blue-300 border-blue-500/30 animate-pulse">
                {isAr ? "توافق مع تحدي" : "Match with Challenge"}
              </Badge>
              <ArrowRight className="w-5 h-5 text-slate-400 animate-pulse" />
              <Badge variant="outline" className="bg-green-500/10 text-green-300 border-green-500/30 animate-pulse">
                {isAr ? "NAQLA 3: إكمال الصفقة" : "NAQLA 3: Complete Deal"}
              </Badge>
            </div>
            <Button
              onClick={() => setLocation("/naqla2")}
              className="mt-6 bg-purple-600 hover:bg-purple-700 transition-all duration-300 hover:scale-105"
              size="lg"
            >
              {isAr ? "استكشف NAQLA 2" : "Explore NAQLA 2"}
            </Button>
          </div>
        </Card>

        {/* Footer Note */}
        <div className="mt-12 text-center text-slate-400">
          <p className="text-sm">
            {isAr ? (
              <>💡 <strong>{isAr ? "ملاحظة:" : "مNoحظة:"}</strong>{isAr ? " جميع السيناريوهات أعلاه تعمل بشكل فعلي في المنصة. جرّب أي سيناريو لترى كيف يعمل النظام!" : "جميع السيناريوهات أعNoه تعمل بشكل فعلي في المنصة. جرّب أي سيناريو لترى كيف يعمل النظام!"}</>
            ) : (
              <>💡 <strong>Note:</strong> All scenarios above work effectively on the platform. Try any scenario to see how the system works!</>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}