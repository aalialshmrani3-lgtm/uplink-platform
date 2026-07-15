import { Link } from "wouter";
import { ArrowRight, BookOpen, Clock, User, Tag, TrendingUp, Lightbulb, Globe, Zap, ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import ImprovedFooter from "@/components/ImprovedFooter";
import { useLanguage } from "@/contexts/LanguageContext";

const blogPosts = [
  {
    id: 1,
    title: "مستقبل الابتكار في المملكة العربية السعودية: رؤية 2030 والتحول الرقمي",
    excerpt: "تستعرض هذه المقالة أبرز مبادرات الابتكار في إطار رؤية 2030 وكيف تُسهم منظومة نقلة في تحقيق أهداف التنويع الاقتصادي.",
    author: "فريق نقلة",
    date: "15 يناير 2025",
    readTime: "8 دقائق",
    category: "رؤية 2030",
    tags: ["ابتكار", "رؤية 2030", "التحول الرقمي"],
    icon: TrendingUp,
    color: "from-cyan-500/20 to-blue-500/20",
    border: "border-cyan-500/30",
    badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    featured: true,
  },
  {
    id: 2,
    title: "كيف تحوّل فكرتك إلى مشروع ناجح: دليل المبتكر السعودي",
    excerpt: "خطوات عملية لتحويل الأفكار الإبداعية إلى مشاريع قابلة للتطبيق، من التحقق من الفكرة حتى الحصول على التمويل.",
    author: "د. سارة الأحمدي",
    date: "10 يناير 2025",
    readTime: "12 دقيقة",
    category: "ريادة الأعمال",
    tags: ["ريادة أعمال", "تمويل", "نصائح"],
    icon: Lightbulb,
    color: "from-amber-500/20 to-orange-500/20",
    border: "border-amber-500/30",
    badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    featured: false,
  },
  {
    id: 3,
    title: "الملكية الفكرية في عصر الذكاء الاصطناعي: تحديات وفرص",
    excerpt: "مع تصاعد استخدام الذكاء الاصطناعي، تبرز تساؤلات جوهرية حول ملكية المخرجات الإبداعية وكيفية حمايتها قانونياً.",
    author: "م. خالد العتيبي",
    date: "5 يناير 2025",
    readTime: "10 دقائق",
    category: "الملكية الفكرية",
    tags: ["ملكية فكرية", "ذكاء اصطناعي", "قانون"],
    icon: Globe,
    color: "from-violet-500/20 to-purple-500/20",
    border: "border-violet-500/30",
    badge: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    featured: false,
  },
  {
    id: 4,
    title: "التحديات الوطنية: كيف تحل مشكلات المجتمع وتكسب جوائز ضخمة",
    excerpt: "دليل شامل للمشاركة في التحديات الوطنية المطروحة على منصة نقلة، وكيفية تقديم حلول مبتكرة تحظى بالتمويل والدعم.",
    author: "أ. نورة السالم",
    date: "28 ديسمبر 2024",
    readTime: "7 دقائق",
    category: "التحديات",
    tags: ["تحديات", "جوائز", "حلول"],
    icon: Zap,
    color: "from-emerald-500/20 to-teal-500/20",
    border: "border-emerald-500/30",
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    featured: false,
  },
  {
    id: 5,
    title: "قصص نجاح: مبتكرون سعوديون غيّروا قطاعاتهم",
    excerpt: "نستعرض قصص ملهمة لمبتكرين سعوديين استخدموا منصة نقلة لتحويل أفكارهم إلى مشاريع ناجحة وحلول حقيقية.",
    author: "فريق نقلة",
    date: "20 ديسمبر 2024",
    readTime: "15 دقيقة",
    category: "قصص نجاح",
    tags: ["نجاح", "مبتكرون", "إلهام"],
    icon: TrendingUp,
    color: "from-pink-500/20 to-rose-500/20",
    border: "border-pink-500/30",
    badge: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    featured: false,
  },
  {
    id: 6,
    title: "مقياس TRL: دليلك لفهم مستوى جاهزية تقنيتك للسوق",
    excerpt: "شرح مبسط لمقياس مستوى الجاهزية التقنية (TRL) وكيف يساعدك في تقييم مشروعك وجذب المستثمرين المناسبين.",
    author: "م. عبدالله الغامدي",
    date: "15 ديسمبر 2024",
    readTime: "9 دقائق",
    category: "أدوات",
    tags: ["TRL", "تقييم", "استثمار"],
    icon: Lightbulb,
    color: "from-blue-500/20 to-indigo-500/20",
    border: "border-blue-500/30",
    badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    featured: false,
  },
];

const categories = ["الكل", "رؤية 2030", "ريادة الأعمال", "الملكية الفكرية", "التحديات", "قصص نجاح", "أدوات"];

export default function Blog() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("الكل");

  const { language } = useLanguage();
  const isAr = language === 'ar';
  const filtered = blogPosts.filter((post) => {
    const matchSearch =
      post.title.includes(search) ||
      post.excerpt.includes(search) ||
      post.tags.some((t) => t.includes(search));
    const matchCategory = activeCategory === "الكل" || post.category === activeCategory;
    return matchSearch && matchCategory;
  });

  const featured = blogPosts.find((p) => p.featured);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-40">
        <div className="container flex items-center gap-4 h-16">
          <Link href="/">
            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              <ArrowRight className="w-4 h-4" />
              <span className="text-sm">{isAr ? "العودة للرئيسية" : "[العودة للرئيسية]"}</span>
            </div>
          </Link>
          <span className="text-border/50">|</span>
          <span className="text-sm font-medium">{isAr ? "المدونة" : "Blog"}</span>
        </div>
      </div>

      {/* Hero */}
      <div className="py-20 px-6 bg-gradient-to-b from-emerald-500/5 to-transparent">
        <div className="container max-w-5xl mx-auto text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{isAr ? "مدونة نقلة" : "[مدونة نقلة]"}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            مقالات وتقارير ودراسات حالة من عالم الابتكار والريادة في المملكة العربية السعودية والعالم.
          </p>
          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Input
              placeholder="ابحث في المقالات..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-card/50 border-border/50 pr-4 pl-10"
            />
          </div>
        </div>
      </div>

      <div className="py-12 px-6">
        <div className="container max-w-5xl mx-auto">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-sm px-4 py-1.5 rounded-full border transition-all ${
                  activeCategory === cat
                    ? "border-cyan-500 bg-cyan-500/10 text-cyan-400"
                    : "border-border/50 text-muted-foreground hover:border-border"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Featured Post */}
          {featured && activeCategory === "الكل" && !search && (
            <div className={`mb-10 rounded-2xl border ${featured.border} bg-gradient-to-br ${featured.color} p-8`}>
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-cyan-500 text-white border-0 text-xs">{isAr ? "مقال مميز" : "[مقال مميز]"}</Badge>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">{featured.title}</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">{featured.excerpt}</p>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{featured.author}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{featured.readTime}</span>
                  <span>{featured.date}</span>
                </div>
                <button className="flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                  اقرأ المقال <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Posts Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>{isAr ? "لا توجد مقالات تطابق بحثك" : "لا توجد مقالات تطابق Searchك"}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.filter((p) => !(p.featured && activeCategory === "الكل" && !search)).map((post) => {
                const Icon = post.icon;
                return (
                  <div
                    key={post.id}
                    className={`border ${post.border} bg-gradient-to-br ${post.color} rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 cursor-pointer group`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Badge className={`${post.badge} border text-xs`}>{post.category}</Badge>
                      <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                        <Icon className="w-4 h-4 text-white/70" />
                      </div>
                    </div>
                    <h3 className="font-bold text-base mb-3 leading-relaxed line-clamp-2 group-hover:text-cyan-300 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.map((tag) => (
                        <span key={tag} className="text-xs bg-white/5 text-muted-foreground px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Tag className="w-2.5 h-2.5" />{tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-white/10">
                      <span className="flex items-center gap-1"><User className="w-3 h-3" />{post.author}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Newsletter CTA */}
          <div className="mt-16 p-8 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl text-center">
            <h3 className="text-xl font-bold mb-2">{isAr ? "اشترك في النشرة البريدية" : "اشترك في Deploymentة البريدية"}</h3>
            <p className="text-muted-foreground text-sm mb-6">{isAr ? "احصل على أحدث المقالات والتقارير مباشرةً في بريدك الإلكتروني" : "احصل على أحدث المقاNoت والتقارير مباشرةً في بريدك الإلكتروني"}</p>
            <div className="flex gap-3 max-w-md mx-auto">
              <Input placeholder="بريدك الإلكتروني" className="bg-card/50 border-border/50 flex-1" />
              <button
                onClick={() => toast.success("تم الاشتراك في النشرة البريدية بنجاح!")}
                className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm rounded-lg font-medium hover:opacity-90 transition-opacity shrink-0"
              >
                اشترك
              </button>
            </div>
          </div>
        </div>
      </div>

      <ImprovedFooter />
    </div>
  );
}
