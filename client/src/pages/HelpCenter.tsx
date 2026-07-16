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
      title: "Quick Start",
      icon: "🚀",
      color: "from-blue-500 to-cyan-500",
      guides: [
        isAr ? "كيفية إنشاء حساب جديد" : "How to Create an Account",
        isAr ? "إعداد ملفك الشخصي" : "Set Up Your Profile",
        isAr ? "تسجيل أول فكرة" : "Register First Idea",
        isAr ? "دعوة أعضاء الفريق" : "Invite Team Members",
      ],
    },
    {
      title: "Intellectual Property",
      icon: "⚖️",
      color: "from-purple-500 to-pink-500",
      guides: [
        isAr ? "تسجيل براءة اختراع" : "Patent Registration",
        isAr ? "حماية العلامة التجارية" : "Trademark Protection",
        isAr ? "توثيق Blockchain" : "Blockchain Documentation",
        isAr ? "التكامل مع SAIP و WIPO" : "SAIP & WIPO Integration",
      ],
    },
    {
      title: "Project Management",
      icon: "📊",
      color: "from-green-500 to-emerald-500",
      guides: [
        isAr ? "إنشاء مشروع جديد" : "Create New Project",
        isAr ? "تتبع تقدم المشروع" : "Track Project Progress",
        isAr ? "التعاون مع الفريق" : "Collaborate with Team",
        isAr ? "تقييم AI للمشاريع" : "AI Project Evaluation",
      ],
    },
    {
      title: "Funding & Contracts",
      icon: "💰",
      color: "from-orange-500 to-red-500",
      guides: [
        isAr ? "البحث عن مستثمرين" : "Find Investors",
        isAr ? "إنشاء عقد ذكي" : "Create Smart Contract",
        isAr ? "إدارة الضمان المالي" : "Manage Financial Guarantee",
        isAr ? "التوقيعات الإلكترونية" : "Electronic Signatures",
      ],
    },
  ];

  const faqs = [
    {
      question: "What is NAQLA 5.0?",
      answer: "NAQLA 5.0 is an integrated innovation management platform combining AI, blockchain, and smart contracts to provide a comprehensive solution for innovators, investors, and businesses.",
    },
    {
      question: "How does the AI evaluation system work?",
      answer: "Our system uses advanced algorithms to analyze ideas and projects based on criteria such as technical feasibility, commercial potential, and expected impact. It provides objective evaluations and detailed recommendations.",
    },
    {
      question: "Is my data secure on the platform?",
      answer: "Yes, we use the highest security standards, including end-to-end encryption, blockchain authentication, and full compliance with GDPR and PDPL. Your data is fully protected.",
    },
    {
      question: "How much does it cost to use the platform?",
      answer: "We offer flexible plans, starting with a free plan for individuals, and custom plans for businesses and organizations. You can start for free and choose the plan that suits your needs.",
    },
    {
      question: "Can I integrate NAQLA with my existing systems?",
      answer: "Yes, we offer over 50 ready-made integrations with systems like Jira, Slack, Salesforce, and more. We also provide open APIs for building custom integrations.",
    },
    {
      question: "How do I protect my IP?",
      answer: "We offer an advanced Blockchain-based documentation system that immutably timestamps all your ideas and projects. We also integrate with SAIP and WIPO for official registration.",
    },
    {
      question: "What is the Elite Club?",
      answer: "The Elite Club is an exclusive membership program for outstanding innovators, offering special benefits like early feature access, direct investor connections, and specialized training.",
    },
    {
      question: "Do you offer technical support?",
      answer: "Yes, we provide 24/7 technical support via live chat, email, and phone. Our team is ready to assist you anytime.",
    },
  ];

  const resources = [
    {
      title: "Video Library",
      description: "Video tutorials for all platform features",
      icon: <Video className="text-red-600" size={32} />,
      count: "50+ videos",
    },
    {
      title: "Technical Documentation",
      description: "Comprehensive guide for developers and users",
      icon: <FileText className="text-blue-600" size={32} />,
      count: "200+ pages",
    },
    {
      title: "Interactive Webinars",
      description: "Live sessions with innovation experts",
      icon: <MessageCircle className="text-green-600" size={32} />,
      count: "Weekly",
    },
    {
      title: "Knowledge Base",
      description: "Detailed articles and guides",
      icon: <Book className="text-purple-600" size={32} />,
      count: "300+ articles",
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
              placeholder={isAr ? "ابحث عن إجابة..." : "Search for an answer..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-12 py-6 text-lg"
            />
          </div>
        </div>

        {/* Quick Start Guides */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">{isAr ? isAr ? "أدلة البدء السريع" : "Quick Start Guides" : "[Quick Start Guides]"}</h2>
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
          <h2 className="text-3xl font-bold mb-8 text-center">{isAr ? isAr ? "موارد التعلم" : "Learning Resources" : "[Learning Resources]"}</h2>
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
          <h2 className="text-3xl font-bold mb-8 text-center">{isAr ? isAr ? "الأسئلة الشائعة" : "FAQs" : "[FAQs]"}</h2>
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
          <h2 className="text-3xl font-bold mb-4">{isAr ? isAr ? "لم تجد ما تبحث عنه؟" : "Didn't find what you're looking for?" : "Didn't find what you're looking for?"}</h2>
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
