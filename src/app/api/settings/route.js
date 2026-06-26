import { NextResponse } from 'next/server';
import { githubCommit } from '@/lib/data';
import { checkAuth } from '@/lib/jwt';
import fs from 'fs';
import path from 'path';

const SETTINGS_FILE = path.join(process.cwd(), 'src', 'data', 'settings.json');

function getSettings() {
  try {
    const data = fs.readFileSync(SETTINGS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

export async function GET() {
  const settings = getSettings();
  return NextResponse.json(settings);
}

export async function POST(request) {
  if (!checkAuth()) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }

  try {
    const settings = await request.json();
    const content = JSON.stringify(settings, null, 2);
    await githubCommit('settings.json', content, '更新网站设置 [via Admin]');
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
