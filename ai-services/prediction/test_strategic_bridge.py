"""
اختبار Strategic Bridge Protocol مع 50 عينة من db_seeder_enhanced.py
"""

import json
from strategic_bridge_protocol import StrategicBridgeProtocol

# قراءة البيانات
with open("ideas_outcomes_seed_data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# أخذ 50 عينة
samples = data[:50]

# إنشاء البروتوكول
protocol = StrategicBridgeProtocol()

# نتائج الاختبار
results = []
ici_scores = []
irl_scores = []
success_probs = []

print("🚀 بدء الاختبار الشامل مع 50 عينة...")
print("=" * 70)

for i, sample in enumerate(samples, 1):
    print(f"\n[{i}/50] معالجة: {sample.get('title', 'Unknown')[:50]}...")
    
    try:
        # تحليل المشروع
        result = protocol.analyze_project(sample)
        
        # استخراج المؤشرات
        ici_score = result.strategic_dashboard.get("ici", {}).get("ici_score", 0)
        irl_score = result.investor_readiness.get("irl_score", 0)
        success_prob = sample.get("success_probability", 50)
        
        ici_scores.append(ici_score)
        irl_scores.append(irl_score)
        success_probs.append(success_prob)
        
        results.append({
            "id": sample.get("id"),
            "title": sample.get("title"),
            "ici_score": ici_score,
            "irl_score": irl_score,
            "success_probability": success_prob,
            "risk_level": result.ceo_insights.get("risk_level"),
            "key_recommendations": result.key_recommendations[:3]
        })
        
        print(f"  ✅ ICI: {ici_score:.1f} | IRL: {irl_score:.1f} | Success: {success_prob:.0f}%")
        
    except Exception as e:
        print(f"  ❌ خطأ: {str(e)}")
        continue

print("\n" + "=" * 70)
print("📊 ملخص النتائج:")
print("=" * 70)

# الإحصائيات
print(f"\n✅ **إجمالي العينات المعالجة:** {len(results)}/50")
print(f"\n📈 **مؤشر الثقة في الابتكار (ICI):**")
print(f"  - المتوسط: {sum(ici_scores)/len(ici_scores):.1f}/100")
print(f"  - الأدنى: {min(ici_scores):.1f}/100")
print(f"  - الأعلى: {max(ici_scores):.1f}/100")

print(f"\n💰 **جاهزية المستثمر (IRL):**")
print(f"  - المتوسط: {sum(irl_scores)/len(irl_scores):.1f}/100")
print(f"  - الأدنى: {min(irl_scores):.1f}/100")
print(f"  - الأعلى: {max(irl_scores):.1f}/100")

print(f"\n🎯 **احتمالية النجاح:**")
print(f"  - المتوسط: {sum(success_probs)/len(success_probs):.1f}%")
print(f"  - الأدنى: {min(success_probs):.1f}%")
print(f"  - الأعلى: {max(success_probs):.1f}%")

# توزيع مستويات الخطر
risk_levels = [r.get("risk_level") for r in results]
risk_distribution = {
    "critical": risk_levels.count("critical"),
    "high": risk_levels.count("high"),
    "medium": risk_levels.count("medium"),
    "low": risk_levels.count("low")
}

print(f"\n⚠️ **توزيع مستويات الخطر:**")
for level, count in risk_distribution.items():
    percentage = (count / len(results)) * 100
    print(f"  - {level.upper()}: {count} ({percentage:.1f}%)")

# حفظ النتائج
with open("strategic_bridge_test_results.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print(f"\n✅ تم حفظ النتائج في: strategic_bridge_test_results.json")
print("=" * 70)
