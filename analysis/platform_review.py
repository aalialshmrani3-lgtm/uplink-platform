#!/usr/bin/env python3
"""
UPLINK 5.0 Platform Analysis Script
Analyzes the platform using Grok and Gemini AI models
"""

import os
import json
import requests
from datetime import datetime
import time

# Platform Description for Analysis
PLATFORM_DESCRIPTION = """
# UPLINK 5.0 - منصة الابتكار الوطنية السعودية

## نظرة عامة
UPLINK 5.0 هي منصة ابتكار وطنية متكاملة تحت مظلة HUMAIN، تهدف إلى ربط المبتكرين السعوديين بالمستثمرين والشركات والجهات الحكومية.

## المحركات الأساسية

### UPLINK1 - توليد الملكية الفكرية
- تسجيل براءات الاختراع والعلامات التجارية وحقوق النشر
- توثيق البلوكتشين للملكيات الفكرية
- تكامل مع SAIP (الهيئة السعودية للملكية الفكرية)
- تكامل مع WIPO (المنظمة العالمية للملكية الفكرية)

### UPLINK2 - التحديات والمطابقة
- نظام تحديات ومسابقات للابتكار
- مطابقة المبتكرين مع الفرص المناسبة
- جوائز وتمويل للفائزين

### UPLINK3 - السوق والتبادل
- سوق الابتكارات (Marketplace)
- بحث متقدم وفلاتر متعددة (الفئة، المرحلة، التمويل، التقييم)
- عرض المشاريع للمستثمرين
- نظام الإعجاب والمتابعة

### UPLINK4 - العقود الذكية
- إدارة العقود بين الأطراف
- نظام ضمان (Escrow) لحماية المعاملات
- تتبع مراحل العقود والمدفوعات
- حماية البلوكتشين

## نظام التقييم بالذكاء الاصطناعي
- تقييم متعدد المعايير (الابتكار، السوق، الجدوى التقنية، الفريق، الملكية الفكرية، قابلية التوسع)
- تصنيف ثلاثي:
  * ابتكار (80%+): مشاريع ذات إمكانات عالية
  * تجاري (60-79%): مشاريع قابلة للتسويق
  * إرشاد (<60%): تحتاج تطوير إضافي
- تحليل نقاط القوة والضعف
- توصيات مخصصة
- تحليل السوق والمخاطر

## الأكاديمية
- دورات تدريبية معتمدة
- شركاء أكاديميون (KAUST, SAIP, SDAIA, Monshaat, MCIT, KACST)
- نظام تقييم ومراجعة الدورات
- قسم الأسئلة الشائعة (FAQ)
- مسارات تعلم متكاملة
- شهادات معتمدة

## برنامج النخبة (Elite)
- مستويات العضوية: بلاتيني، ذهبي، فضي
- مزايا حصرية لكل مستوى
- أولوية في التمويل والدعم
- شبكة حصرية من المبتكرين

## بوابة المطورين
- توثيق API كامل
- SDKs متعددة (Python, JavaScript, REST, GraphQL)
- نقاط نهاية موثقة
- حدود استخدام واضحة

## التقنيات المستخدمة
- Frontend: React 19, Tailwind CSS 4, TypeScript
- Backend: Express.js, tRPC
- Database: MySQL/TiDB with Drizzle ORM
- Authentication: OAuth 2.0 (Manus Auth)
- AI: LLM Integration for evaluation

## الميزات الإضافية
- تصميم عربي RTL احترافي
- لوحة تحكم شاملة
- نظام إشعارات
- دعم متعدد الأدوار (مبتكر، مستثمر، شركة، جهة حكومية)
"""

ANALYSIS_PROMPT = """
أنت خبير في تحليل منصات الابتكار والتقنية. قم بتحليل منصة UPLINK 5.0 التالية وقدم ملاحظات شاملة ودقيقة.

{platform_description}

## المطلوب:
1. **تحليل نقاط القوة**: ما هي أبرز نقاط القوة في المنصة؟
2. **تحليل نقاط الضعف**: ما هي الجوانب التي تحتاج تحسين؟
3. **الفرص**: ما هي الفرص المتاحة للتوسع والتطوير؟
4. **التهديدات**: ما هي المخاطر والتحديات المحتملة؟
5. **مقارنة مع المنصات العالمية**: كيف تقارن مع Innovation 360 و IdeaScale و Brightidea؟
6. **توصيات التحسين**: ما هي التوصيات الملموسة للتحسين؟
7. **تقييم عام**: تقييم شامل من 100

قدم تحليلاً مفصلاً ومهنياً باللغة العربية.
"""

def analyze_with_grok():
    """Analyze platform using Grok API"""
    api_key = os.environ.get("XAI_API_KEY")
    if not api_key:
        return {"error": "XAI_API_KEY not found"}
    
    print(f"Using Grok API key: {api_key[:10]}...")
    
    try:
        response = requests.post(
            "https://api.x.ai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            },
            json={
                "model": "grok-3-latest",
                "messages": [
                    {
                        "role": "system",
                        "content": "أنت خبير في تحليل منصات الابتكار والتقنية. قدم تحليلات مفصلة ومهنية."
                    },
                    {
                        "role": "user",
                        "content": ANALYSIS_PROMPT.format(platform_description=PLATFORM_DESCRIPTION)
                    }
                ],
                "temperature": 0.7,
                "max_tokens": 4000
            },
            timeout=180
        )
        
        print(f"Grok response status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            return {
                "source": "Grok",
                "analysis": result["choices"][0]["message"]["content"],
                "model": "grok-3-latest",
                "timestamp": datetime.now().isoformat()
            }
        else:
            return {"error": f"Grok API error: {response.status_code}", "details": response.text[:500]}
    
    except Exception as e:
        return {"error": f"Grok request failed: {str(e)}"}

def analyze_with_gemini():
    """Analyze platform using Gemini API"""
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return {"error": "GEMINI_API_KEY not found"}
    
    print(f"Using Gemini API key: {api_key[:10]}...")
    
    # Wait a bit to avoid rate limiting
    time.sleep(2)
    
    try:
        response = requests.post(
            f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}",
            headers={
                "Content-Type": "application/json"
            },
            json={
                "contents": [
                    {
                        "parts": [
                            {
                                "text": ANALYSIS_PROMPT.format(platform_description=PLATFORM_DESCRIPTION)
                            }
                        ]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.7,
                    "maxOutputTokens": 4000
                }
            },
            timeout=180
        )
        
        print(f"Gemini response status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            content = result.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
            return {
                "source": "Gemini",
                "analysis": content,
                "model": "gemini-2.0-flash",
                "timestamp": datetime.now().isoformat()
            }
        elif response.status_code == 429:
            # Rate limited, wait and retry
            print("Rate limited, waiting 30 seconds...")
            time.sleep(30)
            return analyze_with_gemini()
        else:
            return {"error": f"Gemini API error: {response.status_code}", "details": response.text[:500]}
    
    except Exception as e:
        return {"error": f"Gemini request failed: {str(e)}"}

def main():
    print("=" * 80)
    print("UPLINK 5.0 Platform Analysis")
    print("=" * 80)
    print()
    
    # Analyze with Grok
    print("Analyzing with Grok...")
    grok_result = analyze_with_grok()
    
    # Wait between API calls
    time.sleep(5)
    
    # Analyze with Gemini
    print("\nAnalyzing with Gemini...")
    gemini_result = analyze_with_gemini()
    
    # Save results
    results = {
        "platform": "UPLINK 5.0",
        "analysis_date": datetime.now().isoformat(),
        "grok_analysis": grok_result,
        "gemini_analysis": gemini_result
    }
    
    # Save to JSON
    with open("/home/ubuntu/uplink-platform/analysis/results.json", "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    
    # Print results
    print("\n" + "=" * 80)
    print("GROK ANALYSIS")
    print("=" * 80)
    if "error" in grok_result:
        print(f"Error: {grok_result.get('error')}")
        if "details" in grok_result:
            print(f"Details: {grok_result.get('details')}")
    else:
        print(grok_result.get("analysis", "No analysis available"))
    
    print("\n" + "=" * 80)
    print("GEMINI ANALYSIS")
    print("=" * 80)
    if "error" in gemini_result:
        print(f"Error: {gemini_result.get('error')}")
        if "details" in gemini_result:
            print(f"Details: {gemini_result.get('details')}")
    else:
        print(gemini_result.get("analysis", "No analysis available"))
    
    print("\n" + "=" * 80)
    print("Analysis complete. Results saved to /home/ubuntu/uplink-platform/analysis/results.json")
    print("=" * 80)
    
    return results

if __name__ == "__main__":
    main()
