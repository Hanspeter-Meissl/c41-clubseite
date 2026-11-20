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
  const art = { body: inhalt.text || '', icon: 'bilder/symbol-192.png' };
  // „leise“ (etwa der fünfte Glückwunsch) ersetzt die vorige ohne Ton.
  if (inhalt.tag) { art.tag = inhalt.tag; art.renotify = inhalt.leise !== '1'; }
  // „ziel“ (seit 20. November 2026): wohin ein Tippen führt, etwa „club:17“; bleibt bei der Mitteilung bis zum Tippen.
  if (inhalt.ziel) art.data = { ziel: String(inhalt.ziel) };
  // iOS entzieht die Erlaubnis, wenn auf eine Mitteilung hin nichts angezeigt wird; deshalb immer anzeigen.
  const arbeit = [self.registration.showNotification(inhalt.titel || 'Club 41', art)];
  // Ist die App offen, erfährt sie sofort von der Mitteilung und holt das Neue (seit 20. November 2026). Sonst kam die
  // Zahl am Chat-Symbol erst mit der nächsten Abfrage, außerhalb des Chats bis zu einer Minute später. Fenster der
  // Test-App unter /test/ bekommen die Meldung des Betriebs nicht.
  // Zweiter Weg über einen BroadcastChannel je Bereich des Service Workers, falls das iPhone die Fenster hier nicht
  // liefert (Probe am iPhone vom 20. November 2026: Mitteilung kam, Zahl nicht). „zahl“ ist die Zahl gefundener Fenster.
  arbeit.push(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(liste => {
    const fenster = liste.filter(c => c.url.startsWith(self.registration.scope) && !c.url.startsWith(self.registration.scope + 'test/'));
    fenster.forEach(c => c.postMessage({ c41: 'neu', weg: 'fenster', zahl: fenster.length }));
    if (self.BroadcastChannel) {
      const kanal = new BroadcastChannel('c41:' + self.registration.scope);
      kanal.postMessage({ c41: 'neu', weg: 'kanal', zahl: fenster.length });
      kanal.close();
    }
  }).catch(() => {}));
  if (zahl !== null && !Number.isNaN(zahl) && self.navigator.setAppBadge) {
    arbeit.push((zahl ? self.navigator.setAppBadge(zahl) : self.navigator.clearAppBadge()).catch(() => {}));
  }
  e.waitUntil(Promise.all(arbeit));
});

// Ein Tippen auf die Mitteilung öffnet die App; der Clubschlüssel kommt aus dem Speicher der Einstiegsseite.
// Clubchat, Ankündigung und Geburtstag öffnen den Reiter „Chat“ („#&teil=chat“, ohne Schlüssel in der Adresse).
// Ist die App schon offen, kommt sie nach vorn; sie holt das Neue dann von selbst. Seit 20. November 2026 führt das
// Ziel der Mitteilung zur Nachricht: bei geschlossener App über „#&teil=chat&ziel=…“, bei offener App über eine
// Nachricht an das Fenster, die die Einstiegsseite an die Clubseite weiterreicht.
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const t = e.notification.tag || '';
  const ziel = (e.notification.data && e.notification.data.ziel) || '';
  const chat = t === 'chat' || /^(ankuendigung|geburtstag)-/.test(t) || e.notification.title === 'Geburtstag';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(liste => {
    // Die Test-App unter /test/ liegt im Bereich dieses Service Workers; ihr Fenster soll eine Mitteilung des Betriebs
    // nicht nach vorn holen (E4, seit 18. November 2026).
    const offen = liste.find(c => c.url.startsWith(self.registration.scope) && !c.url.startsWith(self.registration.scope + 'test/'));
    if (offen) {
      return Promise.resolve(offen.focus()).catch(() => offen).then(c => { if (ziel) (c || offen).postMessage({ c41: 'ziel', ziel: ziel }); });
    }
    return self.clients.openWindow(self.registration.scope + (ziel ? '#&teil=chat&ziel=' + encodeURIComponent(ziel) : chat ? '#&teil=chat' : ''));
  }));
});
