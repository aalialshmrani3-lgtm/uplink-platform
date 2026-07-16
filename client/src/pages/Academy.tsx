import { Link } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger
} from "@/components/ui/accordion";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { 
  Rocket, GraduationCap, BookOpen, Clock, Users, 
  Award, Play, Star, CheckCircle, Search,
  HelpCircle, MessageSquare, ChevronLeft,
  Sparkles, Target, Zap, Globe
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Academy() {
  const { user } = useAuth();
  const { data: courses, isLoading } = trpc.academy.getCourses.useQuery();
  const { data: enrollments } = trpc.academy.getMyEnrollments.useQuery(undefined, { enabled: !!user });
  const { t, language } = useLanguage();
  const isAr = language === 'ar';

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  const enrollMutation = trpc.academy.enroll.useMutation({
    onSuccess: () => {
      toast.success(isAr ? "تم التسجيل في الدورة بنجاح!" : "Course registration successful!");
    },
    onError: (error) => {
      toast.error(isAr ? "حدث خطأ" : "An error occurred", { description: error.message });
    },
  });

  const demoCourses = [
    {
      id: 1,
      title: "Innovation & Entrepreneurship Fundamentals",
      description: "Learn core innovation concepts and how to turn ideas into successful ventures.",
      category: "innovation",
      level: "beginner",
      duration: 480,
      instructor: "Dr. Ahmed Al-Shammari",
      partner: "KAUST",
      enrollmentCount: 1250,
      rating: "4.8",
      reviewCount: 342,
      isFree: true,
      reviews: [
        { user: "Mohammed A.", rating: 5, text: "Excellent and comprehensive course", date: "2024-01-15" },
        { user: "Sara A.", rating: 4, text: "Great and very useful content", date: "2024-01-10" },
      ],
    },
    {
      id: 2,
      title: "Intellectual Property Protection",
      description: "A comprehensive guide to registering and protecting patents and trademarks.",
      category: "ip",
      level: "intermediate",
      duration: 720,
      instructor: "Ms. Sara Al-Otaibi",
      partner: "SAIP",
      enrollmentCount: 890,
      rating: "4.9",
      reviewCount: 256,
      isFree: true,
      reviews: [],
    },
    {
      id: 3,
      title: "Funding & Investment for Startups",
      description: "How to attract investors and manage early-stage funding.",
      category: "investment",
      level: "advanced",
      duration: 960,
      instructor: "Eng. Khalid Al-Qahtani",
      partner: "Monshaat",
      enrollmentCount: 650,
      rating: "4.7",
      reviewCount: 189,
      isFree: false,
      reviews: [],
    },
    {
      id: 4,
      title: "AI for Innovators",
      description: "AI applications in product and service development.",
      category: "technology",
      level: "intermediate",
      duration: 1200,
      instructor: "Dr. Noura Al-Dossari",
      partner: "SDAIA",
      enrollmentCount: 1100,
      rating: "4.9",
      reviewCount: 412,
      isFree: true,
      reviews: [],
    },
    {
      id: 5,
      title: "Innovative Leadership",
      description: "Leadership skills for managing innovation teams.",
      category: "leadership",
      level: "advanced",
      duration: 600,
      instructor: "Mr. Fahad Al-Maliki",
      partner: "KACST",
      enrollmentCount: 420,
      rating: "4.6",
      reviewCount: 98,
      isFree: false,
      reviews: [],
    },
    {
      id: 6,
      title: "Building a Business Model",
      description: "Designing sustainable and scalable business models.",
      category: "entrepreneurship",
      level: "beginner",
      duration: 540,
      instructor: "Dr. Reem Al-Subaie",
      partner: "MCIT",
      enrollmentCount: 780,
      rating: "4.8",
      reviewCount: 234,
      isFree: true,
      reviews: [],
    },
  ];

  const faqData = [
    {
      question: "How do I register for courses?",
      answer: "You can register for any course by clicking 'Start Learning' or 'Register Now'. You must have a NAQLA platform account."
    },
    {
      question: "Are certificates accredited?",
      answer: "Yes, all certificates issued by NAQLA Academy are accredited by our academic partners (KAUST, SAIP, SDAIA, Monshaat, MCIT, KACST)."
    },
    {
      question: "How long is course access valid?",
      answer: "Once registered, you have lifetime access to course content."
    },
    {
      question: "Can I get a refund?",
      answer: "Yes, we offer a 14-day money-back guarantee if you're not satisfied with the course."
    },
    {
      question: "How do I get a certificate?",
      answer: "To get a certificate, you must complete all lessons and pass the final exam with at least 70%."
    },
    {
      question: "Can I learn on mobile?",
      answer: "Yes, the NAQLA platform is fully compatible with all devices."
    },
    {
      question: "What languages are available?",
      answer: "Most courses are in Arabic with technical term translations. Some advanced courses are in English."
    },
    {
      question: "How can I contact the instructor?",
      answer: "You can ask questions in the course's discussion section. Instructors usually reply within 24-48 hours."
    },
  ];

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "innovation", label: "Innovation" },
    { value: "entrepreneurship", label: "Entrepreneurship" },
    { value: "ip", label: "Intellectual Property" },
    { value: "investment", label: "Investment" },
    { value: "technology", label: "Technology" },
    { value: "leadership", label: "Leadership" },
  ];

  const levels = [
    { value: "all", label: "All Levels" },
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
  ];

  const displayCourses = courses && courses.length > 0 ? courses : demoCourses;

  const filteredCourses = displayCourses.filter((course: any) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    const matchesLevel = selectedLevel === "all" || course.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const getCategoryText = (category: string) => {
    const cats: Record<string, string> = {
      innovation: "Innovation",
      entrepreneurship: "Entrepreneurship",
      ip: "Intellectual Property",
      investment: "Investment",
      technology: "Technology",
      leadership: "Leadership",
    };
    return cats[category] || category;
  };

  const getLevelText = (level: string | null) => {
    const lvls: Record<string, string> = {
      beginner: "Beginner",
      intermediate: "Intermediate",
      advanced: "Advanced",
      expert: "Expert",
    };
    return lvls[level || ""] || (isAr ? "مبتدئ" : "Beginner");
  };

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return isAr ? "غير محدد" : "Not Specified";
    const hours = Math.floor(minutes / 60);
    return isAr ? `${hours} ساعة` : `${hours} hours`;
  };

  const isEnrolled = (courseId: number) => {
    return enrollments?.some(e => e.courseId === courseId);
  };

  const handleSubmitReview = () => {
    if (!reviewText.trim()) {
      toast.error(isAr ? "يرجى كتابة تقييمك" : "Please write your review");
      return;
    }
    toast.success(isAr ? "تم إرسال تقييمك بنجاح!" : "Your review has been submitted successfully!");
    setReviewDialogOpen(false);
    setReviewText("");
    setReviewRating(5);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                NAQLA 5.0
              </span>
            </div>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="border-slate-700 text-slate-300">
              {t.sidebar.dashboard}
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="relative mb-16">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl blur-3xl"></div>
          <div className="relative bg-gradient-to-br from-purple-900/40 to-slate-900 rounded-3xl p-12 border border-purple-500/20">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full mb-6">
                  <GraduationCap className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-400 text-sm">{isAr ? "أكاديمية NAQLA" : "NAQLA Academy"}</span>
                </div>
                <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
                  {isAr ? "طوّر مهاراتك" : "Develop Your"}
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> {isAr ? "الابتكارية" : "Innovative Skills"}</span>
                </h1>
                <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                  {isAr
                    ? isAr ? "دورات تدريبية معتمدة من أفضل الجامعات والمؤسسات السعودية والعالمية. ابدأ رحلتك نحو الابتكار اليوم." : "Certified training courses from top Saudi and international universities and institutions. Start your innovation journey today."
                    : "Accredited training courses from the best Saudi and international universities and institutions. Start your innovation journey today."
                  }
                </p>
                <div className="flex gap-4">
                  <Button className="bg-purple-500 hover:bg-purple-600 px-6">
                    <Play className="w-4 h-4 ml-2" />
                    {isAr ? "ابدأ التعلم" : "Start Learning"}
                  </Button>
                  <Button variant="outline" className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10">
                    {isAr ? "استكشف المسارات" : "Explore Paths"}
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Sparkles, label: "Exclusive Courses", value: "50+" },
                  { icon: Users, label: "Active Learner", value: "10K+" },
                  { icon: Award, label: "Accredited Certificate", value: "5K+" },
                  { icon: Globe, label: "Academic Partner", value: "15+" },
                ].map((stat, i) => (
                  <div key={i} className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 text-center">
                    <stat.icon className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-slate-400 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder={isAr ? "ابحث عن دورة..." : "Search for a course..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-800/50 border-slate-700 text-white pr-12 h-12"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-800/50 border border-slate-700 text-white rounded-lg px-4 h-12 min-w-[160px]"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="bg-slate-800/50 border border-slate-700 text-white rounded-lg px-4 h-12 min-w-[150px]"
              >
                {levels.map((lvl) => (
                  <option key={lvl.value} value={lvl.value}>{lvl.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 text-slate-400 text-sm">
            {isAr
              ? `عرض ${filteredCourses.length} دورة من أصل ${displayCourses.length}`
              : `Showing ${filteredCourses.length} courses out of ${displayCourses.length}`
            }
          </div>
        </div>

        {/* Partners */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-6 text-center">
            {isAr ? "شركاؤنا الأكاديميون" : "Our Academic Partners"}
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {["KAUST", "SAIP", "SDAIA", "Monshaat", "MCIT", "KACST", "NEOM", "STC"].map((partner, i) => (
              <div 
                key={i} 
                className="px-8 py-4 bg-gradient-to-br from-slate-800/80 to-slate-800/40 rounded-xl border border-slate-700/50 hover:border-purple-500/50 transition-all cursor-pointer"
              >
                <span className="text-slate-200 font-semibold">{partner}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">{isAr ? "لا توجد نتائج" : "No results found"}</h3>
            <p className="text-slate-400">{isAr ? "جرب تغيير معايير البحث" : "Try changing your search criteria"}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {filteredCourses.map((course: any) => (
              <Card 
                key={course.id} 
                className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all group overflow-hidden"
              >
                <div className="h-44 bg-gradient-to-br from-purple-900/50 to-slate-800 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                  <BookOpen className="w-16 h-16 text-purple-400/30" />
                  {course.isFree && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">
                      {isAr ? "مجاني" : "Free"}
                    </div>
                  )}
                </div>

                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-medium">
                      {getCategoryText(course.category)}
                    </span>
                    <span className="px-3 py-1 bg-slate-700 rounded-full text-xs text-slate-300">
                      {getLevelText(course.level)}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">{course.description}</p>

                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-700">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {course.instructor?.charAt(0) || "م"}
                      </span>
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">{course.instructor}</div>
                      <div className="text-slate-500 text-xs">{course.partner}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatDuration(course.duration)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{course.enrollmentCount?.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-white font-medium">{course.rating}</span>
                      <span className="text-slate-500">({course.reviewCount || 0})</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {isEnrolled(course.id) ? (
                      <>
                        <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600">
                          <CheckCircle className="w-4 h-4 ml-2" />
                          {isAr ? "متابعة التعلم" : "Continue Learning"}
                        </Button>
                        <Dialog open={reviewDialogOpen && selectedCourse?.id === course.id} onOpenChange={setReviewDialogOpen}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              className="border-slate-700"
                              onClick={() => setSelectedCourse(course)}
                            >
                              <MessageSquare className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-slate-900 border-slate-700">
                            <DialogHeader>
                              <DialogTitle className="text-white">{isAr ? "تقييم الدورة" : "Rate Course"}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                              <div>
                                <label className="text-slate-300 text-sm mb-2 block">{isAr ? "التقييم" : "Rating"}</label>
                                <div className="flex gap-2">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      key={star}
                                      onClick={() => setReviewRating(star)}
                                      className="focus:outline-none"
                                    >
                                      <Star 
                                        className={`w-8 h-8 ${star <= reviewRating ? "text-amber-400 fill-amber-400" : "text-slate-600"}`} 
                                      />
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <label className="text-slate-300 text-sm mb-2 block">{isAr ? "تعليقك" : "Your Comment"}</label>
                                <Textarea
                                  value={reviewText}
                                  onChange={(e) => setReviewText(e.target.value)}
                                  placeholder={isAr ? "شاركنا رأيك في الدورة..." : "Share your thoughts on the course..."}
                                  className="bg-slate-800 border-slate-700 text-white min-h-[100px]"
                                />
                              </div>
                              <Button 
                                className="w-full bg-purple-500 hover:bg-purple-600"
                                onClick={handleSubmitReview}
                              >
                                {isAr ? "إرسال التقييم" : "Submit Rating"}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </>
                    ) : (
                      <Button 
                        className="w-full bg-purple-500 hover:bg-purple-600"
                        onClick={() => {
                          if (!user) {
                            toast.error(isAr ? "يرجى تسجيل الدخول أولاً" : "Please log in first");
                            return;
                          }
                          enrollMutation.mutate({ courseId: course.id });
                        }}
                        disabled={enrollMutation.isPending}
                      >
                        <Play className="w-4 h-4 ml-2" />
                        {course.isFree ? (isAr ? "ابدأ التعلم مجاناً" : "Start Learning for Free") : (isAr ? "سجّل الآن" : "Register Now")}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Learning Paths */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">{isAr ? "مسارات التعلم" : "Learning Paths"}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Innovator Path",
                description: "From Idea to Patent",
                courses: 5,
                duration: "40 hours",
                color: "from-cyan-500 to-blue-500",
                icon: Sparkles,
              },
              {
                title: "Entrepreneur Path",
                description: "Building a Successful Startup",
                courses: 7,
                duration: "60 hours",
                color: "from-purple-500 to-pink-500",
                icon: Target,
              },
              {
                title: "Tech Leader Path",
                description: "Leading Innovation & Tech Teams",
                courses: 6,
                duration: "50 hours",
                color: "from-amber-500 to-orange-500",
                icon: Zap,
              },
            ].map((path, i) => (
              <Card key={i} className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all cursor-pointer group">
                <CardContent className="p-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${path.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <path.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{path.title}</h3>
                  <p className="text-slate-400 text-sm mb-4">{path.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">{path.courses} {isAr ? "دورات" : "Courses"}</span>
                    <span className="text-slate-500">{path.duration}</span>
                  </div>
                  <Button variant="outline" className="w-full mt-4 border-slate-700 text-slate-300 group-hover:border-purple-500 group-hover:text-purple-400">
                    {isAr ? "استكشف المسار" : "Explore Path"}
                    <ChevronLeft className="w-4 h-4 mr-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full mb-4">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 text-sm">{isAr ? "الأسئلة الشائعة" : "FAQ"}</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">{isAr ? "هل لديك استفسار؟" : "Have a question?"}</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              {isAr ? "إجابات على أكثر الأسئلة شيوعاً حول أكاديمية NAQLA" : "Answers to common questions about NAQLA Academy"}
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-3">
              {faqData.map((faq, i) => (
                <AccordionItem 
                  key={i} 
                  value={`item-${i}`}
                  className="bg-slate-800/50 border border-slate-700 rounded-xl px-6 data-[state=open]:border-purple-500/50"
                >
                  <AccordionTrigger className="text-white hover:text-purple-400 text-right py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-5 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="text-center mt-8">
            <p className="text-slate-400 mb-4">{isAr ? "لم تجد إجابة لسؤالك؟" : "Didn't find your answer?"}</p>
            <Button variant="outline" className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10">
              <MessageSquare className="w-4 h-4 ml-2" />
              {isAr ? "تواصل مع الدعم" : "Contact Support"}
            </Button>
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-3xl blur-2xl"></div>
          <div className="relative bg-gradient-to-r from-purple-900/60 to-pink-900/60 rounded-3xl p-12 text-center border border-purple-500/20">
            <Award className="w-20 h-20 text-purple-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">{isAr ? "احصل على شهادة معتمدة" : "Get Certified"}</h2>
            <p className="text-slate-300 mb-8 max-w-xl mx-auto text-lg">
              {isAr
                ? isAr ? "أكمل الدورات واحصل على شهادات معتمدة من شركائنا الأكاديميين لتعزيز ملفك المهني" : "Complete courses and earn accredited certificates from our academic partners to boost your professional profile"
                : "Complete courses and get accredited certificates from our academic partners to enhance your professional profile"
              }
            </p>
            <div className="flex gap-4 justify-center">
              <Button className="bg-white text-slate-900 hover:bg-slate-100 px-8">
                {isAr ? "استكشف جميع الدورات" : "Explore All Courses"}
              </Button>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                {isAr ? "تعرف على الشركاء" : "Meet Partners"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
