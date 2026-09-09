/* Advanced Role Play Online — drag-and-drop reordering (pointer + touch).
   Dragging only starts from a drag handle, so typing in fields never moves
   anything and mobile/tablet users won't reorder by accident. */
(function () {
  "use strict";
  var ARPO = (window.ARPO = window.ARPO || {});

  var GRIP =
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">' +
    '<circle cx="5" cy="3.5" r="1.4"/><circle cx="11" cy="3.5" r="1.4"/>' +
    '<circle cx="5" cy="8" r="1.4"/><circle cx="11" cy="8" r="1.4"/>' +
    '<circle cx="5" cy="12.5" r="1.4"/><circle cx="11" cy="12.5" r="1.4"/></svg>';

  ARPO.dragHandle = function (cls) {
    return '<span class="drag-handle' + (cls ? " " + cls : "") +
      '" tabindex="-1" title="Drag to reorder" aria-label="Drag to reorder">' + GRIP + "</span>";
  };

  // Reorder direct children matching `opts.item` within `container`, dragging
  // only from `opts.handle`. Works with mouse and touch via Pointer Events.
  ARPO.sortable = function (container, opts) {
    var itemSel = opts.item, handleSel = opts.handle;
    var drag = null, startX = 0, startY = 0, active = false;

    container.addEventListener("pointerdown", function (e) {
      if (e.button != null && e.button > 0) return;             // primary button / touch only
      if (!e.target.closest(handleSel)) return;                  // must grab the handle
      var item = e.target.closest(itemSel);
      if (!item || item.parentNode !== container) return;
      drag = item; startX = e.clientX; startY = e.clientY; active = false;
      window.addEventListener("pointermove", onMove, { passive: false });
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
    });

    function onMove(e) {
      if (!drag) return;
      if (!active) {
        if (Math.abs(e.clientX - startX) + Math.abs(e.clientY - startY) < 6) return;
        active = true;
        drag.classList.add("drag-active");
        container.classList.add("is-sorting");
        drag.style.pointerEvents = "none";        // so elementFromPoint sees siblings
      }
      e.preventDefault();
      var under = document.elementFromPoint(e.clientX, e.clientY);
      var over = under && under.closest(itemSel);
      if (!over || over === drag || over.parentNode !== container) return;
      var r = over.getBoundingClientRect();
      var after;
      if (Math.abs(e.clientY - (r.top + r.height / 2)) < r.height * 0.35) {
        after = (e.clientX - r.left) > r.width / 2;   // same row (grid): use X
      } else {
        after = (e.clientY - r.top) > r.height / 2;   // otherwise: use Y
      }
      container.insertBefore(drag, after ? over.nextElementSibling : over);
    }
    function onUp() {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      if (drag) { drag.style.pointerEvents = ""; drag.classList.remove("drag-active"); }
      container.classList.remove("is-sorting");
      drag = null; active = false;
    }
  };

  ARPO.initReorder = function (form) {
    var wrap = document.getElementById("sortable-sections");
    if (!wrap) return { apply: function () {}, read: function () { return {}; } };

    [].forEach.call(wrap.querySelectorAll("fieldset[data-section]"), function (fs) {
      var legend = fs.querySelector("legend");
      if (legend && !legend.querySelector(".sec-handle")) legend.insertAdjacentHTML("beforeend", ARPO.dragHandle("sec-handle"));
      var cont = fs.querySelector(".fields");
      if (cont) {
        [].forEach.call(cont.querySelectorAll(".field"), function (field) {
          var ctrl = field.querySelector("input, select, textarea");
          if (ctrl && ctrl.name && !field.dataset.field) field.dataset.field = ctrl.name;
          if (!field.querySelector(".fld-handle")) field.insertAdjacentHTML("afterbegin", ARPO.dragHandle("fld-handle"));
        });
        ARPO.sortable(cont, { item: ".field", handle: ".fld-handle" });
      }
    });
    ARPO.sortable(wrap, { item: "fieldset[data-section]", handle: ".sec-handle" });

    return {
      apply: function (sectionOrder, fieldOrder) {
        (sectionOrder || []).forEach(function (key) {
          var fs = wrap.querySelector('fieldset[data-section="' + key + '"]');
          if (fs) wrap.appendChild(fs);
        });
        Object.keys(fieldOrder || {}).forEach(function (sec) {
          var fs = wrap.querySelector('fieldset[data-section="' + sec + '"]');
          var cont = fs && fs.querySelector(".fields");
          if (!cont) return;
          (fieldOrder[sec] || []).forEach(function (fname) {
            var fld = cont.querySelector('.field[data-field="' + fname + '"]');
            if (fld) cont.appendChild(fld);
          });
        });
      },
      read: function () {
        var sectionOrder = [].map.call(wrap.querySelectorAll("fieldset[data-section]"), function (fs) { return fs.dataset.section; });
        var fieldOrder = {};
        [].forEach.call(wrap.querySelectorAll("fieldset[data-section]"), function (fs) {
          var cont = fs.querySelector(".fields"); if (!cont) return;
          var fields = [].map.call(cont.querySelectorAll(".field"), function (f) { return f.dataset.field; }).filter(Boolean);
          if (fields.length) fieldOrder[fs.dataset.section] = fields;
        });
        return { sectionOrder: sectionOrder, fieldOrder: fieldOrder };
      }
    };
  };
})();
