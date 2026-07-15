import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Rocket, Code, Terminal, Database, Cloud, 
  Key, BookOpen, Zap, Globe, Shield
} from "lucide-react";

export default function Developers() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const apiEndpoints = [
    {
      method: "POST",
      path: "/api/v1/projects",
      description: "إنشاء مشروع جديد",
      auth: true,
    },
    {
      method: "GET",
      path: "/api/v1/projects/:id",
      description: "الحصول على تفاصيل مشروع",
      auth: true,
    },
    {
      method: "POST",
      path: "/api/v1/ip/register",
      description: "تسجيل ملكية فكرية",
      auth: true,
    },
    {
      method: "POST",
      path: "/api/v1/evaluate",
      description: "تقييم مشروع بالذكاء الاصطناعي",
      auth: true,
    },
    {
      method: "GET",
      path: "/api/v1/challenges",
      description: "قائمة التحديات المتاحة",
      auth: false,
    },
    {
      method: "GET",
      path: "/api/v1/marketplace",
      description: "استعراض سوق الابتكارات",
      auth: false,
    },
  ];

  const sdks = [
    { name: "Python SDK", version: "2.0.1", icon: "🐍" },
    { name: "JavaScript SDK", version: "2.0.0", icon: "📜" },
    { name: "REST API", version: "v1", icon: "🔗" },
    { name: "GraphQL", version: "beta", icon: "📊" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                NAQLA 5.0
              </span>
            </div>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="border-slate-700 text-slate-300">
              لوحة التحكم
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full mb-4">
            <Code className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm">{isAr ? "بوابة المطورين" : "بوابة المDevelopين"}</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">NAQLA API</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            ادمج منصة NAQLA مع أنظمتك واستفد من قوة الذكاء الاصطناعي في تقييم الابتكارات
          </p>
        </div>

        {/* Quick Start */}
        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              البدء السريع
            </h2>
            <div className="bg-slate-900 rounded-xl p-4 font-mono text-sm">
              <div className="text-slate-400 mb-2">{isAr ? "# تثبيت SDK" : "[# تثبيت SDK]"}</div>
              <div className="text-green-400 mb-4">pip install naqla-sdk</div>
              
              <div className="text-slate-400 mb-2">{isAr ? "# استخدام API" : "[# استخدام API]"}</div>
              <div className="text-cyan-400">
                <span className="text-purple-400">from</span> naqla <span className="text-purple-400">import</span> NaqlaClient
              </div>
              <div className="text-white mt-2">
                client = NaqlaClient(api_key=<span className="text-amber-400">"your_api_key"</span>)
              </div>
              <div className="text-white mt-2">
                result = client.evaluate(project_data)
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SDKs */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {sdks.map((sdk, i) => (
            <Card key={i} className="bg-slate-800/50 border-slate-700 hover:border-green-600/50 transition-all cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className="text-3xl mb-2">{sdk.icon}</div>
                <h3 className="text-white font-semibold">{sdk.name}</h3>
                <span className="text-slate-400 text-sm">v{sdk.version}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* API Endpoints */}
        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-cyan-400" />
              نقاط النهاية (Endpoints)
            </h2>
            <div className="space-y-3">
              {apiEndpoints.map((endpoint, i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-slate-900/50 rounded-lg">
                  <span className={`px-3 py-1 rounded text-xs font-bold ${
                    endpoint.method === "GET" ? "bg-green-500/20 text-green-400" :
                    endpoint.method === "POST" ? "bg-blue-500/20 text-blue-400" :
                    endpoint.method === "PUT" ? "bg-amber-500/20 text-amber-400" :
                    "bg-red-500/20 text-red-400"
                  }`}>
                    {endpoint.method}
                  </span>
                  <code className="text-cyan-400 font-mono text-sm flex-1">{endpoint.path}</code>
                  <span className="text-slate-400 text-sm">{endpoint.description}</span>
                  {endpoint.auth && (
                    <Key className="w-4 h-4 text-amber-400" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <Database className="w-10 h-10 text-cyan-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">{isAr ? "قاعدة بيانات موحدة" : "قاعدة بيانات موBorderة"}</h3>
              <p className="text-slate-400 text-sm">
                وصول مباشر لقاعدة بيانات الابتكارات والملكيات الفكرية
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <Cloud className="w-10 h-10 text-purple-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">{isAr ? "تقييم AI سحابي" : "[تقييم AI سحابي]"}</h3>
              <p className="text-slate-400 text-sm">
                استخدم محرك التقييم الذكي مباشرة من تطبيقاتك
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <Shield className="w-10 h-10 text-emerald-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">{isAr ? "أمان متقدم" : "[أمان متقدم]"}</h3>
              <p className="text-slate-400 text-sm">
                تشفير كامل وتوثيق OAuth 2.0 لحماية بياناتك
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Documentation CTA */}
        <Card className="bg-gradient-to-r from-green-950/50 to-slate-900 border-green-800/50">
          <CardContent className="p-8 text-center">
            <BookOpen className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">{isAr ? "التوثيق الكامل" : "Documentation الكامل"}</h2>
            <p className="text-slate-300 mb-6 max-w-xl mx-auto">
              استكشف التوثيق التفصيلي مع أمثلة عملية لكل نقطة نهاية
            </p>
            <div className="flex gap-4 justify-center">
              <Button className="bg-green-500 hover:bg-green-600">
                <BookOpen className="w-4 h-4 ml-2" />
                قراءة التوثيق
              </Button>
              <Button variant="outline" className="border-slate-700 text-slate-300">
                <Globe className="w-4 h-4 ml-2" />
                API Playground
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Rate Limits */}
        <div className="mt-8 p-6 bg-slate-800/30 rounded-xl border border-slate-700">
          <h3 className="text-white font-semibold mb-4">{isAr ? "حدود الاستخدام" : "حدود اNoستخدام"}</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Free Tier</span>
              <span className="text-white">{isAr ? "100 طلب/يوم" : "[100 طلب/يوم]"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Pro Tier</span>
              <span className="text-white">{isAr ? "10,000 طلب/يوم" : "[10,000 طلب/يوم]"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Enterprise</span>
              <span className="text-white">{isAr ? "غير محدود" : "غير مBorderود"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
