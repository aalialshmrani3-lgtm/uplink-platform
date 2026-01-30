import { getDb } from './db.js';
import { organizations } from '../drizzle/schema.js';

async function seedSaudiOrganizations() {
  const db = await getDb();
  if (!db) throw new Error('Database connection failed');
  
  // الجهات الحكومية (أزرق)
  const governmentOrgs = [
    { nameAr: 'وزارة الاقتصاد والتخطيط', nameEn: 'Ministry of Economy and Planning', type: 'government' as const },
    { nameAr: 'وزارة الاستثمار', nameEn: 'Ministry of Investment', type: 'government' as const },
    { nameAr: 'وزارة الصناعة والثروة المعدنية', nameEn: 'Ministry of Industry and Mineral Resources', type: 'government' as const },
    { nameAr: 'وزارة الاتصالات وتقنية المعلومات', nameEn: 'Ministry of Communications and Information Technology', type: 'government' as const },
    { nameAr: 'الهيئة السعودية للملكية الفكرية', nameEn: 'Saudi Authority for Intellectual Property (SAIP)', type: 'government' as const },
    { nameAr: 'هيئة المنشآت الصغيرة والمتوسطة', nameEn: 'Small and Medium Enterprises General Authority (Monsha\'at)', type: 'government' as const },
    { nameAr: 'هيئة تنمية البحث والتطوير والابتكار', nameEn: 'Research, Development and Innovation Authority (RDIA)', type: 'government' as const },
    { nameAr: 'الهيئة العامة للصناعات العسكرية', nameEn: 'General Authority for Military Industries (GAMI)', type: 'government' as const },
  ];

  // الجامعات والمراكز البحثية (بنفسجي)
  const academicOrgs = [
    { nameAr: 'جامعة الملك سعود', nameEn: 'King Saud University', type: 'academic' as const },
    { nameAr: 'جامعة الملك عبدالعزيز', nameEn: 'King Abdulaziz University', type: 'academic' as const },
    { nameAr: 'جامعة الملك فهد للبترول والمعادن', nameEn: 'King Fahd University of Petroleum and Minerals (KFUPM)', type: 'academic' as const },
    { nameAr: 'جامعة الملك عبدالله للعلوم والتقنية', nameEn: 'King Abdullah University of Science and Technology (KAUST)', type: 'academic' as const },
    { nameAr: 'جامعة الأمير محمد بن فهد', nameEn: 'Prince Mohammad Bin Fahd University', type: 'academic' as const },
    { nameAr: 'مدينة الملك عبدالعزيز للعلوم والتقنية', nameEn: 'King Abdulaziz City for Science and Technology (KACST)', type: 'academic' as const },
    { nameAr: 'معهد الملك عبدالله لتقنية النانو', nameEn: 'King Abdullah Institute for Nanotechnology', type: 'academic' as const },
    { nameAr: 'مركز الملك سلمان للأبحاث', nameEn: 'King Salman Research Center', type: 'academic' as const },
  ];

  // القطاع الخاص (برتقالي)
  const privateOrgs = [
    { nameAr: 'أرامكو السعودية', nameEn: 'Saudi Aramco', type: 'private' as const },
    { nameAr: 'سابك', nameEn: 'SABIC', type: 'private' as const },
    { nameAr: 'شركة الاتصالات السعودية (STC)', nameEn: 'Saudi Telecom Company (STC)', type: 'private' as const },
    { nameAr: 'شركة الكهرباء السعودية', nameEn: 'Saudi Electricity Company', type: 'private' as const },
    { nameAr: 'مجموعة سامبا المالية', nameEn: 'Samba Financial Group', type: 'private' as const },
    { nameAr: 'شركة معادن', nameEn: 'Ma\'aden (Saudi Arabian Mining Company)', type: 'private' as const },
    { nameAr: 'شركة أكوا باور', nameEn: 'ACWA Power', type: 'private' as const },
    { nameAr: 'شركة نيوم', nameEn: 'NEOM Company', type: 'private' as const },
  ];

  // الجهات الداعمة (أحمر)
  const supportingOrgs = [
    { nameAr: 'صندوق الاستثمارات العامة', nameEn: 'Public Investment Fund (PIF)', type: 'supporting' as const },
    { nameAr: 'البنك السعودي للتنمية', nameEn: 'Saudi Development Bank', type: 'supporting' as const },
    { nameAr: 'صندوق التنمية الصناعية السعودي', nameEn: 'Saudi Industrial Development Fund (SIDF)', type: 'supporting' as const },
    { nameAr: 'برنامج تطوير الصناعة الوطنية والخدمات اللوجستية', nameEn: 'National Industrial Development and Logistics Program (NIDLP)', type: 'supporting' as const },
    { nameAr: 'مركز الملك عبدالله المالي', nameEn: 'King Abdullah Financial District (KAFD)', type: 'supporting' as const },
    { nameAr: 'مسرعات الأعمال السعودية', nameEn: 'Saudi Business Accelerators', type: 'supporting' as const },
    { nameAr: 'صندوق رأس المال الجريء السعودي', nameEn: 'Saudi Venture Capital Company (SVC)', type: 'supporting' as const },
  ];

  const allOrgs = [
    ...governmentOrgs,
    ...academicOrgs,
    ...privateOrgs,
    ...supportingOrgs,
  ].map(org => ({
    ...org,
    scope: 'local' as const,
    country: 'Saudi Arabia',
    isActive: true,
  }));

  console.log(`Seeding ${allOrgs.length} Saudi organizations...`);

  for (const org of allOrgs) {
    await db!.insert(organizations).values(org);
    console.log(`✓ Added: ${org.nameAr}`);
  }

  console.log('\n✅ Successfully seeded all Saudi organizations!');
  console.log(`   - Government: ${governmentOrgs.length}`);
  console.log(`   - Academic: ${academicOrgs.length}`);
  console.log(`   - Private: ${privateOrgs.length}`);
  console.log(`   - Supporting: ${supportingOrgs.length}`);
  console.log(`   - Total: ${allOrgs.length}`);
}

seedSaudiOrganizations().catch(console.error);
