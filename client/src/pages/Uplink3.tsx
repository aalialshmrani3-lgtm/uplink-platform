import { Link } from "wouter";
import { ShoppingCart, Shield, DollarSign, TrendingUp, CheckCircle2, ArrowRight, Sparkles, Award, Zap, FileText, Globe, Lock, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useLanguage } from "@/contexts/LanguageContext";
import SEOHead from "@/components/SEOHead";

export default function Uplink3() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const features = [
    {
      icon: ShoppingCart,
      title: "سوق مفتوح",
      description: "سوق مفتوح لبيع وشراء الملكيات الفكرية والحلول التقنية المبتكرة",
      color: "from-orange-500 to-red-600"
    },
    {
      icon: FileText,
      title: "عقود ذكية",
      description: "عقود ذكية على البلوكتشين تضمن حقوق جميع الأطراف وتنفيذ الاتفاقيات تلقائياً",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: Shield,
      title: "حماية كاملة",
      description: "حماية قانونية وتقنية كاملة للمشترين والبائعين عبر نظام ضمان متقدم",
      color: "from-emerald-500 to-teal-600"
    },
    {
      icon: DollarSign,
      title: "معاملات آمنة",
      description: "نظام دفع آمن ومضمون مع خيارات متعددة للدفع والتحويل",
      color: "from-blue-500 to-cyan-600"
    }
  ];

  const process = [
    {
      step: "1",
      title: "عرض المنتج",
      description: "قم بعرض ملكيتك الفكرية أو حلك التقني في السوق مع تفاصيل شاملة وسعر تنافسي"
    },
    {
      step: "2",
      title: "التفاوض والاتفاق",
      description: "تواصل مع المشترين المهتمين وتفاوض على الشروط والأسعار حتى الوصول لاتفاق"
    },
    {
      step: "3",
      title: "إنشاء العقد الذكي",
      description: "يتم إنشاء عقد ذكي على البلوكتشين يحدد جميع الشروط والالتزامات والمواعيد"
    },
    {
      step: "4",
      title: "الدفع والتحويل",
      description: "المشتري يدفع المبلغ المتفق عليه عبر نظام الدفع الآمن"
    },
    {
      step: "5",
      title: "نقل الملكية",
      description: "يتم نقل الملكية الفكرية رسمياً للمشتري مع جميع الحقوق والمستندات"
    }
  ];

  const stats = [
    { value: "5000+", label: "منتج معروض", icon: ShoppingCart },
    { value: "2000+", label: "صفقة مكتملة", icon: CheckCircle2 },
    { value: "100M+", label: "ريال قيمة المعاملات", icon: DollarSign },
    { value: "99%", label: "معدل الأمان", icon: Shield }
  ];

  const products = [
    {
      title: "نظام إدارة الطاقة الذكي",
      category: "برمجيات",
      price: "250,000 ريال",
      seller: "شركة تقنية الابتكار",
      rating: 4.8,
      sales: 12
    },
    {
      title: "تطبيق الصحة الرقمية",
      category: "تطبيقات",
      price: "180,000 ريال",
      seller: "فريق الصحة الذكية",
      rating: 4.9,
      sales: 8
    },
    {
      title: "حل الأمن السيبراني المتقدم",
      category: "أمن معلومات",
      price: "500,000 ريال",
      seller: "مجموعة الحماية الرقمية",
      rating: 5.0,
      sales: 15
    }
  ];

  const benefits = [
    {
      title: "سوق عالمي",
      description: "وصول إلى سوق عالمي من المشترين والمستثمرين المهتمين بالابتكار"
    },
    {
      title: "عقود آمنة",
      description: "عقود ذكية على البلوكتشين تضمن تنفيذ الاتفاقيات تلقائياً"
    },
    {
      title: "دفع مضمون",
      description: "نظام دفع آمن ومضمون مع حماية كاملة لحقوق البائع والمشتري"
    },
    {
      title: "شفافية كاملة",
      description: "جميع المعاملات مسجلة على البلوكتشين بشفافية ولا يمكن التلاعب بها"
    },
    {
      title: "دعم قانوني",
      description: "فريق قانوني متخصص لمساعدتك في جميع مراحل البيع والشراء"
    },
    {
      title: "تقييم احترافي",
      description: "خبراء متخصصون لتقييم قيمة الملكية الفكرية بشكل عادل ودقيق"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="UPLINK3 - سوق الملكية الفكرية والعقود الذكية"
        description="سوق مفتوح لبيع وشراء الملكيات الفكرية مع عقود ذكية على البلوكتشين. معاملات آمنة ومضمونة."
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 mb-8">
              <ShoppingCart className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-orange-400 font-semibold">UPLINK3 - سوق الملكية الفكرية والعقود الذكية</span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-foreground">اشترِ واعرض</span>
              <br />
              <span className="text-gradient-orange">ابتكارك بأمان</span>
            </h1>

            {/* Description */}
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              سوق مفتوح لبيع وشراء الملكيات الفكرية والحلول التقنية المبتكرة مع عقود ذكية على البلوكتشين. 
              معاملات آمنة ومضمونة بنسبة 100%.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              {user ? (
                <Link href="/marketplace">
                  <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-lg px-8 h-14 glow">
                    <ShoppingCart className="w-5 h-5 ml-2" />
                    تصفح السوق الآن
                  </Button>
                </Link>
              ) : (
                <a href={getLoginUrl()}>
                  <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-lg px-8 h-14 glow">
                    <ShoppingCart className="w-5 h-5 ml-2" />
                    تصفح السوق الآن
                  </Button>
                </a>
              )}
              <Link href="/marketplace/sell">
                <Button size="lg" variant="outline" className="text-lg px-8 h-14 border-orange-500/50 hover:bg-orange-500/10">
                  اعرض منتجك للبيع
                  <ArrowRight className="w-5 h-5 mr-2" />
                </Button>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="p-4 rounded-2xl bg-card/30 backdrop-blur-sm border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300">
                  <stat.icon className="w-6 h-6 text-orange-400 mx-auto mb-2" />
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
              لماذا UPLINK3؟
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              منصة متكاملة لبيع وشراء الملكيات الفكرية بأمان وشفافية كاملة
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div 
                key={i} 
                className="group p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-orange-500/50 transition-all duration-300 hover:scale-105"
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

      {/* Featured Products Section */}
      <section className="py-24 px-6">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              منتجات مميزة
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              أفضل الملكيات الفكرية والحلول التقنية المعروضة للبيع الآن
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {products.map((product, i) => (
              <div 
                key={i} 
                className="group p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-orange-500/50 transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-sm font-semibold">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-semibold">{product.rating}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">{product.title}</h3>
                <p className="text-muted-foreground mb-4 text-sm">{product.seller}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-emerald-400">{product.price}</span>
                  <span className="text-sm text-muted-foreground">{product.sales} مبيعات</span>
                </div>
                <Button className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white">
                  عرض التفاصيل
                  <ArrowRight className="w-4 h-4 mr-2" />
                </Button>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/marketplace">
              <Button size="lg" variant="outline" className="text-lg px-8 h-14 border-orange-500/50 hover:bg-orange-500/10">
                عرض جميع المنتجات ({stats[0].value})
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
              كيف يعمل UPLINK3؟
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              عملية بسيطة وآمنة من العرض إلى إتمام الصفقة في 5 خطوات
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {process.map((item, i) => (
              <div key={i} className="relative flex gap-6 mb-8 last:mb-0">
                {/* Step Number */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {item.step}
                  </div>
                  {i < process.length - 1 && (
                    <div className="w-0.5 h-full bg-gradient-to-b from-orange-500 to-red-600 mx-auto mt-2" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-8">
                  <div className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300">
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
              انضم إلى آلاف المبتكرين والمستثمرين في سوق الملكية الفكرية الأكبر
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {benefits.map((benefit, i) => (
              <div 
                key={i} 
                className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-orange-500/50 transition-all duration-300 hover:scale-105"
              >
                <CheckCircle2 className="w-8 h-8 text-orange-400 mb-4" />
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
          <div className="max-w-4xl mx-auto text-center p-12 rounded-3xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30">
            <Zap className="w-16 h-16 text-orange-400 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              جاهز للبدء؟
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              ابدأ الآن في عرض أو شراء الملكيات الفكرية في سوق آمن ومضمون بعقود ذكية
            </p>
            {user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/marketplace">
                  <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-lg px-12 h-16 glow">
                    <ShoppingCart className="w-6 h-6 ml-2" />
                    تصفح السوق
                  </Button>
                </Link>
                <Link href="/marketplace/sell">
                  <Button size="lg" variant="outline" className="text-lg px-12 h-16 border-orange-500/50 hover:bg-orange-500/10">
                    <Sparkles className="w-6 h-6 ml-2" />
                    اعرض منتجك
                  </Button>
                </Link>
              </div>
            ) : (
              <a href={getLoginUrl()}>
                <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-lg px-12 h-16 glow">
                  <Sparkles className="w-6 h-6 ml-2" />
                  ابدأ الآن
                </Button>
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
