// Офлайн-режим: зберігаємо файли сайту на пристрої.
const CACHE = 'annamath-cards-7862ece5';
const FILES = ["./","index.html","style.css","app.js","data.js","manifest.webmanifest","icon-192.png","icon-512.png","katex/katex.min.css","katex/fonts/KaTeX_AMS-Regular.woff2","katex/fonts/KaTeX_Caligraphic-Bold.woff2","katex/fonts/KaTeX_Caligraphic-Regular.woff2","katex/fonts/KaTeX_Fraktur-Bold.woff2","katex/fonts/KaTeX_Fraktur-Regular.woff2","katex/fonts/KaTeX_Main-Bold.woff2","katex/fonts/KaTeX_Main-BoldItalic.woff2","katex/fonts/KaTeX_Main-Italic.woff2","katex/fonts/KaTeX_Main-Regular.woff2","katex/fonts/KaTeX_Math-BoldItalic.woff2","katex/fonts/KaTeX_Math-Italic.woff2","katex/fonts/KaTeX_SansSerif-Bold.woff2","katex/fonts/KaTeX_SansSerif-Italic.woff2","katex/fonts/KaTeX_SansSerif-Regular.woff2","katex/fonts/KaTeX_Script-Regular.woff2","katex/fonts/KaTeX_Size1-Regular.woff2","katex/fonts/KaTeX_Size2-Regular.woff2","katex/fonts/KaTeX_Size3-Regular.woff2","katex/fonts/KaTeX_Size4-Regular.woff2","katex/fonts/KaTeX_Typewriter-Regular.woff2"];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(k => k.startsWith('annamath-cards-') && k !== CACHE).map(k => caches.delete(k))
  )).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  // шрифт Montserrat з Google: беремо з кешу, якщо є
  if (url.host === 'fonts.googleapis.com' || url.host === 'fonts.gstatic.com') {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return res;
    })));
    return;
  }
  if (url.origin !== location.origin) return;
  // спершу мережа (щоб бачити нові картки), без мережі — кеш
  e.respondWith(fetch(e.request, { cache: 'no-cache' }).then(res => {
    const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return res;
  }).catch(() => caches.match(e.request, { ignoreSearch: true })));
});
