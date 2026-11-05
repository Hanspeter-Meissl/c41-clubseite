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

iPad und Windows (seit 31. Oktober 2026): Das iPad bekommt eigene `apple-touch-icon` in 152 und 167 Pixel. Unter
Windows hängt die Seite `manifest.webmanifest` ein, Edge und Chrome bieten dann „Als App installieren“ an: eigenes
Fenster, Clublogo in Startmenü und Taskleiste. Ein Balken fragt einmal danach, „Nein danke“ merkt sich
`c41-installieren-nein`. Android bekommt das Manifest seit 4. November 2026 ebenso, mit eigenem Balkentext; die
Frage nach Mitteilungen hängt dort nicht an `setAppBadge`. iPhone und iPad bekommen es nicht, weil sie der App am Home-Bildschirm einen
eigenen Speicher geben und mit der Startadresse ohne Clubschlüssel öffnen würden. Die App unter Windows und Android teilt den
Speicher mit dem Browser und findet den gemerkten Schlüssel. Anheften an die Taskleiste macht das Mitglied selbst.

Android-Browser außer Chrome bekommen das Manifest seit 5. November 2026 nicht mehr, weil Google Play Protect die Installation aus Samsung Internet blockiert. Dort zeigt die Seite den Balken
„Für die App bitte in Chrome öffnen“; sein Knopf öffnet die Seite über einen `intent://`-Link in Chrome und gibt den Clubschlüssel mit, nicht den Geräteschlüssel. „Nein danke“ merkt sich `c41-installieren-nein`.

Die Symbole in `bilder/` erzeugt `C41 Clubseite Symbole erzeugen.py` im Vault aus `Logo Club 41 Österreich.svg`;
nicht von Hand ändern.

Der Ordner `emoji/` enthält die Flaggenschrift für Windows und die vollständige Emoji-Auswahl am PC. Die Clubseite lädt
diese Dateien erst, wenn sie gebraucht werden; Betrieb und Testumgebung nutzen dieselben. Siehe `emoji/LIESMICH.md`.

Gerät (seit 5. November 2026): Eingeloggt hängt die Seite `&art=` an die Adresse der Web-App, etwa `iPhone|393x852|3` oder
`Android|412x915|2.6|SM-S921B`, für „Mitglieder in der App“. Das Android-Modell merkt sie in `c41-modell`. Am PC nur die Plattform.

Nichts Geheimes in dieses Repository: Es ist öffentlich. Die Adresse der Web-App darf hinein, der Clubschlüssel nie.

Die Probe für Mitteilungen über Firebase (`probe/`, 29. Oktober 2026) ist nach der Umstellung am 31. Oktober 2026
entfernt; die Mitteilungen laufen in der Einstiegsseite selbst.
