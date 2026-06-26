import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { getInquiries } from '@/lib/data';

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
table{width:100%;border-collapse:collapse}
th{text-align:left;padding:10px 16px;border-bottom:1px solid #f1f5f9;background:#f8fafc;font-weight:600;color:#94a3b8;font-size:12px;text-transform:uppercase}
td{padding:10px 16px;border-bottom:1px solid #f1f5f9;font-size:13px}
tr:hover{background:#f8fafc}
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

  const inquiries = getInquiries();
  let rows = inquiries.map(i => `
    <tr>
      <td style="color:#94a3b8">${(i.created_at||'').slice(0,10)}</td>
      <td>${i.name}</td>
      <td>${i.company||'-'}</td>
      <td>${i.email}</td>
      <td>${i.product||'-'}</td>
      <td style="color:#94a3b8;max-width:200px;overflow:hidden;text-overflow:ellipsis">${(i.message||'').slice(0,60)}</td>
    </tr>
  `).join('') || '<tr><td colspan="6" style="text-align:center;color:#94a3b8">暂无询盘</td></tr>';

  const body = `
    <h1>询盘记录 (${inquiries.length})</h1>
    <div style="overflow-x:auto">
      <table>
        <thead><tr><th>日期</th><th>姓名</th><th>公司</th><th>邮箱</th><th>产品</th><th>留言</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;

  return new Response(page('Inquiries', body), {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
