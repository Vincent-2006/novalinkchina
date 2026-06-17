import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { Link } from '@/navigation';
import productsData from '@/data/products.json';
import { notFound } from 'next/navigation';
import InquirySection from '@/components/InquirySection';

export function generateStaticParams() {
  const params = [];
  for (const locale of ['en', 'zh', 'id']) {
    for (const product of productsData) {
      params.push({ locale, slug: product.slug });
    }
  }
  return params;
}

export default async function ProductDetailPage({ params: { locale, slug } }) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'products' });
  const product = productsData.find(p => p.slug === slug);
  if (!product) notFound();

  const name = product.name[locale] || product.name.en;
  const features = product.features[locale] || product.features.en;
  const description = product.description[locale] || product.description.en;
  const applications = product.applications[locale] || product.applications.en;
  const icons = { respiratory: '🫁', catheter: '🩺', protection: '🥼' };
  const waMsg = encodeURIComponent('Hi Nova Link China,\nI am interested in: ' + name + ' (' + product.model + ')\nCompany: \nQuantity: \nMessage: ');

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/products" className="text-sm text-gray-500 hover:text-[#00a651] transition-colors">{t('back')}</Link>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="h-80 md:h-96 bg-gradient-to-br from-[#dbe4ff] to-[#eef2ff] rounded-2xl flex items-center justify-center text-8xl">
            {icons[product.category] || '📦'}
          </div>
          <div>
            <span className="text-xs font-semibold text-[#00a651] bg-green-50 px-3 py-1 rounded-full">{product.model}</span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-4 mb-4">{name}</h1>
            <p className="text-gray-600 leading-relaxed mb-6">{description}</p>
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-gray-800 mb-4">{t('specifications')}</h3>
              <table className="w-full text-sm">
                <tbody>
                  {product.specs.map((spec, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-transparent'}>
                      <td className="py-2.5 px-3 font-medium text-gray-700 w-1/3">{spec.key}</td>
                      <td className="py-2.5 px-3 text-gray-600">{spec.value[locale] || spec.value.en}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">{t('features')}</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {features.map((f, i) => (
                  <li key={i} className="flex items-center text-sm text-gray-600"><span className="text-[#00a651] mr-2">✓</span>{f}</li>
                ))}
              </ul>
            </div>
            <div className="mb-8">
              <h3 className="font-semibold text-gray-800 mb-3">{t('applications')}</h3>
              <div className="flex flex-wrap gap-2">
                {applications.map((app, i) => (
                  <span key={i} className="px-3 py-1.5 bg-[#eef2ff] text-[#1a365d] text-sm rounded-lg">{app}</span>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={'/contact?product=' + product.slug} className="inline-flex items-center px-6 py-3 bg-[#00a651] hover:bg-[#008c44] text-white rounded-lg font-semibold transition-colors">
                📩 {t('send_inquiry')}
              </Link>
              <a href={'https://wa.me/861234567890?text=' + waMsg} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-6 py-3 bg-[#25D366] hover:bg-[#1ebe5c] text-white rounded-lg font-semibold transition-colors">
                💬 {t('whatsapp')}
              </a>
            </div>
          </div>
        </div>
        <div className="mt-16">
          <InquirySection locale={locale} productName={name} productSlug={product.slug} />
        </div>
        <div className="mt-16 border-t border-gray-100 pt-12">
          <h2 className="text-2xl font-bold text-[#1a365d] mb-6">{t('related')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {productsData.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3).map(rel => (
              <Link key={rel.id} href={'/products/' + rel.slug} className="group p-4 border border-gray-100 rounded-xl hover:shadow-sm transition-shadow">
                <div className="text-4xl mb-3">{icons[rel.category] || '📦'}</div>
                <h4 className="font-semibold text-gray-800 group-hover:text-[#00a651] transition-colors">{rel.name[locale] || rel.name.en}</h4>
                <p className="text-xs text-gray-400 mt-1">{rel.model}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
