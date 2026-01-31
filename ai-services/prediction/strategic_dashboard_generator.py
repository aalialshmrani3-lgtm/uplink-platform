"""
UPLINK 5.0 - Strategic Dashboard Generator
Strategic Bridge Protocol - Component 4

توليد لوحة التحكم الاستراتيجية مع Innovation Confidence Index والتصورات التفاعلية.

Author: Manus AI
Date: 31 يناير 2026
Version: 1.0
"""

import json
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict
from enum import Enum


class ConfidenceLevel(Enum):
    """مستويات الثقة في الابتكار"""
    VERY_HIGH = "very_high"  # 85-100
    HIGH = "high"  # 70-84
    MEDIUM = "medium"  # 50-69
    LOW = "low"  # 30-49
    VERY_LOW = "very_low"  # 0-29


@dataclass
class InnovationConfidenceIndex:
    """مؤشر الثقة في الابتكار (ICI)"""
    ici_score: float  # 0-100
    confidence_level: ConfidenceLevel
    success_probability: float  # 0-1
    risk_level: str  # critical, high, medium, low
    investor_readiness: float  # 0-100 (IRL)
    market_fit_score: float  # 0-100
    execution_readiness: float  # 0-100
    financial_sustainability: float  # 0-100
    
    # المسار الحرج
    critical_path_stages: List[Dict[str, Any]]
    estimated_time_to_success: str  # e.g., "12-18 أشهر"
    key_milestones: List[str]
    
    # التوصيات الاستراتيجية
    top_priorities: List[str]
    quick_wins: List[str]  # إجراءات سريعة التأثير
    long_term_initiatives: List[str]


@dataclass
class DashboardVisualization:
    """تصور لوحة التحكم"""
    viz_type: str  # gauge, radar, timeline, waterfall, heatmap
    title: str
    data: Dict[str, Any]
    insights: List[str]
    recommendations: List[str]


@dataclass
class StrategicDashboard:
    """لوحة التحكم الاستراتيجية الكاملة"""
    project_id: str
    project_title: str
    generated_at: str
    
    # المؤشرات الرئيسية
    ici: InnovationConfidenceIndex
    
    # التصورات
    visualizations: List[DashboardVisualization]
    
    # الرؤى التنفيذية
    executive_summary: str
    strategic_recommendations: List[str]
    
    # خارطة الطريق
    roadmap_timeline: Dict[str, Any]
    
    # السيناريوهات
    investment_scenarios: List[Dict[str, Any]]


class StrategicDashboardGenerator:
    """مولد لوحة التحكم الاستراتيجية"""
    
    def __init__(self):
        pass
    
    def generate_dashboard(
        self,
        project_data: Dict[str, Any],
        ceo_insights: Dict[str, Any],
        roadmap: Dict[str, Any],
        irl: Dict[str, Any],
        scenarios: List[Dict[str, Any]]
    ) -> StrategicDashboard:
        """
        توليد لوحة التحكم الاستراتيجية الكاملة
        
        Args:
            project_data: بيانات المشروع
            ceo_insights: رؤى CEO من Component 1
            roadmap: خارطة الطريق من Component 2
            irl: IRL من Component 3
            scenarios: السيناريوهات الاستثمارية
            
        Returns:
            StrategicDashboard: لوحة التحكم الكاملة
        """
        # حساب ICI
        ici = self._calculate_ici(project_data, ceo_insights, irl)
        
        # توليد التصورات
        visualizations = self._generate_visualizations(
            project_data,
            ceo_insights,
            irl,
            ici
        )
        
        # الملخص التنفيذي
        executive_summary = self._generate_executive_summary(
            project_data,
            ici,
            ceo_insights
        )
        
        # التوصيات الاستراتيجية
        strategic_recommendations = self._generate_strategic_recommendations(
            ici,
            ceo_insights,
            roadmap
        )
        
        # خارطة الطريق الزمنية
        roadmap_timeline = self._generate_roadmap_timeline(roadmap)
        
        return StrategicDashboard(
            project_id=project_data.get("id", "unknown"),
            project_title=project_data.get("title", "مشروع غير معروف"),
            generated_at="2026-01-31",
            ici=ici,
            visualizations=visualizations,
            executive_summary=executive_summary,
            strategic_recommendations=strategic_recommendations,
            roadmap_timeline=roadmap_timeline,
            investment_scenarios=scenarios
        )
    
    def _calculate_ici(
        self,
        project_data: Dict[str, Any],
        ceo_insights: Dict[str, Any],
        irl: Dict[str, Any]
    ) -> InnovationConfidenceIndex:
        """حساب Innovation Confidence Index"""
        
        # استخراج المكونات
        success_prob = project_data.get("success_probability", 50) / 100
        investor_readiness = irl.get("irl_score", 50)
        
        # حساب Market Fit Score
        market_fit = self._calculate_market_fit(project_data, ceo_insights)
        
        # حساب Execution Readiness
        execution_readiness = self._calculate_execution_readiness(project_data)
        
        # حساب Financial Sustainability
        financial_sustainability = self._calculate_financial_sustainability(project_data)
        
        # حساب ICI Score (متوسط مرجح)
        ici_score = (
            success_prob * 100 * 0.30 +
            investor_readiness * 0.25 +
            market_fit * 0.20 +
            execution_readiness * 0.15 +
            financial_sustainability * 0.10
        )
        
        # تحديد مستوى الثقة
        confidence_level = self._determine_confidence_level(ici_score)
        
        # تحديد مستوى الخطر
        risk_level = ceo_insights.get("risk_level", "medium").lower()
        
        # المسار الحرج
        critical_path = self._generate_critical_path(
            ici_score,
            ceo_insights,
            project_data
        )
        
        # الوقت المتوقع للنجاح
        time_to_success = self._estimate_time_to_success(
            ici_score,
            project_data.get("stage", "seed")
        )
        
        # المعالم الرئيسية
        key_milestones = self._generate_key_milestones(
            project_data,
            ici_score
        )
        
        # الأولويات
        top_priorities = self._extract_top_priorities(ceo_insights)
        
        # Quick Wins
        quick_wins = self._identify_quick_wins(ceo_insights, project_data)
        
        # المبادرات طويلة الأمد
        long_term = self._identify_long_term_initiatives(ici_score, project_data)
        
        return InnovationConfidenceIndex(
            ici_score=ici_score,
            confidence_level=confidence_level,
            success_probability=success_prob,
            risk_level=risk_level,
            investor_readiness=investor_readiness,
            market_fit_score=market_fit,
            execution_readiness=execution_readiness,
            financial_sustainability=financial_sustainability,
            critical_path_stages=critical_path,
            estimated_time_to_success=time_to_success,
            key_milestones=key_milestones,
            top_priorities=top_priorities,
            quick_wins=quick_wins,
            long_term_initiatives=long_term
        )
    
    def _calculate_market_fit(
        self,
        project_data: Dict[str, Any],
        ceo_insights: Dict[str, Any]
    ) -> float:
        """حساب Product-Market Fit Score"""
        market_demand = project_data.get("market_demand", 50)
        hypothesis_validation = project_data.get("hypothesis_validation_rate", 0.5) * 100
        user_engagement = project_data.get("user_engagement", 50)
        
        # متوسط مرجح
        market_fit = (
            market_demand * 0.40 +
            hypothesis_validation * 0.35 +
            user_engagement * 0.25
        )
        
        return min(100, market_fit)
    
    def _calculate_execution_readiness(self, project_data: Dict[str, Any]) -> float:
        """حساب جاهزية التنفيذ"""
        team_size = project_data.get("team_size", 0)
        technical_feasibility = project_data.get("technical_feasibility", 50)
        rat_completion = project_data.get("rat_completion_rate", 0.5) * 100
        
        # تطبيع حجم الفريق
        team_score = min(100, (team_size / 10) * 100)
        
        # متوسط مرجح
        execution = (
            team_score * 0.30 +
            technical_feasibility * 0.40 +
            rat_completion * 0.30
        )
        
        return execution
    
    def _calculate_financial_sustainability(self, project_data: Dict[str, Any]) -> float:
        """حساب الاستدامة المالية"""
        budget = project_data.get("budget", 0)
        revenue_growth = project_data.get("revenue_growth", 0)
        roi = project_data.get("roi", 0)
        
        # Runway (بافتراض burn rate = 10% شهرياً)
        monthly_burn = budget * 0.10
        runway_months = budget / monthly_burn if monthly_burn > 0 else 0
        runway_score = min(100, (runway_months / 18) * 100)
        
        # Revenue score
        revenue_score = min(100, revenue_growth * 100)
        
        # ROI score
        roi_score = min(100, roi * 100) if roi > 0 else 0
        
        # متوسط مرجح
        financial = (
            runway_score * 0.50 +
            revenue_score * 0.30 +
            roi_score * 0.20
        )
        
        return financial
    
    def _determine_confidence_level(self, ici_score: float) -> ConfidenceLevel:
        """تحديد مستوى الثقة"""
        if ici_score >= 85:
            return ConfidenceLevel.VERY_HIGH
        elif ici_score >= 70:
            return ConfidenceLevel.HIGH
        elif ici_score >= 50:
            return ConfidenceLevel.MEDIUM
        elif ici_score >= 30:
            return ConfidenceLevel.LOW
        else:
            return ConfidenceLevel.VERY_LOW
    
    def _generate_critical_path(
        self,
        ici_score: float,
        ceo_insights: Dict[str, Any],
        project_data: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """توليد المسار الحرج للنجاح"""
        stages = []
        
        # المرحلة 1: معالجة المخاطر الحرجة
        critical_insights = [
            i for i in ceo_insights.get("insights", [])
            if i.get("severity") in ["critical", "high"]
        ]
        
        if critical_insights:
            stages.append({
                "stage": 1,
                "title": "معالجة المخاطر الحرجة",
                "duration": "1-3 أشهر",
                "status": "urgent",
                "key_actions": [i.get("title", "") for i in critical_insights[:3]]
            })
        
        # المرحلة 2: بناء Product-Market Fit
        if ici_score < 70:
            stages.append({
                "stage": 2,
                "title": "بناء Product-Market Fit",
                "duration": "3-6 أشهر",
                "status": "important",
                "key_actions": [
                    "التحقق من الفرضيات السوقية (100 مقابلة عميل)",
                    "إطلاق MVP وقياس Engagement",
                    "تحقيق Product-Market Fit (NPS > 50)"
                ]
            })
        
        # المرحلة 3: تأمين التمويل
        stages.append({
            "stage": 3,
            "title": "تأمين التمويل",
            "duration": "2-4 أشهر",
            "status": "critical",
            "key_actions": [
                "إعداد Pitch Deck احترافي",
                "استهداف 20 مستثمر محتمل",
                "إغلاق جولة تمويلية"
            ]
        })
        
        # المرحلة 4: التوسع (Scaling)
        stages.append({
            "stage": 4,
            "title": "التوسع والنمو",
            "duration": "6-12 شهر",
            "status": "growth",
            "key_actions": [
                "توسيع الفريق (توظيف 5-10 أشخاص)",
                "زيادة قاعدة المستخدمين 10x",
                "تحقيق الإيرادات المستهدفة"
            ]
        })
        
        return stages
    
    def _estimate_time_to_success(self, ici_score: float, stage: str) -> str:
        """تقدير الوقت المتوقع للنجاح"""
        # Base timeline حسب المرحلة
        base_timeline = {
            "pre_seed": 18,
            "seed": 24,
            "series_a": 36,
            "series_b": 48
        }
        
        base_months = base_timeline.get(stage, 24)
        
        # تعديل بناءً على ICI
        if ici_score >= 70:
            months = base_months * 0.8
        elif ici_score >= 50:
            months = base_months
        else:
            months = base_months * 1.3
        
        # تحويل إلى نص
        if months < 12:
            return f"{int(months)} أشهر"
        else:
            years = months / 12
            return f"{years:.1f} سنة"
    
    def _generate_key_milestones(
        self,
        project_data: Dict[str, Any],
        ici_score: float
    ) -> List[str]:
        """توليد المعالم الرئيسية"""
        milestones = []
        
        stage = project_data.get("stage", "seed")
        
        if stage == "pre_seed":
            milestones = [
                "✅ التحقق من Problem-Solution Fit",
                "🎯 إطلاق MVP الأول",
                "💰 تأمين 500K ريال تمويل أولي",
                "👥 تكوين فريق أساسي (5 أشخاص)",
                "📈 تحقيق 1000 مستخدم نشط"
            ]
        elif stage == "seed":
            milestones = [
                "✅ تحقيق Product-Market Fit",
                "💰 إغلاق جولة Seed (2-5M ريال)",
                "👥 توسيع الفريق إلى 15 شخص",
                "📈 تحقيق 10K مستخدم نشط",
                "💵 توليد إيرادات شهرية (50K+ ريال)"
            ]
        elif stage == "series_a":
            milestones = [
                "💰 إغلاق جولة Series A (10-20M ريال)",
                "📈 تحقيق 100K مستخدم نشط",
                "💵 إيرادات شهرية 500K+ ريال",
                "🌍 التوسع الجغرافي (3 مدن)",
                "👥 فريق 50+ شخص"
            ]
        
        return milestones
    
    def _extract_top_priorities(self, ceo_insights: Dict[str, Any]) -> List[str]:
        """استخراج الأولويات من CEO Insights"""
        insights = ceo_insights.get("insights", [])
        
        # أخذ أعلى 3 رؤى حرجة
        critical = [
            i.get("title", "")
            for i in insights
            if i.get("severity") in ["critical", "high"]
        ][:3]
        
        return critical if critical else ["تحسين Product-Market Fit", "تأمين التمويل", "بناء الفريق"]
    
    def _identify_quick_wins(
        self,
        ceo_insights: Dict[str, Any],
        project_data: Dict[str, Any]
    ) -> List[str]:
        """تحديد الإجراءات سريعة التأثير"""
        quick_wins = []
        
        # بناءً على الرؤى
        insights = ceo_insights.get("insights", [])
        
        for insight in insights:
            title = insight.get("title", "")
            if "تسويق" in title or "marketing" in title.lower():
                quick_wins.append("إطلاق حملة تسويقية مركزة (Google Ads + Social Media)")
            elif "فريق" in title or "team" in title.lower():
                quick_wins.append("توظيف مطور Full-stack واحد فوراً")
            elif "تحقق" in title or "validation" in title.lower():
                quick_wins.append("إجراء 20 مقابلة عميل هذا الأسبوع")
        
        # إضافة quick wins عامة
        if not quick_wins:
            quick_wins = [
                "إطلاق Landing Page احترافية",
                "بناء قائمة بريدية (Email List)",
                "إنشاء حسابات Social Media نشطة"
            ]
        
        return quick_wins[:3]
    
    def _identify_long_term_initiatives(
        self,
        ici_score: float,
        project_data: Dict[str, Any]
    ) -> List[str]:
        """تحديد المبادرات طويلة الأمد"""
        initiatives = []
        
        if ici_score < 60:
            initiatives.append("بناء ثقافة شركة قوية (Company Culture)")
        
        initiatives.extend([
            "تطوير استراتيجية توسع إقليمية (GCC)",
            "بناء شراكات استراتيجية مع شركات كبرى",
            "الاستثمار في R&D لميزات مبتكرة",
            "تطوير برنامج ولاء العملاء (Customer Retention)"
        ])
        
        return initiatives[:4]
    
    def _generate_visualizations(
        self,
        project_data: Dict[str, Any],
        ceo_insights: Dict[str, Any],
        irl: Dict[str, Any],
        ici: InnovationConfidenceIndex
    ) -> List[DashboardVisualization]:
        """توليد التصورات"""
        visualizations = []
        
        # 1. ICI Gauge
        visualizations.append(DashboardVisualization(
            viz_type="gauge",
            title="مؤشر الثقة في الابتكار (ICI)",
            data={
                "value": ici.ici_score,
                "max": 100,
                "ranges": [
                    {"min": 0, "max": 30, "color": "red", "label": "منخفض جداً"},
                    {"min": 30, "max": 50, "color": "orange", "label": "منخفض"},
                    {"min": 50, "max": 70, "color": "yellow", "label": "متوسط"},
                    {"min": 70, "max": 85, "color": "lightgreen", "label": "عالي"},
                    {"min": 85, "max": 100, "color": "green", "label": "عالي جداً"}
                ]
            },
            insights=[
                f"النقاط: {ici.ici_score:.1f}/100",
                f"المستوى: {self._translate_confidence_level(ici.confidence_level)}",
                f"احتمالية النجاح: {ici.success_probability*100:.0f}%"
            ],
            recommendations=[
                "التركيز على معالجة المخاطر الحرجة",
                "تحسين جاهزية المستثمر (IRL)"
            ]
        ))
        
        # 2. Radar Chart - الأبعاد الخمسة
        visualizations.append(DashboardVisualization(
            viz_type="radar",
            title="الأبعاد الخمسة للابتكار",
            data={
                "dimensions": [
                    {"name": "احتمالية النجاح", "value": ici.success_probability * 100},
                    {"name": "جاهزية المستثمر", "value": ici.investor_readiness},
                    {"name": "ملاءمة السوق", "value": ici.market_fit_score},
                    {"name": "جاهزية التنفيذ", "value": ici.execution_readiness},
                    {"name": "الاستدامة المالية", "value": ici.financial_sustainability}
                ]
            },
            insights=[
                f"أقوى بُعد: {self._find_strongest_dimension(ici)}",
                f"أضعف بُعد: {self._find_weakest_dimension(ici)}"
            ],
            recommendations=[
                "تحسين الأبعاد الضعيفة أولاً",
                "الحفاظ على الأبعاد القوية"
            ]
        ))
        
        # 3. Critical Path Timeline
        visualizations.append(DashboardVisualization(
            viz_type="timeline",
            title="المسار الحرج للنجاح",
            data={
                "stages": ici.critical_path_stages,
                "total_duration": ici.estimated_time_to_success
            },
            insights=[
                f"الوقت المتوقع: {ici.estimated_time_to_success}",
                f"عدد المراحل: {len(ici.critical_path_stages)}"
            ],
            recommendations=[
                "البدء بالمرحلة الأولى فوراً",
                "تتبع التقدم أسبوعياً"
            ]
        ))
        
        # 4. Investment Readiness Breakdown
        visualizations.append(DashboardVisualization(
            viz_type="waterfall",
            title="تفصيل جاهزية المستثمر (IRL)",
            data={
                "breakdown": irl.get("readiness_breakdown", {}),
                "total": irl.get("irl_score", 0)
            },
            insights=[
                f"IRL Score: {irl.get('irl_score', 0):.1f}/100",
                f"الدرجة: {irl.get('irl_grade', 'N/A')}"
            ],
            recommendations=irl.get("key_weaknesses", [])[:2]
        ))
        
        # 5. Risk Heatmap
        visualizations.append(DashboardVisualization(
            viz_type="heatmap",
            title="خريطة المخاطر",
            data={
                "risks": self._generate_risk_heatmap(ceo_insights)
            },
            insights=[
                f"مخاطر حرجة: {len([r for r in ceo_insights.get('insights', []) if r.get('severity') == 'critical'])}",
                f"مخاطر عالية: {len([r for r in ceo_insights.get('insights', []) if r.get('severity') == 'high'])}"
            ],
            recommendations=[
                "معالجة المخاطر الحمراء فوراً",
                "وضع خطة تخفيف للمخاطر البرتقالية"
            ]
        ))
        
        return visualizations
    
    def _translate_confidence_level(self, level: ConfidenceLevel) -> str:
        """ترجمة مستوى الثقة"""
        translations = {
            ConfidenceLevel.VERY_HIGH: "عالي جداً",
            ConfidenceLevel.HIGH: "عالي",
            ConfidenceLevel.MEDIUM: "متوسط",
            ConfidenceLevel.LOW: "منخفض",
            ConfidenceLevel.VERY_LOW: "منخفض جداً"
        }
        return translations.get(level, "غير معروف")
    
    def _find_strongest_dimension(self, ici: InnovationConfidenceIndex) -> str:
        """إيجاد أقوى بُعد"""
        dimensions = {
            "احتمالية النجاح": ici.success_probability * 100,
            "جاهزية المستثمر": ici.investor_readiness,
            "ملاءمة السوق": ici.market_fit_score,
            "جاهزية التنفيذ": ici.execution_readiness,
            "الاستدامة المالية": ici.financial_sustainability
        }
        return max(dimensions, key=dimensions.get)
    
    def _find_weakest_dimension(self, ici: InnovationConfidenceIndex) -> str:
        """إيجاد أضعف بُعد"""
        dimensions = {
            "احتمالية النجاح": ici.success_probability * 100,
            "جاهزية المستثمر": ici.investor_readiness,
            "ملاءمة السوق": ici.market_fit_score,
            "جاهزية التنفيذ": ici.execution_readiness,
            "الاستدامة المالية": ici.financial_sustainability
        }
        return min(dimensions, key=dimensions.get)
    
    def _generate_risk_heatmap(self, ceo_insights: Dict[str, Any]) -> List[Dict[str, Any]]:
        """توليد خريطة المخاطر"""
        insights = ceo_insights.get("insights", [])
        
        risks = []
        for insight in insights:
            severity = insight.get("severity", "medium")
            
            # تحديد اللون
            color_map = {
                "critical": "red",
                "high": "orange",
                "medium": "yellow",
                "low": "green"
            }
            
            risks.append({
                "title": insight.get("title", ""),
                "severity": severity,
                "color": color_map.get(severity, "gray"),
                "impact": insight.get("impact", "")
            })
        
        return risks
    
    def _generate_executive_summary(
        self,
        project_data: Dict[str, Any],
        ici: InnovationConfidenceIndex,
        ceo_insights: Dict[str, Any]
    ) -> str:
        """توليد الملخص التنفيذي"""
        title = project_data.get("title", "المشروع")
        ici_score = ici.ici_score
        confidence = self._translate_confidence_level(ici.confidence_level)
        success_prob = ici.success_probability * 100
        
        # تحديد النبرة
        if ici_score >= 70:
            tone = "يُظهر المشروع إمكانات قوية"
        elif ici_score >= 50:
            tone = "يُظهر المشروع إمكانات واعدة لكن يحتاج إلى تحسينات"
        else:
            tone = "يواجه المشروع تحديات كبيرة تتطلب تدخلاً فورياً"
        
        summary = f"""
**{title}**

{tone}. مؤشر الثقة في الابتكار (ICI) يبلغ {ici_score:.1f}/100 ({confidence})، مع احتمالية نجاح {success_prob:.0f}%.

**الوضع الحالي:**
- جاهزية المستثمر: {ici.investor_readiness:.1f}/100
- ملاءمة السوق: {ici.market_fit_score:.1f}/100
- جاهزية التنفيذ: {ici.execution_readiness:.1f}/100
- الاستدامة المالية: {ici.financial_sustainability:.1f}/100

**الأولويات الحرجة:**
{chr(10).join([f"• {p}" for p in ici.top_priorities[:3]])}

**الوقت المتوقع للنجاح:** {ici.estimated_time_to_success}
"""
        return summary.strip()
    
    def _generate_strategic_recommendations(
        self,
        ici: InnovationConfidenceIndex,
        ceo_insights: Dict[str, Any],
        roadmap: Dict[str, Any]
    ) -> List[str]:
        """توليد التوصيات الاستراتيجية"""
        recommendations = []
        
        # بناءً على ICI Score
        if ici.ici_score < 50:
            recommendations.append("🚨 **إعادة تقييم شاملة:** المشروع يحتاج إلى pivot أو إعادة هيكلة جذرية")
        
        # بناءً على الأبعاد الضعيفة
        if ici.market_fit_score < 60:
            recommendations.append("🎯 **التركيز على Product-Market Fit:** إجراء 50+ مقابلة عميل خلال 30 يوم")
        
        if ici.investor_readiness < 60:
            recommendations.append("💰 **تحسين جاهزية المستثمر:** إعداد Pitch Deck احترافي والتقديم على 3 برامج تسريع")
        
        if ici.financial_sustainability < 50:
            recommendations.append("💵 **معالجة الوضع المالي:** تخفيض Burn Rate بنسبة 30% وتأمين تمويل bridge")
        
        if ici.execution_readiness < 60:
            recommendations.append("👥 **تقوية الفريق:** توظيف 2-3 أشخاص في الأدوار الحرجة فوراً")
        
        # Quick Wins
        recommendations.append(f"⚡ **Quick Wins:** {', '.join(ici.quick_wins[:2])}")
        
        return recommendations[:5]
    
    def _generate_roadmap_timeline(self, roadmap: Dict[str, Any]) -> Dict[str, Any]:
        """توليد الجدول الزمني لخارطة الطريق"""
        tactical_moves = roadmap.get("tactical_moves", [])
        
        timeline = {
            "total_duration": roadmap.get("estimated_timeline", "غير محدد"),
            "phases": []
        }
        
        for move in tactical_moves:
            timeline["phases"].append({
                "step": move.get("step"),
                "title": move.get("title"),
                "timeline": move.get("timeline"),
                "deliverables": move.get("deliverables", []),
                "cost": move.get("cost_estimate", "غير محدد")
            })
        
        return timeline
    
    def to_dict(self, dashboard: StrategicDashboard) -> Dict[str, Any]:
        """تحويل Dashboard إلى قاموس"""
        return {
            "project_id": dashboard.project_id,
            "project_title": dashboard.project_title,
            "generated_at": dashboard.generated_at,
            "ici": {
                "ici_score": dashboard.ici.ici_score,
                "confidence_level": dashboard.ici.confidence_level.value,
                "success_probability": dashboard.ici.success_probability,
                "risk_level": dashboard.ici.risk_level,
                "investor_readiness": dashboard.ici.investor_readiness,
                "market_fit_score": dashboard.ici.market_fit_score,
                "execution_readiness": dashboard.ici.execution_readiness,
                "financial_sustainability": dashboard.ici.financial_sustainability,
                "critical_path_stages": dashboard.ici.critical_path_stages,
                "estimated_time_to_success": dashboard.ici.estimated_time_to_success,
                "key_milestones": dashboard.ici.key_milestones,
                "top_priorities": dashboard.ici.top_priorities,
                "quick_wins": dashboard.ici.quick_wins,
                "long_term_initiatives": dashboard.ici.long_term_initiatives
            },
            "visualizations": [
                {
                    "viz_type": v.viz_type,
                    "title": v.title,
                    "data": v.data,
                    "insights": v.insights,
                    "recommendations": v.recommendations
                }
                for v in dashboard.visualizations
            ],
            "executive_summary": dashboard.executive_summary,
            "strategic_recommendations": dashboard.strategic_recommendations,
            "roadmap_timeline": dashboard.roadmap_timeline,
            "investment_scenarios": dashboard.investment_scenarios
        }


# مثال على الاستخدام
if __name__ == "__main__":
    # بيانات تجريبية
    project_data = {
        "id": "test_001",
        "title": "منصة تقنية مالية مبتكرة",
        "stage": "seed",
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
    
    ceo_insights = {
        "insights": [
            {"title": "فجوة تمويلية حرجة", "severity": "critical", "impact": "high"},
            {"title": "ضعف في التحقق من الفرضيات", "severity": "high", "impact": "medium"}
        ],
        "risk_level": "high"
    }
    
    roadmap = {
        "estimated_timeline": "3 أشهر",
        "tactical_moves": [
            {
                "step": 1,
                "title": "تحسين Financial Model",
                "timeline": "2-3 أسابيع",
                "deliverables": ["Financial Model", "Pitch Deck"],
                "cost_estimate": "15,000 - 25,000 ريال"
            }
        ]
    }
    
    irl = {
        "irl_score": 57.9,
        "irl_grade": "C",
        "readiness_breakdown": {
            "traction": 24,
            "team_quality": 50,
            "market_size": 100,
            "technical_feasibility": 75,
            "financial_health": 44
        },
        "key_weaknesses": ["الصحة المالية منخفضة", "الجذب السوقي ضعيف"]
    }
    
    scenarios = [
        {
            "scenario_name": "تمويل من مستثمرين ملائكة",
            "probability": 0.3,
            "funding_amount": 300000
        }
    ]
    
    # إنشاء المولد
    generator = StrategicDashboardGenerator()
    
    # توليد Dashboard
    dashboard = generator.generate_dashboard(
        project_data=project_data,
        ceo_insights=ceo_insights,
        roadmap=roadmap,
        irl=irl,
        scenarios=scenarios
    )
    
    # طباعة النتائج
    print("=" * 70)
    print("Strategic Dashboard - Test Output")
    print("=" * 70)
    print(json.dumps(generator.to_dict(dashboard), ensure_ascii=False, indent=2))
