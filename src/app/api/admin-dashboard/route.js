// Admin dashboard - standalone HTML, no Next.js routing
// Reads auth cookie to verify login
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

function htmlPage(title, content) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} — Nova Link China</title>
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif; background:#f8fafc; color:#334155; }
.nav { background:#0f1b33; padding:0 20px; display:flex; align-items:center; justify-content:space-between; height:56px; }
.nav a { color:rgba(255,255,255,0.6); font-size:14px; text-decoration:none; margin-left:20px; }
.nav a:hover { color:#fff; }
.nav .brand { color:#fff; font-weight:700; font-size:14px; }
.main { max-width:1200px; margin:0 auto; padding:32px 20px; }
h1 { font-size:24px; color:#1a365d; margin-bottom:24px; }
.card { background:#fff; border:1px solid #f1f5f9; border-radius:12px; padding:24px; margin-bottom:16px; }
.grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:16px; margin-bottom:32px; }
.stat { text-align:center; }
.stat-value { font-size:32px; font-weight:700; }
.stat-label { font-size:13px; color:#94a3b8; margin-top:4px; }
table { width:100%; border-collapse:collapse; font-size:14px; }
th { text-align:left; padding:10px 16px; border-bottom:1px solid #f1f5f9; background:#f8fafc; font-weight:600; color:#94a3b8; font-size:12px; text-transform:uppercase; }
td { padding:10px 16px; border-bottom:1px solid #f1f5f9; }
tr:hover { background:#f8fafc; }
.btn { display:inline-block; padding:8px 16px; border-radius:6px; font-size:13px; font-weight:600; text-decoration:none; border:none; cursor:pointer; }
.btn-primary { background:#00a651; color:#fff; }
.btn-primary:hover { background:#008c44; }
</style>
</head>
<body>
<div class="nav">
  <span class="brand">NLC Admin</span>
  <div>
    <a href="/api/admin-dashboard">控制台</a>
    <a href="/api/admin-products">产品管理</a>
    <a href="/api/admin-settings">设置</a>
    <a href="/api/admin-inquiries">询盘</a>
    <a href="/api/admin-logout">退出</a>
  </div>
</div>
<div class="main">
  ${content}
</div>
</body>
</html>`;
}

export async function GET(request) {
  // Check auth
  const token = request.cookies.get('nlc_admin')?.value;
  if (!token || !verifyToken(token)) {
    return NextResponse.redirect(new URL('/api/admin-login', request.url));
  }

  const content = `
    <h1>控制台</h1>
    <div class="grid">
      <div class="card stat">
        <div class="stat-value" style="color:#00a651" id="prodCount">-</div>
        <div class="stat-label">产品</div>
      </div>
      <div class="card stat">
        <div class="stat-value" style="color:#dc2626" id="inqCount">-</div>
        <div class="stat-label">询盘</div>
      </div>
    </div>

    <h2 style="font-size:18px;color:#1a365d;margin-bottom:16px">快捷操作</h2>
    <div style="display:flex;gap:12px;flex-wrap:wrap">
      <a href="/api/admin-products" class="btn btn-primary">📦 管理产品</a>
      <a href="/api/admin-settings" class="btn btn-primary">⚙️ 网站设置</a>
      <a href="/api/admin-inquiries" class="btn btn-primary">📩 查看询盘</a>
    </div>

    <script>
    fetch('/api/products').then(r=>r.json()).then(d => {
      document.getElementById('prodCount').textContent = d.length;
    }).catch(() => {});
    fetch('/api/inquiries').then(r=>r.json()).then(d => {
      if(Array.isArray(d)) document.getElementById('inqCount').textContent = d.length;
    }).catch(() => {});
    </script>
  `;

  return new Response(htmlPage('Dashboard', content), {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
