// ============================================================
// LEVEL DEFINITIONS
// ============================================================
// solutionHash = SHA-256 hex of the expected answer, normalized as:
//   answer.trim().toUpperCase()
// Generate new hashes with: node scripts/hash.js "ANTWORT"
// or in the browser console: await sha256("ANTWORT")
//
// type: "cipher"   -> normal puzzle, text input checked against solutionHash
//       "reallife" -> shows task + submission link, still checked against
//                     solutionHash (the code YOU hand out after approving proof)
// ============================================================

const LEVELS = [

  // LOG 001 was the physical card (PLAY) - already solved, not rendered here.
  // We start the site at LOG 002.

  {
    id: "002",
    type: "cipher",
    header: "SYSTEM LOG // 002",
    body:
`CORE — ONLINE
MEMORY — SYNCED
PLAYER ID 01 — CONFIRMED

>> DECRYPTION MODULE LOADED

INCOMING TRANSMISSION (CAESAR CIPHER, SHIFT UNKNOWN):

  F D O L E U D W H

FIND THE SHIFT. DECODE THE WORD.`,
    // answer: CALIBRATE
    solutionHash: "ed15028e4c3ca28554ea8790bd4c158ee8a98edf08391b4795837becc803977d",
    onSuccessAppend:
`
>> DECRYPTION SUCCESSFUL: "CALIBRATE"
>> ACTION REQUIRED: PHYSICAL SENSOR CALIBRATION PENDING`
  },

  {
    id: "003",
    type: "reallife",
    header: "SYSTEM LOG // 003",
    body:
`SENSOR CALIBRATION REQUIRED

Bevor das System fortfahren kann, muss ein Bewegungssensor
im Feld kalibriert werden.

AUFGABE:
  - Kurzer Lauf oder Spaziergang (min. 3 km)
  - Nachweis: Screenshot der zurückgelegten Distanz
    (z.B. aus einer beliebigen Fitness-App)

Nach Einreichung erfolgt eine manuelle Systemprüfung.`,
    reallifeText: "Reiche deinen Kalibrierungs-Nachweis über den Link unten ein.",
    // No-signup fallback: opens a WhatsApp chat with the admin, prefilled
    // with context so it's clear which log the proof belongs to.
    reallifeLink: "https://wa.me/41786384874?text=LOG%20003%20-%20Sensor-Nachweis",
    // answer: "SENSOR-OK-19" (chosen in advance, handed out after checking the proof)
    solutionHash: "444d44d07b1c16ed48f75847d6ec30f11550cd05b67496e46c208ef7059a6c66",
    onSuccessAppend:
`
>> CALIBRATION CONFIRMED
>> TELEMETRY STREAM UNLOCKED: PARAMETER X = 3243`
  },

  {
    id: "004",
    type: "cipher",
    header: "SYSTEM LOG // 004",
    body:
`TELEMETRY STREAM ACTIVE
PARAMETER X = 3243  [UNCONFIRMED — SINGLE SOURCE]

>> CROSS-VALIDATION MODULE LOADED

INDEPENDENT VERIFICATION REQUIRED. SECONDARY SENSOR ARRAY
COMPUTES PARAMETER X VIA EIGENE METHODE.

BERECHNE:
  SUMME ALLER GANZEN ZAHLEN VON 1 BIS 80
  + 3

GIB DAS ERGEBNIS EIN.`,
    // answer: 3243
    solutionHash: "46008e02d0ac39b1a34c8b47375f3e23cdbccfcc06d833f972131f874558bfe2",
    onSuccessAppend:
`
>> CROSS-VALIDATION: MATCH.
>> PARAMETER X CONFIRMED (DUAL SOURCE): 3243`
  },

  {
    id: "005",
    type: "cipher",
    header: "SYSTEM LOG // 005",
    body:
`FRAGMENT CHANNEL A — TRANSMISSION RECEIVED (BINARY):

  01010010 01000100 01001101 01010011 00110001 00110111

>> STEP 1: BINARY -> ASCII
>> STEP 2: CAESAR-SHIFT UNBEKANNT.
   HINWEIS: SHIFT = QUERSUMME VON PARAMETER X (SIEHE LOG 003/004)
>> STEP 3: SHIFT RÜCKWÄRTS ANWENDEN (NUR BUCHSTABEN, ZIFFERN UNVERÄNDERT)

DECODE DAS FRAGMENT.`,
    // binary -> "RDMS17" -> quersumme(3243)=12 -> shift back 12 (letters only) -> "FRAG17"
    solutionHash: "f8ba54a2af5a7505800716180c7c4fe4dd230d7598c79491a2691989cc2eb7ba",
    onSuccessAppend:
`
>> FRAGMENT A STORED: FRAG17
>> STATUS: AWAITING FRAGMENT B`
  },

  {
    id: "006",
    type: "reallife",
    header: "SYSTEM LOG // 006",
    body:
`DUAL-SENSOR SYNCHRONISATION ERFORDERLICH

>> ERKENNUNG: ZWEITER BENUTZER IM SYSTEM NOTWENDIG

ZIELDISTANZ AUS PARAMETER X ABGELEITET (SIEHE LOG 004):

  3 × PARAMETER X  =  3 × 3243 M  =  9729 M  (~9.73 KM)

AUFGABE:
  - Gemeinsame Aktivität, mind. 9.73 km (Wandern, Laufen, Velo, ...)
  - BEIDE Sensoren müssen gleichzeitig aktiv sein (ihr beide zusammen!)
  - Nachweis: Foto von euch beiden bei der Aktivität ODER
    Tracking-Screenshot mit Distanz

Nach Einreichung erfolgt eine manuelle Systemprüfung.`,
    reallifeText: "Reicht euren gemeinsamen Nachweis über den Link unten ein.",
    reallifeLink: "https://wa.me/41786384874?text=LOG%20006%20-%20Dual-Sensor-Nachweis",
    // answer: "TANDEM-OK-27" (chosen in advance, handed out after checking the proof)
    solutionHash: "e2f46a714d65a41e3927f181085754943d70e8ef1182b4b550fee5ea942f506a",
    onSuccessAppend:
`
>> DUAL-SENSOR SYNC CONFIRMED
>> TWO-USER REQUIREMENT SATISFIED`
  },

  {
    id: "007",
    type: "cipher",
    header: "SYSTEM LOG // 007",
    body:
`SIGNAL INTERFERENCE — ZWEI TRANSMISSIONEN EMPFANGEN
(SPIEGEL-CIPHER: A<->Z VERTAUSCHT, ZIFFERN UNVERÄNDERT):

  KANDIDAT 1:  VIILI04
  KANDIDAT 2:  UIZTY29

NUR EINE TRANSMISSION IST GÜLTIG.
GÜLTIGKEITSPRÜFUNG: ZIFFERNSUMME MUSS
  QUERSUMME(PARAMETER X) − 1  ERGEBEN.

FINDE UND DEKODIERE DIE GÜLTIGE TRANSMISSION.`,
    // quersumme(3243)=12, valid checksum=11. Candidate 1 "ERROR04" (sum 4) invalid.
    // Candidate 2 atbash("UIZTY29") -> "FRAGB29" (sum 2+9=11) valid.
    solutionHash: "b922718e37ced9ec558fff125dd55a1a853f7ab8e08885ae5d1aa18bdc98ae12",
    onSuccessAppend:
`
>> FRAGMENT B STORED: FRAGB29
>> DECOY DISCARDED: VIILI04 (CHECKSUM INVALID)`
  },

  {
    id: "008",
    type: "cipher",
    header: "SYSTEM LOG // 008",
    body:
`FRAGMENT VERIFICATION

  FRAGMENT A: FRAG17
  FRAGMENT B: FRAGB29

BERECHNE DEN VERIFIKATIONSCODE:

  (ZAHL AUS FRAGMENT A) + (ZAHL AUS FRAGMENT B) − QUERSUMME(PARAMETER X)

GIB DAS ERGEBNIS EIN.`,
    // 17 + 29 - 12 = 34
    solutionHash: "86e50149658661312a9e0b35558d84f6c6d3da797f552a9657fe0558ca40cdef",
    onSuccessAppend:
`
>> VERIFICATION PASSED
>> TRIANGULATION MODULE ARMED — AWAITING FINAL SYNC`
  },

  {
    id: "009",
    type: "cipher",
    header: "SYSTEM LOG // 009",
    body:
`TRIANGULATION MODULE ARMED
SECONDARY OBJECTIVE CLASS: UNBEKANNT

>> LABEL-SIGNAL BESCHÄDIGT — ÜBERTRAGUNG IN UMGEKEHRTER REIHENFOLGE
   EMPFANGEN:

  ETTEUHGREB

KEHRE DIE REIHENFOLGE UM.
WELCHE ART VON ORT IST GEMEINT?`,
    // reverse of "BERGHUETTE" — generic category, not the specific hut name yet
    solutionHash: "1fba676af7e49402f8f760ef6556a83e4b0724d70dafa86a35b920a9eeebe0a1",
    onSuccessAppend:
`
>> OBJECTIVE CLASS CONFIRMED: BERGHUETTE (ÜBERNACHTUNG)
>> IDENTITÄT: VERSCHLÜSSELT — FINALE SYNCHRONISATION AUSSTEHEND`
  },

  {
    id: "010",
    type: "cipher",
    header: "SYSTEM LOG // 010",
    body:
`FINALE SYNCHRONISATION

FRAGMENT A: FRAG17
FRAGMENT B: FRAGB29
VERIFIKATION: 34 — PASSED

>> REKONSTRUIERE KOORDINATEN AUS FRAGMENTEN...
>> LAT 46°24'N   LON 7°32'E
>> ABGLEICH MIT ALPIN-DATENBANK...

ZIEL IDENTIFIZIERT: WILDSTRUBEL (3243M)
SECONDARY OBJECTIVE: WILDSTRUBELHÜTTE (ÜBERNACHTUNG)

>> ROUTE RECONSTRUCTION COMPLETE

  LENK
  -> AUFSTIEG ZUR WILDSTRUBELHÜTTE (ÜBERNACHTUNG)
  -> GIPFELAUFSTIEG WILDSTRUBEL (3243M)
  -> ABSTIEG -> LENK

>> MISSION SCHEDULED FOR: 2027
>> EXAKTES DATUM: NOCH OFFEN

DIES IST EIN GESCHENK — KEINE SOFORTIGE AKTION ERFORDERLICH.

TIPPE "ACCEPTED" UM DIE ÜBERTRAGUNG ABZUSCHLIESSEN.`,
    solutionHash: "25ab960d578e9fb9c7cb17ddbf211f8188564f13e24e64ad515b1a22cbf51f1c",
    onSuccessAppend:
`
>> TRANSMISSION COMPLETE.

Diese ganze Kette war der Weg zu einem Ziel: dem Wildstrubel.

Wanderung ab Lenk, Aufstieg zur Wildstrubelhütte, Übernachtung dort,
am nächsten Tag der Gipfelaufstieg auf den Wildstrubel (3243m),
und zurück nach Lenk.

Es steht noch kein genaues Datum fest — die Tour selbst findet
2027 statt. Dieses System hatte nur eine Aufgabe: euch das Ziel
rechtzeitig zur Hochzeit zu übergeben.

MISSION SCHEDULED FOR: 2027
END OF LOG.`
  },

];
