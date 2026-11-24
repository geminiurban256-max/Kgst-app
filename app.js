/* ============================================================
   1. ДАННЫЕ
   ============================================================ */
const BELLS = {
  monday: [
    { num: 0, name: "Классный час", start: "08:30", end: "09:15" },
    { num: 1, name: "1 пара", start: "09:30", end: "10:40" },
    { num: 2, name: "2 пара", start: "10:55", end: "12:05" },
    { num: 3, name: "3 пара", start: "12:45", end: "13:55" },
    { num: 4, name: "4 пара", start: "14:10", end: "15:20" },
    { num: 5, name: "5 пара", start: "15:30", end: "16:20" }
  ],
  regular: [
    { num: 1, name: "1 пара", start: "08:30", end: "10:05" },
    { num: 2, name: "2 пара", start: "10:20", end: "11:55" },
    { num: 3, name: "3 пара", start: "12:35", end: "14:10" },
    { num: 4, name: "4 пара", start: "14:20", end: "15:55" },
    { num: 5, name: "5 пара", start: "16:05", end: "17:15" }
  ]
};

// Полное расписание с добавлением 1 курса (26-е группы) из вашего PDF
const DEFAULT_SCHEDULE = {
  "ЭРО-25": {
    1: [[0,"Классный час","",""],[1,"Англ. язык","Соколова Е.Ю.","61"],[2,"Прикл. математ.","Потапова А.А.","67"],[3,"Инж. графика","Блохина / Журавлева","53/59"]],
    2: [[1,"Мед.группа (спортзал)","Корольченко П.В.","с/з"],[2,"Материаловед.","Киви Т.И.","32"],[3,"Техн. механика","Суюшкина Е.В.","56"],[4,"МДК 03.01.","Саитгалеев А.Р.","30"]],
    3: [[1,"Физ. культ.","Сидоров Г.Н.","с/з 6к"],[2,"История России","Пятанина Л.А.","63"],[3,"Электротехника","Чумаченко С.И.","36"],[4,"Инфор. технологии","Доланчи / Донская","21/22"]],
    4: [[1,"Делопроизвод.","Айкашева Н.С.","14"],[2,"Электротехника","Чумаченко С.И.","36"],[3,"КСПД «Компас»","Блохина / Журавлева","23/25"],[4,"Электробезоп.","Саитгалеев А.Р.","30"]],
    5: [[1,"МДК 01.01","вакансия","18"],[2,"Инж. графика","Блохина / Журавлева","53,59"],[3,"Эколог.осн.прир.","Киви Т.И.","32"],[4,"МДК 03.01.","Саитгалеев А.Р.","30"]],
    6: [[1,{top:"История Р. (Пятанина)",bot:"Эколог.осн.прир. (Киви)"},"Пятанина / Киви","дист."],[2,"Материаловед.","Киви Т.И.","дист."]]
  },
  "СЭЗ-25": {
    1: [[0,"Классный час","",""],[1,"Осн. геодезии","Суюшкина Е.В.","56"],[2,"Инж. графика","Блохина / Журавлева","53/59"],[3,"Осн. электротех.","Чумаченко С.И.","36"],[4,"Инфор. технологии","Доланчи / Донская","21/22"]],
    2: [[1,"История России","Пятанина Л.А.","63"],[2,"Матем. метод.","Милькевич Н.Ю.","55"],[3,"КСПД «Компас»","Блохина / Журавлева","23/25"],[4,"МДК 01.01.геол","Киви","32"]],
    3: [[1,"Инфор. технологии","Доланчи / Донская","21/22"],[2,"Англ. язык","Соколова Е.Ю.","61"],[3,"Физ. культ.","Сидоров Г.Н.","с/з 6к"]],
    4: [[1,"Техн. механика","Суюшкина Е.В.","56"],[2,"Матем. метод.","Милькевич Н.Ю.","55"],[3,"Делопроизвод.","Айкашева Н.С.","14"],[4,"Осн. геодезии","Суюшкина Е.В.","56"]],
    5: [[1,"МДК 01.01.грматер.","Милькевич Н.Ю.","55"],[2,"Осн. электротех.","Чумаченко","36"],[3,"МДК 01.01.грматер.","Милькевич Н.Ю.","55"]],
    6: [[1,"Тех. механика","Суюшкина Е.В.","дист."],[2,"Инфор. технологии","Доланчи / Донская","дист."],[3,"МДК 01.01.грматер.","Милькевич Н.Ю.","дист."]]
  },
  "КСК-25": {
    1: [[0,"Классный час","",""],[1,"Инф. технологии","Донская / Потапова","22/23"],[2,"Англ. язык","Соколова Е.Ю.","61"],[3,"МДК 01.02.","Степанова Ю.В.","26"],[4,"Эл.высш.матем.","Потапова А.А.","67"]],
    2: [[1,"Инж. графика","Рогальская Т.И.","25"],[2,"Операц. сист. и ср.","Степанова Ю.В.","26"],[3,"Осн. электротех.","Чумаченко","36"],[4,"Физ. культ.","Корольченко П.В.","с/з гл"]],
    3: [[1,"Web-дизайн 2взр.","Петраш Е.В.","24"],[2,"Осн. электротех.","Чумаченко","36"],[3,"Операц. сист. и ср.","Степанова Ю.В.","26"],[4,"Web-дизайн 2взр.","Петраш Е.В.","24"]],
    4: [[1,"Инж. графика","Рогальская Т.И.","25"],[2,"Делопроизвод.","Айкашева Н.С.","14"],[3,"История России","Пятанина Л.А.","63"],[4,"МДК 01.01.","Степанова Ю.В.","26"]],
    5: [[1,"МДК 04.01.","Доланчи / Петраш","21/24"],[2,"МДК 04.01.","Доланчи / Петраш","21/24"],[3,"МДК 01.01.","Степанова Ю.В.","26"],[4,"Эл.высш.мат.","Потапова","67"]],
    6: [[1,{top:"МДК 01.02 (Степанова)",bot:"История Р. (Пятанина)"},"Степанова / Пятанина","дист."],[2,{top:"МДК 01.02 (Степанова)",bot:"История Р. (Пятанина)"},"Степанова / Пятанина","дист."],[3,"Операц. сист. и ср.","Степанова Ю.В.","дист."],[4,"МДК 04.01","Доланчи / Петраш","дист."]]
  },
  "ТОА-25": {
    1: [[0,"Классный час","",""],[1,"Инж. графика","Блохина / Журавлева","53/59"],[2,"Техн. механика","Суюшкина Е.В.","56"],[3,"МДК 01.01.","Камкова Н.И.","13"],[4,"Электротехника","Чумаченко С.И.","36"]],
    2: [[1,"Мед.группа (спортзал)","Корольченко П.В.","с/з"],[2,"Делопроизвод.","Айкашева Н.С.","14"],[3,"Материаловед.","Красиков А.Н.","13"],[4,"КСПД «Компас»","Блохина / Журавлева","23/25"]],
    3: [[1,"История России","Пятанина Л.А.","63"],[2,"Техн. механика","Суюшкина Е.В.","56"],[3,"Материаловед.","Красиков А.Н.","рес.ц"]],
    4: [[1,"Англ. язык","Соколова Е.Ю.","61"],[2,"История России","Пятанина Л.А.","63"],[3,"МДК 01.01.","Камкова Н.И.","13"]],
    5: [[1,"Инж. графика","Блохина / Журавлева","53/59"],[2,"Техн. механика","Суюшкина Е.В.","56"],[3,"Электротехника","Чумаченко С.И.","36"],[4,"Физ. культ.","Корольченко П.В.","с/з гл"]],
    6: [[1,"Материаловед.","Красиков А.Н.","дист."],[2,"Техн. механика","Суюшкина Е.В.","дист."],[3,"МДК 01.01.","Камкова Н.И.","дист."]]
  },
  "ОДЛ-25": {
    1: [[0,"Классный час","",""],[1,"МДК 05.01.","Фомичева Н.С.","57"],[2,"МДК 05.01.","Фомичева Н.С.","57"],[3,"МДК 01.01.","Гневашева Т.В.","50"]],
    2: [[1,"Англ. язык","Соколова Е.Ю.","61"],[2,"История России","Пятанина Л.А.","63"],[3,"МДК 01.01.","Гневашева Т.В.","50"],[4,"МДК 01.02.","Гневашева Т.В.","50"]],
    3: [[1,"МДК 01.02.","Гневашева Т.В.","50"],[2,"МДК 01.02.","Гневашева Т.В.","50"],[3,"БЖ","Гребиницкий В.А.","62"],[4,{top:"Статистика (Фомичева)",bot:"ДОУ (Фомичева)"},"Фомичева Н.С.","57"]],
    4: [[1,"МДК 02.01.","Гневашева Т.В.","50"],[2,"ДОУ","Фомичева Н.С.","57"],[3,"Статистика","Фомичева Н.С.","57"]],
    5: [[1,"КСПД «Office»","Донская / Фомичева","22/26"],[2,"Физ. культ.","Корольченко П.В.","с/з гл"],[3,"Экономика орг.","Фомичева Н.С.","57"],[4,"Осн.логис.деят.","Гневашева Т.В.","50"]],
    6: [[1,{top:"МДК 01.02 (Гневашева)",bot:"История Р. (Пятанина)"},"Гневашева / Пятанина","дист."],[2,{top:"Осн.лог.д. (Гневашева)",bot:"Экономика (Фомичева)"},"Гневашева / Фомичева","дист."]]
  },
  // --- 1 КУРС ---
  "ЭРО-26": {
    1: [[0,"Классный час","",""],[1,"Обществознание","Пятанина Л.А.","63"],[2,"Информатика","Доланчи / Донская","21/22"],[3,"Физ. культ.","Сидоров Г.Н.","с/з 6к"]],
    2: [[1,"Осн. черчения","Блохина / Журавлева","53/59"],[2,"Литература","Пантелеева Н.В.","65"],[3,"ОБЗР","Гребницкий В.А.","62"]],
    3: [[1,"Рус. язык","Пантелеева Н.В.","65"],[2,"Информатика","Доланчи / Донская","21/22"],[3,"История","Пятанина Л.А.","63"],[4,"География","Власова О.Б.","14"]],
    4: [[1,{top:"Литерат. (Пантелеева)",bot:"История (Пятанина)"},"Пантелеева / Пятанина","65 / 63"],[2,"Математика","Потапова А.А.","67"],[3,"Англ. язык","Утробина / Соколова","64 / 61"]],
    5: [[1,"Математика","Потапова А.А.","67"],[2,"Биология","Рахматуллина О.А.","69"],[3,"Физика","Шелухина Г.К.","74"],[4,"Физика","Шелухина Г.К.","74"]],
    6: [[1,"Информатика","Доланчи / Донская","дист."],[2,"Математика","Потапова А.А.","дист."]]
  },
  "СЭЗ-26": {
    1: [[0,"Классный час","",""],[1,"Рус. язык","Пантелеева Н.В.","65"],[2,"Обществознание","Пятанина Л.А.","63"],[3,"Информатика","Доланчи / Донская","21/22"],[4,"Физика","Рахматуллина О.А.","69"]],
    2: [[1,"Литература","Пантелеева Н.В.","65"],[2,"Информатика","Доланчи / Донская","21/22"],[3,"История","Пятанина Л.А.","63"],[4,"ОБЗР","Гребницкий В.А.","62"]],
    3: [[1,"География","Власова О.Б.","14"],[2,"Физика","Рахматуллина О.А.","69"],[3,"Математика","Потапова А.А.","67"]],
    4: [[1,"Осн. черчения","Блохина / Журавлева","53/59"],[2,"Англ. язык","Утробина / Соколова","64 / 61"],[3,"Физ. культ.","Сидоров Г.Н.","с/з 6к"]],
    5: [[1,"Литерат. (Пантелеева) / История (Пятанина)","Пантелеева / Пятанина","65 / 63"],[2,"Математика","Потапова А.А.","67"],[3,"Биология","Рахматуллина О.А.","69"]],
    6: [[1,"Тех. механика","Суюшкина Е.В.","дист."],[2,"Информатика","Доланчи / Донская","дист."],[3,"МДК 01.01.грматер.","Милькевич Н.Ю.","дист."]]
  },
  "КСК-26": {
    1: [[0,"Классный час","",""],[1,"Физика","Рахматуллина О.А.","69"],[2,"Рус. язык","Пантелеева Н.В.","65"],[3,"Математика","Потапова А.А.","67"],[4,"ОБЗР","Гребницкий В.А.","62"]],
    2: [[1,"Биология","Рахматуллина О.А.","69"],[2,"Осн. черчения","Блохина / Журавлева","53/59"],[3,"Информатика","Доланчи / Донская","21/22"],[4,"География","Власова О.Б.","14"]],
    3: [[1,"Физ. культ.","Сидоров Г.Н.","с/з 6к"],[2,"Физика","Рахматуллина О.А.","69"],[3,"Рус. язык","Пантелеева Н.В.","65"],[4,"История","Пятанина Л.А.","63"]],
    4: [[1,"Математика","Потапова А.А.","67"],[2,"Информатика","Доланчи / Донская","21/22"],[3,"Литература","Пантелеева Н.В.","65"]],
    5: [[1,"Англ. язык","Утробина / Соколова","64 / 61"],[2,"Литерат. (Пантелеева) / История (Пятанина)","Пантелеева / Пятанина","65 / 63"],[3,"Обществознание","Пятанина Л.А.","63"]],
    6: [[1,"Информатика","Доланчи / Донская","дист."],[2,"Математика","Потапова А.А.","дист."],[3,"Физика","Рахматуллина О.А.","дист."]]
  },
  "ТОА-26": {
    1: [[0,"Классный час","",""],[1,"Физ. культ.","Сидоров Г.Н.","с/з 6к"],[2,"Физика","Рахматуллина О.А.","69"],[3,"Обществознание","Пятанина Л.А.","63"]],
    2: [[1,"Мед.группа","Корольченко П.В.","с/з"],[2,"Биология","Рахматуллина О.А.","69"],[3,"Литература","Пантелеева Н.В.","65"],[4,"Информатика","Донская / Петраш","22 / 24"]],
    3: [[1,"Физика","Рахматуллина О.А.","69"],[2,"Математика","Потапова А.А.","67"],[3,"Рус. язык","Пантелеева Н.В.","65"]],
    4: [[1,"История","Пятанина Л.А.","63"],[2,"Осн. черчения","Блохина / Журавлева","53/59"],[3,"Информатика","Донская / Петраш","22 / 24"],[4,"География","Власова О.Б.","14"]],
    5: [[1,"ОБЗР","Гребницкий В.А.","62"],[2,"Англ. язык","Утробина / Соколова","64 / 61"],[3,"Математика","Потапова А.А.","67"],[4,"История","Пятанина Л.А.","63"]],
    6: [[1,"Математика","Потапова А.А.","дист."],[2,"Информатика","Донская / Петраш","дист."]]
  },
  "ОДЛ-26": {
    1: [[0,"Классный час","",""],[1,"География","Власова О.Б.","14"],[2,"Физ. культ.","Сидоров Г.Н.","с/з 6к"],[3,"Физика","Рахматуллина О.А.","69"],[4,"Обществознание","Пятанина Л.А.","63"]],
    2: [[1,"ОБЗР","Гребницкий В.А.","62"],[2,"КСПД «Office»","Донская / Лесина","24 / 25"],[3,"Биология","Рахматуллина О.А.","69"],[4,"История","Пятанина Л.А.","63"]],
    3: [[1,"Математика","Потапова А.А.","67"],[2,"Рус. язык","Пантелеева Н.В.","65"],[3,"Информатика","Доланчи / Донская","21/22"]],
    4: [[1,"Литература","Пантелеева Н.В.","65"],[2,"Математика","Потапова А.А.","67"],[3,"Информатика","Доланчи / Донская","21/22"]],
    5: [[1,"Физика","Рахматуллина О.А.","69"],[2,"История","Пятанина Л.А.","63"],[3,"Англ. язык","Утробина / Соколова","64 / 61"]],
    6: [[1,"Математика","Потапова А.А.","дист."],[2,"Информатика","Доланчи / Донская","дист."]]
  }
};

const BG_PRESETS = {
  default:  { name: "Стандарт", light: "#f1f5f9", dark: "#0b1120" },
  aurora:   { name: "Аврора",  light: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)", dark: "linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)" },
  ocean:    { name: "Океан",   light: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)", dark: "linear-gradient(135deg, #0f2027 0%, #2c5364 100%)" },
  sunset:   { name: "Закат",   light: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)", dark: "linear-gradient(135deg, #3a1c71 0%, #d76d77 100%)" },
  forest:   { name: "Лес",     light: "linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)", dark: "linear-gradient(135deg, #134e5e 0%, #71b280 100%)" },
  midnight: { name: "Ночь",    light: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", dark: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)" }
};

const DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
const PAIR_NUMS = [0, 1, 2, 3, 4, 5];
const PAIR_NAMES = { 0: "Кл. час", 1: "1 пара", 2: "2 пара", 3: "3 пара", 4: "4 пара", 5: "5 пара" };

/* ============================================================
   2. ХРАНИЛИЩЕ
   ============================================================ */
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
let gradesData = LS.json("kgst_grades", []); // Массив объектов { id, subject, value, note, date }

function getAllGroupNames() {
  return [...Object.keys(DEFAULT_SCHEDULE), ...customGroups];
}
function getVisibleGroupNames() {
  const all = getAllGroupNames();
  const visible = all.filter(g => !hiddenGroups.includes(g));
  return visible.length > 0 ? visible : [all[0]];
}
function getSchedule(group) {
  if (userSchedule[group]) {
    const def = DEFAULT_SCHEDULE[group] || {};
    return { ...def, ...userSchedule[group] };
  }
  return DEFAULT_SCHEDULE[group] || {};
}
function setScheduleDay(group, day, dayData) {
  if (!userSchedule[group]) userSchedule[group] = {};
  if (dayData.length === 0) delete userSchedule[group][day];
  else userSchedule[group][day] = dayData;
  LS.setJson("kgst_schedule_custom", userSchedule);
}
function resetScheduleDay(group, day) {
  if (userSchedule[group]) {
    delete userSchedule[group][day];
    if (Object.keys(userSchedule[group]).length === 0) delete userSchedule[group];
    LS.setJson("kgst_schedule_custom", userSchedule);
  }
}

/* ============================================================
   3. СОСТОЯНИЕ
   ============================================================ */
let selectedGroup = LS.get("kgst_group", "СЭЗ-25");
let selectedDay = Math.min(Math.max(new Date().getDay(), 1), 6);
let weekMode = LS.get("kgst_week_mode", "auto");
let fontScale = LS.get("kgst_font_scale", "1");
let cardOpacity = LS.get("kgst_card_opacity", "1");
let bgPreset = LS.get("kgst_bg_preset", "default");
let bgCustom = LS.get("kgst_bg_custom", "");
let currentNoteKey = "";
let editorGroup = "СЭЗ-25";
let editorDay = 1;

const dom = {
  weekBanner: document.getElementById("weekBanner"),
  weekIcon: document.getElementById("weekIcon"),
  weekLabel: document.getElementById("weekLabel"),
  weekModePill: document.getElementById("weekModePill"),
  liveStatus: document.getElementById("liveStatus"),
  statusBadge: document.getElementById("statusBadge"),
  liveTimer: document.getElementById("liveTimer"),
  progressFill: document.getElementById("progressFill"),
  daysBar: document.getElementById("daysBar"),
  scheduleList: document.getElementById("scheduleList"),
  noteModal: document.getElementById("noteModal"),
  settingsModal: document.getElementById("settingsModal"),
  editorModal: document.getElementById("editorModal"),
  dashboardModal: document.getElementById("dashboardModal"),
  groupSelect: document.getElementById("groupSelect"),
  themeSelect: document.getElementById("themeSelect")
};

/* ============================================================
   4. УТИЛИТЫ
   ============================================================ */
function toSec(t) { const [h, m] = t.split(":").map(Number); return h * 3600 + m * 60; }
function getISOWeekNumber(d) {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  const week1 = new Date(date.getFullYear(), 0, 4);
  return 1 + Math.round(((date - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}
function isTopWeek() {
  if (weekMode === "top") return true;
  if (weekMode === "bot") return false;
  return getISOWeekNumber(new Date()) % 2 === 0;
}

/* ============================================================
   5. ТЕМА И ФОН
   ============================================================ */
function isDarkNow() {
  const t = document.documentElement.getAttribute("data-theme");
  if (t === "dark") return true;
  if (t === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  LS.set("kgst_theme", theme);
  dom.themeSelect.value = theme;
  applyBackground();
  
  const dark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  // Исправление синей полосы снизу: ставим цвет системной панели под цвет фона
  document.querySelector('meta[name="theme-color"]').setAttribute("content", dark ? "#0b1120" : "#f1f5f9");
}

function applyBackground() {
  const dark = isDarkNow();
  const baseColor = dark ? "#0b1120" : "#f1f5f9";
  let bgImage = "none";
  let overlay = "transparent";

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
  document.querySelectorAll("#fontSizeControl .seg-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.scale === fontScale);
  });
}
function applyCardOpacity(op) {
  cardOpacity = String(op);
  document.documentElement.style.setProperty("--card-opacity", cardOpacity);
  LS.set("kgst_card_opacity", cardOpacity);
  document.querySelectorAll("#opacityControl .seg-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.opacity === cardOpacity);
  });
}

/* ============================================================
   6. ГРУППЫ И ДНИ
   ============================================================ */
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
}
function escapeAttr(s) { return escapeHtml(s); }

function refreshGroupSelect() {
  const visible = getVisibleGroupNames();
  if (!visible.includes(selectedGroup)) {
    selectedGroup = visible[0];
    LS.set("kgst_group", selectedGroup);
  }
  dom.groupSelect.innerHTML = visible.map(g =>
    `<option value="${escapeAttr(g)}" ${g === selectedGroup ? "selected" : ""}>${escapeHtml(g)}</option>`
  ).join("");
}

function renderDays() {
  dom.daysBar.innerHTML = "";
  DAYS.forEach((d, idx) => {
    const dayNum = idx + 1;
    const btn = document.createElement("button");
    btn.className = "day-btn" + (dayNum === selectedDay ? " active" : "");
    btn.textContent = d;
    btn.onclick = () => { selectedDay = dayNum; renderDays(); renderSchedule(); };
    dom.daysBar.appendChild(btn);
  });
}

/* ============================================================
   7. РАСПИСАНИЕ
   ============================================================ */
let cachedCards = [];
let cachedBreaks = [];

function renderSchedule() {
  const top = isTopWeek();
  dom.weekBanner.classList.toggle("bottom-week", !top);
  dom.weekIcon.textContent = top ? "🔼" : "🔽";
  dom.weekLabel.textContent = top ? "Верхняя неделя" : "Нижняя неделя";
  dom.weekModePill.textContent = weekMode === "auto" ? "Авто" : "Вручную";

  dom.scheduleList.innerHTML = "";
  cachedCards = [];
  cachedBreaks = [];

  const groupSchedule = getSchedule(selectedGroup);
  const dayData = (groupSchedule && groupSchedule[selectedDay]) || [];
  const bells = selectedDay === 1 ? BELLS.monday : BELLS.regular;

  if (dayData.length === 0) {
    dom.scheduleList.innerHTML = `<div class="card entering" style="text-align:center; cursor:default;"><div class="subject" style="margin:0;">В этот день пар нет</div></div>`;
    updateLive();
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
    card.className = "card entering";
    card.style.setProperty("--entry-delay", (index * 45) + "ms");

    card.innerHTML = `
      <div class="card-top">
        <span>
          ${pairNum === 0 ? "Классный час" : pairNum + " пара"} • ${timeText}
          <span class="live-pill" style="display:none;"><span class="live-dot"></span>Идёт сейчас</span>
        </span>
        ${room ? `<span class="room-badge">Каб. ${escapeHtml(room)}</span>` : ""}
      </div>
      <div class="subject"></div>
      <div class="teacher" style="${teacher ? "" : "height:6px; margin:0;"}"></div>
      <div class="note-box ${savedNote ? "has-note" : ""}">
        <span>${savedNote ? "📝" : "✏️"}</span>
        <span class="note-text"></span>
      </div>`;

    card.querySelector(".subject").textContent = subjectName || "(без названия)";
    if (teacher) card.querySelector(".teacher").textContent = teacher;
    card.querySelector(".note-text").textContent = savedNote || "Нажмите, чтобы сделать заметку к этой паре";

    card.onclick = () => {
      card.classList.add("clicked");
      setTimeout(() => {
        card.classList.remove("clicked");
        openNoteModal(noteKey, subjectName, pairNum === 0 ? "Классный час" : `${pairNum} пара`, savedNote);
      }, 110);
    };

    dom.scheduleList.appendChild(card);
    cachedCards.push({ el: card, pill: card.querySelector(".live-pill"), pair: pairNum, isCurrent: false });

    if (index < dayData.length - 1) {
      const nextPairNum = dayData[index + 1][0];
      const nextBell = bells.find(b => b.num === nextPairNum);
      if (bell && nextBell) {
        const mins = Math.round((toSec(nextBell.start) - toSec(bell.end)) / 60);
        if (mins > 0) {
          const brk = document.createElement("div");
          brk.className = "break-card entering";
          brk.style.setProperty("--entry-delay", (index * 45 + 20) + "ms");
          brk.innerHTML = `<span>☕ Перемена (${mins} мин)</span><span>${bell.end} – ${nextBell.start}</span>`;
          dom.scheduleList.appendChild(brk);
          cachedBreaks.push({ el: brk, afterPair: pairNum, isActive: false });
        }
      }
    }
  });

  updateLive();
}

/* ============================================================
   8. ТАЙМЕР И ДАШБОРД "СЕЙЧАС"
   ============================================================ */
function getActiveBells(group, day) {
  const schedule = getSchedule(group);
  const dayData = (schedule && schedule[day]) || [];
  if (dayData.length === 0) return [];
  const pairNums = new Set(dayData.map(x => x[0]));
  const all = day === 1 ? BELLS.monday : BELLS.regular;
  return all.filter(b => pairNums.has(b.num));
}

function updateLive() {
  if (document.hidden) return;
  const now = new Date();
  const today = now.getDay();
  const secNow = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

  // Обновляем время в дашборде
  const dashTime = document.getElementById("dashTime");
  if (dashTime) {
    dashTime.textContent = now.toLocaleTimeString('ru-RU');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById("dashDate").textContent = now.toLocaleDateString('ru-RU', options);
  }

  if (today === 0) {
    setLiveUI("Воскресенье — выходной", "Отдых", "— : —", 0, false);
    return;
  }

  const bells = getActiveBells(selectedGroup, today);
  if (bells.length === 0) {
    setLiveUI("Сегодня пар нет", "Отдых", "— : —", 0, false);
    return;
  }

  let activePairNum = null;
  let activeBreakAfterNum = null;
  let stateText = "Учебный день завершён";
  let badgeText = "Конец";
  let isBreak = false;
  let diffSec = 0;
  let progressPct = 0;
  let currentPairName = "";

  for (let i = 0; i < bells.length; i++) {
    const start = toSec(bells[i].start);
    const end = toSec(bells[i].end);

    if (secNow < start) {
      if (i === 0) {
        stateText = `До начала (${bells[i].name})`;
        badgeText = "Ожидание";
        diffSec = start - secNow;
      } else {
        const prevEnd = toSec(bells[i - 1].end);
        isBreak = true;
        activeBreakAfterNum = bells[i - 1].num;
        stateText = `Перемена • Далее: ${bells[i].name}`;
        badgeText = "Перемена";
        diffSec = start - secNow;
        progressPct = Math.min(100, Math.max(0, ((secNow - prevEnd) / (start - prevEnd)) * 100));
      }
      break;
    } else if (secNow >= start && secNow <= end) {
      activePairNum = bells[i].num;
      stateText = `Идёт ${bells[i].name} • До перемены`;
      badgeText = "Идёт пара";
      diffSec = end - secNow;
      progressPct = Math.min(100, Math.max(0, ((secNow - start) / (end - start)) * 100));
      
      // Ищем название предмета для дашборда
      const dayData = getSchedule(selectedGroup)[today] || [];
      const pairData = dayData.find(p => p[0] === activePairNum);
      if (pairData) {
        const subjRaw = pairData[1];
        const top = isTopWeek();
        currentPairName = typeof subjRaw === "object" ? (top ? subjRaw.top : subjRaw.bot) : subjRaw;
      }
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
  
  setLiveUI(stateText, badgeText, timerStr, progressPct, isBreak, currentPairName);

  const isToday = selectedDay === today;
  for (const c of cachedCards) {
    const shouldBeCurrent = isToday && c.pair === activePairNum;
    if (c.isCurrent !== shouldBeCurrent) {
      c.isCurrent = shouldBeCurrent;
      c.el.classList.toggle("current", shouldBeCurrent);
      c.pill.style.display = shouldBeCurrent ? "inline-flex" : "none";
    }
  }
  for (const b of cachedBreaks) {
    const shouldBeActive = isToday && b.afterPair === activeBreakAfterNum;
    if (b.isActive !== shouldBeActive) {
      b.isActive = shouldBeActive;
      b.el.classList.toggle("active-break", shouldBeActive);
    }
  }
}

function setLiveUI(stateText, badgeText, timerStr, progressPct, isBreak, currentPairName = "") {
  dom.liveStatus.textContent = stateText;
  dom.statusBadge.textContent = badgeText;
  dom.statusBadge.className = isBreak ? "status-badge break-mode" : "status-badge";
  dom.progressFill.className = isBreak ? "progress-fill break-fill" : "progress-fill";
  dom.progressFill.style.width = `${progressPct}%`;
  dom.liveTimer.textContent = timerStr;

  // Обновляем данные в Дашборде
  const dashStatus = document.getElementById("dashStatus");
  const dashCurrentPair = document.getElementById("dashCurrentPair");
  if (dashStatus) {
    dashStatus.textContent = stateText;
    dashStatus.style.color = isBreak ? "var(--green)" : "var(--accent)";
    dashCurrentPair.textContent = currentPairName ? `Предмет: ${currentPairName}` : "";
  }
}

/* ============================================================
   9. ДИАЛОГИ (Заметки, Настройки, Редактор, Дашборд)
   ============================================================ */
function openAnimatedDialog(dlg) {
  if (dlg.open) return;
  dlg.showModal();
  requestAnimationFrame(() => dlg.classList.add("is-open"));
}
function closeAnimatedDialog(dlg) {
  if (!dlg.open) return;
  dlg.classList.remove("is-open");
  setTimeout(() => dlg.close(), 210);
}

// Заметки
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
  if (val) LS.set(currentNoteKey, val);
  else LS.del(currentNoteKey);
  closeAnimatedDialog(dom.noteModal);
  renderSchedule();
  renderHomework(); // Обновить список ДЗ
};
document.getElementById("deleteNote").onclick = () => {
  LS.del(currentNoteKey);
  closeAnimatedDialog(dom.noteModal);
  renderSchedule();
  renderHomework();
};

// --- ДАШБОРД ---
function openDashboard() {
  renderHomework();
  renderGrades();
  renderChart();
  openAnimatedDialog(dom.dashboardModal);
}
document.getElementById("openDashboardBtn").onclick = openDashboard;
document.getElementById("closeDashboardBtn").onclick = () => closeAnimatedDialog(dom.dashboardModal);
dom.dashboardModal.onclick = (e) => { if (e.target === dom.dashboardModal) closeAnimatedDialog(dom.dashboardModal); };

// Переключение вкладок
document.querySelectorAll(".dash-tab").forEach(tab => {
  tab.onclick = () => {
    document.querySelectorAll(".dash-tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".dash-content").forEach(c => c.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
  };
});

// Вкладка Записи (ДЗ)
function renderHomework() {
  const container = document.getElementById("hwList");
  container.innerHTML = "";
  let hasNotes = false;

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith("note_")) {
      hasNotes = true;
      // key type: note_СЭЗ-25_1_2
      const parts = key.split("_");
      const group = parts[1];
      const dayNum = parseInt(parts[2]);
      const pairNum = parseInt(parts[3]);
      const text = localStorage.getItem(key);
      
      const dayName = DAYS[dayNum - 1] || "?";
      const pairName = PAIR_NAMES[pairNum] || "?";

      const el = document.createElement("div");
      el.className = "hw-item";
      el.innerHTML = `
        <div class="hw-item-title">${group} • ${dayName} • ${pairName}</div>
        <div>${escapeHtml(text)}</div>
      `;
      container.appendChild(el);
    }
  }

  if (!hasNotes) {
    container.innerHTML = `<div style="text-align:center; color:var(--muted); font-size:13px; padding:20px;">У вас пока нет заметок к парам. Нажмите на любую пару в расписании, чтобы добавить ДЗ.</div>`;
  }
}

// Вкладка Оценки
document.getElementById("addGradeBtn").onclick = () => {
  const subj = document.getElementById("gradeSubject").value.trim();
  const val = parseInt(document.getElementById("gradeValue").value);
  const note = document.getElementById("gradeNote").value.trim();
  
  if (!subj || isNaN(val) || val < 2 || val > 5) {
    alert("Введите корректный предмет и оценку (от 2 до 5).");
    return;
  }

  gradesData.push({ id: Date.now(), subject: subj, value: val, note: note });
  LS.setJson("kgst_grades", gradesData);
  
  document.getElementById("gradeSubject").value = "";
  document.getElementById("gradeValue").value = "";
  document.getElementById("gradeNote").value = "";
  
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
  gradesData.sort((a, b) => b.id - a.id); // Сначала новые

  gradesData.forEach(g => {
    sum += g.value;
    const el = document.createElement("div");
    el.className = "grade-item";
    el.innerHTML = `
      <div class="grade-val g${g.value}">${g.value}</div>
      <div class="grade-info">
        <div class="grade-subj">${escapeHtml(g.subject)}</div>
        ${g.note ? `<div class="grade-note">${escapeHtml(g.note)}</div>` : ""}
      </div>
      <button class="btn btn-danger" style="padding:4px 8px; font-size:12px;" onclick="deleteGrade(${g.id})">✕</button>
    `;
    list.appendChild(el);
  });

  const gpa = (sum / gradesData.length).toFixed(2);
  document.getElementById("gpaValue").textContent = gpa;
}

window.deleteGrade = function(id) {
  gradesData = gradesData.filter(g => g.id !== id);
  LS.setJson("kgst_grades", gradesData);
  renderGrades();
};

// Вкладка График
document.getElementById("chartFileInput").addEventListener("change", (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    const img = new Image();
    img.onload = () => {
      const MAX = 1200;
      let w = img.width, h = img.height;
      if (Math.max(w, h) > MAX) {
        const k = MAX / Math.max(w, h);
        w = Math.round(w * k); h = Math.round(h * k);
      }
      const c = document.createElement("canvas");
      c.width = w; c.height = h;
      c.getContext("2d").drawImage(img, 0, 0, w, h);
      const dataUrl = c.toDataURL("image/jpeg", 0.85);
      LS.set("kgst_chart_image", dataUrl);
      renderChart();
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
  e.target.value = "";
});

function renderChart() {
  const container = document.getElementById("chartContainer");
  const imgData = LS.get("kgst_chart_image", "");
  if (imgData) {
    container.innerHTML = `<img src="${imgData}" style="width:100%; border-radius:12px; box-shadow:var(--shadow);">`;
  } else {
    container.innerHTML = `<div style="color:var(--muted); font-size:13px; margin-top:20px;">График не загружен</div>`;
  }
}

/* ============================================================
   10. НАСТРОЙКИ И РЕДАКТОР
   ============================================================ */
function renderBackgroundGrid() {
  const grid = document.getElementById("bgGrid");
  grid.innerHTML = "";
  const dark = isDarkNow();
  Object.entries(BG_PRESETS).forEach(([key, p]) => {
    const el = document.createElement("div");
    el.className = "bg-option" + (bgPreset === key ? " active" : "");
    const val = dark ? p.dark : p.light;
    if (val.indexOf("gradient") !== -1) el.style.backgroundImage = val;
    else el.style.backgroundColor = val;
    el.textContent = p.name;
    el.onclick = () => {
      bgPreset = key;
      LS.set("kgst_bg_preset", bgPreset);
      applyBackground();
      renderBackgroundGrid();
    };
    grid.appendChild(el);
  });
  const custom = document.createElement("div");
  custom.className = "bg-option bg-custom" + (bgPreset === "custom" ? " active" : "");
  if (bgPreset === "custom" && bgCustom) {
    custom.style.backgroundImage = `url("${bgCustom}")`;
    custom.style.backgroundSize = "cover";
    custom.style.backgroundPosition = "center";
    custom.textContent = "";
  } else {
    custom.textContent = "🖼 Своё фото";
  }
  custom.onclick = () => {
    if (!bgCustom) document.getElementById("bgFileInput").click();
    else {
      bgPreset = "custom";
      LS.set("kgst_bg_preset", bgPreset);
      applyBackground();
      renderBackgroundGrid();
    }
  };
  grid.appendChild(custom);
}

function renderSettingsGroups() {
  const container = document.getElementById("groupChips");
  container.innerHTML = "";
  getAllGroupNames().forEach(group => {
    const isEnabled = !hiddenGroups.includes(group);
    const chip = document.createElement("div");
    chip.className = "group-chip" + (isEnabled ? " enabled" : "");
    chip.innerHTML = `<span>${isEnabled ? "✓" : "+"}</span><span>${escapeHtml(group)}</span>`;
    chip.onclick = () => {
      if (isEnabled) {
        if (getVisibleGroupNames().length <= 1) return;
        hiddenGroups.push(group);
      } else {
        hiddenGroups = hiddenGroups.filter(g => g !== group);
      }
      LS.setJson("kgst_hidden_groups", hiddenGroups);
      renderSettingsGroups();
      refreshGroupSelect();
      renderSchedule();
    };
    container.appendChild(chip);
  });
}

function updateWeekModeButtons() {
  document.querySelectorAll("#weekModeControl .seg-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.wmode === weekMode);
  });
}

document.getElementById("openSettingsBtn").onclick = () => {
  updateWeekModeButtons();
  renderSettingsGroups();
  renderBackgroundGrid();
  applyFontScale(fontScale);
  applyCardOpacity(cardOpacity);
  openAnimatedDialog(dom.settingsModal);
};
document.getElementById("closeSettingsBtn").onclick = () => closeAnimatedDialog(dom.settingsModal);
dom.settingsModal.onclick = (e) => { if (e.target === dom.settingsModal) closeAnimatedDialog(dom.settingsModal); };

document.querySelectorAll("#fontSizeControl .seg-btn").forEach(btn => {
  btn.onclick = () => applyFontScale(btn.dataset.scale);
});
document.querySelectorAll("#opacityControl .seg-btn").forEach(btn => {
  btn.onclick = () => applyCardOpacity(btn.dataset.opacity);
});
document.querySelectorAll("#weekModeControl .seg-btn").forEach(btn => {
  btn.onclick = () => {
    weekMode = btn.dataset.wmode;
    LS.set("kgst_week_mode", weekMode);
    updateWeekModeButtons();
    renderSchedule();
  };
});

// Фоновые картинки
document.getElementById("bgUrlInput").addEventListener("change", (e) => {
  const url = e.target.value.trim();
  if (!url) return;
  bgCustom = url;
  LS.set("kgst_bg_custom", bgCustom);
  bgPreset = "custom";
  LS.set("kgst_bg_preset", bgPreset);
  applyBackground();
  renderBackgroundGrid();
  e.target.value = "";
});
document.getElementById("bgFileInput").addEventListener("change", (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    const img = new Image();
    img.onload = () => {
      const MAX = 1400;
      let w = img.width, h = img.height;
      if (Math.max(w, h) > MAX) {
        const k = MAX / Math.max(w, h);
        w = Math.round(w * k); h = Math.round(h * k);
      }
      const c = document.createElement("canvas");
      c.width = w; c.height = h;
      c.getContext("2d").drawImage(img, 0, 0, w, h);
      const dataUrl = c.toDataURL("image/jpeg", 0.82);
      bgCustom = dataUrl;
      try { LS.set("kgst_bg_custom", bgCustom); }
      catch { alert("Картинка слишком большая."); return; }
      bgPreset = "custom";
      LS.set("kgst_bg_preset", bgPreset);
      applyBackground();
      renderBackgroundGrid();
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
  e.target.value = "";
});

document.getElementById("addGroupBtn").onclick = () => {
  const input = document.getElementById("newGroupInput");
  const name = input.value.trim().toUpperCase();
  if (!name) return;
  if (!getAllGroupNames().includes(name)) {
    customGroups.push(name);
    LS.setJson("kgst_custom_groups", customGroups);
  }
  hiddenGroups = hiddenGroups.filter(g => g !== name);
  LS.setJson("kgst_hidden_groups", hiddenGroups);
  selectedGroup = name;
  LS.set("kgst_group", selectedGroup);
  input.value = "";
  renderSettingsGroups();
  refreshGroupSelect();
  renderSchedule();
};

// Редактор
function renderEditorGroupSelect() {
  const sel = document.getElementById("editorGroupSelect");
  sel.innerHTML = getAllGroupNames().map(g =>
    `<option value="${escapeAttr(g)}" ${g === editorGroup ? "selected" : ""}>${escapeHtml(g)}</option>`
  ).join("");
}

function renderEditorDaysBar() {
  const bar = document.getElementById("editorDaysBar");
  bar.innerHTML = "";
  DAYS.forEach((d, idx) => {
    const dayNum = idx + 1;
    const btn = document.createElement("button");
    btn.className = "day-btn" + (dayNum === editorDay ? " active" : "");
    btn.textContent = d;
    btn.onclick = () => { editorDay = dayNum; renderEditorDaysBar(); renderEditorPairs(); };
    bar.appendChild(btn);
  });
}

function makePairRow(data) {
  const [num, subj, teacher, room] = data;
  const isSplit = typeof subj === "object";
  const subjTop = isSplit ? subj.top : subj;
  const subjBot = isSplit ? subj.bot : "";

  const row = document.createElement("div");
  row.className = "edit-pair";

  const topRow = document.createElement("div");
  topRow.className = "edit-pair-top";

  const numSel = document.createElement("select");
  numSel.className = "pair-num-edit";
  PAIR_NUMS.forEach(n => {
    const o = document.createElement("option");
    o.value = n;
    o.textContent = PAIR_NAMES[n];
    if (n === num) o.selected = true;
    numSel.appendChild(o);
  });

  const splitLabel = document.createElement("label");
  splitLabel.className = "split-toggle";
  const splitChk = document.createElement("input");
  splitChk.type = "checkbox";
  splitChk.className = "pair-split-edit";
  splitChk.checked = isSplit;
  splitLabel.appendChild(splitChk);
  splitLabel.appendChild(document.createTextNode("Верх/Низ"));

  const delBtn = document.createElement("button");
  delBtn.className = "btn pair-delete-edit";
  delBtn.textContent = "🗑";
  delBtn.type = "button";
  delBtn.onclick = () => row.remove();

  topRow.appendChild(numSel);
  topRow.appendChild(splitLabel);
  topRow.appendChild(delBtn);
  row.appendChild(topRow);

  const subjInp = document.createElement("input");
  subjInp.className = "text-input pair-subj-edit";
  subjInp.placeholder = isSplit ? "Предмет (верх)" : "Предмет";
  subjInp.value = subjTop || "";
  row.appendChild(subjInp);

  const subjBotInp = document.createElement("input");
  subjBotInp.className = "text-input pair-subj-bot-edit";
  subjBotInp.placeholder = "Предмет (низ)";
  subjBotInp.value = subjBot || "";
  subjBotInp.style.display = isSplit ? "block" : "none";
  row.appendChild(subjBotInp);

  splitChk.onchange = () => {
    subjBotInp.style.display = splitChk.checked ? "block" : "none";
    subjInp.placeholder = splitChk.checked ? "Предмет (верх)" : "Предмет";
  };

  const teachInp = document.createElement("input");
  teachInp.className = "text-input pair-teacher-edit";
  teachInp.placeholder = "Преподаватель";
  teachInp.value = teacher || "";
  row.appendChild(teachInp);

  const roomInp = document.createElement("input");
  roomInp.className = "text-input pair-room-edit";
  roomInp.placeholder = "Кабинет";
  roomInp.value = room || "";
  row.appendChild(roomInp);

  return row;
}

function renderEditorPairs() {
  const list = document.getElementById("editorPairsList");
  list.innerHTML = "";
  const schedule = getSchedule(editorGroup);
  const dayData = (schedule && schedule[editorDay]) || [];
  if (dayData.length === 0) {
    const empty = document.createElement("div");
    empty.className = "setting-hint";
    empty.style.textAlign = "center";
    empty.style.padding = "14px";
    empty.textContent = "Пар пока нет.";
    list.appendChild(empty);
  } else {
    dayData.forEach(item => list.appendChild(makePairRow(item)));
  }
}

document.getElementById("openEditorBtn").onclick = () => {
  editorGroup = selectedGroup;
  editorDay = selectedDay;
  renderEditorGroupSelect();
  renderEditorDaysBar();
  renderEditorPairs();
  openAnimatedDialog(dom.editorModal);
};
document.getElementById("closeEditorBtn").onclick = () => closeAnimatedDialog(dom.editorModal);
dom.editorModal.onclick = (e) => { if (e.target === dom.editorModal) closeAnimatedDialog(dom.editorModal); };
document.getElementById("editorGroupSelect").onchange = (e) => {
  editorGroup = e.target.value;
  renderEditorPairs();
};
document.getElementById("editorAddPairBtn").onclick = () => {
  const list = document.getElementById("editorPairsList");
  const empty = list.querySelector(".setting-hint");
  if (empty) empty.remove();
  const used = new Set(Array.from(list.querySelectorAll(".pair-num-edit")).map(s => parseInt(s.value)));
  let nextNum = 1;
  for (const n of PAIR_NUMS) { if (!used.has(n) && n !== 0) { nextNum = n; break; } }
  list.appendChild(makePairRow([nextNum, "", "", ""]));
};
document.getElementById("editorResetBtn").onclick = () => {
  if (!confirm(`Сбросить ${DAYS[editorDay - 1]} для группы ${editorGroup}?`)) return;
  resetScheduleDay(editorGroup, editorDay);
  renderEditorPairs();
  renderSchedule();
};
document.getElementById("editorSaveBtn").onclick = () => {
  const rows = document.querySelectorAll("#editorPairsList .edit-pair");
  const result = [];
  rows.forEach(row => {
    const num = parseInt(row.querySelector(".pair-num-edit").value);
    const isSplit = row.querySelector(".pair-split-edit").checked;
    const subj = row.querySelector(".pair-subj-edit").value.trim();
    const subjBot = row.querySelector(".pair-subj-bot-edit").value.trim();
    const teacher = row.querySelector(".pair-teacher-edit").value.trim();
    const room = row.querySelector(".pair-room-edit").value.trim();
    if (!subj && !subjBot) return;
    const subjVal = isSplit ? { top: subj, bot: subjBot } : subj;
    result.push([num, subjVal, teacher, room]);
  });
  result.sort((a, b) => a[0] - b[0]);
  setScheduleDay(editorGroup, editorDay, result);
  if (selectedGroup === editorGroup && selectedDay === editorDay) renderSchedule();
  closeAnimatedDialog(dom.editorModal);
};

/* ============================================================
   11. PWA И СТАРТ
   ============================================================ */
function setupPWA() {
  let deferredPrompt = null;
  const installBtn = document.getElementById("installBtn");
  const installSection = document.getElementById("installSection");

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installSection.style.display = "block";
  });

  installBtn.addEventListener("click", async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    try { await deferredPrompt.userChoice; } catch {}
    deferredPrompt = null;
    installSection.style.display = "none";
  });

  window.addEventListener("appinstalled", () => {
    installSection.style.display = "none";
  });

  if ("serviceWorker" in navigator) {
    if (location.protocol !== "file:") {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("./sw.js").catch(() => {});
      });
    }
  }
}

function dismissSplash() {
  const splash = document.getElementById("splash");
  const app = document.getElementById("app");
  if (!splash) return;
  app.classList.add("loaded");
  requestAnimationFrame(() => splash.classList.add("hidden"));
  setTimeout(() => { if (splash.parentNode) splash.parentNode.removeChild(splash); }, 900);
}

applyTheme(LS.get("kgst_theme", "system"));
applyFontScale(fontScale);
applyCardOpacity(cardOpacity);
applyBackground();
refreshGroupSelect();
renderDays();
renderSchedule();
setupPWA();

setInterval(updateLive, 1000);
setTimeout(dismissSplash, 700);

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  if (LS.get("kgst_theme", "system") === "system") {
    applyBackground();
    if (document.getElementById("bgGrid")) renderBackgroundGrid();
  }
});

dom.themeSelect.onchange = () => {
  applyTheme(dom.themeSelect.value);
  if (document.getElementById("bgGrid")) renderBackgroundGrid();
};

dom.groupSelect.onchange = () => {
  selectedGroup = dom.groupSelect.value;
  LS.set("kgst_group", selectedGroup);
  renderSchedule();
};

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) updateLive();
});
