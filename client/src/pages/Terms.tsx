import { Link } from "wouter";
import { FileText, ArrowRight, CheckCircle, AlertTriangle, Scale, Users, Zap, Globe } from "lucide-react";
import ImprovedFooter from "@/components/ImprovedFooter";

export default function Terms() {
  const sections = [
    {
      icon: CheckCircle,
      title: "قبول الشروط",
      content: [
        "باستخدامك منصة نقلة، فإنك توافق على الالتزام بهذه الشروط والأحكام.",
        "إذا كنت تمثل مؤسسة، فإنك تؤكد صلاحيتك لقبول هذه الشروط نيابةً عنها.",
        "نحتفظ بحق تعديل هذه الشروط في أي وقت مع إشعار مسبق.",
        "استمرارك في استخدام المنصة بعد التعديلات يعني قبولك للشروط الجديدة.",
      ],
    },
    {
      icon: Users,
      title: "شروط الاستخدام",
      content: [
        "يجب أن يكون عمرك 18 سنة أو أكثر لاستخدام المنصة.",
        "تلتزم بتقديم معلومات دقيقة وصحيحة عند التسجيل.",
        "أنت مسؤول عن الحفاظ على سرية بيانات حسابك.",
        "يُحظر استخدام المنصة لأغراض غير قانونية أو مضرة.",
        "يُحظر انتهاك حقوق الملكية الفكرية للآخرين.",
        "يُحظر نشر محتوى مضلل أو مسيء أو مخالف للأنظمة السعودية.",
      ],
    },
    {
      icon: Zap,
      title: "الملكية الفكرية",
      content: [
        "تحتفظ بملكية جميع الأفكار والابتكارات التي تشاركها على المنصة.",
        "تمنحنا ترخيصاً محدوداً لعرض محتواك وتسهيل الوصول إليه من قِبل الشركاء.",
        "لا تنتقل ملكية ابتكاراتك إلى المنصة أو أي طرف ثالث دون موافقتك الصريحة.",
        "أي عقود ملكية فكرية تُبرم عبر المنصة تخضع للقانون السعودي والدولي.",
        "نحمي حقوقك الفكرية ونوفر أدوات التوثيق والحماية القانونية.",
      ],
    },
    {
      icon: Scale,
      title: "المسؤولية والضمانات",
      content: [
        "تُقدَّم المنصة 'كما هي' دون ضمانات صريحة أو ضمنية.",
        "لا نضمن توافر المنصة بشكل مستمر أو خالٍ من الأخطاء.",
        "لا نتحمل مسؤولية الخسائر الناجمة عن قرارات الاستثمار أو الأعمال.",
        "مسؤوليتنا محدودة بقيمة الاشتراك المدفوع خلال الاثني عشر شهراً الماضية.",
        "لا نتحمل مسؤولية أي خسائر غير مباشرة أو تبعية.",
      ],
    },
    {
      icon: Globe,
      title: "القانون المطبق والتحكيم",
      content: [
        "تخضع هذه الشروط لأحكام نظام التجارة الإلكترونية السعودي.",
        "تُحسم النزاعات أولاً عبر التفاوض الودي خلال 30 يوماً.",
        "في حال فشل التفاوض، يُلجأ إلى التحكيم وفق أنظمة المركز السعودي للتحكيم التجاري.",
        "تختص المحاكم السعودية بالفصل في أي نزاعات لا تُحسم بالتحكيم.",
      ],
    },
    {
      icon: AlertTriangle,
      title: "إنهاء الحساب",
      content: [
        "يمكنك إنهاء حسابك في أي وقت من خلال إعدادات الحساب.",
        "نحتفظ بحق تعليق أو إنهاء الحسابات التي تنتهك هذه الشروط.",
        "عند إنهاء الحساب، يمكنك طلب نسخة من بياناتك خلال 30 يوماً.",
        "تستمر بعض الأحكام (كالملكية الفكرية والمسؤولية) بعد إنهاء الحساب.",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-40">
        <div className="container flex items-center gap-4 h-16">
          <Link href="/">
            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              <ArrowRight className="w-4 h-4" />
              <span className="text-sm">العودة للرئيسية</span>
            </div>
          </Link>
          <span className="text-border/50">|</span>
          <span className="text-sm font-medium">الشروط والأحكام</span>
        </div>
      </div>

      {/* Hero */}
      <div className="py-20 px-6 bg-gradient-to-b from-blue-500/5 to-transparent">
        <div className="container max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">الشروط والأحكام</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            يرجى قراءة هذه الشروط والأحكام بعناية قبل استخدام منصة نقلة. استخدامك للمنصة يعني موافقتك على هذه الشروط.
          </p>
          <p className="text-sm text-muted-foreground mt-4">آخر تحديث: يناير 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="py-16 px-6">
        <div className="container max-w-4xl mx-auto">
          <div className="space-y-10">
            {sections.map((section, i) => {
              const Icon = section.icon;
              return (
                <div key={i} className="border border-border/50 rounded-2xl p-8 bg-card/20">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                      <Icon className="w-5 h-5 text-blue-400" />
                    </div>
                    <h2 className="text-xl font-bold">{section.title}</h2>
                  </div>
                  <ul className="space-y-3">
                    {section.content.map((item, j) => (
                      <li key={j} className="flex items-start gap-3 text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Contact Note */}
          <div className="mt-10 p-6 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-2xl text-center">
            <p className="text-sm text-muted-foreground mb-2">
              للاستفسار عن هذه الشروط، تواصل معنا عبر:
            </p>
            <a href="mailto:legal@naqla.sa" className="text-blue-400 hover:text-blue-300 font-medium text-sm">
              legal@naqla.sa
            </a>
          </div>
        </div>
      </div>

      <ImprovedFooter />
    </div>
  );
}
