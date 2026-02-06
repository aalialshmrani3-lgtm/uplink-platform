import { Link } from "wouter";
import { Shield, FileCheck, Globe, Lock, TrendingUp, CheckCircle2, ArrowRight, Sparkles, Award, Users, Clock, Zap, Brain, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useLanguage } from "@/contexts/LanguageContext";
import SEOHead from "@/components/SEOHead";

export default function Uplink1() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const features = [
    {
      icon: FileCheck,
      title: "تسجيل براءات الاختراع",
      description: "تسجيل وحماية براءات الاختراع عبر SAIP (الهيئة السعودية للملكية الفكرية) بسهولة وسرعة",
      color: "from-emerald-500 to-teal-600"
    },
    {
      icon: Award,
      title: "حماية العلامات التجارية",
      description: "تسجيل وحماية العلامات التجارية والشعارات والأسماء التجارية محلياً ودولياً",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: Lock,
      title: "توثيق البلوكتشين",
      description: "توثيق الملكية الفكرية على البلوكتشين لضمان الحماية الدائمة وإثبات الأسبقية",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: Globe,
      title: "التسجيل الدولي WIPO",
      description: "تسجيل الملكية الفكرية دولياً عبر المنظمة العالمية للملكية الفكرية (WIPO)",
      color: "from-orange-500 to-red-600"
    }
  ];

  const process = [
    {
      step: "1",
      title: "تقديم الطلب",
      description: "قم بتعبئة نموذج التسجيل الإلكتروني مع تفاصيل الابتكار والمستندات المطلوبة"
    },
    {
      step: "2",
      title: "المراجعة الأولية",
      description: "فريقنا المتخصص يراجع الطلب ويتحقق من اكتمال المستندات والمتطلبات"
    },
    {
      step: "3",
      title: "التوثيق على البلوكتشين",
      description: "نقوم بتوثيق الملكية الفكرية على البلوكتشين لإثبات الأسبقية والحماية الفورية"
    },
    {
      step: "4",
      title: "التسجيل الرسمي",
      description: "نتولى عملية التسجيل الرسمي لدى SAIP أو WIPO حسب اختيارك"
    },
    {
      step: "5",
      title: "الحصول على الشهادة",
      description: "تحصل على شهادة التسجيل الرسمية مع الحماية القانونية الكاملة"
    }
  ];

  const stats = [
    { value: "500+", label: "براءة اختراع مسجلة", icon: Award },
    { value: "300+", label: "علامة تجارية محمية", icon: Shield },
    { value: "50+", label: "دولة مغطاة", icon: Globe },
    { value: "95%", label: "معدل النجاح", icon: TrendingUp }
  ];

  const benefits = [
    {
      title: "حماية قانونية شاملة",
      description: "احصل على حماية قانونية كاملة لابتكارك محلياً ودولياً ضد أي انتهاك أو سرقة"
    },
    {
      title: "زيادة القيمة السوقية",
      description: "الملكية الفكرية المسجلة تزيد من قيمة مشروعك وتجذب المستثمرين والشركاء"
    },
    {
      title: "ميزة تنافسية",
      description: "احصل على ميزة تنافسية قوية في السوق من خلال حماية ابتكارك الفريد"
    },
    {
      title: "إثبات الأسبقية",
      description: "التوثيق على البلوكتشين يوفر إثباتاً دائماً لأسبقيتك في الابتكار"
    },
    {
      title: "تسهيل التمويل",
      description: "الملكية الفكرية المسجلة تسهل الحصول على التمويل والاستثمار"
    },
    {
      title: "دعم متخصص",
      description: "فريق من الخبراء القانونيين والتقنيين لمساعدتك في كل خطوة"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="UPLINK1 - محرك توليد الملكية الفكرية"
        description="سجّل وحمِ ابتكارك عبر SAIP و WIPO مع توثيق البلوكتشين. حماية شاملة لبراءات الاختراع والعلامات التجارية."
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-8">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-400 font-semibold">UPLINK1 - محرك توليد الملكية الفكرية</span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-foreground">احمِ ابتكارك</span>
              <br />
              <span className="text-gradient-emerald">بحماية قانونية شاملة</span>
            </h1>

            {/* Description */}
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              سجّل براءات الاختراع والعلامات التجارية عبر SAIP و WIPO مع توثيق فوري على البلوكتشين. 
              حماية شاملة لابتكارك من الفكرة إلى السوق العالمي.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              {user ? (
                <Link href="/ip/register">
                  <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-lg px-8 h-14 glow">
                    <Sparkles className="w-5 h-5 ml-2" />
                    سجّل ملكيتك الفكرية الآن
                  </Button>
                </Link>
              ) : (
                <a href={getLoginUrl()}>
                  <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-lg px-8 h-14 glow">
                    <Sparkles className="w-5 h-5 ml-2" />
                    سجّل ملكيتك الفكرية الآن
                  </Button>
                </a>
              )}
              <Link href="/ip/browse">
                <Button size="lg" variant="outline" className="text-lg px-8 h-14 border-emerald-500/50 hover:bg-emerald-500/10">
                  تصفح الملكيات الفكرية المسجلة
                  <ArrowRight className="w-5 h-5 mr-2" />
                </Button>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="p-4 rounded-2xl bg-card/30 backdrop-blur-sm border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300">
                  <stat.icon className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                  <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-secondary/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              الميزات الرئيسية
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              نوفر لك حلولاً متكاملة لحماية ملكيتك الفكرية محلياً ودولياً
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div 
                key={i} 
                className="group p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 px-6">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              كيف يعمل UPLINK1؟
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              عملية بسيطة وسريعة لتسجيل وحماية ملكيتك الفكرية في 5 خطوات
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {process.map((item, i) => (
              <div key={i} className="relative flex gap-6 mb-8 last:mb-0">
                {/* Step Number */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {item.step}
                  </div>
                  {i < process.length - 1 && (
                    <div className="w-0.5 h-full bg-gradient-to-b from-emerald-500 to-teal-600 mx-auto mt-2" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-8">
                  <div className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300">
                    <h3 className="text-2xl font-bold mb-2 text-foreground">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-6 bg-secondary/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              لماذا تسجل ملكيتك الفكرية معنا؟
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              فوائد متعددة تضمن حماية ابتكارك ونجاحه في السوق
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {benefits.map((benefit, i) => (
              <div 
                key={i} 
                className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105"
              >
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-4" />
                <h3 className="text-xl font-bold mb-3 text-foreground">{benefit.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center p-12 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30">
            <Zap className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              جاهز لحماية ابتكارك؟
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              ابدأ الآن في تسجيل ملكيتك الفكرية واحصل على حماية قانونية شاملة محلياً ودولياً
            </p>
            {user ? (
              <Link href="/ip/register">
                <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-lg px-12 h-16 glow">
                  <Sparkles className="w-6 h-6 ml-2" />
                  سجّل الآن مجاناً
                </Button>
              </Link>
            ) : (
              <a href={getLoginUrl()}>
                <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-lg px-12 h-16 glow">
                  <Sparkles className="w-6 h-6 ml-2" />
                  سجّل الآن مجاناً
                </Button>
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
