import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import InquirySection from '@/components/InquirySection';

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'zh' }, { locale: 'id' }];
}

export default async function ContactPage({ params: { locale } }) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: '' });

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1a365d]">{t('title')}</h1>
          <p className="text-gray-500 mt-2">{t('subtitle')}</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <InquirySection locale={locale} />
          </div>
          <div className="bg-gray-50 rounded-2xl p-8 h-fit">
            <h3 className="text-lg font-bold text-[#1a365d] mb-6">{t('info.title')}</h3>
            <ul className="space-y-4 text-sm text-gray-600">
              <li className="flex items-start gap-3">
                <span>📍</span>
                <span>{t('info.address')}</span>
              </li>
              <li className="flex items-start gap-3">
                <span>📞</span>
                <span>{t('info.phone')}</span>
              </li>
              <li className="flex items-start gap-3">
                <span>📧</span>
                <span>{t('info.email')}</span>
              </li>
              <li className="flex items-start gap-3">
                <span>🕐</span>
                <span>{t('info.hours')}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
