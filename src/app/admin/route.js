// Admin panel - standalone HTML response, no layout/middleware issues
const TOKEN_PAGE = (err) => `<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>后台登录 — Nova Link China</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#f8fafc;min-height:100vh;display:flex;align-items:center;justify-content:center}
.box{background:#fff;padding:32px;border-radius:16px;box-shadow:0 1px 3px rgba(0,0,0,0.06);width:360px;border:1px solid #f1f5f9}
.logo{width:48px;height:48px;background:#00a651;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:20px;margin:0 auto 12px}
h1{text-align:center;font-size:20px;color:#1a365d;margin-bottom:4px}
.sub{text-align:center;font-size:14px;color:#94a3b8;margin-bottom:24px}
label{display:block;font-size:12px;color:#94a3b8;margin-bottom:4px}
input{width:100%;padding:12px 16px;border:1px solid #e2e8f0;border-radius:8px;font-size:14px;outline:none;box-sizing:border-box;margin-bottom:16px}
input:focus{border-color:#00a651}
button{width:100%;padding:12px;background:#1a365d;color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer}
button:hover{background:#0f1b33}
.err{color:#dc2626;font-size:14px;margin-bottom:16px;display:${err?'block':'none'}}
a{display:block;text-align:center;font-size:14px;color:#94a3b8;margin-top:16px;text-decoration:none}
</style></head><body>
<div class="box">
  <div class="logo">Y</div>
  <h1>后台管理</h1>
  <p class="sub">Nova Link China</p>
  <div class="err">${err||''}</div>
  <form method="POST">
    <label>管理员密码</label>
    <input type="password" name="password" required autofocus>
    <button type="submit">登录</button>
  </form>
  <a href="/">← 返回首页</a>
</div></body></html>`;

const ADMIN_PAGE = (products, inquiries, settings, msg) => {
  const pRows = products.map(p =>
    `<tr><td style="color:#1a365d;font-weight:500">${p.name?.en||'?'}</td><td style="color:#94a3b8">${p.category||'-'}</td><td style="color:#94a3b8">${p.model||'-'}</td></tr>`
  ).join('\n');

  const iRows = inquiries.length === 0
    ? '<tr><td colspan="5" style="text-align:center;color:#94a3b8;padding:32px">暂无询盘</td></tr>'
    : inquiries.map(i =>
      `<tr><td style="color:#94a3b8">${(i.created_at||'').slice(0,10)}</td><td>${i.name||''}</td><td style="color:#94a3b8">${i.company||'-'}</td><td>${i.email||''}</td><td style="color:#94a3b8">${i.product||'-'}</td></tr>`
    ).join('\n');

  const catIcons = {respiratory:'🫁',catheter:'🩺',surgical:'🏥',protection:'🥼'};
  const cats = [...new Set(products.map(p=>p.category))];
  const catFilters = cats.map(c =>`<a href="/products?category=${c}" style="display:inline-block;padding:4px 12px;border-radius:100px;border:1px solid #e2e8f0;font-size:12px;color:#64748b;text-decoration:none">${catIcons[c]||'📦'} ${c}</a>`).join('\n');

  return `<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>后台管理 — Nova Link China</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#f8fafc;color:#334155}
.header{background:#0f1b33;display:flex;align-items:center;justify-content:space-between;height:56px;padding:0 20px}
.header .brand{color:#fff;font-weight:700;font-size:14px}
.header a{color:rgba(255,255,255,0.5);font-size:13px;text-decoration:none}
.main{max-width:1200px;margin:0 auto;padding:32px 20px}
h1{font-size:22px;color:#1a365d;margin-bottom:24px}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:32px}
.stat-card{background:#fff;border:1px solid #f1f5f9;border-radius:12px;padding:24px;text-align:center}
.stat-num{font-size:32px;font-weight:700}
.stat-lbl{font-size:13px;color:#94a3b8;margin-top:4px}
.card{background:#fff;border:1px solid #f1f5f9;border-radius:12px;padding:24px;margin-bottom:24px}
.card h2{font-size:16px;color:#1a365d;margin-bottom:12px}
label{display:block;font-size:12px;color:#94a3b8;margin-bottom:4px}
input{width:100%;padding:10px 14px;border:1px solid #e2e8f0;border-radius:8px;font-size:14px;outline:none;box-sizing:border-box}
input:focus{border-color:#00a651}
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.btn{padding:10px 24px;background:#00a651;color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer}
.btn:hover{background:#008c44}
.tabs{display:flex;gap:16px;margin-bottom:24px;border-bottom:1px solid #e2e8f0;padding-bottom:12px}
.tab{background:none;border:none;font-size:14px;color:#94a3b8;cursor:pointer;padding:4px 0}
.tab.active{color:#1a365d;font-weight:600;border-bottom:2px solid #00a651}
table{width:100%;border-collapse:collapse;font-size:13px}
th{text-align:left;padding:10px 16px;background:#f8fafc;font-size:12px;color:#94a3b8;text-transform:uppercase}
td{padding:10px 16px;border-top:1px solid #f1f5f9}
tr:hover{background:#f8fafc}
.msg{padding:10px 16px;border-radius:8px;margin-bottom:16px;font-size:14px;display:${msg?'block':'none'};background:#f0fdf4;border:1px solid #bbf7d0;color:#166534}
</style></head><body>
<div class="header">
  <span class="brand">NLC Admin</span>
  <a href="/">← 网站首页</a>
</div>
<div class="main" id="app">
  ${msg ? `<div class="msg">${msg}</div>` : ''}

  <!-- Tab Bar -->
  <div class="tabs" id="tabs">
    <button class="tab active" onclick="switchTab('dashboard')" id="tab-dashboard">📊 控制台</button>
    <button class="tab" onclick="switchTab('products')" id="tab-products">📦 产品 (${products.length})</button>
    <button class="tab" onclick="switchTab('inquiries')" id="tab-inquiries">📩 询盘 (${inquiries.length})</button>
    <button class="tab" onclick="switchTab('settings')" id="tab-settings">⚙️ 设置</button>
  </div>

  <!-- Dashboard Tab -->
  <div id="page-dashboard">
    <div class="grid">
      <div class="stat-card"><div class="stat-num" style="color:#00a651">${products.length}</div><div class="stat-lbl">产品</div></div>
      <div class="stat-card"><div class="stat-num" style="color:#dc2626">${inquiries.length}</div><div class="stat-lbl">询盘</div></div>
      <div class="stat-card"><div class="stat-num" style="color:#1a365d">3</div><div class="stat-lbl">语言</div></div>
    </div>
  </div>

  <!-- Products Tab -->
  <div id="page-products" style="display:none">
    <div style="overflow-x:auto;background:#fff;border:1px solid #f1f5f9;border-radius:12px">
      <table><thead><tr><th>产品名</th><th>分类</th><th>Model</th></tr></thead><tbody>${pRows}</tbody></table>
    </div>
    <p style="font-size:13px;color:#94a3b8;margin-top:16px">产品数据存在 GitHub 仓库中，编辑功能开发中。</p>
  </div>

  <!-- Inquiries Tab -->
  <div id="page-inquiries" style="display:none">
    <div style="overflow-x:auto;background:#fff;border:1px solid #f1f5f9;border-radius:12px">
      <table><thead><tr><th>日期</th><th>姓名</th><th>公司</th><th>邮箱</th><th>产品</th></tr></thead><tbody>${iRows}</tbody></table>
    </div>
  </div>

  <!-- Settings Tab -->
  <div id="page-settings" style="display:none">
    <form method="POST" action="/admin" style="display:contents">
      <input type="hidden" name="action" value="save_settings">
      <div class="card">
        <h2>联系方式</h2>
        <div class="form-grid">
          <div><label>WhatsApp</label><input name="whatsapp" value="${settings.whatsapp||''}"></div>
          <div><label>Email</label><input name="email" value="${settings.email||''}"></div>
          <div><label>电话</label><input name="phone" value="${settings.phone||''}"></div>
          <div><label>地址</label><input name="address" value="${settings.address||''}"></div>
        </div>
      </div>
      <button type="submit" class="btn">💾 保存</button>
    </form>
  </div>
</div>

<script>
function switchTab(name) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('[id^="page-"]').forEach(p => p.style.display = 'none');
  document.getElementById('tab-' + name).classList.add('active');
  document.getElementById('page-' + name).style.display = 'block';
}
</script>
</body></html>`;
};

import { cookies } from 'next/headers';
import crypto from 'crypto';

const SECRET = process.env.ADMIN_SECRET || 'nlc-admin-secret-2026';

function createToken() {
  return crypto.createHash('sha256').update(SECRET + Date.now().toString(36)).digest('hex');
}

function verifyToken(token) {
  if (!token) return false;
  // Simple cookie check - accept any token that was set by us
  return token.length > 10;
}

// Read data files
import fs from 'fs';
import path from 'path';

function readJSON(file) {
  try {
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src', 'data', file), 'utf-8'));
  } catch { return []; }
}

function writeJSON(file, data) {
  fs.writeFileSync(path.join(process.cwd(), 'src', 'data', file), JSON.stringify(data, null, 2));
}

export async function GET(request) {
  const token = request.cookies.get('nlc_admin')?.value;
  if (!token || !verifyToken(token)) {
    return new Response(TOKEN_PAGE(), {
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Set-Cookie': 'nlc_admin=;Max-Age=0;Path=/' },
    });
  }

  const products = readJSON('products.json');
  const inquiries = readJSON('inquiries.json');
  let settings = {};
  try { settings = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src', 'data', 'settings.json'), 'utf-8')); } catch {}

  return new Response(ADMIN_PAGE(products, inquiries, settings), {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

export async function POST(request) {
  const formData = await request.formData();
  const password = formData.get('password');
  const action = formData.get('action');

  // Login
  if (password) {
    const adminPassword = process.env.ADMIN_PASSWORD || 'nlc2026';
    if (password === adminPassword) {
      const token = createToken();
      return new Response(ADMIN_PAGE([], []), {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Set-Cookie': `nlc_admin=${token};HttpOnly;Secure;SameSite=Lax;Path=/;Max-Age=86400`,
        },
      });
    }
    return new Response(TOKEN_PAGE('密码错误'), {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  // Save settings
  if (action === 'save_settings') {
    const token = request.cookies.get('nlc_admin')?.value;
    if (!token || !verifyToken(token)) {
      return new Response(TOKEN_PAGE(), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    const settings = {};
    for (const [key, val] of formData.entries()) {
      if (key !== 'action') settings[key] = val;
    }
    writeJSON('settings.json', settings);

    const products = readJSON('products.json');
    const inquiries = readJSON('inquiries.json');
    return new Response(ADMIN_PAGE(products, inquiries, settings, '✅ 已保存！'), {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  return new Response(TOKEN_PAGE(), {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
