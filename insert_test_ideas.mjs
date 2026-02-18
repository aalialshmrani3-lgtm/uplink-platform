import Database from 'better-sqlite3';

const db = new Database('./uplink.db');

// Get current user ID (assuming first user)
const user = db.prepare('SELECT id FROM user LIMIT 1').get();
const userId = user?.id || 1;

// Insert 3 test ideas with different scores
const ideas = [
  {
    title: 'فكرة اختبار - ابتكار حقيقي',
    titleEn: 'Test Idea - Real Innovation',
    description: 'نظام ذكاء اصطناعي متقدم لتحليل البيانات الضخمة في الوقت الفعلي باستخدام تقنيات التعلم العميق والحوسبة الكمومية',
    descriptionEn: 'Advanced AI system for real-time big data analysis using deep learning and quantum computing',
    category: 'تقنية',
    subCategory: 'ذكاء اصطناعي',
    status: 'approved',
    classification: 'innovation',
    innovationScore: 90,
    commercialScore: 85,
    guidanceScore: 10,
    overallScore: 88,
    noveltyScore: 92,
    impactScore: 88,
    feasibilityScore: 85,
    marketValueScore: 87,
    scalabilityScore: 90,
    sustainabilityScore: 86,
    riskScore: 20,
    timeToMarketScore: 75,
    competitiveAdvantageScore: 91,
    teamReadinessScore: 80
  },
  {
    title: 'فكرة اختبار - حل تجاري',
    titleEn: 'Test Idea - Commercial Solution',
    description: 'تطبيق جوال لتوصيل الطعام الصحي مع نظام توصيات غذائية مخصصة',
    descriptionEn: 'Mobile app for healthy food delivery with personalized nutrition recommendations',
    category: 'أعمال',
    subCategory: 'خدمات',
    status: 'approved',
    classification: 'commercial',
    innovationScore: 45,
    commercialScore: 75,
    guidanceScore: 20,
    overallScore: 60,
    noveltyScore: 50,
    impactScore: 65,
    feasibilityScore: 80,
    marketValueScore: 75,
    scalabilityScore: 70,
    sustainabilityScore: 65,
    riskScore: 40,
    timeToMarketScore: 85,
    competitiveAdvantageScore: 55,
    teamReadinessScore: 70
  },
  {
    title: 'فكرة اختبار - تحتاج تطوير',
    titleEn: 'Test Idea - Needs Development',
    description: 'فكرة بسيطة لتطبيق دردشة عادي بدون ميزات مميزة',
    descriptionEn: 'Simple chat app idea without distinctive features',
    category: 'تقنية',
    subCategory: 'تطبيقات',
    status: 'needs_improvement',
    classification: 'guidance',
    innovationScore: 20,
    commercialScore: 30,
    guidanceScore: 80,
    overallScore: 35,
    noveltyScore: 15,
    impactScore: 25,
    feasibilityScore: 60,
    marketValueScore: 30,
    scalabilityScore: 40,
    sustainabilityScore: 35,
    riskScore: 70,
    timeToMarketScore: 50,
    competitiveAdvantageScore: 20,
    teamReadinessScore: 45
  }
];

const insertStmt = db.prepare(`
  INSERT INTO idea (
    userId, title, titleEn, description, descriptionEn, category, subCategory,
    status, classification, innovationScore, commercialScore, guidanceScore, overallScore,
    noveltyScore, impactScore, feasibilityScore, marketValueScore, scalabilityScore,
    sustainabilityScore, riskScore, timeToMarketScore, competitiveAdvantageScore, teamReadinessScore,
    createdAt, updatedAt
  ) VALUES (
    @userId, @title, @titleEn, @description, @descriptionEn, @category, @subCategory,
    @status, @classification, @innovationScore, @commercialScore, @guidanceScore, @overallScore,
    @noveltyScore, @impactScore, @feasibilityScore, @marketValueScore, @scalabilityScore,
    @sustainabilityScore, @riskScore, @timeToMarketScore, @competitiveAdvantageScore, @teamReadinessScore,
    datetime('now'), datetime('now')
  )
`);

ideas.forEach(idea => {
  try {
    const result = insertStmt.run({ userId, ...idea });
    console.log(`✅ Inserted idea: ${idea.title} (ID: ${result.lastInsertRowid})`);
  } catch (err) {
    console.error(`❌ Failed to insert ${idea.title}:`, err.message);
  }
});

db.close();
console.log('\n✅ Done! 3 test ideas inserted.');
