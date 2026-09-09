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

  function head() {
    return '<div class="cs-item-head">' +
      ARPO.dragHandle("cs-item-handle") +
      '<span class="cs-type"></span><span class="spacer"></span>' +
      '<button type="button" class="cs-mini" data-mv="dup" title="Duplicate row" aria-label="Duplicate row" tabindex="-1">⧉</button>' +
      '<button type="button" class="cs-mini danger" data-mv="del" title="Remove" aria-label="Remove" tabindex="-1">✕</button>' +
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
        '<div class="cs-cmp-edit">' +
          '<input class="cs-f cs-cmp-left" data-k="left" placeholder="Left — e.g. Brave" value="' + esc(d.left || "") + '">' +
          '<input class="cs-f cs-cmp-range" data-k="value" type="range" min="0" max="100" value="' + esc(cv) + '">' +
          '<input class="cs-f cs-cmp-right" data-k="right" placeholder="Right — e.g. Coward" value="' + esc(d.right || "") + '">' +
        "</div>" +
        '<div class="cs-cmp-colors">' +
          '<label class="cs-mm">Greater side <input class="cs-f cs-color" data-k="colorHigh" type="color" value="' + esc(ch) + '">' +
            '<button type="button" class="cs-mini cs-copy" title="Copy color" aria-label="Copy color" tabindex="-1">⧉</button>' +
            '<button type="button" class="cs-mini cs-paste" title="Paste color" aria-label="Paste color" tabindex="-1">⇩</button></label>' +
          '<label class="cs-mm">Lesser side <input class="cs-f cs-color" data-k="colorLow" type="color" value="' + esc(cl) + '">' +
            '<button type="button" class="cs-mini cs-copy" title="Copy color" aria-label="Copy color" tabindex="-1">⧉</button>' +
            '<button type="button" class="cs-mini cs-paste" title="Paste color" aria-label="Paste color" tabindex="-1">⇩</button></label>' +
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
    if (type === "comparison") updateCmp(row);
    return row;
  }

  // Colour the comparison slider track by the greater/lesser side so the
  // balance is obvious (replaces the browser's default blue/white slider).
  function updateCmp(row) {
    var range = row.querySelector(".cs-cmp-range");
    if (!range) return;
    var v = Math.max(0, Math.min(100, Number(range.value) || 0));
    var high = (row.querySelector('[data-k="colorHigh"]') || {}).value || "#27ae60";
    var low = (row.querySelector('[data-k="colorLow"]') || {}).value || "#c0392b";
    var leftPct = 100 - v, rightPct = v;
    var leftColor = leftPct >= rightPct ? high : low;
    var rightColor = rightPct > leftPct ? high : low;
    range.style.background = "linear-gradient(to right," + leftColor + " 0%," + leftColor + " " +
      leftPct + "%," + rightColor + " " + leftPct + "%," + rightColor + " 100%)";
  }

  // Read a single item's data (used to duplicate it).
  function readItem(it) {
    var obj = { type: it.dataset.type };
    [].forEach.call(it.querySelectorAll(".cs-f"), function (f) {
      var val = f.value;
      if (f.type === "number" || f.type === "range") val = val === "" ? null : Number(val);
      obj[f.dataset.k] = typeof val === "string" ? val.trim() : val;
    });
    return obj;
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

  // A "custom items" zone: the item list + an "add element" control. Shared
  // by custom sub-sections and by the per-block extras on built-in blocks.
  function addControlHTML() {
    return '<div class="cs-add">' +
      '<select class="cs-add-type"><option value="">＋ Add element…</option>' +
        TYPES.map(function (t) { return '<option value="' + t.v + '">' + t.label + "</option>"; }).join("") +
      "</select></div>";
  }
  // Append the element chosen in a `.cs-add-type` select into its zone.
  function addElementFrom(sel) {
    var zone = sel.closest(".cs-zone");
    if (!zone || !sel.value) return;
    zone.querySelector(".cs-items").appendChild(makeItem(sel.value));
    sel.value = "";
  }
  function meaningful(it) {
    if (it.type === "text") return !!(it.value || it.label);
    if (it.type === "slider") return !!it.label || it.value != null;
    if (it.type === "comparison") return !!(it.left || it.right);
    if (it.type === "link" || it.type === "button" || it.type === "image") return !!it.url;
    if (it.type === "icon") return !!it.icon || !!it.label;
    return true;
  }
  function serializeItems(scope) {
    var out = [];
    [].forEach.call(scope.querySelectorAll(".cs-item"), function (it) {
      var obj = readItem(it);
      if (meaningful(obj)) out.push(obj);
    });
    return out;
  }

  // Delegated item-editing shared by every custom-item zone. Returns true if
  // it handled the event, so callers can stop looking.
  function itemClick(e) {
    var mv = e.target.closest("[data-mv]");
    if (mv && mv.closest(".cs-item")) {
      var item = mv.closest(".cs-item");
      if (mv.dataset.mv === "del") item.remove();
      else if (mv.dataset.mv === "dup") {
        var copy = makeItem(item.dataset.type, readItem(item));
        item.parentNode.insertBefore(copy, item.nextElementSibling);
      }
      return true;
    }
    var cp = e.target.closest(".cs-copy");
    if (cp) { ARPO._colorClip = cp.parentNode.querySelector(".cs-color").value; ARPO.toast("Color copied"); return true; }
    var ps = e.target.closest(".cs-paste");
    if (ps && ARPO._colorClip) {
      var inp = ps.parentNode.querySelector(".cs-color");
      inp.value = ARPO._colorClip; updateCmp(ps.closest(".cs-item")); ARPO.toast("Color pasted"); return true;
    }
    var pk = e.target.closest(".cs-icon-pick");
    if (pk && pk.closest(".cs-item")) { openPickerFor(pk.closest(".cs-item")); return true; }
    return false;
  }
  function itemInput(e) {
    var f = e.target;
    if (f.classList.contains("cs-range")) {
      var v = f.closest(".cs-slider-edit").querySelector(".cs-val"); if (v) v.textContent = f.value;
    } else if (f.dataset.k === "min" || f.dataset.k === "max") {
      var edit = f.closest(".cs-slider-edit");
      var range = edit.querySelector(".cs-range");
      var mn = edit.querySelector('[data-k="min"]').value, mx = edit.querySelector('[data-k="max"]').value;
      if (mn !== "") range.min = mn;
      if (mx !== "") range.max = mx;
      edit.querySelector(".cs-val").textContent = range.value;
    } else if (f.classList.contains("cs-cmp-range") ||
               (f.classList.contains("cs-color") && f.closest(".cs-item") && f.closest(".cs-item").dataset.type === "comparison")) {
      updateCmp(f.closest(".cs-item"));
    } else if (f.closest(".cs-item") && f.closest(".cs-item").dataset.type === "image" && f.dataset.k === "url") {
      var prev = f.closest(".cs-item").querySelector(".cs-img-prev");
      if (f.value.trim()) { prev.hidden = false; prev.innerHTML = '<img alt="" src="' + esc(f.value.trim()) + '" onerror="this.style.display=\'none\'">'; }
      else { prev.hidden = true; prev.innerHTML = ""; }
    }
  }

  // Click a pencil → edit a title/label in place (contenteditable).
  function inlineEdit(el) {
    if (!el || el.getAttribute("contenteditable") === "true") return;
    el.setAttribute("contenteditable", "true");
    el.focus();
    try {
      var range = document.createRange(); range.selectNodeContents(el);
      var s = window.getSelection(); s.removeAllRanges(); s.addRange(range);
    } catch (e2) {}
    function done() {
      el.removeAttribute("contenteditable");
      el.removeEventListener("blur", done);
      el.removeEventListener("keydown", onKey);
      el.textContent = el.textContent.replace(/\s+/g, " ").trim();
    }
    function onKey(ev) {
      if (ev.key === "Enter") { ev.preventDefault(); el.blur(); }
      else if (ev.key === "Escape") { ev.preventDefault(); el.blur(); }
    }
    el.addEventListener("blur", done);
    el.addEventListener("keydown", onKey);
  }
  ARPO.inlineEdit = inlineEdit;

  function makeSection(d) {
    d = d || { title: "", items: [] };
    var sec = document.createElement("div");
    sec.className = "cs-section";
    sec.innerHTML =
      '<div class="cs-section-head">' +
        ARPO.dragHandle("cs-sec-handle") +
        '<input class="cs-title-input" placeholder="Section title — e.g. Abilities" value="' + esc(d.title || "") + '">' +
        '<button type="button" class="cs-mini danger" data-sv="del" title="Remove section">✕</button>' +
      "</div>" +
      '<div class="cs-zone"><div class="cs-items"></div>' + addControlHTML() + "</div>";
    var wrap = sec.querySelector(".cs-items");
    (d.items || []).forEach(function (it) { wrap.appendChild(makeItem(it.type, it)); });
    if (ARPO.sortable) ARPO.sortable(wrap, { item: ".cs-item", handle: ".cs-item-handle" });
    return sec;
  }

  var DEFAULT_ADD_SECTION = "Add section";

  ARPO.createSectionsEditor = function (container, addButton, renameButton) {
    function addSection(d) { container.appendChild(makeSection(d)); }

    // The add-section button label can be renamed (pencil). Keep the "＋ ".
    var addLabelEl = addButton && addButton.querySelector(".add-label");
    if (addButton) addButton.addEventListener("click", function (e) {
      if (e.target.isContentEditable) return;   // ignore clicks while renaming
      addSection();
    });
    if (renameButton && addLabelEl) renameButton.addEventListener("click", function () { inlineEdit(addLabelEl); });
    if (ARPO.sortable) ARPO.sortable(container, { item: ".cs-section", handle: ".cs-sec-handle" });

    container.addEventListener("change", function (e) {
      var sel = e.target.closest(".cs-add-type");
      if (sel) addElementFrom(sel);
    });
    container.addEventListener("click", function (e) {
      if (itemClick(e)) return;
      var sv = e.target.closest('[data-sv="del"]');
      if (sv) { sv.closest(".cs-section").remove(); return; }
    });
    container.addEventListener("input", itemInput);

    function serialize() {
      var out = [];
      [].forEach.call(container.querySelectorAll(".cs-section"), function (sec) {
        var title = sec.querySelector(".cs-title-input").value.trim();
        var items = serializeItems(sec);
        if (title || items.length) out.push({ title: title, items: items });
      });
      return out;
    }

    function load(sections) {
      container.innerHTML = "";
      (sections || []).forEach(function (s) { addSection(s); });
    }

    function addLabel() { return addLabelEl ? addLabelEl.textContent.trim() : ""; }
    function setAddLabel(t) { if (addLabelEl && t) addLabelEl.textContent = t; }

    return { serialize: serialize, load: load, addSection: addSection,
      addLabel: addLabel, setAddLabel: setAddLabel, DEFAULT_ADD_LABEL: DEFAULT_ADD_SECTION };
  };

  // ---- per-block enhancements: rename each block, and add custom rows to it -
  var DEFAULT_TITLES = {
    identity: "Identity", characteristics: "Characteristics", about: "About",
    guild: "Guild & Social", currently: "Currently", glance: "At a Glance", custom: "Custom Sections"
  };
  var NO_EXTRAS = { custom: 1 };        // the custom block already has its own add
  var DEFAULT_BLOCK_ADD = "Add element";

  function blockAddControlHTML(label) {
    return '<div class="cs-add block-add">' +
      '<span class="cs-add-label" tabindex="-1">' + esc(label || DEFAULT_BLOCK_ADD) + "</span>" +
      '<button type="button" class="cs-mini add-rename" tabindex="-1" title="Rename" aria-label="Rename add button">✎</button>' +
      '<select class="cs-add-type" aria-label="Add element"><option value="">＋ …</option>' +
        TYPES.map(function (t) { return '<option value="' + t.v + '">' + t.label + "</option>"; }).join("") +
      "</select></div>";
  }

  // Give every built-in section a rename pencil and (optionally) a zone for
  // custom rows. Bind one delegated handler on the wrap, skipping the custom
  // block's own editor subtree (#sections) so nothing is handled twice.
  ARPO.enhanceBlocks = function (wrap, customContainerId) {
    var noop = { load: function () {}, serialize: function () { return {}; } };
    if (!wrap) return noop;
    var skipSel = customContainerId ? "#" + customContainerId : null;

    [].forEach.call(wrap.querySelectorAll("fieldset[data-section]"), function (fs) {
      var key = fs.dataset.section;
      var legend = fs.querySelector("legend");
      if (legend && !legend.querySelector(".sec-title")) {
        var textNode = null;
        [].forEach.call(legend.childNodes, function (n) {
          if (!textNode && n.nodeType === 3 && n.textContent.trim()) textNode = n;
        });
        var titleText = textNode ? textNode.textContent.trim() : (DEFAULT_TITLES[key] || key);
        if (textNode) textNode.textContent = "";
        var span = document.createElement("span");
        span.className = "sec-title"; span.tabIndex = -1; span.textContent = titleText;
        var pencil = document.createElement("button");
        pencil.type = "button"; pencil.className = "cs-mini sec-rename"; pencil.tabIndex = -1;
        pencil.title = "Rename section"; pencil.setAttribute("aria-label", "Rename section"); pencil.textContent = "✎";
        var chev = legend.querySelector(".sec-collapse");
        // result order: [chev] [title] [pencil] … [sec-ctrls]
        if (chev) { chev.insertAdjacentElement("afterend", pencil); pencil.insertAdjacentElement("beforebegin", span); }
        else { legend.insertAdjacentElement("afterbegin", pencil); legend.insertAdjacentElement("afterbegin", span); }
      }
      if (!NO_EXTRAS[key] && !fs.querySelector(".cs-zone.block-extras")) {
        var zone = document.createElement("div");
        zone.className = "cs-zone block-extras";
        zone.innerHTML = '<div class="cs-items"></div>' + blockAddControlHTML(DEFAULT_BLOCK_ADD);
        fs.appendChild(zone);
        if (ARPO.sortable) ARPO.sortable(zone.querySelector(".cs-items"), { item: ".cs-item", handle: ".cs-item-handle" });
      }
    });

    function outside(e) { return !(skipSel && e.target.closest(skipSel)); }
    wrap.addEventListener("change", function (e) {
      if (!outside(e)) return;
      var sel = e.target.closest(".cs-add-type");
      if (sel) addElementFrom(sel);
    });
    wrap.addEventListener("click", function (e) {
      var rp = e.target.closest(".sec-rename");
      if (rp) { var l = rp.closest("legend"); inlineEdit(l && l.querySelector(".sec-title")); return; }
      var ar = e.target.closest(".add-rename");
      if (ar) { inlineEdit(ar.parentNode.querySelector(".cs-add-label")); return; }
      if (outside(e)) itemClick(e);
    });
    wrap.addEventListener("input", function (e) { if (outside(e)) itemInput(e); });

    function eachBlock(fn) {
      [].forEach.call(wrap.querySelectorAll("fieldset[data-section]"), function (fs) { fn(fs, fs.dataset.section); });
    }

    return {
      load: function (c) {
        var titles = (c && c.sectionTitles) || {};
        var labels = (c && c.addLabels) || {};
        var items = (c && c.blockItems) || {};
        eachBlock(function (fs, key) {
          var span = fs.querySelector("legend .sec-title");
          if (span && titles[key]) span.textContent = titles[key];
          var lbl = fs.querySelector(".block-extras .cs-add-label");
          if (lbl && labels[key]) lbl.textContent = labels[key];
          var zone = fs.querySelector(".block-extras .cs-items");
          if (zone && items[key] && items[key].length) {
            zone.innerHTML = "";
            items[key].forEach(function (it) { zone.appendChild(makeItem(it.type, it)); });
          }
        });
      },
      serialize: function () {
        var sectionTitles = {}, addLabels = {}, blockItems = {};
        eachBlock(function (fs, key) {
          var span = fs.querySelector("legend .sec-title");
          if (span) {
            var t = span.textContent.trim();
            if (t && t !== (DEFAULT_TITLES[key] || key)) sectionTitles[key] = t;
          }
          var lbl = fs.querySelector(".block-extras .cs-add-label");
          if (lbl) {
            var al = lbl.textContent.trim();
            if (al && al !== DEFAULT_BLOCK_ADD) addLabels[key] = al;
          }
          var zone = fs.querySelector(".block-extras");
          if (zone) { var its = serializeItems(zone); if (its.length) blockItems[key] = its; }
        });
        return { sectionTitles: sectionTitles, addLabels: addLabels, blockItems: blockItems };
      }
    };
  };

  // ---- At a Glance editor (icon + short note; 3 shown, up to 10) ----------
  function makeGlance(d) {
    d = d || {};
    var row = document.createElement("div");
    row.className = "glance-row";
    row.innerHTML =
      ARPO.dragHandle("glance-handle") +
      '<div class="g-icon cs-icon-edit">' +
        '<div class="cs-icon-prev" data-prev></div>' +
        '<input type="hidden" class="g-f" data-k="icon" value="' + esc(d.icon || "") + '">' +
        '<input type="hidden" class="g-f" data-k="iconKind" value="' + esc(d.iconKind || "wow") + '">' +
        '<button type="button" class="btn btn-sm cs-icon-pick">🖼 Icon</button>' +
      "</div>" +
      '<input class="g-f g-text" data-k="text" placeholder="What they\'d notice — e.g. A jagged scar across one eye" value="' + esc(d.text || "") + '">' +
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
    if (ARPO.sortable) ARPO.sortable(container, { item: ".glance-row", handle: ".glance-handle" });

    container.addEventListener("click", function (e) {
      var del = e.target.closest('[data-g="del"]');
      if (del) { del.closest(".glance-row").remove(); syncAdd(); return; }
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
