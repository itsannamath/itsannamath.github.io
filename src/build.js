// Збирає сайт у корінь репозиторію (його віддає GitHub Pages).
// Запуск: node src/build.js
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const KATEX = process.env.KATEX_DIR || '/opt/npm-tools/node_modules/katex/dist';
const katex = require(path.join(KATEX, 'katex.js'));

const ROOT = path.join(__dirname, '..');
const OUT = ROOT;   // готові файли сайту лежать у корені, джерела — у src/ і static/
const decks = require('./decks.js');

const tex = s => katex.renderToString(s, { displayMode: true, throwOnError: true });
const id = (deck, q) => deck + '-' + crypto.createHash('md5').update(q).digest('hex').slice(0, 6);

const allIds = new Set();
const data = decks.map(sec => ({ ...sec, decks: sec.decks.filter(d => !d.draft || process.env.DRAFTS) }))
  .filter(sec => sec.decks.length)
  .map(sec => ({
  id: sec.id, title: sec.title, sub: sec.sub || '',
  decks: sec.decks.map(d => ({
    id: d.id, title: d.title, sub: d.sub || '',
    cards: d.cards.map(([q, a]) => {
      const cid = id(d.id, q);
      if (allIds.has(cid)) throw new Error('Дубль картки в колоді ' + d.id + ': ' + q);
      allIds.add(cid);
      return { id: cid, q: tex(q), a: tex(a) };
    }),
  })),
}));

fs.rmSync(path.join(OUT, 'katex'), { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'katex', 'fonts'), { recursive: true });

// KaTeX: тільки woff2 (їх читають усі сучасні браузери)
let css = fs.readFileSync(path.join(KATEX, 'katex.min.css'), 'utf8')
  .replace(/,url\(fonts\/[^)]+\.woff\) format\("woff"\)/g, '')
  .replace(/,url\(fonts\/[^)]+\.ttf\) format\("truetype"\)/g, '');
fs.writeFileSync(path.join(OUT, 'katex', 'katex.min.css'), css);
const fonts = fs.readdirSync(path.join(KATEX, 'fonts')).filter(f => f.endsWith('.woff2'));
fonts.forEach(f => fs.copyFileSync(path.join(KATEX, 'fonts', f), path.join(OUT, 'katex', 'fonts', f)));

// статичні файли
for (const f of fs.readdirSync(path.join(ROOT, 'static'))) {
  fs.copyFileSync(path.join(ROOT, 'static', f), path.join(OUT, f));
}
fs.writeFileSync(path.join(OUT, 'data.js'), 'window.SECTIONS=' + JSON.stringify(data) + ';\n');
fs.writeFileSync(path.join(OUT, '.nojekyll'), '');

// service worker: список файлів для офлайну + версія, щоб оновлення доходили
const files = ['./', 'index.html', 'style.css', 'app.js', 'data.js', 'manifest.webmanifest',
  'icon-192.png', 'icon-512.png', 'katex/katex.min.css', ...fonts.map(f => 'katex/fonts/' + f)];
const ver = crypto.createHash('md5').update(files.map(f =>
  f === './' ? '' : fs.readFileSync(path.join(OUT, f))).join('')).digest('hex').slice(0, 8);
const sw = fs.readFileSync(path.join(ROOT, 'src', 'sw.template.js'), 'utf8')
  .replace('__VERSION__', ver).replace('__FILES__', JSON.stringify(files));
fs.writeFileSync(path.join(OUT, 'sw.js'), sw);

// версія в адресах файлів — браузер не тримає стару копію після оновлення
const html = path.join(OUT, 'index.html');
fs.writeFileSync(html, fs.readFileSync(html, 'utf8').replace(/(href|src)="(style\.css|app\.js|data\.js|katex\/katex\.min\.css)"/g, `$1="$2?v=${ver}"`));

const nd = data.reduce((s, x) => s + x.decks.length, 0);
const n = allIds.size;
console.log(`ok: ${data.length} модулів, ${nd} колод, ${n} карток, версія ${ver}`);
