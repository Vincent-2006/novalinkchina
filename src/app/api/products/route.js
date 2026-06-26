import { NextResponse } from 'next/server';
import { getProducts, githubCommit } from '@/lib/data';
import { checkAuth } from '@/lib/jwt';

export async function GET() {
  const products = getProducts();
  return NextResponse.json(products);
}

export async function POST(request) {
  if (!checkAuth()) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }

  try {
    const products = await request.json();
    const content = JSON.stringify(products, null, 2);
    await githubCommit('products.json', content, '更新产品数据 [via Admin]');
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
