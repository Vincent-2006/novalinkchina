'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/inquiries').then(r => {
      if (r.status === 401) { router.push('/admin/login'); return null; }
      return r.json();
    }).then(data => {
      if (data) setInquiries(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">加载中...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav router={router} />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-[#1a365d] mb-6">询盘记录 ({inquiries.length})</h1>

        {inquiries.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-400">暂无询盘</div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-4 py-3 text-gray-400 font-semibold text-xs uppercase">时间</th>
                  <th className="px-4 py-3 text-gray-400 font-semibold text-xs uppercase">姓名</th>
                  <th className="px-4 py-3 text-gray-400 font-semibold text-xs uppercase">公司</th>
                  <th className="px-4 py-3 text-gray-400 font-semibold text-xs uppercase">邮箱</th>
                  <th className="px-4 py-3 text-gray-400 font-semibold text-xs uppercase">产品</th>
                  <th className="px-4 py-3 text-gray-400 font-semibold text-xs uppercase">留言</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inq, i) => (
                  <tr key={i} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-400 text-xs">{inq.created_at?.slice(0, 10)}</td>
                    <td className="px-4 py-3 font-medium">{inq.name}</td>
                    <td className="px-4 py-3 text-gray-500">{inq.company}</td>
                    <td className="px-4 py-3 text-gray-500">{inq.email}</td>
                    <td className="px-4 py-3 text-gray-500">{inq.product}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs max-w-[200px] truncate">{inq.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
