import { promises as fs } from 'fs';
import path from 'path';

const ROOT = process.cwd();
const PROFILES_DIR = path.join(ROOT, 'profiles');
const OUT_DIR = path.join(ROOT, 'directory');

function esc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function slug(s){ return String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); }
function layout(title, body){
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<style>
body{font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#0b0c10;color:#e8e8e8;margin:0}
.wrap{max-width:900px;margin:0 auto;padding:18px}
a{color:#b7d3ff}
.card{background:#111418;border:1px solid #23272f;border-radius:12px;padding:14px;margin:10px 0}
.row{display:flex;gap:10px;flex-wrap:wrap}
.badge{display:inline-block;border:1px solid #2b313b;border-radius:8px;padding:2px 8px;margin-left:8px;font-size:12px;opacity:.8}
</style></head>
<body><div class="wrap">
<h1>${esc(title)}</h1>
${body}
<div class="card">← <a href="../index.html">Back to pay page</a></div>
</div></body></html>`;
}

function card(p, id){
  const n = esc(p.name || id);
  const city = p.city ? `<span class="badge">${esc(p.city)}</span>` : '';
  const cat = p.category ? `<span class="badge">${esc(p.category)}</span>` : '';
  return `<div class="card">
  <div><strong>${n}</strong>${city}${cat}</div>
  <div><a href="../index.html?u=${encodeURIComponent(id)}">Open pay link</a></div>
</div>`;
}

async function main(){
  await fs.mkdir(OUT_DIR, { recursive: true });
  const files = (await fs.readdir(PROFILES_DIR)).filter(f=>f.endsWith('.json'));
  const byCity = new Map(), byCat = new Map();
  const allCards = [];

  for (const f of files){
    const id = f.replace(/\.json$/,'');
    const raw = await fs.readFile(path.join(PROFILES_DIR, f), 'utf8');
    const p = JSON.parse(raw);
    allCards.push(card(p, id));
    if (p.city){
      const k = slug(p.city);
      if (!byCity.has(k)) byCity.set(k, { name:p.city, items:[] });
      byCity.get(k).items.push(card(p, id));
    }
    if (p.category){
      const k = slug(p.category);
      if (!byCat.has(k)) byCat.set(k, { name:p.category, items:[] });
      byCat.get(k).items.push(card(p, id));
    }
  }

  // index
  const idxBody = `<div class="card"><a href="./city/index.html">Browse by city</a> · <a href="./category/index.html">Browse by category</a></div>${allCards.join('\n')}`;
  await fs.writeFile(path.join(OUT_DIR, 'index.html'), layout('UPL Directory — All Profiles', idxBody), 'utf8');

  // city
  const cityDir = path.join(OUT_DIR, 'city');
  await fs.mkdir(cityDir, { recursive: true });
  const cityLinks = [];
  for (const [k, v] of byCity){
    await fs.writeFile(path.join(cityDir, `${k}.html`), layout(`City: ${v.name}`, v.items.join('\n')), 'utf8');
    cityLinks.push(`<li><a href="./${k}.html">${esc(v.name)}</a></li>`);
  }
  await fs.writeFile(path.join(cityDir, 'index.html'), layout('Cities', `<ul>${cityLinks.join('')}</ul>`), 'utf8');

  // category
  const catDir = path.join(OUT_DIR, 'category');
  await fs.mkdir(catDir, { recursive: true });
  const catLinks = [];
  for (const [k, v] of byCat){
    await fs.writeFile(path.join(catDir, `${k}.html`), layout(`Category: ${v.name}`, v.items.join('\n')), 'utf8');
    catLinks.push(`<li><a href="./${k}.html">${esc(v.name)}</a></li>`);
  }
  await fs.writeFile(path.join(catDir, 'index.html'), layout('Categories', `<ul>${catLinks.join('')}</ul>`), 'utf8');

  console.log(`Built directory for ${files.length} profiles`);
}
main().catch(err=>{ console.error(err); process.exit(1); });