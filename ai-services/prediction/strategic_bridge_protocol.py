"""
UPLINK 5.0 - Strategic Bridge Protocol
النظام الموحد الذي يدمج جميع المكونات الأربعة

Author: Manus AI
Date: 31 يناير 2026
Version: 1.0
"""

import json
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict

# استيراد المكونات
from ceo_insights_engine import CEOInsightsEngine
from actionable_roadmap_engine import ActionableRoadmapEngine
from investment_simulator import InvestmentSimulator
from strategic_dashboard_generator import StrategicDashboardGenerator


@dataclass
class StrategicAnalysisResult:
    """نتيجة التحليل الاستراتيجي الكامل"""
    project_id: str
    project_title: str
    
    # المكونات الأربعة
    ceo_insights: Dict[str, Any]
    actionable_roadmap: Dict[str, Any]
    investor_readiness: Dict[str, Any]
    strategic_dashboard: Dict[str, Any]
    
    # الملخص التنفيذي
    executive_summary: str
    key_recommendations: List[str]
    
    # معلومات إضافية
    generated_at: str
    version: str


class StrategicBridgeProtocol:
    """
    بروتوكول الربط الاستراتيجي - النظام الموحد
    
    يدمج:
    1. CEO Insights Engine - ترجمة SHAP إلى لغة الأعمال
    2. Actionable Roadmap Engine - خطط عملية بناءً على ISO 56002
    3. Investment Simulator - محاكاة السيناريوهات الاستثمارية + IRL
    4. Strategic Dashboard Generator - لوحة التحكم الاستراتيجية + ICI
    """
    
    def __init__(self):
        self.ceo_engine = CEOInsightsEngine()
        self.roadmap_engine = ActionableRoadmapEngine()
        self.investment_simulator = InvestmentSimulator()
        self.dashboard_generator = StrategicDashboardGenerator()
        self.version = "1.0"
    
    def _clean_value(self, value: Any) -> float:
        """تنظيف القيم - تحويل النصوص إلى أرقام"""
        if isinstance(value, (int, float)):
            return float(value)
        if isinstance(value, str):
            # إزالة علامة %
            has_percent = "%" in value
            value = value.replace("%", "").strip()
            try:
                num = float(value)
                return num / 100 if has_percent else num
            except:
                return 0.0
        return 0.0
    
    def _clean_all_features(self, project_data: Dict[str, Any]) -> Dict[str, Any]:
        """تنظيف جميع القيم الرقمية في بيانات المشروع"""
        numeric_fields = [
            "budget", "team_size", "market_demand", "technical_feasibility",
            "hypothesis_validation_rate", "rat_completion_rate", "user_count",
            "revenue_growth", "user_engagement", "market_share", "roi"
        ]
        
        cleaned_data = project_data.copy()
        for field in numeric_fields:
            if field in cleaned_data:
                cleaned_data[field] = self._clean_value(cleaned_data[field])
        
        return cleaned_data
    
    def analyze_project(
        self,
        project_data: Dict[str, Any],
        shap_values: Optional[Dict[str, float]] = None
    ) -> StrategicAnalysisResult:
        """
        تحليل استراتيجي شامل للمشروع
        
        Args:
            project_data: بيانات المشروع الكاملة
            shap_values: قيم SHAP (اختياري - سيتم حسابها إذا لم تُقدَّم)
            
        Returns:
            StrategicAnalysisResult: النتيجة الكاملة
        """
        print("🚀 بدء التحليل الاستراتيجي الشامل...")
        
        # تنظيف جميع القيم الرقمية أولاً
        project_data = self._clean_all_features(project_data)
        
        # المرحلة 1: CEO Insights
        print("\n📊 المرحلة 1/4: توليد CEO Insights...")
        ceo_insights = self._generate_ceo_insights(project_data, shap_values)
        
        # المرحلة 2: Actionable Roadmap
        print("🗺️  المرحلة 2/4: بناء Actionable Roadmap...")
        roadmap = self._generate_roadmap(project_data, ceo_insights)
        
        # المرحلة 3: Investment Simulator
        print("💰 المرحلة 3/4: محاكاة السيناريوهات الاستثمارية...")
        irl, scenarios = self._simulate_investment(project_data)
        
        # المرحلة 4: Strategic Dashboard
        print("📈 المرحلة 4/4: توليد Strategic Dashboard...")
        dashboard = self._generate_dashboard(
            project_data,
            ceo_insights,
            roadmap,
            irl,
            scenarios
        )
        
        # توليد الملخص التنفيذي
        executive_summary = self._generate_final_summary(
            project_data,
            ceo_insights,
            irl,
            dashboard
        )
        
        # استخراج التوصيات الرئيسية
        key_recommendations = self._extract_key_recommendations(
            ceo_insights,
            roadmap,
            dashboard
        )
        
        print("\n✅ التحليل الاستراتيجي مكتمل!")
        
        return StrategicAnalysisResult(
            project_id=project_data.get("id", "unknown"),
            project_title=project_data.get("title", "مشروع غير معروف"),
            ceo_insights=ceo_insights,
            actionable_roadmap=roadmap,
            investor_readiness=irl,
            strategic_dashboard=dashboard,
            executive_summary=executive_summary,
            key_recommendations=key_recommendations,
            generated_at="2026-01-31",
            version=self.version
        )
    
    def _generate_ceo_insights(
        self,
        project_data: Dict[str, Any],
        shap_values: Optional[Dict[str, float]]
    ) -> Dict[str, Any]:
        """توليد CEO Insights"""
        # استخراج الميزات مع التنظيف
        features = {
            "budget": self._clean_value(project_data.get("budget", 0)),
            "team_size": self._clean_value(project_data.get("team_size", 0)),
            "market_demand": self._clean_value(project_data.get("market_demand", 50)),
            "technical_feasibility": self._clean_value(project_data.get("technical_feasibility", 50)),
            "hypothesis_validation_rate": self._clean_value(project_data.get("hypothesis_validation_rate", 0.5)),
            "rat_completion_rate": self._clean_value(project_data.get("rat_completion_rate", 0.5)),
            "user_count": self._clean_value(project_data.get("user_count", 0)),
            "revenue_growth": self._clean_value(project_data.get("revenue_growth", 0)),
            "user_engagement": self._clean_value(project_data.get("user_engagement", 50)),
            "market_share": self._clean_value(project_data.get("market_share", 0)),
            "roi": self._clean_value(project_data.get("roi", 0))
        }
        
        # إذا لم تُقدَّم SHAP values، استخدم قيم افتراضية
        if shap_values is None:
            shap_values = self._calculate_default_shap_values(features)
        
        # توليد الرؤى
        insights = self.ceo_engine.generate_ceo_insights(
            shap_values=shap_values,
            feature_values=features,
            sector=project_data.get("sector", "fintech"),
            organization=project_data.get("organization", "startup"),
            success_probability=project_data.get("success_probability", 50)
        )
        
        return self.ceo_engine.to_dict(insights)
    
    def _calculate_default_shap_values(self, features: Dict[str, float]) -> Dict[str, float]:
        """حساب قيم SHAP افتراضية بناءً على الميزات"""
        # قيم افتراضية بسيطة (في الواقع، يجب أن تأتي من نموذج SHAP مدرب)
        shap_values = {}
        
        # الميزانية
        avg_budget = 1_000_000
        if features["budget"] < avg_budget * 0.5:
            shap_values["budget"] = -0.15
        elif features["budget"] < avg_budget:
            shap_values["budget"] = -0.05
        else:
            shap_values["budget"] = 0.05
        
        # حجم الفريق
        if features["team_size"] < 3:
            shap_values["team_size"] = -0.08
        elif features["team_size"] < 5:
            shap_values["team_size"] = 0.0
        else:
            shap_values["team_size"] = 0.05
        
        # الطلب السوقي
        if features["market_demand"] < 40:
            shap_values["market_demand"] = -0.12
        elif features["market_demand"] < 60:
            shap_values["market_demand"] = 0.0
        else:
            shap_values["market_demand"] = 0.10
        
        # الجدوى التقنية
        if features["technical_feasibility"] < 50:
            shap_values["technical_feasibility"] = -0.10
        else:
            shap_values["technical_feasibility"] = 0.05
        
        # التحقق من الفرضيات
        if features["hypothesis_validation_rate"] < 0.5:
            shap_values["hypothesis_validation_rate"] = -0.18
        else:
            shap_values["hypothesis_validation_rate"] = 0.08
        
        # RAT
        if features["rat_completion_rate"] < 0.5:
            shap_values["rat_completion_rate"] = -0.12
        else:
            shap_values["rat_completion_rate"] = 0.06
        
        return shap_values
    
    def _generate_roadmap(
        self,
        project_data: Dict[str, Any],
        ceo_insights: Dict[str, Any]
    ) -> Dict[str, Any]:
        """توليد Actionable Roadmap"""
        # استخراج الرؤى الحرجة
        insights = ceo_insights.get("insights", [])
        critical_insights = [
            i for i in insights
            if i.get("severity") in ["critical", "high"]
        ]
        
        # توليد خارطة طريق لكل رؤية حرجة
        roadmaps = []
        for insight in critical_insights[:3]:  # أخذ أعلى 3
            roadmap = self.roadmap_engine.generate_roadmap(
                risk_category=insight.get("category", "general"),
                risk_description=insight.get("title", ""),
                current_situation=insight.get("impact", ""),
                project_context={
                    "sector": project_data.get("sector", ""),
                    "stage": project_data.get("stage", "seed"),
                    "budget": project_data.get("budget", 0)
                }
            )
            roadmaps.append(self.roadmap_engine.to_dict(roadmap))
        
        # دمج خرائط الطريق
        if roadmaps:
            return roadmaps[0]  # إرجاع الأولى (الأكثر أهمية)
        else:
            # خارطة طريق افتراضية
            return {
                "roadmap_id": "default",
                "title": "خطة تحسين عامة",
                "priority": "medium",
                "tactical_moves": []
            }
    
    def _simulate_investment(
        self,
        project_data: Dict[str, Any]
    ) -> tuple:
        """محاكاة السيناريوهات الاستثمارية"""
        # استخراج الميزات
        features = {
            "budget": project_data.get("budget", 0),
            "team_size": project_data.get("team_size", 0),
            "market_demand": project_data.get("market_demand", 50),
            "technical_feasibility": project_data.get("technical_feasibility", 50),
            "hypothesis_validation_rate": project_data.get("hypothesis_validation_rate", 0.5),
            "rat_completion_rate": project_data.get("rat_completion_rate", 0.5),
            "user_count": project_data.get("user_count", 0),
            "revenue_growth": project_data.get("revenue_growth", 0),
            "user_engagement": project_data.get("user_engagement", 50),
            "market_share": project_data.get("market_share", 0),
            "roi": project_data.get("roi", 0)
        }
        
        # حساب IRL
        irl = self.investment_simulator.calculate_irl(
            features=features,
            sector=project_data.get("sector", "fintech"),
            organization=project_data.get("organization", "startup"),
            stage=project_data.get("stage", "seed"),
            success_probability=project_data.get("success_probability", 50)
        )
        
        # محاكاة السيناريوهات
        scenarios = self.investment_simulator.simulate_investment_scenarios(
            irl=irl,
            sector=project_data.get("sector", "fintech"),
            stage=project_data.get("stage", "seed")
        )
        
        return (
            self.investment_simulator.to_dict(irl),
            self.investment_simulator.scenarios_to_dict(scenarios)
        )
    
    def _generate_dashboard(
        self,
        project_data: Dict[str, Any],
        ceo_insights: Dict[str, Any],
        roadmap: Dict[str, Any],
        irl: Dict[str, Any],
        scenarios: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """توليد Strategic Dashboard"""
        dashboard = self.dashboard_generator.generate_dashboard(
            project_data=project_data,
            ceo_insights=ceo_insights,
            roadmap=roadmap,
            irl=irl,
            scenarios=scenarios
        )
        
        return self.dashboard_generator.to_dict(dashboard)
    
    def _generate_final_summary(
        self,
        project_data: Dict[str, Any],
        ceo_insights: Dict[str, Any],
        irl: Dict[str, Any],
        dashboard: Dict[str, Any]
    ) -> str:
        """توليد الملخص التنفيذي النهائي"""
        title = project_data.get("title", "المشروع")
        ici_score = dashboard.get("ici", {}).get("ici_score", 0)
        irl_score = irl.get("irl_score", 0)
        success_prob = project_data.get("success_probability", 50)
        
        summary = f"""
# التحليل الاستراتيجي الشامل: {title}

## الملخص التنفيذي

تم إجراء تحليل استراتيجي شامل للمشروع باستخدام Strategic Bridge Protocol، وهو نظام متقدم يدمج أربعة محركات ذكاء اصطناعي لتحويل البيانات التقنية إلى رؤى استراتيجية قابلة للتنفيذ.

### المؤشرات الرئيسية:
- **مؤشر الثقة في الابتكار (ICI):** {ici_score:.1f}/100
- **جاهزية المستثمر (IRL):** {irl_score:.1f}/100
- **احتمالية النجاح:** {success_prob:.0f}%

### التقييم العام:
{self._get_overall_assessment(ici_score, irl_score, success_prob)}

### الأولويات الحرجة:
{self._format_priorities(ceo_insights)}

### التوصيات الاستراتيجية:
{self._format_strategic_recommendations(dashboard)}

---

**تم توليد هذا التقرير بواسطة:** UPLINK 5.0 Strategic Bridge Protocol v{self.version}  
**التاريخ:** 31 يناير 2026
"""
        return summary.strip()
    
    def _get_overall_assessment(self, ici: float, irl: float, success_prob: float) -> str:
        """تقييم عام للمشروع"""
        avg_score = (ici + irl + success_prob) / 3
        
        if avg_score >= 75:
            return "المشروع يُظهر إمكانات قوية جداً مع فرص نجاح عالية. يُنصح بالمضي قدماً بثقة."
        elif avg_score >= 60:
            return "المشروع يُظهر إمكانات واعدة مع بعض التحديات. يُنصح بمعالجة المخاطر الحرجة قبل التوسع."
        elif avg_score >= 45:
            return "المشروع يواجه تحديات متوسطة إلى عالية. يُنصح بإعادة تقييم الاستراتيجية والتركيز على التحسينات الأساسية."
        else:
            return "المشروع يواجه تحديات كبيرة تتطلب تدخلاً فورياً. يُنصح بإعادة هيكلة جذرية أو pivot."
    
    def _format_priorities(self, ceo_insights: Dict[str, Any]) -> str:
        """تنسيق الأولويات"""
        insights = ceo_insights.get("insights", [])
        critical = [i for i in insights if i.get("severity") == "critical"][:3]
        
        if not critical:
            return "لا توجد أولويات حرجة في الوقت الحالي."
        
        formatted = []
        for i, insight in enumerate(critical, 1):
            formatted.append(f"{i}. **{insight.get('title', '')}**")
        
        return "\n".join(formatted)
    
    def _format_strategic_recommendations(self, dashboard: Dict[str, Any]) -> str:
        """تنسيق التوصيات الاستراتيجية"""
        recommendations = dashboard.get("strategic_recommendations", [])
        
        if not recommendations:
            return "لا توجد توصيات استراتيجية محددة."
        
        return "\n".join([f"- {r}" for r in recommendations[:5]])
    
    def _extract_key_recommendations(
        self,
        ceo_insights: Dict[str, Any],
        roadmap: Dict[str, Any],
        dashboard: Dict[str, Any]
    ) -> List[str]:
        """استخراج التوصيات الرئيسية"""
        recommendations = []
        
        # من CEO Insights
        insights = ceo_insights.get("insights", [])
        for insight in insights[:2]:
            recommendations.append(insight.get("title", ""))
        
        # من Dashboard
        dashboard_recs = dashboard.get("strategic_recommendations", [])
        recommendations.extend(dashboard_recs[:3])
        
        return recommendations[:5]
    
    def to_dict(self, result: StrategicAnalysisResult) -> Dict[str, Any]:
        """تحويل النتيجة إلى قاموس"""
        return {
            "project_id": result.project_id,
            "project_title": result.project_title,
            "ceo_insights": result.ceo_insights,
            "actionable_roadmap": result.actionable_roadmap,
            "investor_readiness": result.investor_readiness,
            "strategic_dashboard": result.strategic_dashboard,
            "executive_summary": result.executive_summary,
            "key_recommendations": result.key_recommendations,
            "generated_at": result.generated_at,
            "version": result.version
        }
    
    def save_to_file(self, result: StrategicAnalysisResult, filepath: str):
        """حفظ النتيجة في ملف JSON"""
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(self.to_dict(result), f, ensure_ascii=False, indent=2)
        print(f"✅ تم حفظ النتيجة في: {filepath}")


# مثال على الاستخدام
if __name__ == "__main__":
    # بيانات تجريبية
    project_data = {
        "id": "test_001",
        "title": "منصة تقنية مالية مبتكرة",
        "sector": "fintech",
        "organization": "startup",
        "stage": "seed",
        "region": "الرياض",
        "budget": 500000,
        "team_size": 5,
        "market_demand": 65,
        "technical_feasibility": 75,
        "hypothesis_validation_rate": 0.60,
        "rat_completion_rate": 0.55,
        "user_count": 2000,
        "revenue_growth": 0.15,
        "user_engagement": 60,
        "market_share": 0.02,
        "roi": 0.10,
        "success_probability": 65.0
    }
    
    # إنشاء البروتوكول
    protocol = StrategicBridgeProtocol()
    
    # تحليل المشروع
    result = protocol.analyze_project(project_data)
    
    # حفظ النتيجة
    protocol.save_to_file(result, "strategic_analysis_result.json")
    
    # طباعة الملخص
    print("\n" + "=" * 70)
    print(result.executive_summary)
    print("=" * 70)
