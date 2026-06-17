import { Link } from '@/navigation';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import productsData from '@/data/products.json';

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'zh' }, { locale: 'id' }];
}

export default async function HomePage({ params: { locale } }) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'home' });

  const categories = [
    { key: 'medical', icon: '🏥' },
    { key: 'beauty', icon: '💄' },
    { key: 'hair', icon: '💇' },
  ];

  return (
    <>
      {/* HERO */}
      <section className="relative bg-gradient-to-br from-[#0f1b33] via-[#1a365d] to-[#1e2d4d] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 25% 50%, rgba(0,166,81,0.4) 0%, transparent 50%)',
        }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/contact" className="inline-flex items-center px-8 py-3 rounded-lg font-semibold text-white bg-[#00a651] hover:bg-[#008c44] transition-all">
                {t('hero.cta_quote')}
              </Link>
              <Link href="/products" className="inline-flex items-center px-8 py-3 rounded-lg font-semibold border-2 border-white text-white hover:bg-white hover:text-[#0f1b33] transition-all">
                {t('hero.cta_products')}
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 mt-10 text-sm text-gray-300">
              <span className="flex items-center gap-1.5">✅ {t('hero.trust_1')}</span>
              <span className="flex items-center gap-1.5">✅ {t('hero.trust_2')}</span>
              <span className="flex items-center gap-1.5">✅ {t('hero.trust_3')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#1a365d]">{t('stats.title')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-8">
            {[
              { val: t('stats.products_val'), label: t('stats.products') },
              { val: t('stats.suppliers_val'), label: t('stats.suppliers') },
              { val: t('stats.countries_val'), label: t('stats.countries') },
              { val: t('stats.experience_val'), label: t('stats.experience') },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-[#1a365d] mb-2">{stat.val}</div>
                <div className="text-gray-500 text-sm uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#1a365d]">{t('categories.title')}</h2>
          <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-12">{t('categories.subtitle')}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {categories.map((cat) => (
              <Link
                key={cat.key}
                href="/products"
                className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="h-48 bg-gradient-to-br from-[#dbe4ff] to-[#eef2ff] flex items-center justify-center text-6xl">
                  {cat.icon}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 group-hover:text-[#00a651] transition-colors">
                    {t('categories.' + cat.key)}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/products" className="inline-flex items-center px-6 py-3 rounded-lg font-semibold text-white bg-[#00a651] hover:bg-[#008c44] transition-all">
              {t('categories.view_all')} →
            </Link>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#1a365d]">{t('why_us.title')}</h2>
          <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-12">{t('why_us.subtitle')}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {['factory', 'quality', 'communication', 'certification', 'logistics', 'moq'].map((key) => (
              <div key={key} className="p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-[#1a365d] mb-3">{t('why_us.' + key + '.title')}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{t('why_us.' + key + '.desc')}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CERTIFICATES */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#1a365d]">{t('certificates.title')}</h2>
          <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-12">{t('certificates.subtitle')}</p>
          <div className="flex flex-wrap justify-center gap-8 mt-8">
            {['ISO', 'CE', 'FDA', 'CFS'].map((cert) => (
              <div key={cert} className="w-36 h-24 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-lg font-bold text-[#1a365d]">
                {cert}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-[#1a365d] to-[#0f1b33] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('cta.title')}</h2>
          <p className="text-lg text-gray-200 mb-8 max-w-xl mx-auto">{t('cta.subtitle')}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="inline-flex items-center px-8 py-3 bg-[#00a651] hover:bg-[#008c44] text-white rounded-lg font-semibold transition-colors">
              📩 {t('cta.btn_inquiry')}
            </Link>
            <a href="https://wa.me/861234567890" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-8 py-3 bg-white text-[#1a365d] hover:bg-gray-100 rounded-lg font-semibold transition-colors">
              💬 {t('cta.btn_whatsapp')}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
