(function () {
  window.__APP_V = 27;
  var isSplit = function (x) { return !!x && typeof x === "object" && Array.isArray(x.split); };

  subjText = function (x) { return isSplit(x) ? x.split.map(function (g) { return g.s; }).join(" / ") : (typeof x === "string" ? x : ""); };

  fillSubject = function (el, subject, teacher, room) {
    if (isSplit(subject)) {
      el.innerHTML = subject.split.map(function (g, i) { return '<div class="sub-row"><span class="sub-tag">' + (i + 1) + ' подгр.</span><div class="sub-body"><div class="sub-name"></div><div class="sub-meta"></div></div></div>'; }).join("");
      el.querySelectorAll(".sub-row").forEach(function (row, i) { var g = subject.split[i]; row.querySelector(".sub-name").textContent = g.s || "(без названия)"; row.querySelector(".sub-meta").textContent = [g.t, g.r ? ("каб. " + g.r) : ""].filter(Boolean).join(" · "); });
    } else {
      el.innerHTML = '<div class="subject"></div><div class="teacher" style="' + (teacher ? "" : "height:6px;margin:0;") + '"></div>';
      el.querySelector(".subject").textContent = (typeof subject === "string" && subject) || "(без названия)";
      if (teacher) el.querySelector(".teacher").textContent = teacher;
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
          var subjRaw = item[1], teacher = item[2], room = item[3], noteKey = "note_" + g + "_" + selectedDay + "_" + rd.num, note = LS.get(noteKey, "");
          cell.className = "cg-cell";
          if (isSplit(subjRaw)) {
            cell.innerHTML = '<div class="cg-split"></div>' + (note ? '<div class="n">📝</div>' : "");
            var sp = cell.querySelector(".cg-split");
            subjRaw.split.forEach(function (gg, i) { var d = document.createElement("div"); d.className = "cg-sub"; d.innerHTML = '<span class="sub-tag">' + (i + 1) + '</span><span class="s"></span>'; d.querySelector(".s").textContent = gg.s; sp.appendChild(d); });
          } else {
            cell.innerHTML = '<div class="s"></div>' + (teacher ? '<div class="t"></div>' : "") + (room ? '<span class="r"></span>' : "") + (note ? '<div class="n">📝 есть запись</div>' : "");
            cell.querySelector(".s").textContent = (typeof subjRaw === "string" && subjRaw) || "(без названия)";
            if (teacher) cell.querySelector(".t").textContent = teacher;
            if (room) cell.querySelector(".r").textContent = "Каб. " + room;
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