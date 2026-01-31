"""
UPLINK 5.0 - CEO Insights Engine Testing
اختبار المحرك مع 50 عينة من db_seeder_enhanced.py

Author: Manus AI
Date: 31 يناير 2026
"""

import json
import random
from ceo_insights_engine import CEOInsightsEngine
from typing import List, Dict, Any


def load_seed_data() -> List[Dict]:
    """تحميل البيانات من ideas_outcomes_seed_data.json"""
    try:
        with open("ideas_outcomes_seed_data.json", "r", encoding="utf-8") as f:
            data = json.load(f)
        return data
    except FileNotFoundError:
        print("❌ ملف ideas_outcomes_seed_data.json غير موجود!")
        return []


def simulate_shap_values(features: Dict[str, float], outcome: str) -> Dict[str, float]:
    """
    محاكاة قيم SHAP بناءً على الميزات والنتيجة
    (في الواقع، ستأتي من نموذج SHAP الفعلي)
    """
    shap_values = {}
    
    # Budget impact
    if features["budget"] < 300000:
        shap_values["budget"] = -0.35 if outcome == "failure" else -0.15
    elif features["budget"] < 600000:
        shap_values["budget"] = -0.18 if outcome == "failure" else -0.08
    else:
        shap_values["budget"] = -0.05 if outcome == "failure" else 0.10
    
    # Hypothesis validation impact
    if features["hypothesis_validation_rate"] < 0.3:
        shap_values["hypothesis_validation_rate"] = -0.42 if outcome == "failure" else -0.25
    elif features["hypothesis_validation_rate"] < 0.6:
        shap_values["hypothesis_validation_rate"] = -0.22 if outcome == "failure" else -0.10
    else:
        shap_values["hypothesis_validation_rate"] = -0.08 if outcome == "failure" else 0.15
    
    # RAT completion impact
    if features["rat_completion_rate"] < 0.3:
        shap_values["rat_completion_rate"] = -0.38 if outcome == "failure" else -0.20
    elif features["rat_completion_rate"] < 0.6:
        shap_values["rat_completion_rate"] = -0.20 if outcome == "failure" else -0.08
    else:
        shap_values["rat_completion_rate"] = -0.05 if outcome == "failure" else 0.12
    
    # Market demand impact
    if features["market_demand"] < 30:
        shap_values["market_demand"] = -0.28 if outcome == "failure" else -0.15
    elif features["market_demand"] < 60:
        shap_values["market_demand"] = -0.16 if outcome == "failure" else -0.05
    else:
        shap_values["market_demand"] = -0.03 if outcome == "failure" else 0.18
    
    # Team size impact
    if features["team_size"] < 4:
        shap_values["team_size"] = -0.15 if outcome == "failure" else -0.08
    elif features["team_size"] < 7:
        shap_values["team_size"] = -0.08 if outcome == "failure" else 0.02
    else:
        shap_values["team_size"] = 0.05 if outcome == "failure" else 0.12
    
    return shap_values


def calculate_success_probability(features: Dict[str, float], outcome: str) -> float:
    """حساب احتمالية النجاح (محاكاة)"""
    if outcome == "success":
        return random.uniform(70, 95)
    else:
        # حساب بناءً على الميزات
        score = 0
        score += min(30, features["budget"] / 1000000 * 30)
        score += features["hypothesis_validation_rate"] * 25
        score += features["rat_completion_rate"] * 20
        score += features["market_demand"] / 100 * 15
        score += min(10, features["team_size"] / 10 * 10)
        return max(5, min(95, score))


def test_ceo_insights_engine():
    """اختبار المحرك مع 50 عينة"""
    print("=" * 70)
    print("اختبار CEO Insights Engine مع 50 عينة")
    print("=" * 70)
    
    # تحميل البيانات
    seed_data = load_seed_data()
    if not seed_data:
        print("❌ لا توجد بيانات للاختبار!")
        return
    
    # اختيار 50 عينة عشوائية
    sample_size = min(50, len(seed_data))
    samples = random.sample(seed_data, sample_size)
    
    # إنشاء المحرك
    engine = CEOInsightsEngine()
    
    # إحصائيات
    stats = {
        "total": 0,
        "success": 0,
        "failure": 0,
        "risk_levels": {"critical": 0, "high": 0, "medium": 0, "low": 0},
        "investor_appeal": {"very_low": 0, "low": 0, "medium": 0, "high": 0, "very_high": 0},
        "avg_insights_per_project": 0
    }
    
    results = []
    
    print(f"\n🔄 معالجة {sample_size} عينة...\n")
    
    for idx, sample in enumerate(samples, 1):
        # استخراج الميزات
        feature_values = {
            "budget": sample["budget"],
            "market_demand": sample["market_demand"],
            "team_size": sample["team_size"],
            "hypothesis_validation_rate": sample["hypothesis_validation_rate"],
            "rat_completion_rate": sample["rat_completion_rate"]
        }
        
        # محاكاة قيم SHAP
        shap_values = simulate_shap_values(feature_values, sample["outcome"])
        
        # حساب احتمالية النجاح
        success_prob = calculate_success_probability(feature_values, sample["outcome"])
        
        # توليد الرؤى
        insights = engine.generate_ceo_insights(
            shap_values=shap_values,
            feature_values=feature_values,
            sector=sample["sector"],
            organization=sample["organization"],
            success_probability=success_prob
        )
        
        # تحديث الإحصائيات
        stats["total"] += 1
        stats["success"] += 1 if sample["outcome"] == "success" else 0
        stats["failure"] += 1 if sample["outcome"] == "failure" else 0
        stats["risk_levels"][insights.risk_level] += 1
        stats["investor_appeal"][insights.investor_appeal] += 1
        stats["avg_insights_per_project"] += len(insights.critical_insights)
        
        # حفظ النتيجة
        result = {
            "project_id": idx,
            "project_name": sample["title"],
            "sector": sample["sector"],
            "organization": sample["organization"],
            "actual_outcome": sample["outcome"],
            "predicted_success_prob": success_prob,
            "ceo_insights": engine.to_dict(insights)
        }
        results.append(result)
        
        # طباعة تقدم
        if idx % 10 == 0:
            print(f"✅ معالجة {idx}/{sample_size} عينة...")
    
    # حساب المتوسطات
    stats["avg_insights_per_project"] /= stats["total"]
    
    # طباعة الإحصائيات
    print("\n" + "=" * 70)
    print("📊 إحصائيات الاختبار")
    print("=" * 70)
    print(f"\nإجمالي العينات: {stats['total']}")
    print(f"نجاح: {stats['success']} ({stats['success']/stats['total']*100:.1f}%)")
    print(f"فشل: {stats['failure']} ({stats['failure']/stats['total']*100:.1f}%)")
    
    print(f"\n📈 توزيع مستويات الخطر:")
    for level, count in stats["risk_levels"].items():
        print(f"  {level.upper()}: {count} ({count/stats['total']*100:.1f}%)")
    
    print(f"\n💰 توزيع جاذبية المستثمر:")
    for appeal, count in stats["investor_appeal"].items():
        print(f"  {appeal.upper()}: {count} ({count/stats['total']*100:.1f}%)")
    
    print(f"\n📝 متوسط عدد الرؤى لكل مشروع: {stats['avg_insights_per_project']:.1f}")
    
    # عرض 3 أمثلة
    print("\n" + "=" * 70)
    print("📋 أمثلة من المخرجات")
    print("=" * 70)
    
    for i, result in enumerate(results[:3], 1):
        print(f"\n{'='*70}")
        print(f"مثال {i}: {result['project_name']}")
        print(f"{'='*70}")
        print(f"القطاع: {result['sector']}")
        print(f"المنظمة: {result['organization']}")
        print(f"النتيجة الفعلية: {result['actual_outcome']}")
        print(f"احتمالية النجاح المتوقعة: {result['predicted_success_prob']:.1f}%")
        print(f"\nالملخص التنفيذي:")
        print(f"  {result['ceo_insights']['executive_summary']}")
        print(f"\nمستوى الخطر: {result['ceo_insights']['risk_level'].upper()}")
        print(f"جاذبية المستثمر: {result['ceo_insights']['investor_appeal'].upper()}")
        print(f"\nأهم الرؤى الحرجة:")
        for idx, insight in enumerate(result['ceo_insights']['critical_insights'][:3], 1):
            print(f"\n  {idx}. [{insight['severity'].upper()}] {insight['title']}")
            print(f"     {insight['description'][:150]}...")
            print(f"     التأثير: {insight['business_impact']}")
    
    # حفظ النتائج
    output_file = "ceo_insights_test_results.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump({
            "statistics": stats,
            "results": results
        }, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ تم حفظ النتائج في: {output_file}")
    print("=" * 70)


if __name__ == "__main__":
    test_ceo_insights_engine()
