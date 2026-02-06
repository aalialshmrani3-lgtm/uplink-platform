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
  image = 'https://uplink.sa/og-image.png',
  url,
  type = 'website',
}: SEOHeadProps) {
  const { language } = useLanguage();
  
  const defaultTitle = language === 'ar' 
    ? 'UPLINK 5.0 - منصة الابتكار العالمية'
    : 'UPLINK 5.0 - Global Innovation Platform';
    
  const defaultDescription = language === 'ar'
    ? 'منصة UPLINK 5.0 تربط المبتكرين حول العالم بالمستثمرين والشركات والمؤسسات من خلال ثلاثة محركات متكاملة: توليد الملكية الفكرية، التحديات والمطابقة، والسوق المفتوح'
    : 'UPLINK 5.0 connects innovators worldwide with investors, companies, and institutions through three integrated engines: IP Generation, Challenges & Matching, and Open Marketplace';
    
  const defaultKeywords = language === 'ar'
    ? 'ابتكار، ملكية فكرية، استثمار، مستثمرين، براءات اختراع، تحديات، سوق ابتكار، UPLINK، السعودية'
    : 'innovation, intellectual property, investment, investors, patents, challenges, innovation marketplace, UPLINK, Saudi Arabia';
  
  const fullTitle = title ? `${title} | UPLINK 5.0` : defaultTitle;
  const fullDescription = description || defaultDescription;
  const fullKeywords = keywords || defaultKeywords;
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : 'https://uplink.sa');
  
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={fullKeywords} />
      <meta name="author" content="UPLINK" />
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
      <meta property="og:site_name" content="UPLINK 5.0" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={currentUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={fullDescription} />
      <meta property="twitter:image" content={image} />
      <meta name="twitter:creator" content="@UPLINK_SA" />
      
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
          name: 'UPLINK 5.0',
          description: fullDescription,
          url: 'https://uplink.sa',
          logo: 'https://uplink.sa/logo.png',
          sameAs: [
            'https://twitter.com/UPLINK_SA',
            'https://linkedin.com/company/uplink-sa',
            'https://facebook.com/UPLINK.SA',
          ],
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'Customer Service',
            email: 'info@uplink.sa',
            availableLanguage: ['Arabic', 'English', 'French', 'Spanish', 'Chinese'],
          },
        })}
      </script>
    </Helmet>
  );
}
