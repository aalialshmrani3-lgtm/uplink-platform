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
import { useLanguage } from "@/contexts/LanguageContext";

export default function DemoFlow() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const [expandedStage, setExpandedStage] = useState<string | null>("registration");

  const stages = [
    {
      id: "registration",
      title: "Register",
      icon: UserPlus,
      color: "from-blue-500 to-cyan-600",
      borderColor: "border-blue-500/30",
      description: "Choose account type & create profile",
      options: [
        { label: "Government", icon: Building2 },
        { label: "Private Sector Company", icon: Briefcase },
        { label: "International Organization", icon: Globe },
        { label: "Individual Innovator", icon: Lightbulb },
        { label: "University/Research Institution", icon: GraduationCap },
        { label: "Investor", icon: TrendingUp },
      ],
      nextStage: "naqla1",
    },
    {
      id: "naqla1",
      title: "NAQLA 1 - Idea Submission",
      icon: Lightbulb,
      color: "from-purple-500 to-pink-600",
      borderColor: "border-purple-500/30",
      description: "Submit your idea & get a smart, comprehensive evaluation",
      steps: [
        isAr ? "املأ نموذج الفكرة (العنوان، الوصف، المجال، الفئة المستهدفة)" : "Fill out the idea form (Title, Description, Field, Target Audience)",
        isAr ? "تحليل AI تلقائي للفكرة" : "Automatic AI Idea Analysis",
        isAr ? "حساب Innovation Level + Classification" : "Calculate Innovation Level + Classification",
        isAr ? "عرض SWOT Analysis + Recommendations" : "View SWOT Analysis + Recommendations",
      ],
      scenarios: [
        {
          condition: "≥70%",
          label: "High Innovation",
          icon: CheckCircle2,
          color: "text-green-400",
          bgColor: "bg-green-500/10",
          borderColor: "border-green-500/30",
          nextStage: "naqla2-innovation",
          description: "Your idea is innovative and high-quality! It will proceed to NAQLA 2 for matching with investors and hackathons.",
        },
        {
          condition: "50-69%",
          label: "Commercial/Investment Solution",
          icon: AlertCircle,
          color: "text-yellow-400",
          bgColor: "bg-yellow-500/10",
          borderColor: "border-yellow-500/30",
          nextStage: "naqla2-commercial",
          description: "Your idea has commercial value! It will proceed to NAQLA 2 for matching with business challenges.",
        },
        {
          condition: "<50%",
          label: "Needs Improvement",
          icon: XCircle,
          color: "text-red-400",
          bgColor: "bg-red-500/10",
          borderColor: "border-red-500/30",
          nextStage: "feedback",
          description: "Your idea needs improvement. You will receive tailored advice and guidance for development.",
        },
      ],
    },
    {
      id: "naqla2-innovation",
      title: "NAQLA 2 - Matching (High Innovation)",
      icon: Rocket,
      color: "from-green-500 to-emerald-600",
      borderColor: "border-green-500/30",
      description: "Smart matching with suitable investors and hackathons",
      features: [
        isAr ? "عرض فكرتك على المستثمرين المهتمين بمجالك" : "Present your idea to investors interested in your field",
        isAr ? "التسجيل في الهاكاثونات المناسبة لمستوى ابتكارك" : "Register for hackathons suitable for your innovation level",
        isAr ? "المطابقة مع الشركات الباحثة عن حلول مبتكرة" : "Match with companies seeking innovative solutions",
        isAr ? "الحصول على فرص تمويل وشراكات استراتيجية" : "Gain funding opportunities and strategic partnerships",
      ],
      nextStage: "naqla3",
    },
    {
      id: "naqla2-commercial",
      title: "NAQLA 2 - Matching (Commercial Solution)",
      icon: Target,
      color: "from-yellow-500 to-orange-600",
      borderColor: "border-yellow-500/30",
      description: "Match with business challenges and investment opportunities",
      features: [
        isAr ? "تصفح التحديات التجارية من الشركات الكبرى" : "Browse business challenges from major companies",
        isAr ? "تقديم حلولك للتحديات المناسبة" : "Submit your solutions for suitable challenges",
        isAr ? "المطابقة مع الفعاليات والمؤتمرات التجارية" : "Match with Events & Conferences",
        isAr ? "الحصول على فرص استثمارية وشراكات تجارية" : "Access Investment & Business Partnerships",
      ],
      nextStage: "naqla3",
    },
    {
      id: "feedback",
      title: "Advice & Guidance",
      icon: AlertCircle,
      color: "from-red-500 to-pink-600",
      borderColor: "border-red-500/30",
      description: "Get tailored advice to refine your idea",
      features: [
        isAr ? "تحليل نقاط الضعف في الفكرة" : "Idea Weakness Analysis",
        isAr ? "توصيات محددة للتحسين" : "Specific Improvement Recommendations",
        isAr ? "مصادر تعليمية وإرشادية" : "Educational & Guidance Resources",
        isAr ? "إمكانية إعادة تقديم الفكرة بعد التحسين" : "Resubmit Idea After Improvement",
      ],
      nextStage: "naqla1",
      isRetry: true,
    },
    {
      id: "naqla3",
      title: "NAQLA 3 - Smart Contracts",
      icon: FileText,
      color: "from-cyan-500 to-blue-600",
      borderColor: "border-cyan-500/30",
      description: "Create Smart Contracts & Manage Milestones/Funds",
      features: [
        isAr ? "إنشاء Smart Contract على Blockchain" : "Create Smart Contract on Blockchain",
        isAr ? "تحديد Milestones (المراحل) للمشروع" : "Define Project Milestones",
        isAr ? "نظام Escrow لحماية الأموال" : "Escrow System for Fund Protection",
        isAr ? "إطلاق الأموال تدريجياً عند إكمال كل مرحلة" : "Release Funds Incrementally per Milestone",
        isAr ? "توثيق كل خطوة على Blockchain" : "Document Each Step on Blockchain",
      ],
      nextStage: "completed",
    },
    {
      id: "completed",
      title: "Congratulations! Journey Complete",
      icon: Award,
      color: "from-purple-500 to-pink-600",
      borderColor: "border-purple-500/30",
      description: "Successful Partnership & Secure Smart Contract Created",
      features: [
        isAr ? "عقد ذكي نشط على Blockchain" : "Active Smart Contract on Blockchain",
        isAr ? "شراكة مع مستثمر/جهة رسمية" : "Partnership with Investor/Official Entity",
        isAr ? "نظام دفع آمن ومضمون" : "Secure & Guaranteed Payment System",
        isAr ? "متابعة التقدم في المشروع" : "Track Project Progress",
      ],
    },
  ];

  const toggleStage = (stageId: string) => {
    setExpandedStage(expandedStage === stageId ? null : stageId);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title={isAr ? "Demo Flow - رحلة المستخدم الكاملة" : "Demo Flow - Full User Journey"}
        description={isAr ? "تعرف على رحلة المستخدم الكاملة في منصة NAQLA من التسجيل حتى العقود الذكية" : "Explore the full NAQLA user journey from registration to smart contracts"}
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
              <span className="text-gradient-blue">{isAr ? isAr ? " العقد الذكي" : "Smart Contract" : "[Smart Contract]"}</span>
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

                        {/* NAQLA 1 Steps */}
                        {stage.id === "naqla1" && stage.steps && (
                          <div className="mb-6">
                            <h4 className="text-foreground font-semibold mb-3">{isAr ? isAr ? "خطوات التقديم:" : "Submission Steps:" : "[Submission Steps:]"}</h4>
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

                        {/* NAQLA 1 Scenarios */}
                        {stage.id === "naqla1" && stage.scenarios && (
                          <div>
                            <h4 className="text-foreground font-semibold mb-3">{isAr ? isAr ? "السيناريوهات المحتملة:" : "Possible Scenarios:" : "Possible Scenarios:"}</h4>
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
                              {stage.id === "feedback" ? isAr ? "ما ستحصل عليه:" : "What You'll Get:" : "Features:"}
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
                              {stage.isRetry ? isAr ? "إعادة المحاولة" : "Retry" : "Next Stage"}
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
