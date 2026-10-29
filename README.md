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

Die Symbole in `bilder/` erzeugt `C41 Clubseite Symbole erzeugen.py` im Vault aus `Logo Club 41 Österreich.svg`;
nicht von Hand ändern.

Nichts Geheimes in dieses Repository: Es ist öffentlich. Die Adresse der Web-App darf hinein, der Clubschlüssel nie.
