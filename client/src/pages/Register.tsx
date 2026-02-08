import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { 
  Lightbulb, 
  TrendingUp, 
  Building2, 
  User, 
  Landmark, 
  Briefcase 
} from "lucide-react";

const userTypes = [
  {
    id: "innovator",
    title: "مبتكر",
    description: "لديك أفكار إبداعية وتريد تحويلها لواقع",
    icon: Lightbulb,
    color: "from-blue-500 to-cyan-500",
    path: "/register/innovator"
  },
  {
    id: "investor",
    title: "مستثمر",
    description: "تبحث عن فرص استثمارية واعدة",
    icon: TrendingUp,
    color: "from-green-500 to-emerald-500",
    path: "/register/investor"
  },
  {
    id: "company",
    title: "شركة",
    description: "شركة تبحث عن ابتكارات أو شراكات",
    icon: Building2,
    color: "from-purple-500 to-pink-500",
    path: "/register/company"
  },
  {
    id: "individual",
    title: "فرد / مواطن",
    description: "مهتم بالابتكار والمشاركة في المنظومة",
    icon: User,
    color: "from-orange-500 to-red-500",
    path: "/register/individual"
  },
  {
    id: "government",
    title: "جهة حكومية",
    description: "جهة حكومية تدعم الابتكار والتطوير",
    icon: Landmark,
    color: "from-indigo-500 to-blue-500",
    path: "/register/government"
  },
  {
    id: "private_sector",
    title: "قطاع خاص",
    description: "مؤسسة من القطاع الخاص تبحث عن فرص",
    icon: Briefcase,
    color: "from-teal-500 to-cyan-500",
    path: "/register/private-sector"
  }
];

export default function Register() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12 px-4">
      <div className="container max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            انضم إلى منظومة UPLINK
          </h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            اختر نوع حسابك للبدء في رحلة الابتكار والتطوير
          </p>
        </div>

        {/* User Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userTypes.map((type) => {
            const Icon = type.icon;
            return (
              <Link key={type.id} href={type.path}>
                <Card className="group relative overflow-hidden bg-white/10 backdrop-blur-sm border-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-2xl">
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                  
                  {/* Content */}
                  <div className="relative p-8">
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-white mb-3">
                      {type.title}
                    </h3>

                    {/* Description */}
                    <p className="text-blue-200 leading-relaxed">
                      {type.description}
                    </p>

                    {/* Arrow */}
                    <div className="mt-6 flex items-center text-blue-300 group-hover:text-white transition-colors">
                      <span className="text-sm font-medium">ابدأ الآن</span>
                      <svg 
                        className="w-5 h-5 mr-2 transform group-hover:translate-x-1 transition-transform" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-blue-200 mb-4">
            لديك حساب بالفعل؟
          </p>
          <Link href="/login">
            <button className="px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white font-medium transition-all duration-300 hover:scale-105">
              تسجيل الدخول
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
