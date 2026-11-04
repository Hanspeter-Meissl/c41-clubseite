// Emoji-Auswahl der Clubseite am PC. Die Clubseite lädt diese Datei beim ersten Öffnen der Auswahl als Modul und ruft
// danach window.c41EmojiAuswahl() auf. Sie ist der einzige Ort, der die Dateien in diesem Ordner zusammenführt.
import Picker from './picker.js';
import de from './de.js';

window.c41EmojiAuswahl = () => new Picker({
  locale: 'de',
  dataSource: new URL('daten.json', import.meta.url).href,
  i18n: de,
});
