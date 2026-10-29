# Clubseite, Club 41

Einstiegsseite zur Clubseite des Club 41 Grieskirchen-Hausruck. Veröffentlicht über GitHub Pages.

Die Clubseite selbst ist die Google-Web-App „C41 Clubseite“ (Konstante `GOOGLE` in `index.html`, Quelle
`03 Bereiche/Club C41/Clubseite/Google/Code.gs` im Vault). Google legt um jede Web-App einen eigenen Rahmen, in
dem sich kein Symbol für den Home-Bildschirm setzen lässt. Diese Seite trägt deshalb das Club-41-Logo als
`apple-touch-icon` und zeigt die Web-App darin an.

Link: `https://hanspeter-meissl.github.io/c41-clubseite/#<Clubschlüssel>`, wahlweise mit `&teil=termine` oder
`&teil=rundschreiben`. Den vollständigen Link gibt `C41 Clubseite abgleichen.py` aus. Der Teil hinter dem „#“
wird nicht an GitHub übertragen. Die Seite merkt sich den Schlüssel im Browser, damit ein Lesezeichen ohne ihn
trotzdem öffnet. Bis Google die Web-App geliefert hat, steht eine Ladeanzeige mit dem Logo über dem Rahmen.

Nach dem Einloggen mit Code schickt die Clubseite einen Geräteschlüssel herauf. Die Seite merkt ihn sich im
Browser (`c41-geraet`) und hängt ihn als `&ich=` an die Adresse der Web-App, nie an die eigene Adresse.
Angenommen wird die Nachricht nur von einer Adresse unter `googleusercontent.com` und nur aus dem eigenen Rahmen.

Nach „Meine Übersicht“ meldet die Clubseite die Zahl der offenen Anmeldungen (`c41: 'zaehler'`). Die Seite merkt
sie (`c41-offen`) und zeigt sie mit `navigator.setAppBadge` am App-Symbol, sobald Mitteilungen erlaubt sind. Danach
fragt einmal ein Balken unten, nur in der Web-App am Home-Bildschirm und nur, wenn etwas offen ist; „Nein danke“
merkt sich `c41-zaehler-nein`. Abmelden löscht die Zahl. `sw.js` tut noch nichts und ist die Grundlage für
Mitteilungen in einer späteren Stufe.

Die Symbole in `bilder/` erzeugt `C41 Clubseite Symbole erzeugen.py` im Vault aus `Logo Club 41 Österreich.svg`;
nicht von Hand ändern.

Nichts Geheimes in dieses Repository: Es ist öffentlich. Die Adresse der Web-App darf hinein, der Clubschlüssel nie.

`probe/` ist die Probe für Mitteilungen (Web Push) vom 29. Oktober 2026, getrennt von der Einstiegsseite und ohne
Clubschlüssel. `probe/a/` hat wie die Einstiegsseite kein Webmanifest, `probe/b/` eines, `probe/c/` meldet das Gerät bei Firebase an (öffentliche Angaben in `probe/c/firebase-config.js`). Jede Variante hat ihren
eigenen Service Worker, der nur in ihrem Ordner gilt; der gemeinsame Code steht in `probe/sw-gemeinsam.js` und
`probe/probe.js`. Der öffentliche Schlüssel in `probe.js` gehört zu `C41 Mitteilung Probe senden.py` im Vault, der
private liegt nur am PC. Nach der Probe kommt der Ordner wieder weg.
