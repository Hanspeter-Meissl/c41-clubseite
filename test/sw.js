// Erzeugt von „C41 Testseite erzeugen.py“ im Vault aus ausbau-chat:sw.js. Nicht von Hand ändern.
// Service Worker der Einstiegsseite. Seit dem Ausbau um Chat, Fotos und Geburtstage (noch nicht bereitgestellt)
// zeigt er die Mitteilungen der Clubseite, die über Firebase kommen, auch bei geschlossener App. Erprobt am
// 29. Oktober 2026 mit der Probeseite C am iPhone. Anfragen fängt er nicht ab, alles geht wie bisher ans Netz.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('push', e => {
  let inhalt = {};
  try { inhalt = e.data ? e.data.json() : {}; } catch (f) { inhalt = { text: e.data ? e.data.text() : '' }; }
  // Firebase packt den Inhalt in „data“ und schickt jeden Wert als Zeichen.
  if (inhalt.data && (inhalt.fcmMessageId || inhalt.from)) inhalt = inhalt.data;
  const zahl = inhalt.zahl === undefined || inhalt.zahl === '' ? null : Number(inhalt.zahl);
  // Gleicher „tag“ ersetzt die vorige Mitteilung, so bündelt der Clubchat mehrere Nachrichten zu einer.
  const art = { body: inhalt.text || '', icon: '../bilder/symbol-192.png' };
  // „leise“ (etwa der fünfte Glückwunsch) ersetzt die vorige ohne Ton.
  if (inhalt.tag) { art.tag = inhalt.tag; art.renotify = inhalt.leise !== '1'; }
  // iOS entzieht die Erlaubnis, wenn auf eine Mitteilung hin nichts angezeigt wird; deshalb immer anzeigen.
  const arbeit = [self.registration.showNotification(inhalt.titel || 'Club 41', art)];
  if (zahl !== null && !Number.isNaN(zahl) && self.navigator.setAppBadge) {
    arbeit.push((zahl ? self.navigator.setAppBadge(zahl) : self.navigator.clearAppBadge()).catch(() => {}));
  }
  e.waitUntil(Promise.all(arbeit));
});

// Ein Tippen auf die Mitteilung öffnet die App; der Clubschlüssel kommt aus dem Speicher der Einstiegsseite.
// Clubchat, Ankündigung und Geburtstag öffnen den Reiter „Chat“ („#&teil=chat“, ohne Schlüssel in der Adresse).
// Ist die App schon offen, kommt sie nur nach vorn; sie holt das Neue dann von selbst.
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const t = e.notification.tag || '';
  const chat = t === 'chat' || /^(ankuendigung|geburtstag)-/.test(t) || e.notification.title === 'Geburtstag';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(liste => {
    const offen = liste.find(c => c.url.startsWith(self.registration.scope));
    return offen ? offen.focus() : self.clients.openWindow(self.registration.scope + (chat ? '#&teil=chat' : ''));
  }));
});
