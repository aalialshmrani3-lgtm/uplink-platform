/**
 * Classification Paths Page
 * عرض الأفكار حسب المسار (Innovation, Commercial, Guidance)
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, TrendingUp, Briefcase, Lightbulb, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function ClassificationPaths() {
  const [selectedPath, setSelectedPath] = useState<'innovation' | 'commercial' | 'guidance'>('innovation');

  // جلب الأفكار حسب المسار
  const { data: ideas, isLoading } = trpc.uplink1.getIdeasByPath.useQuery({
    path: selectedPath,
    limit: 50,
  });

  const pathConfig = {
    innovation: {
      title: "مسار الابتكار",
      description: "الأفكار عالية الابتكار والتأثير (≥70%)",
      icon: TrendingUp,
      color: "bg-green-500",
      badge: "success",
    },
    commercial: {
      title: "مسار التجاري",
      description: "الأفكار ذات الجدوى التجارية الجيدة (60-70%)",
      icon: Briefcase,
      color: "bg-yellow-500",
      badge: "warning",
    },
    guidance: {
      title: "مسار التوجيه",
      description: "الأفكار التي تحتاج إلى تطوير وتوجيه (<60%)",
      icon: Lightbulb,
      color: "bg-blue-500",
      badge: "info",
    },
  };

  const config = pathConfig[selectedPath];
  const Icon = config.icon;

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">مسارات التصنيف</h1>
        <p className="text-muted-foreground">
          عرض الأفكار حسب المسار المحدد من نظام التقييم الذكي
        </p>
      </div>

      {/* Tabs للمسارات */}
      <Tabs value={selectedPath} onValueChange={(value) => setSelectedPath(value as any)} className="mb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="innovation">
            <TrendingUp className="w-4 h-4 mr-2" />
            مسار الابتكار
          </TabsTrigger>
          <TabsTrigger value="commercial">
            <Briefcase className="w-4 h-4 mr-2" />
            مسار التجاري
          </TabsTrigger>
          <TabsTrigger value="guidance">
            <Lightbulb className="w-4 h-4 mr-2" />
            مسار التوجيه
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedPath} className="mt-6">
          {/* Header */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${config.color}`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{config.title}</CardTitle>
                  <CardDescription className="text-base">{config.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Ideas List */}
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : ideas && ideas.length > 0 ? (
            <div className="grid gap-4">
              {ideas.map((idea) => (
                <Card key={idea.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{idea.ideaTitle}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {idea.ideaDescription}
                        </CardDescription>
                      </div>
                      <Badge variant={config.badge as any} className="ml-4">
                        {idea.score}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Reason */}
                      {idea.reason && (
                        <div className="text-sm text-muted-foreground">
                          <strong>السبب:</strong> {idea.reason}
                        </div>
                      )}

                      {/* Next Steps */}
                      {idea.nextSteps && Array.isArray(idea.nextSteps) && idea.nextSteps.length > 0 && (
                        <div>
                          <strong className="text-sm">الخطوات التالية:</strong>
                          <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                            {idea.nextSteps.slice(0, 3).map((step: string, index: number) => (
                              <li key={index}>{step}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Status & Actions */}
                      <div className="flex items-center justify-between pt-3 border-t">
                        <Badge variant="outline">{idea.status}</Badge>
                        <Link href={`/uplink1/ideas/${idea.ideaId}`}>
                          <Button variant="ghost" size="sm">
                            عرض التفاصيل
                            <ArrowRight className="w-4 h-4 mr-2" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Icon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg text-muted-foreground">
                  لا توجد أفكار في هذا المسار حالياً
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
