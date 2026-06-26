'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // slug or 'new'
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const router = useRouter();

  const loadProducts = () => {
    fetch('/api/products').then(r => r.json()).then(data => {
      setProducts(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { loadProducts(); }, []);

  const checkAuth = async () => {
    const res = await fetch('/api/inquiries');
    if (res.status === 401) router.push('/admin/login');
  };
  useEffect(() => { checkAuth(); }, []);

  const handleSave = async () => {
    setSaving(true);
    setMsg('');
    try {
      let updated = [...products];
      if (editing === 'new') {
        updated.push(form);
      } else {
        updated = updated.map(p => p.slug === editing ? form : p);
      }
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        setMsg('✅ 已保存，Vercel 正在自动部署（约1-2分钟生效）');
        setEditing(null);
        setForm(null);
        loadProducts();
      } else {
        const data = await res.json();
        setMsg('❌ 保存失败: ' + (data.error || '未知错误'));
      }
    } catch (e) {
      setMsg('❌ 保存失败: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (product) => {
    setEditing(product.slug);
    setForm(JSON.parse(JSON.stringify(product)));
  };

  const startNew = () => {
    setEditing('new');
    setForm({
      id: 'new-product', slug: 'new-product', category: 'respiratory',
      name: { en: '', zh: '', id: '' },
      model: '', description: { en: '', zh: '', id: '' },
      features: { en: [], zh: [], id: [] },
      specs: [], applications: { en: [], zh: [], id: [] },
    });
  };

  const cancelEdit = () => { setEditing(null); setForm(null); };

  const categories = [...new Set(products.map(p => p.category))];
  const catNames = { respiratory: '🫁 呼吸麻醉', catheter: '🩺 导管引流', surgical: '🏥 手术包', protection: '🥼 防护' };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">加载中...</div>;

  // Edit mode
  if (editing && form) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNav router={router} />
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-[#1a365d]">{editing === 'new' ? '新增产品' : '编辑产品'}</h1>
            <button onClick={cancelEdit} className="text-sm text-gray-400 hover:text-gray-600">← 返回列表</button>
          </div>
          {msg && <div className="bg-blue-50 text-blue-700 text-sm p-4 rounded-lg mb-4">{msg}</div>}

          <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Slug</label>
                <input className="w-full px-3 py-2 border rounded-lg text-sm mt-1" value={form.slug}
                  onChange={e => setForm({...form, slug: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Model</label>
                <input className="w-full px-3 py-2 border rounded-lg text-sm mt-1" value={form.model}
                  onChange={e => setForm({...form, model: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">分类</label>
                <select className="w-full px-3 py-2 border rounded-lg text-sm mt-1" value={form.category}
                  onChange={e => setForm({...form, category: e.target.value})}>
                  {categories.map(c => <option key={c} value={c}>{catNames[c] || c}</option>)}
                  <option value="respiratory">🫁 呼吸麻醉</option>
                  <option value="catheter">🩺 导管引流</option>
                  <option value="surgical">🏥 手术包</option>
                  <option value="protection">🥼 防护</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div><label className="text-xs font-bold text-gray-400 uppercase">名称 (EN)</label><input className="w-full px-3 py-2 border rounded-lg text-sm mt-1" value={form.name.en} onChange={e => setForm({...form, name: {...form.name, en: e.target.value}})} /></div>
              <div><label className="text-xs font-bold text-gray-400 uppercase">名称 (ZH)</label><input className="w-full px-3 py-2 border rounded-lg text-sm mt-1" value={form.name.zh} onChange={e => setForm({...form, name: {...form.name, zh: e.target.value}})} /></div>
              <div><label className="text-xs font-bold text-gray-400 uppercase">名称 (ID)</label><input className="w-full px-3 py-2 border rounded-lg text-sm mt-1" value={form.name.id} onChange={e => setForm({...form, name: {...form.name, id: e.target.value}})} /></div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div><label className="text-xs font-bold text-gray-400 uppercase">描述 (EN)</label><textarea className="w-full px-3 py-2 border rounded-lg text-sm mt-1 h-20" value={form.description.en} onChange={e => setForm({...form, description: {...form.description, en: e.target.value}})} /></div>
              <div><label className="text-xs font-bold text-gray-400 uppercase">描述 (ZH)</label><textarea className="w-full px-3 py-2 border rounded-lg text-sm mt-1 h-20" value={form.description.zh} onChange={e => setForm({...form, description: {...form.description, zh: e.target.value}})} /></div>
              <div><label className="text-xs font-bold text-gray-400 uppercase">描述 (ID)</label><textarea className="w-full px-3 py-2 border rounded-lg text-sm mt-1 h-20" value={form.description.id} onChange={e => setForm({...form, description: {...form.description, id: e.target.value}})} /></div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div><label className="text-xs font-bold text-gray-400 uppercase">特点 (EN, 每行一个)</label><textarea className="w-full px-3 py-2 border rounded-lg text-sm mt-1 h-24" value={form.features.en.join('\n')} onChange={e => setForm({...form, features: {...form.features, en: e.target.value.split('\n')}})} /></div>
              <div><label className="text-xs font-bold text-gray-400 uppercase">特点 (ZH)</label><textarea className="w-full px-3 py-2 border rounded-lg text-sm mt-1 h-24" value={form.features.zh.join('\n')} onChange={e => setForm({...form, features: {...form.features, zh: e.target.value.split('\n')}})} /></div>
              <div><label className="text-xs font-bold text-gray-400 uppercase">特点 (ID)</label><textarea className="w-full px-3 py-2 border rounded-lg text-sm mt-1 h-24" value={form.features.id.join('\n')} onChange={e => setForm({...form, features: {...form.features, id: e.target.value.split('\n')}})} /></div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-[#00a651] text-white rounded-lg font-semibold text-sm hover:bg-[#008c44] disabled:opacity-50">
                {saving ? '保存中...' : '💾 保存'}
              </button>
              <button onClick={cancelEdit} className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-500">取消</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List mode
  const filtered = catFilter === 'all' ? products : products.filter(p => p.category === catFilter);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav router={router} />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#1a365d]">产品管理 ({products.length})</h1>
          <button onClick={startNew} className="px-4 py-2 bg-[#00a651] text-white rounded-lg text-sm font-semibold hover:bg-[#008c44]">+ 新增产品</button>
        </div>

        <div className="flex gap-2 mb-4 flex-wrap">
          <button onClick={() => setCatFilter('all')}
            className={`px-4 py-1.5 rounded-full text-sm ${catFilter === 'all' ? 'bg-[#1a365d] text-white' : 'bg-white border text-gray-500'}`}>全部</button>
          {categories.map(c => (
            <button key={c} onClick={() => setCatFilter(c)}
              className={`px-4 py-1.5 rounded-full text-sm ${catFilter === c ? 'bg-[#1a365d] text-white' : 'bg-white border text-gray-500'}`}>
              {catNames[c] || c}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 text-gray-400 font-semibold text-xs uppercase">产品名</th>
                <th className="px-4 py-3 text-gray-400 font-semibold text-xs uppercase">分类</th>
                <th className="px-4 py-3 text-gray-400 font-semibold text-xs uppercase">Model</th>
                <th className="px-4 py-3 text-gray-400 font-semibold text-xs uppercase">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.slug} className="border-t border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-[#1a365d]">{p.name.en}</td>
                  <td className="px-4 py-3 text-gray-500">{catNames[p.category] || p.category}</td>
                  <td className="px-4 py-3 text-gray-400">{p.model}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => startEdit(p)} className="text-[#00a651] hover:underline text-xs">编辑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
