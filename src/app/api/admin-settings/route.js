import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { githubCommit } from '@/lib/data';
import fs from 'fs';
import path from 'path';

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
.main{max-width:800px;margin:0 auto;padding:32px 20px}
h1{font-size:24px;color:#1a365d;margin-bottom:24px}
.card{background:#fff;border:1px solid #f1f5f9;border-radius:12px;padding:24px;margin-bottom:16px}
label{display:block;font-size:12px;color:#94a3b8;font-weight:600;text-transform:uppercase;margin-bottom:4px}
input,textarea{width:100%;padding:10px 14px;border:1px solid #e2e8f0;border-radius:8px;font-size:14px;outline:none;box-sizing:border-box;font-family:inherit}
input:focus,textarea:focus{border-color:#00a651}
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.btn{display:inline-block;padding:10px 24px;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none;cursor:pointer;border:none}
.btn-primary{background:#00a651;color:#fff}
.mt-4{margin-top:16px}
.msg{display:none;padding:10px 16px;border-radius:8px;margin-bottom:16px;font-size:14px}
.msg-success{background:#f0fdf4;color:#166534;border:1px solid #bbf7d0}
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

  const settingsPath = path.join(process.cwd(), 'src', 'data', 'settings.json');
  let settings = {};
  try { settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8')); } catch {}

  const body = `
    <h1>网站设置</h1>
    <div id="msg" class="msg"></div>
    <form id="settingsForm">
      <div class="card">
        <h2 style="font-size:16px;color:#1a365d;margin-bottom:16px">联系方式</h2>
        <div class="form-grid">
          <div><label>WhatsApp</label><input name="whatsapp" value="${settings.whatsapp||''}"></div>
          <div><label>Email</label><input name="email" value="${settings.email||''}"></div>
          <div><label>电话</label><input name="phone" value="${settings.phone||''}"></div>
          <div><label>地址</label><input name="address" value="${settings.address||''}"></div>
        </div>
      </div>
      <button type="submit" class="btn btn-primary mt-4">💾 保存</button>
    </form>
    <script>
    document.getElementById('settingsForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      const fd = new FormData(this);
      const data = Object.fromEntries(fd.entries());
      const msg = document.getElementById('msg');
      msg.className = 'msg';
      msg.style.display = 'block';
      msg.textContent = '保存中...';
      try {
        const res = await fetch('/api/settings', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify(data)
        });
        if (res.ok) {
          msg.className = 'msg msg-success';
          msg.textContent = '✅ 已保存，Vercel自动部署中(约1-2分钟)';
        } else {
          msg.className = 'msg msg-error';
          msg.textContent = '❌ 保存失败';
        }
      } catch(e) {
        msg.textContent = '❌ ' + e.message;
      }
    });
    </script>
  `;

  return new Response(page('Settings', body), {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
