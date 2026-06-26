import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');

// Read products (from file system - works on Vercel for reads)
export function getProducts() {
  try {
    const data = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function getProductBySlug(slug) {
  const products = getProducts();
  return products.find(p => p.slug === slug);
}

export function getCategories() {
  const products = getProducts();
  const cats = [...new Set(products.map(p => p.category))];
  const catNames = {
    respiratory: { en: 'Respiratory & Anesthesia', zh: '呼吸麻醉类', id: 'Respirasi & Anestesi' },
    catheter: { en: 'Catheters & Drainage', zh: '导管引流类', id: 'Kateter & Drainase' },
    surgical: { en: 'Surgical Packs & Drapes', zh: '手术包/铺单类', id: 'Paket Bedah & Drape' },
    protection: { en: 'Protective Apparel', zh: '防护用品类', id: 'Perlengkapan Pelindung' },
  };
  const catIcons = { respiratory: '🫁', catheter: '🩺', surgical: '🏥', protection: '🥼' };
  return cats.map(c => ({
    slug: c,
    name: catNames[c] || { en: c, zh: c, id: c },
    icon: catIcons[c] || '📦',
    count: products.filter(p => p.category === c).length
  }));
}

// Inquiries
export function getInquiries() {
  try {
    const data = fs.readFileSync(INQUIRIES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// GitHub commit helper - writes data back to the repo
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO = 'Vincent-2006/novalinkchina';
const BRANCH = 'master';

async function githubGetSha(path) {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${path}?ref=${BRANCH}`,
    { headers: { Authorization: `Bearer ${GITHUB_TOKEN}` } }
  );
  if (res.ok) {
    const data = await res.json();
    return data.sha;
  }
  return null;
}

export async function githubCommit(path, content, message) {
  if (!GITHUB_TOKEN) {
    throw new Error('GitHub token not configured. Set GITHUB_TOKEN in Vercel env.');
  }

  const fullPath = `src/data/${path}`;
  const sha = await githubGetSha(fullPath);
  const encoded = Buffer.from(content).toString('base64');

  const body = {
    message,
    content: encoded,
    branch: BRANCH,
  };
  if (sha) body.sha = sha;

  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${fullPath}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`GitHub API error: ${err.message}`);
  }

  return true;
}
