import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'zh' }, { locale: 'id' }];
}

export default async function CertificatesPage({ params: { locale } }) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: '' });

  const certs = [
    { name: 'ISO 13485', label: 'iso', icon: '📋' },
    { name: 'CE MDR', label: 'ce', icon: '🇪🇺' },
    { name: 'FDA', label: 'fda', icon: '🇺🇸' },
    { name: 'CFS', label: 'cfs', icon: '🌍' },
  ];

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1a365d]">{t('title')}</h1>
          <p className="text-gray-500 mt-2">{t('subtitle')}</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certs.map((cert) => (
            <div key={cert.name} className="border border-gray-100 rounded-xl p-6 hover:shadow-sm transition-shadow">
              <div className="flex items-start gap-4">
                <span className="text-3xl">{cert.icon}</span>
                <div>
                  <h3 className="text-lg font-semibold text-[#1a365d]">{cert.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{t(cert.label)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-400 mt-10 text-center">{t('note')}</p>
      </div>
    </div>
  );
}
