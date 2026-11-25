(function () {
  window.__APP_V = 28;
  var ANCHOR = new Date(2026, 7, 31); // понедельник 31.08.2026 = верхняя неделя (по официальному графику)

  weekParity = function () {
    var now = new Date(), mon = new Date(now);
    mon.setDate(now.getDate() - ((now.getDay() + 6) % 7)); mon.setHours(0, 0, 0, 0);
    var a = new Date(ANCHOR); a.setHours(0, 0, 0, 0);
    return Math.round((mon - a) / 604800000) % 2 === 0;
  };
  isTopWeek = function () { if (weekMode === "top") return true; if (weekMode === "bot") return false; return weekParity(); };

  // Две разные дисциплины в ячейке = чередование недель (верхняя/нижняя).
  // Одна дисциплина, два преподавателя/кабинета = подгруппы (параллельно).
  function resolveEntry(x) {
    if (x && typeof x === "object") {
      if (Array.isArray(x.split)) {
        var a = x.split[0], b = x.split[1];
        if (a && b && a.s !== b.s) return isTopWeek() ? a : b;
        return { split: x.split };
      }
      if (x.top || x.bot) return isTopWeek() ? x.top : x.bot;
    }
    return x;
  }
  var isSplit = function (x) { return !!x && typeof x === "object" && Array.isArray(x.split); };

  subjText = function (x) { var r = resolveEntry(x); if (isSplit(r)) return r.split.map(function (g) { return g.s; }).join(" / "); if (r && r.s) return r.s; return typeof x === "string" ? x : ""; };

  fillSubject = function (el, raw, teacher, room) {
    var res = resolveEntry(raw);
    if (isSplit(res)) {
      el.innerHTML = res.split.map(function (g, i) { return '<div class="sub-row"><span class="sub-tag">' + (i + 1) + ' подгр.</span><div class="sub-body"><div class="sub-name"></div><div class="sub-meta"></div></div></div>'; }).join("");
      el.querySelectorAll(".sub-row").forEach(function (row, i) { var g = res.split[i]; row.querySelector(".sub-name").textContent = g.s || "(без названия)"; row.querySelector(".sub-meta").textContent = [g.t, g.r ? ("каб. " + g.r) : ""].filter(Boolean).join(" · "); });
    } else {
      var s = res && res.s ? res.s : (typeof raw === "string" ? raw : "");
      var t = res && res.t ? res.t : teacher;
      el.innerHTML = '<div class="subject"></div><div class="teacher" style="' + (t ? "" : "height:6px;margin:0;") + '"></div>';
      el.querySelector(".subject").textContent = s || "(без названия)";
      if (t) el.querySelector(".teacher").textContent = t;
    }
  };

  updateWeekBanner = function () {
    var top = isTopWeek(), wb = document.getElementById("weekBanner");
    if (wb) wb.classList.toggle("bottom-week", !top);
    var wi = document.getElementById("weekIcon"), wl = document.getElementById("weekLabel"), wp = document.getElementById("weekModePill");
    if (wi) wi.textContent = top ? "🔼" : "🔽";
    if (wl) wl.textContent = top ? "Верхняя" : "Нижняя";
    if (wp) wp.textContent = weekMode === "auto" ? "Авто" : (weekMode === "top" ? "Верхняя" : "Нижняя");
  };

  renderGroupCards = function () {
    var list = document.getElementById("scheduleList"), bells = selectedDay === 1 ? BELLS.monday : BELLS.regular, dayData = getSchedule(selectedGroup)[selectedDay] || [];
    if (!dayData.length) { list.innerHTML = '<div class="card" style="text-align:center;cursor:default;"><div class="subject" style="margin:0;">В этот день пар нет</div></div>'; return; }
    dayData.forEach(function (item, index) {
      var pairNum = item[0], subjRaw = item[1], teacher = item[2], room = item[3], timeOv = item[4];
      var bell = bells.find(function (b) { return b.num === pairNum; }), timeText = timeOv || (bell ? bell.start + " – " + bell.end : "—");
      var res = resolveEntry(subjRaw), badgeRoom = res && res.r ? res.r : (typeof subjRaw === "string" ? room : "");
      var noteKey = "note_" + selectedGroup + "_" + selectedDay + "_" + pairNum, savedNote = LS.get(noteKey, "");
      var card = document.createElement("div"); card.className = "card"; card.style.setProperty("--delay", (index * .05) + "s");
      card.innerHTML = '<div class="card-top"><span>' + (pairNum === 0 ? "Классный час" : pairNum + " пара") + ' • ' + timeText + '<span class="live-pill" style="display:none;"><span class="live-dot"></span>Сейчас</span></span>' + (badgeRoom ? '<span class="room-badge">Каб. ' + escapeHtml(badgeRoom) + '</span>' : "") + '</div><div class="subj-wrap"></div><div class="note-box ' + (savedNote ? "has-note" : "") + '"><span>' + (savedNote ? "📝" : "✏️") + '</span><span class="note-text"></span></div>';
      fillSubject(card.querySelector(".subj-wrap"), subjRaw, teacher, room);
      card.querySelector(".note-text").textContent = savedNote || "Добавить запись";
      card.onclick = function () { openNoteModal(noteKey, subjText(subjRaw), pairNum === 0 ? "Классный час" : pairNum + " пара", savedNote); };
      list.appendChild(card); cachedCards.push({ el: card, pill: card.querySelector(".live-pill"), pair: pairNum, isCurrent: false });
      if (index < dayData.length - 1) {
        var nb = bells.find(function (b) { return b.num === dayData[index + 1][0]; });
        if (bell && nb && !timeOv && !dayData[index + 1][4]) {
          var mins = Math.round((toSec(nb.start) - toSec(bell.end)) / 60);
          if (mins > 0) { var brk = document.createElement("div"); brk.className = "break-card"; brk.style.setProperty("--delay", (index * .05 + .05) + "s"); brk.innerHTML = "<span>☕ Перемена (" + mins + " мин)</span><span>" + bell.end + " – " + nb.start + "</span>"; list.appendChild(brk); }
        }
      }
    });
  };

  renderCourseGrid = function () {
    var list = document.getElementById("scheduleList"), course = courseOf(selectedGroup),
      groups = getVisibleGroupNames().filter(function (g) { return courseOf(g) === course; }),
      bells = selectedDay === 1 ? BELLS.monday : BELLS.regular, used = new Set();
    groups.forEach(function (g) { (getSchedule(g)[selectedDay] || []).forEach(function (it) { used.add(it[0]); }); });
    var rows = bells.filter(function (b) { return used.has(b.num); });
    var extra = Array.from(used).filter(function (n) { return !bells.some(function (b) { return b.num === n; }); }).sort(function (a, b) { return a - b; });
    if (!rows.length && !extra.length) { list.innerHTML = '<div class="card" style="text-align:center;cursor:default;"><div class="subject" style="margin:0;">В этот день пар нет</div></div>'; return; }
    var wrap = document.createElement("div"); wrap.className = "course-grid"; wrap.style.setProperty("--cols", groups.length);
    wrap.innerHTML = "<div></div>" + groups.map(function (g) { return '<div class="cg-head ' + (g === selectedGroup ? "sel" : "") + '">' + escapeHtml(g) + "</div>"; }).join("");
    var rowDefs = rows.map(function (b) { return { num: b.num, name: b.name, time: b.start + "<br>" + b.end }; }).concat(extra.map(function (n) { return { num: n, name: n + " пара", time: "" }; }));
    rowDefs.forEach(function (rd) {
      var t = document.createElement("div"); t.className = "cg-time"; t.innerHTML = "<span>" + rd.name + "</span><span>" + rd.time + "</span>"; wrap.appendChild(t);
      groups.forEach(function (g) {
        var item = (getSchedule(g)[selectedDay] || []).find(function (it) { return it[0] === rd.num; }), cell = document.createElement("div");
        if (!item) { cell.className = "cg-cell empty"; cell.textContent = "—"; }
        else {
          var subjRaw = item[1], res = resolveEntry(subjRaw), noteKey = "note_" + g + "_" + selectedDay + "_" + rd.num, note = LS.get(noteKey, "");
          cell.className = "cg-cell";
          if (isSplit(res)) {
            cell.innerHTML = '<div class="cg-split"></div>' + (note ? '<div class="n">📝</div>' : "");
            var sp = cell.querySelector(".cg-split");
            res.split.forEach(function (gg, i) { var d = document.createElement("div"); d.className = "cg-sub"; d.innerHTML = '<span class="sub-tag">' + (i + 1) + '</span><span class="s"></span>'; d.querySelector(".s").textContent = gg.s; sp.appendChild(d); });
          } else {
            var s = res && res.s ? res.s : (typeof subjRaw === "string" ? subjRaw : ""), tt = res && res.t ? res.t : item[2], rr = res && res.r ? res.r : item[3];
            cell.innerHTML = '<div class="s"></div>' + (tt ? '<div class="t"></div>' : "") + (rr ? '<span class="r"></span>' : "") + (note ? '<div class="n">📝 есть запись</div>' : "");
            cell.querySelector(".s").textContent = s || "(без названия)";
            if (tt) cell.querySelector(".t").textContent = tt;
            if (rr) cell.querySelector(".r").textContent = "Каб. " + rr;
          }
          cell.onclick = function () { openNoteModal(noteKey, subjText(subjRaw), rd.name, note); };
          cachedCards.push({ el: cell, pill: null, pair: rd.num, isCurrent: false });
        }
        wrap.appendChild(cell);
      });
    });
    list.appendChild(wrap);
  };

  try { renderSchedule(); } catch (e) { console.error(e); }
  try { updateLive(); } catch (e) {}
  if (!window.__hfTimer) { window.__hfTimer = setInterval(function () { try { updateLive(); } catch (e) {} }, 1000); }
})();