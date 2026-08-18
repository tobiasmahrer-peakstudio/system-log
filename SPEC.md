# SPEC / Kontext-Übergabe — Wildstrubel-ARG

Dieses Dokument ist für die Fortsetzung mit Claude Code gedacht. Es enthält
den vollständigen Kontext, damit nichts aus der bisherigen Planung verloren
geht.

## Das Geschenk

Tobias möchte seiner Schwester (und ihrem Mann, Doktor in Robotik) eine
Wanderung auf den **Wildstrubel** mit Übernachtung in der
**Wildstrubelhütte** schenken, verpackt als mehrstufiges
Rätsel-/ARG-System im Terminal-/Systemlog-Stil.

**Route (bestätigt):** Lenk → Aufstieg zur Wildstrubelhütte (Übernachtung
dort) → am Folgetag Gipfelaufstieg Wildstrubel → zurück nach Lenk.

## WICHTIG — Zeitrahmen (kritisch, unbedingt beachten)

- **Die Wanderung selbst findet erst 2027 statt.** Es gibt noch kein
  exaktes Datum.
- **Aber:** Die Rätselkette soll bis zur **Hochzeit am 3. Oktober 2026**
  vollständig gelöst sein — dort soll die Auflösung/das "Objective" also
  bereits bekannt sein.
- Heutiges Datum bei Konzeption: 18. August 2026. Das lässt ca. **6–6.5
  Wochen** bis zum Finale (3.10.2026).
- **Konsequenz für den Text der Finale-Auflösung:** Sie darf NICHT den
  Eindruck erwecken, die Tour stehe unmittelbar an. Die letzte Log-Karte /
  der letzte Website-Screen muss explizit klarstellen, dass es sich um ein
  für 2027 geplantes Ziel handelt (z.B. `MISSION SCHEDULED FOR: 2027` oder
  ähnlich), damit keine Verwechslung entsteht ("müssen wir jetzt sofort
  losziehen?").
- Die zwei physischen Karten (LOG 001 "PLAY") sind bereits erfolgreich
  gelöst und übergeben worden (Stand: heute). Die Website übernimmt ab
  LOG 002.

## Bereits umgesetzt (dieses Repo)

- Terminal-Style-Engine (Boot-Sequenz, Log-Anzeige, Eingabefeld,
  SHA-256-Hash-Prüfung, Fortschritt via `localStorage`), 4:5-freundlich,
  mobile-first, dunkles CRT-Theme.
- LOG 002 fertig: Caesar-Chiffre (Shift 3) → Lösung `CALIBRATE`.
- **LOG 002–010 komplett** in `js/levels.js`, inkl. echter `solutionHash`-Werte
  (mit `node scripts/hash.js "ANTWORT"` erzeugt und geprüft). Details siehe
  Levelplan unten — Inhalte entsprechen dem dort beschriebenen Ablauf
  (Fragment-Ciphers, Koordinaten-Merge, Finale mit 2027-Hinweis).
- LOG 003 & LOG 006 (Real-Life-Level) sind funktionsfähig deployt: Freischalt-
  codes sind bereits festgelegt und gehasht (`SENSOR-OK-19` bzw.
  `TANDEM-OK-27`). Der `reallifeLink` zeigt auf einen `wa.me`-Link zu Tobias'
  WhatsApp (078 638 48 74, kein Signup nötig, sofort einsatzbereit).
  Optional: auf Formspree/Google-Form umstellen (siehe README), wenn ein
  eingebettetes Formular gewünscht ist — funktional nicht nötig.
- Hilfsskript `scripts/hash.js` zum Erzeugen von Lösungs-Hashes.
- **Zeitsperre zwischen Logs:** nach jedem gelösten Log ein live tickender
  "SYSTEM LOG // STANDBY"-Countdown (~4 Tage, `COUNTDOWN_MS` in `js/app.js`),
  bevor das nächste Log erscheint — verhindert, dass die ganze Kette an
  einem Abend durchgespielt wird. Der Übergang zu LOG 010 ist davon
  ausgenommen: fix auf `FINALE_UNLOCK_AT` = 3.10.2026 00:00 Uhr gesetzt, egal
  wie schnell/langsam der Rest ging.
- **Wiederherstellungscode (Save Code):** deterministisch aus der Log-ID
  abgeleiteter 6-stelliger Code, sichtbar unten auf jedem Screen. Funktioniert
  geräteunabhängig (kein Server, kein Zufall) — bei Cache-Verlust oder
  Gerätewechsel über "» Code eingeben" wieder einsteigen, ohne einen dort
  evtl. laufenden Countdown erneut abwarten zu müssen.

## Zeitplan (Vorschlag, ~1 Log/Woche, 18.8. → 3.10.2026)

Reallife-Level bewusst nicht in die letzte Woche gelegt (Wetter-/Terminpuffer).

| Woche          | Log(s)                                   |
|----------------|-------------------------------------------|
| ab 18.8.       | LOG 002 (live) → LOG 003 (Real-Life)      |
| 25.8. – 31.8.  | LOG 004 (Mathe-Check)                     |
| 1.9. – 7.9.    | LOG 005 (Fragment A, Cross-Reference-Rätsel) |
| 8.9. – 14.9.   | LOG 006 (Real-Life, zu zweit — früh genug für Puffer) |
| 15.9. – 21.9.  | LOG 007 (Fragment B, Decoy/Prüfsumme)     |
| 22.9. – 28.9.  | LOG 008 (Verifikationscode)               |
| 29.9. – 2.10.  | LOG 009 (Hütten-Kategorie-Teaser) → LOG 010 (Finale mit vollständiger Auflösung, spätestens 2.10., einen Tag vor der Hochzeit) |

Freischaltung z.B. durch Ändern von `progress.levelIndex` bzw. schlicht durch
Bekanntgabe "Log X ist jetzt online" ist nicht nötig — alle Level sind bereits
im Array, die Website schaltet automatisch fort, sobald der/die Vorgänger-Code
richtig eingegeben wurde. "Wöchentliche Freischaltung" bedeutet hier also nur:
**du sagst ihr wann sie weitermachen soll / wann du den Freischaltcode für ein
Real-Life-Level rausgibst** — technisch ist alles von Tag 1 an im Code.

## Offene Aufgaben für Claude Code

1. ~~Zeitplan konkretisieren~~ — siehe Tabelle oben.
2. ~~LOG 004–009 ausarbeiten~~ — erledigt in `js/levels.js`.
3. ~~LOG 003 fertigstellen~~ — Code + Hash gesetzt, WhatsApp-Link (wa.me) als Fallback.
4. ~~LOG 010 (Finale) schreiben~~ — mit `MISSION SCHEDULED FOR: 2027`-Hinweis.
5. **Design-Feinschliff:** ggf. Screenshot-Test auf echtem Handy, Boot-
   Sequenz-Timing prüfen, evtl. Sound-Optional (nice-to-have, kein Muss).
6. **Hosting einrichten** (GitHub Pages oder Netlify) + `robots.txt` mit
   `Disallow: /` (Seite soll nicht auffindbar sein, nur über direkten Link).
   `robots.txt` existiert bereits im Repo — nur noch deployen.
7. **Letzte Übergabe-Karte** (physisch, optional): enthält URL + ersten
   Zugangscode zu LOG 002. Falls noch nicht existiert, mit Tobias klären,
   ob das digital (Nachricht) oder nochmal als Karte passiert.
8. Sobald Tobias die exakten Routendaten (Distanz, Höhenmeter, Gehzeit,
   ggf. GPX) liefert, diese in die Telemetrie-Logs einbauen (siehe unten).
9. ~~Koordinaten verifizieren~~ — von Tobias bestätigt: 46.400327, 7.528514.
   In LOG 005/007/008 als 46°24'N 7°32'E (auf die Bogenminute gerundet)
   verbaut.

## Levelplan (aktueller Stand, `js/levels.js`)

**Design-Prinzip (wichtig, von Tobias explizit gewünscht):** Die Auflösung
(Bergname `WILDSTRUBEL`, Hüttenname `WILDSTRUBELHÜTTE`, Koordinaten) darf
NIRGENDS vor LOG 010 auftauchen — auch nicht implizit über echte, in Google
Maps einfügbare Koordinaten. Zwischenstufen liefern nur abstrakte,
nicht-identifizierende Fragmente (`FRAG17`, `FRAGB29`, Verifikationscode
`34`). Generische Begriffe wie "Berghütte" oder Aktivitäten wie "Wandern"
dürfen genannt werden — konkrete Namen/Koordinaten nicht. Zusätzlich gibt es
"Troubleshooting"-Elemente: Werte müssen über mehrere Logs hinweg
kombiniert/aus früheren Logs abgeleitet werden (Quersumme von
`PARAMETER X = 3243`), und LOG 007 enthält einen bewussten Decoy
(zwei Signale, nur eines ist gültig, Prüfsumme entscheidet).

- **LOG 001** (Karte, erledigt) — Binary → ASCII → `PLAY`.
- **LOG 002** (Website, fertig) — Caesar-Chiffre → `CALIBRATE`.
- **LOG 003** (Real-Life) — 3 km Lauf/Spaziergang, Foto-Nachweis,
  Freischaltcode `SENSOR-OK-19` nach Prüfung. Erfolg liefert
  `PARAMETER X = 3243` (bewusst neutral benannt, keine Höhenangabe).
- **LOG 004** — Mathe-Cross-Check (Summe 1–80 + 3), bestätigt `3243`
  unabhängig ein zweites Mal.
- **LOG 005** — Binary → ASCII → Caesar-Shift, wobei der Shift selbst erst
  über die Quersumme von `PARAMETER X` (3+2+4+3=12) hergeleitet werden muss
  (Cross-Referencing zu LOG 003/004). Ergebnis: abstrakter Code `FRAG17`.
- **LOG 006** — Real-Life, "TWO USERS REQUIRED": gemeinsame Aktivität mit
  ihrem Mann, Distanz = 3 × `PARAMETER X` = 9729 m (~9.73 km, Callback zu
  LOG 004), Foto-Nachweis, Freischaltcode `TANDEM-OK-27` nach Prüfung.
- **LOG 007** — Troubleshooting: zwei Spiegel-Cipher-Signale empfangen, nur
  eines ist gültig (Prüfsumme = Quersumme(X) − 1 = 11); das andere ist ein
  Decoy (`ERROR04`, ungültige Prüfsumme). Gültiges Signal dekodiert zu
  `FRAGB29`.
- **LOG 008** — Fragment-Verifikation: `(Zahl aus FRAG17) + (Zahl aus
  FRAGB29) − Quersumme(X) = 34`. Reine Zahlen-/Logikaufgabe, keine
  Standortinfo.
- **LOG 009** — Reverse-Anagramm liefert nur die generische Kategorie
  `BERGHUETTE` (Übernachtung) — noch nicht der konkrete Name.
- **LOG 010 (Finale)** — Fragmente werden erstmals zu echten Koordinaten
  (46°24'N 7°32'E) zusammengeführt, **hier zum ersten Mal** Bergname
  (`WILDSTRUBEL`) + Hüttenname (`WILDSTRUBELHÜTTE`) + Route (Lenk → Hütte →
  Gipfel → Lenk) + **klarer Hinweis, dass die Durchführung für 2027 geplant
  ist** (`MISSION SCHEDULED FOR: 2027`). Timing: fertig/übergeben spätestens
  3.10.2026 (Hochzeit).

## Offene Fragen an Tobias (falls noch nicht geklärt)

- Exakte Routendaten (Distanz, Höhenmeter, Gehzeit) für die Telemetrie-Logs.
- Wie soll der Übergang von Karte → Website konkret ausgeliefert werden
  (neue Karte mit URL, oder Nachricht/QR-Code)?
- Soll es zusätzlich zur Website noch eine gedruckte Abschlusskarte fürs
  Finale geben (z.B. für den Hochzeitstag überreicht)?
