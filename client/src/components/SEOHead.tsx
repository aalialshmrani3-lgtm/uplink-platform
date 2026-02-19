import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/contexts/LanguageContext';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
}

export default function SEOHead({
  title,
  description,
  keywords,
  image = 'https://naqla.sa/og-image.png',
  url,
  type = 'website',
}: SEOHeadProps) {
  const { language } = useLanguage();
  
  const defaultTitle = language === 'ar' 
    ? 'NAQLA 5.0 - منصة الابتكار العالمية'
    : 'NAQLA 5.0 - Global Innovation Platform';
    
  const defaultDescription = language === 'ar'
    ? 'منصة NAQLA 5.0 تربط المبتكرين حول العالم بالمستثمرين والشركات والمؤسسات من خلال ثلاثة محركات متكاملة: توليد الملكية الفكرية، التحديات والمطابقة، والسوق المفتوح'
    : 'NAQLA 5.0 connects innovators worldwide with investors, companies, and institutions through three integrated engines: IP Generation, Challenges & Matching, and Open Marketplace';
    
  const defaultKeywords = language === 'ar'
    ? 'ابتكار، ملكية فكرية، استثمار، مستثمرين، براءات اختراع، تحديات، سوق ابتكار، NAQLA، السعودية'
    : 'innovation, intellectual property, investment, investors, patents, challenges, innovation marketplace, NAQLA, Saudi Arabia';
  
  const fullTitle = title ? `${title} | NAQLA 5.0` : defaultTitle;
  const fullDescription = description || defaultDescription;
  const fullKeywords = keywords || defaultKeywords;
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : 'https://naqla.sa');
  
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={fullKeywords} />
      <meta name="author" content="NAQLA" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content={language} />
      <link rel="canonical" href={currentUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content={language === 'ar' ? 'ar_SA' : 'en_US'} />
      <meta property="og:site_name" content="NAQLA 5.0" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={currentUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={fullDescription} />
      <meta property="twitter:image" content={image} />
      <meta name="twitter:creator" content="@NAQLA_SA" />
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#06b6d4" />
      <meta name="msapplication-TileColor" content="#06b6d4" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* Structured Data (JSON-LD) */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'NAQLA 5.0',
          description: fullDescription,
          url: 'https://naqla.sa',
          logo: 'https://naqla.sa/logo.png',
          sameAs: [
            'https://twitter.com/NAQLA_SA',
            'https://linkedin.com/company/naqla-sa',
            'https://facebook.com/NAQLA.SA',
          ],
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'Customer Service',
            email: 'info@naqla.sa',
            availableLanguage: ['Arabic', 'English', 'French', 'Spanish', 'Chinese'],
          },
        })}
      </script>
    </Helmet>
  );
}
