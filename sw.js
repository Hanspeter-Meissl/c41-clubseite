// Service Worker der Einstiegsseite (seit 29. Oktober 2026). Er tut noch nichts und ist die Grundlage für
// Mitteilungen in einer späteren Stufe. Ohne Abruf-Handler gehen alle Anfragen wie bisher ans Netz.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
