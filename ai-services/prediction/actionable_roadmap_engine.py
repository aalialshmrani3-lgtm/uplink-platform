"""
UPLINK 5.0 - Actionable Roadmap Engine
Strategic Bridge Protocol - Component 2

توليد خطة عملية من 3 خطوات لكل عامل سلبي، مبنية على ISO 56002.

Author: Manus AI
Date: 31 يناير 2026
Version: 1.0
"""

import json
import re
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict


@dataclass
class TacticalMove:
    """خطوة تكتيكية واحدة"""
    step: int
    title: str
    description: str
    iso_56002_reference: str
    deliverables: List[str]
    resources_needed: List[str]
    timeline: str
    cost_estimate: str
    success_criteria: str


@dataclass
class ActionableRoadmap:
    """خارطة طريق عملية"""
    roadmap_id: str
    title: str
    priority: str
    estimated_timeline: str
    success_metrics: List[str]
    tactical_moves: List[TacticalMove]
    alternative_paths: List[Dict[str, str]]
    risk_mitigation: List[str]


class ISO56002KnowledgeBase:
    """قاعدة معرفة ISO 56002"""
    
    # أفضل الممارسات حسب فئة المخاطر
    BEST_PRACTICES = {
        "financial_risk": {
            "relevant_clauses": [
                "5.2 - Innovation Strategy",
                "7.4 - Collaboration and Partnerships",
                "8.3 - Innovation Process"
            ],
            "tactical_moves_templates": {
                "funding": [
                    {
                        "title": "تحسين Financial Model وإعداد Pitch Deck احترافي",
                        "description": "بناء نموذج مالي متقدم يوضح Unit Economics، CAC/LTV ratio، وتوقعات الإيرادات لـ 3 سنوات. إعداد Pitch Deck يركز على حجم السوق (TAM/SAM/SOM) والميزة التنافسية.",
                        "iso_reference": "Clause 5.2 - Innovation Strategy",
                        "deliverables": [
                            "Financial Model (Excel/Google Sheets) مع 3 سيناريوهات",
                            "Pitch Deck احترافي (15-20 شريحة)",
                            "One-pager تنفيذي للمستثمرين"
                        ],
                        "resources": [
                            "استشاري مالي متخصص في {sector}",
                            "مصمم جرافيك للـ Pitch Deck"
                        ],
                        "timeline": "2-3 أسابيع",
                        "cost": "15,000 - 25,000 ريال",
                        "success": "موافقة 3 مستشارين على جودة النموذج المالي"
                    },
                    {
                        "title": "استهداف برامج التسريع والحاضنات السعودية",
                        "description": "التقديم على برامج Monsha'at، Badir، KAUST Innovation، وPIF Accelerator. هذه البرامج توفر تمويل أولي (50K-200K ريال) + إرشاد + شبكة علاقات.",
                        "iso_reference": "Clause 7.4 - Collaboration and Partnerships",
                        "deliverables": [
                            "طلبات تقديم لـ 5 برامج تسريع على الأقل",
                            "فيديو pitch (2-3 دقائق)",
                            "خطة استخدام التمويل المتوقع"
                        ],
                        "resources": [
                            "وقت المؤسسين (20 ساعة/أسبوع لمدة شهر)",
                            "مستشار لمراجعة الطلبات"
                        ],
                        "timeline": "1-2 أشهر",
                        "cost": "5,000 - 10,000 ريال",
                        "success": "قبول في برنامج تسريع واحد على الأقل"
                    },
                    {
                        "title": "تخفيض Burn Rate عبر Lean Operations",
                        "description": "تطبيق منهجية Lean Startup لتخفيض التكاليف التشغيلية بنسبة 30%. التركيز على MVP بدلاً من Full Product، استخدام No-code tools، والاستعانة بـ Freelancers بدلاً من Full-time employees.",
                        "iso_reference": "Clause 8.3 - Innovation Process",
                        "deliverables": [
                            "خطة تخفيض التكاليف التفصيلية",
                            "MVP محدد بوضوح (Core Features فقط)",
                            "جدول زمني لـ Lean Launch"
                        ],
                        "resources": [
                            "مستشار Lean Startup",
                            "أدوات No-code (Bubble, Webflow, Zapier)"
                        ],
                        "timeline": "1 شهر",
                        "cost": "10,000 - 15,000 ريال",
                        "success": "تخفيض Burn Rate بنسبة 30%"
                    }
                ]
            }
        },
        "market_validation": {
            "relevant_clauses": [
                "8.2.2 - Idea Assessment",
                "8.2.3 - Concept Development",
                "8.3.4 - Validation"
            ],
            "tactical_moves_templates": {
                "customer_discovery": [
                    {
                        "title": "إجراء 50 مقابلة مع العملاء المحتملين (Customer Discovery)",
                        "description": "تطبيق منهجية Customer Development لإجراء مقابلات متعمقة مع 50 عميل محتمل. التركيز على فهم المشاكل الحقيقية، الحلول الحالية، والاستعداد للدفع.",
                        "iso_reference": "Clause 8.2.2 - Idea Assessment",
                        "deliverables": [
                            "دليل المقابلات (Interview Script)",
                            "تقرير تحليل المقابلات (50 مقابلة)",
                            "Customer Personas محدثة بناءً على البيانات الفعلية"
                        ],
                        "resources": [
                            "وقت المؤسسين (3-4 ساعات/يوم لمدة شهر)",
                            "أداة تسجيل المقابلات (Otter.ai أو مشابه)"
                        ],
                        "timeline": "1-1.5 شهر",
                        "cost": "2,000 - 5,000 ريال (حوافز للمشاركين)",
                        "success": "تحديد 3 مشاكل رئيسية يواجهها 80%+ من العملاء"
                    },
                    {
                        "title": "بناء Landing Page + A/B Testing",
                        "description": "إنشاء Landing Page احترافية تشرح Value Proposition وإجراء A/B Testing لـ 3 رسائل تسويقية مختلفة. قياس Conversion Rate وجمع بريد إلكتروني لـ 200+ عميل محتمل.",
                        "iso_reference": "Clause 8.2.3 - Concept Development",
                        "deliverables": [
                            "Landing Page احترافية (Webflow أو Unbounce)",
                            "3 نسخ مختلفة للـ A/B Testing",
                            "تقرير تحليل النتائج (Conversion Rate، Bounce Rate، Time on Page)"
                        ],
                        "resources": [
                            "مصمم UI/UX",
                            "Copywriter متخصص",
                            "ميزانية إعلانات (Google Ads / Facebook Ads)"
                        ],
                        "timeline": "2-3 أسابيع",
                        "cost": "8,000 - 15,000 ريال",
                        "success": "Conversion Rate > 5% وجمع 200+ بريد إلكتروني"
                    },
                    {
                        "title": "إطلاق MVP وقياس Engagement Metrics",
                        "description": "إطلاق MVP لـ 50-100 مستخدم تجريبي (Beta Users) وقياس Engagement Metrics (DAU/MAU، Retention Rate، Feature Usage). جمع Feedback نوعي وكمي.",
                        "iso_reference": "Clause 8.3.4 - Validation",
                        "deliverables": [
                            "MVP جاهز للإطلاق (Core Features فقط)",
                            "Dashboard لقياس Engagement Metrics",
                            "تقرير تحليل الـ Beta Testing"
                        ],
                        "resources": [
                            "فريق تطوير (2-3 مطورين)",
                            "أداة Analytics (Mixpanel أو Amplitude)",
                            "Beta Users (50-100 مستخدم)"
                        ],
                        "timeline": "2-3 أشهر",
                        "cost": "30,000 - 60,000 ريال",
                        "success": "Retention Rate > 40% بعد 7 أيام"
                    }
                ]
            }
        },
        "execution_risk": {
            "relevant_clauses": [
                "8.3 - Innovation Process",
                "9.1 - Monitoring and Measurement",
                "10.2 - Continual Improvement"
            ],
            "tactical_moves_templates": {
                "project_management": [
                    {
                        "title": "تطبيق Agile/Scrum للتنفيذ السريع",
                        "description": "تبني منهجية Agile/Scrum مع Sprints أسبوعية، Daily Standups، وSprint Reviews. استخدام أدوات مثل Jira أو Trello لتتبع المهام والتقدم.",
                        "iso_reference": "Clause 8.3 - Innovation Process",
                        "deliverables": [
                            "Sprint Planning لـ 8 Sprints (شهرين)",
                            "Backlog منظم حسب الأولوية",
                            "Sprint Review Reports أسبوعية"
                        ],
                        "resources": [
                            "Scrum Master (أو مؤسس يتولى الدور)",
                            "أداة إدارة مشاريع (Jira، Trello، Asana)"
                        ],
                        "timeline": "مستمر (2-3 أشهر للبداية)",
                        "cost": "5,000 - 10,000 ريال (أدوات + تدريب)",
                        "success": "إكمال 80%+ من المهام المخططة في كل Sprint"
                    },
                    {
                        "title": "تحديد KPIs وOKRs واضحة",
                        "description": "تحديد 3-5 KPIs رئيسية (مثل Revenue، User Growth، Churn Rate) و3 OKRs ربع سنوية. مراجعة أسبوعية للتقدم وتعديل الاستراتيجية حسب الحاجة.",
                        "iso_reference": "Clause 9.1 - Monitoring and Measurement",
                        "deliverables": [
                            "قائمة KPIs مع Targets واضحة",
                            "3 OKRs ربع سنوية",
                            "Dashboard لتتبع KPIs في الوقت الفعلي"
                        ],
                        "resources": [
                            "مستشار استراتيجي",
                            "أداة BI (Google Data Studio أو Tableau)"
                        ],
                        "timeline": "1-2 أسابيع (للإعداد)",
                        "cost": "3,000 - 8,000 ريال",
                        "success": "تحقيق 70%+ من OKRs الربع سنوية"
                    },
                    {
                        "title": "Weekly Sprint Reviews مع الفريق",
                        "description": "عقد اجتماعات أسبوعية لمراجعة التقدم، تحديد العوائق، والاحتفال بالإنجازات. تطبيق Retrospectives لتحسين العمليات بشكل مستمر.",
                        "iso_reference": "Clause 10.2 - Continual Improvement",
                        "deliverables": [
                            "محاضر اجتماعات أسبوعية",
                            "قائمة العوائق والحلول المقترحة",
                            "Retrospective Reports شهرية"
                        ],
                        "resources": [
                            "وقت الفريق (2 ساعة/أسبوع)",
                            "أداة تسجيل المحاضر"
                        ],
                        "timeline": "مستمر",
                        "cost": "0 ريال (وقت الفريق فقط)",
                        "success": "حل 90%+ من العوائق خلال أسبوع"
                    }
                ]
            }
        },
        "market_risk": {
            "relevant_clauses": [
                "5.3 - Strategic Direction",
                "7.2 - Competence",
                "8.2 - Ideation"
            ],
            "tactical_moves_templates": {
                "market_strategy": [
                    {
                        "title": "تطوير استراتيجية تسويق مبتكرة (Growth Hacking)",
                        "description": "تطبيق تكتيكات Growth Hacking لزيادة الوعي بالمنتج بتكلفة منخفضة. التركيز على Viral Loops، Referral Programs، وContent Marketing.",
                        "iso_reference": "Clause 5.3 - Strategic Direction",
                        "deliverables": [
                            "خطة Growth Hacking (10 تكتيكات)",
                            "Referral Program جاهز للإطلاق",
                            "Content Calendar (3 أشهر)"
                        ],
                        "resources": [
                            "Growth Marketer",
                            "Content Creator",
                            "ميزانية تسويق محدودة (10K-20K ريال/شهر)"
                        ],
                        "timeline": "1-2 أشهر",
                        "cost": "15,000 - 30,000 ريال",
                        "success": "تحقيق 30% نمو شهري في User Acquisition"
                    },
                    {
                        "title": "بناء شراكات استراتيجية مع شركات مكملة",
                        "description": "تحديد 5-10 شركات مكملة (غير منافسة) والتفاوض على شراكات توزيع أو co-marketing. مثال: شركة Fintech تتشارك مع منصة E-commerce.",
                        "iso_reference": "Clause 7.4 - Collaboration",
                        "deliverables": [
                            "قائمة 10 شركاء محتملين",
                            "Pitch Deck للشراكات",
                            "2-3 اتفاقيات شراكة موقعة"
                        ],
                        "resources": [
                            "Business Development Manager",
                            "محامي لمراجعة العقود"
                        ],
                        "timeline": "2-3 أشهر",
                        "cost": "10,000 - 20,000 ريال",
                        "success": "توقيع 2 شراكات تجلب 500+ مستخدم شهرياً"
                    },
                    {
                        "title": "تحسين Product-Market Fit عبر Pivoting الجزئي",
                        "description": "إذا كانت البيانات تشير إلى ضعف PMF، إجراء Pivot جزئي (تغيير Target Audience أو Value Proposition) بناءً على Feedback الفعلي.",
                        "iso_reference": "Clause 8.2 - Ideation",
                        "deliverables": [
                            "تحليل PMF الحالي",
                            "خطة Pivot (إذا لزم الأمر)",
                            "MVP محدث بعد Pivot"
                        ],
                        "resources": [
                            "Product Manager",
                            "فريق تطوير",
                            "ميزانية إضافية (20K-40K ريال)"
                        ],
                        "timeline": "1-2 أشهر",
                        "cost": "25,000 - 50,000 ريال",
                        "success": "تحسين Retention Rate بنسبة 50%+"
                    }
                ]
            }
        },
        "team_capacity": {
            "relevant_clauses": [
                "7.1 - Resources",
                "7.2 - Competence",
                "7.3 - Awareness"
            ],
            "tactical_moves_templates": {
                "team_building": [
                    {
                        "title": "توظيف استراتيجي للأدوار الحرجة",
                        "description": "تحديد الأدوار الأكثر حرجة (مثل CTO، Lead Developer، Growth Marketer) والتوظيف التدريجي بناءً على الأولوية والميزانية.",
                        "iso_reference": "Clause 7.1 - Resources",
                        "deliverables": [
                            "خطة توظيف (6 أشهر)",
                            "Job Descriptions للأدوار الحرجة",
                            "2-3 موظفين جدد"
                        ],
                        "resources": [
                            "منصات توظيف (LinkedIn، Bayt)",
                            "Recruiter (اختياري)",
                            "ميزانية رواتب"
                        ],
                        "timeline": "2-4 أشهر",
                        "cost": "60,000 - 120,000 ريال (رواتب 3 أشهر)",
                        "success": "توظيف 2 أعضاء فريق ذوي خبرة"
                    },
                    {
                        "title": "الاستعانة بـ Freelancers للمهام المؤقتة",
                        "description": "استخدام منصات Freelancing (Upwork، Fiverr، Mostaql) للحصول على خبرات متخصصة بتكلفة أقل للمهام المؤقتة (مثل تصميم، تطوير، تسويق).",
                        "iso_reference": "Clause 7.2 - Competence",
                        "deliverables": [
                            "قائمة المهام المناسبة للـ Freelancing",
                            "3-5 Freelancers موثوقين",
                            "إكمال 5 مشاريع صغيرة"
                        ],
                        "resources": [
                            "منصات Freelancing",
                            "ميزانية محدودة (5K-10K ريال/شهر)"
                        ],
                        "timeline": "مستمر",
                        "cost": "5,000 - 10,000 ريال/شهر",
                        "success": "إكمال 80%+ من المشاريع في الوقت المحدد"
                    },
                    {
                        "title": "تدريب الفريق الحالي على مهارات جديدة",
                        "description": "الاستثمار في تدريب الفريق الحالي على مهارات جديدة (مثل Agile، Growth Hacking، Data Analysis) لزيادة الإنتاجية.",
                        "iso_reference": "Clause 7.3 - Awareness",
                        "deliverables": [
                            "خطة تدريب (3 أشهر)",
                            "3 دورات تدريبية مكتملة",
                            "شهادات للفريق"
                        ],
                        "resources": [
                            "منصات تعليمية (Coursera، Udemy)",
                            "ميزانية تدريب"
                        ],
                        "timeline": "2-3 أشهر",
                        "cost": "3,000 - 8,000 ريال",
                        "success": "تحسين الإنتاجية بنسبة 20%+"
                    }
                ]
            }
        }
    }
    
    # مسارات بديلة
    ALTERNATIVE_PATHS = {
        "financial_risk": [
            {
                "title": "Bootstrap + Revenue-first Approach",
                "description": "إذا فشلت محاولات التمويل، التركيز على توليد إيرادات مبكرة عبر خدمات استشارية أو SaaS بسيط.",
                "viability": "medium"
            },
            {
                "title": "Strategic Partnership مع شركة كبيرة",
                "description": "البحث عن شريك استراتيجي (Corporate) يوفر تمويل مقابل حصة أو حقوق توزيع.",
                "viability": "medium"
            }
        ],
        "market_validation": [
            {
                "title": "Pivot إلى B2B بدلاً من B2C",
                "description": "إذا كان السوق الاستهلاكي صعباً، التحول إلى B2B حيث دورة المبيعات أقصر والعملاء أكثر استعداداً للدفع.",
                "viability": "high"
            }
        ],
        "execution_risk": [
            {
                "title": "الاستعانة بـ Fractional CTO",
                "description": "توظيف CTO بدوام جزئي (Fractional) لتوفير الخبرة التقنية بتكلفة أقل.",
                "viability": "high"
            }
        ]
    }
    
    # استراتيجيات تخفيف المخاطر
    RISK_MITIGATION = {
        "financial_risk": [
            "الاحتفاظ بـ 3 أشهر runway كاحتياطي طوارئ",
            "عدم التوسع في التوظيف قبل تأمين التمويل",
            "التفاوض على payment terms مع الموردين (Net 30/60)"
        ],
        "market_validation": [
            "إجراء اختبارات سوقية صغيرة قبل الإطلاق الكامل",
            "الاحتفاظ بمرونة في Product Roadmap للتكيف مع Feedback",
            "بناء علاقات مبكرة مع Early Adopters"
        ],
        "execution_risk": [
            "تطبيق Buffer Time في التقديرات الزمنية (20-30%)",
            "إجراء Code Reviews منتظمة لتجنب Technical Debt",
            "الاحتفاظ بـ Backup للمطورين الرئيسيين"
        ],
        "market_risk": [
            "تنويع قنوات التسويق (عدم الاعتماد على قناة واحدة)",
            "بناء Brand قوي للتمايز عن المنافسين",
            "مراقبة المنافسين بشكل مستمر"
        ]
    }


class ActionableRoadmapEngine:
    """محرك توليد خرائط الطريق العملية"""
    
    def __init__(self):
        self.kb = ISO56002KnowledgeBase()
    
    def generate_roadmap(
        self,
        critical_insight: Dict[str, Any],
        sector: str,
        organization: str,
        current_stage: str = "pre-seed"
    ) -> ActionableRoadmap:
        """
        توليد خارطة طريق عملية لرؤية حرجة
        
        Args:
            critical_insight: الرؤية الحرجة من CEO Insights Engine
            sector: القطاع
            organization: نوع المنظمة
            current_stage: المرحلة الحالية
            
        Returns:
            ActionableRoadmap: خارطة الطريق العملية
        """
        category = critical_insight["category"]
        severity = critical_insight["severity"]
        feature_name = critical_insight["feature_name"]
        
        # تحديد النوع الرئيسي للمخاطر
        risk_type = self._map_category_to_risk_type(category)
        
        # الحصول على القوالب المناسبة
        templates = self.kb.BEST_PRACTICES.get(risk_type, {}).get("tactical_moves_templates", {})
        
        # اختيار القالب المناسب
        template_key = list(templates.keys())[0] if templates else "default"
        moves_templates = templates.get(template_key, [])
        
        # توليد الخطوات التكتيكية
        tactical_moves = []
        for idx, template in enumerate(moves_templates[:3], 1):  # أول 3 خطوات فقط
            move = TacticalMove(
                step=idx,
                title=template["title"],
                description=template["description"].format(sector=self._translate_sector(sector)),
                iso_56002_reference=template["iso_reference"],
                deliverables=template["deliverables"],
                resources_needed=[r.format(sector=self._translate_sector(sector)) for r in template["resources"]],
                timeline=template["timeline"],
                cost_estimate=template["cost"],
                success_criteria=template["success"]
            )
            tactical_moves.append(move)
        
        # توليد معايير النجاح
        success_metrics = self._generate_success_metrics(risk_type, critical_insight)
        
        # الحصول على المسارات البديلة
        alternative_paths = self.kb.ALTERNATIVE_PATHS.get(risk_type, [])
        
        # الحصول على استراتيجيات تخفيف المخاطر
        risk_mitigation = self.kb.RISK_MITIGATION.get(risk_type, [])
        
        # إنشاء خارطة الطريق
        roadmap = ActionableRoadmap(
            roadmap_id=f"{risk_type.upper()}_{feature_name.upper()}",
            title=f"خطة معالجة: {critical_insight['title']}",
            priority=severity,
            estimated_timeline=self._calculate_total_timeline(tactical_moves),
            success_metrics=success_metrics,
            tactical_moves=tactical_moves,
            alternative_paths=alternative_paths,
            risk_mitigation=risk_mitigation
        )
        
        return roadmap
    
    def _map_category_to_risk_type(self, category: str) -> str:
        """تحويل فئة الرؤية إلى نوع المخاطر"""
        mapping = {
            "financial_risk": "financial_risk",
            "financial_planning": "financial_risk",
            "financial_optimization": "financial_risk",
            "market_validation": "market_validation",
            "execution_risk": "execution_risk",
            "execution_planning": "execution_risk",
            "market_risk": "market_risk",
            "market_strategy": "market_risk",
            "market_opportunity": "market_risk",
            "team_capacity": "team_capacity",
            "team_planning": "team_capacity",
            "competitive_risk": "market_risk",
            "competitive_strategy": "market_risk",
            "technical_risk": "execution_risk",
            "technical_planning": "execution_risk"
        }
        return mapping.get(category, "execution_risk")
    
    def _translate_sector(self, sector: str) -> str:
        """ترجمة اسم القطاع"""
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
    
    def _generate_success_metrics(self, risk_type: str, insight: Dict) -> List[str]:
        """توليد معايير النجاح"""
        metrics = {
            "financial_risk": [
                "تأمين {target_funding:,.0f} ريال تمويل إضافي",
                "تمديد runway إلى 18 شهر",
                "تخفيض burn rate بنسبة 30%"
            ],
            "market_validation": [
                "إكمال 50 مقابلة مع العملاء المحتملين",
                "تحقيق Conversion Rate > 5% على Landing Page",
                "Retention Rate > 40% بعد 7 أيام من استخدام MVP"
            ],
            "execution_risk": [
                "إكمال 80%+ من المهام المخططة في كل Sprint",
                "تحقيق 70%+ من OKRs الربع سنوية",
                "حل 90%+ من العوائق خلال أسبوع"
            ],
            "market_risk": [
                "تحقيق 30% نمو شهري في User Acquisition",
                "توقيع 2 شراكات تجلب 500+ مستخدم شهرياً",
                "تحسين Retention Rate بنسبة 50%+"
            ],
            "team_capacity": [
                "توظيف 2 أعضاء فريق ذوي خبرة",
                "إكمال 80%+ من مشاريع Freelancing في الوقت المحدد",
                "تحسين الإنتاجية بنسبة 20%+"
            ]
        }
        
        base_metrics = metrics.get(risk_type, metrics["execution_risk"])
        
        # تخصيص بناءً على الرؤية
        if risk_type == "financial_risk" and "budget" in insight.get("feature_name", ""):
            feature_value = insight.get("feature_value", 0)
            target_funding = max(500000, feature_value * 2)
            base_metrics[0] = base_metrics[0].format(target_funding=target_funding)
        
        return base_metrics
    
    def _calculate_total_timeline(self, moves: List[TacticalMove]) -> str:
        """حساب الجدول الزمني الإجمالي"""
        # تحليل بسيط للجدول الزمني
        total_weeks = 0
        for move in moves:
            timeline = move.timeline
            if "أسبوع" in timeline or "week" in timeline.lower():
                # استخراج الأرقام
                numbers = re.findall(r'\d+', timeline)
                if numbers:
                    total_weeks += int(numbers[-1])  # أخذ الرقم الأكبر
            elif "شهر" in timeline or "month" in timeline.lower():
                numbers = re.findall(r'\d+', timeline)
                if numbers:
                    total_weeks += int(numbers[-1]) * 4
        
        if total_weeks < 8:
            return f"{total_weeks} أسابيع"
        else:
            months = total_weeks // 4
            return f"{months} أشهر"
    
    def to_dict(self, roadmap: ActionableRoadmap) -> Dict[str, Any]:
        """تحويل خارطة الطريق إلى قاموس"""
        return {
            "roadmap_id": roadmap.roadmap_id,
            "title": roadmap.title,
            "priority": roadmap.priority,
            "estimated_timeline": roadmap.estimated_timeline,
            "success_metrics": roadmap.success_metrics,
            "tactical_moves": [asdict(move) for move in roadmap.tactical_moves],
            "alternative_paths": roadmap.alternative_paths,
            "risk_mitigation": roadmap.risk_mitigation
        }


# مثال على الاستخدام
if __name__ == "__main__":
    # بيانات تجريبية (من CEO Insights Engine)
    critical_insight = {
        "category": "financial_risk",
        "severity": "high",
        "title": "فجوة تمويلية حرجة تهدد مرحلة التوسع",
        "description": "الميزانية الحالية (150,000 ريال) أقل بنسبة 81% من المتوسط المطلوب...",
        "business_impact": "احتمالية الفشل: 85% | خطر نفاد السيولة: مرتفع جداً",
        "shap_contribution": -0.35,
        "feature_name": "budget",
        "feature_value": 150000
    }
    
    # إنشاء المحرك
    engine = ActionableRoadmapEngine()
    
    # توليد خارطة الطريق
    roadmap = engine.generate_roadmap(
        critical_insight=critical_insight,
        sector="fintech",
        organization="startup",
        current_stage="pre-seed"
    )
    
    # طباعة النتائج
    print("=" * 70)
    print("Actionable Roadmap Engine - Test Output")
    print("=" * 70)
    print(json.dumps(engine.to_dict(roadmap), ensure_ascii=False, indent=2))
