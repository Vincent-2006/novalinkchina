'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminSettings() {
  const [form, setForm] = useState({
    whatsapp: '', email: '', phone: '', address: '',
    hero_subtitle_en: '', hero_subtitle_zh: '', hero_subtitle_id: '',
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(data => {
      if (data.whatsapp) setForm(data);
    }).catch(() => {});
    fetch('/api/inquiries').then(r => { if (r.status === 401) router.push('/admin/login'); }).catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true); setMsg('');
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) setMsg('✅ 已保存，部署中...');
      else setMsg('❌ 保存失败');
    } catch { setMsg('❌ 保存失败'); }
    finally { setSaving(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav router={router} />
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-[#1a365d] mb-6">网站设置</h1>
        {msg && <div className="bg-blue-50 text-blue-700 text-sm p-4 rounded-lg mb-4">{msg}</div>}

        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <h2 className="font-bold text-[#1a365d] text-sm">联系方式</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs font-bold text-gray-400">WhatsApp</label><input className="w-full px-3 py-2 border rounded-lg text-sm mt-1" value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})} /></div>
            <div><label className="text-xs font-bold text-gray-400">Email</label><input className="w-full px-3 py-2 border rounded-lg text-sm mt-1" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
            <div><label className="text-xs font-bold text-gray-400">电话</label><input className="w-full px-3 py-2 border rounded-lg text-sm mt-1" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
            <div><label className="text-xs font-bold text-gray-400">地址</label><input className="w-full px-3 py-2 border rounded-lg text-sm mt-1" value={form.address} onChange={e => setForm({...form, address: e.target.value})} /></div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4 mt-4">
          <h2 className="font-bold text-[#1a365d] text-sm">首页副标题</h2>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="text-xs font-bold text-gray-400">English</label><textarea className="w-full px-3 py-2 border rounded-lg text-sm mt-1 h-20" value={form.hero_subtitle_en} onChange={e => setForm({...form, hero_subtitle_en: e.target.value})} /></div>
            <div><label className="text-xs font-bold text-gray-400">中文</label><textarea className="w-full px-3 py-2 border rounded-lg text-sm mt-1 h-20" value={form.hero_subtitle_zh} onChange={e => setForm({...form, hero_subtitle_zh: e.target.value})} /></div>
            <div><label className="text-xs font-bold text-gray-400">Indonesian</label><textarea className="w-full px-3 py-2 border rounded-lg text-sm mt-1 h-20" value={form.hero_subtitle_id} onChange={e => setForm({...form, hero_subtitle_id: e.target.value})} /></div>
          </div>
        </div>

        <button onClick={handleSave} disabled={saving}
          className="mt-6 px-6 py-2.5 bg-[#00a651] text-white rounded-lg font-semibold text-sm hover:bg-[#008c44] disabled:opacity-50">
          {saving ? '保存中...' : '💾 保存'}
        </button>
      </div>
    </div>
  );
}

function AdminNav({ router }) {
  const items = [
    { label: '控制台', href: '/admin/dashboard' },
    { label: '产品管理', href: '/admin/products' },
    { label: '网站设置', href: '/admin/settings' },
    { label: '询盘记录', href: '/admin/inquiries' },
  ];
  return (
    <nav className="bg-[#0f1b33] text-white">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-14">
        <div className="flex items-center gap-6">
          <span className="font-bold text-sm">NLC Admin</span>
          {items.map(item => (
            <button key={item.href} onClick={() => router.push(item.href)}
              className="text-sm text-gray-300 hover:text-white transition-colors">{item.label}</button>
          ))}
        </div>
      </div>
    </nav>
  );
}
