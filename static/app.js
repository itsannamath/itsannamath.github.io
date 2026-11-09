(() => {
'use strict';
const SECTIONS = window.SECTIONS || [];          // модулі → колоди → картки
const DECKS = [];
SECTIONS.forEach(sec => sec.decks.forEach(d => { d.section = sec; DECKS.push(d); }));
const CARDS = {};                       // id → {id, q, a, deck}
DECKS.forEach(d => d.cards.forEach(c => { CARDS[c.id] = Object.assign({ deck: d }, c); }));
const secIds = sec => sec.decks.flatMap(d => d.cards.map(c => c.id));

/* ---------- прогрес (зберігається в браузері) ---------- */
const KEY = 'annamath-cards-v1';
// інтервали повторення в днях для кожної «скриньки» 0..5
const INT = [1, 1, 3, 7, 14, 30];
let P = {};
try { P = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { P = {}; }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(P)); } catch (e) {} };
const today = () => { const t = new Date(); return Math.floor((t - t.getTimezoneOffset() * 6e4) / 864e5); };

// статус: new — ще не бачив; bad — не знав минулого разу; mid — вчу; ok — вивчено
const status = id => { const r = P[id]; if (!r) return 'new'; return r.b === 0 ? 'bad' : r.b === 1 ? 'mid' : 'ok'; };
const isDue = id => P[id] && P[id].d <= today();
function grade(id, knew) {
  const r = P[id], t = today();
  let b;
  if (knew) b = r ? Math.min(r.b + 1, 5) : 2;   // нову картку, яку знаєш одразу, вважаємо вивченою
  else b = 0;
  P[id] = { b, d: t + INT[b], s: (r ? r.s : 0) + 1 };
  save();
}
const ids = deck => (deck ? deck.cards : Object.values(CARDS)).map(c => c.id);
const count = (list, st) => list.filter(id => status(id) === st).length;
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
const weak = list => list.filter(id => { const s = status(id); return s === 'bad' || s === 'mid'; });
const due = list => list.filter(isDue);
const plural = (n, one, few, many) => {
  const m10 = n % 10, m100 = n % 100;
  return n + ' ' + (m10 === 1 && m100 !== 11 ? one : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? few : many);
};
const cardsW = n => plural(n, 'картка', 'картки', 'карток');

/* ---------- допоміжне ---------- */
const app = document.getElementById('app');
const $ = s => app.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function progBar(list) {
  const n = list.length || 1, pc = st => (count(list, st) / n * 100) + '%';
  return `<div class="prog"><i class="p-ok" style="width:${pc('ok')}"></i><i class="p-mid" style="width:${pc('mid')}"></i><i class="p-bad" style="width:${pc('bad')}"></i></div>`;
}
const legend = '<div class="legend"><span class="l-ok">вивчено</span><span class="l-mid">вчу</span><span class="l-bad">не знаю</span><span class="l-new">нові</span></div>';
let keyHandler = null;
function setView(html, keys) { keyHandler = keys || null; app.innerHTML = html; window.scrollTo(0, 0); }

/* ---------- головна ---------- */
function home() {
  const all = ids(), d = due(all), w = weak(all);
  const learned = count(all, 'ok');
  setView(`
    <div class="hdr"><div class="brand">@its.annamath · НМТ</div>
      <button class="refresh" data-act="refresh" aria-label="Оновити" title="Оновити сайт">↻</button></div>
    <h1>Картки<br>з формулами</h1>
    <div class="sub">Згадай відповідь → торкнись картки → чесно познач, чи знаєш. Картки, яких не знаєш, повертатимуться частіше.</div>

    ${showInstallBanner() ? `<div class="inst" id="instBanner">
      <img src="icon-192.png" alt="">
      <div><b>Додай картки на екран телефона</b><small>Відкриватимуться одним дотиком, як застосунок</small></div>
      <button class="inst-go" data-act="install">Як?</button>
      <button class="inst-x" data-act="hideInstall" aria-label="Сховати">×</button>
    </div>` : ''}

    ${d.length
      ? `<button class="today" data-act="due"><div class="n">${d.length}</div><b>Повторити сьогодні</b><small>${cardsW(d.length)} чекають на повторення</small></button>`
      : `<button class="today empty" data-act="mix"><div class="n">✓</div><b>На сьогодні повторень немає</b><small>${learned ? 'Можна вчити нові картки або пройти все впереміш' : 'Обери тему нижче й почни'}</small></button>`}
    <div class="row2">
      <button class="chip" data-act="weak" ${w.length ? '' : 'disabled'}><b>Що не знаю</b><small>${w.length ? cardsW(w.length) + ' з усіх тем' : 'поки таких немає'}</small></button>
      <button class="chip" data-act="mix"><b>Усе впереміш</b><small>як на НМТ · ${cardsW(all.length)}</small></button>
    </div>

    <div class="h2">Теми</div>
    ${SECTIONS.map(sec => {
      const l = secIds(sec), ok = count(l, 'ok');
      const info = sec.decks.length > 1 ? plural(sec.decks.length, 'колода', 'колоди', 'колод') + ' · ' : '';
      return `<button class="deck" data-sec="${sec.id}"><div class="t"><b>${esc(sec.title)}</b><span class="go">→</span></div>
        <small>${esc(sec.sub)}${sec.sub ? ' · ' : ''}${info}вивчено ${ok} з ${l.length}</small>${progBar(l)}</button>`;
    }).join('')}
    ${legend}

    <div class="foot">
      <button data-act="transfer">Перенести прогрес</button>
      ${IS_MOBILE && !IS_STANDALONE ? '<button data-act="install">Додати на екран телефона</button>' : ''}
      <span class="sp"></span>
      <a href="https://www.instagram.com/its.annamath/" target="_blank" rel="noopener">@its.annamath</a>
    </div>`);
  app.querySelectorAll('[data-sec]').forEach(b => b.onclick = () => {
    const sec = SECTIONS.find(x => x.id === b.dataset.sec);
    location.hash = sec.decks.length === 1 ? 'deck-' + sec.decks[0].id : 'sec-' + sec.id;   // одна колода — одразу в неї
  });
  app.querySelectorAll('[data-act]').forEach(b => b.onclick = () => {
    const a = b.dataset.act;
    if (a === 'due') study(shuffle(due(ids())), 'Повторення', '');
    if (a === 'weak') study(shuffle(weak(ids())), 'Що не знаю', '');
    if (a === 'mix') study(shuffle(ids()), 'Усе впереміш', '');
    if (a === 'transfer') transfer();
    if (a === 'install') install();
    if (a === 'refresh') { b.classList.add('spin'); hardRefresh(); }
    if (a === 'hideInstall') { try { localStorage.setItem(KEY_INST, '1'); } catch (e) {} home(); }
  });
}

/* ---------- сторінка модуля ---------- */
function sectionPage(sec) {
  const l = secIds(sec), d = due(l), w = weak(l), fresh = l.filter(id => status(id) === 'new');
  const back = '#sec-' + sec.id;
  const rel = (sec.related || []).map(id => DECKS.find(d => d.id === id)).filter(Boolean);
  setView(`
    <div class="top"><button class="back" data-act="home" aria-label="Назад">←</button><h2>${esc(sec.title)}</h2></div>
    <div class="stats">
      <div class="stat"><b>${count(l, 'ok')}</b><small>вивчено</small></div>
      <div class="stat"><b>${count(l, 'mid')}</b><small>вчу</small></div>
      <div class="stat"><b>${count(l, 'bad')}</b><small>не знаю</small></div>
      <div class="stat"><b>${fresh.length}</b><small>нові</small></div>
    </div>
    <button class="btn main" data-act="all">Увесь модуль разом · ${l.length}</button>
    <button class="btn line" data-act="weak" ${w.length ? '' : 'disabled'}>Повторити, що не знаю${w.length ? ' · ' + w.length : ''}</button>
    ${d.length ? `<button class="btn line" data-act="due">Повторити сьогодні · ${d.length}</button>` : ''}
    <div class="h2">Колоди</div>
    ${sec.decks.map(dk => {
      const dl = ids(dk), ok = count(dl, 'ok');
      return `<button class="deck" data-deck="${dk.id}"><div class="t"><b>${esc(dk.title)}</b><span class="go">→</span></div>
        <small>${esc(dk.sub)}${dk.sub ? ' · ' : ''}вивчено ${ok} з ${dl.length}</small>${progBar(dl)}</button>`;
    }).join('')}
    ${legend}
    ${rel.length ? `<div class="h2">Знадобиться з попередніх модулів</div>
      <div class="rel">${rel.map(dk => `<button class="chip" data-deck="${dk.id}"><b>${esc(dk.title)} →</b><small>${esc(dk.section.title)} · вивчено ${count(ids(dk), 'ok')} з ${dk.cards.length}</small></button>`).join('')}</div>` : ''}`);
  $('[data-act=home]').onclick = () => { location.hash = ''; };
  $('[data-act=all]').onclick = () => study(shuffle(l.slice()), sec.title, back);
  if (w.length) $('[data-act=weak]').onclick = () => study(shuffle(w), sec.title + ' · не знаю', back);
  if (d.length) $('[data-act=due]').onclick = () => study(shuffle(d), sec.title + ' · повторення', back);
  app.querySelectorAll('[data-deck]').forEach(b => b.onclick = () => { location.hash = 'deck-' + b.dataset.deck; });
}

/* ---------- сторінка колоди ---------- */
function deckPage(dk) {
  const l = ids(dk), d = due(l), w = weak(l), fresh = l.filter(id => status(id) === 'new');
  const learnSet = d.concat(fresh.slice(0, 15));
  const back = '#deck-' + dk.id;
  setView(`
    <div class="top"><button class="back" data-act="home" aria-label="Назад">←</button><h2>${esc(dk.title)}</h2></div>
    <div class="stats">
      <div class="stat"><b>${count(l, 'ok')}</b><small>вивчено</small></div>
      <div class="stat"><b>${count(l, 'mid')}</b><small>вчу</small></div>
      <div class="stat"><b>${count(l, 'bad')}</b><small>не знаю</small></div>
      <div class="stat"><b>${fresh.length}</b><small>нові</small></div>
    </div>
    <button class="btn main" data-act="learn" ${learnSet.length ? '' : 'disabled'}>${learnSet.length
      ? `Вчити · ${cardsW(learnSet.length)}` : 'Усе повторено на сьогодні ✓'}</button>
    <button class="btn line" data-act="weak" ${w.length ? '' : 'disabled'}>Повторити, що не знаю${w.length ? ' · ' + w.length : ''}</button>
    <button class="btn line" data-act="all">Пройти всю тему · ${l.length}</button>
    <div class="h2">Усі картки теми</div>
    <div class="list">${dk.cards.map(c => {
      const st = status(c.id);
      const col = { ok: 'var(--accent)', mid: 'var(--pink)', bad: '#F7C3D7', new: 'var(--soft)' }[st];
      return `<div class="li"><span class="dot" style="background:${col};${st === 'new' ? 'border:1px solid var(--pink)' : ''}"></span>${c.q}</div>`;
    }).join('')}</div>
    ${legend}`);
  $('[data-act=home]').onclick = () => { location.hash = dk.section.decks.length > 1 ? 'sec-' + dk.section.id : ''; };
  const b = $('[data-act=learn]'); if (learnSet.length) b.onclick = () => study(shuffle(d).concat(shuffle(fresh.slice(0, 15))), dk.title, back);
  if (w.length) $('[data-act=weak]').onclick = () => study(shuffle(w), dk.title + ' · не знаю', back);
  $('[data-act=all]').onclick = () => study(shuffle(l.slice()), dk.title, back);
}

/* ---------- навчання ---------- */
function study(list, title, backHash) {
  if (!list.length) return;
  const total = list.length, queue = list.slice(), answered = new Set(), wrong = new Set();
  let cleared = 0, flipped = false, cur = null;
  setView(`
    <div class="top"><button class="back" data-act="back" aria-label="Назад">←</button><h2>${esc(title)}</h2><span class="cnt" id="cnt"></span></div>
    <div class="bar"><i id="bar"></i></div>
    <div class="scene"><div class="card" id="card">
      <div class="face front"><div class="lbl"><span>Згадай</span><span id="dk1"></span></div><div id="q"></div><span class="hint">торкнись, щоб перевірити</span></div>
      <div class="face backf"><div class="lbl"><span>Відповідь</span><span id="dk2"></span></div><div id="a"></div></div>
    </div></div>
    <div class="ans"><button class="no" id="no" disabled>Ще не знаю</button><button class="yes" id="yes" disabled>Знаю ✓</button></div>
    <div class="keys">Пробіл — перевернути · ← не знаю · → знаю</div>`, onKey);
  const card = $('#card');
  $('[data-act=back]').onclick = leave;

  function show() {
    if (!queue.length) return finish();
    cur = CARDS[queue[0]];
    const put = () => {
      $('#q').innerHTML = cur.q; $('#a').innerHTML = cur.a;
      $('#dk1').textContent = $('#dk2').textContent = cur.deck.title;
      fit();
    };
    if (flipped) {                      // перевертаємо назад без «підглядання» нової відповіді
      card.classList.add('noanim'); card.classList.remove('flip'); void card.offsetWidth; card.classList.remove('noanim');
    }
    flipped = false; put();
    $('#no').disabled = $('#yes').disabled = true;
    $('#cnt').textContent = cleared + ' / ' + total;
    $('#bar').style.width = (cleared / total * 100) + '%';
  }
  function fit() {                     // довга формула — зменшуємо шрифт, щоб влізла в картку
    app.querySelectorAll('.face .katex-display').forEach(box => {
      const k = box.querySelector('.katex'); let size = 1.6;
      k.style.fontSize = size + 'em';
      while (box.scrollWidth > box.clientWidth + 3 && size > 0.9) { size -= 0.1; k.style.fontSize = size.toFixed(1) + 'em'; }
    });
  }
  function flip() {
    flipped = !flipped; card.classList.toggle('flip', flipped);
    if (flipped) $('#no').disabled = $('#yes').disabled = false;
  }
  function answer(knew) {
    if ($('#yes').disabled) return;
    const id = queue.shift();
    if (!answered.has(id)) { answered.add(id); grade(id, knew); }   // у прогрес іде лише перша відповідь
    if (knew) cleared++;
    else { wrong.add(id); queue.splice(Math.min(2, queue.length), 0, id); }  // повернеться через 2 картки
    show();
  }
  function onKey(e) {
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flip(); }
    else if (e.key === 'ArrowLeft') answer(false);
    else if (e.key === 'ArrowRight') answer(true);
    else if (e.key === 'Escape') leave();
  }
  function leave() { if (backHash && location.hash !== backHash) location.hash = backHash; else route(); }
  function finish() {
    const first = total - wrong.size;
    setView(`
      <div class="top"><button class="back" data-act="back" aria-label="Назад">←</button><h2>${esc(title)}</h2></div>
      <div class="done">
        <div class="big">${first} / ${total}</div>
        <p>${first === total ? 'Усе з першого разу! 🔥' : 'з першого разу.<br>Картки з помилками система покаже тобі ще й завтра.'}</p>
        ${wrong.size ? `<button class="btn main" data-act="again">Ще раз — тільки помилки · ${wrong.size}</button>` : ''}
        <button class="btn ${wrong.size ? 'line' : 'main'}" data-act="back2">Готово</button>
      </div>`);
    $('[data-act=back]').onclick = $('[data-act=back2]').onclick = leave;
    if (wrong.size) $('[data-act=again]').onclick = () => study(shuffle([...wrong]), title, backHash);
  }
  card.onclick = flip;
  window.onresize = () => { if (document.getElementById('card')) fit(); };
  $('#no').onclick = () => answer(false);
  $('#yes').onclick = () => answer(true);
  show();
}
document.addEventListener('keydown', e => {
  if (!document.getElementById('modal').classList.contains('hidden')) { if (e.key === 'Escape') closeModal(); return; }
  if (keyHandler) keyHandler(e);
});

/* ---------- вікна ---------- */
const modal = document.getElementById('modal'), sheet = document.getElementById('sheet');
function openModal(html) { sheet.innerHTML = html; modal.classList.remove('hidden'); }
function closeModal() { modal.classList.add('hidden'); }
modal.onclick = e => { if (e.target === modal) closeModal(); };

function transfer() {
  const code = 'AM1:' + btoa(unescape(encodeURIComponent(JSON.stringify(P))));
  openModal(`
    <h3>Перенести прогрес</h3>
    <p>Прогрес зберігається на цьому пристрої. Щоб продовжити на іншому — скопіюй код тут і встав його там у поле нижче.</p>
    <textarea id="code" readonly>${code}</textarea>
    <button class="btn main" id="copy">Скопіювати код</button>
    <div class="h2" style="margin-top:18px">Вставити код з іншого пристрою</div>
    <textarea id="paste" placeholder="AM1:…"></textarea>
    <div class="msg" id="msg"></div>
    <button class="btn line" id="load">Завантажити прогрес</button>
    <button class="btn line" id="reset" style="border-color:var(--soft);color:var(--muted)">Почати з нуля</button>
    <button class="btn" id="close" style="color:var(--muted)">Закрити</button>`);
  const msg = t => { sheet.querySelector('#msg').textContent = t; };
  sheet.querySelector('#copy').onclick = () => {
    const ta = sheet.querySelector('#code');
    const ok = () => { sheet.querySelector('#copy').textContent = 'Скопійовано ✓'; };
    try { navigator.clipboard.writeText(ta.value).then(ok, () => { ta.select(); document.execCommand('copy'); ok(); }); }
    catch (e) { ta.select(); document.execCommand('copy'); ok(); }
  };
  sheet.querySelector('#load').onclick = () => {
    const v = sheet.querySelector('#paste').value.trim();
    try {
      if (!v.startsWith('AM1:')) throw 0;
      const inc = JSON.parse(decodeURIComponent(escape(atob(v.slice(4)))));
      let n = 0;
      for (const k in inc) {            // беремо той запис, де картку повторювали більше разів
        const r = inc[k];
        if (!r || typeof r.b !== 'number' || typeof r.d !== 'number') continue;
        if (!P[k] || (r.s || 0) > (P[k].s || 0)) { P[k] = r; n++; }
      }
      save(); msg('Готово! Оновлено ' + cardsW(n) + '.');
      setTimeout(() => { closeModal(); route(); }, 900);
    } catch (e) { msg('Код не підходить. Скопіюй його ще раз повністю.'); }
  };
  let sure = false;
  sheet.querySelector('#reset').onclick = e => {
    if (!sure) { sure = true; e.target.textContent = 'Точно? Натисни ще раз'; e.target.style.color = 'var(--accent)'; return; }
    P = {}; save(); closeModal(); route();
  };
  sheet.querySelector('#close').onclick = closeModal;
}

let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredPrompt = e; });
const UA = navigator.userAgent;
const IS_IOS = /iPhone|iPad|iPod/i.test(UA) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const IS_ANDROID = /Android/i.test(UA);
const IS_MOBILE = IS_IOS || IS_ANDROID;
const IS_STANDALONE = (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
const KEY_INST = 'annamath-install-hidden';
function showInstallBanner() {
  if (!IS_MOBILE || IS_STANDALONE) return false;
  try { return !localStorage.getItem(KEY_INST); } catch (e) { return true; }
}
const IOS_STEPS = `<ol>
  <li>Сайт має бути відкритий у <b>Safari</b> (не в Instagram чи Telegram — там натисни «Відкрити в Safari»)</li>
  <li>Натисни кнопку <b>«Поділитися»</b> — квадрат зі стрілкою вгору <b>⬆︎</b>. Вона внизу екрана; якщо її не видно — спершу натисни <b>•••</b> внизу праворуч</li>
  <li>Прокрути список трохи вниз і обери <b>«На початковий екран»</b></li>
  <li>Натисни <b>«Додати»</b> вгорі праворуч</li></ol>`;
const ANDROID_STEPS = `<ol>
  <li>Сайт має бути відкритий у <b>Chrome</b> (не в Instagram чи Telegram — там обери «Відкрити в браузері»)</li>
  <li>Натисни <b>⋮</b> — три крапки вгорі праворуч</li>
  <li>Обери <b>«Додати на головний екран»</b> або <b>«Установити додаток»</b></li>
  <li>Підтвердь — <b>«Додати»</b></li></ol>`;
function install() {
  let body;
  if (deferredPrompt) body = '<button class="btn main" id="inst">Додати на екран</button>' + '<p>Або вручну:</p>' + ANDROID_STEPS;
  else if (IS_IOS) body = IOS_STEPS;
  else if (IS_ANDROID) body = ANDROID_STEPS;
  else body = '<div class="h2">iPhone</div>' + IOS_STEPS + '<div class="h2">Android</div>' + ANDROID_STEPS;
  openModal(`
    <h3>Картки на екрані телефона</h3>
    <p>З'явиться іконка «Картки НМТ», як у звичайного застосунку. Картки відкриватимуться на весь екран і працюватимуть навіть без інтернету.</p>
    ${body}
    <button class="btn line" id="close">Зрозуміло</button>`);
  const b = sheet.querySelector('#inst');
  if (b) b.onclick = () => { deferredPrompt.prompt(); deferredPrompt = null; closeModal(); };
  sheet.querySelector('#close').onclick = closeModal;
}

/* ---------- маршрути ---------- */
function route() {
  closeModal();
  const h = location.hash.slice(1);
  const dk = h.startsWith('deck-') && DECKS.find(d => d.id === h.slice(5));
  const sec = h.startsWith('sec-') && SECTIONS.find(x => x.id === h.slice(4));
  if (dk) deckPage(dk); else if (sec) sectionPage(sec); else home();
}
window.addEventListener('hashchange', route);
route();

/* ---------- оновлення сайту ---------- */
// кнопка ↻: беремо найсвіжішу версію з інтернету, а не збережену копію
async function hardRefresh() {
  try {
    const reg = navigator.serviceWorker && await navigator.serviceWorker.getRegistration();
    if (reg) await reg.update();
    if (window.caches) for (const k of await caches.keys()) await caches.delete(k);
  } catch (e) {}
  location.replace(location.pathname + '?r=' + Date.now() + location.hash);
}
function updateToast() {
  if (document.getElementById('toast')) return;
  const t = document.createElement('button');
  t.id = 'toast'; t.className = 'toast';
  t.innerHTML = '<b>Є нова версія</b> · натисни, щоб оновити ↻';
  t.onclick = () => location.reload();
  document.body.appendChild(t);
}
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  const hadController = !!navigator.serviceWorker.controller;
  let reloaded = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadController || reloaded) return;          // перше встановлення — нічого не робимо
    if (document.getElementById('card')) updateToast();  // посеред навчання не перериваємо
    else { reloaded = true; location.reload(); }
  });
  navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then(reg => {
    const check = () => reg.update().catch(() => {});
    document.addEventListener('visibilitychange', () => { if (!document.hidden) check(); });  // повернулись у застосунок
    setInterval(check, 30 * 60 * 1000);
  }).catch(() => {});
}
// прибираємо ?r=… з адреси після примусового оновлення
if (location.search.includes('r=')) history.replaceState(null, '', location.pathname + location.hash);
})();
