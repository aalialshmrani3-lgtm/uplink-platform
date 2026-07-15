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
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AIInsightsDashboard() {
  const { language } = useLanguage();
  const isAr = language === 'ar';

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

  // TRPC Mutations
  const sentimentMutation = trpc.ai.analyzeSentiment.useMutation({
    onSuccess: (data) => {
      setSentimentResult(data);
      toast.success(isAr ? `تم التحليل بنجاح - المشاعر: ${data.sentiment} ${data.emoji}` : `Analysis successful - Sentiment: ${data.sentiment} ${data.emoji}`);
    },
    onError: () => {
      toast.error(isAr ? "فشل تحليل المشاعر" : "Sentiment analysis failed");
    }
  });

  const predictionMutation = trpc.ai.predictSuccess.useMutation({
    onSuccess: (data) => {
      setPredictionResult(data);
      toast.success(isAr ? `تم التوقع بنجاح - احتمالية النجاح: ${(data.success_probability * 100).toFixed(1)}%` : `Prediction successful - Success probability: ${(data.success_probability * 100).toFixed(1)}%`);
    },
    onError: () => {
      toast.error(isAr ? "فشل توقع النجاح" : "Success prediction failed");
    }
  });

  const suggestionMutation = trpc.ai.suggestIdeas.useMutation({
    onSuccess: (data) => {
      setSuggestions(data);
      toast.success(isAr ? `تم الاقتراح بنجاح - تم إيجاد ${data.total_count} اقتراح` : `Suggestion successful - Found ${data.total_count} suggestions`);
    },
    onError: () => {
      toast.error(isAr ? "فشل اقتراح الأفكار" : "Idea suggestion failed");
    }
  });

  // Sentiment Analysis Handler
  const analyzeSentiment = () => {
    if (!sentimentText.trim()) {
      toast.error(isAr ? "الرجاء إدخال نص للتحليل" : "Please enter text for analysis");
      return;
    }
    sentimentMutation.mutate({ text: sentimentText });
  };

  // Success Prediction Handler
  const predictSuccess = () => {
    if (!predictionForm.title || !predictionForm.description || !predictionForm.sector || !predictionForm.budget) {
      toast.error(isAr ? "الرجاء ملء جميع الحقول" : "Please fill in all fields");
      return;
    }
    predictionMutation.mutate({
      title: predictionForm.title,
      description: predictionForm.description,
      sector: predictionForm.sector,
      budget: parseFloat(predictionForm.budget)
    });
  };

  // Idea Suggestion Handler
  const suggestIdeas = () => {
    if (!suggestionForm.interests || !suggestionForm.sector) {
      toast.error(isAr ? "الرجاء ملء جميع الحقول" : "Please fill in all fields");
      return;
    }
    const interests = suggestionForm.interests.split(",").map(i => i.trim()).filter(Boolean);
    suggestionMutation.mutate({ interests, sector: suggestionForm.sector });
  };

  const isLoading = sentimentMutation.isPending || predictionMutation.isPending || suggestionMutation.isPending;

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Brain className="w-10 h-10 text-purple-600" />
          <h1 className="text-4xl font-bold">{isAr ? "لوحة رؤى الذكاء الاصطناعي" : "AI Insights Dashboard"}</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          {isAr ? "استخدم قوة الذكاء الاصطناعي لتحليل الأفكار، توقع النجاح، واكتشاف فرص جديدة" : "Harness the power of AI to analyze ideas, predict success, and discover new opportunities"}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{isAr ? "تحليل المشاعر" : "Sentiment Analysis"}</CardTitle>
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">AraBERT</div>
            <p className="text-xs text-muted-foreground">{isAr ? "نموذج متقدم للغة العربية" : "Advanced Arabic Language Model"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{isAr ? "توقع النجاح" : "Success Prediction"}</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">XGBoost</div>
            <p className="text-xs text-muted-foreground">{isAr ? "دقة تصل إلى 85%" : "Up to 85% Accuracy"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{isAr ? "اقتراح الأفكار" : "Idea Suggestion"}</CardTitle>
            <Lightbulb className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">AI-Powered</div>
            <p className="text-xs text-muted-foreground">{isAr ? "اقتراحات مخصصة" : "Personalized Suggestions"}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="sentiment" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sentiment">
            <MessageSquare className="w-4 h-4 ml-2" />
            {isAr ? "تحليل المشاعر" : "Sentiment Analysis"}
          </TabsTrigger>
          <TabsTrigger value="prediction">
            <TrendingUp className="w-4 h-4 ml-2" />
            {isAr ? "توقع النجاح" : "Success Prediction"}
          </TabsTrigger>
          <TabsTrigger value="suggestion">
            <Lightbulb className="w-4 h-4 ml-2" />
            {isAr ? "اقتراح الأفكار" : "Idea Suggestion"}
          </TabsTrigger>
        </TabsList>

        {/* Sentiment Analysis Tab */}
        <TabsContent value="sentiment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                {isAr ? "تحليل المشاعر بالذكاء الاصطناعي" : "AI Sentiment Analysis"}
              </CardTitle>
              <CardDescription>
                {isAr ? "استخدم AraBERT لتحليل مشاعر النصوص العربية والإنجليزية" : "Use AraBERT to analyze sentiment in Arabic and English texts"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="sentiment-text">{isAr ? "النص للتحليل" : "Text for Analysis"}</Label>
                <Textarea
                  id="sentiment-text"
                  placeholder={isAr ? "أدخل النص الذي تريد تحليل مشاعره..." : "Enter the text you want to analyze its sentiment..."}
                  value={sentimentText}
                  onChange={(e) => setSentimentText(e.target.value)}
                  rows={4}
                />
              </div>

              <Button onClick={analyzeSentiment} disabled={isLoading} className="w-full">
                {sentimentMutation.isPending ? (isAr ? "جاري التحليل..." : "Analyzing...") : (isAr ? "تحليل المشاعر" : "Analyze Sentiment")}
              </Button>

              {sentimentResult && (
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-yellow-500" />
                      {isAr ? "نتيجة التحليل" : "Analysis Result"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{isAr ? "المشاعر:" : "Sentiment:"}</span>
                      <Badge variant={
                        sentimentResult.sentiment === "Positive" ? "default" :
                        sentimentResult.sentiment === "Negative" ? "destructive" : "secondary"
                      }>
                        {isAr ?
                          `${sentimentResult.emoji} ${sentimentResult.sentiment === "Positive" ? "إيجابي" : sentimentResult.sentiment === "Negative" ? "سلبي" : "محايد"}`
                          :
                          `${sentimentResult.emoji} ${sentimentResult.sentiment}`
                        }
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{isAr ? "الثقة:" : "Confidence:"}</span>
                      <span className="text-sm">{(sentimentResult.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${sentimentResult.confidence * 100}%` }}
                      />
                    </div>
                    {sentimentResult.explanation && (
                      <p className="text-sm text-muted-foreground">{sentimentResult.explanation}</p>
                    )}
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
                {isAr ? "توقع نجاح الفكرة" : "Idea Success Prediction"}
              </CardTitle>
              <CardDescription>
                {isAr ? "استخدم التعلم الآلي لتوقع احتمالية نجاح فكرتك" : "Use machine learning to predict the probability of your idea's success"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pred-title">{isAr ? "عنوان الفكرة" : "Idea Title"}</Label>
                  <Input
                    id="pred-title"
                    placeholder={isAr ? "مثال: منصة ذكية للتعليم" : "Example: Smart Education Platform"}
                    value={predictionForm.title}
                    onChange={(e) => setPredictionForm({...predictionForm, title: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="pred-sector">{isAr ? "القطاع" : "Sector"}</Label>
                  <Select value={predictionForm.sector} onValueChange={(v) => setPredictionForm({...predictionForm, sector: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder={isAr ? "اختر القطاع" : "Select Sector"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="التقنية">{isAr ? "التقنية" : "Technology"}</SelectItem>
                      <SelectItem value="الصحة">{isAr ? "الصحة" : "Health"}</SelectItem>
                      <SelectItem value="التعليم">{isAr ? "التعليم" : "Education"}</SelectItem>
                      <SelectItem value="الطاقة">{isAr ? "الطاقة" : "Energy"}</SelectItem>
                      <SelectItem value="التجارة">{isAr ? "التجارة" : "Commerce"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="pred-desc">{isAr ? "الوصف" : "Description"}</Label>
                <Textarea
                  id="pred-desc"
                  placeholder={isAr ? "صف فكرتك بالتفصيل..." : "Describe your idea in detail..."}
                  value={predictionForm.description}
                  onChange={(e) => setPredictionForm({...predictionForm, description: e.target.value})}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="pred-budget">{isAr ? "الميزانية (ريال)" : "Budget (SAR)"}</Label>
                <Input
                  id="pred-budget"
                  type="number"
                  placeholder="50000"
                  value={predictionForm.budget}
                  onChange={(e) => setPredictionForm({...predictionForm, budget: e.target.value})}
                />
              </div>

              <Button onClick={predictSuccess} disabled={isLoading} className="w-full">
                {predictionMutation.isPending ? (isAr ? "جاري التوقع..." : "Predicting...") : (isAr ? "توقع النجاح" : "Predict Success")}
              </Button>

              {predictionResult && (
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="w-5 h-5 text-green-500" />
                      {isAr ? "نتيجة التوقع" : "Prediction Result"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{isAr ? "احتمالية النجاح:" : "Success Probability:"}</span>
                      <span className="text-2xl font-bold text-green-600">
                        {(predictionResult.success_probability * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{isAr ? "مستوى المخاطرة:" : "Risk Level:"}</span>
                      <Badge variant={
                        predictionResult.risk_level === "Low" ? "default" :
                        predictionResult.risk_level === "High" ? "destructive" : "secondary"
                      }>
                        {isAr ? (predictionResult.risk_level === "Low" ? "منخفض" : predictionResult.risk_level === "High" ? "مرتفع" : "متوسط") : predictionResult.risk_level}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {isAr ? "التوصيات:" : "Recommendations:"}
                      </h4>
                      <ul className="space-y-1">
                        {predictionResult.recommendations.map((rec: string, idx: number) => (
                          <li key={idx} className="text-sm text-muted-foreground">• {rec}</li>
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
                {isAr ? "اقتراح أفكار جديدة" : "Suggest New Ideas"}
              </CardTitle>
              <CardDescription>
                {isAr ? "احصل على اقتراحات مخصصة بناءً على اهتماماتك وقطاعك" : "Get personalized suggestions based on your interests and sector"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="sugg-interests">{isAr ? "الاهتمامات (مفصولة بفواصل)" : "Interests (comma-separated)"}</Label>
                <Input
                  id="sugg-interests"
                  placeholder={isAr ? "مثال: AI, صحة, تعليم" : "Example: AI, Health, Education"}
                  value={suggestionForm.interests}
                  onChange={(e) => setSuggestionForm({...suggestionForm, interests: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="sugg-sector">{isAr ? "القطاع" : "Sector"}</Label>
                <Select value={suggestionForm.sector} onValueChange={(v) => setSuggestionForm({...suggestionForm, sector: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder={isAr ? "اختر القطاع" : "Select Sector"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="الكل">{isAr ? "جميع القطاعات" : "All Sectors"}</SelectItem>
                    <SelectItem value="التقنية">{isAr ? "التقنية" : "Technology"}</SelectItem>
                    <SelectItem value="الصحة">{isAr ? "الصحة" : "Health"}</SelectItem>
                    <SelectItem value="التعليم">{isAr ? "التعليم" : "Education"}</SelectItem>
                    <SelectItem value="الطاقة">{isAr ? "الطاقة" : "Energy"}</SelectItem>
                    <SelectItem value="التجارة">{isAr ? "التجارة" : "Commerce"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={suggestIdeas} disabled={isLoading} className="w-full">
                {suggestionMutation.isPending ? (isAr ? "جاري الاقتراح..." : "Suggesting...") : (isAr ? "اقترح أفكار" : "Suggest Ideas")}
              </Button>

              {suggestions && (
                <div className="space-y-4">
                  <h4 className="font-semibold">{isAr ? `تم إيجاد ${suggestions.total_count} اقتراح:` : `Found ${suggestions.total_count} suggestions:`}</h4>
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