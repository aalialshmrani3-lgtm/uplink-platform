import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, TrendingUp, Lightbulb, MessageSquare, Sparkles, Target, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function AIInsightsDashboard() {
  const [loading, setLoading] = useState(false);

  // Sentiment Analysis State
  const [sentimentText, setSentimentText] = useState("");
  const [sentimentResult, setSentimentResult] = useState<any>(null);

  // Success Prediction State
  const [predictionForm, setPredictionForm] = useState({
    title: "",
    description: "",
    sector: "",
    budget: ""
  });
  const [predictionResult, setPredictionResult] = useState<any>(null);

  // Idea Suggestion State
  const [suggestionForm, setSuggestionForm] = useState({
    interests: "",
    sector: ""
  });
  const [suggestions, setSuggestions] = useState<any>(null);

  // Sentiment Analysis Handler
  const analyzeSentiment = async () => {
    if (!sentimentText.trim()) {
      toast.error("الرجاء إدخال نص للتحليل");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8001/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: sentimentText })
      });
      
      if (!response.ok) throw new Error("فشل التحليل");
      
      const data = await response.json();
      setSentimentResult(data);
      
      toast.success(`تم التحليل بنجاح - المشاعر: ${data.sentiment} ${data.emoji}`);
    } catch (error) {
      toast.error("فشل الاتصال بخدمة تحليل المشاعر");
    } finally {
      setLoading(false);
    }
  };

  // Success Prediction Handler
  const predictSuccess = async () => {
    if (!predictionForm.title || !predictionForm.description || !predictionForm.sector || !predictionForm.budget) {
      toast.error("الرجاء ملء جميع الحقول");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8002/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: predictionForm.title,
          description: predictionForm.description,
          sector: predictionForm.sector,
          budget: parseFloat(predictionForm.budget)
        })
      });
      
      if (!response.ok) throw new Error("فشل التوقع");
      
      const data = await response.json();
      setPredictionResult(data);
      
      toast.success(`تم التوقع بنجاح - احتمالية النجاح: ${(data.success_probability * 100).toFixed(1)}%`);
    } catch (error) {
      toast.error("فشل الاتصال بخدمة توقع النجاح");
    } finally {
      setLoading(false);
    }
  };

  // Idea Suggestion Handler
  const suggestIdeas = async () => {
    if (!suggestionForm.interests || !suggestionForm.sector) {
      toast.error("الرجاء ملء جميع الحقول");
      return;
    }

    setLoading(true);
    try {
      const interests = suggestionForm.interests.split(",").map(i => i.trim());
      
      const response = await fetch("http://localhost:8003/suggest-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interests,
          sector: suggestionForm.sector
        })
      });
      
      if (!response.ok) throw new Error("فشل الاقتراح");
      
      const data = await response.json();
      setSuggestions(data);
      
      toast.success(`تم الاقتراح بنجاح - تم إيجاد ${data.total_count} اقتراح`);
    } catch (error) {
      toast.error("فشل الاتصال بخدمة اقتراح الأفكار");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Brain className="w-10 h-10 text-purple-600" />
          <h1 className="text-4xl font-bold">لوحة رؤى الذكاء الاصطناعي</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          استخدم قوة الذكاء الاصطناعي لتحليل الأفكار، توقع النجاح، واكتشاف فرص جديدة
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">تحليل المشاعر</CardTitle>
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">AraBERT</div>
            <p className="text-xs text-muted-foreground">نموذج متقدم للغة العربية</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">توقع النجاح</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">XGBoost</div>
            <p className="text-xs text-muted-foreground">دقة تصل إلى 85%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">اقتراح الأفكار</CardTitle>
            <Lightbulb className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">AI-Powered</div>
            <p className="text-xs text-muted-foreground">اقتراحات مخصصة</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="sentiment" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sentiment">
            <MessageSquare className="w-4 h-4 ml-2" />
            تحليل المشاعر
          </TabsTrigger>
          <TabsTrigger value="prediction">
            <TrendingUp className="w-4 h-4 ml-2" />
            توقع النجاح
          </TabsTrigger>
          <TabsTrigger value="suggestion">
            <Lightbulb className="w-4 h-4 ml-2" />
            اقتراح الأفكار
          </TabsTrigger>
        </TabsList>

        {/* Sentiment Analysis Tab */}
        <TabsContent value="sentiment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                تحليل المشاعر بالذكاء الاصطناعي
              </CardTitle>
              <CardDescription>
                استخدم AraBERT لتحليل مشاعر النصوص العربية والإنجليزية
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="sentiment-text">النص للتحليل</Label>
                <Textarea
                  id="sentiment-text"
                  placeholder="أدخل النص الذي تريد تحليل مشاعره..."
                  value={sentimentText}
                  onChange={(e) => setSentimentText(e.target.value)}
                  rows={4}
                />
              </div>

              <Button onClick={analyzeSentiment} disabled={loading} className="w-full">
                {loading ? "جاري التحليل..." : "تحليل المشاعر"}
              </Button>

              {sentimentResult && (
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-yellow-500" />
                      نتيجة التحليل
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">المشاعر:</span>
                      <Badge variant={
                        sentimentResult.sentiment === "Positive" ? "default" :
                        sentimentResult.sentiment === "Negative" ? "destructive" : "secondary"
                      }>
                        {sentimentResult.emoji} {sentimentResult.sentiment}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">الثقة:</span>
                      <span className="text-sm">{(sentimentResult.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${sentimentResult.confidence * 100}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Success Prediction Tab */}
        <TabsContent value="prediction" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                توقع نجاح الفكرة
              </CardTitle>
              <CardDescription>
                استخدم التعلم الآلي لتوقع احتمالية نجاح فكرتك
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pred-title">عنوان الفكرة</Label>
                  <Input
                    id="pred-title"
                    placeholder="مثال: منصة ذكية للتعليم"
                    value={predictionForm.title}
                    onChange={(e) => setPredictionForm({...predictionForm, title: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="pred-sector">القطاع</Label>
                  <Select value={predictionForm.sector} onValueChange={(v) => setPredictionForm({...predictionForm, sector: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر القطاع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="التقنية">التقنية</SelectItem>
                      <SelectItem value="الصحة">الصحة</SelectItem>
                      <SelectItem value="التعليم">التعليم</SelectItem>
                      <SelectItem value="الطاقة">الطاقة</SelectItem>
                      <SelectItem value="التجارة">التجارة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="pred-desc">الوصف</Label>
                <Textarea
                  id="pred-desc"
                  placeholder="صف فكرتك بالتفصيل..."
                  value={predictionForm.description}
                  onChange={(e) => setPredictionForm({...predictionForm, description: e.target.value})}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="pred-budget">الميزانية (ريال)</Label>
                <Input
                  id="pred-budget"
                  type="number"
                  placeholder="50000"
                  value={predictionForm.budget}
                  onChange={(e) => setPredictionForm({...predictionForm, budget: e.target.value})}
                />
              </div>

              <Button onClick={predictSuccess} disabled={loading} className="w-full">
                {loading ? "جاري التوقع..." : "توقع النجاح"}
              </Button>

              {predictionResult && (
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="w-5 h-5 text-green-500" />
                      نتيجة التوقع
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">احتمالية النجاح:</span>
                      <span className="text-2xl font-bold text-green-600">
                        {(predictionResult.success_probability * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">مستوى المخاطرة:</span>
                      <Badge variant={
                        predictionResult.risk_level === "Low" ? "default" :
                        predictionResult.risk_level === "High" ? "destructive" : "secondary"
                      }>
                        {predictionResult.risk_level}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        التوصيات:
                      </h4>
                      <ul className="space-y-1">
                        {predictionResult.recommendations.map((rec: string, idx: number) => (
                          <li key={idx} className="text-sm text-muted-foreground">
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Idea Suggestion Tab */}
        <TabsContent value="suggestion" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                اقتراح أفكار جديدة
              </CardTitle>
              <CardDescription>
                احصل على اقتراحات مخصصة بناءً على اهتماماتك وقطاعك
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="sugg-interests">الاهتمامات (مفصولة بفواصل)</Label>
                <Input
                  id="sugg-interests"
                  placeholder="مثال: AI, صحة, تعليم"
                  value={suggestionForm.interests}
                  onChange={(e) => setSuggestionForm({...suggestionForm, interests: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="sugg-sector">القطاع</Label>
                <Select value={suggestionForm.sector} onValueChange={(v) => setSuggestionForm({...suggestionForm, sector: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر القطاع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="الكل">جميع القطاعات</SelectItem>
                    <SelectItem value="التقنية">التقنية</SelectItem>
                    <SelectItem value="الصحة">الصحة</SelectItem>
                    <SelectItem value="التعليم">التعليم</SelectItem>
                    <SelectItem value="الطاقة">الطاقة</SelectItem>
                    <SelectItem value="التجارة">التجارة</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={suggestIdeas} disabled={loading} className="w-full">
                {loading ? "جاري الاقتراح..." : "اقترح أفكار"}
              </Button>

              {suggestions && (
                <div className="space-y-4">
                  <h4 className="font-semibold">تم إيجاد {suggestions.total_count} اقتراح:</h4>
                  {suggestions.suggestions.map((idea: any) => (
                    <Card key={idea.id} className="bg-muted/50">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-base">{idea.title}</CardTitle>
                          <Badge>{(idea.relevance_score * 100).toFixed(0)}%</Badge>
                        </div>
                        <CardDescription>{idea.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {idea.tags.map((tag: string, idx: number) => (
                            <Badge key={idx} variant="outline">{tag}</Badge>
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground">{idea.why_suggested}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
