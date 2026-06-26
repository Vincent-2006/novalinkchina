// Standalone admin login page - returns raw HTML, no Next.js routing
export async function GET() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Admin Login — Nova Link China</title>
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif; background:#f8fafc; min-height:100vh; display:flex; align-items:center; justify-content:center; }
.box { background:#fff; padding:32px; border-radius:16px; box-shadow:0 1px 3px rgba(0,0,0,0.06); width:100%; max-width:360px; border:1px solid #f1f5f9; }
.logo { width:48px; height:48px; background:#00a651; border-radius:12px; display:flex; align-items:center; justify-content:center; color:#fff; font-weight:700; font-size:20px; margin:0 auto 12px; }
h1 { text-align:center; font-size:20px; color:#1a365d; margin-bottom:4px; }
.sub { text-align:center; font-size:14px; color:#94a3b8; margin-bottom:24px; }
input { width:100%; padding:12px 16px; border:1px solid #e2e8f0; border-radius:8px; font-size:14px; outline:none; box-sizing:border-box; transition:border 0.2s; }
input:focus { border-color:#00a651; box-shadow:0 0 0 3px rgba(0,166,81,0.1); }
button { width:100%; padding:12px; background:#1a365d; color:#fff; border:none; border-radius:8px; font-size:14px; font-weight:600; cursor:pointer; transition:background 0.2s; }
button:hover { background:#0f1b33; }
button:disabled { opacity:0.5; }
.error { display:none; color:#dc2626; font-size:14px; margin-bottom:16px; padding:8px 12px; background:#fef2f2; border-radius:8px; }
.back { display:block; text-align:center; font-size:14px; color:#94a3b8; margin-top:16px; text-decoration:none; }
.back:hover { color:#00a651; }
</style>
</head>
<body>
<div class="box">
  <div class="logo">Y</div>
  <h1>后台管理</h1>
  <p class="sub">Nova Link China</p>
  <div class="error" id="errorMsg"></div>
  <form id="loginForm">
    <input type="password" id="password" placeholder="管理员密码" required style="margin-bottom:16px" autofocus>
    <button type="submit" id="loginBtn">登录</button>
  </form>
  <a href="/" class="back">&larr; 返回首页</a>
</div>
<script>
document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const btn = document.getElementById('loginBtn');
  const err = document.getElementById('errorMsg');
  btn.disabled = true;
  btn.textContent = '登录中...';
  err.style.display = 'none';
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({password: document.getElementById('password').value})
    });
    if (res.ok) {
      window.location.href = '/api/admin-dashboard';
    } else {
      const data = await res.json();
      err.textContent = data.error || '密码错误';
      err.style.display = 'block';
    }
  } catch(e) {
    err.textContent = '连接失败';
    err.style.display = 'block';
  } finally {
    btn.disabled = false;
    btn.textContent = '登录';
  }
});
</script>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
