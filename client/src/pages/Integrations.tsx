import { Check, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Integrations() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const categories = [
    {
      name: "Project Management",
      icon: "📊",
      integrations: [
        { name: "Jira", logo: "🔷", status: "Available", description: "Auto-link Projects & Tasks" },
        { name: "Asana", logo: "🔴", status: "Available", description: "Sync Teams & Projects" },
        { name: "Monday.com", logo: "🟣", status: "Available", description: "Integrated Workflow Management" },
        { name: "Trello", logo: "🔵", status: "Available", description: "Organize Ideas & Tasks" },
      ],
    },
    {
      name: "Communication & Collaboration",
      icon: "💬",
      integrations: [
        { name: "Microsoft Teams", logo: "🟦", status: "Available", description: "Instant Notifications & Collaboration" },
        { name: "Slack", logo: "💬", status: "Available", description: "Dedicated Innovation Channels" },
        { name: "Zoom", logo: "📹", status: "Available", description: "Integrated Meetings" },
        { name: "Google Meet", logo: "🎥", status: "Available", description: "Seamless Video Conferencing" },
      ],
    },
    {
      name: "Business Systems",
      icon: "🏢",
      integrations: [
        { name: "Salesforce", logo: "☁️", status: "Available", description: "CRM" },
        { name: "SAP", logo: "🔶", status: "Available", description: "Enterprise System Integration" },
        { name: "Oracle", logo: "🔴", status: "Coming Soon", description: "Enterprise Databases" },
        { name: "Microsoft Dynamics", logo: "🟦", status: "Available", description: "Resource Management" },
      ],
    },
    {
      name: "Cloud Storage",
      icon: "☁️",
      integrations: [
        { name: "Google Drive", logo: "📁", status: "Available", description: "File Storage & Sharing" },
        { name: "Dropbox", logo: "📦", status: "Available", description: "Document Sync" },
        { name: "OneDrive", logo: "☁️", status: "Available", description: "Microsoft 365 Integration" },
        { name: "Box", logo: "📦", status: "Available", description: "Enterprise Content Management" },
      ],
    },
    {
      name: "Analytics & Data",
      icon: "📈",
      integrations: [
        { name: "Power BI", logo: "📊", status: "Available", description: "Advanced Reports & Analytics" },
        { name: "Tableau", logo: "📉", status: "Available", description: "Interactive Data Visualizations" },
        { name: "Google Analytics", logo: "📈", status: "Available", description: "Performance Tracking" },
        { name: "Mixpanel", logo: "📊", status: "Coming Soon", description: "User Analytics" },
      ],
    },
    {
      name: "Security & Compliance",
      icon: "🔒",
      integrations: [
        { name: "Okta", logo: "🔐", status: "Available", description: "Identity & Access Management" },
        { name: "Azure AD", logo: "🔷", status: "Available", description: "Microsoft Authentication" },
        { name: "Auth0", logo: "🔒", status: "Available", description: "Secure Authentication" },
        { name: "OneLogin", logo: "🔑", status: "Coming Soon", description: "Single Sign-On" },
      ],
    },
  ];

  const features = [
    {
      title: "Seamless Integration",
      description: "Quick connection to existing systems without complexity",
      icon: "🔗",
    },
    {
      title: "Automatic Sync",
      description: "Real-time data updates across all systems",
      icon: "🔄",
    },
    {
      title: "High Security",
      description: "End-to-end encryption for all data",
      icon: "🔐",
    },
    {
      title: "Open API",
      description: "Build custom integrations to fit your needs",
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
                        variant={integration.status === (isAr ? "متاح" : "Available") ? "default" : "secondary"}
                        className={integration.status === (isAr ? "متاح" : "Available") ? "bg-green-500" : ""}
                      >
                        {integration.status}
                      </Badge>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2">{integration.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {integration.description}
                    </p>
                    
                    {integration.status === (isAr ? "متاح" : "Available") && (
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
          <h2 className="text-3xl font-bold mb-4">{isAr ? isAr ? "هل تحتاج تكاملاً مخصصاً؟" : "Need a custom integration?" : "Need a custom integration?"}</h2>
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
            <p className="text-muted-foreground">{isAr ? isAr ? "تكامل متاح" : "Integration Available" : "[Integration Available]"}</p>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              99.9%
            </div>
            <p className="text-muted-foreground">{isAr ? isAr ? "وقت التشغيل" : "Runtime" : "Operation Time"}</p>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              &lt;5 دقائق
            </div>
            <p className="text-muted-foreground">{isAr ? isAr ? "وقت الإعداد" : "Setup Time" : "[Setup Time]"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
