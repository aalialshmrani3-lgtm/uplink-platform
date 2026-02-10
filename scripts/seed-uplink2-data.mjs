import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '../drizzle/schema.ts';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

const connection = await mysql.createConnection(DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

console.log('🌱 Starting UPLINK2 data seeding...\n');

// ========================================
// UPLINK2: Challenges Data (type: "challenge")
// ========================================
const challengesData = [
  {
    organizerId: 1,
    title: 'تحدي الذكاء الاصطناعي في الرعاية الصحية',
    description: 'تطوير حلول ذكاء اصطناعي لتحسين تشخيص الأمراض المزمنة وتقديم رعاية صحية أفضل للمرضى',
    type: 'challenge',
    category: 'الصحة',
    prize: '500000',
    currency: 'SAR',
    status: 'open',
    startDate: new Date('2026-02-01'),
    endDate: new Date('2026-06-30'),
    participants: 45,
    submissions: 12,
    requirements: JSON.stringify(['خبرة في الذكاء الاصطناعي', 'خبرة في الرعاية الصحية', 'فريق من 2-5 أعضاء']),
  },
  {
    organizerId: 1,
    title: 'تحدي التعليم الرقمي التفاعلي',
    description: 'ابتكار منصات تعليمية تفاعلية تستخدم الواقع الافتراضي والمعزز لتحسين تجربة التعلم',
    type: 'challenge',
    category: 'التعليم',
    prize: '300000',
    currency: 'SAR',
    status: 'open',
    startDate: new Date('2026-01-15'),
    endDate: new Date('2026-05-15'),
    participants: 62,
    submissions: 18,
    requirements: JSON.stringify(['خبرة في تطوير تطبيقات التعليم الإلكتروني', 'معرفة بالواقع الافتراضي/المعزز']),
  },
  {
    organizerId: 1,
    title: 'تحدي الطاقة المتجددة الذكية',
    description: 'تصميم أنظمة ذكية لإدارة الطاقة الشمسية وتحسين كفاءة استهلاك الطاقة في المباني',
    type: 'challenge',
    category: 'الطاقة',
    prize: '750000',
    currency: 'SAR',
    status: 'open',
    startDate: new Date('2026-03-01'),
    endDate: new Date('2026-07-20'),
    participants: 38,
    submissions: 9,
    requirements: JSON.stringify(['خبرة في أنظمة الطاقة المتجددة', 'خبرة في إنترنت الأشياء']),
  },
  {
    organizerId: 1,
    title: 'تحدي النقل الذكي والمستدام',
    description: 'تطوير حلول نقل ذكية ومستدامة للحد من الازدحام المروري وتحسين جودة الهواء',
    type: 'challenge',
    category: 'النقل',
    prize: '400000',
    currency: 'SAR',
    status: 'open',
    startDate: new Date('2026-02-15'),
    endDate: new Date('2026-08-10'),
    participants: 29,
    submissions: 7,
    requirements: JSON.stringify(['خبرة في أنظمة النقل الذكية', 'معرفة بتحليل البيانات']),
  },
  {
    organizerId: 1,
    title: 'تحدي الزراعة الذكية',
    description: 'ابتكار حلول زراعية ذكية تستخدم الذكاء الاصطناعي لتحسين الإنتاجية وتقليل استهلاك المياه',
    type: 'challenge',
    category: 'الزراعة',
    prize: '350000',
    currency: 'SAR',
    status: 'open',
    startDate: new Date('2026-03-10'),
    endDate: new Date('2026-09-05'),
    participants: 51,
    submissions: 15,
    requirements: JSON.stringify(['خبرة في الزراعة الذكية', 'خبرة في إنترنت الأشياء']),
  },
  {
    organizerId: 1,
    title: 'تحدي الأمن السيبراني',
    description: 'تطوير حلول متقدمة للأمن السيبراني لحماية البنية التحتية الحيوية من الهجمات الإلكترونية',
    type: 'challenge',
    category: 'التقنية',
    prize: '600000',
    currency: 'SAR',
    status: 'open',
    startDate: new Date('2026-04-01'),
    endDate: new Date('2026-10-15'),
    participants: 72,
    submissions: 21,
    requirements: JSON.stringify(['خبرة عميقة في الأمن السيبراني', 'شهادات أمنية معتمدة (مفضل)']),
  },
];

console.log('📋 Inserting challenges...');
try {
  await db.insert(schema.challenges).values(challengesData);
  console.log(`✅ Inserted ${challengesData.length} challenges\n`);
} catch (error) {
  console.error('❌ Error inserting challenges:', error.message);
}

// ========================================
// UPLINK2: Hackathons Data (type: "hackathon")
// ========================================
const hackathonsData = [
  {
    organizerId: 1,
    title: 'هاكاثون الابتكار الصحي 2026',
    description: 'هاكاثون مكثف لمدة 48 ساعة لتطوير حلول صحية مبتكرة باستخدام الذكاء الاصطناعي والبيانات الضخمة',
    type: 'hackathon',
    category: 'الصحة',
    prize: '1000000',
    currency: 'SAR',
    status: 'open',
    startDate: new Date('2026-04-15'),
    endDate: new Date('2026-04-17'),
    participants: 142,
    submissions: 0,
    requirements: JSON.stringify(['حضور فعلي في الرياض', 'فريق من 3-5 أعضاء', 'لابتوب شخصي']),
    sponsors: JSON.stringify(['وزارة الصحة', 'شركة أرامكو السعودية', 'STC']),
  },
  {
    organizerId: 1,
    title: 'هاكاثون التقنية المالية',
    description: 'تطوير حلول تقنية مالية مبتكرة لتحسين الشمول المالي وتجربة المستخدم',
    type: 'hackathon',
    category: 'التقنية المالية',
    prize: '800000',
    currency: 'SAR',
    status: 'open',
    startDate: new Date('2026-05-20'),
    endDate: new Date('2026-05-22'),
    participants: 98,
    submissions: 0,
    requirements: JSON.stringify(['حضور فعلي في جدة', 'خبرة في التقنيات المالية', 'فريق من 2-4 أعضاء']),
    sponsors: JSON.stringify(['البنك المركزي السعودي (ساما)', 'البنك الأهلي', 'الراجحي المالية']),
  },
  {
    organizerId: 1,
    title: 'هاكاثون الاستدامة البيئية',
    description: 'ابتكار حلول تقنية للحد من التلوث وتحسين جودة البيئة في المدن السعودية',
    type: 'hackathon',
    category: 'البيئة',
    prize: '500000',
    currency: 'SAR',
    status: 'open',
    startDate: new Date('2026-06-10'),
    endDate: new Date('2026-06-12'),
    participants: 215,
    submissions: 0,
    requirements: JSON.stringify(['مشاركة أونلاين', 'اهتمام بالاستدامة البيئية']),
    sponsors: JSON.stringify(['وزارة البيئة والمياه والزراعة', 'شركة نيوم']),
  },
  {
    organizerId: 1,
    title: 'هاكاثون السياحة الذكية',
    description: 'تطوير تطبيقات وحلول ذكية لتحسين تجربة السياح في المملكة',
    type: 'hackathon',
    category: 'السياحة',
    prize: '600000',
    currency: 'SAR',
    status: 'open',
    startDate: new Date('2026-07-05'),
    endDate: new Date('2026-07-07'),
    participants: 67,
    submissions: 0,
    requirements: JSON.stringify(['حضور فعلي في العلا', 'شغف بالسياحة والتقنية']),
    sponsors: JSON.stringify(['وزارة السياحة', 'الهيئة الملكية لمحافظة العلا']),
  },
  {
    organizerId: 1,
    title: 'هاكاثون الذكاء الاصطناعي للجميع',
    description: 'هاكاثون مفتوح لجميع المستويات لتطوير حلول ذكاء اصطناعي لمشاكل يومية',
    type: 'hackathon',
    category: 'الذكاء الاصطناعي',
    prize: '1200000',
    currency: 'SAR',
    status: 'open',
    startDate: new Date('2026-08-01'),
    endDate: new Date('2026-08-03'),
    participants: 189,
    submissions: 0,
    requirements: JSON.stringify(['حضور هجين (فعلي وأونلاين)', 'جميع المستويات مرحب بها']),
    sponsors: JSON.stringify(['الهيئة السعودية للبيانات والذكاء الاصطناعي (سدايا)', 'صندوق الاستثمارات العامة']),
  },
];

console.log('🏆 Inserting hackathons...');
try {
  await db.insert(schema.challenges).values(hackathonsData);
  console.log(`✅ Inserted ${hackathonsData.length} hackathons\n`);
} catch (error) {
  console.error('❌ Error inserting hackathons:', error.message);
}

console.log('✅ UPLINK2 data seeding completed successfully!');
await connection.end();
