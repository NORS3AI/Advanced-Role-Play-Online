/* Advanced Role Play Online — reorder sections and their fields on the create
   form. Injects ▲▼ controls, swaps DOM nodes, and reads/writes the order. */
(function () {
  "use strict";
  var ARPO = (window.ARPO = window.ARPO || {});

  ARPO.initReorder = function (form) {
    var actions = form.querySelector(".form-actions");

    function sectionEls() { return [].slice.call(form.querySelectorAll("fieldset[data-section]")); }
    function fieldEls(fs) {
      var cont = fs.querySelector(".fields");
      return cont ? [].slice.call(cont.querySelectorAll(".field")) : [];
    }

    // Inject controls once.
    sectionEls().forEach(function (fs) {
      var legend = fs.querySelector("legend");
      if (legend && !legend.querySelector(".sec-move")) {
        var s = document.createElement("span");
        s.className = "sec-move";
        s.innerHTML =
          '<button type="button" class="cs-mini" data-secmv="up" title="Move section up" aria-label="Move section up">▲</button>' +
          '<button type="button" class="cs-mini" data-secmv="down" title="Move section down" aria-label="Move section down">▼</button>';
        legend.appendChild(s);
      }
      fieldEls(fs).forEach(function (field) {
        var ctrl = field.querySelector("input, select, textarea");
        if (ctrl && ctrl.name && !field.dataset.field) field.dataset.field = ctrl.name;
        if (!field.querySelector(".fld-move")) {
          var h = document.createElement("div");
          h.className = "fld-move";
          h.innerHTML =
            '<button type="button" class="cs-mini" data-fldmv="up" title="Move up" aria-label="Move field up">▲</button>' +
            '<button type="button" class="cs-mini" data-fldmv="down" title="Move down" aria-label="Move field down">▼</button>';
          field.appendChild(h);
        }
      });
    });

    // Swap a node with its neighbor within a set (keeps non-members put).
    function swap(node, members, dir) {
      var i = members.indexOf(node), j = dir === "up" ? i - 1 : i + 1;
      if (i < 0 || j < 0 || j >= members.length) return;
      if (dir === "up") node.parentNode.insertBefore(node, members[j]);
      else node.parentNode.insertBefore(members[j], node);
    }

    form.addEventListener("click", function (e) {
      var sm = e.target.closest("[data-secmv]");
      if (sm) { e.preventDefault(); swap(sm.closest("fieldset[data-section]"), sectionEls(), sm.dataset.secmv); return; }
      var fm = e.target.closest("[data-fldmv]");
      if (fm) {
        e.preventDefault();
        var field = fm.closest(".field");
        swap(field, [].slice.call(field.parentNode.querySelectorAll(".field")), fm.dataset.fldmv);
      }
    });

    return {
      apply: function (sectionOrder, fieldOrder) {
        (sectionOrder || []).forEach(function (key) {
          var fs = form.querySelector('fieldset[data-section="' + key + '"]');
          if (fs && actions) form.insertBefore(fs, actions);   // reflow in saved order, before the actions row
        });
        Object.keys(fieldOrder || {}).forEach(function (sec) {
          var fs = form.querySelector('fieldset[data-section="' + sec + '"]');
          var cont = fs && fs.querySelector(".fields");
          if (!cont) return;
          (fieldOrder[sec] || []).forEach(function (fname) {
            var fld = cont.querySelector('.field[data-field="' + fname + '"]');
            if (fld) cont.appendChild(fld);
          });
        });
      },
      read: function () {
        var sectionOrder = sectionEls().map(function (fs) { return fs.dataset.section; });
        var fieldOrder = {};
        sectionEls().forEach(function (fs) {
          var fields = fieldEls(fs).map(function (f) { return f.dataset.field; }).filter(Boolean);
          if (fields.length) fieldOrder[fs.dataset.section] = fields;
        });
        return { sectionOrder: sectionOrder, fieldOrder: fieldOrder };
      }
    };
  };
})();
