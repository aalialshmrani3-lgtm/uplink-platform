import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in environment variables');
  process.exit(1);
}

async function main() {
  console.log('🚀 Starting UPLINK2 seed data...\n');

  const connection = await mysql.createConnection(DATABASE_URL);

  // Step 1: Get existing user (owner)
  const [users] = await connection.query('SELECT id FROM users LIMIT 1');
  if (users.length === 0) {
    console.error('❌ No users found. Please create a user first.');
    await connection.end();
    process.exit(1);
  }
  const userId = users[0].id;
  console.log(`✅ Using user ID: ${userId}\n`);

  // Step 2: Create 10 IP Registrations (from UPLINK1)
  console.log('📝 Creating 10 IP Registrations...');
  const ipData = [
    { title: 'نظام ذكاء اصطناعي لإدارة النفايات', category: 'environment', score: 85 },
    { title: 'منصة تعليم إلكتروني تفاعلية', category: 'education', score: 78 },
    { title: 'تطبيق صحي لمتابعة الأمراض المزمنة', category: 'health', score: 92 },
    { title: 'نظام طاقة شمسية ذكي للمنازل', category: 'energy', score: 88 },
    { title: 'روبوت زراعي للري الذكي', category: 'agriculture', score: 75 },
    { title: 'منصة تجارة إلكترونية محلية', category: 'ecommerce', score: 65 },
    { title: 'نظام أمن سيبراني متقدم', category: 'security', score: 90 },
    { title: 'تطبيق توصيل طعام صحي', category: 'food', score: 70 },
    { title: 'منصة حجز مواعيد طبية', category: 'health', score: 82 },
    { title: 'نظام إدارة المخزون الذكي', category: 'logistics', score: 77 }
  ];

  const ipRegistrations = [];
  for (const ip of ipData) {
    const saipNumber = `IP-2026-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
    const [result] = await connection.query(
      `INSERT INTO ip_registrations (userId, type, title, description, category, status, saipApplicationNumber, filingDate, createdAt) 
       VALUES (?, 'patent', ?, ?, ?, 'under_review', ?, NOW(), NOW())`,
      [userId, ip.title, `وصف تفصيلي لـ ${ip.title} مع شرح الابتكار والقيمة المضافة.`, ip.category, saipNumber]
    );
    ipRegistrations.push({ id: result.insertId, ...ip });
  }
  console.log(`✅ Created ${ipRegistrations.length} IP Registrations\n`);

  // Step 3: Check if vetting_reviews table exists
  const [tables] = await connection.query("SHOW TABLES LIKE 'vetting_reviews'");
  if (tables.length === 0) {
    console.log('⚠️ vetting_reviews table does not exist. Skipping vetting reviews and decisions.\n');
  } else {
    // Create 30 Vetting Reviews (3 per IP: legal + technical + commercial)
    console.log('👨‍⚖️ Creating 30 Vetting Reviews...');
    const reviewTypes = ['legal', 'technical', 'commercial'];
    let reviewCount = 0;

    for (const ip of ipRegistrations) {
      for (const type of reviewTypes) {
        const score = Math.floor(Math.random() * 30) + 70; // 70-100
        const approved = score >= 75 ? 1 : 0;
        
        await connection.query(
          `INSERT INTO vetting_reviews (ipRegistrationId, reviewerId, reviewType, score, approved, comments, recommendation, revisionSuggestions, createdAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
          [
            ip.id,
            userId,
            type,
            score,
            approved,
            `مراجعة ${type === 'legal' ? 'قانونية' : type === 'technical' ? 'فنية' : 'تجارية'} لـ ${ip.title}. النتيجة: ${score}/100. ${approved ? 'موافق' : 'يحتاج تحسينات'}.`,
            approved ? 'approve' : 'revision',
            approved ? null : `اقتراحات تحسين للجانب ${type === 'legal' ? 'القانوني' : type === 'technical' ? 'الفني' : 'التجاري'}.`
          ]
        );
        reviewCount++;
      }
    }
    console.log(`✅ Created ${reviewCount} Vetting Reviews\n`);

    // Create 10 Vetting Decisions
    console.log('⚖️ Creating 10 Vetting Decisions...');
    for (const ip of ipRegistrations) {
      const avgScore = ip.score;
      let decision, reason;
      
      if (avgScore >= 85) {
        decision = 'approved';
        reason = `تم قبول ${ip.title} بناءً على التقييم الممتاز (${avgScore}/100). المشروع جاهز للانتقال إلى UPLINK3.`;
      } else if (avgScore >= 70) {
        decision = 'approved_with_conditions';
        reason = `تم قبول ${ip.title} مع شروط (${avgScore}/100). يجب تنفيذ التحسينات المقترحة قبل الانتقال.`;
      } else {
        decision = 'revision_required';
        reason = `يحتاج ${ip.title} إلى مراجعة وتحسين (${avgScore}/100). يُرجى معالجة الملاحظات والإعادة.`;
      }

      await connection.query(
        `INSERT INTO vetting_decisions (ipRegistrationId, decision, overallScore, reason, nextSteps, decidedAt, createdAt)
         VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          ip.id,
          decision,
          avgScore,
          reason,
          decision === 'approved' ? 'انتقال إلى UPLINK3 - IP Marketplace' : 'تنفيذ التحسينات المطلوبة'
        ]
      );
    }
    console.log(`✅ Created 10 Vetting Decisions\n`);
  }

  // Step 4: Create 6 Marketplace Assets (for approved IPs)
  console.log('🏪 Creating 6 Marketplace Assets...');
  const approvedIPs = ipRegistrations.filter(ip => ip.score >= 80).slice(0, 6);
  
  for (const ip of approvedIPs) {
    const price = Math.floor(Math.random() * 400000) + 100000; // 100K - 500K SAR
    const listingType = Math.random() > 0.5 ? 'license' : 'full_sale';
    
    await connection.query(
      `INSERT INTO marketplace_assets (ipRegistrationId, ownerId, assetType, title, description, price, currency, status, views, createdAt)
       VALUES (?, ?, 'license', ?, ?, ?, 'SAR', 'active', ?, NOW())`,
      [
        ip.id,
        userId,
        ip.title,
        `عرض ${ip.title} في سوق الملكية الفكرية. تقييم الابتكار: ${ip.score}/100. جاهز للاستثمار.`,
        price,
        Math.floor(Math.random() * 500)
      ]
    );
  }
  console.log(`✅ Created ${approvedIPs.length} Marketplace Assets\n`);

  await connection.end();
  console.log('🎉 UPLINK2 seed data completed successfully!');
}

main().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});
