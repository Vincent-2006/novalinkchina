// Admin panel - full CRUD for products, settings, view inquiries
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const SECRET = process.env.ADMIN_SECRET || 'nlc-admin-secret-2026';
const ADMIN_PWD = process.env.ADMIN_PASSWORD || 'nlc2026';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

function createToken() {
  return crypto.createHash('sha256').update(SECRET + Date.now().toString(36)).digest('hex');
}

function verifyToken(token) {
  if (!token) return false;
  return token.length > 10;
}

function readJSON(file) {
  try {
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src', 'data', file), 'utf-8'));
  } catch { return file.includes('settings') ? {} : []; }
}

async function saveJSON(file, data) {
  // Only save to GitHub (Vercel filesystem is read-only)
  if (!GITHUB_TOKEN) return;

  const content = JSON.stringify(data, null, 2);
  const fullPath = `src/data/${file}`;

  try {
    const getRes = await fetch(
      `https://api.github.com/repos/Vincent-2006/novalinkchina/contents/${fullPath}`,
      { headers: { Authorization: `Bearer ${GITHUB_TOKEN}` } }
    );
    const sha = getRes.ok ? (await getRes.json()).sha : null;

    const body = {
      message: `更新 ${file} [via Admin]`,
      content: Buffer.from(content).toString('base64'),
      branch: 'master',
    };
    if (sha) body.sha = sha;

    const res = await fetch(
      `https://api.github.com/repos/Vincent-2006/novalinkchina/contents/${fullPath}`,
      {
        method: 'PUT',
        headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'GitHub API error');
    }
  } catch (e) {
    throw new Error('保存到 GitHub 失败: ' + e.message);
  }
}

function ADMIN_PAGE(products, inquiries, settings, msg, editProduct) {
  const catNames = { respiratory: '🫁 呼吸麻醉', catheter: '🩺 导管引流', surgical: '🏥 手术包', protection: '🥼 防护' };

  const pRows = products.map((p, i) => {
    const name = p.name?.en || p.name?.zh || p.slug || '?';
    const cat = catNames[p.category] || p.category || '-';
    const simpleDescs = p.description ? (p.description.en || p.description.zh || '').slice(0, 60) : '';
    return `<tr onclick="editProduct(${i})" style="cursor:pointer">
      <td style="color:#1a365d;font-weight:500">${name}</td>
      <td style="color:#94a3b8">${cat}</td>
      <td style="color:#94a3b8">${p.model||'-'}</td>
    </tr>`;
  }).join('\n');

  const catOptions = Object.entries(catNames).map(([k, v]) =>
    `<option value="${k}" ${editProduct?.category === k ? 'selected' : ''}>${v}</option>`
  ).join('\n');

  const productData = JSON.stringify(products).replace(/</g, '\\u003C');

  const iRows = inquiries.length === 0
    ? '<tr><td colspan="5" style="text-align:center;color:#94a3b8;padding:32px">暂无询盘</td></tr>'
    : inquiries.map(i =>
      `<tr><td style="color:#94a3b8">${(i.created_at||'').slice(0,10)}</td><td>${i.name||''}</td><td style="color:#94a3b8">${i.company||'-'}</td><td>${i.email||''}</td><td style="color:#94a3b8">${i.product||'-'}</td></tr>`
    ).join('\n');

  return `<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>后台管理 — Nova Link China</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#f8fafc;color:#334155;font-size:14px}
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
.tabs{display:flex;gap:16px;margin-bottom:24px;border-bottom:1px solid #e2e8f0;padding-bottom:12px}
.tab{background:none;border:none;font-size:14px;color:#94a3b8;cursor:pointer;padding:4px 0}
.tab.active{color:#1a365d;font-weight:600;border-bottom:2px solid #00a651}
table{width:100%;border-collapse:collapse;font-size:13px}
th{text-align:left;padding:10px 16px;background:#f8fafc;font-size:12px;color:#94a3b8;text-transform:uppercase;font-weight:600}
td{padding:10px 16px;border-top:1px solid #f1f5f9}
tr:hover{background:#f8fafc}
.btn{padding:10px 24px;background:#00a651;color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;display:inline-block}
.btn:hover{background:#008c44}
.btn-secondary{background:#64748b}
.btn-secondary:hover{background:#475569}
input,textarea,select{width:100%;padding:10px 14px;border:1px solid #e2e8f0;border-radius:8px;font-size:14px;outline:none;box-sizing:border-box;font-family:inherit}
input:focus,textarea:focus,select:focus{border-color:#00a651}
textarea{resize:vertical}
.form-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
.form-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.form-full{grid-column:1/-1}
.flex{display:flex;gap:8px;flex-wrap:wrap}
.mt-4{margin-top:16px}
.mb-2{margin-bottom:8px}
.msg{padding:10px 16px;border-radius:8px;margin-bottom:16px;font-size:14px;display:${msg?'block':'none'};background:#f0fdf4;border:1px solid #bbf7d0;color:#166534}
.msg.err{background:#fef2f2;border-color:#fecaca;color:#991b1b}
label{display:block;font-size:12px;color:#94a3b8;margin-bottom:4px;font-weight:600}
</style></head><body>
<div class="header">
  <span class="brand">NLC Admin</span>
  <a href="/">← 网站首页</a>
</div>
<div class="main">
  ${msg ? `<div class="msg${msg.includes('❌')?' err':''}">${msg}</div>` : ''}

  <div class="tabs">
    <button class="tab active" onclick="switchTab('dashboard')">📊 控制台</button>
    <button class="tab" onclick="switchTab('products')">📦 产品 (${products.length})</button>
    <button class="tab" onclick="switchTab('inquiries')">📩 询盘 (${inquiries.length})</button>
    <button class="tab" onclick="switchTab('settings')">⚙️ 设置</button>
  </div>

  <!-- Dashboard -->
  <div id="page-dashboard">
    <div class="grid">
      <div class="stat-card"><div class="stat-num" style="color:#00a651">${products.length}</div><div class="stat-lbl">产品</div></div>
      <div class="stat-card"><div class="stat-num" style="color:#dc2626">${inquiries.length}</div><div class="stat-lbl">询盘</div></div>
      <div class="stat-card"><div class="stat-num" style="color:#1a365d">3</div><div class="stat-lbl">语言</div></div>
    </div>
  </div>

  <!-- Products -->
  <div id="page-products" style="display:none">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <h1 style="margin-bottom:0">产品管理 (${products.length})</h1>
      <button class="btn" onclick="newProduct()">+ 新增产品</button>
    </div>
    <div id="productList" style="overflow-x:auto;background:#fff;border:1px solid #f1f5f9;border-radius:12px">
      <table><thead><tr><th>产品名</th><th>分类</th><th>Model</th></tr></thead><tbody>${pRows}</tbody></table>
    </div>
    <!-- Edit Form -->
    <div id="productForm" style="display:none">
      <h2 id="formTitle" style="font-size:18px;color:#1a365d;margin-bottom:16px">编辑产品</h2>
      <form id="editForm" method="POST" action="/admin">
        <input type="hidden" name="action" id="formAction" value="save_product">
        <input type="hidden" name="product_index" id="productIndex" value="-1">
        <div class="card">
          <h2>基本信息</h2>
          <div class="form-grid">
            <div><label>Slug</label><input name="slug" id="f_slug" required></div>
            <div><label>Model</label><input name="model" id="f_model"></div>
            <div><label>分类</label><select name="category" id="f_category">${catOptions}</select></div>
          </div>
        </div>
        <div class="card">
          <h2>名称 / 描述</h2>
          <div class="form-grid">
            <div><label>名称 (EN)</label><input name="name_en" id="f_name_en"></div>
            <div><label>名称 (ZH)</label><input name="name_zh" id="f_name_zh"></div>
            <div><label>名称 (ID)</label><input name="name_id" id="f_name_id"></div>
            <div class="form-full"><label>描述 (EN)</label><textarea name="desc_en" id="f_desc_en" rows="2"></textarea></div>
            <div class="form-full"><label>描述 (ZH)</label><textarea name="desc_zh" id="f_desc_zh" rows="2"></textarea></div>
            <div class="form-full"><label>描述 (ID)</label><textarea name="desc_id" id="f_desc_id" rows="2"></textarea></div>
          </div>
        </div>
        <div class="card">
          <h2>特点 (每行一个)</h2>
          <div class="form-grid">
            <div><label>EN</label><textarea name="feat_en" id="f_feat_en" rows="4"></textarea></div>
            <div><label>ZH</label><textarea name="feat_zh" id="f_feat_zh" rows="4"></textarea></div>
            <div><label>ID</label><textarea name="feat_id" id="f_feat_id" rows="4"></textarea></div>
          </div>
        </div>
        <div class="flex mt-4">
          <button type="submit" class="btn">💾 保存</button>
          <button type="button" class="btn btn-secondary" onclick="cancelEdit()">取消</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Inquiries -->
  <div id="page-inquiries" style="display:none">
    <h1>询盘记录 (${inquiries.length})</h1>
    <div style="overflow-x:auto;background:#fff;border:1px solid #f1f5f9;border-radius:12px">
      <table><thead><tr><th>日期</th><th>姓名</th><th>公司</th><th>邮箱</th><th>产品</th></tr></thead><tbody>${iRows}</tbody></table>
    </div>
  </div>

  <!-- Settings -->
  <div id="page-settings" style="display:none">
    <h1>网站设置</h1>
    <form method="POST" action="/admin">
      <input type="hidden" name="action" value="save_settings">
      <div class="card">
        <h2>联系方式</h2>
        <div class="form-grid-2">
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
const products = ${productData};

function switchTab(name) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('[id^="page-"]').forEach(p => p.style.display = 'none');
  document.querySelector('.tab:nth-child(' + ({dashboard:1,products:2,inquiries:3,settings:4}[name]||1) + ')').classList.add('active');
  document.getElementById('page-' + name).style.display = 'block';
}

function editProduct(index) {
  const p = products[index];
  document.getElementById('productList').style.display = 'none';
  document.getElementById('productForm').style.display = 'block';
  document.getElementById('formTitle').textContent = '编辑产品';
  document.getElementById('formAction').value = 'save_product';
  document.getElementById('productIndex').value = index;

  document.getElementById('f_slug').value = p.slug || '';
  document.getElementById('f_model').value = p.model || '';
  document.getElementById('f_category').value = p.category || 'respiratory';
  document.getElementById('f_name_en').value = p.name?.en || '';
  document.getElementById('f_name_zh').value = p.name?.zh || '';
  document.getElementById('f_name_id').value = p.name?.id || '';
  document.getElementById('f_desc_en').value = p.description?.en || '';
  document.getElementById('f_desc_zh').value = p.description?.zh || '';
  document.getElementById('f_desc_id').value = p.description?.id || '';
  document.getElementById('f_feat_en').value = (p.features?.en || []).join('\\n');
  document.getElementById('f_feat_zh').value = (p.features?.zh || []).join('\\n');
  document.getElementById('f_feat_id').value = (p.features?.id || []).join('\\n');
  window.scrollTo({top: 0, behavior: 'smooth'});
}

function newProduct() {
  document.getElementById('productList').style.display = 'none';
  document.getElementById('productForm').style.display = 'block';
  document.getElementById('formTitle').textContent = '新增产品';
  document.getElementById('formAction').value = 'new_product';
  document.getElementById('productIndex').value = '-1';

  ['slug','model','name_en','name_zh','name_id','desc_en','desc_zh','desc_id','feat_en','feat_zh','feat_id'].forEach(id => {
    document.getElementById('f_' + id).value = '';
  });
  document.getElementById('f_category').value = 'respiratory';
  window.scrollTo({top: 0, behavior: 'smooth'});
}

function cancelEdit() {
  document.getElementById('productList').style.display = 'block';
  document.getElementById('productForm').style.display = 'none';
}
</script>
</body></html>`;
}

export async function GET(request) {
  const token = request.cookies.get('nlc_admin')?.value;
  if (!token || !verifyToken(token))
    return new Response(TOKEN_PAGE(), {
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Set-Cookie': 'nlc_admin=;Max-Age=0;Path=/' },
    });

  const products = readJSON('products.json');
  const inquiries = readJSON('inquiries.json');
  let settings = {};
  try { settings = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src', 'data', 'settings.json'), 'utf-8')); } catch {}

  return new Response(ADMIN_PAGE(products, inquiries, settings), {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

function TOKEN_PAGE(err) {
  return `<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>后台登录 — Nova Link China</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#f8fafc;min-height:100vh;display:flex;align-items:center;justify-content:center}
.box{background:#fff;padding:32px;border-radius:16px;box-shadow:0 1px 3px rgba(0,0,0,0.06);width:360px;border:1px solid #f1f5f9}
.logo{width:48px;height:48px;background:#00a651;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:20px;margin:0 auto 12px}
h1{text-align:center;font-size:20px;color:#1a365d;margin-bottom:4px}
.sub{text-align:center;font-size:14px;color:#94a3b8;margin-bottom:24px}
input{width:100%;padding:12px 16px;border:1px solid #e2e8f0;border-radius:8px;font-size:14px;outline:none;box-sizing:border-box;margin-bottom:16px;display:block}
input:focus{border-color:#00a651}
button{width:100%;padding:12px;background:#1a365d;color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer}
.err{color:#dc2626;font-size:14px;margin-bottom:16px;display:${err?'block':'none'}}
a{display:block;text-align:center;font-size:14px;color:#94a3b8;margin-top:16px;text-decoration:none}
</style></head><body>
<div class="box">
  <div class="logo">Y</div>
  <h1>后台管理</h1>
  <p class="sub">Nova Link China</p>
  <div class="err">${err||''}</div>
  <form method="POST">
    <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:4px;font-weight:600">管理员密码</label>
    <input type="password" name="password" required autofocus>
    <button type="submit">登录</button>
  </form>
  <a href="/">← 返回首页</a>
</div></body></html>`;
}

export async function POST(request) {
  const formData = await request.formData();

  // Login
  if (formData.has('password') && !formData.has('action')) {
    const pwd = formData.get('password');
    if (pwd === ADMIN_PWD) {
      const token = createToken();
      const products = readJSON('products.json');
      const inquiries = readJSON('inquiries.json');
      let settings = {};
      try { settings = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src', 'data', 'settings.json'), 'utf-8')); } catch {}
      return new Response(ADMIN_PAGE(products, inquiries, settings), {
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

  const token = request.cookies.get('nlc_admin')?.value;
  if (!token || !verifyToken(token))
    return new Response(TOKEN_PAGE(), {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });

  const action = formData.get('action');
  let products = readJSON('products.json');
  let settings = {};
  try { settings = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src', 'data', 'settings.json'), 'utf-8')); } catch {}
  let msg = '';

  // Save or new product
  if (action === 'save_product' || action === 'new_product') {
    const idx = parseInt(formData.get('product_index') || '-1');
    const featEn = (formData.get('feat_en') || '').split('\n').filter(Boolean);
    const featZh = (formData.get('feat_zh') || '').split('\n').filter(Boolean);
    const featId = (formData.get('feat_id') || '').split('\n').filter(Boolean);

    const product = {
      id: formData.get('slug') || 'new',
      slug: formData.get('slug') || '',
      category: formData.get('category') || 'respiratory',
      model: formData.get('model') || '',
      name: {
        en: formData.get('name_en') || '',
        zh: formData.get('name_zh') || '',
        id: formData.get('name_id') || '',
      },
      description: {
        en: formData.get('desc_en') || '',
        zh: formData.get('desc_zh') || '',
        id: formData.get('desc_id') || '',
      },
      features: { en: featEn, zh: featZh, id: featId },
      specs: [],
      applications: { en: [], zh: [], id: [] },
    };

    if (action === 'new_product') {
      products.push(product);
      msg = '✅ 产品已新增！GitHub 部署中...';
    } else if (idx >= 0 && idx < products.length) {
      products[idx] = product;
      msg = '✅ 产品已保存！GitHub 部署中...';
    }

    try {
      await saveJSON('products.json', products);
    } catch (e) {
      msg = '❌ ' + e.message;
    }
    const inquiries = readJSON('inquiries.json');
    return new Response(ADMIN_PAGE(products, inquiries, settings, msg), {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  // Save settings
  if (action === 'save_settings') {
    for (const [key, val] of formData.entries()) {
      if (key !== 'action') settings[key] = val;
    }
    try {
      await saveJSON('settings.json', settings);
      msg = '✅ 设置已保存！';
    } catch (e) {
      msg = '❌ ' + e.message;
    }
    const inquiries = readJSON('inquiries.json');
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  return new Response(TOKEN_PAGE(), {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
