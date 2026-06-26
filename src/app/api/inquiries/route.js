import { NextResponse } from 'next/server';
import { getInquiries, githubCommit } from '@/lib/data';
import { checkAuth } from '@/lib/jwt';

export async function GET() {
  if (!checkAuth()) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }
  const inquiries = getInquiries();
  return NextResponse.json(inquiries);
}

export async function POST(request) {
  try {
    const inquiry = await request.json();
    inquiry.created_at = new Date().toISOString();

    const inquiries = getInquiries();
    inquiries.unshift(inquiry);

    const content = JSON.stringify(inquiries, null, 2);
    await githubCommit('inquiries.json', content, '新增询盘 [via Website]');

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
