const APP_VERSION = 26; window.__APP_V = APP_VERSION;
const $ = id => document.getElementById(id);
const on = (id, ev, fn) => { const el = $(id); if (el) el.addEventListener(ev, fn); };
const qa = s => document.querySelectorAll(s);
const buzz = ms => { try { navigator.vibrate && navigator.vibrate(ms); } catch {} };
const isSplit = x => !!x && typeof x === "object" && Array.isArray(x.split);

const BG_PRESETS = { default:{name:"Тёмный",light:"#f8fafc",dark:"#0f172a"}, aurora:{name:"Аврора",light:"linear-gradient(135deg,#a8edea,#fed6e3)",dark:"linear-gradient(135deg,#1a2980,#26d0ce)"}, ocean:{name:"Океан",light:"linear-gradient(135deg,#89f7fe,#66a6ff)",dark:"linear-gradient(135deg,#0f2027,#2c5364)"}, sunset:{name:"Закат",light:"linear-gradient(135deg,#ffecd2,#fcb69f)",dark:"linear-gradient(135deg,#3a1c71,#d76d77)"}, forest:{name:"Лес",light:"linear-gradient(135deg,#d4fc79,#96e6a1)",dark:"linear-gradient(135deg,#134e5e,#71b280)"}, midnight:{name:"Ночь",light:"linear-gradient(135deg,#667eea,#764ba2)",dark:"linear-gradient(135deg,#0f0c29,#302b63,#24243e)"} };
const CARD_THEMES = {
  auto:{name:"Авто",accent:"#a78bfa"},
  slate:{name:"Графит",card:"#1e293b",brk:"#14532d",accent:"#a78bfa"},
  white:{name:"Белый",card:"#ffffff",brk:"#e7f6ec",accent:"#7c3aed"},
  black:{name:"Чёрный",card:"#0b0b0f",brk:"#161616",accent:"#e879f9"},
  violet:{name:"Фиолет",card:"#4c1d95",brk:"#312e81",accent:"#f0abfc"},
  ocean:{name:"Океан",card:"#0c4a6e",brk:"#134e4a",accent:"#22d3ee"},
  sunset:{name:"Закат",card:"#7c2d12",brk:"#713f12",accent:"#fbbf24"},
  forest:{name:"Лес",card:"#14532d",brk:"#1f3d2b",accent:"#4ade80"},
  rose:{name:"Роза",card:"#fecdd3",brk:"#fbcfe8",accent:"#e11d48"},
  sand:{name:"Песок",card:"#fef3c7",brk:"#fde68a",accent:"#b45309"}
};
const DAYS = ["Пн","Вт","Ср","Чт","Пт","Сб"];
const PAIR_NAMES = {0:"Кл. час",1:"1 пара",2:"2 пара",3:"3 пара",4:"4 пара",5:"5 пара",6:"6 пара"};
const WEEK_ANCHOR = new Date(2026,8,7);

const LS = { get(k,d){try{const v=localStorage.getItem(k);return v===null?d:v;}catch{return d;}}, set(k,v){try{localStorage.setItem(k,v);}catch{}}, del(k){try{localStorage.removeItem(k);}catch{}}, json(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch{return d;}}, setJson(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch{}} };
let customGroups=LS.json("kgst_custom_groups",[]), hiddenGroups=LS.json("kgst_hidden_groups",[]), userSchedule=LS.json("kgst_schedule_custom",{}), gradesData=LS.json("kgst_grades",[]);
(function sanitize(){ let bad=false; for(const g of Object.keys(userSchedule)){ const days=userSchedule[g]; if(!days||typeof days!=="object"){ delete userSchedule[g]; bad=true; continue; } for(const d of Object.keys(days)){ const arr=days[d]; if(!Array.isArray(arr)){ delete days[d]; bad=true; continue; } days[d]=arr.filter(it=>Array.isArray(it)&&typeof it[0]==="number").map(it=>{ let s=it[1]; if(s&&typeof s==="object"&&!isSplit(s)) s=String(s.s||""); return [it[0], s, it[2]||"", it[3]||"", it[4]]; }); } } if(bad) LS.setJson("kgst_schedule_custom",userSchedule); })();
let selectedGroup=LS.get("kgst_group",""), selectedDay=Math.min(Math.max(new Date().getDay(),1),6), weekMode=LS.get("kgst_week_mode","auto"), fontScale=LS.get("kgst_font_scale","1"), cardOpacity=LS.get("kgst_card_opacity","1"), bgPreset=LS.get("kgst_bg_preset","default"), bgCustom=LS.get("kgst_bg_custom",""), bgCustomColor=LS.get("kgst_bg_custom_color","#3b82f6"), cardTheme=LS.get("kgst_card_theme","auto"), viewMode=LS.get("kgst_view","course"), fxMode=LS.get("kgst_fx","auto"), currentNoteKey="", hwQuery="";
const mqDesktop = window.matchMedia("(min-width: 900px)");
const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");

function weakDevice(){ return (navigator.deviceMemory && navigator.deviceMemory<=4) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency<=4); }
function applyFx(){ const lite = fxMode==="lite" || (fxMode==="auto" && weakDevice()); document.body.classList.toggle("fx-lite", lite); qa("#fxControl .seg-btn").forEach(b=>b.classList.toggle("active", b.dataset.fx===fxMode)); LS.set("kgst_fx",fxMode); }
qa("#fxControl .seg-btn").forEach(b=>b.onclick=()=>{ fxMode=b.dataset.fx; applyFx(); });

function getAllGroupNames(){ return [...Object.keys(DEFAULT_SCHEDULE), ...customGroups]; }
function getVisibleGroupNames(){ const all=getAllGroupNames(), v=all.filter(g=>!hiddenGroups.includes(g)); return v.length?v:[all[0]]; }
function getSchedule(g){ return userSchedule[g]?{...(DEFAULT_SCHEDULE[g]||{}),...userSchedule[g]}:(DEFAULT_SCHEDULE[g]||{}); }
function toSec(t){ const[h,m]=t.split(":").map(Number); return h*3600+m*60; }
function escapeHtml(s){ return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
function courseOf(g){ const m=String(g).match(/(\d{2})$/); return m?m[1]:"??"; }
function courseLabel(c){ const n=new Date(), ay=n.getMonth()>=8?n.getFullYear():n.getFullYear()-1, k=Math.min(4,Math.max(1,ay-(2000+parseInt(c))+1)); return k+" курс"; }
function weekParity(){ const now=new Date(), mon=new Date(now); mon.setDate(now.getDate()-((now.getDay()+6)%7)); mon.setHours(0,0,0,0); const a=new Date(WEEK_ANCHOR); a.setHours(0,0,0,0); return Math.round((mon-a)/604800000)%2===0; }
function isTopWeek(){ if(weekMode==="top")return true; if(weekMode==="bot")return false; return weekParity(); }
function isDarkNow(){ const t=document.documentElement.getAttribute("data-theme"); if(t==="dark")return true; if(t==="light")return false; return window.matchMedia("(prefers-color-scheme: dark)").matches; }
function setAppTheme(m){ if(m)document.documentElement.setAttribute("data-theme",m); else document.documentElement.removeAttribute("data-theme"); }
function hexToRgb(h){ h=h.replace("#",""); if(h.length===3)h=h.split("").map(c=>c+c).join(""); const n=parseInt(h,16); return [(n>>16)&255,(n>>8)&255,n&255]; }
function rgbToHex(r,g,b){ return "#"+[r,g,b].map(x=>Math.round(Math.max(0,Math.min(255,x))).toString(16).padStart(2,"0")).join(""); }
function hsvToRgb(h,s,v){ const f=n=>{const k=(n+h/60)%6;return v-v*s*Math.max(0,Math.min(k,4-k,1));}; return [f(5)*255,f(3)*255,f(1)*255]; }
function rgbToHsv(r,g,b){ r/=255;g/=255;b/=255; const mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn; let h=0; if(d){ if(mx===r)h=((g-b)/d)%6; else if(mx===g)h=(b-r)/d+2; else h=(r-g)/d+4; h*=60; if(h<0)h+=360; } return [h,mx?d/mx:0,mx]; }
function luminance(rgb){ const a=rgb.map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4);}); return .2126*a[0]+.7152*a[1]+.0722*a[2]; }
function contrastFor(rgb){ const l=luminance(rgb)>.45; return {text:l?"#0f172a":"#f8fafc",muted:l?"rgba(15,23,42,.62)":"rgba(248,250,252,.62)"}; }
function subjText(x){ return isSplit(x)?x.split.map(g=>g.s).join(" / "):(typeof x==="string"?x:""); }

function applyBackground(){ const rs=document.documentElement.style; let base="#0f172a", img="none"; document.body.classList.toggle("bg-raw", bgPreset==="color"||bgPreset==="custom");
  if(bgPreset==="color"){ base=bgCustomColor||"#3b82f6"; setAppTheme(luminance(hexToRgb(base))>.45?"light":"dark"); }
  else if(bgPreset==="custom"&&bgCustom){ img=`url("${bgCustom}")`; setAppTheme(LS.get("kgst_bg_img_light","0")==="1"?"light":"dark"); }
  else { setAppTheme(null); const p=BG_PRESETS[bgPreset]||BG_PRESETS.default, dark=isDarkNow(); base=dark?"#0f172a":"#f8fafc"; const val=dark?p.dark:p.light; if(val&&val.includes("gradient"))img=val; }
  rs.setProperty("--bg-layer-bg",base); rs.setProperty("--bg-layer-image",img); applyCardTheme(); }
function resolveThemeColors(){ const t=CARD_THEMES[cardTheme]; if(!t||!t.card){ const d=isDarkNow(); return {card:d?"#1e293b":"#ffffff",brk:d?"#123524":"#e7f6ec",accent:t?t.accent:"#a78bfa"}; } return {card:t.card,brk:t.brk,accent:t.accent}; }
function applyCardTheme(){ const c=resolveThemeColors(), cr=hexToRgb(c.card), br=hexToRgb(c.brk), ct=contrastFor(cr), bt=contrastFor(br), at=contrastFor(hexToRgb(c.accent)), rs=document.documentElement.style;
  rs.setProperty("--card-rgb",cr.join(",")); rs.setProperty("--break-rgb",br.join(","));
  rs.setProperty("--card-text",ct.text); rs.setProperty("--card-muted",ct.muted); rs.setProperty("--break-text",bt.text);
  rs.setProperty("--theme-accent",c.accent); rs.setProperty("--theme-accent-text",at.text); rs.setProperty("--theme-accent-soft",c.accent+"2e"); rs.setProperty("--theme-accent-fill",c.accent+"42");
  LS.set("kgst_card_theme",cardTheme);
  qa("#themeGrid .theme-option").forEach(el=>el.classList.toggle("active",el.dataset.theme===cardTheme)); }
function applyFontScale(s){ fontScale=String(Math.min(1.4,Math.max(.8,parseFloat(s)||1))); const px=16*parseFloat(fontScale);
  document.documentElement.style.fontSize=px+"px"; document.documentElement.style.setProperty("--scale",fontScale); LS.set("kgst_font_scale",fontScale);
  const r=$("fontRange"), v=$("fontValue"); if(r)r.value=fontScale; if(v)v.textContent=Math.round(parseFloat(fontScale)*100)+"%"; }
function applyOpacity(v){ cardOpacity=String(v); document.documentElement.style.setProperty("--card-alpha",cardOpacity); LS.set("kgst_card_opacity",cardOpacity); qa("#opacityControl .seg-btn").forEach(b=>b.classList.toggle("active",b.dataset.opacity===cardOpacity)); }
function updateGreeting(){ const h=new Date().getHours(), el=$("greetingText"); if(el)el.textContent=h>=5&&h<12?"Доброе утро!":h>=12&&h<18?"Добрый день!":h>=18&&h<23?"Добрый вечер!":"Доброй ночи!"; }

let toastTimer=null, toastUndoFn=null;
function showToast(msg, undoFn){ const t=$("toast"), m=$("toastMsg"), u=$("toastUndo"); if(!t)return; m.textContent=msg; toastUndoFn=undoFn||null; u.hidden=!undoFn; t.classList.add("show"); clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.classList.remove("show"),4000); }
on("toastUndo","click",()=>{ if(toastUndoFn)toastUndoFn(); toastUndoFn=null; $("toast").classList.remove("show"); });

function refreshGroupSelect(){ const sel=$("groupSelect"); if(!sel)return; const visible=getVisibleGroupNames();
  if(selectedGroup&&!visible.includes(selectedGroup)){ selectedGroup=""; LS.set("kgst_group",""); }
  const courses=[...new Set(visible.map(courseOf))].sort((a,b)=>b-a);
  let html=`<option value="" ${selectedGroup?"":"selected"}>— Выбери группу —</option>`;
  for(const c of courses){ html+=`<optgroup label="${courseLabel(c)} · набор 20${c}">`+visible.filter(g=>courseOf(g)===c).map(g=>`<option value="${escapeHtml(g)}" ${g===selectedGroup?"selected":""}>${escapeHtml(g)}</option>`).join("")+`</optgroup>`; }
  sel.innerHTML=html; const hint=$("groupHint"); if(hint)hint.classList.toggle("hidden",!!selectedGroup); }
on("groupSelect","change",e=>{ selectedGroup=e.target.value; LS.set("kgst_group",selectedGroup); const h=$("groupHint"); if(h)h.classList.toggle("hidden",!!selectedGroup); renderSchedule(); });

function renderDays(){ const bar=$("daysBar"); if(!bar)return; bar.innerHTML=""; DAYS.forEach((d,i)=>{ const b=document.createElement("button"); b.className="day-btn"+((i+1)===selectedDay?" active":""); b.textContent=d; b.onclick=()=>{ selectedDay=i+1; renderDays(); renderSchedule(); }; bar.appendChild(b); }); }
function updateWeekBanner(){ const top=isTopWeek(), wb=$("weekBanner"); if(wb)wb.classList.toggle("bottom-week",!top); const wi=$("weekIcon"),wl=$("weekLabel"),wp=$("weekModePill"); if(wi)wi.textContent=top?"🔼":""; if(wl)wl.textContent=top?"Верхняя":"Нижняя"; if(wp)wp.textContent=weekMode==="auto"?"Авто":(weekMode==="top"?"Верхняя":"Нижняя"); }
function cycleWeek(){ weekMode=weekMode==="auto"?"top":weekMode==="top"?"bot":"auto"; LS.set("kgst_week_mode",weekMode); renderSchedule(); }
on("weekBanner","click",cycleWeek);
on("weekBanner","keydown",e=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); cycleWeek(); } });

function fillSubject(el, subject, teacher, room){
  if(isSplit(subject)){
    el.innerHTML = subject.split.map((g,i)=>`<div class="sub-row"><span class="sub-tag">${i+1} подгр.</span><div class="sub-body"><div class="sub-name"></div><div class="sub-meta"></div></div></div>`).join("");
    el.querySelectorAll(".sub-row").forEach((row,i)=>{ const g=subject.split[i]; row.querySelector(".sub-name").textContent=g.s||"(без названия)"; row.querySelector(".sub-meta").textContent=[g.t,g.r?("каб. "+g.r):""].filter(Boolean).join(" · "); });
  } else {
    el.innerHTML = `<div class="subject"></div><div class="teacher" style="${teacher?"":"height:6px;margin:0;"}"></div>`;
    el.querySelector(".subject").textContent=(typeof subject==="string"&&subject)||"(без названия)";
    if(teacher)el.querySelector(".teacher").textContent=teacher;
  }
}

let cachedCards=[];
function renderSchedule(){ updateWeekBanner(); const list=$("scheduleList"); if(!list)return; list.innerHTML=""; cachedCards=[];
  if(!selectedGroup){ list.innerHTML=`<div class="card empty-state" style="cursor:default;"><span class="arrow">⬆️</span><div class="subject">Выбери свою группу</div><div class="teacher" style="margin:8px 0 0;">Селектор вверху по центру — там все группы по курсам.</div></div>`; return; }
  try{ if(mqDesktop.matches&&viewMode==="course")renderCourseGrid(); else renderGroupCards(); }
  catch(err){ console.error(err); list.innerHTML=`<div class="card" style="border-color:red"><div class="subject" style="color:red">Ошибка дня</div><div class="teacher">${escapeHtml(err.message)}</div></div>`; }
  updateLive();
  requestAnimationFrame(()=>{ const cur=cachedCards.find(c=>c.isCurrent); if(cur&&selectedDay===new Date().getDay())cur.el.scrollIntoView({block:"center",behavior:mqReduce.matches?"auto":"smooth"}); }); }
function renderGroupCards(){ const list=$("scheduleList"), bells=selectedDay===1?BELLS.monday:BELLS.regular, dayData=getSchedule(selectedGroup)[selectedDay]||[];
  if(!dayData.length){ list.innerHTML=`<div class="card" style="text-align:center;cursor:default;"><div class="subject" style="margin:0;">В этот день пар нет</div></div>`; return; }
  dayData.forEach((item,index)=>{ const[pairNum,subjRaw,teacher,room,timeOv]=item, bell=bells.find(b=>b.num===pairNum), timeText=timeOv||(bell?`${bell.start} – ${bell.end}`:"—"), noteKey=`note_${selectedGroup}_${selectedDay}_${pairNum}`, savedNote=LS.get(noteKey,"");
    const card=document.createElement("div"); card.className="card"; card.style.setProperty("--delay",(index*.05)+"s");
    card.innerHTML=`<div class="card-top"><span>${pairNum===0?"Классный час":pairNum+" пара"} • ${timeText}<span class="live-pill" style="display:none;"><span class="live-dot"></span>Сейчас</span></span>${room?`<span class="room-badge">Каб. ${escapeHtml(room)}</span>`:""}</div><div class="subj-wrap"></div><div class="note-box ${savedNote?"has-note":""}"><span>${savedNote?"📝":"✏️"}</span><span class="note-text"></span></div>`;
    fillSubject(card.querySelector(".subj-wrap"), subjRaw, teacher, room);
    card.querySelector(".note-text").textContent=savedNote||"Добавить запись";
    card.onclick=()=>openNoteModal(noteKey,subjText(subjRaw),pairNum===0?"Классный час":`${pairNum} пара`,savedNote);
    list.appendChild(card); cachedCards.push({el:card,pill:card.querySelector(".live-pill"),pair:pairNum,isCurrent:false});
    if(index<dayData.length-1){ const nb=bells.find(b=>b.num===dayData[index+1][0]); if(bell&&nb&&!timeOv&&!dayData[index+1][4]){ const mins=Math.round((toSec(nb.start)-toSec(bell.end))/60); if(mins>0){ const brk=document.createElement("div"); brk.className="break-card"; brk.style.setProperty("--delay",(index*.05+.05)+"s"); brk.innerHTML=`<span>☕ Перемена (${mins} мин)</span><span>${bell.end} – ${nb.start}</span>`; list.appendChild(brk); } } } }); }
function renderCourseGrid(){ const list=$("scheduleList"), course=courseOf(selectedGroup), groups=getVisibleGroupNames().filter(g=>courseOf(g)===course), bells=selectedDay===1?BELLS.monday:BELLS.regular, used=new Set();
  groups.forEach(g=>(getSchedule(g)[selectedDay]||[]).forEach(it=>used.add(it[0]))); const rows=bells.filter(b=>used.has(b.num)); const extra=[...used].filter(n=>!bells.some(b=>b.num===n)).sort((a,b)=>a-b);
  if(!rows.length&&!extra.length){ list.innerHTML=`<div class="card" style="text-align:center;cursor:default;"><div class="subject" style="margin:0;">В этот день пар нет</div></div>`; return; }
  const wrap=document.createElement("div"); wrap.className="course-grid"; wrap.style.setProperty("--cols",groups.length);
  wrap.innerHTML=`<div></div>`+groups.map(g=>`<div class="cg-head ${g===selectedGroup?"sel":""}">${escapeHtml(g)}</div>`).join("");
  const rowDefs=[...rows.map(b=>({num:b.num,name:b.name,time:`${b.start}<br>${b.end}`})),...extra.map(n=>({num:n,name:n+" пара",time:""}))];
  rowDefs.forEach(rd=>{ const t=document.createElement("div"); t.className="cg-time"; t.innerHTML=`<span>${rd.name}</span><span>${rd.time}</span>`; wrap.appendChild(t);
    groups.forEach(g=>{ const item=(getSchedule(g)[selectedDay]||[]).find(it=>it[0]===rd.num), cell=document.createElement("div");
      if(!item){ cell.className="cg-cell empty"; cell.textContent="—"; }
      else { const[,subjRaw,teacher,room]=item, noteKey=`note_${g}_${selectedDay}_${rd.num}`, note=LS.get(noteKey,"");
        cell.className="cg-cell";
        if(isSplit(subjRaw)){ cell.innerHTML=`<div class="cg-split"></div>${note?'<div class="n">📝</div>':""}`; const sp=cell.querySelector(".cg-split"); subjRaw.split.forEach((gg,i)=>{ const d=document.createElement("div"); d.className="cg-sub"; d.innerHTML=`<span class="sub-tag">${i+1}</span><span class="s"></span>`; d.querySelector(".s").textContent=gg.s; sp.appendChild(d); }); }
        else { cell.innerHTML=`<div class="s"></div>${teacher?'<div class="t"></div>':""}${room?'<span class="r"></span>':""}${note?'<div class="n">📝 есть запись</div>':""}`; cell.querySelector(".s").textContent=(typeof subjRaw==="string"&&subjRaw)||"(без названия)"; if(teacher)cell.querySelector(".t").textContent=teacher; if(room)cell.querySelector(".r").textContent="Каб. "+room; }
        cell.onclick=()=>openNoteModal(noteKey,subjText(subjRaw),rd.name,note); cachedCards.push({el:cell,pill:null,pair:rd.num,isCurrent:false}); }
      wrap.appendChild(cell); }); });
  list.appendChild(wrap); }
function syncViewToggle(){ qa("#viewToggle .seg-btn").forEach(b=>b.classList.toggle("active",b.dataset.view===viewMode)); }
qa("#viewToggle .seg-btn").forEach(b=>b.onclick=()=>{ viewMode=b.dataset.view; LS.set("kgst_view",viewMode); syncViewToggle(); renderSchedule(); });
if(mqDesktop.addEventListener)mqDesktop.addEventListener("change",renderSchedule);

function getActiveBells(g,d){ const dd=getSchedule(g)[d]||[]; if(!dd.length)return[]; const bells=(d===1?BELLS.monday:BELLS.regular).slice(); const nums=new Set(dd.map(x=>x[0])); dd.forEach(it=>{ if(it[4]){ const m=String(it[4]).match(/(\d{1,2}:\d{2})\s*[–-]\s*(\d{1,2}:\d{2})/); if(m&&!bells.some(b=>b.num===it[0]))bells.push({num:it[0],name:it[0]+" пара",start:m[1],end:m[2]}); } }); return bells.filter(b=>nums.has(b.num)).sort((a,b)=>toSec(a.start)-toSec(b.start)); }
let lastState="";
function updateLive(){ if(document.hidden)return; const now=new Date(), today=now.getDay(), secNow=now.getHours()*3600+now.getMinutes()*60+now.getSeconds(), clock=now.toLocaleTimeString("ru-RU",{hour:"2-digit",minute:"2-digit"}); updateGreeting();
  if(!selectedGroup){ updateUI("Выбери группу",clock,"rest"); return; }
  if(today===0){ updateUI("Воскресенье",clock,"rest"); return; }
  const bells=getActiveBells(selectedGroup,today); if(!bells.length){ updateUI("Пар нет",clock,"rest"); return; }
  let activePairNum=null, stateText="Отдых", statusType="rest", diffSec=0;
  for(let i=0;i<bells.length;i++){ const s=toSec(bells[i].start), e=toSec(bells[i].end); if(secNow<s){ stateText=i===0?`Ждём ${bells[i].name}`:"Перемена"; statusType=i===0?"rest":"break"; diffSec=s-secNow; break; } else if(secNow<=e){ activePairNum=bells[i].num; stateText="Идёт пара"; statusType="lecture"; diffSec=e-secNow; break; } }
  if(activePairNum===null&&diffSec===0&&secNow>toSec(bells[bells.length-1].end)){ updateUI("Пары закончились",clock,"rest"); }
  else { let ts="00:00"; if(diffSec>0){ const h=Math.floor(diffSec/3600),m=Math.floor((diffSec%3600)/60),s=diffSec%60; ts=(h>0?h+":":"")+String(m).padStart(2,"0")+":"+String(s).padStart(2,"0"); } updateUI(stateText,ts,statusType); }
  const isToday=selectedDay===today; for(const c of cachedCards){ const cur=isToday&&c.pair===activePairNum; if(c.isCurrent!==cur){ c.isCurrent=cur; c.el.classList.toggle("current",cur); if(c.pill)c.pill.style.display=cur?"inline-flex":"none"; } } }
function updateUI(st,ts,type){ const key=st+ts+type; if(lastState===key)return; lastState=key; const ls=$("liveStatus"),ht=$("headerTime"),dt=$("dashTimeBtn"); if(ls)ls.textContent=st; if(ht)ht.textContent=ts; if(dt)dt.textContent=ts;
  const rs=document.documentElement.style, c=type==="lecture"?["#8b5cf6","#ec4899"]:type==="break"?["#10b981","#06b6d4"]:["#f59e0b","#ef4444"]; rs.setProperty("--status-color-1",c[0]); rs.setProperty("--status-color-2",c[1]); }

function openAnimatedDialog(d){ if(!d||d.open)return; d.showModal(); requestAnimationFrame(()=>d.classList.add("is-open")); }
function closeAnimatedDialog(d){ if(!d||!d.open)return; d.classList.remove("is-open"); setTimeout(()=>d.close(),210); }
const openDash=()=>{ renderHomework(); renderGrades(); openAnimatedDialog($("dashboardModal")); };
on("openDashboardBtn","click",openDash); on("openDashboardBtn2","click",openDash);
on("openDashboardBtn","keydown",e=>{ if(e.key==="Enter")openDash(); });
on("closeDashboardBtn","click",()=>closeAnimatedDialog($("dashboardModal")));
const dm=$("dashboardModal"); if(dm)dm.onclick=e=>{ if(e.target===dm)closeAnimatedDialog(dm); };
qa(".dash-tab").forEach(tab=>tab.onclick=()=>{ qa(".dash-tab").forEach(t=>t.classList.remove("active")); qa(".dash-content").forEach(c=>c.classList.remove("active")); tab.classList.add("active"); const el=$(tab.dataset.tab); if(el)el.classList.add("active"); });
on("hwSearch","input",e=>{ hwQuery=e.target.value.trim().toLowerCase(); renderHomework(); });
function renderHomework(){ const c=$("hwList"); if(!c)return; c.innerHTML=""; let has=false;
  for(let i=0;i<localStorage.length;i++){ const key=localStorage.key(i); if(key&&key.startsWith("note_")){ const p=key.split("_"), text=localStorage.getItem(key), title=`${p[1]} ${DAYS[parseInt(p[2])-1]||""} ${PAIR_NAMES[parseInt(p[3])]||""}`;
    if(hwQuery&&!(title+" "+text).toLowerCase().includes(hwQuery))continue; has=true;
    const el=document.createElement("div"); el.className="hw-item"; el.innerHTML=`<div class="hw-item-title">${escapeHtml(p[1])} • ${DAYS[parseInt(p[2])-1]||""} • ${PAIR_NAMES[parseInt(p[3])]||""}</div><div>${escapeHtml(text)}</div>`; c.appendChild(el); } }
  if(!has)c.innerHTML=`<div style="text-align:center;color:var(--muted);font-size:.875rem;padding:20px;">${hwQuery?"Ничего не найдено.":"Нет заметок."}</div>`; }
on("addGradeBtn","click",()=>{ const subj=$("gradeSubject").value.trim(), val=parseInt($("gradeValue").value), note=$("gradeNote").value.trim(); if(!subj||isNaN(val)||val<2||val>5)return alert("Введите предмет и оценку (2-5)."); gradesData.push({id:Date.now(),subject:subj,value:val,note}); LS.setJson("kgst_grades",gradesData); $("gradeSubject").value=""; $("gradeValue").value=""; $("gradeNote").value=""; renderGrades(); buzz(10); });
function renderGrades(){ const list=$("gradesList"); if(!list)return; list.innerHTML=""; if(!gradesData.length){ list.innerHTML=`<div style="text-align:center;color:var(--muted);font-size:.875rem;">Оценок пока нет.</div>`; $("gpaValue").textContent="0.00"; return; }
  let sum=0; gradesData.sort((a,b)=>b.id-a.id); gradesData.forEach(g=>{ sum+=g.value; const el=document.createElement("div"); el.className="grade-item"; el.innerHTML=`<div class="grade-val g${g.value}">${g.value}</div><div class="grade-info"><div class="grade-subj">${escapeHtml(g.subject)}</div>${g.note?`<div class="grade-note">${escapeHtml(g.note)}</div>`:""}</div><button class="btn btn-danger" style="padding:6px 10px;font-size:.75rem;border-radius:10px;" data-del="${g.id}">✕</button>`; el.querySelector("[data-del]").onclick=()=>deleteGrade(g.id); list.appendChild(el); });
  $("gpaValue").textContent=(sum/gradesData.length).toFixed(2); }
function deleteGrade(id){ const g=gradesData.find(x=>x.id===id); gradesData=gradesData.filter(x=>x.id!==id); LS.setJson("kgst_grades",gradesData); renderGrades(); buzz(10);
  showToast("Оценка удалена",()=>{ if(g){ gradesData.push(g); LS.setJson("kgst_grades",gradesData); renderGrades(); } }); }
function openNoteModal(key,title,subtitle,text){ currentNoteKey=key; const mt=$("modalTitle"),ms=$("modalSub"),ni=$("noteInput"),dn=$("deleteNote"); if(mt)mt.textContent=title||"Заметка"; if(ms)ms.textContent=`${key.split("_")[1]} • ${subtitle}`; if(ni)ni.value=text||""; if(dn)dn.style.display=text?"block":"none"; openAnimatedDialog($("noteModal")); }
on("closeModal","click",()=>closeAnimatedDialog($("noteModal")));
const nm=$("noteModal"); if(nm)nm.onclick=e=>{ if(e.target===nm)closeAnimatedDialog(nm); };
on("saveNote","click",()=>{ const v=$("noteInput").value.trim(); if(v)LS.set(currentNoteKey,v); else LS.del(currentNoteKey); closeAnimatedDialog($("noteModal")); renderSchedule(); buzz(10); });
on("deleteNote","click",()=>{ const key=currentNoteKey, old=LS.get(key,""); LS.del(key); closeAnimatedDialog($("noteModal")); renderSchedule(); buzz(10);
  showToast("Заметка удалена",()=>{ if(old)LS.set(key,old); renderSchedule(); }); });

function editorRow(p,s,t,r){ const row=document.createElement("div"); row.className="editor-row"; row.innerHTML=`<select class="e-num">${[0,1,2,3,4,5,6].map(n=>`<option value="${n}" ${n===p?"selected":""}>${n===0?"Кл":n}</option>`).join("")}</select><div class="editor-fields"><input class="text-input e-subj" placeholder="Предмет" value="${escapeHtml(s)}"><input class="text-input e-teacher" placeholder="Преподаватель" value="${escapeHtml(t)}"><input class="text-input e-room" placeholder="Кабинет" value="${escapeHtml(r)}"></div><button class="editor-del">✕</button>`; row.querySelector(".editor-del").onclick=()=>row.remove(); return row; }
function openEditor(){ if(!selectedGroup){ const name=prompt("Название новой группы (например, ЭРО-27):"); if(name){ customGroups.push(name.trim()); LS.setJson("kgst_custom_groups",customGroups); selectedGroup=name.trim(); LS.set("kgst_group",selectedGroup); refreshGroupSelect(); renderSchedule(); } else return; }
  const sub=$("editorSub"); if(sub)sub.textContent=`${selectedGroup} • ${DAYS[selectedDay-1]}`;
  const rows=$("editorRows"); rows.innerHTML=""; const day=getSchedule(selectedGroup)[selectedDay]||[];
  day.forEach(it=>rows.appendChild(editorRow(it[0],subjText(it[1]),it[2]||"",it[3]||""))); if(!day.length)rows.appendChild(editorRow(1,"","",""));
  openAnimatedDialog($("editorModal")); }
on("openEditorBtn","click",()=>{ closeAnimatedDialog($("settingsModal")); openEditor(); });
on("closeEditorBtn","click",()=>closeAnimatedDialog($("editorModal")));
on("addPairBtn","click",()=>$("editorRows").appendChild(editorRow(1,"","","")));
on("resetDayBtn","click",()=>{ if(userSchedule[selectedGroup]){ delete userSchedule[selectedGroup][selectedDay]; LS.setJson("kgst_schedule_custom",userSchedule); } closeAnimatedDialog($("editorModal")); renderSchedule(); showToast("День сброшен к стандарту"); });
on("saveEditorBtn","click",()=>{ const arr=[]; qa("#editorRows .editor-row").forEach(r=>{ const subj=r.querySelector(".e-subj").value.trim(); if(!subj)return; arr.push([parseInt(r.querySelector(".e-num").value),subj,r.querySelector(".e-teacher").value.trim(),r.querySelector(".e-room").value.trim()]); }); arr.sort((a,b)=>a[0]-b[0]); if(!userSchedule[selectedGroup])userSchedule[selectedGroup]={}; userSchedule[selectedGroup][selectedDay]=arr; LS.setJson("kgst_schedule_custom",userSchedule); closeAnimatedDialog($("editorModal")); renderSchedule(); buzz(10); showToast("Расписание сохранено"); });

on("exportBtn","click",()=>{ const data={}; for(let i=0;i<localStorage.length;i++){ const k=localStorage.key(i); if(k&&(k.startsWith("kgst_")||k.startsWith("note_")))data[k]=localStorage.getItem(k); }
  const blob=new Blob([JSON.stringify({app:"kgst",version:APP_VERSION,data},null,2)],{type:"application/json"}); const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="kgst-backup-"+new Date().toISOString().slice(0,10)+".json"; a.click(); URL.revokeObjectURL(a.href); showToast("Копия скачана"); });
on("importFile","change",e=>{ const f=e.target.files[0]; if(!f)return; if(f.size>5*1024*1024){ alert("Файл слишком большой."); e.target.value=""; return; }
  const rd=new FileReader(); rd.onload=()=>{ try{ const obj=JSON.parse(rd.result); if(obj.app!=="kgst"||typeof obj.data!=="object")throw 0; Object.entries(obj.data).forEach(([k,v])=>{ if(typeof v==="string"&&(k.startsWith("kgst_")||k.startsWith("note_")))localStorage.setItem(k,v); }); showToast("Копия загружена"); setTimeout(()=>location.reload(),800); }catch{ alert("Неверный файл копии."); } }; rd.readAsText(f); e.target.value=""; });

function renderBackgroundGrid(){ const grid=$("bgGrid"); if(!grid)return; grid.innerHTML=""; const dark=isDarkNow(); Object.entries(BG_PRESETS).forEach(([key,p])=>{ const el=document.createElement("div"); el.className="bg-option"+(bgPreset===key?" active":""); const val=dark?p.dark:p.light; if(val.includes("gradient"))el.style.backgroundImage=val; else el.style.backgroundColor=val; el.textContent=p.name; el.onclick=()=>{ bgPreset=key; LS.set("kgst_bg_preset",key); applyBackground(); renderBackgroundGrid(); }; grid.appendChild(el); }); }
on("resetBgBtn","click",()=>{ bgPreset="default"; LS.set("kgst_bg_preset","default"); applyBackground(); renderBackgroundGrid(); });
on("bgFile","change",e=>{ const f=e.target.files[0]; if(!f)return; const rd=new FileReader(); rd.onload=()=>{ const img=new Image(); img.onload=()=>{ const max=1600,k=Math.min(1,max/Math.max(img.width,img.height)),w=Math.round(img.width*k),h=Math.round(img.height*k),cv=document.createElement("canvas"); cv.width=w; cv.height=h; cv.getContext("2d").drawImage(img,0,0,w,h); const url=cv.toDataURL("image/jpeg",.82); let light=false; try{ const s=document.createElement("canvas"); s.width=1; s.height=1; const sc=s.getContext("2d"); sc.drawImage(cv,0,0,1,1); const d=sc.getImageData(0,0,1,1).data; light=luminance([d[0],d[1],d[2]])>.45; }catch{} try{ localStorage.setItem("kgst_bg_custom",url); }catch{ alert("Картинка слишком большая."); return; } bgCustom=url; LS.set("kgst_bg_img_light",light?"1":"0"); bgPreset="custom"; LS.set("kgst_bg_preset","custom"); applyBackground(); renderBackgroundGrid(); }; img.src=rd.result; }; rd.readAsDataURL(f); e.target.value=""; });

let pickH=210,pickS=.7,pickV=.9,pickRaf=false; try{ const[h,s,v]=rgbToHsv(...hexToRgb(bgCustomColor)); pickH=h; pickS=s; pickV=v; }catch{}
function pickerHex(){ return rgbToHex(...hsvToRgb(pickH,pickS,pickV)); }
function renderPicker(){ const pad=$("svPad"); if(!pad)return; pad.style.setProperty("--hue-color",rgbToHex(...hsvToRgb(pickH,1,1))); $("svCursor").style.left=(pickS*100)+"%"; $("svCursor").style.top=((1-pickV)*100)+"%"; $("hueThumb").style.left=(pickH/360*100)+"%"; const hex=pickerHex(); $("colorPreview").style.background=hex; const hi=$("hexInput"); if(document.activeElement!==hi)hi.value=hex; }
function liveColor(){ bgCustomColor=pickerHex(); bgPreset="color"; applyBackground(); }
function commitColor(){ bgCustomColor=pickerHex(); bgPreset="color"; LS.set("kgst_bg_custom_color",bgCustomColor); LS.set("kgst_bg_preset","color"); applyBackground(); renderBackgroundGrid(); }
function schedulePick(){ if(pickRaf)return; pickRaf=true; requestAnimationFrame(()=>{ pickRaf=false; renderPicker(); liveColor(); }); }
function bindDrag(el,fn){ if(!el)return; const handle=e=>{ const r=el.getBoundingClientRect(); fn(Math.min(Math.max((e.clientX-r.left)/r.width,0),1),Math.min(Math.max((e.clientY-r.top)/r.height,0),1)); };
  el.addEventListener("pointerdown",e=>{ el.setPointerCapture(e.pointerId); handle(e); const mv=ev=>handle(ev); const up=()=>{ el.removeEventListener("pointermove",mv); el.removeEventListener("pointerup",up); el.removeEventListener("pointercancel",up); commitColor(); }; el.addEventListener("pointermove",mv); el.addEventListener("pointerup",up); el.addEventListener("pointercancel",up); }); }
bindDrag($("svPad"),(x,y)=>{ pickS=x; pickV=1-y; schedulePick(); });
bindDrag($("hueSlider"),x=>{ pickH=x*360; schedulePick(); });
on("applyColorBtn","click",commitColor);
on("hexInput","change",e=>{ let v=e.target.value.trim(); if(!v.startsWith("#"))v="#"+v; if(/^#[0-9a-fA-F]{6}$/.test(v)){ const[h,s,vv]=rgbToHsv(...hexToRgb(v)); pickH=h; pickS=s; pickV=vv; renderPicker(); commitColor(); } else renderPicker(); });

function renderThemeGrid(){ const grid=$("themeGrid"); if(!grid)return; grid.innerHTML=""; Object.entries(CARD_THEMES).forEach(([key,t])=>{ const c=key==="auto"?resolveThemeColors():{card:t.card,brk:t.brk,accent:t.accent}, ct=contrastFor(hexToRgb(c.card)), el=document.createElement("div"); el.className="theme-option"+(cardTheme===key?" active":""); el.dataset.theme=key; el.style.background=c.card; el.style.color=ct.text; el.innerHTML=`<span>${t.name}</span><span class="brk" style="background:${c.brk}"></span>`; el.onclick=()=>{ cardTheme=key; applyCardTheme(); renderThemeGrid(); }; grid.appendChild(el); }); }

let deferredPrompt=null;
window.addEventListener("beforeinstallprompt",e=>{ e.preventDefault(); deferredPrompt=e; updateInstallUI(); });
window.addEventListener("appinstalled",()=>{ deferredPrompt=null; updateInstallUI(); });
function isStandalone(){ return window.matchMedia("(display-mode: standalone)").matches||navigator.standalone===true; }
function isIOS(){ return /iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1); }
function updateInstallUI(){ const b=$("installBtn"),h=$("installHint"); if(!b)return; if(isStandalone()){ b.textContent="✅ Приложение установлено"; b.disabled=true; h.textContent=""; } else if(isIOS()){ b.textContent="📲 Как установить на iPhone"; b.disabled=false; h.textContent="Safari: «Поделиться» → «На экран “Домой”»."; } else if(deferredPrompt){ b.textContent="📲 Установить на телефон"; b.disabled=false; h.textContent=""; } else { b.textContent="📲 Установить приложение"; b.disabled=false; h.textContent="Если кнопка не срабатывает: меню браузера → «Установить приложение»."; } }
on("installBtn","click",async()=>{ if(deferredPrompt){ deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt=null; updateInstallUI(); } else if(isIOS())alert('В Safari: «Поделиться» → «На экран “Домой»».'); else alert('Меню браузера (⋮) → «Установить приложение».'); });
on("checkUpdateBtn","click",async()=>{ const reg=window.__swReg; if(reg){ await reg.update(); showToast(reg.waiting?"Обновление найдено, перезагружаю…":"Установлена последняя версия"); if(reg.waiting)setTimeout(()=>location.reload(),800); } else showToast("Service worker недоступен"); });

on("openSettingsBtn","click",()=>{ renderBackgroundGrid(); renderThemeGrid(); renderPicker(); applyFontScale(fontScale); applyOpacity(cardOpacity); applyFx(); updateInstallUI(); const vp=$("versionPill"); if(vp)vp.textContent="v"+APP_VERSION; openAnimatedDialog($("settingsModal")); });
on("closeSettingsBtn","click",()=>closeAnimatedDialog($("settingsModal")));
const sm=$("settingsModal"); if(sm)sm.onclick=e=>{ if(e.target===sm)closeAnimatedDialog(sm); };
qa("#opacityControl .seg-btn").forEach(b=>b.onclick=()=>applyOpacity(b.dataset.opacity));
on("fontRange","input",e=>applyFontScale(e.target.value));
on("fontMinus","click",()=>applyFontScale(parseFloat(fontScale)-.05));
on("fontPlus","click",()=>applyFontScale(parseFloat(fontScale)+.05));
on("fontReset","click",()=>applyFontScale(1));

function updateNet(){ const b=$("netBadge"); if(b)b.hidden=navigator.onLine; }
window.addEventListener("online",updateNet); window.addEventListener("offline",updateNet);

function hideSplash(){ const s=$("splash"); if(s){ s.classList.add("hidden"); setTimeout(()=>s.remove(),700); } const a=$("app"); if(a)a.classList.add("loaded"); }
try{ applyBackground(); applyFontScale(fontScale); applyOpacity(cardOpacity); applyFx(); updateGreeting(); refreshGroupSelect(); renderDays(); syncViewToggle(); setInterval(updateLive,1000); renderSchedule(); updateNet(); hideSplash(); }
catch(err){ console.error(err); hideSplash(); const l=$("scheduleList"); if(l)l.innerHTML=`<div class="card" style="border-color:red"><div class="subject" style="color:red">Ошибка кода</div><div class="teacher">${escapeHtml(err.message)}</div></div>`; }
document.addEventListener("visibilitychange",()=>{ if(!document.hidden)updateLive(); });
const mqDark=window.matchMedia("(prefers-color-scheme: dark)"); if(mqDark.addEventListener)mqDark.addEventListener("change",applyBackground);