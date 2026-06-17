import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'zh' }, { locale: 'id' }];
}

export default async function AboutPage({ params: { locale } }) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'about' });

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1a365d]">{t('title')}</h1>
          <p className="text-gray-500 mt-2">{t('subtitle')}</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose max-w-none">
          <p className="text-lg text-gray-600 leading-relaxed mb-8">{t('intro')}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className="bg-[#eef2ff] rounded-2xl p-8">
              <h2 className="text-xl font-bold text-[#1a365d] mb-4">{t('mission.title')}</h2>
              <p className="text-gray-600 leading-relaxed">{t('mission.text')}</p>
            </div>
            <div className="bg-green-50 rounded-2xl p-8">
              <h2 className="text-xl font-bold text-[#1a365d] mb-4">{t('advantage.title')}</h2>
              <p className="text-gray-600 leading-relaxed">{t('advantage.text')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
