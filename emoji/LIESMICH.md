# Emojis und Flaggen der Clubseite

Die Clubseite lädt diese Dateien erst, wenn sie gebraucht werden. Die Versionen sind festgeschrieben: Ein Update heißt,
die Dateien hier bewusst zu ersetzen und in der Testumgebung zu prüfen.

| Datei | Herkunft | Zweck |
|---|---|---|
| `TwemojiCountryFlags.woff2` | npm `country-flag-emoji-polyfill` 0.1.10, nur die Schrift, kein Programmcode (MIT) | Flaggen unter Windows; Windows bringt keine mit |
| `picker.js`, `database.js`, `de.js` | npm `emoji-picker-element` 1.29.1 (Apache-2.0) | Vollständige Emoji-Auswahl mit Suche am PC |
| `daten.json` | npm `emoji-picker-element-data` 1.8.0, `de/cldr/data.json` (Apache-2.0) | Deutsche Namen und Suchbegriffe |
| `auswahl.js` | eigene Datei | Führt Auswahl, deutsche Texte und Daten zusammen |

Die Flaggenschrift enthält Bilder aus Twemoji (CC-BY 4.0, Twitter, Inc. und Mitwirkende).
