// ============================================================
// APP ENGINE
// ============================================================

const STORAGE_KEY = "wildstrubel_arg_progress";

// Pacing: after solving a log, the next one stays locked behind a countdown
// instead of appearing immediately (so the whole chain can't be solved in
// one sitting). Roughly 4 days between logs. The finale (LOG 010) ignores
// that relative pacing entirely and is pinned to a fixed calendar date so
// the big reveal always lands on the wedding day, no matter how fast or
// slow the rest of the chain went.
const COUNTDOWN_MS = 4 * 24 * 60 * 60 * 1000;
const FINALE_UNLOCK_AT = new Date("2026-10-03T00:00:00").getTime();

// Manual kill switch: everything AFTER this log ID is taken fully offline
// (no countdown, no content, no recovery bar) until this is set back to
// `enabled: false`. Progress already made keeps advancing normally in the
// background (real-life codes still work, countdowns still tick) — this
// only overrides what gets *displayed*, so re-enabling later resumes
// exactly where things actually stood.
const LOCKDOWN = {
  enabled: true,
  afterLevelId: "003",
  header: "SYSTEM LOG // ERROR",
  message:
`DACHTEST DU WIRKLICH, 3 KM WÜRDEN REICHEN?!

DIESES SYSTEM WURDE FÜR GEWINNER PROGRAMMIERT. WENN DU EINE LÜCKE FINDEST, SOLLTEST DU SIE NICHT NUTZEN — NUR ECHTE ARBEIT ZÄHLT.

>> NÄCHSTES LEVEL ERFORDERT: 100 KM AKTIVITÄTS-NACHWEIS
>> PARAMETER AUSSERHALB DES ZULÄSSIGEN BEREICHS

STATUS: SYSTEM OFFLINE
KEINE WEITERE INTERAKTION MÖGLICH.`,
};

async function sha256(text) {
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function normalize(text) {
  return text.trim().toUpperCase();
}

function getProgress() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { levelIndex: 0, unlockAt: 0 };
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed.unlockAt !== "number") parsed.unlockAt = 0;
    return parsed;
  } catch {
    return { levelIndex: 0, unlockAt: 0 };
  }
}

function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

// Deterministic, device-independent recovery codes. Each log (plus the
// finished state) always maps to the same short code, so it can be written
// down once and used to restore progress on any device/browser.
const RECOVERY_SALT = "WILDSTRUBEL-RECOVERY";

async function recoveryCode(key) {
  const hash = await sha256(`${RECOVERY_SALT}:${key}`);
  return hash.slice(0, 6).toUpperCase();
}

function currentLevelKey(progress) {
  const level = LEVELS[progress.levelIndex];
  return level ? level.id : "COMPLETE";
}

async function updateRecoveryDisplay() {
  const progress = getProgress();
  const code = await recoveryCode(currentLevelKey(progress));
  document.getElementById("recovery-code").textContent = code;
}

async function restoreFromCode(rawInput) {
  const code = normalize(rawInput);
  if (!code) return false;

  const keys = [...LEVELS.map((l) => l.id), "COMPLETE"];
  for (let i = 0; i < keys.length; i++) {
    if ((await recoveryCode(keys[i])) === code) {
      const levelIndex = keys[i] === "COMPLETE" ? LEVELS.length : i;
      // A restored log was already unlocked before (that's how she got the
      // code for it), so it should never come back with a fresh countdown.
      saveProgress({ levelIndex, unlockAt: 0 });
      return true;
    }
  }
  return false;
}

function typewriter(el, text, speed = 12) {
  el.textContent = "";
  let i = 0;
  return new Promise((resolve) => {
    function step() {
      if (i < text.length) {
        el.textContent += text[i];
        i++;
        setTimeout(step, speed);
      } else {
        resolve();
      }
    }
    step();
  });
}

const BOOT_TEXT = `SYSTEM LOG // ACCESS TERMINAL
INITIALIZATION PROTOCOL...

CORE ......... ONLINE
MEMORY ....... READY
USER ......... DETECTED
COGNITION .... REQUIRED
SECURITY ..... ACTIVE

RESUMING SESSION...
`;

async function boot() {
  const bootScreen = document.getElementById("boot-screen");
  const terminal = document.getElementById("terminal");
  const bootLog = document.getElementById("boot-log");

  await typewriter(bootLog, BOOT_TEXT, 10);
  await new Promise((r) => setTimeout(r, 600));

  bootScreen.classList.add("hidden");
  terminal.classList.remove("hidden");
  renderCurrentLevel();
}

let countdownTimer = null;

function clearCountdownTimer() {
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
}

function formatCountdown(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n) => String(n).padStart(2, "0");
  const dayPart = days > 0 ? `${days}T ` : "";
  return `${dayPart}${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function renderCurrentLevel() {
  clearCountdownTimer();

  const progress = getProgress();
  const level = LEVELS[progress.levelIndex];

  const headerLog = document.getElementById("header-log");
  const logBody = document.getElementById("log-body");
  const inputRow = document.getElementById("input-row");
  const reallifeBlock = document.getElementById("reallife-block");
  const feedback = document.getElementById("feedback");
  const input = document.getElementById("solution-input");
  const recoveryBar = document.getElementById("recovery-bar");
  const lockdownMedia = document.getElementById("lockdown-media");

  feedback.textContent = "";
  feedback.className = "feedback";
  input.value = "";

  const lockIndex = LEVELS.findIndex((l) => l.id === LOCKDOWN.afterLevelId);
  if (LOCKDOWN.enabled && progress.levelIndex > lockIndex) {
    headerLog.textContent = LOCKDOWN.header;
    logBody.textContent = LOCKDOWN.message;
    inputRow.classList.add("hidden");
    reallifeBlock.classList.add("hidden");
    recoveryBar.classList.add("hidden");
    lockdownMedia.classList.remove("hidden");
    return;
  }
  recoveryBar.classList.remove("hidden");
  lockdownMedia.classList.add("hidden");

  if (!level) {
    const finalLevel = LEVELS[LEVELS.length - 1];
    headerLog.textContent = "SYSTEM LOG // COMPLETE";
    logBody.textContent =
      finalLevel.body +
      "\n" +
      finalLevel.onSuccessAppend +
      "\n\n>> NO FURTHER TRANSMISSIONS QUEUED.";
    inputRow.classList.add("hidden");
    reallifeBlock.classList.add("hidden");
    updateRecoveryDisplay();
    return;
  }

  if (Date.now() < progress.unlockAt) {
    const nextLabel = level.header.replace("SYSTEM LOG // ", "LOG ");
    headerLog.textContent = "SYSTEM LOG // STANDBY";
    inputRow.classList.add("hidden");
    reallifeBlock.classList.add("hidden");

    const tick = () => {
      const remaining = progress.unlockAt - Date.now();
      if (remaining <= 0) {
        renderCurrentLevel();
        return;
      }
      logBody.textContent =
        `TRANSMISSION RECEIVED. SYSTEM KÜHLT AB.\n\n` +
        `>> NÄCHSTE ÜBERTRAGUNG (${nextLabel}) IN:\n\n` +
        `   ${formatCountdown(remaining)}\n\n` +
        `>> BITTE WARTEN.`;
    };
    tick();
    countdownTimer = setInterval(tick, 1000);
    updateRecoveryDisplay();
    return;
  }

  headerLog.textContent = level.header;
  logBody.textContent = level.body;
  inputRow.classList.remove("hidden");

  if (level.type === "reallife") {
    reallifeBlock.classList.remove("hidden");
    document.getElementById("reallife-text").textContent = level.reallifeText;
    document.getElementById("reallife-link").href = level.reallifeLink;
  } else {
    reallifeBlock.classList.add("hidden");
  }

  updateRecoveryDisplay();
}

async function handleSubmit() {
  const progress = getProgress();
  const level = LEVELS[progress.levelIndex];
  if (!level) return;

  const input = document.getElementById("solution-input");
  const feedback = document.getElementById("feedback");
  const answer = normalize(input.value);

  if (!answer) return;

  const hash = await sha256(answer);

  if (hash === level.solutionHash) {
    feedback.textContent = "ACCESS GRANTED.";
    feedback.className = "feedback success";

    if (level.onSuccessAppend) {
      const logBody = document.getElementById("log-body");
      logBody.textContent += "\n" + level.onSuccessAppend;
    }

    const isLastLevel = progress.levelIndex === LEVELS.length - 1;
    if (isLastLevel) {
      // Keep the finale reveal on screen instead of auto-advancing it away.
      saveProgress({ levelIndex: LEVELS.length });
      document.getElementById("input-row").classList.add("hidden");
      updateRecoveryDisplay();
    } else {
      setTimeout(() => {
        const nextIndex = progress.levelIndex + 1;
        const nextLevel = LEVELS[nextIndex];
        const unlockAt =
          nextLevel && nextLevel.id === "010"
            ? FINALE_UNLOCK_AT
            : Date.now() + COUNTDOWN_MS;
        saveProgress({ levelIndex: nextIndex, unlockAt });
        renderCurrentLevel();
      }, 1400);
    }
  } else {
    feedback.textContent = "ACCESS DENIED — SOLUTION INCORRECT.";
    feedback.className = "feedback error";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  boot();
  document.getElementById("submit-btn").addEventListener("click", handleSubmit);
  document.getElementById("solution-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSubmit();
  });

  document.getElementById("restore-link").addEventListener("click", async (e) => {
    e.preventDefault();
    const input = window.prompt("Wiederherstellungscode eingeben:");
    if (input === null) return;

    const ok = await restoreFromCode(input);
    if (ok) {
      renderCurrentLevel();
    } else {
      window.alert("Code ungültig.");
    }
  });
});
