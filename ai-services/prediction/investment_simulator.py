"""
UPLINK 5.0 - Investment Simulator
Strategic Bridge Protocol - Component 3

محاكاة جاذبية المشروع للمستثمرين وحساب Investor Readiness Level (IRL).

Author: Manus AI
Date: 31 يناير 2026
Version: 1.0
"""

import json
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
from enum import Enum


class InvestorType(Enum):
    """أنواع المستثمرين"""
    ANGEL = "angel"
    VC_SEED = "vc_seed"
    VC_SERIES_A = "vc_series_a"
    CORPORATE = "corporate"
    PIF = "pif"
    GOVERNMENT = "government"


@dataclass
class InvestorCriteria:
    """معايير المستثمر"""
    investor_type: InvestorType
    min_traction: float  # 0-100
    min_team_quality: float  # 0-100
    min_market_size: float  # بالمليون ريال
    min_technical_feasibility: float  # 0-100
    min_financial_health: float  # 0-100
    preferred_sectors: List[str]
    preferred_stages: List[str]
    typical_check_size: tuple  # (min, max) بالريال


@dataclass
class InvestorReadinessLevel:
    """مستوى الجاهزية الاستثمارية"""
    irl_score: float  # 0-100
    irl_grade: str  # A+, A, B+, B, C+, C, D
    investor_appeal: str  # very_high, high, medium, low, very_low
    recommended_investor_types: List[InvestorType]
    key_strengths: List[str]
    key_weaknesses: List[str]
    estimated_valuation_range: tuple  # (min, max) بالريال
    estimated_funding_potential: tuple  # (min, max) بالريال
    readiness_breakdown: Dict[str, float]


@dataclass
class InvestmentScenario:
    """سيناريو استثماري"""
    scenario_name: str
    probability: float  # 0-1
    funding_amount: float  # بالريال
    equity_dilution: float  # 0-1
    post_money_valuation: float  # بالريال
    investor_type: InvestorType
    timeline_months: int
    conditions: List[str]


class SaudiVCCriteria:
    """معايير صناديق رأس المال الجريء السعودية"""
    
    # معايير PIF
    PIF_CRITERIA = InvestorCriteria(
        investor_type=InvestorType.PIF,
        min_traction=60,
        min_team_quality=75,
        min_market_size=500_000_000,  # 500M ريال
        min_technical_feasibility=70,
        min_financial_health=65,
        preferred_sectors=[
            "renewable_energy",
            "smart_agriculture",
            "digital_health",
            "fintech",
            "proptech"
        ],
        preferred_stages=["series_a", "series_b", "growth"],
        typical_check_size=(5_000_000, 50_000_000)
    )
    
    # معايير VCs السعودية (Seed)
    SAUDI_VC_SEED_CRITERIA = InvestorCriteria(
        investor_type=InvestorType.VC_SEED,
        min_traction=30,
        min_team_quality=60,
        min_market_size=100_000_000,  # 100M ريال
        min_technical_feasibility=60,
        min_financial_health=50,
        preferred_sectors=[
            "fintech",
            "ecommerce",
            "edtech",
            "digital_health",
            "food_delivery",
            "logistics"
        ],
        preferred_stages=["pre_seed", "seed"],
        typical_check_size=(500_000, 3_000_000)
    )
    
    # معايير VCs السعودية (Series A)
    SAUDI_VC_SERIES_A_CRITERIA = InvestorCriteria(
        investor_type=InvestorType.VC_SERIES_A,
        min_traction=50,
        min_team_quality=70,
        min_market_size=200_000_000,  # 200M ريال
        min_technical_feasibility=70,
        min_financial_health=60,
        preferred_sectors=[
            "fintech",
            "ecommerce",
            "edtech",
            "digital_health",
            "proptech",
            "logistics"
        ],
        preferred_stages=["series_a"],
        typical_check_size=(3_000_000, 15_000_000)
    )
    
    # معايير Angel Investors
    ANGEL_CRITERIA = InvestorCriteria(
        investor_type=InvestorType.ANGEL,
        min_traction=10,
        min_team_quality=50,
        min_market_size=50_000_000,  # 50M ريال
        min_technical_feasibility=50,
        min_financial_health=40,
        preferred_sectors=[
            "fintech",
            "ecommerce",
            "edtech",
            "food_delivery",
            "tourism"
        ],
        preferred_stages=["pre_seed"],
        typical_check_size=(100_000, 500_000)
    )
    
    # معايير Corporate VCs (روشن، أرامكو، STC، إلخ)
    CORPORATE_VC_CRITERIA = InvestorCriteria(
        investor_type=InvestorType.CORPORATE,
        min_traction=40,
        min_team_quality=65,
        min_market_size=150_000_000,  # 150M ريال
        min_technical_feasibility=65,
        min_financial_health=55,
        preferred_sectors=[
            "proptech",  # روشن
            "renewable_energy",  # أرامكو
            "digital_health",  # STC
            "fintech",  # البنوك
            "logistics"  # SAPTCO
        ],
        preferred_stages=["seed", "series_a"],
        typical_check_size=(1_000_000, 10_000_000)
    )
    
    # معايير البرامج الحكومية (Monsha'at، Badir، KAUST)
    GOVERNMENT_CRITERIA = InvestorCriteria(
        investor_type=InvestorType.GOVERNMENT,
        min_traction=5,
        min_team_quality=40,
        min_market_size=20_000_000,  # 20M ريال
        min_technical_feasibility=50,
        min_financial_health=30,
        preferred_sectors=[
            "fintech",
            "ecommerce",
            "edtech",
            "digital_health",
            "smart_agriculture",
            "renewable_energy",
            "tourism",
            "logistics"
        ],
        preferred_stages=["pre_seed", "seed"],
        typical_check_size=(50_000, 500_000)
    )


class InvestmentSimulator:
    """محاكي السيناريوهات الاستثمارية"""
    
    def __init__(self):
        self.criteria = SaudiVCCriteria()
    
    
    def _clean_value(self, value) -> float:
        """تنظيف القيم - تحويل النصوص إلى أرقام"""
        if isinstance(value, (int, float)):
            return float(value)
        if isinstance(value, str):
            has_percent = "%" in value
            value = value.replace("%", "").strip()
            try:
                num = float(value)
                return num / 100 if has_percent else num
            except:
                return 0.0
        return 0.0
    def _clean_value(self, value: Any) -> float:
        """تنظيف القيم - تحويل النصوص إلى أرقام"""
        if isinstance(value, (int, float)):
            return float(value)
        if isinstance(value, str):
            has_percent = "%" in value
            value = value.replace("%", "").strip()
            try:
                num = float(value)
                return num / 100 if has_percent else num
            except:
                return 0.0
        return 0.0
    
    def calculate_irl(
        self,
        features: Dict[str, float],
        sector: str,
        organization: str,
        stage: str,
        success_probability: float
    ) -> InvestorReadinessLevel:
        """
        حساب Investor Readiness Level
        
        Args:
            features: ميزات المشروع
            sector: القطاع
            organization: نوع المنظمة
            stage: المرحلة
            success_probability: احتمالية النجاح
            
        Returns:
            InvestorReadinessLevel: مستوى الجاهزية
        """
        # حساب المكونات الرئيسية
        traction_score = self._calculate_traction_score(features)
        team_quality_score = self._calculate_team_quality_score(features, organization)
        market_size_score = self._calculate_market_size_score(features, sector)
        technical_feasibility_score = features.get("technical_feasibility", 50)
        financial_health_score = self._calculate_financial_health_score(features)
        
        # الأوزان
        weights = {
            "traction": 0.30,
            "team": 0.20,
            "market": 0.20,
            "technical": 0.15,
            "financial": 0.15
        }
        
        # حساب IRL Score
        irl_score = (
            traction_score * weights["traction"] +
            team_quality_score * weights["team"] +
            market_size_score * weights["market"] +
            technical_feasibility_score * weights["technical"] +
            financial_health_score * weights["financial"]
        )
        
        # تعديل بناءً على احتمالية النجاح
        irl_score = (irl_score * 0.7) + (success_probability * 0.3)
        
        # تحديد الدرجة
        irl_grade = self._calculate_irl_grade(irl_score)
        
        # تحديد جاذبية المستثمر
        investor_appeal = self._determine_investor_appeal(irl_score)
        
        # تحديد أنواع المستثمرين الموصى بهم
        recommended_investors = self._recommend_investor_types(
            traction_score,
            team_quality_score,
            market_size_score,
            technical_feasibility_score,
            financial_health_score,
            sector,
            stage
        )
        
        # تحديد نقاط القوة والضعف
        strengths, weaknesses = self._identify_strengths_weaknesses(
            traction_score,
            team_quality_score,
            market_size_score,
            technical_feasibility_score,
            financial_health_score
        )
        
        # تقدير نطاق التقييم
        valuation_range = self._estimate_valuation_range(
            irl_score,
            sector,
            stage,
            self._clean_value(features.get("revenue_growth", 0))
        )
        
        # تقدير إمكانية التمويل
        funding_potential = self._estimate_funding_potential(
            irl_score,
            valuation_range,
            stage
        )
        
        # تفصيل الجاهزية
        readiness_breakdown = {
            "traction": traction_score,
            "team_quality": team_quality_score,
            "market_size": market_size_score,
            "technical_feasibility": technical_feasibility_score,
            "financial_health": financial_health_score
        }
        
        return InvestorReadinessLevel(
            irl_score=irl_score,
            irl_grade=irl_grade,
            investor_appeal=investor_appeal,
            recommended_investor_types=recommended_investors,
            key_strengths=strengths,
            key_weaknesses=weaknesses,
            estimated_valuation_range=valuation_range,
            estimated_funding_potential=funding_potential,
            readiness_breakdown=readiness_breakdown
        )
    
    def simulate_investment_scenarios(
        self,
        irl: InvestorReadinessLevel,
        sector: str,
        stage: str
    ) -> List[InvestmentScenario]:
        """
        محاكاة سيناريوهات استثمارية محتملة
        
        Args:
            irl: مستوى الجاهزية
            sector: القطاع
            stage: المرحلة
            
        Returns:
            List[InvestmentScenario]: قائمة السيناريوهات
        """
        scenarios = []
        
        for investor_type in irl.recommended_investor_types:
            scenario = self._generate_scenario(
                investor_type,
                irl.irl_score,
                irl.estimated_funding_potential,
                sector,
                stage
            )
            scenarios.append(scenario)
        
        # ترتيب حسب الاحتمالية
        scenarios.sort(key=lambda x: x.probability, reverse=True)
        
        return scenarios
    
    def _calculate_traction_score(self, features: Dict[str, float]) -> float:
        """حساب نقاط الجذب"""
        user_count = self._clean_value(features.get("user_count", 0))
        revenue_growth = self._clean_value(features.get("revenue_growth", 0))
        user_engagement = self._clean_value(features.get("user_engagement", 0))
        market_share = self._clean_value(features.get("market_share", 0))
        
        # تطبيع
        user_score = min(100, (user_count / 10000) * 100) if user_count > 0 else 0
        revenue_score = min(100, revenue_growth * 100) if revenue_growth > 0 else 0
        engagement_score = user_engagement
        market_score = market_share * 100
        
        # متوسط مرجح
        traction = (
            user_score * 0.30 +
            revenue_score * 0.35 +
            engagement_score * 0.20 +
            market_score * 0.15
        )
        
        return min(100, traction)
    
    def _calculate_team_quality_score(self, features: Dict[str, float], organization: str) -> float:
        """حساب جودة الفريق"""
        team_size = self._clean_value(features.get("team_size", 0))
        
        # أوزان حسب نوع المنظمة
        org_weights = {
            "kaust": 85,  # سمعة قوية
            "pif": 80,
            "roshn": 75,
            "startup": 50
        }
        
        base_score = org_weights.get(organization, 50)
        
        # تعديل بناءً على حجم الفريق
        if team_size < 3:
            team_score = base_score * 0.7
        elif team_size < 5:
            team_score = base_score * 0.85
        elif team_size < 8:
            team_score = base_score
        else:
            team_score = min(100, base_score * 1.1)
        
        return team_score
    
    def _calculate_market_size_score(self, features: Dict[str, float], sector: str) -> float:
        """حساب حجم السوق"""
        market_demand = self._clean_value(features.get("market_demand", 0))
        
        # TAM estimates for Saudi market (بالمليون ريال)
        sector_tam = {
            "fintech": 15000,
            "ecommerce": 50000,
            "digital_health": 20000,
            "edtech": 8000,
            "renewable_energy": 100000,
            "smart_agriculture": 25000,
            "proptech": 30000,
            "logistics": 40000,
            "food_delivery": 10000,
            "tourism": 35000
        }
        
        tam = sector_tam.get(sector, 10000)
        
        # تقدير SAM (10-30% من TAM)
        sam_percentage = market_demand / 100 * 0.3
        sam = tam * sam_percentage
        
        # تطبيع (100M = 50 points, 500M = 100 points)
        if sam < 100:
            score = sam / 100 * 50
        else:
            score = 50 + ((sam - 100) / 400) * 50
        
        return min(100, score)
    
    def _calculate_financial_health_score(self, features: Dict[str, float]) -> float:
        """حساب الصحة المالية"""
        budget = self._clean_value(features.get("budget", 0))
        rat_completion = self._clean_value(features.get("rat_completion_rate", 0))
        roi = self._clean_value(features.get("roi", 0))
        
        # Runway (بافتراض burn rate = 10% شهرياً)
        monthly_burn = budget * 0.10
        runway_months = budget / monthly_burn if monthly_burn > 0 else 0
        
        # تطبيع
        runway_score = min(100, (runway_months / 18) * 100)  # 18 شهر = 100
        rat_score = rat_completion * 100
        roi_score = min(100, roi * 100) if roi > 0 else 0
        
        # متوسط مرجح
        financial_health = (
            runway_score * 0.40 +
            rat_score * 0.35 +
            roi_score * 0.25
        )
        
        return financial_health
    
    def _calculate_irl_grade(self, irl_score: float) -> str:
        """تحديد درجة IRL"""
        if irl_score >= 90:
            return "A+"
        elif irl_score >= 85:
            return "A"
        elif irl_score >= 80:
            return "A-"
        elif irl_score >= 75:
            return "B+"
        elif irl_score >= 70:
            return "B"
        elif irl_score >= 65:
            return "B-"
        elif irl_score >= 60:
            return "C+"
        elif irl_score >= 55:
            return "C"
        elif irl_score >= 50:
            return "C-"
        else:
            return "D"
    
    def _determine_investor_appeal(self, irl_score: float) -> str:
        """تحديد جاذبية المستثمر"""
        if irl_score >= 80:
            return "very_high"
        elif irl_score >= 65:
            return "high"
        elif irl_score >= 50:
            return "medium"
        elif irl_score >= 35:
            return "low"
        else:
            return "very_low"
    
    def _recommend_investor_types(
        self,
        traction: float,
        team: float,
        market: float,
        technical: float,
        financial: float,
        sector: str,
        stage: str
    ) -> List[InvestorType]:
        """تحديد أنواع المستثمرين الموصى بهم"""
        recommended = []
        
        # فحص كل نوع مستثمر
        all_criteria = [
            self.criteria.PIF_CRITERIA,
            self.criteria.SAUDI_VC_SERIES_A_CRITERIA,
            self.criteria.SAUDI_VC_SEED_CRITERIA,
            self.criteria.CORPORATE_VC_CRITERIA,
            self.criteria.ANGEL_CRITERIA,
            self.criteria.GOVERNMENT_CRITERIA
        ]
        
        for criteria in all_criteria:
            # فحص المعايير
            meets_traction = traction >= criteria.min_traction
            meets_team = team >= criteria.min_team_quality
            meets_technical = technical >= criteria.min_technical_feasibility
            meets_financial = financial >= criteria.min_financial_health
            meets_sector = sector in criteria.preferred_sectors
            meets_stage = stage in criteria.preferred_stages
            
            # حساب نسبة التطابق
            match_score = sum([
                meets_traction,
                meets_team,
                meets_technical,
                meets_financial,
                meets_sector,
                meets_stage
            ]) / 6
            
            # إذا كان التطابق > 60%، أضف إلى القائمة
            if match_score >= 0.6:
                recommended.append(criteria.investor_type)
        
        # إذا لم يتم العثور على أي مستثمر، أضف Government و Angel
        if not recommended:
            recommended = [InvestorType.GOVERNMENT, InvestorType.ANGEL]
        
        return recommended
    
    def _identify_strengths_weaknesses(
        self,
        traction: float,
        team: float,
        market: float,
        technical: float,
        financial: float
    ) -> tuple:
        """تحديد نقاط القوة والضعف"""
        scores = {
            "الجذب السوقي (Traction)": traction,
            "جودة الفريق": team,
            "حجم السوق": market,
            "الجدوى التقنية": technical,
            "الصحة المالية": financial
        }
        
        # ترتيب حسب النقاط
        sorted_scores = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        
        # أعلى 2 = نقاط قوة
        strengths = [f"{name} ({score:.0f}/100)" for name, score in sorted_scores[:2] if score >= 60]
        
        # أدنى 2 = نقاط ضعف
        weaknesses = [f"{name} ({score:.0f}/100)" for name, score in sorted_scores[-2:] if score < 60]
        
        return strengths, weaknesses
    
    def _estimate_valuation_range(
        self,
        irl_score: float,
        sector: str,
        stage: str,
        revenue_growth: float
    ) -> tuple:
        """تقدير نطاق التقييم"""
        # Base valuation حسب المرحلة
        stage_base = {
            "pre_seed": 2_000_000,
            "seed": 5_000_000,
            "series_a": 15_000_000,
            "series_b": 50_000_000,
            "growth": 150_000_000
        }
        
        base = stage_base.get(stage, 2_000_000)
        
        # تعديل بناءً على IRL Score
        irl_multiplier = 0.5 + (irl_score / 100) * 1.5  # 0.5x to 2x
        
        # تعديل بناءً على القطاع (بعض القطاعات لها تقييمات أعلى)
        sector_multipliers = {
            "fintech": 1.3,
            "digital_health": 1.2,
            "renewable_energy": 1.4,
            "ecommerce": 1.0,
            "edtech": 1.1
        }
        sector_multiplier = sector_multipliers.get(sector, 1.0)
        
        # تعديل بناءً على نمو الإيرادات
        revenue_multiplier = 1.0 + (revenue_growth * 0.5)
        
        # حساب التقييم
        valuation = base * irl_multiplier * sector_multiplier * revenue_multiplier
        
        # نطاق ±30%
        min_val = valuation * 0.7
        max_val = valuation * 1.3
        
        return (min_val, max_val)
    
    def _estimate_funding_potential(
        self,
        irl_score: float,
        valuation_range: tuple,
        stage: str
    ) -> tuple:
        """تقدير إمكانية التمويل"""
        # نسبة التمويل المعتادة حسب المرحلة
        stage_equity = {
            "pre_seed": 0.15,  # 10-20%
            "seed": 0.20,  # 15-25%
            "series_a": 0.25,  # 20-30%
            "series_b": 0.20,  # 15-25%
            "growth": 0.15  # 10-20%
        }
        
        equity_percentage = stage_equity.get(stage, 0.20)
        
        # حساب التمويل
        min_funding = valuation_range[0] * equity_percentage
        max_funding = valuation_range[1] * equity_percentage
        
        # تعديل بناءً على IRL Score
        if irl_score < 50:
            min_funding *= 0.5
            max_funding *= 0.7
        elif irl_score > 80:
            min_funding *= 1.2
            max_funding *= 1.5
        
        return (min_funding, max_funding)
    
    def _generate_scenario(
        self,
        investor_type: InvestorType,
        irl_score: float,
        funding_potential: tuple,
        sector: str,
        stage: str
    ) -> InvestmentScenario:
        """توليد سيناريو استثماري"""
        # الحصول على المعايير
        criteria_map = {
            InvestorType.PIF: self.criteria.PIF_CRITERIA,
            InvestorType.VC_SERIES_A: self.criteria.SAUDI_VC_SERIES_A_CRITERIA,
            InvestorType.VC_SEED: self.criteria.SAUDI_VC_SEED_CRITERIA,
            InvestorType.CORPORATE: self.criteria.CORPORATE_VC_CRITERIA,
            InvestorType.ANGEL: self.criteria.ANGEL_CRITERIA,
            InvestorType.GOVERNMENT: self.criteria.GOVERNMENT_CRITERIA
        }
        
        criteria = criteria_map.get(investor_type, self.criteria.ANGEL_CRITERIA)
        
        # حساب الاحتمالية
        if irl_score >= 80:
            probability = 0.7
        elif irl_score >= 65:
            probability = 0.5
        elif irl_score >= 50:
            probability = 0.3
        else:
            probability = 0.1
        
        # تحديد مبلغ التمويل
        funding_amount = (criteria.typical_check_size[0] + criteria.typical_check_size[1]) / 2
        
        # تحديد التخفيف
        equity_dilution = funding_amount / ((funding_potential[0] + funding_potential[1]) / 2)
        equity_dilution = min(0.30, max(0.10, equity_dilution))
        
        # حساب Post-money valuation
        post_money_valuation = funding_amount / equity_dilution
        
        # تحديد الجدول الزمني
        timeline_months = {
            InvestorType.ANGEL: 1,
            InvestorType.GOVERNMENT: 2,
            InvestorType.VC_SEED: 3,
            InvestorType.CORPORATE: 4,
            InvestorType.VC_SERIES_A: 6,
            InvestorType.PIF: 9
        }.get(investor_type, 3)
        
        # الشروط
        conditions = self._generate_conditions(investor_type, irl_score)
        
        # اسم السيناريو
        scenario_name = f"تمويل من {self._translate_investor_type(investor_type)}"
        
        return InvestmentScenario(
            scenario_name=scenario_name,
            probability=probability,
            funding_amount=funding_amount,
            equity_dilution=equity_dilution,
            post_money_valuation=post_money_valuation,
            investor_type=investor_type,
            timeline_months=timeline_months,
            conditions=conditions
        )
    
    def _generate_conditions(self, investor_type: InvestorType, irl_score: float) -> List[str]:
        """توليد شروط التمويل"""
        conditions = []
        
        if irl_score < 60:
            conditions.append("تحقيق معايير Traction محددة (مثل 1000 مستخدم نشط)")
            conditions.append("إكمال MVP وإطلاقه في السوق")
        
        if investor_type in [InvestorType.VC_SEED, InvestorType.VC_SERIES_A]:
            conditions.append("Due Diligence شاملة (مالية، قانونية، تقنية)")
            conditions.append("موافقة Investment Committee")
        
        if investor_type == InvestorType.PIF:
            conditions.append("توافق مع أهداف رؤية 2030")
            conditions.append("Due Diligence موسعة (3-6 أشهر)")
            conditions.append("موافقة مجلس الإدارة")
        
        if investor_type == InvestorType.CORPORATE:
            conditions.append("توافق استراتيجي مع أعمال الشركة الأم")
            conditions.append("إمكانية التكامل أو الشراكة")
        
        if investor_type == InvestorType.GOVERNMENT:
            conditions.append("استيفاء معايير البرنامج (مثل سعودة الفريق)")
            conditions.append("تقديم خطة عمل تفصيلية")
        
        return conditions
    
    def _translate_investor_type(self, investor_type: InvestorType) -> str:
        """ترجمة نوع المستثمر"""
        translations = {
            InvestorType.ANGEL: "مستثمرين ملائكة",
            InvestorType.VC_SEED: "صناديق رأس المال الجريء (Seed)",
            InvestorType.VC_SERIES_A: "صناديق رأس المال الجريء (Series A)",
            InvestorType.CORPORATE: "صناديق الشركات (Corporate VC)",
            InvestorType.PIF: "صندوق الاستثمارات العامة (PIF)",
            InvestorType.GOVERNMENT: "البرامج الحكومية (Monsha'at/Badir)"
        }
        return translations.get(investor_type, investor_type.value)
    
    def to_dict(self, irl: InvestorReadinessLevel) -> Dict[str, Any]:
        """تحويل IRL إلى قاموس"""
        return {
            "irl_score": irl.irl_score,
            "irl_grade": irl.irl_grade,
            "investor_appeal": irl.investor_appeal,
            "recommended_investor_types": [it.value for it in irl.recommended_investor_types],
            "key_strengths": irl.key_strengths,
            "key_weaknesses": irl.key_weaknesses,
            "estimated_valuation_range": {
                "min": irl.estimated_valuation_range[0],
                "max": irl.estimated_valuation_range[1]
            },
            "estimated_funding_potential": {
                "min": irl.estimated_funding_potential[0],
                "max": irl.estimated_funding_potential[1]
            },
            "readiness_breakdown": irl.readiness_breakdown
        }
    
    def scenarios_to_dict(self, scenarios: List[InvestmentScenario]) -> List[Dict[str, Any]]:
        """تحويل السيناريوهات إلى قاموس"""
        return [
            {
                "scenario_name": s.scenario_name,
                "probability": s.probability,
                "funding_amount": s.funding_amount,
                "equity_dilution": s.equity_dilution,
                "post_money_valuation": s.post_money_valuation,
                "investor_type": s.investor_type.value,
                "timeline_months": s.timeline_months,
                "conditions": s.conditions
            }
            for s in scenarios
        ]


# مثال على الاستخدام
if __name__ == "__main__":
    # بيانات تجريبية
    features = {
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
        "roi": 0.10
    }
    
    # إنشاء المحاكي
    simulator = InvestmentSimulator()
    
    # حساب IRL
    irl = simulator.calculate_irl(
        features=features,
        sector="fintech",
        organization="startup",
        stage="seed",
        success_probability=65.0
    )
    
    # محاكاة السيناريوهات
    scenarios = simulator.simulate_investment_scenarios(
        irl=irl,
        sector="fintech",
        stage="seed"
    )
    
    # طباعة النتائج
    print("=" * 70)
    print("Investment Simulator - Test Output")
    print("=" * 70)
    print("\n### Investor Readiness Level ###")
    print(json.dumps(simulator.to_dict(irl), ensure_ascii=False, indent=2))
    print("\n### Investment Scenarios ###")
    print(json.dumps(simulator.scenarios_to_dict(scenarios), ensure_ascii=False, indent=2))
