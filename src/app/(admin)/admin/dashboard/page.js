'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, inquiries: 0 });
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(data => {
      setStats(s => ({ ...s, products: data.length }));
    }).catch(() => {});
    fetch('/api/inquiries').then(r => {
      if (r.status === 401) { router.push('/admin/login'); return null; }
      return r.json();
    }).then(data => {
      if (data) setStats(s => ({ ...s, inquiries: data.length }));
    }).catch(() => {}).finally(() => setChecking(false));
  }, []);

  if (checking) return <div className="min-h-screen flex items-center justify-center text-gray-400">验证中...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-[#1a365d] mb-6">控制台</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100">
            <div className="text-3xl font-bold text-[#1a365d]">{stats.products}</div>
            <div className="text-sm text-gray-400 mt-1">产品</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100">
            <div className="text-3xl font-bold text-[#dc2626]">{stats.inquiries}</div>
            <div className="text-sm text-gray-400 mt-1">询盘</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100">
            <div className="text-3xl font-bold text-[#00a651]">3</div>
            <div className="text-sm text-gray-400 mt-1">语言</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminNav() {
  const router = useRouter();
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
              className="text-sm text-gray-300 hover:text-white transition-colors">
              {item.label}
            </button>
          ))}
        </div>
        <button onClick={() => router.push('/')} className="text-xs text-gray-400 hover:text-white">← 网站首页</button>
      </div>
    </nav>
  );
}
