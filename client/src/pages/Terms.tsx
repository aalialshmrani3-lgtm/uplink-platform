import { Link } from "wouter";
import { FileText, ArrowRight, CheckCircle, AlertTriangle, Scale, Users, Zap, Globe } from "lucide-react";
import ImprovedFooter from "@/components/ImprovedFooter";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Terms() {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const sections = isAr
    ? [
        {
          icon: CheckCircle,
          title: "Accept Terms",
          content: [
            isAr ? "باستخدامك منصة نقلة، فإنك توافق على الالتزام بهذه الشروط والأحكام." : "By using Naqla platform, you agree to be bound by these Terms and Conditions.",
            isAr ? "إذا كنت تمثل مؤسسة، فإنك تؤكد صلاحيتك لقبول هذه الشروط نيابةً عنها." : "If you represent an organization, you confirm your authority to accept these terms on its behalf.",
            isAr ? "نحتفظ بحق تعديل هذه الشروط في أي وقت مع إشعار مسبق." : "We reserve the right to modify these terms at any time with prior notice.",
            isAr ? "استمرارك في استخدام المنصة بعد التعديلات يعني قبولك للشروط الجديدة." : "Your continued use of the platform after modifications signifies your acceptance of the new terms.",
          ],
        },
        {
          icon: Users,
          title: "Terms of Use",
          content: [
            isAr ? "يجب أن يكون عمرك 18 سنة أو أكثر لاستخدام المنصة." : "You must be 18 years or older to use the platform.",
            isAr ? "تلتزم بتقديم معلومات دقيقة وصحيحة عند التسجيل." : "You agree to provide accurate and truthful information upon registration.",
            isAr ? "أنت مسؤول عن الحفاظ على سرية بيانات حسابك." : "You are responsible for maintaining the confidentiality of your account data.",
            isAr ? "يُحظر استخدام المنصة لأغراض غير قانونية أو مضرة." : "Use of the platform for illegal or harmful purposes is prohibited.",
            isAr ? "يُحظر انتهاك حقوق الملكية الفكرية للآخرين." : "Infringement of others' intellectual property rights is prohibited.",
            isAr ? "يُحظر نشر محتوى مضلل أو مسيء أو مخالف للأنظمة السعودية." : "Posting misleading, offensive, or content violating Saudi regulations is prohibited.",
          ],
        },
        {
          icon: Zap,
          title: "Intellectual Property",
          content: [
            isAr ? "تحتفظ بملكية جميع الأفكار والابتكارات التي تشاركها على المنصة." : "You retain ownership of all ideas and innovations you share on the platform.",
            isAr ? "تمنحنا ترخيصاً محدوداً لعرض محتواك وتسهيل الوصول إليه من قِبل الشركاء." : "You grant us a limited license to display your content and facilitate partner access.",
            isAr ? "لا تنتقل ملكية ابتكاراتك إلى المنصة أو أي طرف ثالث دون موافقتك الصريحة." : "Ownership of your innovations does not transfer to the platform or any third party without your explicit consent.",
            isAr ? "أي عقود ملكية فكرية تُبرم عبر المنصة تخضع للقانون السعودي والدولي." : "Any IP contracts concluded via the platform are subject to Saudi and international law.",
            isAr ? "نحمي حقوقك الفكرية ونوفر أدوات التوثيق والحماية القانونية." : "We protect your intellectual rights and provide documentation and legal protection tools.",
          ],
        },
        {
          icon: Scale,
          title: "Liability and Warranties",
          content: [
            isAr ? "تُقدَّم المنصة 'كما هي' دون ضمانات صريحة أو ضمنية." : "The platform is provided 'as is' without express or implied warranties.",
            isAr ? "لا نضمن توافر المنصة بشكل مستمر أو خالٍ من الأخطاء." : "We do not guarantee continuous or error-free platform availability.",
            isAr ? "لا نتحمل مسؤولية الخسائر الناجمة عن قرارات الاستثمار أو الأعمال." : "We are not liable for losses resulting from investment or business decisions.",
            isAr ? "مسؤوليتنا محدودة بقيمة الاشتراك المدفوع خلال الاثني عشر شهراً الماضية." : "Our liability is limited to the subscription fee paid in the last twelve months.",
            isAr ? "لا نتحمل مسؤولية أي خسائر غير مباشرة أو تبعية." : "We are not liable for any indirect or consequential losses.",
          ],
        },
        {
          icon: Globe,
          title: "Governing Law and Arbitration",
          content: [
            isAr ? "تخضع هذه الشروط لأحكام نظام التجارة الإلكترونية السعودي." : "These terms are governed by the provisions of the Saudi E-commerce Law.",
            isAr ? "تُحسم النزاعات أولاً عبر التفاوض الودي خلال 30 يوماً." : "Disputes are first resolved through amicable negotiation within 30 days.",
            isAr ? "في حال فشل التفاوض، يُلجأ إلى التحكيم وفق أنظمة المركز السعودي للتحكيم التجاري." : "If negotiation fails, arbitration will be pursued according to the Saudi Center for Commercial Arbitration rules.",
            isAr ? "تختص المحاكم السعودية بالفصل في أي نزاعات لا تُحسم بالتحكيم." : "Saudi courts have jurisdiction over any disputes not resolved by arbitration.",
          ],
        },
        {
          icon: AlertTriangle,
          title: "Account Termination",
          content: [
            isAr ? "يمكنك إنهاء حسابك في أي وقت من خلال إعدادات الحساب." : "You can terminate your account at any time via account settings.",
            isAr ? "نحتفظ بحق تعليق أو إنهاء الحسابات التي تنتهك هذه الشروط." : "We reserve the right to suspend or terminate accounts violating these terms.",
            isAr ? "عند إنهاء الحساب، يمكنك طلب نسخة من بياناتك خلال 30 يوماً." : "Upon account termination, you can request a copy of your data within 30 days.",
            isAr ? "تستمر بعض الأحكام (كالملكية الفكرية والمسؤولية) بعد إنهاء الحساب." : "Certain provisions (e.g., IP, liability) survive account termination.",
          ],
        },
      ]
    : [
        {
          icon: CheckCircle,
          title: "Acceptance of Terms",
          content: [
            "By using the NAQLA platform, you agree to be bound by these terms and conditions.",
            "If you represent an organization, you confirm your authority to accept these terms on its behalf.",
            "We reserve the right to modify these terms at any time with prior notice.",
            "Continued use of the platform after modifications constitutes your acceptance of the new terms.",
          ],
        },
        {
          icon: Users,
          title: "Terms of Use",
          content: [
            "You must be 18 years of age or older to use the platform.",
            "You agree to provide accurate and truthful information when registering.",
            "You are responsible for maintaining the confidentiality of your account credentials.",
            "Use of the platform for illegal or harmful purposes is strictly prohibited.",
            "Infringement of others' intellectual property rights is prohibited.",
            "Publishing misleading, offensive, or content that violates Saudi regulations is prohibited.",
          ],
        },
        {
          icon: Zap,
          title: "Intellectual Property",
          content: [
            "You retain ownership of all ideas and innovations you share on the platform.",
            "You grant us a limited license to display your content and facilitate access by partners.",
            "Ownership of your innovations does not transfer to the platform or any third party without your explicit consent.",
            "Any intellectual property contracts concluded through the platform are subject to Saudi and international law.",
            "We protect your intellectual rights and provide documentation and legal protection tools.",
          ],
        },
        {
          icon: Scale,
          title: "Liability and Warranties",
          content: [
            "The platform is provided 'as is' without express or implied warranties.",
            "We do not guarantee continuous availability of the platform or that it will be error-free.",
            "We are not liable for losses resulting from investment or business decisions.",
            "Our liability is limited to the subscription amount paid during the past twelve months.",
            "We are not liable for any indirect or consequential losses.",
          ],
        },
        {
          icon: Globe,
          title: "Governing Law and Arbitration",
          content: [
            "These terms are governed by the provisions of the Saudi E-Commerce Law.",
            "Disputes shall first be resolved through amicable negotiation within 30 days.",
            "If negotiation fails, arbitration shall be pursued under the rules of the Saudi Center for Commercial Arbitration.",
            "Saudi courts shall have jurisdiction over any disputes not resolved by arbitration.",
          ],
        },
        {
          icon: AlertTriangle,
          title: "Account Termination",
          content: [
            "You may terminate your account at any time through account settings.",
            "We reserve the right to suspend or terminate accounts that violate these terms.",
            "Upon account termination, you may request a copy of your data within 30 days.",
            "Certain provisions (such as intellectual property and liability) survive account termination.",
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
              <span className="text-sm">{isAr ? "العودة للرئيسية" : "Back to Home"}</span>
            </div>
          </Link>
          <span className="text-border/50">|</span>
          <span className="text-sm font-medium">{isAr ? "الشروط والأحكام" : "Terms and Conditions"}</span>
        </div>
      </div>

      {/* Hero */}
      <div className="py-20 px-6 bg-gradient-to-b from-blue-500/5 to-transparent">
        <div className="container max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {isAr ? "الشروط والأحكام" : "Terms and Conditions"}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {isAr
              ? isAr ? "يرجى قراءة هذه الشروط والأحكام بعناية قبل استخدام منصة نقلة. استخدامك للمنصة يعني موافقتك على هذه الشروط." : "Please read these Terms and Conditions carefully before using Naqla platform. Your use implies agreement to these terms."
              : "Please read these terms and conditions carefully before using the NAQLA platform. Your use of the platform constitutes your acceptance of these terms."}
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            {isAr ? "آخر تحديث: يناير 2025" : "Last updated: January 2025"}
          </p>
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
              {isAr
                ? isAr ? "للاستفسار عن هذه الشروط، تواصل معنا عبر:" : "For inquiries about these terms, contact us via:"
                : "For inquiries about these terms, contact us at:"}
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
