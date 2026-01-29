import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { 
  Rocket, GraduationCap, BookOpen, Clock, Users, 
  Award, Play, Star, CheckCircle
} from "lucide-react";

export default function Academy() {
  const { user } = useAuth();
  const { data: courses, isLoading } = trpc.academy.getCourses.useQuery();
  const { data: enrollments } = trpc.academy.getMyEnrollments.useQuery(undefined, { enabled: !!user });

  const enrollMutation = trpc.academy.enroll.useMutation({
    onSuccess: () => {
      toast.success("تم التسجيل في الدورة بنجاح!");
    },
    onError: (error) => {
      toast.error("حدث خطأ", { description: error.message });
    },
  });

  // Demo courses
  const demoCourses = [
    {
      id: 1,
      title: "أساسيات الابتكار وريادة الأعمال",
      description: "تعلم المفاهيم الأساسية للابتكار وكيفية تحويل الأفكار إلى مشاريع ناجحة",
      category: "innovation",
      level: "beginner",
      duration: 480,
      instructor: "د. أحمد الشمري",
      partner: "KAUST",
      enrollmentCount: 1250,
      rating: "4.8",
      isFree: true,
    },
    {
      id: 2,
      title: "حماية الملكية الفكرية",
      description: "دليل شامل لتسجيل وحماية براءات الاختراع والعلامات التجارية",
      category: "ip",
      level: "intermediate",
      duration: 720,
      instructor: "أ. سارة العتيبي",
      partner: "SAIP",
      enrollmentCount: 890,
      rating: "4.9",
      isFree: true,
    },
    {
      id: 3,
      title: "التمويل والاستثمار للشركات الناشئة",
      description: "كيفية جذب المستثمرين وإدارة التمويل في المراحل المبكرة",
      category: "investment",
      level: "advanced",
      duration: 960,
      instructor: "م. خالد القحطاني",
      partner: "Monshaat",
      enrollmentCount: 650,
      rating: "4.7",
      isFree: false,
    },
    {
      id: 4,
      title: "الذكاء الاصطناعي للمبتكرين",
      description: "تطبيقات الذكاء الاصطناعي في تطوير المنتجات والخدمات",
      category: "technology",
      level: "intermediate",
      duration: 1200,
      instructor: "د. نورة الدوسري",
      partner: "SDAIA",
      enrollmentCount: 1100,
      rating: "4.9",
      isFree: true,
    },
    {
      id: 5,
      title: "القيادة الابتكارية",
      description: "مهارات القيادة اللازمة لإدارة فرق الابتكار",
      category: "leadership",
      level: "advanced",
      duration: 600,
      instructor: "أ. فهد المالكي",
      partner: "KACST",
      enrollmentCount: 420,
      rating: "4.6",
      isFree: false,
    },
    {
      id: 6,
      title: "بناء نموذج العمل التجاري",
      description: "تصميم نماذج أعمال مستدامة وقابلة للتوسع",
      category: "entrepreneurship",
      level: "beginner",
      duration: 540,
      instructor: "د. ريم السبيعي",
      partner: "MCIT",
      enrollmentCount: 780,
      rating: "4.8",
      isFree: true,
    },
  ];

  const displayCourses = courses && courses.length > 0 ? courses : demoCourses;

  const getCategoryText = (category: string) => {
    switch (category) {
      case "innovation": return "الابتكار";
      case "entrepreneurship": return "ريادة الأعمال";
      case "ip": return "الملكية الفكرية";
      case "investment": return "الاستثمار";
      case "technology": return "التقنية";
      case "leadership": return "القيادة";
      default: return category;
    }
  };

  const getLevelText = (level: string | null) => {
    switch (level) {
      case "beginner": return "مبتدئ";
      case "intermediate": return "متوسط";
      case "advanced": return "متقدم";
      case "expert": return "خبير";
      default: return level || "مبتدئ";
    }
  };

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return "غير محدد";
    const hours = Math.floor(minutes / 60);
    return `${hours} ساعة`;
  };

  const isEnrolled = (courseId: number) => {
    return enrollments?.some(e => e.courseId === courseId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                UPLINK 5.0
              </span>
            </div>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="border-slate-700 text-slate-300">
              لوحة التحكم
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full mb-4">
            <GraduationCap className="w-4 h-4 text-purple-400" />
            <span className="text-purple-400 text-sm">أكاديمية UPLINK</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">طوّر مهاراتك الابتكارية</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            دورات تدريبية معتمدة من أفضل الجامعات والمؤسسات السعودية والعالمية
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: "دورة متاحة", value: "50+", icon: BookOpen },
            { label: "متدرب", value: "10,000+", icon: Users },
            { label: "شهادة صادرة", value: "5,000+", icon: Award },
            { label: "ساعة تدريبية", value: "500+", icon: Clock },
          ].map((stat, i) => (
            <Card key={i} className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6 text-center">
                <stat.icon className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Partners */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-6 text-center">شركاؤنا الأكاديميون</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {["KAUST", "SAIP", "SDAIA", "Monshaat", "MCIT", "KACST"].map((partner, i) => (
              <div key={i} className="px-6 py-3 bg-slate-800/50 rounded-xl border border-slate-700">
                <span className="text-slate-300 font-medium">{partner}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayCourses.map((course: any) => (
              <Card 
                key={course.id} 
                className="bg-slate-800/50 border-slate-700 hover:border-purple-600/50 transition-all group overflow-hidden"
              >
                {/* Course Image Placeholder */}
                <div className="h-40 bg-gradient-to-br from-purple-900/50 to-slate-800 flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-purple-400/50" />
                </div>

                <CardContent className="p-6">
                  {/* Tags */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs">
                      {getCategoryText(course.category)}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-700 rounded text-xs text-slate-300">
                      {getLevelText(course.level)}
                    </span>
                    {course.isFree && (
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-xs">
                        مجاني
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">{course.title}</h3>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">{course.description}</p>

                  {/* Instructor & Partner */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                      <div className="text-white text-sm">{course.instructor}</div>
                      <div className="text-slate-500 text-xs">{course.partner}</div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatDuration(course.duration)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{course.enrollmentCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400" />
                      <span>{course.rating}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  {isEnrolled(course.id) ? (
                    <Button className="w-full bg-emerald-500 hover:bg-emerald-600">
                      <CheckCircle className="w-4 h-4 ml-2" />
                      مسجّل - متابعة التعلم
                    </Button>
                  ) : (
                    <Button 
                      className="w-full bg-purple-500 hover:bg-purple-600"
                      onClick={() => {
                        if (!user) {
                          toast.error("يرجى تسجيل الدخول أولاً");
                          return;
                        }
                        enrollMutation.mutate({ courseId: course.id });
                      }}
                      disabled={enrollMutation.isPending}
                    >
                      <Play className="w-4 h-4 ml-2" />
                      {course.isFree ? "ابدأ التعلم مجاناً" : "سجّل الآن"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-8 text-center border border-purple-800/50">
          <Award className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">احصل على شهادة معتمدة</h2>
          <p className="text-slate-300 mb-6 max-w-xl mx-auto">
            أكمل الدورات واحصل على شهادات معتمدة من شركائنا الأكاديميين لتعزيز ملفك المهني
          </p>
          <Button className="bg-white text-slate-900 hover:bg-slate-100">
            استكشف جميع الدورات
          </Button>
        </div>
      </div>
    </div>
  );
}
