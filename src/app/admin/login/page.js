'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push('/admin/dashboard');
      } else {
        const data = await res.json();
        setError(data.error || '密码错误');
      }
    } catch {
      setError('登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-[#00a651] rounded-xl flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">Y</div>
          <h1 className="text-xl font-bold text-[#1a365d]">后台管理</h1>
          <p className="text-sm text-gray-400 mt-1">Nova Link China</p>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="管理员密码"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#00a651] focus:ring-1 focus:ring-[#00a651] outline-none text-sm mb-4"
            autoFocus
          />
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#1a365d] text-white rounded-lg font-semibold text-sm hover:bg-[#0f1b33] transition-colors disabled:opacity-50"
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </form>
        <a href="/" className="block text-center text-sm text-gray-400 mt-4 hover:text-[#00a651]">
          ← 返回首页
        </a>
      </div>
    </div>
  );
}
