import { Check, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Integrations() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const categories = [
    {
      name: "إدارة المشاريع",
      icon: "📊",
      integrations: [
        { name: "Jira", logo: "🔷", status: "متاح", description: "ربط المشاريع والمهام تلقائياً" },
        { name: "Asana", logo: "🔴", status: "متاح", description: "مزامنة الفرق والمشاريع" },
        { name: "Monday.com", logo: "🟣", status: "متاح", description: "إدارة سير العمل المتكاملة" },
        { name: "Trello", logo: "🔵", status: "متاح", description: "تنظيم الأفكار والمهام" },
      ],
    },
    {
      name: "التواصل والتعاون",
      icon: "💬",
      integrations: [
        { name: "Microsoft Teams", logo: "🟦", status: "متاح", description: "إشعارات فورية وتعاون" },
        { name: "Slack", logo: "💬", status: "متاح", description: "قنوات مخصصة للابتكار" },
        { name: "Zoom", logo: "📹", status: "متاح", description: "اجتماعات مدمجة" },
        { name: "Google Meet", logo: "🎥", status: "متاح", description: "مؤتمرات فيديو سلسة" },
      ],
    },
    {
      name: "أنظمة الأعمال",
      icon: "🏢",
      integrations: [
        { name: "Salesforce", logo: "☁️", status: "متاح", description: "إدارة علاقات العملاء" },
        { name: "SAP", logo: "🔶", status: "متاح", description: "تكامل أنظمة المؤسسات" },
        { name: "Oracle", logo: "🔴", status: "قريباً", description: "قواعد البيانات المؤسسية" },
        { name: "Microsoft Dynamics", logo: "🟦", status: "متاح", description: "إدارة الموارد" },
      ],
    },
    {
      name: "التخزين السحابي",
      icon: "☁️",
      integrations: [
        { name: "Google Drive", logo: "📁", status: "متاح", description: "تخزين ومشاركة الملفات" },
        { name: "Dropbox", logo: "📦", status: "متاح", description: "مزامنة المستندات" },
        { name: "OneDrive", logo: "☁️", status: "متاح", description: "تكامل Microsoft 365" },
        { name: "Box", logo: "📦", status: "متاح", description: "إدارة المحتوى المؤسسي" },
      ],
    },
    {
      name: "التحليلات والبيانات",
      icon: "📈",
      integrations: [
        { name: "Power BI", logo: "📊", status: "متاح", description: "تقارير وتحليلات متقدمة" },
        { name: "Tableau", logo: "📉", status: "متاح", description: "تصورات بيانية تفاعلية" },
        { name: "Google Analytics", logo: "📈", status: "متاح", description: "تتبع الأداء" },
        { name: "Mixpanel", logo: "📊", status: "قريباً", description: "تحليلات المستخدمين" },
      ],
    },
    {
      name: "الأمن والامتثال",
      icon: "🔒",
      integrations: [
        { name: "Okta", logo: "🔐", status: "متاح", description: "إدارة الهوية والوصول" },
        { name: "Azure AD", logo: "🔷", status: "متاح", description: "مصادقة Microsoft" },
        { name: "Auth0", logo: "🔒", status: "متاح", description: "مصادقة آمنة" },
        { name: "OneLogin", logo: "🔑", status: "قريباً", description: "تسجيل دخول موحد" },
      ],
    },
  ];

  const features = [
    {
      title: "تكامل سلس",
      description: "ربط سريع مع أنظمتك الحالية دون تعقيد",
      icon: "🔗",
    },
    {
      title: "مزامنة تلقائية",
      description: "تحديث البيانات في الوقت الفعلي عبر جميع الأنظمة",
      icon: "🔄",
    },
    {
      title: "أمان عالي",
      description: "تشفير من الطرف إلى الطرف لجميع البيانات",
      icon: "🔐",
    },
    {
      title: "API مفتوحة",
      description: "بناء تكاملات مخصصة حسب احتياجاتك",
      icon: "🔌",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            التكاملات
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            اربط NAQLA مع أدواتك المفضلة لتجربة عمل متكاملة وسلسة
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {features.map((feature) => (
            <Card key={feature.title} className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>

        {/* Integrations by Category */}
        <div className="space-y-12">
          {categories.map((category) => (
            <div key={category.name}>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl">{category.icon}</span>
                <h2 className="text-3xl font-bold">{category.name}</h2>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {category.integrations.map((integration) => (
                  <Card 
                    key={integration.name} 
                    className="p-6 hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-5xl">{integration.logo}</div>
                      <Badge 
                        variant={integration.status === "متاح" ? "default" : "secondary"}
                        className={integration.status === "متاح" ? "bg-green-500" : ""}
                      >
                        {integration.status}
                      </Badge>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2">{integration.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {integration.description}
                    </p>
                    
                    {integration.status === "متاح" && (
                      <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold">
                        تفعيل الآن
                        <ArrowRight size={16} />
                      </button>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Custom Integration CTA */}
        <Card className="mt-16 p-12 text-center bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-2 border-blue-500/20">
          <div className="text-5xl mb-6">🔌</div>
          <h2 className="text-3xl font-bold mb-4">{isAr ? "هل تحتاج تكاملاً مخصصاً؟" : "هل تحتاج تكامNoً مخصصاً؟"}</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            استخدم API المفتوحة لدينا لبناء تكاملات مخصصة تناسب احتياجات مؤسستك
          </p>
          <div className="flex gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-lg hover:shadow-lg transition-all">
              استكشف API
            </button>
            <button className="px-8 py-4 bg-background border-2 border-blue-600 text-blue-600 rounded-lg font-semibold text-lg hover:shadow-lg transition-all">
              تحدث مع فريقنا
            </button>
          </div>
        </Card>

        {/* Stats */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              50+
            </div>
            <p className="text-muted-foreground">{isAr ? "تكامل متاح" : "[تكامل متاح]"}</p>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              99.9%
            </div>
            <p className="text-muted-foreground">{isAr ? "وقت التشغيل" : "وقت Operation"}</p>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              &lt;5 دقائق
            </div>
            <p className="text-muted-foreground">{isAr ? "وقت الإعداد" : "[وقت الإعداد]"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
