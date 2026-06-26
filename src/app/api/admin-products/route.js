import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { getProducts, githubCommit } from '@/lib/data';

function page(title, body) {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<title>${title} — Nova Link China</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#f8fafc;color:#334155;font-size:14px}
.nav{background:#0f1b33;padding:0 20px;display:flex;align-items:center;justify-content:space-between;height:56px}
.nav a{color:rgba(255,255,255,0.6);font-size:14px;text-decoration:none;margin-left:20px}
.nav a:hover{color:#fff}
.nav .brand{color:#fff;font-weight:700;font-size:14px}
.main{max-width:1200px;margin:0 auto;padding:32px 20px}
h1{font-size:24px;color:#1a365d;margin-bottom:24px}
.card{background:#fff;border:1px solid #f1f5f9;border-radius:12px;padding:24px;margin-bottom:16px}
table{width:100%;border-collapse:collapse}
th{text-align:left;padding:10px 16px;border-bottom:1px solid #f1f5f9;background:#f8fafc;font-weight:600;color:#94a3b8;font-size:12px;text-transform:uppercase}
td{padding:10px 16px;border-bottom:1px solid #f1f5f9}
tr:hover{background:#f8fafc}
.btn{display:inline-block;padding:8px 16px;border-radius:6px;font-size:13px;font-weight:600;text-decoration:none;cursor:pointer;border:none}
.btn-primary{background:#00a651;color:#fff}
.btn-sm{font-size:12px;padding:4px 12px}
.mr-2{margin-right:8px}
</style></head><body>
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
<div class="main">${body}</div></body></html>`;
}

export async function GET(request) {
  const token = request.cookies.get('nlc_admin')?.value;
  if (!token || !verifyToken(token)) {
    return NextResponse.redirect(new URL('/api/admin-login', request.url));
  }

  const products = getProducts();
  let rows = products.map(p => `
    <tr>
      <td>${p.name?.en || '?'}</td>
      <td style="color:#94a3b8">${p.category}</td>
      <td style="color:#94a3b8">${p.model || '-'}</td>
    </tr>
  `).join('');

  const body = `
    <h1>产品管理 (${products.length})</h1>
    <div class="card">
      <table>
        <thead><tr><th>产品名</th><th>分类</th><th>Model</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <p style="color:#94a3b8;font-size:13px;text-align:center">产品编辑功能在建设中，当前可通过 GitHub 直接编辑 products.json</p>
  `;

  return new Response(page('Products', body), {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
