import { useState } from "react";
import { 
  UserPlus, Lightbulb, Target, Handshake, FileText,
  CheckCircle2, XCircle, AlertCircle, ArrowRight, 
  TrendingUp, Award, Rocket, Users, Building2,
  ChevronDown, ChevronUp, Briefcase, Globe, GraduationCap
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";

export default function DemoFlow() {
  const [expandedStage, setExpandedStage] = useState<string | null>("registration");

  const stages = [
    {
      id: "registration",
      title: "التسجيل",
      icon: UserPlus,
      color: "from-blue-500 to-cyan-600",
      borderColor: "border-blue-500/30",
      description: "اختر نوع حسابك وأنشئ ملفك الشخصي",
      options: [
        { label: "حكومة", icon: Building2 },
        { label: "شركة قطاع خاص", icon: Briefcase },
        { label: "منظمة دولية", icon: Globe },
        { label: "مبتكر فردي", icon: Lightbulb },
        { label: "جامعة/مؤسسة بحثية", icon: GraduationCap },
        { label: "مستثمر", icon: TrendingUp },
      ],
      nextStage: "uplink1",
    },
    {
      id: "uplink1",
      title: "UPLINK 1 - تقديم الفكرة",
      icon: Lightbulb,
      color: "from-purple-500 to-pink-600",
      borderColor: "border-purple-500/30",
      description: "قدم فكرتك واحصل على تقييم ذكي شامل",
      steps: [
        "املأ نموذج الفكرة (العنوان، الوصف، المجال، الفئة المستهدفة)",
        "تحليل AI تلقائي للفكرة",
        "حساب Innovation Level + Classification",
        "عرض SWOT Analysis + Recommendations",
      ],
      scenarios: [
        {
          condition: "≥70%",
          label: "ابتكار عالي",
          icon: CheckCircle2,
          color: "text-green-400",
          bgColor: "bg-green-500/10",
          borderColor: "border-green-500/30",
          nextStage: "uplink2-innovation",
          description: "فكرتك مبتكرة وعالية الجودة! ستنتقل إلى UPLINK 2 للمطابقة مع المستثمرين والهاكاثونات",
        },
        {
          condition: "50-69%",
          label: "حل تجاري/استثماري",
          icon: AlertCircle,
          color: "text-yellow-400",
          bgColor: "bg-yellow-500/10",
          borderColor: "border-yellow-500/30",
          nextStage: "uplink2-commercial",
          description: "فكرتك لها قيمة تجارية! ستنتقل إلى UPLINK 2 للمطابقة مع التحديات التجارية",
        },
        {
          condition: "<50%",
          label: "يحتاج تحسين",
          icon: XCircle,
          color: "text-red-400",
          bgColor: "bg-red-500/10",
          borderColor: "border-red-500/30",
          nextStage: "feedback",
          description: "فكرتك تحتاج إلى تحسين. ستحصل على نصائح مخصصة وتوجيهات لتطويرها",
        },
      ],
    },
    {
      id: "uplink2-innovation",
      title: "UPLINK 2 - المطابقة (ابتكار عالي)",
      icon: Rocket,
      color: "from-green-500 to-emerald-600",
      borderColor: "border-green-500/30",
      description: "مطابقة ذكية مع المستثمرين والهاكاثونات المناسبة",
      features: [
        "عرض فكرتك على المستثمرين المهتمين بمجالك",
        "التسجيل في الهاكاثونات المناسبة لمستوى ابتكارك",
        "المطابقة مع الشركات الباحثة عن حلول مبتكرة",
        "الحصول على فرص تمويل وشراكات استراتيجية",
      ],
      nextStage: "uplink3",
    },
    {
      id: "uplink2-commercial",
      title: "UPLINK 2 - المطابقة (حل تجاري)",
      icon: Target,
      color: "from-yellow-500 to-orange-600",
      borderColor: "border-yellow-500/30",
      description: "مطابقة مع التحديات التجارية والفرص الاستثمارية",
      features: [
        "تصفح التحديات التجارية من الشركات الكبرى",
        "تقديم حلولك للتحديات المناسبة",
        "المطابقة مع الفعاليات والمؤتمرات التجارية",
        "الحصول على فرص استثمارية وشراكات تجارية",
      ],
      nextStage: "uplink3",
    },
    {
      id: "feedback",
      title: "النصائح والتوجيه",
      icon: AlertCircle,
      color: "from-red-500 to-pink-600",
      borderColor: "border-red-500/30",
      description: "احصل على نصائح مخصصة لتحسين فكرتك",
      features: [
        "تحليل نقاط الضعف في الفكرة",
        "توصيات محددة للتحسين",
        "مصادر تعليمية وإرشادية",
        "إمكانية إعادة تقديم الفكرة بعد التحسين",
      ],
      nextStage: "uplink1",
      isRetry: true,
    },
    {
      id: "uplink3",
      title: "UPLINK 3 - العقود الذكية",
      icon: FileText,
      color: "from-cyan-500 to-blue-600",
      borderColor: "border-cyan-500/30",
      description: "إنشاء عقود ذكية وإدارة المراحل والأموال",
      features: [
        "إنشاء Smart Contract على Blockchain",
        "تحديد Milestones (المراحل) للمشروع",
        "نظام Escrow لحماية الأموال",
        "إطلاق الأموال تدريجياً عند إكمال كل مرحلة",
        "توثيق كل خطوة على Blockchain",
      ],
      nextStage: "completed",
    },
    {
      id: "completed",
      title: "مبروك! اكتملت الرحلة",
      icon: Award,
      color: "from-purple-500 to-pink-600",
      borderColor: "border-purple-500/30",
      description: "تم إنشاء شراكة ناجحة وعقد ذكي آمن",
      features: [
        "عقد ذكي نشط على Blockchain",
        "شراكة مع مستثمر/جهة رسمية",
        "نظام دفع آمن ومضمون",
        "متابعة التقدم في المشروع",
      ],
    },
  ];

  const toggleStage = (stageId: string) => {
    setExpandedStage(expandedStage === stageId ? null : stageId);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Demo Flow - رحلة المستخدم الكاملة"
        description="تعرف على رحلة المستخدم الكاملة في منصة UPLINK من التسجيل حتى العقود الذكية"
      />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-purple-500/5 to-transparent" />
        <div className="container relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/30">
              <Rocket className="w-3 h-3 ml-1" />
              رحلة المستخدم الكاملة
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
              من الفكرة إلى
              <span className="text-gradient-blue"> العقد الذكي</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              اكتشف كيف تتحول فكرتك إلى مشروع حقيقي مع شراكات عالمية وعقود ذكية آمنة
            </p>
          </div>
        </div>
      </section>

      {/* Flow Stages */}
      <section className="py-16 px-6">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-6">
            {stages.map((stage, index) => {
              const isExpanded = expandedStage === stage.id;
              const StageIcon = stage.icon;

              return (
                <div key={stage.id} className="relative">
                  {/* Connector Line */}
                  {index < stages.length - 1 && (
                    <div className="absolute right-[29px] top-20 w-0.5 h-[calc(100%+24px)] bg-gradient-to-b from-border to-transparent" />
                  )}

                  <Card 
                    className={`relative bg-card/50 backdrop-blur-sm border ${stage.borderColor} hover:border-opacity-100 transition-all duration-300 ${isExpanded ? 'ring-2 ring-offset-2 ring-offset-background' : ''}`}
                  >
                    <CardHeader 
                      className="cursor-pointer"
                      onClick={() => toggleStage(stage.id)}
                    >
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stage.color} flex items-center justify-center flex-shrink-0`}>
                          <StageIcon className="w-7 h-7 text-white" />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <CardTitle className="text-foreground text-2xl">{stage.title}</CardTitle>
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                          <CardDescription className="text-muted-foreground text-base">
                            {stage.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>

                    {isExpanded && (
                      <CardContent className="pt-0">
                        {/* Registration Options */}
                        {stage.id === "registration" && stage.options && (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                            {stage.options.map((option, i) => {
                              const OptionIcon = option.icon;
                              return (
                                <div 
                                  key={i}
                                  className="p-3 rounded-lg bg-secondary/30 border border-border/30 hover:border-blue-500/50 transition-colors cursor-pointer"
                                >
                                  <OptionIcon className="w-5 h-5 text-blue-400 mb-2" />
                                  <p className="text-sm text-foreground font-medium">{option.label}</p>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* UPLINK 1 Steps */}
                        {stage.id === "uplink1" && stage.steps && (
                          <div className="mb-6">
                            <h4 className="text-foreground font-semibold mb-3">خطوات التقديم:</h4>
                            <div className="space-y-2">
                              {stage.steps.map((step, i) => (
                                <div key={i} className="flex items-start gap-3">
                                  <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-xs text-purple-400 font-bold">{i + 1}</span>
                                  </div>
                                  <p className="text-muted-foreground">{step}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* UPLINK 1 Scenarios */}
                        {stage.id === "uplink1" && stage.scenarios && (
                          <div>
                            <h4 className="text-foreground font-semibold mb-3">السيناريوهات المحتملة:</h4>
                            <div className="space-y-3">
                              {stage.scenarios.map((scenario, i) => {
                                const ScenarioIcon = scenario.icon;
                                return (
                                  <div 
                                    key={i}
                                    className={`p-4 rounded-lg ${scenario.bgColor} border ${scenario.borderColor}`}
                                  >
                                    <div className="flex items-start gap-3 mb-2">
                                      <ScenarioIcon className={`w-5 h-5 ${scenario.color} flex-shrink-0 mt-0.5`} />
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                          <Badge className={`${scenario.bgColor} ${scenario.color} border ${scenario.borderColor}`}>
                                            {scenario.condition}
                                          </Badge>
                                          <span className={`font-semibold ${scenario.color}`}>{scenario.label}</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{scenario.description}</p>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Features List */}
                        {stage.features && (
                          <div>
                            <h4 className="text-foreground font-semibold mb-3">
                              {stage.id === "feedback" ? "ما ستحصل عليه:" : "المميزات:"}
                            </h4>
                            <div className="space-y-2">
                              {stage.features.map((feature, i) => (
                                <div key={i} className="flex items-start gap-3">
                                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                  <p className="text-muted-foreground">{feature}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Next Stage Button */}
                        {stage.nextStage && (
                          <div className="mt-6 pt-6 border-t border-border/30">
                            <Button 
                              onClick={() => {
                                const nextStage = stages.find(s => s.id === stage.nextStage);
                                if (nextStage) {
                                  setExpandedStage(nextStage.id);
                                  // Smooth scroll to next stage
                                  setTimeout(() => {
                                    document.getElementById(nextStage.id)?.scrollIntoView({ 
                                      behavior: 'smooth', 
                                      block: 'center' 
                                    });
                                  }, 100);
                                }
                              }}
                              className={`w-full bg-gradient-to-r ${stage.color} text-white`}
                            >
                              {stage.isRetry ? "إعادة المحاولة" : "المرحلة التالية"}
                              <ArrowRight className="w-4 h-4 mr-2" />
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    )}
                  </Card>

                  {/* Anchor for smooth scroll */}
                  <div id={stage.id} className="absolute -top-24" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10" />
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              جاهز لبدء رحلتك؟
            </h2>
            <p className="text-lg text-muted-foreground mb-10">
              ابدأ الآن وحوّل فكرتك إلى مشروع حقيقي مع شراكات عالمية
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg px-10 h-14">
                <UserPlus className="w-5 h-5 ml-2" />
                ابدأ التسجيل
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-10 h-14">
                <Lightbulb className="w-5 h-5 ml-2" />
                قدم فكرتك
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
