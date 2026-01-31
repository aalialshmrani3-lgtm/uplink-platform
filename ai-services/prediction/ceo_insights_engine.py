"""
UPLINK 5.0 - CEO Insights Engine
Strategic Bridge Protocol - Component 1

تحويل قيم SHAP التقنية إلى نصائح تنفيذية بلغة رجال الأعمال والمستثمرين.

Author: Manus AI
Date: 31 يناير 2026
Version: 1.0
"""

import json
import os
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
import numpy as np


@dataclass
class CriticalInsight:
    """نموذج بيانات للرؤية الحرجة"""
    category: str
    severity: str
    title: str
    description: str
    business_impact: str
    shap_contribution: float
    feature_name: str
    feature_value: float


@dataclass
class CEOInsightsOutput:
    """نموذج بيانات لمخرجات CEO Insights"""
    executive_summary: str
    critical_insights: List[CriticalInsight]
    risk_level: str
    success_probability: float
    investor_appeal: str


class TranslationDictionary:
    """قاموس ترجمة قيم SHAP إلى لغة الأعمال"""
    
    # معايير مرجعية للقطاعات
    SECTOR_BUDGET_BENCHMARKS = {
        "fintech": {
            "minimum": 300000,
            "average": 800000,
            "optimal": 1500000,
            "avg_team_size": 6,
            "avg_timeline_months": 12
        },
        "digital_health": {
            "minimum": 400000,
            "average": 1000000,
            "optimal": 2000000,
            "avg_team_size": 8,
            "avg_timeline_months": 14
        },
        "smart_agriculture": {
            "minimum": 500000,
            "average": 1200000,
            "optimal": 2500000,
            "avg_team_size": 10,
            "avg_timeline_months": 18
        },
        "renewable_energy": {
            "minimum": 800000,
            "average": 2000000,
            "optimal": 5000000,
            "avg_team_size": 12,
            "avg_timeline_months": 24
        },
        "ecommerce": {
            "minimum": 200000,
            "average": 500000,
            "optimal": 1000000,
            "avg_team_size": 5,
            "avg_timeline_months": 8
        },
        "edtech": {
            "minimum": 250000,
            "average": 600000,
            "optimal": 1200000,
            "avg_team_size": 6,
            "avg_timeline_months": 10
        },
        "proptech": {
            "minimum": 400000,
            "average": 900000,
            "optimal": 1800000,
            "avg_team_size": 7,
            "avg_timeline_months": 12
        },
        "logistics": {
            "minimum": 350000,
            "average": 800000,
            "optimal": 1500000,
            "avg_team_size": 8,
            "avg_timeline_months": 14
        },
        "food_delivery": {
            "minimum": 300000,
            "average": 700000,
            "optimal": 1400000,
            "avg_team_size": 6,
            "avg_timeline_months": 10
        },
        "tourism": {
            "minimum": 250000,
            "average": 600000,
            "optimal": 1200000,
            "avg_team_size": 5,
            "avg_timeline_months": 12
        }
    }
    
    # قوالب الترجمة
    SHAP_TO_CEO_MAPPING = {
        "budget": {
            "negative_high": {
                "title": "فجوة تمويلية حرجة تهدد مرحلة التوسع",
                "template": "الميزانية الحالية ({value:,.0f} ريال) أقل بنسبة {gap_percentage:.0f}% من المتوسط المطلوب لمشاريع {sector} الناجحة في السوق السعودي. هذه الفجوة ستؤدي إلى نفاد رأس المال خلال {months} أشهر من الإطلاق.",
                "category": "financial_risk",
                "severity": "high"
            },
            "negative_medium": {
                "title": "ميزانية محدودة تتطلب إدارة دقيقة",
                "template": "الميزانية الحالية ({value:,.0f} ريال) كافية للإطلاق الأولي لكنها تتطلب إدارة صارمة للتدفقات النقدية وتأمين جولة تمويلية خلال {months} أشهر.",
                "category": "financial_planning",
                "severity": "medium"
            },
            "negative_low": {
                "title": "ميزانية مقبولة مع فرص للتحسين",
                "template": "الميزانية الحالية ({value:,.0f} ريال) قريبة من المتوسط لقطاع {sector}. يُنصح بتأمين تمويل إضافي لتسريع النمو.",
                "category": "financial_optimization",
                "severity": "low"
            }
        },
        "hypothesis_validation_rate": {
            "negative_high": {
                "title": "غياب التحقق من صحة الفرضيات السوقية",
                "template": "معدل التحقق من الفرضيات ({value:.0%}) يشير إلى عدم اختبار السوق بشكل كافٍ. المشروع يعتمد على افتراضات غير مُثبتة حول احتياجات العملاء.",
                "category": "market_validation",
                "severity": "critical"
            },
            "negative_medium": {
                "title": "تحقق جزئي من الفرضيات يتطلب المزيد",
                "template": "معدل التحقق من الفرضيات ({value:.0%}) يشير إلى بداية جيدة لكن يجب إجراء المزيد من الاختبارات السوقية قبل الإطلاق الكامل.",
                "category": "market_validation",
                "severity": "medium"
            },
            "negative_low": {
                "title": "تحقق جيد من الفرضيات مع فرص للتحسين",
                "template": "معدل التحقق من الفرضيات ({value:.0%}) جيد. يُنصح بإجراء اختبارات إضافية لتعزيز الثقة.",
                "category": "market_validation",
                "severity": "low"
            }
        },
        "rat_completion_rate": {
            "negative_high": {
                "title": "ضعف في منهجية RAT يهدد التخطيط المالي",
                "template": "معدل إكمال RAT ({value:.0%}) يشير إلى تخطيط مالي ضعيف وعدم تحديد الافتراضات الأكثر خطورة. هذا يزيد من احتمالية الإنفاق غير المدروس.",
                "category": "execution_risk",
                "severity": "high"
            },
            "negative_medium": {
                "title": "تخطيط RAT جزئي يحتاج تحسين",
                "template": "معدل إكمال RAT ({value:.0%}) يشير إلى بداية جيدة لكن يجب إكمال تحليل جميع الافتراضات الحرجة.",
                "category": "execution_risk",
                "severity": "medium"
            },
            "negative_low": {
                "title": "تخطيط RAT جيد مع فرص للتحسين",
                "template": "معدل إكمال RAT ({value:.0%}) جيد. يُنصح بمراجعة دورية للافتراضات.",
                "category": "execution_planning",
                "severity": "low"
            }
        },
        "market_demand": {
            "negative_high": {
                "title": "طلب سوقي ضعيف يهدد النمو المستدام",
                "template": "مؤشر الطلب السوقي ({value}/100) يشير إلى سوق مشبع أو ضعف في تحديد الجمهور المستهدف. هذا يزيد من تكاليف اكتساب العملاء (CAC) بنسبة تصل إلى 300%.",
                "category": "market_risk",
                "severity": "high"
            },
            "negative_medium": {
                "title": "طلب سوقي متوسط يتطلب استراتيجية تسويق قوية",
                "template": "مؤشر الطلب السوقي ({value}/100) متوسط. يجب تطوير استراتيجية تسويق مبتكرة لزيادة الوعي بالمنتج.",
                "category": "market_strategy",
                "severity": "medium"
            },
            "negative_low": {
                "title": "طلب سوقي جيد مع فرص للنمو",
                "template": "مؤشر الطلب السوقي ({value}/100) جيد. يُنصح بالتركيز على التوسع الجغرافي.",
                "category": "market_opportunity",
                "severity": "low"
            }
        },
        "team_size": {
            "negative_medium": {
                "title": "فريق صغير يحد من سرعة التنفيذ",
                "template": "حجم الفريق الحالي ({value} أعضاء) محدود مقارنة بمتطلبات قطاع {sector}. هذا قد يؤدي إلى تأخيرات في الإطلاق وضعف في التغطية الوظيفية.",
                "category": "team_capacity",
                "severity": "medium"
            },
            "negative_low": {
                "title": "حجم فريق مقبول مع فرص للتوسع",
                "template": "حجم الفريق الحالي ({value} أعضاء) مقبول. يُنصح بالتوظيف التدريجي حسب النمو.",
                "category": "team_planning",
                "severity": "low"
            }
        },
        "competitive_advantage": {
            "negative_high": {
                "title": "غياب ميزة تنافسية واضحة",
                "template": "مؤشر الميزة التنافسية ({value}/100) منخفض جداً. المشروع لا يقدم تمايزاً واضحاً عن المنافسين الحاليين.",
                "category": "competitive_risk",
                "severity": "high"
            },
            "negative_medium": {
                "title": "ميزة تنافسية ضعيفة تحتاج تعزيز",
                "template": "مؤشر الميزة التنافسية ({value}/100) متوسط. يجب تطوير عناصر تمايز أقوى.",
                "category": "competitive_strategy",
                "severity": "medium"
            }
        },
        "technical_feasibility": {
            "negative_high": {
                "title": "تحديات تقنية حرجة تهدد التنفيذ",
                "template": "مؤشر الجدوى التقنية ({value}/100) منخفض. المشروع يواجه تحديات تقنية كبيرة قد تؤخر الإطلاق.",
                "category": "technical_risk",
                "severity": "high"
            },
            "negative_medium": {
                "title": "تحديات تقنية متوسطة قابلة للحل",
                "template": "مؤشر الجدوى التقنية ({value}/100) متوسط. يُنصح بالاستعانة بخبراء تقنيين.",
                "category": "technical_planning",
                "severity": "medium"
            }
        }
    }


class SHAPClassifier:
    """تصنيف تأثير SHAP إلى فئات"""
    
    @staticmethod
    def classify_shap_impact(shap_value: float, feature_name: str) -> str:
        """
        تصنيف تأثير SHAP إلى فئات (negative_high, negative_medium, negative_low, etc.)
        
        Args:
            shap_value: قيمة SHAP
            feature_name: اسم الميزة
            
        Returns:
            str: فئة التأثير
        """
        abs_value = abs(shap_value)
        
        # Critical features (hypothesis_validation, RAT)
        if feature_name in ["hypothesis_validation_rate", "rat_completion_rate"]:
            if abs_value > 0.35:
                return "negative_high" if shap_value < 0 else "positive_high"
            elif abs_value > 0.20:
                return "negative_medium" if shap_value < 0 else "positive_medium"
            elif abs_value > 0.10:
                return "negative_low" if shap_value < 0 else "positive_low"
        
        # Financial features (budget)
        elif feature_name == "budget":
            if abs_value > 0.30:
                return "negative_high" if shap_value < 0 else "positive_high"
            elif abs_value > 0.15:
                return "negative_medium" if shap_value < 0 else "positive_medium"
            elif abs_value > 0.08:
                return "negative_low" if shap_value < 0 else "positive_low"
        
        # Market features (market_demand, competitive_advantage)
        elif feature_name in ["market_demand", "competitive_advantage"]:
            if abs_value > 0.25:
                return "negative_high" if shap_value < 0 else "positive_high"
            elif abs_value > 0.15:
                return "negative_medium" if shap_value < 0 else "positive_medium"
            elif abs_value > 0.08:
                return "negative_low" if shap_value < 0 else "positive_low"
        
        # Team features
        elif feature_name == "team_size":
            if abs_value > 0.20:
                return "negative_medium" if shap_value < 0 else "positive_medium"
            elif abs_value > 0.10:
                return "negative_low" if shap_value < 0 else "positive_low"
        
        # Technical features
        elif feature_name == "technical_feasibility":
            if abs_value > 0.25:
                return "negative_high" if shap_value < 0 else "positive_high"
            elif abs_value > 0.15:
                return "negative_medium" if shap_value < 0 else "positive_medium"
        
        return "neutral"


class BusinessImpactCalculator:
    """حساب التأثير التجاري الفعلي"""
    
    @staticmethod
    def calculate_business_impact(
        shap_value: float,
        feature_name: str,
        feature_value: float,
        sector: str
    ) -> Dict[str, Any]:
        """
        حساب التأثير التجاري بناءً على قيم SHAP والميزات
        
        Args:
            shap_value: قيمة SHAP
            feature_name: اسم الميزة
            feature_value: قيمة الميزة
            sector: القطاع
            
        Returns:
            dict: التأثير التجاري
        """
        impact = {}
        
        if feature_name == "budget":
            # حساب الفجوة التمويلية
            benchmarks = TranslationDictionary.SECTOR_BUDGET_BENCHMARKS.get(
                sector,
                TranslationDictionary.SECTOR_BUDGET_BENCHMARKS["fintech"]
            )
            sector_avg = benchmarks["average"]
            gap_percentage = ((sector_avg - feature_value) / sector_avg) * 100
            
            # تقدير runway (بافتراض burn rate = 10% من الميزانية شهرياً)
            monthly_burn = feature_value * 0.10
            months_to_burnout = int(feature_value / monthly_burn) if monthly_burn > 0 else 12
            
            impact = {
                "gap_percentage": max(0, gap_percentage),
                "months": months_to_burnout,
                "failure_probability": min(95, 50 + abs(shap_value) * 100),
                "liquidity_risk": "مرتفع جداً" if gap_percentage > 50 else "متوسط" if gap_percentage > 20 else "منخفض"
            }
        
        elif feature_name == "hypothesis_validation_rate":
            # حساب خطر بناء منتج خاطئ
            impact = {
                "product_market_fit_risk": min(95, 40 + (1 - feature_value) * 100),
                "pivot_probability": min(90, 30 + (1 - feature_value) * 80)
            }
        
        elif feature_name == "rat_completion_rate":
            # حساب خطر التنفيذ
            impact = {
                "budget_overrun_risk": min(90, 30 + (1 - feature_value) * 100),
                "execution_failure_probability": min(85, 25 + (1 - feature_value) * 90)
            }
        
        elif feature_name == "market_demand":
            # حساب خطر السوق
            impact = {
                "cac_increase_percentage": max(0, (100 - feature_value) * 3),
                "market_saturation_risk": "مرتفع" if feature_value < 30 else "متوسط" if feature_value < 60 else "منخفض"
            }
        
        elif feature_name == "team_size":
            # حساب خطر الفريق
            benchmarks = TranslationDictionary.SECTOR_BUDGET_BENCHMARKS.get(
                sector,
                TranslationDictionary.SECTOR_BUDGET_BENCHMARKS["fintech"]
            )
            optimal_team = benchmarks["avg_team_size"]
            team_gap = optimal_team - feature_value
            
            impact = {
                "team_gap": max(0, team_gap),
                "delay_risk": "مرتفع" if team_gap > 3 else "متوسط" if team_gap > 1 else "منخفض"
            }
        
        return impact


class CEOInsightsEngine:
    """المحرك الرئيسي لتحويل SHAP إلى CEO Insights"""
    
    def __init__(self):
        self.translator = TranslationDictionary()
        self.classifier = SHAPClassifier()
        self.impact_calculator = BusinessImpactCalculator()
    
    def generate_ceo_insights(
        self,
        shap_values: Dict[str, float],
        feature_values: Dict[str, float],
        sector: str,
        organization: str,
        success_probability: float
    ) -> CEOInsightsOutput:
        """
        توليد CEO Insights من قيم SHAP
        
        Args:
            shap_values: قيم SHAP لكل ميزة
            feature_values: قيم الميزات الفعلية
            sector: القطاع
            organization: نوع المنظمة
            success_probability: احتمالية النجاح من النموذج
            
        Returns:
            CEOInsightsOutput: الرؤى التنفيذية
        """
        critical_insights = []
        
        # معالجة كل ميزة سلبية
        for feature_name, shap_value in shap_values.items():
            if shap_value < -0.05:  # فقط القيم السلبية المؤثرة
                # تصنيف التأثير
                impact_class = self.classifier.classify_shap_impact(shap_value, feature_name)
                
                if impact_class == "neutral":
                    continue
                
                # الحصول على القالب المناسب
                feature_mapping = self.translator.SHAP_TO_CEO_MAPPING.get(feature_name)
                if not feature_mapping:
                    continue
                
                template_data = feature_mapping.get(impact_class)
                if not template_data:
                    continue
                
                # حساب التأثير التجاري
                business_impact = self.impact_calculator.calculate_business_impact(
                    shap_value,
                    feature_name,
                    feature_values.get(feature_name, 0),
                    sector
                )
                
                # توليد الوصف
                description = template_data["template"].format(
                    value=feature_values.get(feature_name, 0),
                    sector=self._translate_sector(sector),
                    **business_impact
                )
                
                # توليد business_impact text
                impact_text = self._format_business_impact(feature_name, business_impact, shap_value)
                
                # إنشاء Insight
                insight = CriticalInsight(
                    category=template_data["category"],
                    severity=template_data["severity"],
                    title=template_data["title"],
                    description=description,
                    business_impact=impact_text,
                    shap_contribution=shap_value,
                    feature_name=feature_name,
                    feature_value=feature_values.get(feature_name, 0)
                )
                
                critical_insights.append(insight)
        
        # ترتيب حسب الخطورة
        severity_order = {"critical": 0, "high": 1, "medium": 2, "low": 3}
        critical_insights.sort(key=lambda x: (severity_order.get(x.severity, 4), abs(x.shap_contribution)), reverse=True)
        
        # توليد الملخص التنفيذي
        executive_summary = self._generate_executive_summary(critical_insights, success_probability)
        
        # تحديد مستوى الخطر
        risk_level = self._determine_risk_level(critical_insights, success_probability)
        
        # تحديد جاذبية المستثمر
        investor_appeal = self._determine_investor_appeal(success_probability, risk_level)
        
        return CEOInsightsOutput(
            executive_summary=executive_summary,
            critical_insights=critical_insights[:5],  # أهم 5 رؤى فقط
            risk_level=risk_level,
            success_probability=success_probability,
            investor_appeal=investor_appeal
        )
    
    def _translate_sector(self, sector: str) -> str:
        """ترجمة اسم القطاع إلى العربية"""
        translations = {
            "fintech": "التقنية المالية",
            "digital_health": "الصحة الرقمية",
            "smart_agriculture": "الزراعة الذكية",
            "renewable_energy": "الطاقة المتجددة",
            "ecommerce": "التجارة الإلكترونية",
            "edtech": "التقنية التعليمية",
            "proptech": "تقنية العقارات",
            "logistics": "اللوجستيات",
            "food_delivery": "توصيل الطعام",
            "tourism": "السياحة"
        }
        return translations.get(sector, sector)
    
    def _format_business_impact(self, feature_name: str, impact: Dict, shap_value: float) -> str:
        """تنسيق التأثير التجاري كنص"""
        if feature_name == "budget":
            return f"احتمالية الفشل: {impact.get('failure_probability', 0):.0f}% | خطر نفاد السيولة: {impact.get('liquidity_risk', 'غير محدد')}"
        elif feature_name == "hypothesis_validation_rate":
            return f"احتمالية بناء منتج لا يحتاجه السوق: {impact.get('product_market_fit_risk', 0):.0f}%"
        elif feature_name == "rat_completion_rate":
            return f"خطر تجاوز الميزانية: {impact.get('budget_overrun_risk', 0):.0f}% | احتمالية فشل التنفيذ: {impact.get('execution_failure_probability', 0):.0f}%"
        elif feature_name == "market_demand":
            return f"زيادة متوقعة في CAC: {impact.get('cac_increase_percentage', 0):.0f}% | خطر تشبع السوق: {impact.get('market_saturation_risk', 'غير محدد')}"
        elif feature_name == "team_size":
            return f"نقص في الفريق: {impact.get('team_gap', 0):.0f} أعضاء | خطر التأخير: {impact.get('delay_risk', 'غير محدد')}"
        else:
            return f"تأثير SHAP: {shap_value:.2f}"
    
    def _generate_executive_summary(self, insights: List[CriticalInsight], success_prob: float) -> str:
        """توليد الملخص التنفيذي"""
        critical_count = sum(1 for i in insights if i.severity in ["critical", "high"])
        
        if success_prob < 30:
            return f"يواجه المشروع تحديات حرجة في {critical_count} مجالات رئيسية تهدد استمراريته بشكل كبير. احتمالية النجاح الحالية ({success_prob:.0f}%) منخفضة جداً وتتطلب تدخلاً فورياً."
        elif success_prob < 50:
            return f"يواجه المشروع تحديات متوسطة إلى عالية في {critical_count} مجالات رئيسية. احتمالية النجاح ({success_prob:.0f}%) تتطلب تحسينات جوهرية قبل الإطلاق."
        elif success_prob < 70:
            return f"المشروع على المسار الصحيح مع وجود {critical_count} تحديات تتطلب الانتباه. احتمالية النجاح ({success_prob:.0f}%) مقبولة لكن يمكن تحسينها."
        else:
            return f"المشروع في وضع جيد مع {critical_count} نقاط تحسين محتملة. احتمالية النجاح ({success_prob:.0f}%) عالية."
    
    def _determine_risk_level(self, insights: List[CriticalInsight], success_prob: float) -> str:
        """تحديد مستوى الخطر الإجمالي"""
        critical_count = sum(1 for i in insights if i.severity == "critical")
        high_count = sum(1 for i in insights if i.severity == "high")
        
        if critical_count >= 2 or success_prob < 30:
            return "critical"
        elif critical_count >= 1 or high_count >= 2 or success_prob < 50:
            return "high"
        elif high_count >= 1 or success_prob < 70:
            return "medium"
        else:
            return "low"
    
    def _determine_investor_appeal(self, success_prob: float, risk_level: str) -> str:
        """تحديد جاذبية المستثمر"""
        if risk_level == "critical" or success_prob < 30:
            return "very_low"
        elif risk_level == "high" or success_prob < 50:
            return "low"
        elif risk_level == "medium" or success_prob < 70:
            return "medium"
        elif success_prob < 85:
            return "high"
        else:
            return "very_high"
    
    def to_dict(self, output: CEOInsightsOutput) -> Dict[str, Any]:
        """تحويل المخرجات إلى قاموس"""
        return {
            "executive_summary": output.executive_summary,
            "critical_insights": [
                {
                    "category": i.category,
                    "severity": i.severity,
                    "title": i.title,
                    "description": i.description,
                    "business_impact": i.business_impact,
                    "shap_contribution": i.shap_contribution,
                    "feature_name": i.feature_name,
                    "feature_value": i.feature_value
                }
                for i in output.critical_insights
            ],
            "risk_level": output.risk_level,
            "success_probability": output.success_probability,
            "investor_appeal": output.investor_appeal
        }


# مثال على الاستخدام
if __name__ == "__main__":
    # بيانات تجريبية
    shap_values = {
        "budget": -0.35,
        "market_demand": -0.28,
        "team_size": -0.15,
        "hypothesis_validation_rate": -0.42,
        "rat_completion_rate": -0.38
    }
    
    feature_values = {
        "budget": 150000,
        "market_demand": 25,
        "team_size": 3,
        "hypothesis_validation_rate": 0.22,
        "rat_completion_rate": 0.18
    }
    
    # إنشاء المحرك
    engine = CEOInsightsEngine()
    
    # توليد الرؤى
    insights = engine.generate_ceo_insights(
        shap_values=shap_values,
        feature_values=feature_values,
        sector="fintech",
        organization="startup",
        success_probability=22.0
    )
    
    # طباعة النتائج
    print("=" * 70)
    print("CEO Insights Engine - Test Output")
    print("=" * 70)
    print(json.dumps(engine.to_dict(insights), ensure_ascii=False, indent=2))
