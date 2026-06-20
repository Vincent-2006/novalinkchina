'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function InquirySection({ locale, productName, productSlug }) {
  const t = useTranslations('contact');
  const [form, setForm] = useState({
    name: '', company: '', email: '', phone: '', quantity: '', message: ''
  });

  const BRAIN_API = 'https://120.79.137.134:8010';
  const waNumber = '8615038302121';
  const waMessage = encodeURIComponent(
    'Hi Nova Link China,' +
    '\nI am interested in: ' + (productName || 'your products') +
    '\nName: ' + form.name +
    '\nCompany: ' + form.company +
    '\nPhone: ' + form.phone +
    '\nQuantity: ' + form.quantity +
    '\nMessage: ' + form.message
  );

  const syncToBrain = async () => {
    try {
      await fetch('http://120.79.137.134:8010/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          company: form.company,
          email: form.email,
          phone: form.phone,
          quantity: form.quantity,
          message: form.message,
          product_name: productName || '',
          product_slug: productSlug || '',
          source: 'novalinkchina.com'
        })
      });
    } catch(e) {
      console.log('Brain sync:', e.message);
    }
  };

  return (
    <div className="bg-gray-50 rounded-2xl p-8 md:p-10">
      <h2 className="text-2xl font-bold text-[#1a365d] mb-2">
        {productName ? '📩 Inquiry: ' + productName : '📩 ' + t('title')}
      </h2>
      <p className="text-gray-500 text-sm mb-8">{t('subtitle')}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <input placeholder={t('form.name')} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#00a651] focus:ring-1 focus:ring-[#00a651] outline-none text-sm" />
        <input placeholder={t('form.company')} value={form.company} onChange={e => setForm({ ...form, company: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#00a651] focus:ring-1 focus:ring-[#00a651] outline-none text-sm" />
        <input placeholder={t('form.email')} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#00a651] focus:ring-1 focus:ring-[#00a651] outline-none text-sm" />
        <input placeholder={t('form.phone')} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#00a651] focus:ring-1 focus:ring-[#00a651] outline-none text-sm" />
        <input placeholder={t('form.quantity')} value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#00a651] focus:ring-1 focus:ring-[#00a651] outline-none text-sm" />
      </div>
      <textarea placeholder={t('form.message')} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#00a651] focus:ring-1 focus:ring-[#00a651] outline-none text-sm mt-5 h-24" />
      <div className="flex flex-wrap gap-3 mt-6">
        <button onClick={() => { syncToBrain(); window.open('https://wa.me/' + waNumber + '?text=' + waMessage, '_blank'); }}
          className="inline-flex items-center px-6 py-3 bg-[#25D366] hover:bg-[#1ebe5c] text-white rounded-lg font-semibold transition-colors">
          💬 {t('form.submit_whatsapp')}
        </button>
        <button onClick={() => {
          syncToBrain();
          const mailto = 'mailto:jdswj2006@gmail.com?subject=Inquiry: ' + (productName || '') +
            '&body=Name: ' + form.name + '%0ACompany: ' + form.company + '%0AEmail: ' + form.email +
            '%0APhone: ' + form.phone + '%0AQuantity: ' + form.quantity + '%0AMessage: ' + form.message;
          window.location.href = mailto;
        }}
          className="inline-flex items-center px-6 py-3 bg-[#1a365d] hover:bg-[#0f1b33] text-white rounded-lg font-semibold transition-colors">
          📧 {t('form.submit_email')}
        </button>
      </div>
    </div>
  );
}
