import { Link } from '@/navigation';

const footerContent = {
  en: {
    tagline: 'Your trusted sourcing partner connecting global buyers with premium Chinese manufacturers.',
    products: 'Products', company: 'Company',
    about: 'About Us', contact: 'Contact', certificates: 'Certificates',
    inquiry: 'Send Inquiry', rights: 'All rights reserved.',
    address: 'Zhengdong New District, Zhengzhou, Henan, China',
  },
  zh: {
    tagline: '您值得信赖的中国采购伙伴，连接全球买家与中国优质制造商。',
    products: '产品', company: '公司',
    about: '关于我们', contact: '联系我们', certificates: '资质证书',
    inquiry: '发送询盘', rights: '保留所有权利。',
    address: '中国河南省郑州市郑东新区',
  },
  id: {
    tagline: 'Mitra sourcing tepercaya Anda yang menghubungkan pembeli global dengan produsen China berkualitas.',
    products: 'Produk', company: 'Perusahaan',
    about: 'Tentang Kami', contact: 'Kontak', certificates: 'Sertifikat',
    inquiry: 'Kirim Inquiry', rights: 'Hak cipta dilindungi.',
    address: 'Zhengdong New District, Zhengzhou, Henan, China',
  },
};

export default function Footer({ locale }) {
  const t = footerContent[locale] || footerContent.en;
  return (
    <footer className="bg-[#0f1b33] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#00a651] flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <div>
                <span className="font-bold text-xl">Nova</span>
                <span className="font-bold text-xl text-[#00a651]">Link</span>
                <span className="text-sm text-gray-400 ml-1">China</span>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">{t.tagline}</p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">{t.products}</h3>
            <ul className="space-y-2">
              <li><Link href="/products" className="text-gray-300 hover:text-white text-sm transition-colors">Anesthesia Mask</Link></li>
              <li><Link href="/products" className="text-gray-300 hover:text-white text-sm transition-colors">Oxygen Mask</Link></li>
              <li><Link href="/products" className="text-gray-300 hover:text-white text-sm transition-colors">Breathing Circuit</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">{t.company}</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-300 hover:text-white text-sm transition-colors">{t.about}</Link></li>
              <li><Link href="/certificates" className="text-gray-300 hover:text-white text-sm transition-colors">{t.certificates}</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white text-sm transition-colors">{t.contact}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">{t.contact}</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start space-x-2"><span>📍</span><span>{t.address}</span></li>
              <li className="flex items-center space-x-2"><span>📞</span><span>+86 371-xxxxxxx</span></li>
              <li className="flex items-center space-x-2"><span>📧</span><span>info@novalinkchina.com</span></li>
              <li className="flex items-center space-x-2">
                <span>💬</span>
                <a href="https://wa.me/861234567890" target="_blank" rel="noopener noreferrer" className="text-[#00a651] hover:text-[#00c85e]">WhatsApp</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-600 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">&copy; 2024 Nova Link China. {t.rights}</p>
          <Link href="/contact" className="mt-4 md:mt-0 inline-flex items-center px-5 py-2 bg-[#00a651] hover:bg-[#008c44] text-white text-sm rounded-lg font-medium transition-colors">
            💬 {t.inquiry}
          </Link>
        </div>
      </div>
    </footer>
  );
}
