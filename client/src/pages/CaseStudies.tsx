import { ArrowRight, TrendingUp, Users, DollarSign, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

export default function CaseStudies() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const caseStudies = [
    {
      id: 1,
      title: "Transforming Innovation at a Global Tech Company",
      company: "TechGlobal Corp",
      industry: "Information Technology",
      logo: "💻",
      challenge: "The company struggled to manage over 500 innovation ideas annually from 2,000 employees, leading to lost opportunities and employee frustration.",
      solution: "NAQLA 5.0 was implemented with AI-powered evaluation, an integrated pipeline, and a gamification system to boost engagement.",
      results: [
        { metric: "Increased Ideas Submitted", value: "+350%", icon: <TrendingUp className="text-green-600" /> },
        { metric: "Reduced Evaluation Time", value: "-75%", icon: <Clock className="text-blue-600" /> },
        { metric: "Idea-to-Project Conversion Rate", value: "45%", icon: <Users className="text-purple-600" /> },
        { metric: "Return on Investment", value: "$2.5M", icon: <DollarSign className="text-green-600" /> },
      ],
      testimonial: "NAQLA completely transformed our innovation culture. Now every employee feels heard and their ideas valued.",
      author: "Dr. Ahmed Al-Maliki, Innovation Manager",
      image: "🏢",
    },
    {
      id: 2,
      title: "Accelerating Growth for an AI Startup",
      company: "AI Innovations Ltd",
      industry: "Artificial Intelligence",
      logo: "🤖",
      challenge: "A promising startup needed to protect its IP, attract investors, and build a global team—all with limited resources.",
      solution: "The startup utilized NAQLA's Blockchain documentation, investor marketplace, and global network to access needed resources.",
      results: [
        { metric: "Secured Funding", value: "$1.2M", icon: <DollarSign className="text-green-600" /> },
        { metric: "Patents Registered", value: "5", icon: <TrendingUp className="text-blue-600" /> },
        { metric: "Global Partners", value: "12", icon: <Users className="text-purple-600" /> },
        { metric: "Time to Market", value: "-60%", icon: <Clock className="text-blue-600" /> },
      ],
      testimonial: "Without NAQLA, it would have taken us years to achieve what we did in 6 months. The platform was key to our success.",
      author: "Sara Al-Harbi, Founder & CEO",
      image: "🚀",
    },
    {
      id: 3,
      title: "Modernizing Innovation at an Established Industrial Enterprise",
      company: "Industrial Leaders Inc",
      industry: "Industry & Manufacturing",
      logo: "🏭",
      challenge: "A 50-year-old enterprise needed to revitalize its innovation processes to keep pace with digital transformation and fierce competition.",
      solution: "NAQLA was implemented with a focus on open innovation, supplier collaboration, and a challenge system to engage all stakeholders.",
      results: [
        { metric: "Cost Reduction", value: "$5M", icon: <DollarSign className="text-green-600" /> },
        { metric: "New Products", value: "18", icon: <TrendingUp className="text-blue-600" /> },
        { metric: "Strategic Partnerships", value: "25", icon: <Users className="text-purple-600" /> },
        { metric: "Improved Efficiency", value: "+40%", icon: <Clock className="text-blue-600" /> },
      ],
      testimonial: "NAQLA helped us transform a traditional enterprise into a leader in industrial innovation. The results exceeded all expectations.",
      author: "Eng. Khalid Al-Otaibi, VP of Development",
      image: "⚙️",
    },
    {
      id: 4,
      title: "Build an Integrated National Innovation System",
      company: "National Innovation Agency",
      industry: "Government Sector",
      logo: "🏛️",
      challenge: "Government agency aiming to build a national innovation system connecting universities, businesses, and individual innovators.",
      solution: "NAQLA was deployed as a national platform with full customization, integration with government systems, and a comprehensive incentive program.",
      results: [
        { metric: "Registered Innovators", value: "50,000+", icon: <Users className="text-purple-600" /> },
        { metric: "Funded Projects", value: "1,200", icon: <DollarSign className="text-green-600" /> },
        { metric: "Patents", value: "300+", icon: <TrendingUp className="text-blue-600" /> },
        { metric: "New Jobs Created", value: "15,000", icon: <Users className="text-purple-600" /> },
      ],
      testimonial: "NAQLA enabled us to build a national innovation system comparable to the world's best. The economic impact has been tremendous.",
      author: "Dr. Fatima Al-Qahtani, Executive Director",
      image: "🌍",
    },
    {
      id: 5,
      title: "Empowering Innovation in Healthcare",
      company: "HealthTech Solutions",
      industry: "Healthcare",
      logo: "🏥",
      challenge: "Healthcare institution needing rapid innovations to improve patient care while adhering to strict regulatory standards.",
      solution: "NAQLA was used with a focus on compliance, data protection, and collaboration among doctors, researchers, and developers.",
      results: [
        { metric: "Improved Patient Outcomes", value: "+35%", icon: <TrendingUp className="text-green-600" /> },
        { metric: "Innovative Solutions", value: "42", icon: <TrendingUp className="text-blue-600" /> },
        { metric: "Cost Savings", value: "$8M", icon: <DollarSign className="text-green-600" /> },
        { metric: "Patient Satisfaction", value: "95%", icon: <Users className="text-purple-600" /> },
      ],
      testimonial: "NAQLA helped us accelerate innovation without compromising security or compliance. A perfect model for healthcare.",
      author: "Dr. Mona Al-Amri, R&D Director",
      image: "⚕️",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            دراسات الحالة
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            قصص نجاح حقيقية من مؤسسات حول العالم حققت نتائج استثنائية مع NAQLA
          </p>
        </div>

        {/* Case Studies */}
        <div className="space-y-16">
          {caseStudies.map((study, index) => (
            <Card key={study.id} className="overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-8 border-b">
                <div className="flex items-start gap-6">
                  <div className="text-6xl">{study.image}</div>
                  <div className="flex-1">
                    <Badge className="mb-3">{study.industry}</Badge>
                    <h2 className="text-3xl font-bold mb-2">{study.title}</h2>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <span className="text-2xl">{study.logo}</span>
                      <span className="text-lg font-semibold">{study.company}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                  {/* Challenge */}
                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <span className="text-2xl">🎯</span>
                      التحدي
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {study.challenge}
                    </p>
                  </div>

                  {/* Solution */}
                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <span className="text-2xl">💡</span>
                      الحل
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {study.solution}
                    </p>
                  </div>
                </div>

                {/* Results */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <span className="text-2xl">📊</span>
                    النتائج
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {study.results.map((result, i) => (
                      <Card key={i} className="p-6 text-center hover:shadow-lg transition-shadow">
                        <div className="flex justify-center mb-3">{result.icon}</div>
                        <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          {result.value}
                        </div>
                        <div className="text-sm text-muted-foreground">{result.metric}</div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Testimonial */}
                <Card className="p-6 bg-gradient-to-r from-blue-500/5 to-purple-500/5 border-2 border-blue-500/10">
                  <p className="text-lg italic mb-4 leading-relaxed">
                    "{study.testimonial}"
                  </p>
                  <p className="font-semibold text-blue-600">
                    - {study.author}
                  </p>
                </Card>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <Card className="mt-16 p-12 text-center bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-2 border-blue-500/20">
          <h2 className="text-3xl font-bold mb-4">{isAr ? isAr ? "هل أنت مستعد لتكون قصة النجاح القادمة؟" : "Ready to be the next success story?" : "Ready to be the next success story?"}</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            انضم إلى آلاف المؤسسات الناجحة حول العالم
          </p>
          <div className="flex gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-lg hover:shadow-lg transition-all flex items-center gap-2">
              ابدأ تجربتك المجانية
              <ArrowRight size={20} />
            </button>
            <button className="px-8 py-4 bg-background border-2 border-blue-600 text-blue-600 rounded-lg font-semibold text-lg hover:shadow-lg transition-all">
              تحدث مع خبير
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
