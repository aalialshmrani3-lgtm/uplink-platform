import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { 
  Rocket, Shield, Brain, Users, Globe, Award, 
  ChevronRight, Lightbulb, Building2, Handshake,
  GraduationCap, Crown, Code, BarChart3, Zap
} from "lucide-react";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              UPLINK 5.0
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#engines" className="text-slate-300 hover:text-cyan-400 transition-colors">المحركات</a>
            <a href="#features" className="text-slate-300 hover:text-cyan-400 transition-colors">المميزات</a>
            <a href="#partners" className="text-slate-300 hover:text-cyan-400 transition-colors">الشركاء</a>
            <a href="#academy" className="text-slate-300 hover:text-cyan-400 transition-colors">الأكاديمية</a>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                  لوحة التحكم
                </Button>
              </Link>
            ) : (
              <a href={getLoginUrl()}>
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                  تسجيل الدخول
                </Button>
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-8">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
            <span className="text-cyan-400 text-sm">منظومة الابتكار الوطنية تحت مظلة HUMAIN</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            حوّل أفكارك إلى
            <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              ابتكارات عالمية
            </span>
          </h1>
          
          <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-10">
            منصة UPLINK 5.0 تربط المبتكرين السعوديين بالمستثمرين والشركات والجهات الحكومية
            من خلال ثلاثة محركات متكاملة: توليد الملكية الفكرية، التحديات والمطابقة، والسوق المفتوح
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link href="/projects/new">
                <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-lg px-8 py-6">
                  <Lightbulb className="w-5 h-5 ml-2" />
                  سجّل ابتكارك الآن
                </Button>
              </Link>
            ) : (
              <a href={getLoginUrl()}>
                <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-lg px-8 py-6">
                  <Lightbulb className="w-5 h-5 ml-2" />
                  ابدأ رحلة الابتكار
                </Button>
              </a>
            )}
            <a href="#engines">
              <Button size="lg" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 text-lg px-8 py-6">
                اكتشف المحركات
                <ChevronRight className="w-5 h-5 mr-2" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 border-y border-slate-800 bg-slate-900/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "500+", label: "ابتكار مسجل", icon: Lightbulb },
              { value: "150+", label: "مستثمر نشط", icon: Building2 },
              { value: "50+", label: "شراكة استراتيجية", icon: Handshake },
              { value: "10M+", label: "ريال استثمارات", icon: BarChart3 },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <stat.icon className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Three Engines Section */}
      <section id="engines" className="py-24 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">المحركات الثلاثة</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              منظومة متكاملة تأخذ ابتكارك من الفكرة إلى السوق العالمي
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* UPLINK1 */}
            <Card className="bg-gradient-to-br from-emerald-950/50 to-slate-900 border-emerald-800/50 hover:border-emerald-600/50 transition-all group">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-white">UPLINK1</CardTitle>
                <CardDescription className="text-emerald-400 text-lg">توليد وفرز الملكية الفكرية</CardDescription>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-4">
                <p>تسجيل وحماية الملكية الفكرية عبر SAIP و WIPO مع توثيق البلوكتشين</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    تسجيل براءات الاختراع
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    حماية العلامات التجارية
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    توثيق بلوكتشين آمن
                  </li>
                </ul>
                <Link href="/ip/register">
                  <Button variant="outline" className="w-full mt-4 border-emerald-700 text-emerald-400 hover:bg-emerald-950">
                    سجّل ملكيتك الفكرية
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* UPLINK2 */}
            <Card className="bg-gradient-to-br from-blue-950/50 to-slate-900 border-blue-800/50 hover:border-blue-600/50 transition-all group">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-white">UPLINK2</CardTitle>
                <CardDescription className="text-blue-400 text-lg">التحديات والمطابقة الذكية</CardDescription>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-4">
                <p>تقييم AI متقدم ومطابقة ذكية مع المستثمرين والشركات المناسبة</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-400" />
                    تقييم ذكاء اصطناعي
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-400" />
                    تحديات ومسابقات
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-400" />
                    مطابقة مع المستثمرين
                  </li>
                </ul>
                <Link href="/challenges">
                  <Button variant="outline" className="w-full mt-4 border-blue-700 text-blue-400 hover:bg-blue-950">
                    استكشف التحديات
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* UPLINK3 */}
            <Card className="bg-gradient-to-br from-purple-950/50 to-slate-900 border-purple-800/50 hover:border-purple-600/50 transition-all group">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-white">UPLINK3</CardTitle>
                <CardDescription className="text-purple-400 text-lg">السوق والتبادل</CardDescription>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-4">
                <p>سوق مفتوح للابتكارات مع عقود ذكية ونظام ضمان (Escrow)</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-purple-400" />
                    عقود ذكية آمنة
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-purple-400" />
                    نظام ضمان Escrow
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-purple-400" />
                    توقيع إلكتروني
                  </li>
                </ul>
                <Link href="/marketplace">
                  <Button variant="outline" className="w-full mt-4 border-purple-700 text-purple-400 hover:bg-purple-950">
                    تصفح السوق
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-slate-900/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">مميزات المنصة</h2>
            <p className="text-slate-400 text-lg">كل ما تحتاجه لتحويل فكرتك إلى نجاح تجاري</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Brain, title: "تقييم AI متقدم", desc: "خوارزميات ذكاء اصطناعي لتقييم الابتكارات", color: "cyan" },
              { icon: Shield, title: "حماية IP", desc: "تسجيل وحماية الملكية الفكرية", color: "emerald" },
              { icon: Handshake, title: "عقود ذكية", desc: "عقود آمنة مع نظام Escrow", color: "blue" },
              { icon: GraduationCap, title: "أكاديمية UPLINK", desc: "دورات معتمدة من شركاء عالميين", color: "purple" },
              { icon: Crown, title: "نادي النخبة", desc: "مزايا حصرية للأعضاء المميزين", color: "amber" },
              { icon: Code, title: "بوابة المطورين", desc: "API متكامل للتكامل مع أنظمتك", color: "rose" },
              { icon: Globe, title: "شبكة عالمية", desc: "سفراء في 50+ دولة", color: "teal" },
              { icon: BarChart3, title: "تحليلات متقدمة", desc: "لوحة تحكم بإحصائيات فورية", color: "indigo" },
            ].map((feature, i) => (
              <Card key={i} className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all">
                <CardContent className="pt-6">
                  <feature.icon className={`w-10 h-10 text-${feature.color}-400 mb-4`} />
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Academy Section */}
      <section id="academy" className="py-24 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full mb-6">
                <GraduationCap className="w-4 h-4 text-purple-400" />
                <span className="text-purple-400 text-sm">أكاديمية UPLINK</span>
              </div>
              <h2 className="text-4xl font-bold text-white mb-6">
                طوّر مهاراتك مع أفضل الخبراء
              </h2>
              <p className="text-slate-400 text-lg mb-8">
                دورات تدريبية معتمدة من جامعة KAUST وشركاء عالميين في مجالات الابتكار وريادة الأعمال والملكية الفكرية
              </p>
              <div className="space-y-4">
                {[
                  "شهادات معتمدة دولياً",
                  "محتوى من خبراء عالميين",
                  "تطبيق عملي على مشاريع حقيقية",
                  "دعم وإرشاد مستمر",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <Zap className="w-3 h-3 text-purple-400" />
                    </div>
                    <span className="text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
              <Link href="/academy">
                <Button className="mt-8 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700">
                  استكشف الدورات
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: "أساسيات الابتكار", level: "مبتدئ", duration: "8 ساعات" },
                { title: "الملكية الفكرية", level: "متوسط", duration: "12 ساعة" },
                { title: "ريادة الأعمال", level: "متقدم", duration: "20 ساعة" },
                { title: "التمويل والاستثمار", level: "خبير", duration: "16 ساعة" },
              ].map((course, i) => (
                <Card key={i} className="bg-slate-800/50 border-slate-700">
                  <CardContent className="pt-6">
                    <div className="text-xs text-purple-400 mb-2">{course.level}</div>
                    <h4 className="text-white font-medium mb-2">{course.title}</h4>
                    <div className="text-slate-500 text-sm">{course.duration}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section id="partners" className="py-24 px-6 bg-slate-900/50">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">شركاؤنا الاستراتيجيون</h2>
          <p className="text-slate-400 text-lg mb-12">نعمل مع أفضل المؤسسات لدعم الابتكار السعودي</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 items-center opacity-70">
            {["HUMAIN", "KAUST", "SAIP", "SDAIA", "RDIA", "MCIT", "Monshaat"].map((partner, i) => (
              <div key={i} className="bg-slate-800/50 rounded-xl p-6 hover:bg-slate-800 transition-colors">
                <span className="text-slate-300 font-semibold">{partner}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-cyan-900/50 to-blue-900/50 rounded-3xl p-12 text-center border border-cyan-800/50">
            <h2 className="text-4xl font-bold text-white mb-6">
              جاهز لبدء رحلة الابتكار؟
            </h2>
            <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
              انضم إلى آلاف المبتكرين السعوديين واحصل على الدعم الكامل لتحويل فكرتك إلى واقع
            </p>
            {user ? (
              <Link href="/dashboard">
                <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 text-lg px-8 py-6">
                  انتقل إلى لوحة التحكم
                  <ChevronRight className="w-5 h-5 mr-2" />
                </Button>
              </Link>
            ) : (
              <a href={getLoginUrl()}>
                <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 text-lg px-8 py-6">
                  سجّل الآن مجاناً
                  <ChevronRight className="w-5 h-5 mr-2" />
                </Button>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-800">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">UPLINK 5.0</span>
              </div>
              <p className="text-slate-400 text-sm">
                منظومة الابتكار الوطنية تحت مظلة HUMAIN
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">المحركات</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="/ip/register" className="hover:text-cyan-400">UPLINK1 - الملكية الفكرية</Link></li>
                <li><Link href="/challenges" className="hover:text-cyan-400">UPLINK2 - التحديات</Link></li>
                <li><Link href="/marketplace" className="hover:text-cyan-400">UPLINK3 - السوق</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">المميزات</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="/academy" className="hover:text-cyan-400">الأكاديمية</Link></li>
                <li><Link href="/elite" className="hover:text-cyan-400">نادي النخبة</Link></li>
                <li><Link href="/developers" className="hover:text-cyan-400">بوابة المطورين</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">تواصل معنا</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>info@uplink.sa</li>
                <li>الرياض، المملكة العربية السعودية</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-500 text-sm">
            © 2026 UPLINK 5.0 - جميع الحقوق محفوظة | تحت مظلة HUMAIN
          </div>
        </div>
      </footer>
    </div>
  );
}
