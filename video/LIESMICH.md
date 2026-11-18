# Verkleinern von Videos in der Clubseite

Die Clubseite lädt diese Datei erst beim ersten Video, das ein Mitglied im Chat sendet. Sie rechnet das Video am Handy auf
höchstens 720 Pixel an der kurzen Seite in H.264 um (siehe `videoVerkleinern` in `Chat.gs`).

| Datei | Herkunft | Zweck |
|---|---|---|
| `mediabunny.min.mjs` | npm `mediabunny` 1.63.0, `dist/bundles/mediabunny.min.mjs`, unverändert (MPL-2.0, `LICENSE-mediabunny.txt`) | Lesen, Umrechnen und Schreiben der Videos |

Bis 18. November 2026 kam die Datei von jsDelivr. Sie liegt seither hier, weil die Seite den Geräteschlüssel im Speicher
hält und fremder Code ohne Prüfsumme dort nicht laufen soll (Vorschlag D4 in „Clubseite Verbesserungsvorschläge
November 2026“). Die Datei ist bytegleich mit der von jsDelivr, SHA-256
`cc09a39d3c6e936d1556b7a2de4863cc31a9d90fc0d792fb78bc0ab71184600b`.

Ein Update heißt, die Datei hier bewusst zu ersetzen, die Version oben und in `Chat.gs` (`MB_ADRESSE`) nachzuziehen und
in der Testumgebung mit einem Video vom iPhone zu prüfen.
