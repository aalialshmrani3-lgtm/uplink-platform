#!/usr/bin/env python3
"""
Generate synthetic training data for idea success prediction
"""
import json
import random
from datetime import datetime, timedelta

# Sectors
sectors = ["تقنية", "صحة", "تعليم", "طاقة", "نقل", "زراعة", "تجزئة", "مالية"]

# Success factors
success_keywords = ["ذكي", "مبتكر", "فعال", "سريع", "آمن", "مستدام", "شامل", "متقدم"]
failure_keywords = ["معقد", "مكلف", "بطيء", "صعب", "محدود", "قديم"]

def generate_idea(idea_id, is_success):
    """Generate a single idea with realistic features"""
    sector = random.choice(sectors)
    
    # Title generation
    if is_success:
        keyword = random.choice(success_keywords)
        title = f"منصة {keyword} لـ{sector}"
    else:
        keyword = random.choice(failure_keywords)
        title = f"نظام {keyword} لـ{sector}"
    
    # Description length correlates with success
    desc_length = random.randint(100, 300) if is_success else random.randint(30, 100)
    description = f"وصف تفصيلي للفكرة في مجال {sector}. " * (desc_length // 50)
    
    # Budget (successful ideas tend to have moderate budgets)
    if is_success:
        budget = random.randint(50000, 200000)
    else:
        budget = random.choice([random.randint(10000, 40000), random.randint(300000, 500000)])
    
    # Team size (successful ideas have optimal team sizes)
    team_size = random.randint(3, 8) if is_success else random.choice([1, 2, random.randint(15, 30)])
    
    # Timeline (months)
    timeline = random.randint(3, 12) if is_success else random.choice([random.randint(1, 2), random.randint(18, 36)])
    
    # Market demand score (0-100)
    market_demand = random.randint(60, 95) if is_success else random.randint(20, 55)
    
    # Technical feasibility (0-100)
    tech_feasibility = random.randint(65, 95) if is_success else random.randint(30, 60)
    
    # Competitive advantage (0-100)
    competitive_advantage = random.randint(55, 90) if is_success else random.randint(20, 50)
    
    # User engagement (0-100)
    user_engagement = random.randint(60, 90) if is_success else random.randint(15, 55)
    
    # Tags count
    tags_count = random.randint(3, 7) if is_success else random.randint(0, 2)
    
    # Hypothesis validation rate
    hypothesis_rate = random.uniform(0.6, 0.9) if is_success else random.uniform(0.1, 0.5)
    
    # RAT completion rate
    rat_rate = random.uniform(0.7, 1.0) if is_success else random.uniform(0.2, 0.6)
    
    return {
        "id": idea_id,
        "title": title,
        "description": description,
        "sector": sector,
        "budget": budget,
        "team_size": team_size,
        "timeline_months": timeline,
        "market_demand": market_demand,
        "tech_feasibility": tech_feasibility,
        "competitive_advantage": competitive_advantage,
        "user_engagement": user_engagement,
        "tags_count": tags_count,
        "hypothesis_validation_rate": hypothesis_rate,
        "rat_completion_rate": rat_rate,
        "success": 1 if is_success else 0
    }

def main():
    """Generate training dataset"""
    print("🔄 Generating synthetic training data...")
    
    # Generate 150 ideas (60% success, 40% failure - realistic distribution)
    total_ideas = 150
    success_count = int(total_ideas * 0.6)
    failure_count = total_ideas - success_count
    
    ideas = []
    
    # Generate successful ideas
    for i in range(success_count):
        ideas.append(generate_idea(i + 1, is_success=True))
    
    # Generate failed ideas
    for i in range(failure_count):
        ideas.append(generate_idea(success_count + i + 1, is_success=False))
    
    # Shuffle
    random.shuffle(ideas)
    
    # Save to JSON
    output_file = "/home/ubuntu/uplink-platform/ai-services/prediction/training_data.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(ideas, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Generated {total_ideas} ideas:")
    print(f"   - Success: {success_count} ({success_count/total_ideas*100:.1f}%)")
    print(f"   - Failure: {failure_count} ({failure_count/total_ideas*100:.1f}%)")
    print(f"   - Saved to: {output_file}")

if __name__ == "__main__":
    random.seed(42)  # For reproducibility
    main()
