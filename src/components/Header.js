'use client';

import { Link, usePathname } from '@/navigation';
import { useState } from 'react';

const navItems = {
  en: [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Certificates', href: '/certificates' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  zh: [
    { label: '首页', href: '/' },
    { label: '产品', href: '/products' },
    { label: '资质证书', href: '/certificates' },
    { label: '关于我们', href: '/about' },
    { label: '联系我们', href: '/contact' },
  ],
  id: [
    { label: 'Beranda', href: '/' },
    { label: 'Produk', href: '/products' },
    { label: 'Sertifikat', href: '/certificates' },
    { label: 'Tentang', href: '/about' },
    { label: 'Kontak', href: '/contact' },
  ],
};

export default function Header({ locale }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const items = navItems[locale] || navItems.en;

  const locales = [
    { code: 'en', label: 'EN' },
    { code: 'zh', label: '中文' },
    { code: 'id', label: 'ID' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="hidden md:flex justify-end items-center py-1 border-b border-gray-100">
          <span className="text-sm text-gray-500 mr-4">📞 +86 371-6685 1110</span>
        </div>
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-[#00a651] flex items-center justify-center">
              <span className="text-white font-bold text-lg">Y</span>
            </div>
            <div>
              <span className="font-bold text-xl text-[#1a365d]">盈适葆</span>
              <span className="text-sm text-gray-400 ml-1">Yingshibao</span>
            </div>
          </Link>
          <nav className="hidden lg:flex items-center space-x-1">
            {items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}
                  className={'px-4 py-2 rounded-lg text-sm font-medium transition-colors ' + (isActive ? 'text-[#00a651] bg-green-50' : 'text-gray-600 hover:text-[#1a365d] hover:bg-gray-50')}>
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center space-x-1 border-r border-gray-200 pr-3">
              {locales.map((l) => (
                <Link key={l.code} href={'/'} locale={l.code}
                  className={'px-2 py-1 text-xs rounded ' + (locale === l.code ? 'bg-[#1a365d] text-white' : 'text-gray-500 hover:text-gray-700')}>
                  {l.label}
                </Link>
              ))}
            </div>
            <Link href="/contact" className="hidden lg:inline-flex items-center px-5 py-2.5 rounded-lg font-semibold text-white bg-[#00a651] hover:bg-[#008c44] transition-all text-sm">
              {locale === 'zh' ? '发送询盘' : locale === 'id' ? 'Kirim Inquiry' : 'Send Inquiry'}
            </Link>
            <button className="lg:hidden p-2 text-gray-600" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4">
            <nav className="flex flex-col space-y-2">
              {items.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                  className={'px-4 py-2 rounded-lg text-sm font-medium ' + (pathname === item.href ? 'text-[#00a651] bg-green-50' : 'text-gray-600')}>
                  {item.label}
                </Link>
              ))}
              <div className="flex items-center space-x-2 px-4 pt-2 border-t border-gray-100 mt-2">
                {locales.map((l) => (
                  <Link key={l.code} href={'/'} locale={l.code} onClick={() => setMobileOpen(false)}
                    className={'px-3 py-1.5 text-xs rounded ' + (locale === l.code ? 'bg-[#1a365d] text-white' : 'bg-gray-100 text-gray-600')}>
                    {l.label}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
