import { Link } from "wouter";
import { Shield, ArrowRight, Lock, Eye, Database, UserCheck, Bell, Mail } from "lucide-react";
import ImprovedFooter from "@/components/ImprovedFooter";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Privacy() {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const sections = isAr
    ? [
        {
          icon: Database,
          title: "Data We Collect",
          content: [
            isAr ? "معلومات الحساب: الاسم، البريد الإلكتروني، رقم الهاتف عند التسجيل." : "Account Info: Name, email, phone number upon registration.",
            isAr ? "بيانات الابتكار: الأفكار والمشاريع والملكية الفكرية التي تشاركها على المنصة." : "Innovation Data: Ideas, projects, IP shared on the platform.",
            isAr ? "بيانات الاستخدام: كيفية تفاعلك مع المنصة لتحسين تجربتك." : "Usage Data: How you interact with the platform to improve your experience.",
            isAr ? "البيانات التقنية: عنوان IP، نوع المتصفح، نظام التشغيل لأغراض الأمان." : "Technical Data: IP address, browser type, OS for security.",
          ],
        },
        {
          icon: Eye,
          title: "How We Use Your Data",
          content: [
            isAr ? "تقديم خدمات المنصة وتحسينها باستمرار." : "Provide and continuously improve platform services.",
            isAr ? "ربطك بالشركاء والمستثمرين والجهات الحكومية المناسبة." : "Connect you with relevant partners, investors, and government entities.",
            isAr ? "إرسال إشعارات مهمة تتعلق بمشاريعك وفرص التمويل." : "Send important notifications regarding your projects and funding opportunities.",
            isAr ? "تحليل الاتجاهات لتطوير منظومة الابتكار الوطنية." : "Analyze trends to develop the national innovation ecosystem.",
            isAr ? "الامتثال للمتطلبات القانونية والتنظيمية في المملكة العربية السعودية." : "Comply with legal and regulatory requirements in Saudi Arabia.",
          ],
        },
        {
          icon: Lock,
          title: "Protecting Your Data",
          content: [
            isAr ? "تشفير SSL/TLS لجميع البيانات المنقولة." : "SSL/TLS encryption for all transmitted data.",
            isAr ? "تشفير البيانات الحساسة في قواعد البيانات." : "Encryption of sensitive data in databases.",
            isAr ? "مراجعات أمنية دورية واختبارات الاختراق." : "Regular security audits and penetration testing.",
            isAr ? "صلاحيات وصول محدودة للموظفين وفق مبدأ الحاجة للمعرفة." : "Limited staff access based on need-to-know principle.",
            isAr ? "نسخ احتياطية منتظمة وخطط استمرارية الأعمال." : "Regular backups and business continuity plans.",
          ],
        },
        {
          icon: UserCheck,
          title: "Your Rights",
          content: [
            isAr ? "الوصول: يمكنك طلب نسخة من بياناتك الشخصية في أي وقت." : "Access: Request a copy of your personal data anytime.",
            isAr ? "التصحيح: يمكنك تحديث أو تصحيح بياناتك غير الدقيقة." : "Correction: Update or correct inaccurate data.",
            isAr ? "الحذف: يمكنك طلب حذف حسابك وبياناتك وفق الشروط المحددة." : "Deletion: Request account and data deletion under specified conditions.",
            isAr ? "الاعتراض: يمكنك الاعتراض على معالجة بياناتك لأغراض معينة." : "Objection: Object to data processing for specific purposes.",
            isAr ? "النقل: يمكنك طلب نقل بياناتك بصيغة قابلة للقراءة الآلية." : "Portability: Request your data in a machine-readable format.",
          ],
        },
        {
          icon: Bell,
          title: "Data Sharing",
          content: [
            isAr ? "لا نبيع بياناتك الشخصية لأي طرف ثالث." : "We do not sell your personal data to third parties.",
            isAr ? "نشارك البيانات مع شركاء موثوقين فقط بموافقتك الصريحة." : "We share data with trusted partners only with your explicit consent.",
            isAr ? "قد نشارك بيانات مجمّعة ومجهولة الهوية لأغراض البحث والإحصاء." : "We may share aggregated, anonymized data for research and statistics.",
            isAr ? "نلتزم بالإفصاح عند الطلب القانوني من الجهات المختصة." : "We comply with disclosure upon legal request from competent authorities.",
          ],
        },
        {
          icon: Mail,
          title: "Contact Us",
          content: [
            isAr ? "لأي استفسارات تتعلق بخصوصيتك، تواصل معنا عبر: privacy@naqla.sa" : "For privacy inquiries, contact us at: privacy@naqla.sa",
            isAr ? "يمكنك أيضاً زيارة صفحة اتصل بنا لتقديم طلباتك." : "You can also visit our Contact Us page to submit your requests.",
            isAr ? "سنرد على جميع الطلبات خلال 30 يوم عمل." : "We will respond to all requests within 30 business days.",
          ],
        },
      ]
    : [
        {
          icon: Database,
          title: "Data We Collect",
          content: [
            "Account information: name, email address, phone number upon registration.",
            "Innovation data: ideas, projects, and intellectual property you share on the platform.",
            "Usage data: how you interact with the platform to improve your experience.",
            "Technical data: IP address, browser type, operating system for security purposes.",
          ],
        },
        {
          icon: Eye,
          title: "How We Use Your Data",
          content: [
            "Providing and continuously improving platform services.",
            "Connecting you with appropriate partners, investors, and government entities.",
            "Sending important notifications related to your projects and funding opportunities.",
            "Analyzing trends to develop the national innovation ecosystem.",
            "Complying with legal and regulatory requirements in Saudi Arabia.",
          ],
        },
        {
          icon: Lock,
          title: "Protecting Your Data",
          content: [
            "SSL/TLS encryption for all data in transit.",
            "Encryption of sensitive data in databases.",
            "Regular security audits and penetration testing.",
            "Limited employee access based on the need-to-know principle.",
            "Regular backups and business continuity plans.",
          ],
        },
        {
          icon: UserCheck,
          title: "Your Rights",
          content: [
            "Access: You may request a copy of your personal data at any time.",
            "Correction: You may update or correct inaccurate data.",
            "Deletion: You may request deletion of your account and data under specified conditions.",
            "Objection: You may object to processing of your data for certain purposes.",
            "Portability: You may request transfer of your data in a machine-readable format.",
          ],
        },
        {
          icon: Bell,
          title: "Data Sharing",
          content: [
            "We do not sell your personal data to any third party.",
            "We share data with trusted partners only with your explicit consent.",
            "We may share aggregated and anonymized data for research and statistical purposes.",
            "We are committed to disclosure upon legal request from competent authorities.",
          ],
        },
        {
          icon: Mail,
          title: "Contact Us",
          content: [
            "For any privacy-related inquiries, contact us at: privacy@naqla.sa",
            "You may also visit our Contact page to submit your requests.",
            "We will respond to all requests within 30 business days.",
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
          <span className="text-sm font-medium">{isAr ? "سياسة الخصوصية" : "Privacy Policy"}</span>
        </div>
      </div>

      {/* Hero */}
      <div className="py-20 px-6 bg-gradient-to-b from-cyan-500/5 to-transparent">
        <div className="container max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {isAr ? "سياسة الخصوصية" : "Privacy Policy"}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {isAr
              ? isAr ? "نحن في منصة نقلة نلتزم بحماية خصوصيتك وأمان بياناتك. تعرّف على كيفية جمع بياناتك واستخدامها وحمايتها." : "At Naqla Platform, we are committed to protecting your privacy and data security. Learn how your data is collected, used, and protected."
              : "At NAQLA platform, we are committed to protecting your privacy and data security. Learn how your data is collected, used, and protected."}
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
                    <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center">
                      <Icon className="w-5 h-5 text-cyan-400" />
                    </div>
                    <h2 className="text-xl font-bold">{section.title}</h2>
                  </div>
                  <ul className="space-y-3">
                    {section.content.map((item, j) => (
                      <li key={j} className="flex items-start gap-3 text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Compliance Note */}
          <div className="mt-10 p-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl text-center">
            <p className="text-sm text-muted-foreground">
              {isAr
                ? isAr ? "تلتزم منصة نقلة بأحكام نظام حماية البيانات الشخصية في المملكة العربية السعودية (PDPL) والأنظمة الدولية ذات الصلة." : "Naqla Platform complies with the provisions of the Personal Data Protection Law (PDPL) in Saudi Arabia and relevant international regulations."
                : "NAQLA platform complies with the provisions of the Saudi Personal Data Protection Law (PDPL) and relevant international regulations."}
            </p>
          </div>
        </div>
      </div>

      <ImprovedFooter />
    </div>
  );
}
