import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '../drizzle/schema.js';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL is not set');
  process.exit(1);
}

async function seed() {
  console.log('🌱 Starting seed...');
  
  const connection = await mysql.createConnection(DATABASE_URL);
  const db = drizzle(connection, { schema, mode: 'default' });

  // 1. Create test users
  console.log('Creating users...');
  const users = [
    {
      openId: 'test-innovator-1',
      name: 'أحمد المبتكر',
      email: 'ahmed@example.com',
      role: 'innovator',
      organizationName: null,
      country: 'Saudi Arabia',
      city: 'Riyadh',
    },
    {
      openId: 'test-investor-1',
      name: 'سارة المستثمرة',
      email: 'sara@example.com',
      role: 'investor',
      organizationName: 'شركة الاستثمار الوطنية',
      country: 'Saudi Arabia',
      city: 'Jeddah',
    },
    {
      openId: 'test-company-1',
      name: 'شركة التقنية المتقدمة',
      email: 'tech@example.com',
      role: 'company',
      organizationName: 'شركة التقنية المتقدمة',
      organizationType: 'private_sector',
      country: 'Saudi Arabia',
      city: 'Riyadh',
    },
    {
      openId: 'test-government-1',
      name: 'وزارة الابتكار',
      email: 'innovation@gov.sa',
      role: 'government',
      organizationName: 'وزارة الابتكار والتقنية',
      organizationType: 'government',
      country: 'Saudi Arabia',
      city: 'Riyadh',
    },
  ];

  const insertedUsers = [];
  for (const user of users) {
    const result = await db.insert(schema.users).values(user);
    insertedUsers.push({ ...user, id: result[0].insertId });
    console.log(`✓ Created user: ${user.name}`);
  }

  // 2. Create test ideas
  console.log('\nCreating ideas...');
  const ideas = [
    {
      userId: insertedUsers[0].id,
      title: 'منصة ذكية لإدارة النفايات',
      description: 'منصة تستخدم الذكاء الاصطناعي لتحسين إدارة النفايات في المدن الذكية',
      category: 'environment',
      status: 'analyzed',
      tags: JSON.stringify(['AI', 'Smart Cities', 'Environment']),
    },
    {
      userId: insertedUsers[0].id,
      title: 'تطبيق للتعليم الإلكتروني التفاعلي',
      description: 'تطبيق يستخدم الواقع المعزز لتحسين تجربة التعلم للطلاب',
      category: 'education',
      status: 'analyzed',
      tags: JSON.stringify(['Education', 'AR', 'EdTech']),
    },
    {
      userId: insertedUsers[0].id,
      title: 'نظام ذكي للرعاية الصحية عن بعد',
      description: 'نظام يربط المرضى بالأطباء عبر الإنترنت مع مراقبة صحية ذكية',
      category: 'health',
      status: 'transferred_to_uplink2',
      tags: JSON.stringify(['Healthcare', 'Telemedicine', 'AI']),
    },
  ];

  const insertedIdeas = [];
  for (const idea of ideas) {
    const result = await db.insert(schema.ideas).values(idea);
    insertedIdeas.push({ ...idea, id: result[0].insertId });
    console.log(`✓ Created idea: ${idea.title}`);
  }

  // 3. Create idea analyses
  console.log('\nCreating idea analyses...');
  const analyses = [
    {
      ideaId: insertedIdeas[0].id,
      innovationScore: 85,
      marketScore: 78,
      feasibilityScore: 82,
      socialImpactScore: 90,
      overallScore: 84,
      classification: 'innovation',
      strengths: JSON.stringify(['استخدام AI متقدم', 'حل مشكلة بيئية حقيقية', 'قابل للتطبيق']),
      weaknesses: JSON.stringify(['يحتاج استثمار كبير', 'منافسة عالية']),
      opportunities: JSON.stringify(['دعم حكومي', 'طلب متزايد']),
      threats: JSON.stringify(['تغير التشريعات', 'منافسون دوليون']),
      recommendations: JSON.stringify(['البحث عن شريك تقني', 'بناء نموذج أولي']),
      summary: 'فكرة مبتكرة ذات إمكانات عالية في مجال البيئة والمدن الذكية',
    },
    {
      ideaId: insertedIdeas[1].id,
      innovationScore: 75,
      marketScore: 88,
      feasibilityScore: 85,
      socialImpactScore: 92,
      overallScore: 85,
      classification: 'innovation',
      strengths: JSON.stringify(['سوق كبير', 'تأثير اجتماعي عالي', 'تقنية متاحة']),
      weaknesses: JSON.stringify(['منافسة شديدة', 'يحتاج محتوى تعليمي']),
      opportunities: JSON.stringify(['التحول الرقمي في التعليم', 'دعم وزارة التعليم']),
      threats: JSON.stringify(['منافسون عالميون', 'تكلفة التسويق']),
      recommendations: JSON.stringify(['الشراكة مع مدارس', 'بناء محتوى تعليمي']),
      summary: 'تطبيق تعليمي مبتكر مع إمكانات سوقية عالية',
    },
    {
      ideaId: insertedIdeas[2].id,
      innovationScore: 88,
      marketScore: 92,
      feasibilityScore: 80,
      socialImpactScore: 95,
      overallScore: 89,
      classification: 'innovation',
      strengths: JSON.stringify(['حاجة ملحة', 'سوق ضخم', 'تأثير صحي كبير']),
      weaknesses: JSON.stringify(['تحديات تنظيمية', 'يحتاج شراكات طبية']),
      opportunities: JSON.stringify(['دعم وزارة الصحة', 'جائحة كورونا']),
      threats: JSON.stringify(['تشريعات صحية', 'خصوصية البيانات']),
      recommendations: JSON.stringify(['الحصول على تراخيص', 'الشراكة مع مستشفيات']),
      summary: 'نظام رعاية صحية مبتكر ذو إمكانات عالية جداً',
    },
  ];

  for (const analysis of analyses) {
    await db.insert(schema.ideaAnalysis).values(analysis);
    console.log(`✓ Created analysis for idea ${analysis.ideaId}`);
  }

  // 4. Create hackathons
  console.log('\nCreating hackathons...');
  const hackathons = [
    {
      userId: insertedUsers[2].id,
      title: 'هاكاثون الذكاء الاصطناعي 2026',
      description: 'هاكاثون لتطوير حلول ذكية باستخدام الذكاء الاصطناعي',
      category: 'technology',
      startDate: new Date('2026-03-01'),
      endDate: new Date('2026-03-03'),
      location: 'Riyadh',
      maxParticipants: 100,
      prizePool: 100000,
      status: 'upcoming',
      tags: JSON.stringify(['AI', 'Hackathon', 'Innovation']),
    },
    {
      userId: insertedUsers[3].id,
      title: 'هاكاثون الصحة الرقمية',
      description: 'هاكاثون لتطوير حلول صحية رقمية مبتكرة',
      category: 'health',
      startDate: new Date('2026-04-15'),
      endDate: new Date('2026-04-17'),
      location: 'Jeddah',
      maxParticipants: 80,
      prizePool: 75000,
      status: 'upcoming',
      tags: JSON.stringify(['Healthcare', 'Digital Health', 'Innovation']),
    },
  ];

  for (const hackathon of hackathons) {
    await db.insert(schema.events).values(hackathon);
    console.log(`✓ Created hackathon: ${hackathon.title}`);
  }

  // 5. Create events
  console.log('\nCreating events...');
  const events = [
    {
      userId: insertedUsers[3].id,
      title: 'مؤتمر الابتكار الوطني 2026',
      description: 'مؤتمر يجمع المبتكرين والمستثمرين لتبادل الأفكار',
      category: 'conference',
      startDate: new Date('2026-05-10'),
      endDate: new Date('2026-05-12'),
      location: 'Riyadh',
      maxParticipants: 500,
      status: 'upcoming',
      tags: JSON.stringify(['Innovation', 'Conference', 'Networking']),
    },
  ];

  for (const event of events) {
    await db.insert(schema.events).values(event);
    console.log(`✓ Created event: ${event.title}`);
  }

  // 6. Create contracts
  console.log('\nCreating contracts...');
  const contracts = [
    {
      ideaId: insertedIdeas[2].id,
      partyA: insertedUsers[0].id,
      partyB: insertedUsers[1].id,
      title: 'عقد استثمار في نظام الرعاية الصحية',
      description: 'عقد استثمار بقيمة 500,000 ريال لتطوير نظام الرعاية الصحية عن بعد',
      totalAmount: 500000,
      currency: 'SAR',
      status: 'draft',
      terms: JSON.stringify({
        milestones: [
          { title: 'تطوير النموذج الأولي', amount: 150000, deadline: '2026-06-01' },
          { title: 'الإطلاق التجريبي', amount: 200000, deadline: '2026-09-01' },
          { title: 'الإطلاق الكامل', amount: 150000, deadline: '2026-12-01' },
        ],
      }),
    },
  ];

  for (const contract of contracts) {
    await db.insert(schema.contracts).values(contract);
    console.log(`✓ Created contract: ${contract.title}`);
  }

  console.log('\n✅ Seed completed successfully!');
  await connection.end();
}

seed().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
