export default function HomeSimpleTest() {
  return (
    <div style={{ 
      padding: '40px', 
      textAlign: 'center',
      fontFamily: 'Cairo, Arial, sans-serif',
      direction: 'rtl'
    }}>
      <h1 style={{ fontSize: '48px', marginBottom: '20px', color: '#1e40af' }}>
        مرحباً بك في NAQLA 5.0
      </h1>
      <p style={{ fontSize: '24px', marginBottom: '30px', color: '#64748b' }}>
        المنصة الوطنية للابتكار
      </p>
      <div style={{ 
        background: '#f1f5f9', 
        padding: '30px', 
        borderRadius: '12px',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <p style={{ fontSize: '18px', lineHeight: '1.8', color: '#334155' }}>
          هذه صفحة اختبار بسيطة للتأكد من عمل الموقع والخط العربي بشكل صحيح.
          إذا كنت ترى هذا النص بوضوح، فهذا يعني أن الموقع يعمل!
        </p>
      </div>
    </div>
  );
}
