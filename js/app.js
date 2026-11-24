// ==== КОНСТАНТЫ И ПЕРЕМЕННЫЕ ====
const BG_PRESETS = {
  default: { name: "Стандарт", light: "#f1f5f9", dark: "#0b1120" },
  aurora: { name: "Аврора", light: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)", dark: "linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)" },
  ocean: { name: "Океан", light: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)", dark: "linear-gradient(135deg, #0f2027 0%, #2c5364 100%)" },
  sunset: { name: "Закат", light: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)", dark: "linear-gradient(135deg, #3a1c71 0%, #d76d77 100%)" },
  forest: { name: "Лес", light: "linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)", dark: "linear-gradient(135deg, #134e5e 0%, #71b280 100%)" },
  midnight: { name: "Ночь", light: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", dark: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)" }
};
const DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
const PAIR_NAMES = { 0: "Кл. час", 1: "1 пара", 2: "2 пара", 3: "3 пара", 4: "4 пара", 5: "5 пара" };

// ==== ХРАНИЛИЩЕ ====
const LS = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : v; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} },
  del(k) { try { localStorage.removeItem(k); } catch {} },
  json(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  setJson(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};

let customGroups = LS.json("kgst_custom_groups", []);
let hiddenGroups = LS.json("kgst_hidden_groups", []);
let userSchedule = LS.json("kgst_schedule_custom", {});
let gradesData = LS.json("kgst_grades", []);

// ==== СОСТОЯНИЕ ====
let selectedGroup = LS.get("kgst_group", "СЭЗ-25");
let selectedDay = Math.min(Math.max(new Date().getDay(), 1), 6);
let weekMode = LS.get("kgst_week_mode", "auto");
let fontScale = LS.get("kgst_font_scale", "1");
let cardOpacity = LS.get("kgst_card_opacity", "1");
let bgPreset = LS.get("kgst_bg_preset", "default");
let bgCustom = LS.get("kgst_bg_custom", "");
let currentNoteKey = "";

// ==== DOM ЭЛЕМЕНТЫ ====
const dom = {
  weekBanner: document.getElementById("weekBanner"),
  weekIcon: document.getElementById("weekIcon"),
  weekLabel: document.getElementById("weekLabel"),
  weekModePill: document.getElementById("weekModePill"),
  liveStatus: document.getElementById("liveStatus"),
  headerTime: document.getElementById("headerTime"),
  daysBar: document.getElementById("daysBar"),
  scheduleList: document.getElementById("scheduleList"),
  noteModal: document.getElementById("noteModal"),
  settingsModal: document.getElementById("settingsModal"),
  dashboardModal: document.getElementById("dashboardModal"),
  groupSelect: document.getElementById("groupSelect")
};

// ==== УТИЛИТЫ ====
function getAllGroupNames() { return [...Object.keys(DEFAULT_SCHEDULE), ...customGroups]; }
function getVisibleGroupNames() {
  const all = getAllGroupNames();
  const visible = all.filter(g => !hiddenGroups.includes(g));
  return visible.length > 0 ? visible : [all[0]];
}
function getSchedule(group) {
  if (userSchedule[group]) return { ...(DEFAULT_SCHEDULE[group] || {}), ...userSchedule[group] };
  return DEFAULT_SCHEDULE[group] || {};
}
function toSec(t) { const [h, m] = t.split(":").map(Number); return h * 3600 + m * 60; }
function getISOWeekNumber(d) {
  const date = new Date(d); date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  const week1 = new Date(date.getFullYear(), 0, 4);
  return 1 + Math.round(((date - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}
function isTopWeek() {
  if (weekMode === "top") return true;
  if (weekMode === "bot") return false;
  return getISOWeekNumber(new Date()) % 2 === 0;
}
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c])); }
function isDarkNow() {
  const t = document.documentElement.getAttribute("data-theme");
  if (t === "dark") return true;
  if (t === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

// ==== ФОН И ТЕМА ====
function applyTheme() { applyBackground(); }
function applyBackground() {
  const dark = isDarkNow();
  const baseColor = dark ? "#0b1120" : "#f1f5f9";
  let bgImage = "none"; let overlay = "transparent";
  if (bgPreset === "custom" && bgCustom) {
    bgImage = `url("${bgCustom.replace(/"/g, '\\"')}")`;
    overlay = dark ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.25)";
  } else {
    const p = BG_PRESETS[bgPreset] || BG_PRESETS.default;
    const val = dark ? p.dark : p.light;
    if (val && val.indexOf("gradient") !== -1) bgImage = val;
  }
  const root = document.documentElement.style;
  root.setProperty("--bg-layer-bg", baseColor);
  root.setProperty("--bg-layer-image", bgImage);
  root.setProperty("--bg-overlay", overlay);
  root.setProperty("--bg", baseColor);
}
function applyFontScale(scale) {
  fontScale = String(scale);
  document.documentElement.style.setProperty("--scale", fontScale);
  LS.set("kgst_font_scale", fontScale);
  document.querySelectorAll("#fontSizeControl .seg-btn").forEach(b => b.classList.toggle("active", b.dataset.scale === fontScale));
}
function applyCardOpacity(op) {
  cardOpacity = String(op);
  document.documentElement.style.setProperty("--card-opacity", cardOpacity);
  LS.set("kgst_card_opacity", cardOpacity);
  document.querySelectorAll("#opacityControl .seg-btn").forEach(b => b.classList.toggle("active", b.dataset.opacity === cardOpacity));
}

// ==== РЕНДЕР ====
function refreshGroupSelect() {
  const visible = getVisibleGroupNames();
  if (!visible.includes(selectedGroup)) { selectedGroup = visible[0]; LS.set("kgst_group", selectedGroup); }
  dom.groupSelect.innerHTML = visible.map(g => `<option value="${escapeHtml(g)}" ${g === selectedGroup ? "selected" : ""}>${escapeHtml(g)}</option>`).join("");
}

function renderDays() {
  dom.daysBar.innerHTML = "";
  DAYS.forEach((d, idx) => {
    const btn = document.createElement("button");
    btn.className = "day-btn" + ((idx + 1) === selectedDay ? " active" : "");
    btn.textContent = d;
    btn.onclick = () => { selectedDay = idx + 1; renderDays(); renderSchedule(); };
    dom.daysBar.appendChild(btn);
  });
}

let cachedCards = [];
function renderSchedule() {
  const top = isTopWeek();
  dom.weekBanner.classList.toggle("bottom-week", !top);
  dom.weekIcon.textContent = top ? "🔼" : "🔽";
  dom.weekLabel.textContent = top ? "Верхняя неделя" : "Нижняя неделя";
  dom.weekModePill.textContent = weekMode === "auto" ? "Авто" : "Вручную";

  dom.scheduleList.innerHTML = "";
  cachedCards = [];
  const groupSchedule = getSchedule(selectedGroup);
  const dayData = (groupSchedule && groupSchedule[selectedDay]) || [];
  const bells = selectedDay === 1 ? BELLS.monday : BELLS.regular;

  if (dayData.length === 0) {
    dom.scheduleList.innerHTML = `<div class="card" style="text-align:center; cursor:default;"><div class="subject" style="margin:0;">В этот день пар нет</div></div>`;
    return;
  }

  dayData.forEach((item, index) => {
    const [pairNum, subjRaw, teacher, room] = item;
    const bell = bells.find(b => b.num === pairNum);
    const timeText = bell ? `${bell.start} – ${bell.end}` : "—";
    const subjectName = typeof subjRaw === "object" ? (top ? subjRaw.top : subjRaw.bot) : subjRaw;
    const noteKey = `note_${selectedGroup}_${selectedDay}_${pairNum}`;
    const savedNote = LS.get(noteKey, "");

    const card = document.createElement("div");
    card.className = "card";
    card.style.setProperty('--delay', (index * 0.05) + 's'); 
    card.innerHTML = `
      <div class="card-top">
        <span>${pairNum === 0 ? "Классный час" : pairNum + " пара"} • ${timeText}<span class="live-pill" style="display:none;"><span class="live-dot"></span>Сейчас</span></span>
        ${room ? `<span class="room-badge">Каб. ${escapeHtml(room)}</span>` : ""}
      </div>
      <div class="subject"></div>
      <div class="teacher" style="${teacher ? "" : "height:6px; margin:0;"}"></div>
      <div class="note-box ${savedNote ? "has-note" : ""}">
        <span>${savedNote ? "📝" : "✏️"}</span><span class="note-text"></span>
      </div>`;

    card.querySelector(".subject").textContent = subjectName || "(без названия)";
    if (teacher) card.querySelector(".teacher").textContent = teacher;
    card.querySelector(".note-text").textContent = savedNote || "Сделать заметку";

    card.onclick = () => openNoteModal(noteKey, subjectName, pairNum === 0 ? "Классный час" : `${pairNum} пара`, savedNote);
    dom.scheduleList.appendChild(card);
    cachedCards.push({ el: card, pill: card.querySelector(".live-pill"), pair: pairNum, isCurrent: false });

    if (index < dayData.length - 1) {
      const nextPairNum = dayData[index + 1][0];
      const nextBell = bells.find(b => b.num === nextPairNum);
      if (bell && nextBell) {
        const mins = Math.round((toSec(nextBell.start) - toSec(bell.end)) / 60);
        if (mins > 0) {
          const brk = document.createElement("div");
          brk.className = "break-card";
          brk.style.setProperty('--delay', (index * 0.05 + 0.05) + 's');
          brk.innerHTML = `<span>☕ Перемена (${mins} мин)</span><span>${bell.end} – ${nextBell.start}</span>`;
          dom.scheduleList.appendChild(brk);
        }
      }
    }
  });
}

// ==== ТАЙМЕР ====
function getActiveBells(group, day) {
  const schedule = getSchedule(group);
  const dayData = (schedule && schedule[day]) || [];
  if (dayData.length === 0) return [];
  const pairNums = new Set(dayData.map(x => x[0]));
  const all = day === 1 ? BELLS.monday : BELLS.regular;
  return all.filter(b => pairNums.has(b.num));
}

let lastState = "";
function updateLive() {
  if (document.hidden) return;
  const now = new Date();
  const today = now.getDay();
  const secNow = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

  if (today === 0) { updateUI("Воскресенье", now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }), false); return; }

  const bells = getActiveBells(selectedGroup, today);
  if (bells.length === 0) { updateUI("Пар нет", now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }), false); return; }

  let activePairNum = null;
  let stateText = "Занятия окончены";
  let isBreak = false;
  let diffSec = 0;

  for (let i = 0; i < bells.length; i++) {
    const start = toSec(bells[i].start);
    const end = toSec(bells[i].end);
    if (secNow < start) {
      if (i === 0) { stateText = `Ожидание (${bells[i].name})`; diffSec = start - secNow; }
      else { isBreak = true; stateText = `Перемена (до ${bells[i].name})`; diffSec = start - secNow; }
      break;
    } else if (secNow >= start && secNow <= end) {
      activePairNum = bells[i].num;
      stateText = `Идёт ${bells[i].name}`;
      diffSec = end - secNow;
      break;
    }
  }

  let timerStr = "Отдых";
  if (diffSec > 0) {
    const h = Math.floor(diffSec / 3600);
    const m = Math.floor((diffSec % 3600) / 60);
    const s = diffSec % 60;
    timerStr = (h > 0 ? `${h}ч ` : "") + `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  updateUI(stateText, timerStr, isBreak);

  const isToday = selectedDay === today;
  for (const c of cachedCards) {
    const shouldBeCurrent = isToday && c.pair === activePairNum;
    if (c.isCurrent !== shouldBeCurrent) {
      c.isCurrent = shouldBeCurrent;
      c.el.classList.toggle("current", shouldBeCurrent);
      c.pill.style.display = shouldBeCurrent ? "inline-flex" : "none";
    }
  }
}

function updateUI(stateText, timerStr, isBreak) {
  const newStateKey = stateText + timerStr;
  if (lastState === newStateKey) return;
  lastState = newStateKey;
  if (dom.liveStatus) { dom.liveStatus.textContent = stateText; dom.liveStatus.style.color = isBreak ? "var(--green)" : "var(--accent)"; }
  if (dom.headerTime) { dom.headerTime.textContent = timerStr; }
}

// ==== МОДАЛКИ ====
function openAnimatedDialog(dlg) { if (dlg.open) return; dlg.showModal(); requestAnimationFrame(() => dlg.classList.add("is-open")); }
function closeAnimatedDialog(dlg) { if (!dlg.open) return; dlg.classList.remove("is-open"); setTimeout(() => dlg.close(), 210); }

document.getElementById("openDashboardBtn").onclick = () => { renderHomework(); renderGrades(); openAnimatedDialog(dom.dashboardModal); };
document.getElementById("openDashboardBtn2").onclick = () => { renderHomework(); renderGrades(); openAnimatedDialog(dom.dashboardModal); };
document.getElementById("closeDashboardBtn").onclick = () => closeAnimatedDialog(dom.dashboardModal);
dom.dashboardModal.onclick = (e) => { if (e.target === dom.dashboardModal) closeAnimatedDialog(dom.dashboardModal); };

document.querySelectorAll(".dash-tab").forEach(tab => {
  tab.onclick = () => {
    document.querySelectorAll(".dash-tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".dash-content").forEach(c => c.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
  };
});

function renderHomework() {
  const container = document.getElementById("hwList");
  container.innerHTML = "";
  let hasNotes = false;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith("note_")) {
      hasNotes = true;
      const parts = key.split("_");
      const group = parts[1]; const dayNum = parseInt(parts[2]); const pairNum = parseInt(parts[3]);
      const text = localStorage.getItem(key);
      const el = document.createElement("div");
      el.className = "hw-item";
      el.innerHTML = `<div class="hw-item-title">${group} • ${DAYS[dayNum-1]} • ${PAIR_NAMES[pairNum]}</div><div>${escapeHtml(text)}</div>`;
      container.appendChild(el);
    }
  }
  if (!hasNotes) container.innerHTML = `<div style="text-align:center; color:var(--muted); font-size:13px; padding:20px;">Нет заметок. Нажмите на пару, чтобы добавить ДЗ.</div>`;
}

document.getElementById("addGradeBtn").onclick = () => {
  const subj = document.getElementById("gradeSubject").value.trim();
  const val = parseInt(document.getElementById("gradeValue").value);
  const note = document.getElementById("gradeNote").value.trim();
  if (!subj || isNaN(val) || val < 2 || val > 5) return alert("Введите предмет и оценку (2-5).");
  gradesData.push({ id: Date.now(), subject: subj, value: val, note: note });
  LS.setJson("kgst_grades", gradesData);
  document.getElementById("gradeSubject").value = ""; document.getElementById("gradeValue").value = ""; document.getElementById("gradeNote").value = "";
  renderGrades();
};

function renderGrades() {
  const list = document.getElementById("gradesList");
  list.innerHTML = "";
  if (gradesData.length === 0) {
    list.innerHTML = `<div style="text-align:center; color:var(--muted); font-size:13px;">Оценок пока нет.</div>`;
    document.getElementById("gpaValue").textContent = "0.00";
    return;
  }
  let sum = 0;
  gradesData.sort((a, b) => b.id - a.id);
  gradesData.forEach(g => {
    sum += g.value;
    const el = document.createElement("div");
    el.className = "grade-item";
    el.innerHTML = `
      <div class="grade-val g${g.value}">${g.value}</div>
      <div class="grade-info"><div class="grade-subj">${escapeHtml(g.subject)}</div>${g.note ? `<div class="grade-note">${escapeHtml(g.note)}</div>` : ""}</div>
      <button class="btn btn-danger" style="padding:4px 8px; font-size:12px;" onclick="deleteGrade(${g.id})">✕</button>
    `;
    list.appendChild(el);
  });
  document.getElementById("gpaValue").textContent = (sum / gradesData.length).toFixed(2);
}
window.deleteGrade = function(id) { gradesData = gradesData.filter(g => g.id !== id); LS.setJson("kgst_grades", gradesData); renderGrades(); };

function openNoteModal(key, title, subtitle, text) {
  currentNoteKey = key;
  document.getElementById("modalTitle").textContent = title || "Заметка";
  document.getElementById("modalSub").textContent = `${selectedGroup} • ${subtitle}`;
  document.getElementById("noteInput").value = text || "";
  document.getElementById("deleteNote").style.display = text ? "block" : "none";
  openAnimatedDialog(dom.noteModal);
}
document.getElementById("closeModal").onclick = () => closeAnimatedDialog(dom.noteModal);
dom.noteModal.onclick = (e) => { if (e.target === dom.noteModal) closeAnimatedDialog(dom.noteModal); };
document.getElementById("saveNote").onclick = () => {
  const val = document.getElementById("noteInput").value.trim();
  if (val) LS.set(currentNoteKey, val); else LS.del(currentNoteKey);
  closeAnimatedDialog(dom.noteModal); renderSchedule();
};
document.getElementById("deleteNote").onclick = () => { LS.del(currentNoteKey); closeAnimatedDialog(dom.noteModal); renderSchedule(); };

// ==== НАСТРОЙКИ ====
document.getElementById("openSettingsBtn").onclick = () => {
  renderBackgroundGrid(); applyFontScale(fontScale); applyCardOpacity(cardOpacity);
  openAnimatedDialog(dom.settingsModal);
};
document.getElementById("closeSettingsBtn").onclick = () => closeAnimatedDialog(dom.settingsModal);
dom.settingsModal.onclick = (e) => { if (e.target === dom.settingsModal) closeAnimatedDialog(dom.settingsModal); };
document.querySelectorAll("#fontSizeControl .seg-btn").forEach(btn => btn.onclick = () => applyFontScale(btn.dataset.scale));
document.querySelectorAll("#opacityControl .seg-btn").forEach(btn => btn.onclick = () => applyCardOpacity(btn.dataset.opacity));

function renderBackgroundGrid() {
  const grid = document.getElementById("bgGrid"); grid.innerHTML = ""; const dark = isDarkNow();
  Object.entries(BG_PRESETS).forEach(([key, p]) => {
    const el = document.createElement("div"); el.className = "bg-option" + (bgPreset === key ? " active" : "");
    const val = dark ? p.dark : p.light;
    if (val.indexOf("gradient") !== -1) el.style.backgroundImage = val; else el.style.backgroundColor = val;
    el.textContent = p.name;
    el.onclick = () => { bgPreset = key; LS.set("kgst_bg_preset", bgPreset); applyBackground(); renderBackgroundGrid(); };
    grid.appendChild(el);
  });
}

// ==== ЗАПУСК ====
try {
  applyTheme(); applyFontScale(fontScale); applyCardOpacity(cardOpacity); applyBackground();
  refreshGroupSelect(); renderDays(); renderSchedule();
  setInterval(updateLive, 1000);
} catch (err) {
  console.error(err);
  document.getElementById("scheduleList").innerHTML = `<div class="card" style="border-color:red"><div class="subject" style="color:red">Ошибка кода</div><div class="teacher">${err.message}</div></div>`;
}
dom.groupSelect.onchange = () => { selectedGroup = dom.groupSelect.value; LS.set("kgst_group", selectedGroup); renderSchedule(); };
document.addEventListener("visibilitychange", () => { if (!document.hidden) updateLive();
// Скрываем заставку при успешном запуске
const splashEl = document.getElementById('splash');
const appEl = document.getElementById('app');
if (splashEl) {
  splashEl.classList.add('hidden');
  setTimeout(() => { if(splashEl.parentNode) splashEl.parentNode.removeChild(splashEl); }, 600);
}
if (appEl) appEl.classList.add('loaded'); });
