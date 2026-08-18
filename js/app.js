// ============================================================
// APP ENGINE
// ============================================================

const STORAGE_KEY = "wildstrubel_arg_progress";

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
  if (!raw) return { levelIndex: 0 };
  try {
    return JSON.parse(raw);
  } catch {
    return { levelIndex: 0 };
  }
}

function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
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

function renderCurrentLevel() {
  const progress = getProgress();
  const level = LEVELS[progress.levelIndex];

  const headerLog = document.getElementById("header-log");
  const logBody = document.getElementById("log-body");
  const inputRow = document.getElementById("input-row");
  const reallifeBlock = document.getElementById("reallife-block");
  const feedback = document.getElementById("feedback");
  const input = document.getElementById("solution-input");

  feedback.textContent = "";
  feedback.className = "feedback";
  input.value = "";

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
    } else {
      setTimeout(() => {
        progress.levelIndex += 1;
        saveProgress(progress);
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
});
