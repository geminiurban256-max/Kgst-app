// ==== КОНСТАНТЫ ====
const BG_PRESETS = {
  default: { name: "Тёмный", light: "#f8fafc", dark: "#0f172a" },
  aurora:  { name: "Аврора", light: "linear-gradient(135deg,#a8edea 0%,#fed6e3 100%)", dark: "linear-gradient(135deg,#1a2980 0%,#26d0ce 100%)" },
  ocean:   { name: "Океан", light: "linear-gradient(135deg,#89f7fe 0%,#66a6ff 100%)", dark: "linear-gradient(135deg,#0f2027 0%,#2c5364 100%)" },
  sunset:  { name: "Закат", light: "linear-gradient(135deg,#ffecd2 0%,#fcb69f 100%)", dark: "linear-gradient(135deg,#3a1c71 0%,#d76d77 100%)" },
  forest:  { name: "Лес", light: "linear-gradient(135deg,#d4fc79 0%,#96e6a1 100%)", dark: "linear-gradient(135deg,#134e5e 0%,#71b280 100%)" },
  midnight:{ name: "Ночь", light: "linear-gradient(135deg,#667eea 0%,#764ba2 100%)", dark: "linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#24243e 100%)" }
};
const CARD_THEMES = {
  auto:   { name: "Авто" },
  slate:  { name: "Графит", card: "#1e293b", brk: "#14532d" },
  white:  { name: "Белый",  card: "#ffffff", brk: "#e7f6ec" },
  black:  { name: "Чёрный", card: "#0b0b0f", brk: "#161616" },
  violet: { name: "Фиолет", card: "#4c1d95", brk: "#312e81" },
  ocean:  { name: "Океан",  card: "#0c4a6e", brk: "#134e4a" },
  sunset: { name: "Закат",  card: "#7c2d12", brk: "#713f12" },
  forest: { name: "Лес",    card: "#14532d", brk: "#1f3d2b" },
  rose:   { name: "Роза",   card: "#fecdd3", brk: "#fbcfe8" },
  sand:   { name: "Песок",  card: "#fef3c7", brk: "#fde68a" }
};
const DAYS = ["Пн","Вт","Ср","Чт","Пт","Сб"];
const PAIR_NAMES = { 0:"Кл. час", 1:"1 пара", 2:"2 пара", 3:"3 пара", 4:"4 пара", 5:"5 пара" };

// ==== ХРАНИЛИЩЕ ====
const LS = {
  get(k,d){ try{ const v=localStorage.getItem(k); return v===null?d:v; }catch{ return d; } },
  set(k,v){ try{ localStorage.setItem(k,v); }catch{} },
  del(k){ try{ localStorage.removeItem(k); }catch{} },
  json(k,d){ try{ const v=localStorage.getItem(k); return v?JSON.parse(v):d; }catch{ return d; } },
  setJson(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch{} }
};
let customGroups = LS.json("kgst_custom_groups", []);
let hiddenGroups = LS.json("kgst_hidden_groups", []);
let userSchedule = LS.json("kgst_schedule_custom", {});
let gradesData = LS.json("kgst_grades", []);

// ==== СОСТОЯНИЕ ====
let selectedGroup = LS.get("kgst_group", "");            // при первом входе — пусто
let selectedDay = Math.min(Math.max(new Date().getDay(), 1), 6);
let weekMode = LS.get("kgst_week_mode", "auto");
let fontScale = LS.get("kgst_font_scale", "1");
let cardOpacity = LS.get("kgst_card_opacity", "1");
let bgPreset = LS.get("kgst_bg_preset", "default");      // preset | color | custom
let bgCustom = LS.get("kgst_bg_custom", "");             // dataURL картинки
let bgCustomColor = LS.get("kgst_bg_custom_color", "#3b82f6");
let cardTheme = LS.get("kgst_card_theme", "auto");
let viewMode = LS.get("kgst_view", "course");            // для ПК
let currentNoteKey = "";
const mqDesktop = window.matchMedia("(min-width: 900px)");

const dom = {
  weekBanner: document.getElementById("weekBanner"), weekIcon: document.getElementById("weekIcon"),
  weekLabel: document.getElementById("weekLabel"), weekModePill: document.getElementById("weekModePill"),
  liveStatus: document.getElementById("liveStatus"), headerTime: document.getElementById("headerTime"),
  greetingText: document.getElementById("greetingText"), daysBar: document.getElementById("daysBar"),
  scheduleList: document.getElementById("scheduleList"), noteModal: document.getElementById("noteModal"),
  settingsModal: document.getElementById("settingsModal"), dashboardModal: document.getElementById("dashboardModal"),
  groupSelect: document.getElementById("groupSelect"), groupHint: document.getElementById("groupHint")
};

// ==== УТИЛИТЫ ====
function getAllGroupNames(){ return [...Object.keys(DEFAULT_SCHEDULE), ...customGroups]; }
function getVisibleGroupNames(){ const all=getAllGroupNames(); const v=all.filter(g=>!hiddenGroups.includes(g)); return v.length?v:[all[0]]; }
function getSchedule(g){ return userSchedule[g] ? { ...(DEFAULT_SCHEDULE[g]||{}), ...userSchedule[g] } : (DEFAULT_SCHEDULE[g]||{}); }
function toSec(t){ const [h,m]=t.split(":").map(Number); return h*3600+m*60; }
function escapeHtml(s){ return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
function courseOf(g){ const m=String(g).match(/(\d{2})$/); return m?m[1]:"??"; }
function courseLabel(c){ const n=new Date(); const ay=n.getMonth()>=8?n.getFullYear():n.getFullYear()-1; const k=Math.min(4,Math.max(1,ay-(2000+parseInt(c))+1)); return k+" курс"; }
function getISOWeekNumber(d){ const date=new Date(d); date.setHours(0,0,0,0); date.setDate(date.getDate()+3-(date.getDay()+6)%7; const w1=new Date(date.getFullYear(),0,4); return 1+Math.round(((date-w1)/86400000-3+(w1.getDay()+6)%7)/7); }
function isTopWeek(){ if(weekMode==="top")return true; if(weekMode==="bot")return false; return getISOWeekNumber(new Date())%2===0; }
function isDarkNow(){ const t=document.documentElement.getAttribute("data-theme"); if(t==="dark")return true; if(t==="light")return false; return window.matchMedia("(prefers-color-scheme: dark)").matches; }
function setAppTheme(mode){ if(mode)document.documentElement.setAttribute("data-theme",mode); else document.documentElement.removeAttribute("data-theme"); }

// ==== ЦВЕТОВАЯ МАТЕМАТИКА ====
function hexToRgb(h){ h=h.replace("#",""); if(h.length===3)h=h.split("").map(c=>c+c).join(""); const n=parseInt(h,16); return [(n>>16)&255,(n>>8)&255,n&255]; }
function rgbToHex(r,g,b){ return "#"+[r,g,b].map(x=>Math.round(Math.max(0,Math.min(255,x))).toString(16).padStart(2,"0")).join(""); }
function hsvToRgb(h,s,v){ const f=n=>{ const k=(n+h/60)%6; return v-v*s*Math.max(0,Math.min(k,4-k,1)); }; return [f(5)*255,f(3)*255,f(1)*255]; }
function rgbToHsv(r,g,b){ r/=255;g/=255;b/=255; const mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn; let h=0; if(d){ if(mx===r)h=((g-b)/d)%6; else if(mx===g)h=(b-r)/d+2; else h=(r-g)/d+4; h*=60; if(h<0)h+=360; } return [h,mx?d/mx:0,mx]; }
function luminance(rgb){ const a=rgb.map(v=>{ v/=255; return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4); }); return 0.2126*a[0]+0.7152*a[1]+0.0722*a[2]; }
function contrastFor(rgb){ const light=luminance(rgb)>0.45; return { text: light?"#0f172a":"#f8fafc", muted: light?"rgba(15,23,42,.62)":"rgba(248,250,252,.62)" }; }

// ==== ФОН И ТЕМЫ БЛОКОВ ====
function applyBackground(){
  const rs=document.documentElement.style; let base="#0f172a", img="none";
  document.body.classList.toggle("bg-raw", bgPreset==="color"||bgPreset==="custom");
  if(bgPreset==="color"){ base=bgCustomColor||"#3b82f6"; setAppTheme(luminance(hexToRgb(base))>0.45?"light":"dark"); }
  else if(bgPreset==="custom"&&bgCustom){ img=`url("${bgCustom}")`; setAppTheme(LS.get("kgst_bg_img_light","0")==="1"?"light":"dark"); }
  else { setAppTheme(null); const p=BG_PRESETS[bgPreset]||BG_PRESETS.default; const dark=isDarkNow(); base=dark?"#0f172a":"#f8fafc"; const val=dark?p.dark:p.light; if(val&&val.includes("gradient"))img=val; }
  rs.setProperty("--bg-layer-bg",base); rs.setProperty("--bg-layer-image",img);
  applyCardTheme();
}
function resolveThemeColors(){
  const t=CARD_THEMES[cardTheme];
  if(!t||!t.card){ const dark=isDarkNow(); return { card: dark?"#1e293b":"#ffffff", brk: dark?"#123524":"#e7f6ec" }; }
  return { card:t.card, brk:t.brk };
}
function applyCardTheme(){
  const c=resolveThemeColors(), cr=hexToRgb(c.card), br=hexToRgb(c.brk);
  const ct=contrastFor(cr), bt=contrastFor(br), rs=document.documentElement.style;
  rs.setProperty("--card-rgb",cr.join(",")); rs.setProperty("--break-rgb",br.join(","));
  rs.setProperty("--card-text",ct.text); rs.setProperty("--card-muted",ct.muted); rs.setProperty("--break-text",bt.text);
  LS.set("kgst_card_theme",cardTheme);
  document.querySelectorAll("#themeGrid .theme-option").forEach(el=>el.classList.toggle("active",el.dataset.theme===cardTheme));
}
function applyFontScale(s){ fontScale=String(s); document.documentElement.style.setProperty("--scale",fontScale); LS.set("kgst_font_scale",fontScale); document.querySelectorAll("#fontSizeControl .seg-btn").forEach(b=>b.classList.toggle("active",b.dataset.scale===fontScale)); }
function applyOpacity(v){ cardOpacity=String(v); document.documentElement.style.setProperty("--card-alpha",cardOpacity); LS.set("kgst_card_opacity",cardOpacity); document.querySelectorAll("#opacityControl .seg-btn").forEach(b=>b.classList.toggle("active",b.dataset.opacity===cardOpacity)); }
function updateGreeting(){ const h=new Date().getHours(); dom.greetingText.textContent = h>=5&&h<12?"Доброе утро!":h>=12&&h<18?"Добрый день!":h>=18&&h<23?"Добрый вечер!":"Доброй ночи!"; }

// ==== ГРУППЫ ====
function refreshGroupSelect(){
  const visible=getVisibleGroupNames();
  if(selectedGroup&&!visible.includes(selectedGroup)){ selectedGroup=""; LS.set("kgst_group",""); }
  const courses=[...new Set(visible.map(courseOf))].sort((a,b)=>b-a);
  let html=`<option value="" ${selectedGroup?"":"selected"}>— Выбери группу —</option>`;
  for(const c of courses){
    html+=`<optgroup label="${courseLabel(c)} · набор 20${c}">`+visible.filter(g=>courseOf(g)===c)
      .map(g=>`<option value="${escapeHtml(g)}" ${g===selectedGroup?"selected":""}>${escapeHtml(g)}</option>`).join("")+`</optgroup>`;
  }
  dom.groupSelect.innerHTML=html;
  dom.groupHint.classList.toggle("hidden",!!selectedGroup);
}
dom.groupSelect.onchange=()=>{ selectedGroup=dom.groupSelect.value; LS.set("kgst_group",selectedGroup); dom.groupHint.classList.toggle("hidden",!!selectedGroup); renderSchedule(); updateLive(); };

// ==== РЕНДЕР ====
function renderDays(){
  dom.daysBar.innerHTML="";
  DAYS.forEach((d,idx)=>{ const b=document.createElement("button"); b.className="day-btn"+((idx+1)===selectedDay?" active":""); b.textContent=d; b.onclick=()=>{ selectedDay=idx+1; renderDays(); renderSchedule(); }; dom.daysBar.appendChild(b); });
}
function updateWeekBanner(){
  const top=isTopWeek();
  dom.weekBanner.classList.toggle("bottom-week",!top);
  dom.weekIcon.textContent=top?"🔼":"🔽"; dom.weekLabel.textContent=top?"Верхняя":"Нижняя";
  dom.weekModePill.textContent=weekMode==="auto"?"Авто":"Вручную";
}
dom.weekBanner.onclick=()=>{ weekMode=weekMode==="auto"?"top":weekMode==="top"?"bot":"auto"; LS.set("kgst_week_mode",weekMode); renderSchedule(); };

let cachedCards=[];
function renderSchedule(){
  updateWeekBanner(); dom.scheduleList.innerHTML=""; cachedCards=[];
  if(!selectedGroup){
    dom.scheduleList.innerHTML=`<div class="card empty-state" style="cursor:default;"><span class="arrow">⬆️</span><div class="subject">Выбери свою группу</div><div class="teacher" style="margin:8px 0 0;">Селектор вверху по центру — там все группы по курсам.</div></div>`;
    return;
  }
  if(mqDesktop.matches&&viewMode==="course") renderCourseGrid(); else renderGroupCards();
}
function renderGroupCards(){
  const top=isTopWeek(), bells=selectedDay===1?BELLS.monday:BELLS.regular;
  const dayData=getSchedule(selectedGroup)[selectedDay]||[];
  if(!dayData.length){ dom.scheduleList.innerHTML=`<div class="card" style="text-align:center;cursor:default;"><div class="subject" style="margin:0;">В этот день пар нет</div></div>`; return; }
  dayData.forEach((item,index)=>{
    const [pairNum,subjRaw,teacher,room]=item;
    const bell=bells.find(b=>b.num===pairNum);
    const timeText=bell?`${bell.start} – ${bell.end}`:"—";
    const subject=typeof subjRaw==="object"?(top?subjRaw.top:subjRaw.bot):subjRaw;
    const noteKey=`note_${selectedGroup}_${selectedDay}_${pairNum}`, savedNote=LS.get(noteKey,"");
    const card=document.createElement("div"); card.className="card"; card.style.setProperty("--delay",(index*0.05)+"s");
    card.innerHTML=`<div class="card-top"><span>${pairNum===0?"Классный час":pairNum+" пара"} • ${timeText}<span class="live-pill" style="display:none;"><span class="live-dot"></span>Сейчас</span></span>${room?`<span class="room-badge">Каб. ${escapeHtml(room)}</span>`:""}</div><div class="subject"></div><div class="teacher" style="${teacher?"":"height:6px;margin:0;"}"></div><div class="note-box ${savedNote?"has-note":""}"><span>${savedNote?"📝":"✏️"}</span><span class="note-text"></span></div>`;
    card.querySelector(".subject").textContent=subject||"(без названия)";
    if(teacher)card.querySelector(".teacher").textContent=teacher;
    card.querySelector(".note-text").textContent=savedNote||"Добавить запись";
    card.onclick=()=>openNoteModal(noteKey,subject,pairNum===0?"Классный час":`${pairNum} пара`,savedNote);
    dom.scheduleList.appendChild(card);
    cachedCards.push({ el:card, pill:card.querySelector(".live-pill"), pair:pairNum, isCurrent:false });
    if(index<dayData.length-1){
      const nb=bells.find(b=>b.num===dayData[index+1][0]);
      if(bell&&nb){ const mins=Math.round((toSec(nb.start)-toSec(bell.end))/60);
        if(mins>0){ const brk=document.createElement("div"); brk.className="break-card"; brk.style.setProperty("--delay",(index*0.05+0.05)+"s"); brk.innerHTML=`<span>☕ Перемена (${mins} мин)</span><span>${bell.end} – ${nb.start}</span>`; dom.scheduleList.appendChild(brk); } }
    }
  });
}
function renderCourseGrid(){
  const course=courseOf(selectedGroup);
  const groups=getVisibleGroupNames().filter(g=>courseOf(g)===course);
  const bells=selectedDay===1?BELLS.monday:BELLS.regular;
  const used=new Set(); groups.forEach(g=>(getSchedule(g)[selectedDay]||[]).forEach(it=>used.add(it[0])));
  const rows=bells.filter(b=>used.has(b.num));
  if(!rows.length){ dom.scheduleList.innerHTML=`<div class="card" style="text-align:center;cursor:default;"><div class="subject" style="margin:0;">В этот день пар нет</div></div>`; return; }
  const wrap=document.createElement("div"); wrap.className="course-grid"; wrap.style.setProperty("--cols",groups.length);
  wrap.innerHTML=`<div></div>`+groups.map(g=>`<div class="cg-head ${g===selectedGroup?"sel":""}">${escapeHtml(g)}</div>`).join("");
  const top=isTopWeek();
  rows.forEach(b=>{
    const t=document.createElement("div"); t.className="cg-time"; t.innerHTML=`<span>${b.name}</span><span>${b.start}<br>${b.end}</span>`; wrap.appendChild(t);
    groups.forEach(g=>{
      const item=(getSchedule(g)[selectedDay]||[]).find(it=>it[0]===b.num);
      const cell=document.createElement("div");
      if(!item){ cell.className="cg-cell empty"; cell.textContent="—"; }
      else{
        const [,subjRaw,teacher,room]=item;
        const subject=typeof subjRaw==="object"?(top?subjRaw.top:subjRaw.bot):subjRaw;
        const noteKey=`note_${g}_${selectedDay}_${b.num}`, note=LS.get(noteKey,"");
        cell.className="cg-cell";
        cell.innerHTML=`<div class="s"></div>${teacher?'<div class="t"></div>':""}${room?'<span class="r"></span>':""}${note?'<div class="n">📝 есть запись</div>':""}`;
        cell.querySelector(".s").textContent=subject||"(без названия)";
        if(teacher)cell.querySelector(".t").textContent=teacher;
        if(room)cell.querySelector(".r").textContent="Каб. "+room;
        cell.onclick=()=>openNoteModal(noteKey,subject,b.name,note);
        cachedCards.push({ el:cell, pill:null, pair:b.num, isCurrent:false });
      }
      wrap.appendChild(cell);
    });
  });
  dom.scheduleList.appendChild(wrap);
}
function syncViewToggle(){ document.querySelectorAll("#viewToggle .seg-btn").forEach(b=>b.classList.toggle("active",b.dataset.view===viewMode)); }
document.querySelectorAll("#viewToggle .seg-btn").forEach(b=>b.onclick=()=>{ viewMode=b.dataset.view; LS.set("kgst_view",viewMode); syncViewToggle(); renderSchedule(); });
mqDesktop.addEventListener("change",renderSchedule);

// ==== ТАЙМЕР ====
function getActiveBells(group,day){ const dd=getSchedule(group)[day]||[]; if(!dd.length)return []; const nums=new Set(dd.map(x=>x[0])); return (day===1?BELLS.monday:BELLS.regular).filter(b=>nums.has(b.num)); }
let lastState="";
function updateLive(){
  if(document.hidden)return;
  const now=new Date(), today=now.getDay();
  const secNow=now.getHours()*3600+now.getMinutes()*60+now.getSeconds();
  const clock=now.toLocaleTimeString("ru-RU",{hour:"2-digit",minute:"2-digit"});
  updateGreeting();
  if(!selectedGroup){ updateUI("Выбери группу",clock,"rest"); return; }
  if(today===0){ updateUI("Воскресенье",clock,"rest"); return; }
  const bells=getActiveBells(selectedGroup,today);
  if(!bells.length){ updateUI("Пар нет",clock,"rest"); return; }
  let activePairNum=null, stateText="Отдых", statusType="rest", diffSec=0;
  for(let i=0;i<bells.length;i++){
    const start=toSec(bells[i].start), end=toSec(bells[i].end);
    if(secNow<start){ stateText=i===0?`Ждём ${bells[i].name}`:"Перемена"; statusType=i===0?"rest":"break"; diffSec=start-secNow; break; }
    else if(secNow<=end){ activePairNum=bells[i].num; stateText="Идёт пара"; statusType="lecture"; diffSec=end-secNow; break; }
  }
  if(activePairNum===null&&diffSec===0&&secNow>toSec(bells[bells.length-1].end)){ updateUI("Пары закончились",clock,"rest"); }
  else{
    let timerStr="00:00";
    if(diffSec>0){ const h=Math.floor(diffSec/3600),m=Math.floor((diffSec%3600)/60),s=diffSec%60; timerStr=(h>0?h+":":"")+String(m).padStart(2,"0")+":"+String(s).padStart(2,"0"); }
    updateUI(stateText,timerStr,statusType);
  }
  const isToday=selectedDay===today;
  for(const c of cachedCards){
    const cur=isToday&&c.pair===activePairNum;
    if(c.isCurrent!==cur){ c.isCurrent=cur; c.el.classList.toggle("current",cur); if(c.pill)c.pill.style.display=cur?"inline-flex":"none"; }
  }
}
function updateUI(stateText,timerStr,statusType){
  const key=stateText+timerStr+statusType; if(lastState===key)return; lastState=key;
  dom.liveStatus.textContent=stateText; dom.headerTime.textContent=timerStr;
  const d=document.getElementById("dashTimeBtn"); if(d)d.textContent=timerStr;
  const rs=document.documentElement.style;
  const colors=statusType==="lecture"?["#8b5cf6","#ec4899"]:statusType==="break"?["#10b981","#06b6d4"]:["#f59e0b","#ef4444"];
  rs.setProperty("--status-color-1",colors[0]); rs.setProperty("--status-color-2",colors[1]);
}

// ==== МОДАЛКИ ====
function openAnimatedDialog(d){ if(d.open)return; d.showModal(); requestAnimationFrame(()=>d.classList.add("is-open")); }
function closeAnimatedDialog(d){ if(!d.open)return; d.classList.remove("is-open"); setTimeout(()=>d.close(),210); }
document.getElementById("openDashboardBtn").onclick=()=>{ renderHomework(); renderGrades(); openAnimatedDialog(dom.dashboardModal); };
document.getElementById("openDashboardBtn2").onclick=()=>{ renderHomework(); renderGrades(); openAnimatedDialog(dom.dashboardModal); };
document.getElementById("closeDashboardBtn").onclick=()=>closeAnimatedDialog(dom.dashboardModal);
dom.dashboardModal.onclick=e=>{ if(e.target===dom.dashboardModal)closeAnimatedDialog(dom.dashboardModal); };
document.querySelectorAll(".dash-tab").forEach(tab=>tab.onclick=()=>{ document.querySelectorAll(".dash-tab").forEach(t=>t.classList.remove("active")); document.querySelectorAll(".dash-content").forEach(c=>c.classList.remove("active")); tab.classList.add("active"); document.getElementById(tab.dataset.tab).classList.add("active"); });
function renderHomework(){
  const c=document.getElementById("hwList"); c.innerHTML=""; let has=false;
  for(let i=0;i<localStorage.length;i++){
    const key=localStorage.key(i);
    if(key.startsWith("note_")){ has=true; const p=key.split("_"); const text=localStorage.getItem(key);
      const el=document.createElement("div"); el.className="hw-item";
      el.innerHTML=`<div class="hw-item-title">${escapeHtml(p[1])} • ${DAYS[parseInt(p[2])-1]||""} • ${PAIR_NAMES[parseInt(p[3])]||""}</div><div>${escapeHtml(text)}</div>`;
      c.appendChild(el); }
  }
  if(!has)c.innerHTML=`<div style="text-align:center;color:var(--muted);font-size:14px;padding:20px;">Нет заметок.</div>`;
}
document.getElementById("addGradeBtn").onclick=()=>{
  const subj=document.getElementById("gradeSubject").value.trim(), val=parseInt(document.getElementById("gradeValue").value), note=document.getElementById("gradeNote").value.trim();
  if(!subj||isNaN(val)||val<2||val>5)return alert("Введите предмет и оценку (2-5).");
  gradesData.push({ id:Date.now(), subject:subj, value:val, note:note }); LS.setJson("kgst_grades",gradesData);
  document.getElementById("gradeSubject").value=""; document.getElementById("gradeValue").value=""; document.getElementById("gradeNote").value="";
  renderGrades();
};
function renderGrades(){
  const list=document.getElementById("gradesList"); list.innerHTML="";
  if(!gradesData.length){ list.innerHTML=`<div style="text-align:center;color:var(--muted);font-size:14px;">Оценок пока нет.</div>`; document.getElementById("gpaValue").textContent="0.00"; return; }
  let sum=0; gradesData.sort((a,b)=>b.id-a.id);
  gradesData.forEach(g=>{ sum+=g.value; const el=document.createElement("div"); el.className="grade-item";
    el.innerHTML=`<div class="grade-val g${g.value}">${g.value}</div><div class="grade-info"><div class="grade-subj">${escapeHtml(g.subject)}</div>${g.note?`<div class="grade-note">${escapeHtml(g.note)}</div>`:""}</div><button class="btn btn-danger" style="padding:6px 10px;font-size:12px;border-radius:10px;" onclick="deleteGrade(${g.id})">✕</button>`;
    list.appendChild(el); });
  document.getElementById("gpaValue").textContent=(sum/gradesData.length).toFixed(2);
}
window.deleteGrade=id=>{ gradesData=gradesData.filter(g=>g.id!==id); LS.setJson("kgst_grades",gradesData); renderGrades(); };
function openNoteModal(key,title,subtitle,text){
  currentNoteKey=key;
  document.getElementById("modalTitle").textContent=title||"Заметка";
  document.getElementById("modalSub").textContent=`${key.split("_")[1]} • ${subtitle}`;
  document.getElementById("noteInput").value=text||"";
  document.getElementById("deleteNote").style.display=text?"block":"none";
  openAnimatedDialog(dom.noteModal);
}
document.getElementById("closeModal").onclick=()=>closeAnimatedDialog(dom.noteModal);
dom.noteModal.onclick=e=>{ if(e.target===dom.noteModal)closeAnimatedDialog(dom.noteModal); };
document.getElementById("saveNote").onclick=()=>{ const v=document.getElementById("noteInput").value.trim(); if(v)LS.set(currentNoteKey,v); else LS.del(currentNoteKey); closeAnimatedDialog(dom.noteModal); renderSchedule(); };
document.getElementById("deleteNote").onclick=()=>{ LS.del(currentNoteKey); closeAnimatedDialog(dom.noteModal); renderSchedule(); };

// ==== НАСТРОЙКИ: ФОН ====
function renderBackgroundGrid(){
  const grid=document.getElementById("bgGrid"); grid.innerHTML=""; const dark=isDarkNow();
  Object.entries(BG_PRESETS).forEach(([key,p])=>{
    const el=document.createElement("div"); el.className="bg-option"+(bgPreset===key?" active":"");
    const val=dark?p.dark:p.light;
    if(val.includes("gradient"))el.style.backgroundImage=val; else el.style.backgroundColor=val;
    el.textContent=p.name;
    el.onclick=()=>{ bgPreset=key; LS.set("kgst_bg_preset",key); applyBackground(); renderBackgroundGrid(); };
    grid.appendChild(el);
  });
}
document.getElementById("resetBgBtn").onclick=()=>{ bgPreset="default"; LS.set("kgst_bg_preset","default"); applyBackground(); renderBackgroundGrid(); };
document.getElementById("bgFile").onchange=e=>{
  const f=e.target.files[0]; if(!f)return;
  const rd=new FileReader();
  rd.onload=()=>{ const img=new Image();
    img.onload=()=>{
      const max=1600, k=Math.min(1,max/Math.max(img.width,img.height));
      const w=Math.round(img.width*k), h=Math.round(img.height*k);
      const cv=document.createElement("canvas"); cv.width=w; cv.height=h;
      cv.getContext("2d").drawImage(img,0,0,w,h);
      const url=cv.toDataURL("image/jpeg",0.82);
      let light=false;
      try{ const s=document.createElement("canvas"); s.width=1; s.height=1; const sc=s.getContext("2d"); sc.drawImage(cv,0,0,1,1); const d=sc.getImageData(0,0,1,1).data; light=luminance([d[0],d[1],d[2]])>0.45; }catch{}
      try{ localStorage.setItem("kgst_bg_custom",url); }catch{ alert("Картинка слишком большая для хранилища. Попробуй другую."); return; }
      bgCustom=url; LS.set("kgst_bg_img_light",light?"1":"0"); bgPreset="custom"; LS.set("kgst_bg_preset","custom");
      applyBackground(); renderBackgroundGrid();
    };
    img.src=rd.result;
  };
  rd.readAsDataURL(f); e.target.value="";
};

// ==== НАСТРОЙКИ: ПИКЕР ЦВЕТА (как в Paint) ====
let pickH=210, pickS=0.7, pickV=0.9;
(function initPick(){ try{ const [h,s,v]=rgbToHsv(...hexToRgb(bgCustomColor)); pickH=h; pickS=s; pickV=v; }catch{} })();
function pickerHex(){ return rgbToHex(...hsvToRgb(pickH,pickS,pickV)); }
function renderPicker(){
  const pad=document.getElementById("svPad"); if(!pad)return;
  pad.style.setProperty("--hue-color",rgbToHex(...hsvToRgb(pickH,1,1)));
  document.getElementById("svCursor").style.left=(pickS*100)+"%";
  document.getElementById("svCursor").style.top=((1-pickV)*100)+"%";
  document.getElementById("hueThumb").style.left=(pickH/360*100)+"%";
  const hex=pickerHex();
  document.getElementById("colorPreview").style.background=hex;
  const hi=document.getElementById("hexInput"); if(document.activeElement!==hi)hi.value=hex;
}
function liveColor(){ bgCustomColor=pickerHex(); bgPreset="color"; applyBackground(); }
function commitColor(){ bgCustomColor=pickerHex(); bgPreset="color"; LS.set("kgst_bg_custom_color",bgCustomColor); LS.set("kgst_bg_preset","color"); applyBackground(); renderBackgroundGrid(); }
function bindDrag(el,onMove){
  const handle=e=>{ const r=el.getBoundingClientRect(); onMove(Math.min(Math.max((e.clientX-r.left)/r.width,0),1), Math.min(Math.max((e.clientY-r.top)/r.height,0),1)); };
  el.addEventListener("pointerdown",e=>{
    el.setPointerCapture(e.pointerId); handle(e);
    const mv=ev=>handle(ev);
    const up=()=>{ el.removeEventListener("pointermove",mv); el.removeEventListener("pointerup",up); el.removeEventListener("pointercancel",up); commitColor(); };
    el.addEventListener("pointermove",mv); el.addEventListener("pointerup",up); el.addEventListener("pointercancel",up);
  });
}
bindDrag(document.getElementById("svPad"),(x,y)=>{ pickS=x; pickV=1-y; renderPicker(); liveColor(); });
bindDrag(document.getElementById("hueSlider"),x=>{ pickH=x*360; renderPicker(); liveColor(); });
document.getElementById("applyColorBtn").onclick=commitColor;
document.getElementById("hexInput").onchange=e=>{
  let v=e.target.value.trim(); if(!v.startsWith("#"))v="#"+v;
  if(/^#[0-9a-fA-F]{6}$/.test(v)){ const [h,s,vv]=rgbToHsv(...hexToRgb(v)); pickH=h; pickS=s; pickV=vv; renderPicker(); commitColor(); }
  else renderPicker();
};

// ==== НАСТРОЙКИ: ТЕМЫ БЛОКОВ ====
function renderThemeGrid(){
  const grid=document.getElementById("themeGrid"); grid.innerHTML="";
  Object.entries(CARD_THEMES).forEach(([key,t])=>{
    const c=key==="auto"?resolveThemeColors():{card:t.card,brk:t.brk};
    const ct=contrastFor(hexToRgb(c.card));
    const el=document.createElement("div"); el.className="theme-option"+(cardTheme===key?" active":""); el.dataset.theme=key;
    el.style.background=c.card; el.style.color=ct.text;
    el.innerHTML=`<span>${t.name}</span><span class="brk" style="background:${c.brk}"></span>`;
    el.onclick=()=>{ cardTheme=key; applyCardTheme(); renderThemeGrid(); };
    grid.appendChild(el);
  });
}

// ==== УСТАНОВКА PWA ====
let deferredPrompt=null;
window.addEventListener("beforeinstallprompt",e=>{ e.preventDefault(); deferredPrompt=e; updateInstallUI(); });
window.addEventListener("appinstalled",()=>{ deferredPrompt=null; updateInstallUI(); });
function isStandalone(){ return window.matchMedia("(display-mode: standalone)").matches||navigator.standalone===true; }
function isIOS(){ return /iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1); }
function updateInstallUI(){
  const b=document.getElementById("installBtn"), h=document.getElementById("installHint"); if(!b)return;
  if(isStandalone()){ b.textContent="✅ Приложение установлено"; b.disabled=true; h.textContent=""; }
  else if(isIOS()){ b.textContent="📲 Как установить на iPhone"; b.disabled=false; h.textContent="Safari: «Поделиться» → «На экран “Домой”»."; }
  else if(deferredPrompt){ b.textContent="📲 Установить на телефон"; b.disabled=false; h.textContent=""; }
  else { b.textContent="📲 Установить приложение"; b.disabled=false; h.textContent="Если кнопка не срабатывает: меню браузера → «Установить приложение» / «Добавить на главный экран»."; }
}
document.getElementById("installBtn").onclick=async()=>{
  if(deferredPrompt){ deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt=null; updateInstallUI(); }
  else if(isIOS())alert('В Safari: нажмите «Поделиться» (квадрат со стрелкой вверх) → «На экран “Домой”».');
  else alert('Откройте меню браузера (⋮) и выберите «Установить приложение» или «Добавить на главный экран».');
};

// ==== ОТКРЫТИЕ НАСТРОЕК ====
document.getElementById("openSettingsBtn").onclick=()=>{ renderBackgroundGrid(); renderThemeGrid(); renderPicker(); applyFontScale(fontScale); applyOpacity(cardOpacity); updateInstallUI(); openAnimatedDialog(dom.settingsModal); };
document.getElementById("closeSettingsBtn").onclick=()=>closeAnimatedDialog(dom.settingsModal);
dom.settingsModal.onclick=e=>{ if(e.target===dom.settingsModal)closeAnimatedDialog(dom.settingsModal); };
document.querySelectorAll("#fontSizeControl .seg-btn").forEach(b=>b.onclick=()=>applyFontScale(b.dataset.scale));
document.querySelectorAll("#opacityControl .seg-btn").forEach(b=>b.onclick=()=>applyOpacity(b.dataset.opacity));

// ==== ЗАПУСК ====
function hideSplash(){ const s=document.getElementById("splash"); if(s){ s.classList.add("hidden"); setTimeout(()=>s.remove(),700); } document.getElementById("app").classList.add("loaded"); }
try{
  applyBackground(); applyFontScale(fontScale); applyOpacity(cardOpacity);
  updateGreeting(); refreshGroupSelect(); renderDays(); syncViewToggle(); renderSchedule(); updateLive();
  setInterval(updateLive,1000);
  hideSplash();
}catch(err){
  console.error(err); hideSplash();
  dom.scheduleList.innerHTML=`<div class="card" style="border-color:red"><div class="subject" style="color:red">Ошибка кода</div><div class="teacher">${escapeHtml(err.message)}</div></div>`;
}
document.addEventListener("visibilitychange",()=>{ if(!document.hidden)updateLive(); });
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>{ applyBackground(); });