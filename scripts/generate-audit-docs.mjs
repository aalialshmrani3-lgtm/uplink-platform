import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const projectRoot = process.cwd();
const auditRoot = "/home/ubuntu/naqla_audit_baseline";
const docsRoot = join(auditRoot, "docs");
mkdirSync(docsRoot, { recursive: true });

const appPath = join(projectRoot, "client/src/App.tsx");
const routerPath = join(projectRoot, "server/routers.ts");
const schemaPath = join(projectRoot, "drizzle/schema.ts");
const appSource = readFileSync(appPath, "utf8");
const routerSource = readFileSync(routerPath, "utf8");
const schemaSource = readFileSync(schemaPath, "utf8");

const lines = (source) => source.split("\n");
const sourceLine = (source, needle) => Math.max(1, lines(source).findIndex((line) => line.includes(needle)) + 1);

const routeRows = [...appSource.matchAll(/<Route\s+path="([^"]+)"\s+component=\{([^}]+)\}/g)]
  .map((match) => ({ route: match[1], component: match[2] }))
  .sort((a, b) => a.route.localeCompare(b.route));

const routeMap = [
  "# ROUTE MAP — NAQLA Baseline",
  "",
  "> هذا الملف يستخرج المسارات المعرّفة في `client/src/App.tsx`. لا يثبت أن كل مسار مكتمل أو متاح بلا تسجيل دخول؛ التحقق وقت التشغيل موثق في ملفات الاختبارات.",
  "",
  "| المسار | المكوّن | ملاحظة تدقيقية |",
  "|---|---|---|",
  ...routeRows.map(({ route, component }) => `| \`${route}\` | \`${component}\` | يتطلب مراجعة Browser/E2E |`),
  "",
  `**الإجمالي:** ${routeRows.length} مساراً صريحاً، إضافة إلى مسار fallback لـ 404.`,
].join("\n");

const routerSections = [...routerSource.matchAll(/^\s{2}([A-Za-z][A-Za-z0-9_]*):\s*router\(/gm)].map((match) => match[1]);
const procedureRows = [...routerSource.matchAll(/^\s{4,8}([A-Za-z][A-Za-z0-9_]*):\s*(publicProcedure|protectedProcedure)/gm)]
  .map((match) => ({ procedure: match[1], exposure: match[2] === "publicProcedure" ? "public" : "protected" }));
const apiMap = [
  "# API MAP — tRPC Baseline",
  "",
  "> المستخرج مبني على تعريفات `server/routers.ts`. نوع الإجراء يدل على الحماية المعرّفة في المصدر، وليس على نجاح التدفق في المتصفح أو اكتمال منطق الخدمة.",
  "",
  "## مجموعات Router المرصودة",
  "",
  routerSections.map((section) => `- \`${section}\``).join("\n"),
  "",
  "## إجراءات مرصودة",
  "",
  "| الإجراء | الحماية المصدرية | ملاحظة |",
  "|---|---|---|",
  ...procedureRows.map(({ procedure, exposure }) => `| \`${procedure}\` | ${exposure} | تحقق E2E مطلوب |`),
  "",
  `**الإجمالي المرصود:** ${procedureRows.length} إجراءاً وفق النمط القابل للاستخراج.`,
].join("\n");

const tableMatches = [...schemaSource.matchAll(/export const\s+(\w+)\s*=\s*mysqlTable\("([^"]+)"/g)]
  .map((match) => ({ symbol: match[1], table: match[2] }));
const dataModel = [
  "# DATA MODEL — Schema Baseline",
  "",
  "> قائمة بالجداول المستخرجة من `drizzle/schema.ts`. هذه وثيقة بنية، وليست تصديراً للبيانات ولا تحتوي على سجلات تشغيلية.",
  "",
  "| رمز المصدر | جدول قاعدة البيانات | المجال المرجح |",
  "|---|---|---|",
  ...tableMatches.map(({ symbol, table }) => {
    const domain = /idea|evaluation|classification/.test(symbol) ? "NAQLA 1" : /challenge|event|match|hackathon|project/.test(symbol) ? "NAQLA 2" : /asset|contract|escrow|transaction/.test(symbol) ? "NAQLA 3" : "منصة مساندة";
    return `| \`${symbol}\` | \`${table}\` | ${domain} |`;
  }),
  "",
  "## علاقات القصة التجريبية",
  "",
  "`ideas` → `idea_analysis` / `classification_history` → `projects` أو `matching_requests` → `contracts` / `escrow_accounts` / `marketplace_assets`.",
  "",
  "> ربط هذه العناصر في المخطط لا يعني أن كل انتقال مؤتمت؛ راجع `KNOWN_GAPS.md` وحالة الاختبار.",
].join("\n");

const gaps = [
  ["REG-001", "auth.register", sourceLine(routerSource, "// TODO: Implement registration logic"), "`auth.register` يعيد نجاحاً بعد تعليق TODO ولا يظهر في هذا المسح حفظ مستخدم.", "partial"],
  ["SET-001", "user.updateSettings", sourceLine(routerSource, "// TODO: Implement settings update logic in db.ts"), "إجراء الإعدادات يتضمن تعليق TODO لمنطق قاعدة البيانات.", "partial"],
  ["IP-001", "ip.submit", sourceLine(routerSource, "const saipNumber"), "رقم SAIP يُنشأ محلياً وفق قالب نصي في الإجراء؛ لا يظهر تكامل خارجي في هذا الموضع.", "demo"],
  ["MATCH-001", "server/naqla1-to-naqla2.ts", 0, "دالة الترقية تتضمن درجة مطابقة ثابتة وتعليق TODO لحساب درجة حقيقية.", "partial"],
  ["MATCH-002", "server/naqla2-matching.ts", 0, "ملف المطابقة يوضح أن تدفقات التخزين/الطلب/القبول معلّقة لعدم إنشاء جداول المطابقة.", "partial"],
  ["MATCH-003", "server/db.ts", 0, "طبقة البيانات توثق أن جداول/دوال matchingRequests وmatches غير مكتملة في المسح السابق.", "partial"],
  ["LOAD-001", "client/src/App.tsx", sourceLine(appSource, "function SplashScreen"), "التطبيق يحتوي Splash Screen وPageLoader؛ سلوك التحميل يتطلب تحققاً متصفحياً لكل صفحة.", "verify"],
];
const knownGaps = [
  "# KNOWN GAPS — Source-Evidenced Baseline",
  "",
  "> هذه ملاحظات مصدرية رصدية فقط. لا تحتوي على إصلاحات أو توصيات أو ترتيب أولويات.",
  "",
  "| المعرف | المصدر | السطر | الدليل المرصود | الحالة |",
  "|---|---|---:|---|---|",
  ...gaps.map(([id, file, line, evidence, status]) => `| ${id} | \`${file}\` | ${line || "راجع الملف"} | ${evidence} | ${status} |`),
  "",
  "## حدود الرصد",
  "",
  "- عدم ظهور تكامل في هذا المسح لا يثبت عدم وجوده في ملف آخر أو خدمة خارجية.",
  "- وضع `verify` يعني أن الحكم يعتمد على اختبار المتصفح وليس على النص وحده.",
  "- لا تمثل هذه القائمة قرار إطلاق أو تقييم سلامة أو اعتماداً نهائياً.",
].join("\n");

const roleMatrix = [
  "# ROLE MATRIX — Audit Lens",
  "",
  "> الأدوار التالية عدسات مراجعة محلية في `/audit` وليست حسابات أو صلاحيات مفعلة.",
  "",
  "| الدور | مداخل المراجعة | نوع الدليل المطلوب |",
  "|---|---|---|",
  "| مبتكر | NAQLA 1، تقديم فكرة، تقييم SAIP، أفكار موجهة | نموذج، حالة واجهة، استجابة tRPC |",
  "| شركة/صاحبة تحدٍ | تحديات، إرسال تحدٍ، فعاليات، Deal Room | نموذج، حفظ، تنقل، حالة إذن |",
  "| مستثمر | ملف المستثمر، Matching، Marketplace، Contracts | قائمة، تفصيل، إجراء، حالة بيانات |",
  "| مسرعة/حاضنة | فرص، Matching Hub، مشروع، لوحة NAQLA 2 | عرض، تصفية، انتقال، إذن |",
  "| منظم فعالية/هاكاثون | إنشاء، لوحة فعاليات، احتياجات | نموذج، قائمة، حالة، إجراء |",
  "| إدارة المنصة | إدارة، سجلات تدقيق، صحة النظام، تحليلات | حراسة دخول، بيانات، أخطاء console/network |",
].join("\n");

const demoGuide = [
  "# DEMO DATA GUIDE — Audit Story",
  "",
  "## القصة الوحيدة المترابطة",
  "",
  "| الحقل | القيمة التجريبية | مصدرها |",
  "|---|---|---|",
  "| معرّف القصة | `AUDIT-ENERGY-001` | ثابت في صفحة `/audit` |",
  "| المبتكر | سلمان العتيبي | بيانات تجريبية محلية |",
  "| الحل | حل ذكي لإدارة كفاءة الطاقة | بيانات تجريبية محلية |",
  "| القطاع | الطاقة والاستدامة | بيانات تجريبية محلية |",
  "| المرحلة | TRL 5 · نموذج أولي | بيانات تجريبية محلية |",
  "| الحالة A | 42% · تحتاج تطويراً | سيناريو تدقيق فقط |",
  "| الحالة B | 63% · حل تجاري واعد | سيناريو تدقيق فقط |",
  "| الحالة C | 78% · ابتكار مؤهل | سيناريو تدقيق فقط |",
  "",
  "## ضوابط الاستخدام",
  "",
  "- لا تُفسر النسب أو الأسماء كبيانات تشغيلية أو نتائج موثقة.",
  "- صفحة `/audit` لا تستدعي قاعدة البيانات ولا تنشئ سجلات.",
  "- لا تستخدم هذه القصة لإظهار نجاح تكامل SAIP أو دفع أو Escrow أو Blockchain.",
].join("\n");

const auditReadme = [
  "# NAQLA Audit Baseline",
  "",
  "حزمة قراءة واختبار مستقلة للمنصة. تفصل بين ما هو مرصود في المصدر، وما هو معروض كبيانات تجريبية، وما يحتاج تحقق متصفحياً.",
  "",
  "## محتوى المجلد",
  "",
  "| المسار | الغرض |",
  "|---|---|",
  "| `docs/ROUTE_MAP.md` | المسارات المعرّفة في الواجهة |",
  "| `docs/API_MAP.md` | إجراءات tRPC المستخرجة |",
  "| `docs/DATA_MODEL.md` | الجداول والعلاقة العامة |",
  "| `docs/ROLE_MATRIX.md` | عدسات المراجعة حسب الدور |",
  "| `docs/KNOWN_GAPS.md` | أدلة مصدرية على حالات جزئية أو تجريبية |",
  "| `docs/DEMO_DATA_GUIDE.md` | قصة الطاقة التجريبية وضوابطها |",
  "| `tests/` | أدلة الاختبار واللقطات والتتبعات |",
  "| `AUDIT_MANIFEST.json` | فهرس الحزمة المنظم |",
  "",
  "## قاعدة العمل",
  "",
  "هذه الحزمة لا تتضمن أسراراً أو سجلات إنتاجية أو بيانات أشخاص حقيقية. لا تعني أي ملاحظة فيها إصلاحاً أو قراراً أو اعتماد إطلاق.",
].join("\n");

writeFileSync(join(docsRoot, "ROUTE_MAP.md"), `${routeMap}\n`);
writeFileSync(join(docsRoot, "API_MAP.md"), `${apiMap}\n`);
writeFileSync(join(docsRoot, "DATA_MODEL.md"), `${dataModel}\n`);
writeFileSync(join(docsRoot, "ROLE_MATRIX.md"), `${roleMatrix}\n`);
writeFileSync(join(docsRoot, "KNOWN_GAPS.md"), `${knownGaps}\n`);
writeFileSync(join(docsRoot, "DEMO_DATA_GUIDE.md"), `${demoGuide}\n`);
writeFileSync(join(auditRoot, "README.md"), `${auditReadme}\n`);

const report = {
  generatedAt: new Date().toISOString(),
  routes: routeRows.length,
  routerSections: routerSections.length,
  procedures: procedureRows.length,
  tables: tableMatches.length,
  docs: readdirSync(docsRoot).sort(),
};
writeFileSync(join(auditRoot, "SOURCE_SCAN_SUMMARY.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report));
