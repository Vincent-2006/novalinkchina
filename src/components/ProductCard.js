import { Link } from '@/navigation';

export default function ProductCard({ product, locale }) {
  const name = product.name[locale] || product.name.en;
  const features = product.features[locale] || product.features.en;
  const model = product.model;
  const icons = { respiratory: '🫁', catheter: '🩺', protection: '🥼' };

  return (
    <Link href={'/products/' + product.slug}
      className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden">
      <div className="h-52 bg-gradient-to-br from-[#dbe4ff] to-gray-100 flex items-center justify-center text-6xl opacity-30 group-hover:opacity-50 transition-opacity">
        {icons[product.category] || '📦'}
      </div>
      <div className="p-5">
        <span className="text-xs font-medium text-[#00a651] bg-green-50 px-2 py-1 rounded">{model}</span>
        <h3 className="text-lg font-semibold text-gray-800 mt-2 mb-2 group-hover:text-[#1a365d] transition-colors">{name}</h3>
        <ul className="space-y-1">
          {features.slice(0, 3).map((f, i) => (
            <li key={i} className="text-sm text-gray-500 flex items-center"><span className="mr-2 text-[#00a651]">✓</span>{f}</li>
          ))}
        </ul>
      </div>
    </Link>
  );
}
