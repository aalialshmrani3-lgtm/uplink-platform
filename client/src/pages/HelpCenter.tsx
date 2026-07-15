import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Book, Video, MessageCircle, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function HelpCenter() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const categories = [
    {
      title: "البدء السريع",
      icon: "🚀",
      color: "from-blue-500 to-cyan-500",
      guides: [
        "كيفية إنشاء حساب جديد",
        "إعداد ملفك الشخصي",
        "تسجيل أول فكرة",
        "دعوة أعضاء الفريق",
      ],
    },
    {
      title: "الملكية الفكرية",
      icon: "⚖️",
      color: "from-purple-500 to-pink-500",
      guides: [
        "تسجيل براءة اختراع",
        "حماية العلامة التجارية",
        "توثيق Blockchain",
        "التكامل مع SAIP و WIPO",
      ],
    },
    {
      title: "إدارة المشاريع",
      icon: "📊",
      color: "from-green-500 to-emerald-500",
      guides: [
        "إنشاء مشروع جديد",
        "تتبع تقدم المشروع",
        "التعاون مع الفريق",
        "تقييم AI للمشاريع",
      ],
    },
    {
      title: "التمويل والعقود",
      icon: "💰",
      color: "from-orange-500 to-red-500",
      guides: [
        "البحث عن مستثمرين",
        "إنشاء عقد ذكي",
        "إدارة الضمان المالي",
        "التوقيعات الإلكترونية",
      ],
    },
  ];

  const faqs = [
    {
      question: "ما هي NAQLA 5.0؟",
      answer: "NAQLA 5.0 هي منصة متكاملة لإدارة الابتكار تجمع بين الذكاء الاصطناعي، البلوكتشين، والعقود الذكية لتوفير حل شامل للمبتكرين والمستثمرين والشركات.",
    },
    {
      question: "كيف يعمل نظام التقييم بالذكاء الاصطناعي؟",
      answer: "يستخدم نظامنا خوارزميات متقدمة لتحليل الأفكار والمشاريع بناءً على معايير متعددة مثل الجدوى التقنية، الإمكانات التجارية، والتأثير المتوقع. يوفر النظام تقييماً موضوعياً وتوصيات مفصلة.",
    },
    {
      question: "هل بياناتي آمنة على المنصة؟",
      answer: "نعم، نستخدم أعلى معايير الأمان بما في ذلك التشفير من الطرف إلى الطرف، توثيق Blockchain، والامتثال الكامل لمعايير GDPR و PDPL. بياناتك محمية بالكامل.",
    },
    {
      question: "كم تكلفة استخدام المنصة؟",
      answer: "نقدم خطط مرنة تبدأ من الخطة المجانية للأفراد، وخطط مخصصة للشركات والمؤسسات. يمكنك البدء مجاناً واختيار الخطة المناسبة حسب احتياجاتك.",
    },
    {
      question: "هل يمكنني تكامل NAQLA مع أنظمتي الحالية؟",
      answer: "نعم، نوفر أكثر من 50 تكامل جاهز مع أنظمة مثل Jira، Slack، Salesforce، وغيرها. كما نوفر API مفتوحة لبناء تكاملات مخصصة.",
    },
    {
      question: "كيف أحمي ملكيتي الفكرية؟",
      answer: "نوفر نظام توثيق متقدم بتقنية Blockchain يسجل جميع أفكارك ومشاريعك بطابع زمني غير قابل للتعديل. كما نتكامل مع SAIP و WIPO لتسجيل رسمي.",
    },
    {
      question: "ما هو نادي النخبة؟",
      answer: "نادي النخبة هو برنامج عضوية حصري للمبتكرين المتميزين يوفر مزايا خاصة مثل الوصول المبكر للميزات، التواصل المباشر مع المستثمرين، والتدريب المتخصص.",
    },
    {
      question: "هل تقدمون دعماً فنياً؟",
      answer: "نعم، نوفر دعماً فنياً على مدار الساعة عبر الدردشة المباشرة، البريد الإلكتروني، والهاتف. فريقنا جاهز لمساعدتك في أي وقت.",
    },
  ];

  const resources = [
    {
      title: "مكتبة الفيديو",
      description: "شروحات مصورة لجميع ميزات المنصة",
      icon: <Video className="text-red-600" size={32} />,
      count: "50+ فيديو",
    },
    {
      title: "الوثائق التقنية",
      description: "دليل شامل للمطورين والمستخدمين",
      icon: <FileText className="text-blue-600" size={32} />,
      count: "200+ صفحة",
    },
    {
      title: "الندوات التفاعلية",
      description: "جلسات مباشرة مع خبراء الابتكار",
      icon: <MessageCircle className="text-green-600" size={32} />,
      count: "أسبوعياً",
    },
    {
      title: "قاعدة المعرفة",
      description: "مقالات وأدلة مفصلة",
      icon: <Book className="text-purple-600" size={32} />,
      count: "300+ مقال",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            مركز المساعدة
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            كل ما تحتاجه للبدء والنجاح مع NAQLA 5.0
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              type="text"
              placeholder="ابحث عن إجابة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-12 py-6 text-lg"
            />
          </div>
        </div>

        {/* Quick Start Guides */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">{isAr ? "أدلة البدء السريع" : "[أدلة البدء السريع]"}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Card key={category.title} className="p-6 hover:shadow-xl transition-all hover:-translate-y-1">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${category.color} flex items-center justify-center text-3xl mb-4`}>
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{category.title}</h3>
                <ul className="space-y-2">
                  {category.guides.map((guide) => (
                    <li key={guide} className="text-sm text-muted-foreground hover:text-blue-600 cursor-pointer transition-colors">
                      • {guide}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>

        {/* Resources */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">{isAr ? "موارد التعلم" : "[موارد التعلم]"}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource) => (
              <Card key={resource.title} className="p-6 text-center hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer">
                <div className="flex justify-center mb-4">{resource.icon}</div>
                <h3 className="text-lg font-bold mb-2">{resource.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>
                <div className="text-xs font-semibold text-blue-600">{resource.count}</div>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">{isAr ? "الأسئلة الشائعة" : "[الأسئلة الشائعة]"}</h2>
          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="overflow-hidden">
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                  className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors text-right"
                >
                  <span className="font-semibold text-lg">{faq.question}</span>
                  {expandedFAQ === index ? (
                    <ChevronUp className="text-blue-600 flex-shrink-0" size={24} />
                  ) : (
                    <ChevronDown className="text-muted-foreground flex-shrink-0" size={24} />
                  )}
                </button>
                {expandedFAQ === index && (
                  <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <Card className="p-12 text-center bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-2 border-blue-500/20">
          <div className="text-5xl mb-6">💬</div>
          <h2 className="text-3xl font-bold mb-4">{isAr ? "لم تجد ما تبحث عنه؟" : "لم تجد ما تSearch عنه؟"}</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            فريق الدعم الفني متاح على مدار الساعة لمساعدتك
          </p>
          <div className="flex gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-lg hover:shadow-lg transition-all">
              تحدث معنا الآن
            </button>
            <button className="px-8 py-4 bg-background border-2 border-blue-600 text-blue-600 rounded-lg font-semibold text-lg hover:shadow-lg transition-all">
              أرسل بريد إلكتروني
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
