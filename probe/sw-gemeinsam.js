// Service Worker der Probe für Mitteilungen, gemeinsam für die Varianten a und b (eingebunden über
// deren sw.js, weil ein Service Worker nur in seinem eigenen Ordner gilt). Er zeigt jede Mitteilung vom PC,
// setzt auf Wunsch die Zahl am App-Symbol und schreibt ein kleines Protokoll für die Probeseite.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

async function protokollieren(eintrag) {
  const c = await caches.open('probe');
  const r = await c.match('protokoll');
  const liste = r ? await r.json() : [];
  liste.push(eintrag);
  await c.put('protokoll', new Response(JSON.stringify(liste.slice(-20)), { headers: { 'Content-Type': 'application/json' } }));
}

self.addEventListener('push', e => {
  let inhalt = {};
  try { inhalt = e.data ? e.data.json() : {}; } catch (f) { inhalt = { text: e.data ? e.data.text() : '' }; }
  // Firebase (Variante c) packt den Inhalt in „data“ und schickt jeden Wert als Zeichen.
  if (inhalt.data && (inhalt.fcmMessageId || inhalt.from)) inhalt = inhalt.data;
  if (typeof inhalt.zahl === 'string') inhalt.zahl = inhalt.zahl === '' ? null : Number(inhalt.zahl);
  const titel = inhalt.titel || 'Club 41';
  const text = (inhalt.text || 'Mitteilung ohne Text') + (inhalt.gesendet ? ' (gesendet ' + inhalt.gesendet + ')' : '');
  const empfangen = new Date().toLocaleTimeString('de-AT');
  const arbeit = [
    // iOS entzieht die Erlaubnis, wenn auf eine Mitteilung vom Dienst nichts angezeigt wird.
    self.registration.showNotification(titel, { body: text, icon: '../../bilder/symbol-192.png', tag: 'probe-' + Date.now() }),
    protokollieren({ empfangen, titel, gesendet: inhalt.gesendet, zahl: inhalt.zahl }),
  ];
  if (inhalt.zahl != null && self.navigator.setAppBadge) {
    arbeit.push((inhalt.zahl ? self.navigator.setAppBadge(inhalt.zahl) : self.navigator.clearAppBadge()).catch(() => {}));
  }
  e.waitUntil(Promise.all(arbeit).then(() => self.clients.matchAll().then(l => l.forEach(c => c.postMessage('neu')))));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(liste => {
    const offen = liste.find(c => c.url.startsWith(self.registration.scope));
    return offen ? offen.focus() : self.clients.openWindow(self.registration.scope);
  }));
});
