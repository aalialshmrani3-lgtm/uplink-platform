import { Shield, Brain, Globe, ArrowRight, Check, Zap, Users, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ThreeEngines() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const engines = [
    {
      id: 1,
      name: "NAQLA1",
      title: "IP Generation Engine",
      subtitle: "IP Generation Engine",
      icon: Shield,
      color: "from-emerald-500 to-teal-600",
      bgGradient: "from-emerald-500/10 to-teal-500/10",
      borderColor: "border-emerald-500/20",
      description: "Integrated system for tracking ideas from concept to patent with AI registrability assessment.",
      features: [
        {
          title: "Idea Tracking",
          description: "From initial concept to registered patent",
          icon: "📝",
        },
        {
          title: "AI Assessment",
          description: "AI-powered patentability assessment",
          icon: "🤖",
        },
        {
          title: "IP Portfolio Management",
          description: "Comprehensive management of all intellectual properties",
          icon: "📊",
        },
        {
          title: "Blockchain Documentation",
          description: "Secure IP protection with blockchain technology",
          icon: "⛓️",
        },
        {
          title: "SAIP & WIPO Integration",
          description: "Direct registration with official bodies",
          icon: "🏛️",
        },
        {
          title: "Detailed Reports",
          description: "Comprehensive reports on each IP's status",
          icon: "📄",
        },
      ],
      stats: [
        { label: "Registered Patent", value: "145+" },
        { label: "Trademark", value: "89+" },
        { label: "Success Rate", value: "92%" },
      ],
      link: "/ip/register",
      cta: "Register Your IP",
    },
    {
      id: 2,
      name: "NAQLA2",
      title: "Challenges & Matching Engine",
      subtitle: "Challenge Matching Engine",
      icon: Brain,
      color: "from-blue-500 to-indigo-600",
      bgGradient: "from-blue-500/10 to-indigo-500/10",
      borderColor: "border-blue-500/20",
      description: "Smart matching algorithm connecting innovators with suitable investors and companies",
      features: [
        {
          title: "Smart Matching",
          description: "Advanced AI algorithm for perfect matching",
          icon: "🎯",
        },
        {
          title: "Expert Recommendations",
          description: "AI recommendations for suitable experts",
          icon: "👥",
        },
        {
          title: "Automated Team Formation",
          description: "Building integrated teams based on skills",
          icon: "🤝",
        },
        {
          title: "Challenges & Competitions",
          description: "Platform for innovative challenges and competitions",
          icon: "🏆",
        },
        {
          title: "Multi-criteria Evaluation",
          description: "Comprehensive evaluation based on multiple criteria",
          icon: "⭐",
        },
        {
          title: "Advanced Analytics",
          description: "Deep insights into matching opportunities",
          icon: "📈",
        },
      ],
      stats: [
        { label: "Successful Match", value: "2,500+" },
        { label: "Active Challenge", value: "50+" },
        { label: "Satisfaction Rate", value: "95%" },
      ],
      link: "/challenges",
      cta: "Explore Challenges",
    },
    {
      id: 3,
      name: "NAQLA3",
      title: "Open Marketplace Engine",
      subtitle: "Open Market Engine",
      icon: Globe,
      color: "from-purple-500 to-pink-600",
      bgGradient: "from-purple-500/10 to-pink-500/10",
      borderColor: "border-purple-500/20",
      description: "Open marketplace for innovation exchange with smart contracts and secure escrow",
      features: [
        {
          title: "Innovation Marketplace",
          description: "Platform to showcase and purchase innovations",
          icon: "🛒",
        },
        {
          title: "Bidding System",
          description: "Transparent and fair bidding system",
          icon: "💰",
        },
        {
          title: "Smart Contracts",
          description: "Secure, self-executing contracts",
          icon: "📜",
        },
        {
          title: "Escrow System",
          description: "Secure financial guarantee for all transactions",
          icon: "🔒",
        },
        {
          title: "Transaction Management",
          description: "Full transaction tracking",
          icon: "💳",
        },
        {
          title: "Ratings & Reviews",
          description: "Transparent rating system for buyers and sellers",
          icon: "⭐",
        },
      ],
      stats: [
        { label: "Successful Transaction", value: "1,200+" },
        { label: "Trading Value", value: "$60M+" },
        { label: "Security Rate", value: "100%" },
      ],
      link: "/marketplace",
      cta: "Browse Marketplace",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            ما يميز NAQLA
          </Badge>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            المحركات الثلاثة
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            ثلاثة محركات متكاملة تشكل النظام البيئي الأكثر تقدماً لإدارة الابتكار في العالم
          </p>
        </div>

        {/* Engines Overview */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {engines.map((engine) => {
            const Icon = engine.icon;
            return (
              <Card key={engine.id} className={`p-6 hover:shadow-2xl transition-all hover:-translate-y-2 border-2 ${engine.borderColor}`}>
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${engine.color} flex items-center justify-center mb-4`}>
                  <Icon className="text-white" size={32} />
                </div>
                <Badge className="mb-3" variant="secondary">{engine.name}</Badge>
                <h3 className="text-2xl font-bold mb-2">{engine.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{engine.subtitle}</p>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {engine.description}
                </p>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {engine.stats.map((stat, i) => (
                    <div key={i} className="text-center">
                      <div className={`text-xl font-bold bg-gradient-to-r ${engine.color} bg-clip-text text-transparent`}>
                        {stat.value}
                      </div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <Link href={engine.link}>
                  <button className={`w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r ${engine.color} text-white rounded-lg hover:opacity-90 transition-all font-semibold`}>
                    {engine.cta}
                    <ArrowRight size={20} />
                  </button>
                </Link>
              </Card>
            );
          })}
        </div>

        {/* Detailed Features */}
        {engines.map((engine, index) => {
          const Icon = engine.icon;
          return (
            <div key={engine.id} className="mb-16">
              <Card className={`overflow-hidden border-2 ${engine.borderColor}`}>
                {/* Header */}
                <div className={`bg-gradient-to-r ${engine.bgGradient} p-8 border-b`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${engine.color} flex items-center justify-center`}>
                      <Icon className="text-white" size={32} />
                    </div>
                    <div>
                      <Badge className="mb-2">{engine.name}</Badge>
                      <h2 className="text-3xl font-bold">{engine.title}</h2>
                      <p className="text-muted-foreground">{engine.subtitle}</p>
                    </div>
                  </div>
                </div>

                {/* Features Grid */}
                <div className="p-8">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {engine.features.map((feature, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="text-3xl flex-shrink-0">{feature.icon}</div>
                        <div>
                          <h4 className="font-bold mb-1">{feature.title}</h4>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          );
        })}

        {/* Integration Section */}
        <Card className="p-12 text-center bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-2 border-blue-500/20">
          <div className="text-5xl mb-6">🔗</div>
          <h2 className="text-3xl font-bold mb-4">{isAr ? isAr ? "المحركات الثلاثة تعمل معاً" : "Three Engines Working Together" : "Three Engines Working Together"}</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            التكامل السلس بين المحركات الثلاثة يخلق نظاماً بيئياً متكاملاً يغطي دورة حياة الابتكار بالكامل - من الفكرة إلى التسويق
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Shield className="text-emerald-600" size={24} />
              </div>
              <p className="text-sm font-semibold">{isAr ? isAr ? "احمِ فكرتك" : "Protect Your Idea" : "[Protect Your Idea]"}</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Brain className="text-blue-600" size={24} />
              </div>
              <p className="text-sm font-semibold">{isAr ? isAr ? "اعثر على شركاء" : "Find Partners" : "[Find Partners]"}</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Globe className="text-purple-600" size={24} />
              </div>
              <p className="text-sm font-semibold">{isAr ? isAr ? "سوّق ابتكارك" : "Market Your Innovation" : "[Market Your Innovation]"}</p>
            </div>
          </div>

          <Link href="/dashboard">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-lg hover:shadow-lg transition-all">
              ابدأ رحلتك الآن
            </button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
