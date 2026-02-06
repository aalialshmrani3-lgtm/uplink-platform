import { Link } from "wouter";
import { Target, Users, Lightbulb, TrendingUp, CheckCircle2, ArrowRight, Sparkles, Award, Zap, Brain, Rocket, Search, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useLanguage } from "@/contexts/LanguageContext";
import SEOHead from "@/components/SEOHead";

export default function Uplink2() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const features = [
    {
      icon: Target,
      title: "تحديات حقيقية",
      description: "تحديات من شركات ومؤسسات رائدة تبحث عن حلول مبتكرة لمشاكل حقيقية",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: Brain,
      title: "مطابقة ذكية",
      description: "خوارزمية ذكاء اصطناعي متقدمة تطابق المبتكرين مع التحديات المناسبة لخبراتهم",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: Award,
      title: "جوائز ومكافآت",
      description: "جوائز مالية ضخمة وفرص استثمارية للحلول الفائزة والمبتكرة",
      color: "from-orange-500 to-red-600"
    },
    {
      icon: Rocket,
      title: "تسريع النمو",
      description: "برامج تسريع ودعم فني ومالي لتحويل الحلول إلى منتجات قابلة للتسويق",
      color: "from-emerald-500 to-teal-600"
    }
  ];

  const process = [
    {
      step: "1",
      title: "تصفح التحديات",
      description: "استكشف التحديات المتاحة من مختلف القطاعات والمجالات واختر ما يناسب خبراتك"
    },
    {
      step: "2",
      title: "تقديم الحل",
      description: "قدم حلك المبتكر مع شرح تفصيلي للفكرة والتقنيات المستخدمة والنتائج المتوقعة"
    },
    {
      step: "3",
      title: "المراجعة والتقييم",
      description: "لجنة من الخبراء تراجع الحلول وتقيمها بناءً على الابتكار والجدوى والأثر"
    },
    {
      step: "4",
      title: "المطابقة الذكية",
      description: "خوارزمية AI تطابق أفضل الحلول مع احتياجات الشركات والمؤسسات"
    },
    {
      step: "5",
      title: "التنفيذ والمكافأة",
      description: "الحلول الفائزة تحصل على جوائز مالية وفرص تنفيذ مع الشركات الرائدة"
    }
  ];

  const stats = [
    { value: "200+", label: "تحدٍ نشط", icon: Target },
    { value: "1000+", label: "مبتكر مشارك", icon: Users },
    { value: "50M+", label: "ريال جوائز", icon: Award },
    { value: "85%", label: "معدل المطابقة", icon: TrendingUp }
  ];

  const challenges = [
    {
      title: "تحسين كفاءة الطاقة في المباني",
      company: "أرامكو السعودية",
      prize: "500,000 ريال",
      category: "الطاقة المتجددة",
      participants: 45,
      deadline: "30 يوم متبقي"
    },
    {
      title: "حلول ذكية للنقل العام",
      company: "وزارة النقل",
      prize: "300,000 ريال",
      category: "النقل الذكي",
      participants: 38,
      deadline: "45 يوم متبقي"
    },
    {
      title: "تطبيقات الذكاء الاصطناعي في الصحة",
      company: "وزارة الصحة",
      prize: "400,000 ريال",
      category: "الصحة الرقمية",
      participants: 52,
      deadline: "60 يوم متبقي"
    }
  ];

  const benefits = [
    {
      title: "فرص حقيقية",
      description: "تحديات من شركات ومؤسسات رائدة تبحث عن حلول قابلة للتنفيذ"
    },
    {
      title: "جوائز ضخمة",
      description: "جوائز مالية تصل إلى مليون ريال للحلول الفائزة"
    },
    {
      title: "شبكة علاقات",
      description: "تواصل مع خبراء ومستثمرين وشركات رائدة في مجالك"
    },
    {
      title: "تسريع النمو",
      description: "برامج تسريع ودعم فني ومالي لتحويل فكرتك إلى منتج"
    },
    {
      title: "حماية الملكية",
      description: "حماية كاملة لملكيتك الفكرية عبر UPLINK1"
    },
    {
      title: "فرص استثمارية",
      description: "عرض حلك على مستثمرين وصناديق استثمارية مهتمة"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="UPLINK2 - محرك التحديات والمطابقة الذكية"
        description="تحديات حقيقية من شركات رائدة، مطابقة ذكية بالذكاء الاصطناعي، جوائز ضخمة. حوّل ابتكارك إلى فرصة حقيقية."
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 mb-8">
              <Target className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-400 font-semibold">UPLINK2 - محرك التحديات والمطابقة الذكية</span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-foreground">حوّل ابتكارك</span>
              <br />
              <span className="text-gradient-blue">إلى فرصة حقيقية</span>
            </h1>

            {/* Description */}
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              تحديات حقيقية من شركات ومؤسسات رائدة، مطابقة ذكية بالذكاء الاصطناعي، جوائز تصل إلى مليون ريال. 
              ابدأ الآن وكن جزءاً من ثورة الابتكار الوطنية.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              {user ? (
                <Link href="/challenges">
                  <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg px-8 h-14 glow">
                    <Search className="w-5 h-5 ml-2" />
                    تصفح التحديات المتاحة
                  </Button>
                </Link>
              ) : (
                <a href={getLoginUrl()}>
                  <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg px-8 h-14 glow">
                    <Search className="w-5 h-5 ml-2" />
                    تصفح التحديات المتاحة
                  </Button>
                </a>
              )}
              <Link href="/challenges/submit">
                <Button size="lg" variant="outline" className="text-lg px-8 h-14 border-blue-500/50 hover:bg-blue-500/10">
                  قدّم حلك الآن
                  <ArrowRight className="w-5 h-5 mr-2" />
                </Button>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="p-4 rounded-2xl bg-card/30 backdrop-blur-sm border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
                  <stat.icon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
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
              لماذا UPLINK2؟
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              منصة متكاملة تربط المبتكرين بالتحديات الحقيقية والفرص الاستثمارية
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div 
                key={i} 
                className="group p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-blue-500/50 transition-all duration-300 hover:scale-105"
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

      {/* Active Challenges Section */}
      <section className="py-24 px-6">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              تحديات نشطة الآن
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              تحديات حقيقية من شركات ومؤسسات رائدة تنتظر حلولك المبتكرة
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {challenges.map((challenge, i) => (
              <div 
                key={i} 
                className="group p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-blue-500/50 transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-semibold">
                    {challenge.category}
                  </span>
                  <span className="text-2xl font-bold text-emerald-400">{challenge.prize}</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">{challenge.title}</h3>
                <p className="text-muted-foreground mb-4">{challenge.company}</p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{challenge.participants} مشارك</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{challenge.deadline}</span>
                  </div>
                </div>
                <Button className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  قدّم حلك
                  <ArrowRight className="w-4 h-4 mr-2" />
                </Button>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/challenges">
              <Button size="lg" variant="outline" className="text-lg px-8 h-14 border-blue-500/50 hover:bg-blue-500/10">
                عرض جميع التحديات ({stats[0].value})
                <ArrowRight className="w-5 h-5 mr-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 px-6 bg-secondary/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              كيف يعمل UPLINK2؟
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              عملية بسيطة وسريعة من التصفح إلى الفوز بالجوائز في 5 خطوات
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {process.map((item, i) => (
              <div key={i} className="relative flex gap-6 mb-8 last:mb-0">
                {/* Step Number */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {item.step}
                  </div>
                  {i < process.length - 1 && (
                    <div className="w-0.5 h-full bg-gradient-to-b from-blue-500 to-purple-600 mx-auto mt-2" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-8">
                  <div className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
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
      <section className="py-24 px-6">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              الفوائد والمميزات
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              انضم إلى آلاف المبتكرين واحصل على فرص حقيقية لتحويل ابتكارك إلى نجاح
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {benefits.map((benefit, i) => (
              <div 
                key={i} 
                className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-blue-500/50 transition-all duration-300 hover:scale-105"
              >
                <CheckCircle2 className="w-8 h-8 text-blue-400 mb-4" />
                <h3 className="text-xl font-bold mb-3 text-foreground">{benefit.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-secondary/30">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center p-12 rounded-3xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30">
            <Zap className="w-16 h-16 text-blue-400 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              جاهز لتحدي جديد؟
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              تصفح التحديات المتاحة الآن وابدأ رحلتك نحو الفوز بجوائز ضخمة وفرص استثمارية حقيقية
            </p>
            {user ? (
              <Link href="/challenges">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg px-12 h-16 glow">
                  <Sparkles className="w-6 h-6 ml-2" />
                  تصفح التحديات الآن
                </Button>
              </Link>
            ) : (
              <a href={getLoginUrl()}>
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg px-12 h-16 glow">
                  <Sparkles className="w-6 h-6 ml-2" />
                  تصفح التحديات الآن
                </Button>
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
