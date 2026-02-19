import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, Filter, TrendingUp, Star, ArrowLeft, 
  Building2, Package, Briefcase, Eye, Heart
} from "lucide-react";
import { trpc } from "@/lib/trpc";

// Removed mock data - now using tRPC
const mockAssetsOld = [
  {
    id: 1,
    type: "license",
    title: "ترخيص تقنية الذكاء الاصطناعي للطاقة",
    description: "تقنية متقدمة لتحسين كفاءة استهلاك الطاقة باستخدام الذكاء الاصطناعي",
    owner: "شركة تقنية الابتكار",
    price: 50000,
    priceType: "yearly",
    rating: 4.9,
    views: 1250,
    likes: 89,
    category: "AI & ML",
    status: "active"
  },
  {
    id: 2,
    type: "license",
    title: "ترخيص خوارزمية التشفير المتقدم",
    description: "خوارزمية تشفير عالية الأمان للبيانات الحساسة",
    owner: "مجموعة الأمن السيبراني",
    price: 30000,
    priceType: "yearly",
    rating: 4.8,
    views: 980,
    likes: 67,
    category: "Security",
    status: "active"
  },
  {
    id: 3,
    type: "product",
    title: "نظام إدارة المخزون الذكي",
    description: "حل متكامل لإدارة المخزون مع تحليلات متقدمة",
    owner: "شركة الحلول التقنية",
    price: 75000,
    priceType: "one-time",
    rating: 4.7,
    views: 1580,
    likes: 112,
    category: "Enterprise",
    status: "active"
  },
  {
    id: 4,
    type: "product",
    title: "تطبيق التجارة الإلكترونية الجاهز",
    description: "تطبيق متكامل للتجارة الإلكترونية مع لوحة تحكم",
    owner: "مجموعة التطوير السريع",
    price: 120000,
    priceType: "one-time",
    rating: 4.9,
    views: 2340,
    likes: 156,
    category: "E-commerce",
    status: "active"
  },
  {
    id: 5,
    type: "acquisition",
    title: "شركة ناشئة في مجال التقنية المالية",
    description: "شركة ناشئة بـ 50 عميل نشط وإيرادات شهرية 100 ألف ريال",
    owner: "مؤسسو فينتك",
    price: 2500000,
    priceType: "one-time",
    rating: 4.6,
    views: 890,
    likes: 45,
    category: "Fintech",
    status: "negotiation"
  },
  {
    id: 6,
    type: "acquisition",
    title: "استحواذ على منصة التعليم الإلكتروني",
    description: "منصة تعليمية مع 10,000 مستخدم نشط",
    owner: "مجموعة التعليم الرقمي",
    price: 3800000,
    priceType: "one-time",
    rating: 4.8,
    views: 1120,
    likes: 78,
    category: "Education",
    status: "active"
  }
];

export default function Naqla3Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Fetch assets from backend
  const { data: assets, isLoading } = trpc.naqla3.assets.getAll.useQuery({
    type: selectedType !== "all" ? selectedType as any : undefined,
    category: selectedCategory !== "all" ? selectedCategory : undefined,
    search: searchQuery || undefined,
  });

  const filteredAssets = assets || [];

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "license": return "ترخيص";
      case "product": return "منتج";
      case "acquisition": return "استحواذ";
      default: return type;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "license": return <Building2 className="w-4 h-4" />;
      case "product": return <Package className="w-4 h-4" />;
      case "acquisition": return <Briefcase className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-950/50 via-background to-pink-950/30 border-b border-border/50">
        <div className="container mx-auto px-4 py-12">
          <Link href="/naqla3">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 ml-2" />
              العودة إلى NAQLA3
            </Button>
          </Link>

          <div className="flex items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-4">بورصة الابتكار</h1>
              <p className="text-xl text-muted-foreground">
                تصفح واشترِ التراخيص، المنتجات، والشركات الناشئة
              </p>
            </div>

            <Link href="/naqla3/sell">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                عرض أصل للبيع
              </Button>
            </Link>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="ابحث عن تراخيص، منتجات، أو شركات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="نوع الأصل" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="license">تراخيص</SelectItem>
                <SelectItem value="product">منتجات</SelectItem>
                <SelectItem value="acquisition">استحواذ</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="الفئة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الفئات</SelectItem>
                <SelectItem value="AI & ML">AI & ML</SelectItem>
                <SelectItem value="Security">Security</SelectItem>
                <SelectItem value="Enterprise">Enterprise</SelectItem>
                <SelectItem value="E-commerce">E-commerce</SelectItem>
                <SelectItem value="Fintech">Fintech</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-muted-foreground">جاري تحميل الأصول...</p>
            </div>
          </div>
        )}

        {!isLoading && (
        <>
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-purple-600 mb-1">5,000+</div>
              <div className="text-sm text-muted-foreground">أصل معروض</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-600 mb-1">2,000+</div>
              <div className="text-sm text-muted-foreground">صفقة مكتملة</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600 mb-1">100M+</div>
              <div className="text-sm text-muted-foreground">ريال معاملات</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-yellow-600 mb-1">99%</div>
              <div className="text-sm text-muted-foreground">معدل الأمان</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full justify-start mb-6">
            <TabsTrigger value="all">الكل ({filteredAssets.length})</TabsTrigger>
            <TabsTrigger value="license">
              تراخيص ({filteredAssets.filter(a => a.type === "license").length})
            </TabsTrigger>
            <TabsTrigger value="product">
              منتجات ({filteredAssets.filter(a => a.type === "product").length})
            </TabsTrigger>
            <TabsTrigger value="acquisition">
              استحواذ ({filteredAssets.filter(a => a.type === "acquisition").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssets.map((asset) => (
                <Link key={asset.id} href={`/naqla3/assets/${asset.id}`}>
                  <Card className="hover:border-primary/50 transition-all cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          {getTypeIcon(asset.type)}
                          {getTypeLabel(asset.type)}
                        </Badge>
                        <Badge variant={asset.status === "active" ? "default" : "secondary"}>
                          {asset.status === "active" ? "متاح" : "قيد التفاوض"}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg line-clamp-2">{asset.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {asset.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">المالك</p>
                          <p className="font-medium">{asset.ownerId}</p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-2xl font-bold text-primary">
                              {asset.price.toLocaleString()} ريال
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {"دفعة واحدة"}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                            <span className="font-semibold">N/A</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t">
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{asset.views}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            <span>{asset.likes}</span>
                          </div>
                          <Badge variant="secondary">{asset.category}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="license">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssets.filter(a => a.type === "license").map((asset) => (
                <Link key={asset.id} href={`/naqla3/assets/${asset.id}`}>
                  <Card className="hover:border-primary/50 transition-all cursor-pointer h-full">
                    {/* Same card content as above */}
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          {getTypeIcon(asset.type)}
                          {getTypeLabel(asset.type)}
                        </Badge>
                        <Badge variant={asset.status === "active" ? "default" : "secondary"}>
                          {asset.status === "active" ? "متاح" : "قيد التفاوض"}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg line-clamp-2">{asset.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {asset.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">المالك</p>
                          <p className="font-medium">{asset.ownerId}</p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-2xl font-bold text-primary">
                              {asset.price.toLocaleString()} ريال
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {"دفعة واحدة"}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                            <span className="font-semibold">N/A</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t">
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{asset.views}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            <span>{asset.likes}</span>
                          </div>
                          <Badge variant="secondary">{asset.category}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="product">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssets.filter(a => a.type === "product").map((asset) => (
                <Link key={asset.id} href={`/naqla3/assets/${asset.id}`}>
                  <Card className="hover:border-primary/50 transition-all cursor-pointer h-full">
                    {/* Same card content */}
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          {getTypeIcon(asset.type)}
                          {getTypeLabel(asset.type)}
                        </Badge>
                        <Badge variant={asset.status === "active" ? "default" : "secondary"}>
                          {asset.status === "active" ? "متاح" : "قيد التفاوض"}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg line-clamp-2">{asset.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {asset.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">المالك</p>
                          <p className="font-medium">{asset.ownerId}</p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-2xl font-bold text-primary">
                              {asset.price.toLocaleString()} ريال
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {"دفعة واحدة"}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                            <span className="font-semibold">N/A</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t">
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{asset.views}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            <span>{asset.likes}</span>
                          </div>
                          <Badge variant="secondary">{asset.category}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="acquisition">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssets.filter(a => a.type === "acquisition").map((asset) => (
                <Link key={asset.id} href={`/naqla3/assets/${asset.id}`}>
                  <Card className="hover:border-primary/50 transition-all cursor-pointer h-full">
                    {/* Same card content */}
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          {getTypeIcon(asset.type)}
                          {getTypeLabel(asset.type)}
                        </Badge>
                        <Badge variant={asset.status === "active" ? "default" : "secondary"}>
                          {asset.status === "active" ? "متاح" : "قيد التفاوض"}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg line-clamp-2">{asset.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {asset.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">المالك</p>
                          <p className="font-medium">{asset.ownerId}</p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-2xl font-bold text-primary">
                              {asset.price.toLocaleString()} ريال
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {"دفعة واحدة"}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                            <span className="font-semibold">N/A</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t">
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{asset.views}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            <span>{asset.likes}</span>
                          </div>
                          <Badge variant="secondary">{asset.category}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {filteredAssets.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground mb-4">لم يتم العثور على نتائج</p>
              <Button variant="outline" onClick={() => {
                setSearchQuery("");
                setSelectedType("all");
                setSelectedCategory("all");
              }}>
                إعادة تعيين الفلاتر
              </Button>
            </CardContent>
          </Card>
        )}
        </>
        )}
      </div>
    </div>
  );
}
