// Probe für Mitteilungen (Web Push) am iPhone, seit 29. Oktober 2026. Gemeinsamer Code der Varianten
// a (ohne Webmanifest, wie die Einstiegsseite) und b (mit Webmanifest). Gesendet wird vom PC mit
// "C41 Mitteilung Probe senden.py" im Vault; der öffentliche Schlüssel unten gehört zu dessen Schlüsselpaar.
const OEFFENTLICH = 'BAqdapkSA3s6-ZOpjJZnw1fSXxLOF-fPhNc4bxrLjx2yyEuYMD_ACHxBpM6s-gt5j7wF7sWkxQILPZJF_C4kzWk';
const VARIANTE = document.documentElement.dataset.variante;

const $ = id => document.getElementById(id);

function bytes(b64) {
  const s = atob(b64.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - b64.length % 4) % 4));
  return Uint8Array.from(s, z => z.charCodeAt(0));
}

function alsApp() {
  return navigator.standalone === true || matchMedia('(display-mode: standalone)').matches;
}

function diagnose() {
  return {
    variante: VARIANTE,
    alsApp: alsApp(),
    serviceWorker: 'serviceWorker' in navigator,
    pushManager: 'PushManager' in window,
    notification: 'Notification' in window,
    erlaubnis: 'Notification' in window ? Notification.permission : 'fehlt',
    symbolZahl: 'setAppBadge' in navigator,
    geraet: navigator.userAgent,
  };
}

function diagnoseZeigen() {
  const d = diagnose();
  const zeilen = [
    ['Als Web-App vom Home-Bildschirm', d.alsApp ? 'ja' : 'nein'],
    ['Service Worker', d.serviceWorker ? 'ja' : 'nein'],
    ['Push', d.pushManager ? 'ja' : 'nein'],
    ['Mitteilungen', d.notification ? 'ja' : 'nein'],
    ['Erlaubnis', { granted: 'erteilt', denied: 'abgelehnt', default: 'noch nicht gefragt' }[d.erlaubnis] || d.erlaubnis],
    ['Zahl am Symbol', d.symbolZahl ? 'ja' : 'nein'],
  ];
  $('diagnose').innerHTML = zeilen.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join('');
  $('geraet').textContent = d.geraet;
  if (!d.alsApp) $('hinweis').hidden = false;
}

function melden(text, fehler) {
  $('meldung').textContent = text;
  $('meldung').className = fehler ? 'meldung fehler' : 'meldung';
}

let registrierung = null;

async function anmelden() {
  try {
    if (!('Notification' in window) || !('PushManager' in window)) {
      melden('Dieses Gerät bietet hier keine Mitteilungen an. Bitte die Tabelle oben abfotografieren.', true);
      return;
    }
    const erlaubnis = await Notification.requestPermission();
    diagnoseZeigen();
    if (erlaubnis !== 'granted') { melden('Erlaubnis nicht erteilt: ' + erlaubnis, true); return; }
    const reg = registrierung || await navigator.serviceWorker.ready;
    if (VARIANTE === 'c') {
      await firebaseKennung(reg, false);
      return;
    }
    let abo = await reg.pushManager.getSubscription();
    if (!abo) abo = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: bytes(OEFFENTLICH) });
    kennungZeigen(abo);
    melden('Angemeldet. Jetzt die Kennung per Mail an sich selbst senden.');
  } catch (e) {
    melden('Fehler beim Anmelden: ' + (e && e.message || e), true);
  }
}

// Variante c meldet das Gerät bei Firebase an; die Kennung ist dann ein Firebase-Token. „neu“ verwirft
// zuerst das bisherige Token, falls Firebase es nicht mehr kennt (Antwort „NotRegistered“ beim Senden).
async function firebaseKennung(reg, neu) {
  if (!window.FIREBASE || !window.FIREBASE.config.apiKey) { melden('Firebase ist in firebase-config.js noch nicht eingetragen.', true); return; }
  if (!firebase.apps.length) firebase.initializeApp(window.FIREBASE.config);
  const m = firebase.messaging();
  if (neu) await m.deleteToken().catch(() => {});
  const token = await m.getToken({ vapidKey: window.FIREBASE.vapidKey, serviceWorkerRegistration: reg });
  kennungZeigen({ toJSON: () => token }, token);
  $('laenge').textContent = token.length + ' Zeichen, geholt um ' + new Date().toLocaleTimeString('de-AT') + (alsApp() ? '' : ', nicht als Web-App');
  melden('Bei Firebase angemeldet. Jetzt „Kennung kopieren“ und in den Chat einfügen.');
}

async function neuAnmelden() {
  try { await firebaseKennung(registrierung || await navigator.serviceWorker.ready, true); }
  catch (e) { melden('Fehler beim Anmelden: ' + (e && e.message || e), true); }
}

function kennungZeigen(abo, rein) {
  const text = rein || JSON.stringify(abo);
  $('kennung').value = text;
  $('kennungBox').hidden = false;
  const koerper = 'Kennung der Probe ' + VARIANTE.toUpperCase() + ' für Claude:\n\nKENNUNG-ANFANG' + text +
    'KENNUNG-ENDE\n\n' + JSON.stringify(diagnose());
  if ($('mail')) $('mail').href = 'mailto:?subject=' + encodeURIComponent('C41 Probe Mitteilungen ' + VARIANTE.toUpperCase()) +
    '&body=' + encodeURIComponent(koerper);
}

async function kopieren() {
  const feld = $('kennung');
  try { await navigator.clipboard.writeText(feld.value); }
  catch (e) { feld.select(); document.execCommand('copy'); }
  melden('Kennung kopiert.');
}

async function ortsprobe() {
  try {
    const reg = registrierung || await navigator.serviceWorker.ready;
    await reg.showNotification('Club 41', { body: 'Probe auf dem Gerät, ohne PC.', icon: '../../bilder/symbol-192.png' });
    melden('Probe-Mitteilung angezeigt.');
  } catch (e) {
    melden('Fehler: ' + (e && e.message || e), true);
  }
}

async function protokollZeigen() {
  try {
    const c = await caches.open('probe');
    const r = await c.match('protokoll');
    const liste = r ? await r.json() : [];
    $('protokoll').innerHTML = liste.length
      ? liste.slice().reverse().map(e => `<li>${e.empfangen}: ${e.titel}, gesendet ${e.gesendet || '?'}${e.zahl != null ? ', Zahl ' + e.zahl : ''}</li>`).join('')
      : '<li>Noch keine Mitteilung vom PC empfangen.</li>';
  } catch (e) { /* ohne Cache kein Protokoll */ }
}

async function zahlLoeschen() {
  if (navigator.clearAppBadge) await navigator.clearAppBadge().catch(() => {});
  melden('Zahl am Symbol gelöscht.');
}

async function start() {
  diagnoseZeigen();
  if ('serviceWorker' in navigator) {
    try { registrierung = await navigator.serviceWorker.register('sw.js'); }
    catch (e) { melden('Service Worker nicht angemeldet: ' + e.message, true); }
    try {
      const reg = registrierung || await navigator.serviceWorker.ready;
      const abo = VARIANTE !== 'c' && reg.pushManager && await reg.pushManager.getSubscription();
      if (abo) kennungZeigen(abo);
      if (VARIANTE === 'c' && 'Notification' in window && Notification.permission === 'granted') await firebaseKennung(reg, false);
    } catch (e) { /* noch nicht angemeldet */ }
  }
  $('anmelden').onclick = anmelden;
  $('kopieren').onclick = kopieren;
  $('ortsprobe').onclick = ortsprobe;
  $('zahlLoeschen').onclick = zahlLoeschen;
  if ($('neu')) $('neu').onclick = neuAnmelden;
  protokollZeigen();
  document.addEventListener('visibilitychange', () => { if (!document.hidden) { protokollZeigen(); diagnoseZeigen(); } });
  if (navigator.serviceWorker) navigator.serviceWorker.addEventListener('message', protokollZeigen);
}

start();
