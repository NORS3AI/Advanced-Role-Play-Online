/* Advanced Role Play Online — custom sections editor.
   Lets a player add their own sections containing text, sliders, links,
   buttons, icons (Wowhead or bundled), and images. DOM is the source of
   truth; serialize() reads it back into a data model. */
(function () {
  "use strict";
  var ARPO = (window.ARPO = window.ARPO || {});
  var esc = ARPO.escapeHtml;

  var TYPES = [
    { v: "text", label: "Text" },
    { v: "slider", label: "Slider" },
    { v: "comparison", label: "Comparison" },
    { v: "link", label: "Link" },
    { v: "button", label: "Button" },
    { v: "icon", label: "Icon" },
    { v: "image", label: "Image" }
  ];
  var TYPE_LABEL = {}; TYPES.forEach(function (t) { TYPE_LABEL[t.v] = t.label; });

  function head(moveKey) {
    return '<div class="cs-item-head">' +
      '<span class="cs-type"></span><span class="spacer"></span>' +
      '<button type="button" class="cs-mini" data-mv="up" title="Move up">▲</button>' +
      '<button type="button" class="cs-mini" data-mv="down" title="Move down">▼</button>' +
      '<button type="button" class="cs-mini danger" data-mv="del" title="Remove">✕</button>' +
      "</div>";
  }

  function makeItem(type, d) {
    d = d || {};
    var row = document.createElement("div");
    row.className = "cs-item"; row.dataset.type = type;
    var body = "";

    if (type === "text") {
      body =
        '<input class="cs-f" data-k="label" placeholder="Label (optional)" value="' + esc(d.label || "") + '">' +
        '<textarea class="cs-f" data-k="value" placeholder="Text…">' + esc(d.value || "") + "</textarea>";
    } else if (type === "slider") {
      var min = d.min != null ? d.min : 0, max = d.max != null ? d.max : 100;
      var val = d.value != null ? d.value : Math.round((Number(min) + Number(max)) / 2);
      body =
        '<input class="cs-f" data-k="label" placeholder="Label — e.g. Bravery" value="' + esc(d.label || "") + '">' +
        '<div class="cs-slider-edit">' +
          '<input class="cs-f cs-range" data-k="value" type="range" min="' + esc(min) + '" max="' + esc(max) + '" value="' + esc(val) + '">' +
          '<span class="cs-val">' + esc(val) + "</span>" +
          '<label class="cs-mm">min<input class="cs-f cs-num" data-k="min" type="number" value="' + esc(min) + '"></label>' +
          '<label class="cs-mm">max<input class="cs-f cs-num" data-k="max" type="number" value="' + esc(max) + '"></label>' +
        "</div>";
    } else if (type === "comparison") {
      var ch = d.colorHigh || "#27ae60", cl = d.colorLow || "#c0392b";
      var cv = d.value != null ? d.value : 50;
      body =
        '<div class="cs-cmp-row">' +
          '<input class="cs-f" data-k="left" placeholder="Left — e.g. Brave" value="' + esc(d.left || "") + '">' +
          '<input class="cs-f" data-k="right" placeholder="Right — e.g. Coward" value="' + esc(d.right || "") + '">' +
        "</div>" +
        '<div class="cs-slider-edit">' +
          '<input class="cs-f cs-range" data-k="value" type="range" min="0" max="100" value="' + esc(cv) + '">' +
          '<span class="cs-val">' + esc(cv) + "</span>" +
          '<label class="cs-mm">greater<input class="cs-f cs-color" data-k="colorHigh" type="color" value="' + esc(ch) + '"></label>' +
          '<label class="cs-mm">lesser<input class="cs-f cs-color" data-k="colorLow" type="color" value="' + esc(cl) + '"></label>' +
        "</div>";
    } else if (type === "link" || type === "button") {
      body =
        '<input class="cs-f" data-k="label" placeholder="' + (type === "button" ? "Button text" : "Link text") + '" value="' + esc(d.label || "") + '">' +
        '<input class="cs-f" data-k="url" placeholder="https://…" value="' + esc(d.url || "") + '">';
    } else if (type === "icon") {
      body =
        '<input class="cs-f" data-k="label" placeholder="Label (optional)" value="' + esc(d.label || "") + '">' +
        '<div class="cs-icon-edit">' +
          '<div class="cs-icon-prev" data-prev></div>' +
          '<input type="hidden" class="cs-f" data-k="icon" value="' + esc(d.icon || "") + '">' +
          '<input type="hidden" class="cs-f" data-k="iconKind" value="' + esc(d.iconKind || "wow") + '">' +
          '<button type="button" class="btn btn-sm cs-icon-pick">🖼 Icon</button>' +
          '<span class="cs-icon-name">' + (d.icon ? esc(d.icon) : "None") + "</span>" +
        "</div>";
    } else if (type === "image") {
      body =
        '<input class="cs-f" data-k="label" placeholder="Caption (optional)" value="' + esc(d.label || "") + '">' +
        '<input class="cs-f" data-k="url" placeholder="Image URL — https://…" value="' + esc(d.url || "") + '">' +
        '<div class="cs-img-prev"' + (d.url ? "" : " hidden") + ">" + (d.url ? '<img alt="" src="' + esc(d.url) + '">' : "") + "</div>";
    }

    row.innerHTML = head() + '<div class="cs-item-body">' + body + "</div>";
    row.querySelector(".cs-type").textContent = TYPE_LABEL[type] || type;
    if (type === "icon") updateIconPreview(row);
    return row;
  }

  function updateIconPreview(row) {
    var prev = row.querySelector("[data-prev]");
    if (!prev) return;
    var name = row.querySelector('[data-k="icon"]').value.trim();
    var kind = row.querySelector('[data-k="iconKind"]').value;
    prev.innerHTML = name ? (ARPO.inlineIcon(kind, name, 26) || "?") : "?";
  }

  // Set a row's icon (from the modal picker) and refresh its preview/label.
  function applyPick(row, kind, name) {
    row.querySelector('[data-k="icon"]').value = name || "";
    row.querySelector('[data-k="iconKind"]').value = kind || "wow";
    var nm = row.querySelector(".cs-icon-name");
    if (nm) nm.textContent = name || "None";
    updateIconPreview(row);
  }
  function openPickerFor(row) {
    if (!ARPO.openIconPicker) return;
    ARPO.openIconPicker({
      kind: row.querySelector('[data-k="iconKind"]').value,
      value: row.querySelector('[data-k="icon"]').value,
      onPick: function (kind, name) { applyPick(row, kind, name); }
    });
  }

  function makeSection(d) {
    d = d || { title: "", items: [] };
    var sec = document.createElement("div");
    sec.className = "cs-section";
    sec.innerHTML =
      '<div class="cs-section-head">' +
        '<input class="cs-title-input" placeholder="Section title — e.g. Abilities" value="' + esc(d.title || "") + '">' +
        '<button type="button" class="cs-mini" data-sv="up" title="Move section up">▲</button>' +
        '<button type="button" class="cs-mini" data-sv="down" title="Move section down">▼</button>' +
        '<button type="button" class="cs-mini danger" data-sv="del" title="Remove section">✕</button>' +
      "</div>" +
      '<div class="cs-items"></div>' +
      '<div class="cs-add"><select class="cs-add-type"><option value="">＋ Add element…</option>' +
        TYPES.map(function (t) { return '<option value="' + t.v + '">' + t.label + "</option>"; }).join("") +
      "</select></div>";
    var wrap = sec.querySelector(".cs-items");
    (d.items || []).forEach(function (it) { wrap.appendChild(makeItem(it.type, it)); });
    return sec;
  }

  ARPO.createSectionsEditor = function (container, addButton) {
    function addSection(d) { container.appendChild(makeSection(d)); }

    if (addButton) addButton.addEventListener("click", function () { addSection(); });

    // add element
    container.addEventListener("change", function (e) {
      var sel = e.target.closest(".cs-add-type");
      if (sel && sel.value) {
        sel.closest(".cs-section").querySelector(".cs-items").appendChild(makeItem(sel.value));
        sel.value = "";
      }
    });

    // clicks: move / delete / icon browse / icon pick
    container.addEventListener("click", function (e) {
      var mv = e.target.closest("[data-mv]");
      if (mv) {
        var item = mv.closest(".cs-item"), act = mv.dataset.mv;
        if (act === "del") item.remove();
        else if (act === "up" && item.previousElementSibling) item.parentNode.insertBefore(item, item.previousElementSibling);
        else if (act === "down" && item.nextElementSibling) item.parentNode.insertBefore(item.nextElementSibling, item);
        return;
      }
      var sv = e.target.closest("[data-sv]");
      if (sv) {
        var sec = sv.closest(".cs-section"), a = sv.dataset.sv;
        if (a === "del") sec.remove();
        else if (a === "up" && sec.previousElementSibling) sec.parentNode.insertBefore(sec, sec.previousElementSibling);
        else if (a === "down" && sec.nextElementSibling) sec.parentNode.insertBefore(sec.nextElementSibling, sec);
        return;
      }
      var pk = e.target.closest(".cs-icon-pick");
      if (pk) { openPickerFor(pk.closest(".cs-item")); return; }
    });

    // live input updates
    container.addEventListener("input", function (e) {
      var f = e.target;
      if (f.classList.contains("cs-range")) {
        var v = f.closest(".cs-slider-edit").querySelector(".cs-val"); if (v) v.textContent = f.value;
      } else if (f.dataset.k === "min" || f.dataset.k === "max") {
        var edit = f.closest(".cs-slider-edit");
        var range = edit.querySelector(".cs-range");
        var min = edit.querySelector('[data-k="min"]').value, max = edit.querySelector('[data-k="max"]').value;
        if (min !== "") range.min = min;
        if (max !== "") range.max = max;
        edit.querySelector(".cs-val").textContent = range.value;
      } else if (f.closest(".cs-item") && f.closest(".cs-item").dataset.type === "image" && f.dataset.k === "url") {
        var prev = f.closest(".cs-item").querySelector(".cs-img-prev");
        if (f.value.trim()) { prev.hidden = false; prev.innerHTML = '<img alt="" src="' + esc(f.value.trim()) + '" onerror="this.style.display=\'none\'">'; }
        else { prev.hidden = true; prev.innerHTML = ""; }
      }
    });

    function meaningful(it) {
      if (it.type === "text") return !!(it.value || it.label);
      if (it.type === "slider") return !!it.label || it.value != null;
      if (it.type === "comparison") return !!(it.left || it.right);
      if (it.type === "link" || it.type === "button" || it.type === "image") return !!it.url;
      if (it.type === "icon") return !!it.icon || !!it.label;
      return true;
    }

    function serialize() {
      var out = [];
      [].forEach.call(container.querySelectorAll(".cs-section"), function (sec) {
        var title = sec.querySelector(".cs-title-input").value.trim();
        var items = [];
        [].forEach.call(sec.querySelectorAll(".cs-item"), function (it) {
          var obj = { type: it.dataset.type };
          [].forEach.call(it.querySelectorAll(".cs-f"), function (f) {
            var val = f.value;
            if (f.type === "number" || f.type === "range") val = val === "" ? null : Number(val);
            obj[f.dataset.k] = typeof val === "string" ? val.trim() : val;
          });
          if (meaningful(obj)) items.push(obj);
        });
        if (title || items.length) out.push({ title: title, items: items });
      });
      return out;
    }

    function load(sections) {
      container.innerHTML = "";
      (sections || []).forEach(function (s) { addSection(s); });
    }

    return { serialize: serialize, load: load, addSection: addSection };
  };

  // ---- At a Glance editor (icon + short note; 3 shown, up to 10) ----------
  function makeGlance(d) {
    d = d || {};
    var row = document.createElement("div");
    row.className = "glance-row";
    row.innerHTML =
      '<div class="g-icon cs-icon-edit">' +
        '<div class="cs-icon-prev" data-prev></div>' +
        '<input type="hidden" class="g-f" data-k="icon" value="' + esc(d.icon || "") + '">' +
        '<input type="hidden" class="g-f" data-k="iconKind" value="' + esc(d.iconKind || "wow") + '">' +
        '<button type="button" class="btn btn-sm cs-icon-pick">🖼 Icon</button>' +
      "</div>" +
      '<input class="g-f g-text" data-k="text" placeholder="What they\'d notice — e.g. A jagged scar across one eye" value="' + esc(d.text || "") + '">' +
      '<button type="button" class="cs-mini" data-g="up" title="Move up">▲</button>' +
      '<button type="button" class="cs-mini" data-g="down" title="Move down">▼</button>' +
      '<button type="button" class="cs-mini danger" data-g="del" title="Remove">✕</button>';
    updateIconPreview(row);
    return row;
  }

  ARPO.createGlanceEditor = function (container, addButton) {
    var MAX = 10;
    function count() { return container.querySelectorAll(".glance-row").length; }
    function syncAdd() {
      if (!addButton) return;
      var full = count() >= MAX;
      addButton.disabled = full;
      addButton.textContent = full ? "Maximum of 10 reached" : "＋ Add glance";
    }
    function addRow(d) { if (count() >= MAX) return; container.appendChild(makeGlance(d)); syncAdd(); }

    if (addButton) addButton.addEventListener("click", function () { addRow(); });

    container.addEventListener("click", function (e) {
      var g = e.target.closest("[data-g]");
      if (g) {
        var row = g.closest(".glance-row"), act = g.dataset.g;
        if (act === "del") { row.remove(); syncAdd(); }
        else if (act === "up" && row.previousElementSibling) row.parentNode.insertBefore(row, row.previousElementSibling);
        else if (act === "down" && row.nextElementSibling) row.parentNode.insertBefore(row.nextElementSibling, row);
        return;
      }
      var pk = e.target.closest(".cs-icon-pick");
      if (pk) { openPickerFor(pk.closest(".glance-row")); return; }
    });

    function serialize() {
      var out = [];
      [].forEach.call(container.querySelectorAll(".glance-row"), function (row) {
        var o = {};
        [].forEach.call(row.querySelectorAll(".g-f"), function (f) { o[f.dataset.k] = f.value.trim ? f.value.trim() : f.value; });
        if (o.text || o.icon) out.push({ icon: o.icon || "", iconKind: o.iconKind || "wow", text: o.text || "" });
      });
      return out;
    }
    function load(glances) {
      container.innerHTML = "";
      (glances && glances.length ? glances : []).forEach(function (g) { addRow(g); });
      while (count() < 3) addRow();   // always show at least 3 slots
      syncAdd();
    }
    return { serialize: serialize, load: load };
  };
})();
