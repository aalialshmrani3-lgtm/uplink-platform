#!/usr/bin/env python3
"""
UPLINK 5.0 - Database Seeder for ideas_outcomes
Generates 500 semi-realistic Saudi market project samples
Reflects NEOM, Vision 2030, PIF initiatives, and real-world scenarios
"""

import random
import json
from datetime import datetime, timedelta
from typing import List, Dict, Any
import os
import sys

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from database_connector import DatabaseConnector
    DB_AVAILABLE = True
except ImportError:
    DB_AVAILABLE = False
    print("Warning: database_connector not available. Will generate JSON file only.")


# ============================================================================
# SAUDI MARKET DATA - Real-world inspired scenarios
# ============================================================================

SAUDI_SECTORS = [
    "الطاقة المتجددة",  # Renewable Energy
    "التقنية والذكاء الاصطناعي",  # AI & Tech
    "السياحة والترفيه",  # Tourism & Entertainment
    "الصحة الرقمية",  # Digital Health
    "التعليم الإلكتروني",  # E-Learning
    "الزراعة الذكية",  # Smart Agriculture
    "اللوجستيات والنقل",  # Logistics & Transport
    "الصناعة 4.0",  # Industry 4.0
    "الخدمات المالية",  # FinTech
    "العقارات والإنشاءات",  # Real Estate & Construction
]

# NEOM-inspired projects
NEOM_PROJECTS = [
    {
        "title": "مدينة ذكية مستدامة في نيوم",
        "description": "تطوير مدينة ذكية متكاملة تعتمد على الطاقة المتجددة 100% مع أنظمة نقل ذكية وبنية تحتية رقمية متقدمة",
        "sector": "الطاقة المتجددة",
        "budget_range": (500000, 2000000),
        "success_prob": 0.75
    },
    {
        "title": "نظام نقل جوي ذاتي القيادة",
        "description": "تطوير شبكة طائرات بدون طيار للنقل الجوي داخل المدن الذكية مع أنظمة ملاحة متقدمة",
        "sector": "اللوجستيات والنقل",
        "budget_range": (800000, 3000000),
        "success_prob": 0.65
    },
    {
        "title": "مركز أبحاث الذكاء الاصطناعي",
        "description": "إنشاء مركز بحثي متخصص في تطوير حلول الذكاء الاصطناعي للمدن الذكية والصناعات المستقبلية",
        "sector": "التقنية والذكاء الاصطناعي",
        "budget_range": (1000000, 5000000),
        "success_prob": 0.80
    },
]

# Vision 2030 initiatives
VISION_2030_PROJECTS = [
    {
        "title": "منصة تعليم إلكتروني للمهارات المستقبلية",
        "description": "منصة تعليمية تفاعلية تركز على تطوير مهارات البرمجة والذكاء الاصطناعي والتحليل البياني",
        "sector": "التعليم الإلكتروني",
        "budget_range": (150000, 500000),
        "success_prob": 0.70
    },
    {
        "title": "نظام صحي رقمي متكامل",
        "description": "منصة صحية رقمية تربط المرضى بالأطباء مع سجلات طبية إلكترونية وتشخيص بالذكاء الاصطناعي",
        "sector": "الصحة الرقمية",
        "budget_range": (300000, 1000000),
        "success_prob": 0.68
    },
    {
        "title": "منصة سياحية ذكية",
        "description": "تطبيق سياحي يستخدم الواقع المعزز لتقديم تجارب سياحية تفاعلية في المواقع التاريخية السعودية",
        "sector": "السياحة والترفيه",
        "budget_range": (200000, 700000),
        "success_prob": 0.72
    },
]

# PIF-backed projects
PIF_PROJECTS = [
    {
        "title": "مصنع ذكي للسيارات الكهربائية",
        "description": "إنشاء مصنع متطور لإنتاج السيارات الكهربائية بتقنيات الصناعة 4.0 والأتمتة الكاملة",
        "sector": "الصناعة 4.0",
        "budget_range": (2000000, 10000000),
        "success_prob": 0.78
    },
    {
        "title": "منصة تمويل رقمية للمشاريع الصغيرة",
        "description": "منصة fintech تربط المستثمرين بأصحاب المشاريع الصغيرة مع تقييم ذكي للمخاطر",
        "sector": "الخدمات المالية",
        "budget_range": (400000, 1500000),
        "success_prob": 0.65
    },
    {
        "title": "مزارع عمودية ذكية",
        "description": "تطوير مزارع عمودية داخلية تستخدم الذكاء الاصطناعي لتحسين الإنتاج الزراعي في المناطق الصحراوية",
        "sector": "الزراعة الذكية",
        "budget_range": (600000, 2000000),
        "success_prob": 0.70
    },
]

# Common failure scenarios
FAILURE_SCENARIOS = [
    {
        "title": "تطبيق توصيل طعام تقليدي",
        "description": "تطبيق توصيل طعام بدون ميزات تنافسية في سوق مشبع",
        "sector": "اللوجستيات والنقل",
        "budget_range": (50000, 150000),
        "success_prob": 0.25,
        "failure_reason": "سوق مشبع - لا توجد ميزة تنافسية واضحة"
    },
    {
        "title": "متجر إلكتروني عام",
        "description": "متجر إلكتروني عام بدون تخصص أو استراتيجية تسويق واضحة",
        "sector": "الخدمات المالية",
        "budget_range": (30000, 100000),
        "success_prob": 0.20,
        "failure_reason": "عدم وجود تمايز - ميزانية تسويق غير كافية"
    },
    {
        "title": "تطبيق شبكات اجتماعية محلي",
        "description": "تطبيق شبكات اجتماعية يستهدف السوق السعودي فقط بدون ميزات فريدة",
        "sector": "التقنية والذكاء الاصطناعي",
        "budget_range": (100000, 300000),
        "success_prob": 0.15,
        "failure_reason": "منافسة شديدة من عمالقة التقنية - صعوبة اكتساب المستخدمين"
    },
]

# Moderate success scenarios
MODERATE_PROJECTS = [
    {
        "title": "نظام إدارة مخزون للمطاعم",
        "description": "نظام سحابي لإدارة المخزون والطلبات للمطاعم الصغيرة والمتوسطة",
        "sector": "التقنية والذكاء الاصطناعي",
        "budget_range": (80000, 250000),
        "success_prob": 0.55
    },
    {
        "title": "منصة تدريب مهني عن بُعد",
        "description": "منصة تقدم دورات تدريبية مهنية معتمدة في مجالات متنوعة",
        "sector": "التعليم الإلكتروني",
        "budget_range": (120000, 400000),
        "success_prob": 0.50
    },
    {
        "title": "تطبيق حجز مواعيد طبية",
        "description": "تطبيق يربط المرضى بالعيادات الخاصة لحجز المواعيد الطبية",
        "sector": "الصحة الرقمية",
        "budget_range": (100000, 350000),
        "success_prob": 0.52
    },
]


# ============================================================================
# FEATURE GENERATION FUNCTIONS
# ============================================================================

def generate_realistic_features(
    budget: float,
    success_prob: float,
    sector: str
) -> Dict[str, Any]:
    """Generate realistic feature values based on budget and success probability"""
    
    # Team size correlates with budget and success
    if budget < 100000:
        team_size = random.randint(2, 5)
    elif budget < 500000:
        team_size = random.randint(4, 10)
    elif budget < 2000000:
        team_size = random.randint(8, 20)
    else:
        team_size = random.randint(15, 50)
    
    # Timeline correlates with budget
    if budget < 100000:
        timeline_months = random.randint(3, 8)
    elif budget < 500000:
        timeline_months = random.randint(6, 15)
    elif budget < 2000000:
        timeline_months = random.randint(12, 24)
    else:
        timeline_months = random.randint(18, 36)
    
    # Success-correlated features (with realistic noise)
    base_quality = success_prob * 100
    noise = random.uniform(-10, 10)
    
    market_demand = max(10, min(100, int(base_quality + noise + random.uniform(-5, 5))))
    technical_feasibility = max(10, min(100, int(base_quality + noise + random.uniform(-5, 5))))
    competitive_advantage = max(10, min(100, int(base_quality + noise + random.uniform(-10, 10))))
    user_engagement = max(10, min(100, int(base_quality + noise + random.uniform(-8, 8))))
    
    # Hypothesis validation and RAT completion (higher for successful projects)
    hypothesis_validation_rate = max(0.0, min(1.0, success_prob + random.uniform(-0.15, 0.15)))
    rat_completion_rate = max(0.0, min(1.0, success_prob + random.uniform(-0.20, 0.20)))
    
    # Tags count (more tags for well-researched projects)
    tags_count = random.randint(3, 12) if success_prob > 0.5 else random.randint(1, 6)
    
    return {
        "budget": budget,
        "team_size": team_size,
        "timeline_months": timeline_months,
        "market_demand": market_demand,
        "technical_feasibility": technical_feasibility,
        "competitive_advantage": competitive_advantage,
        "user_engagement": user_engagement,
        "tags_count": tags_count,
        "hypothesis_validation_rate": round(hypothesis_validation_rate, 2),
        "rat_completion_rate": round(rat_completion_rate, 2),
    }


def generate_success_metrics(success: bool, sector: str) -> Dict[str, Any]:
    """Generate realistic success metrics"""
    if success:
        return {
            "revenue_growth": f"{random.randint(50, 300)}%",
            "user_count": random.randint(1000, 100000),
            "market_share": f"{random.randint(5, 40)}%",
            "roi": f"{random.randint(120, 500)}%",
            "customer_satisfaction": f"{random.randint(75, 95)}%",
        }
    else:
        return {
            "revenue_growth": f"{random.randint(-50, 20)}%",
            "user_count": random.randint(10, 500),
            "market_share": f"{random.randint(0, 5)}%",
            "roi": f"{random.randint(-80, 50)}%",
            "customer_satisfaction": f"{random.randint(30, 60)}%",
        }


def generate_outcome_date() -> datetime:
    """Generate random outcome date within last 2 years"""
    days_ago = random.randint(30, 730)  # 1 month to 2 years
    return datetime.now() - timedelta(days=days_ago)


# ============================================================================
# SEEDING FUNCTIONS
# ============================================================================

def generate_samples(count: int = 500) -> List[Dict[str, Any]]:
    """Generate semi-realistic Saudi market samples"""
    samples = []
    
    # Calculate distribution
    neom_count = int(count * 0.15)  # 15% NEOM projects (high success rate)
    vision_count = int(count * 0.25)  # 25% Vision 2030 projects (good success rate)
    pif_count = int(count * 0.20)  # 20% PIF projects (good success rate)
    failure_count = int(count * 0.20)  # 20% failure scenarios
    moderate_count = count - neom_count - vision_count - pif_count - failure_count  # 20% moderate
    
    print(f"Generating {count} samples:")
    print(f"  - NEOM projects: {neom_count}")
    print(f"  - Vision 2030 projects: {vision_count}")
    print(f"  - PIF projects: {pif_count}")
    print(f"  - Failure scenarios: {failure_count}")
    print(f"  - Moderate projects: {moderate_count}")
    
    # Generate NEOM projects
    for i in range(neom_count):
        template = random.choice(NEOM_PROJECTS)
        budget = random.uniform(*template["budget_range"])
        success_prob = template["success_prob"] + random.uniform(-0.10, 0.10)
        success = random.random() < success_prob
        
        features = generate_realistic_features(budget, success_prob, template["sector"])
        
        sample = {
            "idea_id": len(samples) + 1,
            "title": template["title"] + f" - نسخة {i+1}",
            "description": template["description"],
            "sector": template["sector"],
            **features,
            "success": success,
            "outcome_date": generate_outcome_date(),
            "failure_reason": None if success else "تحديات تقنية غير متوقعة",
            "success_metrics": generate_success_metrics(success, template["sector"]),
            "organization_id": random.choice([1, 2, 3, 4, 5]),  # NEOM, KAUST, etc.
        }
        samples.append(sample)
    
    # Generate Vision 2030 projects
    for i in range(vision_count):
        template = random.choice(VISION_2030_PROJECTS)
        budget = random.uniform(*template["budget_range"])
        success_prob = template["success_prob"] + random.uniform(-0.15, 0.15)
        success = random.random() < success_prob
        
        features = generate_realistic_features(budget, success_prob, template["sector"])
        
        sample = {
            "idea_id": len(samples) + 1,
            "title": template["title"] + f" - مبادرة {i+1}",
            "description": template["description"],
            "sector": template["sector"],
            **features,
            "success": success,
            "outcome_date": generate_outcome_date(),
            "failure_reason": None if success else random.choice([
                "تمويل غير كافٍ",
                "صعوبة اكتساب المستخدمين",
                "منافسة شديدة"
            ]),
            "success_metrics": generate_success_metrics(success, template["sector"]),
            "organization_id": random.choice([6, 7, 8, 9, 10]),  # Universities, etc.
        }
        samples.append(sample)
    
    # Generate PIF projects
    for i in range(pif_count):
        template = random.choice(PIF_PROJECTS)
        budget = random.uniform(*template["budget_range"])
        success_prob = template["success_prob"] + random.uniform(-0.12, 0.12)
        success = random.random() < success_prob
        
        features = generate_realistic_features(budget, success_prob, template["sector"])
        
        sample = {
            "idea_id": len(samples) + 1,
            "title": template["title"] + f" - مشروع {i+1}",
            "description": template["description"],
            "sector": template["sector"],
            **features,
            "success": success,
            "outcome_date": generate_outcome_date(),
            "failure_reason": None if success else "تأخيرات في التنفيذ - تحديات لوجستية",
            "success_metrics": generate_success_metrics(success, template["sector"]),
            "organization_id": random.choice([11, 12, 13]),  # PIF, Aramco, SABIC
        }
        samples.append(sample)
    
    # Generate failure scenarios
    for i in range(failure_count):
        template = random.choice(FAILURE_SCENARIOS)
        budget = random.uniform(*template["budget_range"])
        success_prob = template["success_prob"]
        success = random.random() < success_prob  # Mostly failures
        
        features = generate_realistic_features(budget, success_prob, template["sector"])
        
        sample = {
            "idea_id": len(samples) + 1,
            "title": template["title"] + f" - محاولة {i+1}",
            "description": template["description"],
            "sector": template["sector"],
            **features,
            "success": success,
            "outcome_date": generate_outcome_date(),
            "failure_reason": template.get("failure_reason") if not success else None,
            "success_metrics": generate_success_metrics(success, template["sector"]),
            "organization_id": random.choice([14, 15, 16, 17]),  # Smaller organizations
        }
        samples.append(sample)
    
    # Generate moderate projects
    for i in range(moderate_count):
        template = random.choice(MODERATE_PROJECTS)
        budget = random.uniform(*template["budget_range"])
        success_prob = template["success_prob"] + random.uniform(-0.20, 0.20)
        success = random.random() < success_prob
        
        features = generate_realistic_features(budget, success_prob, template["sector"])
        
        sample = {
            "idea_id": len(samples) + 1,
            "title": template["title"] + f" - نسخة {i+1}",
            "description": template["description"],
            "sector": template["sector"],
            **features,
            "success": success,
            "outcome_date": generate_outcome_date(),
            "failure_reason": None if success else random.choice([
                "نقص في الخبرة التقنية",
                "ميزانية تسويق غير كافية",
                "تغيرات في السوق",
                "مشاكل في الفريق"
            ]),
            "success_metrics": generate_success_metrics(success, template["sector"]),
            "organization_id": random.choice(range(1, 32)),  # All organizations
        }
        samples.append(sample)
    
    # Shuffle to mix project types
    random.shuffle(samples)
    
    # Reassign idea_ids after shuffling
    for i, sample in enumerate(samples):
        sample["idea_id"] = i + 1
    
    return samples


def seed_database(samples: List[Dict[str, Any]], db_type: str = "postgresql"):
    """Seed database with generated samples"""
    if not DB_AVAILABLE:
        print("Error: database_connector not available. Cannot seed database.")
        return False
    
    try:
        connector = DatabaseConnector(db_type=db_type)
        
        print(f"\nSeeding {db_type} database with {len(samples)} samples...")
        
        for i, sample in enumerate(samples):
            # Convert success_metrics to JSON string
            sample["success_metrics"] = json.dumps(sample["success_metrics"])
            
            # Insert into database
            connector.insert_idea_outcome(sample)
            
            if (i + 1) % 50 == 0:
                print(f"  Inserted {i + 1}/{len(samples)} samples...")
        
        print(f"✅ Successfully seeded {len(samples)} samples into {db_type} database!")
        return True
    
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        return False


def save_to_json(samples: List[Dict[str, Any]], filename: str = "seed_data.json"):
    """Save samples to JSON file as backup"""
    try:
        # Convert datetime objects to strings
        for sample in samples:
            if isinstance(sample.get("outcome_date"), datetime):
                sample["outcome_date"] = sample["outcome_date"].isoformat()
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(samples, f, ensure_ascii=False, indent=2)
        
        print(f"✅ Saved {len(samples)} samples to {filename}")
        return True
    
    except Exception as e:
        print(f"❌ Error saving to JSON: {e}")
        return False


# ============================================================================
# MAIN
# ============================================================================

def main():
    """Main seeding function"""
    print("=" * 70)
    print("UPLINK 5.0 - Database Seeder")
    print("Generating semi-realistic Saudi market project samples")
    print("=" * 70)
    
    # Generate samples
    samples = generate_samples(count=500)
    
    # Calculate statistics
    success_count = sum(1 for s in samples if s["success"])
    failure_count = len(samples) - success_count
    success_rate = (success_count / len(samples)) * 100
    
    print(f"\n📊 Generated Statistics:")
    print(f"  Total samples: {len(samples)}")
    print(f"  Successful projects: {success_count} ({success_rate:.1f}%)")
    print(f"  Failed projects: {failure_count} ({100-success_rate:.1f}%)")
    print(f"  Average budget: ${sum(s['budget'] for s in samples) / len(samples):,.0f}")
    print(f"  Sectors covered: {len(set(s['sector'] for s in samples))}")
    
    # Save to JSON (always)
    save_to_json(samples, "seed_data.json")
    
    # Seed database (if available)
    if DB_AVAILABLE:
        db_type = os.getenv("DB_TYPE", "postgresql").lower()
        print(f"\n🗄️  Database type: {db_type}")
        
        user_input = input(f"\nSeed {db_type} database? (y/n): ").strip().lower()
        if user_input == 'y':
            seed_database(samples, db_type=db_type)
        else:
            print("Skipped database seeding.")
    else:
        print("\n⚠️  Database connector not available. Samples saved to JSON only.")
    
    print("\n✅ Seeding complete!")
    print(f"📁 Data saved to: seed_data.json")
    print(f"📊 Ready for model training with {len(samples)} samples")


if __name__ == "__main__":
    main()
