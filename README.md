# Wildstrubel ARG — Website

Terminal-Style-Website für die Rätselkette. Karte 1 (PLAY) wurde bereits
physisch gelöst und übergeben — diese Website übernimmt ab LOG 002.

## Struktur

```
index.html        Terminal-UI (Boot-Screen + Log-Anzeige + Input)
css/style.css      dunkler Terminal-/CRT-Look, 4:5-freundlich, mobile-first
js/levels.js       ALLE Level-Inhalte + Lösungs-Hashes (hier weiterarbeiten!)
js/app.js          Engine: Boot-Sequenz, Freischalt-Logik, Fortschritt (localStorage)
scripts/hash.js    Hilfsskript: node scripts/hash.js "ANTWORT" -> SHA-256 Hash
```

Keine Frameworks, kein Build-Step. Einfach die Datei `index.html` öffnen
oder auf einen statischen Host legen.

## Wie ein neues Level hinzugefügt wird

1. Antwort festlegen, z.B. `"WILDSTRUBEL"`.
2. Hash erzeugen: `node scripts/hash.js "WILDSTRUBEL"`
3. In `js/levels.js` einen neuen Eintrag im `LEVELS`-Array ergänzen (Reihenfolge = Freischalt-Reihenfolge).
4. Bei `type: "reallife"`-Leveln: `reallifeLink` auf ein echtes Formular setzen (siehe unten) und den Freischaltcode erst NACH manueller Prüfung vergeben.

Die Engine prüft Eingaben clientseitig gegen den Hash — die Lösung steht
nicht im Klartext im Quellcode. Das ist kein kryptografischer Schutz vor
einem entschlossenen Informatiker, aber ausreichend, damit man nicht durch
zufälliges "Rechtsklick -> Quelltext ansehen" spoilert.

## Real-Life-Level (Foto-/Aktivitätsnachweis)

**Aktueller Stand:** LOG 003 und LOG 006 sind bereits mit einem funktionierenden
`wa.me`-Link auf WhatsApp (078 638 48 74) verdrahtet (kein Signup nötig).
Freischaltcodes sind vorab festgelegt und gehasht: `SENSOR-OK-19` (LOG 003)
und `TANDEM-OK-27` (LOG 006). Nichts weiter zu tun, ausser sie bei Bedarf zu
ändern.

Optional, für ein eingebettetes Formular statt E-Mail: [Formspree](https://formspree.io)
(kostenloser Tarif reicht) oder ein Google Form mit Datei-Upload. Ablauf:

1. Sie füllt das Formular aus / lädt ein Foto hoch.
2. Du bekommst eine Mail-Benachrichtigung.
3. Du prüfst den Nachweis, denkst dir einen Freischaltcode aus (z.B. `SENSOR-OK-19`).
4. Du berechnest den Hash (`node scripts/hash.js "SENSOR-OK-19"`), trägst ihn in `levels.js` ein
   **oder** — einfacher für den Live-Betrieb — du schickst ihr den Code direkt
   per Nachricht, ohne den Hash vorher zu kennen, weil du das Level schon
   vorbereitet hast, bevor sie startet.

   Praktischer Tipp: Lege den Freischaltcode für jedes Real-Life-Level VORAB
   fest (nicht spontan), damit `levels.js` schon fertig deployed ist, bevor
   sie überhaupt an diesem Level ankommt. Du gibst den Code erst frei, wenn
   der Nachweis stimmt — technisch ist er aber schon "im System".

## Zeitsperre zwischen Logs (Countdown)

Nach jedem gelösten Log erscheint ein "SYSTEM LOG // STANDBY"-Countdown
(~4 Tage, live tickend), bevor das nächste Log sichtbar wird — so kann die
Kette nicht an einem Abend durchgespielt werden. Ausnahme: der Übergang zu
LOG 010 (Finale) ignoriert diese relative 4-Tage-Regel und ist stattdessen
fix auf **3. Oktober 2026, 00:00 Uhr** gesetzt (`FINALE_UNLOCK_AT` in
`js/app.js`) — die grosse Auflösung landet also immer am Hochzeitstag,
unabhängig davon, wie schnell oder langsam sie durch den Rest der Kette
kommt.

Zum Anpassen: `COUNTDOWN_MS` (Standard 4 Tage) bzw. `FINALE_UNLOCK_AT` ganz
oben in `js/app.js`.

## Manuelle Komplettsperre (LOCKDOWN)

`LOCKDOWN` in `js/app.js` blockiert alles NACH einem bestimmten Log
komplett (keine Eingabe, kein Countdown, kein Save-Code-Bereich) und zeigt
stattdessen eine Fehlermeldung. Aktuell aktiv: alles nach LOG 003 ist
offline. Der Fortschritt im Hintergrund läuft normal weiter (Freischalt-
codes funktionieren, Countdowns laufen), es wird nur nichts davon
angezeigt — sobald die Sperre aufgehoben wird, erscheint automatisch genau
der Stand, der eigentlich gerade gültig wäre.

**Wieder freischalten:** `LOCKDOWN.enabled` in `js/app.js` auf `false`
setzen (oder `afterLevelId` auf ein späteres Log ändern), committen, pushen.

## Cache-Busting bei Updates

Sobald jemand die Seite einmal geöffnet hat, kann der Browser `css/style.css`,
`js/levels.js` und `js/app.js` cachen. Pusht du danach eine Änderung an
diesen Dateien, sieht das Gerät ohne Weiteres evtl. noch die alte Version.

Deshalb hängt `index.html` an allen drei ein `?v=1` an. **Nach jedem Push,
der `app.js`, `levels.js` oder `style.css` ändert, diese Zahl in
`index.html` um 1 erhöhen** (an allen drei Stellen) — das zwingt jeden
Browser, die Datei neu zu laden, statt eine alte Kopie zu verwenden. Kein
manuelles Cache-Leeren auf ihrer Seite nötig.

## Wiederherstellungscode (Save Code)

Unten auf jedem Log-Screen steht ein 6-stelliger `SAVE CODE`. Er ist rein
deterministisch aus der Log-ID abgeleitet (kein Zufall, keine Server-
Speicherung) — bleibt also für ein bestimmtes Log immer gleich und
funktioniert auf jedem Gerät/Browser. Verliert sie ihren Fortschritt
(Cache gelöscht, anderes Gerät), klickt sie auf "» Code eingeben" und trägt
den zuletzt notierten Code ein — das setzt sie exakt auf das Log zurück, zu
dem der Code gehört, und überspringt einen dort evtl. laufenden Countdown
(da dieses Log ja bereits einmal freigeschaltet war).

## Hosting (kostenlos, in Minuten)

**GitHub Pages:**
```
git init
git add .
git commit -m "init"
# Repo auf GitHub erstellen, dann:
git remote add origin <REPO-URL>
git push -u origin main
# In den Repo-Settings: Pages -> Branch main -> / (root)
```

**Netlify (noch einfacher):** Ordner per Drag & Drop auf app.netlify.com
ziehen — fertig, sofort eine URL.

Wichtig: Die Website sollte NICHT öffentlich auffindbar/verlinkt sein
(kein Sitemap-Eintrag, keine Suchmaschinen-Indexierung). Eine `robots.txt`
mit `Disallow: /` ist bereits sinnvoll, damit die URL nur über den Link auf
der Karte gefunden wird.

## Fortschritt zurücksetzen (zum Testen)

Im Browser die Konsole öffnen und ausführen:
```js
localStorage.removeItem("wildstrubel_arg_progress")
```
Danach Seite neu laden -> startet wieder bei LOG 002.

## Offene TODOs

Siehe `SPEC.md` für den vollständigen Kontext, den Levelplan und den
Zeitrahmen (Finale muss bis zum 3.10.2026 stehen).
