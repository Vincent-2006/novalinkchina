'use client';
import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [view, setView] = useState('loading');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [products, setProducts] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [settings, setSettings] = useState({});
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/inquiries').then(r => {
      if (r.status === 401) { setView('login'); return null; }
      return r.json();
    }).then(d => {
      if (d) { setInquiries(d); setView('dashboard'); }
    }).catch(() => setView('login'));
    fetch('/api/products').then(r => r.json()).then(d => setProducts(d)).catch(() => {});
    fetch('/api/settings').then(r => r.json()).then(d => setSettings(d)).catch(() => {});
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); setView('loading');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) { setView('dashboard'); window.location.reload(); }
      else { const d = await res.json(); setError(d.error || '密码错误'); setView('login'); }
    } catch { setError('登录失败'); setView('login'); }
  };

  if (view === 'login') return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#f8fafc',fontFamily:'sans-serif'}}>
      <div style={{background:'#fff',padding:32,borderRadius:16,border:'1px solid #f1f5f9',width:360}}>
        <div style={{width:48,height:48,borderRadius:12,background:'#00a651',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:20,margin:'0 auto 12px'}}>Y</div>
        <h1 style={{textAlign:'center',fontSize:20,color:'#1a365d',marginBottom:4}}>后台管理</h1>
        <p style={{textAlign:'center',fontSize:14,color:'#94a3b8',marginBottom:24}}>Nova Link China</p>
        {error && <div style={{color:'#dc2626',fontSize:14,marginBottom:16,padding:'8px 12px',background:'#fef2f2',borderRadius:8}}>{error}</div>}
        <form onSubmit={handleLogin}>
          <input type="password" placeholder="管理员密码" value={password} onChange={e => setPassword(e.target.value)}
            style={{width:'100%',padding:'12px 16px',border:'1px solid #e2e8f0',borderRadius:8,fontSize:14,marginBottom:16,outline:'none',boxSizing:'border-box'}} autoFocus />
          <button type="submit" style={{width:'100%',padding:12,background:'#1a365d',color:'#fff',border:'none',borderRadius:8,fontSize:14,fontWeight:600,cursor:'pointer'}}>登录</button>
        </form>
        <a href="/" style={{display:'block',textAlign:'center',fontSize:14,color:'#94a3b8',marginTop:16}}>← 返回首页</a>
      </div>
    </div>
  );

  if (view === 'loading') return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',color:'#94a3b8',fontFamily:'sans-serif'}}>验证中...</div>;

  const Nav = () => (
    <nav style={{background:'#0f1b33',display:'flex',alignItems:'center',justifyContent:'space-between',height:56,padding:'0 20px',fontFamily:'sans-serif'}}>
      <span style={{color:'#fff',fontWeight:700,fontSize:14}}>NLC Admin</span>
      <div style={{display:'flex',gap:20}}>
        {[
          {k:'dashboard',l:'控制台'},{k:'products',l:'产品'},{k:'inquiries',l:'询盘'},{k:'settings',l:'设置'},
        ].map(n => (
          <button key={n.k} onClick={() => setView(n.k)}
            style={{background:'none',border:'none',color:view===n.k?'#fff':'rgba(255,255,255,0.5)',fontSize:14,cursor:'pointer',fontWeight:view===n.k?600:400}}>
            {n.l}
          </button>
        ))}
      </div>
      <a href="/" style={{color:'rgba(255,255,255,0.4)',fontSize:13,textDecoration:'none'}}>网站 →</a>
    </nav>
  );

  if (view === 'dashboard') return (
    <div style={{background:'#f8fafc',minHeight:'100vh',fontFamily:'sans-serif'}}>
      <Nav />
      <div style={{maxWidth:1200,margin:'0 auto',padding:'32px 20px'}}>
        <h1 style={{fontSize:24,color:'#1a365d',marginBottom:24}}>控制台</h1>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:32}}>
          <div style={{background:'#fff',border:'1px solid #f1f5f9',borderRadius:12,padding:24,textAlign:'center'}}>
            <div style={{fontSize:32,fontWeight:700,color:'#00a651'}}>{products.length}</div>
            <div style={{fontSize:13,color:'#94a3b8',marginTop:4}}>产品</div>
          </div>
          <div style={{background:'#fff',border:'1px solid #f1f5f9',borderRadius:12,padding:24,textAlign:'center'}}>
            <div style={{fontSize:32,fontWeight:700,color:'#dc2626'}}>{inquiries.length}</div>
            <div style={{fontSize:13,color:'#94a3b8',marginTop:4}}>询盘</div>
          </div>
          <div style={{background:'#fff',border:'1px solid #f1f5f9',borderRadius:12,padding:24,textAlign:'center'}}>
            <div style={{fontSize:32,fontWeight:700,color:'#1a365d'}}>3</div>
            <div style={{fontSize:13,color:'#94a3b8',marginTop:4}}>语言</div>
          </div>
        </div>
      </div>
    </div>
  );

  if (view === 'products') return (
    <div style={{background:'#f8fafc',minHeight:'100vh',fontFamily:'sans-serif'}}>
      <Nav />
      <div style={{maxWidth:1200,margin:'0 auto',padding:'32px 20px'}}>
        <h1 style={{fontSize:24,color:'#1a365d',marginBottom:24}}>产品管理 ({products.length})</h1>
        <div style={{background:'#fff',border:'1px solid #f1f5f9',borderRadius:12,overflow:'hidden'}}>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:14}}>
            <thead>
              <tr style={{background:'#f8fafc',textAlign:'left'}}>
                <th style={{padding:'10px 16px',fontSize:12,color:'#94a3b8',textTransform:'uppercase'}}>产品名</th>
                <th style={{padding:'10px 16px',fontSize:12,color:'#94a3b8',textTransform:'uppercase'}}>分类</th>
                <th style={{padding:'10px 16px',fontSize:12,color:'#94a3b8',textTransform:'uppercase'}}>Model</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.slug} style={{borderTop:'1px solid #f1f5f9'}}>
                  <td style={{padding:'10px 16px',color:'#1a365d',fontWeight:500}}>{p.name?.en}</td>
                  <td style={{padding:'10px 16px',color:'#94a3b8'}}>{p.category}</td>
                  <td style={{padding:'10px 16px',color:'#94a3b8'}}>{p.model}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  if (view === 'inquiries') return (
    <div style={{background:'#f8fafc',minHeight:'100vh',fontFamily:'sans-serif'}}>
      <Nav />
      <div style={{maxWidth:1200,margin:'0 auto',padding:'32px 20px'}}>
        <h1 style={{fontSize:24,color:'#1a365d',marginBottom:24}}>询盘记录 ({inquiries.length})</h1>
        {inquiries.length === 0 ? <p style={{color:'#94a3b8'}}>暂无询盘</p> :
        <div style={{background:'#fff',border:'1px solid #f1f5f9',borderRadius:12,overflow:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
            <thead>
              <tr style={{background:'#f8fafc',textAlign:'left'}}>
                <th style={{padding:'10px 16px',fontSize:12,color:'#94a3b8',textTransform:'uppercase'}}>日期</th>
                <th style={{padding:'10px 16px',fontSize:12,color:'#94a3b8',textTransform:'uppercase'}}>姓名</th>
                <th style={{padding:'10px 16px',fontSize:12,color:'#94a3b8',textTransform:'uppercase'}}>公司</th>
                <th style={{padding:'10px 16px',fontSize:12,color:'#94a3b8',textTransform:'uppercase'}}>邮箱</th>
                <th style={{padding:'10px 16px',fontSize:12,color:'#94a3b8',textTransform:'uppercase'}}>产品</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((i, idx) => (
                <tr key={idx} style={{borderTop:'1px solid #f1f5f9'}}>
                  <td style={{padding:'10px 16px',color:'#94a3b8'}}>{(i.created_at||'').slice(0,10)}</td>
                  <td style={{padding:'10px 16px'}}>{i.name}</td>
                  <td style={{padding:'10px 16px',color:'#94a3b8'}}>{i.company||'-'}</td>
                  <td style={{padding:'10px 16px'}}>{i.email}</td>
                  <td style={{padding:'10px 16px',color:'#94a3b8'}}>{i.product||'-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>}
      </div>
    </div>
  );

  if (view === 'settings') return (
    <div style={{background:'#f8fafc',minHeight:'100vh',fontFamily:'sans-serif'}}>
      <Nav />
      <div style={{maxWidth:800,margin:'0 auto',padding:'32px 20px'}}>
        <h1 style={{fontSize:24,color:'#1a365d',marginBottom:24}}>网站设置</h1>
        {msg && <div style={{padding:'10px 16px',background:'#f0fdf4',border:'1px solid #bbf7d0',borderRadius:8,color:'#166534',fontSize:14,marginBottom:16}}>{msg}</div>}
        <form onSubmit={async (e) => {
          e.preventDefault();
          const fd = new FormData(e.target);
          const data = Object.fromEntries(fd);
          setMsg('保存中...');
          try {
            const res = await fetch('/api/settings', {
              method:'POST', headers:{'Content-Type':'application/json'},
              body: JSON.stringify(data),
            });
            if (res.ok) setMsg('✅ 已保存！Vercel自动部署中...');
            else setMsg('❌ 保存失败');
          } catch(e) { setMsg('❌ '+e.message); }
        }}>
          <div style={{background:'#fff',border:'1px solid #f1f5f9',borderRadius:12,padding:24}}>
            <h2 style={{fontSize:16,color:'#1a365d',marginBottom:16}}>联系方式</h2>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              {[{k:'whatsapp',l:'WhatsApp'},{k:'email',l:'Email'},{k:'phone',l:'电话'},{k:'address',l:'地址'}].map(f => (
                <div key={f.k}>
                  <label style={{display:'block',fontSize:12,color:'#94a3b8',marginBottom:4,textTransform:'uppercase',fontWeight:600}}>{f.l}</label>
                  <input name={f.k} defaultValue={settings[f.k]||''} style={{width:'100%',padding:'10px 14px',border:'1px solid #e2e8f0',borderRadius:8,fontSize:14,outline:'none',boxSizing:'border-box'}} />
                </div>
              ))}
            </div>
          </div>
          <button type="submit" style={{marginTop:16,padding:'10px 24px',background:'#00a651',color:'#fff',border:'none',borderRadius:8,fontSize:14,fontWeight:600,cursor:'pointer'}}>💾 保存</button>
        </form>
      </div>
    </div>
  );
}
