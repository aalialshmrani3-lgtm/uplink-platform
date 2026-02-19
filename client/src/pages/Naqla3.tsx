import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ShoppingCart, 
  Shield, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  FileText,
  Building2,
  Key,
  Package,
  BarChart3,
  Lock,
  Zap
} from 'lucide-react';
import { getLoginUrl } from '@/const';
import { useAuth } from '@/_core/hooks/useAuth';
import SEOHead from '@/components/SEOHead';
import { mockContracts, mockMarketplace, mockMarketStats } from '@/data/mockNAQLA3';

export default function Naqla3() {
  const { user } = useAuth();
  const [selectedAssetType, setSelectedAssetType] = useState<'license' | 'product' | 'company'>('license');

  const assetTypes = [
    {
      id: 'license' as const,
      icon: Key,
      title: 'تراخيص (Licensing)',
      description: 'منح حق استخدام الملكية الفكرية مع الاحتفاظ بالملكية الأصلية',
      color: 'from-blue-500 to-cyan-600',
      examples: [
        'ترخيص استخدام براءة اختراع',
        'ترخيص تقنية أو خوارزمية',
        'ترخيص علامة تجارية'
      ],
      benefits: [
        'الاحتفاظ بالملكية الأصلية',
        'دخل متكرر من الرسوم',
        'إمكانية ترخيص لعدة جهات'
      ]
    },
    {
      id: 'product' as const,
      icon: Package,
      title: 'منتجات/سلع (Products)',
      description: 'بيع المنتج أو الحل التقني نفسه مع نقل حقوق الاستخدام',
      color: 'from-purple-500 to-pink-600',
      examples: [
        'بيع تطبيق أو برنامج جاهز',
        'بيع نظام تقني متكامل',
        'بيع حل أو منتج مادي'
      ],
      benefits: [
        'دخل فوري من البيع',
        'نقل المسؤولية للمشتري',
        'إمكانية بيع نسخ متعددة'
      ]
    },
    {
      id: 'company' as const,
      icon: Building2,
      title: 'استحواذ (Acquisition)',
      description: 'بيع الشركة بالكامل مع جميع أصولها وملكياتها الفكرية',
      color: 'from-orange-500 to-red-600',
      examples: [
        'استحواذ كامل على شركة ناشئة',
        'بيع حصة أغلبية في الشركة',
        'دمج (Merger) مع شركة أخرى'
      ],
      benefits: [
        'خروج (Exit) استراتيجي للمؤسسين',
        'قيمة عالية للصفقة',
        'نقل كامل للملكية والمسؤولية'
      ]
    }
  ];

  const features = [
    {
      icon: ShoppingCart,
      title: 'بورصة متكاملة',
      description: 'سوق مفتوح لتداول 3 أنواع من الأصول: تراخيص، منتجات، واستحواذ على شركات',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: FileText,
      title: 'عقود ذكية',
      description: 'عقود ذكية على البلوكتشين تضمن حقوق جميع الأطراف وتنفيذ الاتفاقيات تلقائياً',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: BarChart3,
      title: 'تقييم وتسعير ذكي',
      description: 'نظام تقييم متقدم يحدد القيمة العادلة بناءً على عوامل متعددة (الجدة، السوق، الأثر)',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      icon: Shield,
      title: 'حماية كاملة',
      description: 'حماية قانونية وتقنية كاملة للمشترين والبائعين عبر نظام ضمان متقدم',
      color: 'from-orange-500 to-red-600'
    }
  ];

  const process = [
    {
      step: '1',
      title: 'اختيار نوع الأصل',
      description: 'حدد نوع الأصل الذي تريد عرضه: ترخيص، منتج/سلعة، أو استحواذ على شركة'
    },
    {
      step: '2',
      title: 'التقييم الذكي',
      description: 'نظام التقييم الذكي يحدد القيمة العادلة بناءً على عوامل متعددة (الجدة، السوق، الأثر، المنافسة)'
    },
    {
      step: '3',
      title: 'عرض في البورصة',
      description: 'عرض الأصل في البورصة مع تفاصيل شاملة وسعر تنافسي يجذب المشترين المحتملين'
    },
    {
      step: '4',
      title: 'التفاوض والاتفاق',
      description: 'تواصل مع المشترين المهتمين وتفاوض على الشروط والأسعار حتى الوصول لاتفاق نهائي'
    },
    {
      step: '5',
      title: 'العقد الذكي والتنفيذ',
      description: 'إنشاء عقد ذكي على البلوكتشين، الدفع الآمن، ونقل الملكية رسمياً مع جميع الحقوق'
    }
  ];

  const stats = [
    { value: '5,000+', label: 'أصل معروض', icon: ShoppingCart },
    { value: '2,000+', label: 'صفقة مكتملة', icon: CheckCircle2 },
    { value: '100M+', label: 'ريال قيمة المعاملات', icon: DollarSign },
    { value: '99%', label: 'معدل الأمان', icon: Shield }
  ];

  const listings = {
    license: [
      {
        title: 'ترخيص تقنية الذكاء الاصطناعي للطاقة',
        category: 'تراخيص',
        price: '50,000 ريال/سنة',
        seller: 'شركة تقنية الابتكار',
        rating: 4.9,
        type: 'ترخيص حصري'
      },
      {
        title: 'ترخيص خوارزمية التشفير المتقدم',
        category: 'تراخيص',
        price: '30,000 ريال/سنة',
        seller: 'مجموعة الأمن السيبراني',
        rating: 4.8,
        type: 'ترخيص غير حصري'
      }
    ],
    product: [
      {
        title: 'نظام إدارة الطاقة الذكي (كامل)',
        category: 'منتجات',
        price: '250,000 ريال',
        seller: 'شركة تقنية الابتكار',
        rating: 4.8,
        type: 'بيع كامل'
      },
      {
        title: 'تطبيق الصحة الرقمية (مع الكود المصدري)',
        category: 'منتجات',
        price: '180,000 ريال',
        seller: 'فريق الصحة الذكية',
        rating: 4.9,
        type: 'بيع كامل'
      }
    ],
    company: [
      {
        title: 'شركة الحلول الذكية (استحواذ 100%)',
        category: 'استحواذ',
        price: '5,000,000 ريال',
        seller: 'المؤسسون',
        rating: 5.0,
        type: 'استحواذ كامل'
      },
      {
        title: 'شركة الأمن السيبراني (حصة 51%)',
        category: 'استحواذ',
        price: '3,000,000 ريال',
        seller: 'المساهمون',
        rating: 4.9,
        type: 'استحواذ أغلبية'
      }
    ]
  };

  const valuationFactors = [
    {
      name: 'الجدة التقنية',
      weight: '30%',
      description: 'مدى أصالة وتميز التقنية أو الحل'
    },
    {
      name: 'حجم السوق',
      weight: '25%',
      description: 'حجم السوق المستهدف والطلب المتوقع'
    },
    {
      name: 'الأثر الاقتصادي',
      weight: '20%',
      description: 'العائد المتوقع والقيمة الاقتصادية'
    },
    {
      name: 'الميزة التنافسية',
      weight: '15%',
      description: 'التفوق على الحلول المنافسة'
    },
    {
      name: 'الجدوى التقنية',
      weight: '10%',
      description: 'سهولة التنفيذ والتطبيق'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <SEOHead 
        title="NAQLA3 - البورصة | تداول التراخيص والمنتجات والشركات"
        description="بورصة متكاملة لتداول 3 أنواع من الأصول: تراخيص الملكية الفكرية، منتجات تقنية، واستحواذ على شركات. عقود ذكية وتقييم متقدم."
      />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(147,51,234,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)]" />
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6 animate-fade-in">
              <ShoppingCart className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-medium text-purple-300">البورصة - Marketplace</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent animate-fade-in-up">
              NAQLA 3
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-4 animate-fade-in-up animation-delay-100">
              بورصة الابتكار والملكية الفكرية
            </p>
            
            <p className="text-lg text-gray-400 mb-8 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
              تداول 3 أنواع من الأصول: تراخيص الملكية الفكرية، منتجات تقنية جاهزة، واستحواذ على شركات ناشئة. عقود ذكية وتقييم متقدم يضمن العدالة والشفافية
            </p>

            <div className="flex flex-wrap gap-4 justify-center animate-fade-in-up animation-delay-300">
              {user ? (
                <Button size="lg" asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <Link href="/naqla3/marketplace">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    تصفح البورصة
                  </Link>
                </Button>
              ) : (
                <Button size="lg" asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <a href={getLoginUrl()}>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    سجل دخول للتصفح
                  </a>
                </Button>
              )}
              <Button size="lg" variant="outline" asChild className="border-gray-700 hover:bg-gray-800">
                <Link href="/naqla3/sell">
                  عرض أصل للبيع
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card 
                key={index}
                className="glass-card p-6 text-center hover:scale-105 transition-transform duration-300"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-purple-400" />
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Asset Types Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">3 أنواع من الأصول</h2>
            <p className="text-xl text-gray-400">اختر نوع الأصل المناسب لاحتياجاتك</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {assetTypes.map((type, index) => (
              <Card 
                key={index}
                className={`glass-card p-8 cursor-pointer transition-all duration-300 ${
                  selectedAssetType === type.id 
                    ? 'border-2 border-purple-500 scale-105' 
                    : 'hover:scale-105'
                }`}
                onClick={() => setSelectedAssetType(type.id)}
              >
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${type.color} flex items-center justify-center mb-6`}>
                  <type.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3">{type.title}</h3>
                <p className="text-gray-400 mb-6">{type.description}</p>
                
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-400 mb-3">أمثلة:</h4>
                  <ul className="space-y-2">
                    {type.examples.map((example, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-6 border-t border-gray-700">
                  <h4 className="text-sm font-semibold text-gray-400 mb-3">الفوائد:</h4>
                  <ul className="space-y-2">
                    {type.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                        <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>

          {/* Sample Listings */}
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              عروض مميزة - {assetTypes.find(t => t.id === selectedAssetType)?.title}
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {listings[selectedAssetType].map((listing, index) => (
                <Card 
                  key={index}
                  className="glass-card p-6 hover:scale-105 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-sm font-semibold">
                      {listing.type}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm text-gray-400">{listing.rating}</span>
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">{listing.title}</h4>
                  <p className="text-gray-400 text-sm mb-4">{listing.seller}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-400">{listing.price}</span>
                    <Button size="sm" asChild className="bg-gradient-to-r from-purple-600 to-pink-600">
                      <Link href={`/naqla3/assets/${index + 1}`}>
                        عرض التفاصيل
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-slate-900/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">لماذا NAQLA3؟</h2>
            <p className="text-xl text-gray-400">منصة متكاملة لتداول الأصول الرقمية والملكية الفكرية</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="glass-card p-6 hover:scale-105 transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Valuation System */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">نظام التقييم الذكي</h2>
            <p className="text-xl text-gray-400">تقييم عادل ومتقدم بناءً على 5 عوامل رئيسية</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {valuationFactors.map((factor, index) => (
              <Card 
                key={index}
                className="glass-card p-6 hover:scale-102 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">{factor.weight}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{factor.name}</h3>
                    <p className="text-gray-400">{factor.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-slate-900/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">كيف تعمل البورصة؟</h2>
            <p className="text-xl text-gray-400">5 خطوات من العرض إلى إتمام الصفقة</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {process.map((step, index) => (
              <Card 
                key={index}
                className="glass-card p-6 hover:scale-102 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                    <span className="text-xl font-bold text-white">{step.step}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-gray-400">{step.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="glass-card p-12 text-center">
            <Zap className="w-16 h-16 mx-auto mb-6 text-purple-400" />
            <h2 className="text-3xl font-bold text-white mb-4">
              جاهز لتداول أصولك الرقمية؟
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              ابدأ الآن في تداول التراخيص، المنتجات، أو الاستحواذ على الشركات
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              {user ? (
                <Button size="lg" asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <Link href="/naqla3/marketplace">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    تصفح البورصة الآن
                  </Link>
                </Button>
              ) : (
                <Button size="lg" asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <a href={getLoginUrl()}>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    سجل دخول للبدء
                  </a>
                </Button>
              )}
              <Button size="lg" variant="outline" asChild className="border-gray-700 hover:bg-gray-800">
                <Link href="/">
                  <ArrowRight className="w-5 h-5 ml-2" />
                  العودة للرئيسية
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
