import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Lightbulb, TrendingUp, Eye } from "lucide-react";
import { Link } from "wouter";

type ClassificationFilter = 'all' | 'innovation' | 'commercial';

export default function RoutedIdeas() {
  const [classification, setClassification] = useState<ClassificationFilter>('all');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setTimeout(() => setDebouncedSearch(value), 500);
  };

  const { data: ideas, isLoading } = trpc.naqla2.getRoutedIdeas.useQuery({
    classification,
    search: debouncedSearch,
  });

  const getClassificationBadge = (score: number | null) => {
    if (!score) return null;
    if (score >= 70) {
      return <Badge className="bg-green-600">ابتكار حقيقي</Badge>;
    } else if (score >= 50) {
      return <Badge className="bg-blue-600">مشروع تجاري</Badge>;
    }
    return null;
  };

  const getScoreColor = (score: number | null) => {
    if (!score) return 'text-gray-500';
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-blue-600';
    return 'text-orange-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            الأفكار الموجهة إلى نقلة 2
          </h1>
          <p className="text-gray-600">
            استعرض وإدارة الأفكار التي تم توجيهها من نقلة 1 إلى نقلة 2
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="ابحث عن فكرة بالعنوان..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pr-10 text-right"
            />
          </div>
        </div>

        {/* Tabs for Classification Filter */}
        <Tabs value={classification} onValueChange={(value) => setClassification(value as ClassificationFilter)} className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">
              جميع الأفكار
            </TabsTrigger>
            <TabsTrigger value="innovation">
              <Lightbulb className="ml-2" size={16} />
              ابتكار حقيقي
            </TabsTrigger>
            <TabsTrigger value="commercial">
              <TrendingUp className="ml-2" size={16} />
              مشروع تجاري
            </TabsTrigger>
          </TabsList>

          <TabsContent value={classification} className="mt-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-20 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : ideas && ideas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ideas.map((idea) => (
                  <Card key={idea.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-xl text-right flex-1">{idea.title}</CardTitle>
                        {getClassificationBadge(idea.overallScore)}
                      </div>
                      <CardDescription className="text-right">
                        {idea.category && <span className="text-sm text-gray-500">{idea.category}</span>}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 text-right mb-4 line-clamp-3">
                        {idea.description}
                      </p>
                      
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-500">النتيجة الإجمالية</p>
                          <p className={`text-2xl font-bold ${getScoreColor(idea.overallScore)}`}>
                            {idea.overallScore || 'N/A'}%
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">تاريخ التوجيه</p>
                          <p className="text-sm font-medium">
                            {idea.routedAt ? new Date(idea.routedAt).toLocaleDateString('ar-SA') : 'غير محدد'}
                          </p>
                        </div>
                      </div>

                      <Link href={`/naqla1/ideas/${idea.id}/result`}>
                        <Button variant="outline" className="w-full">
                          <Eye className="ml-2" size={16} />
                          عرض التفاصيل
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Lightbulb className="text-gray-300 mb-4" size={64} />
                  <p className="text-gray-500 text-lg mb-2">لا توجد أفكار موجهة حالياً</p>
                  <p className="text-gray-400 text-sm">
                    {search ? 'جرب البحث بكلمات مختلفة' : 'ستظهر الأفكار الموجهة من نقلة 1 هنا'}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Stats Summary */}
        {ideas && ideas.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>ملخص إحصائي</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-3xl font-bold text-gray-900">{ideas.length}</p>
                  <p className="text-sm text-gray-600">إجمالي الأفكار الموجهة</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-3xl font-bold text-green-600">
                    {ideas.filter(i => i.overallScore && i.overallScore >= 70).length}
                  </p>
                  <p className="text-sm text-gray-600">ابتكار حقيقي</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-3xl font-bold text-blue-600">
                    {ideas.filter(i => i.overallScore && i.overallScore >= 50 && i.overallScore < 70).length}
                  </p>
                  <p className="text-sm text-gray-600">مشروع تجاري</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
