/* Advanced Role Play Online — character storage (browser localStorage).
   Characters are saved in this browser only. No account required. */
(function () {
  "use strict";
  var ARPO = (window.ARPO = window.ARPO || {});
  var KEY = "arpo:characters:v1";

  // Accent colors offered when creating a character.
  ARPO.ACCENTS = [
    "#d4af6a", "#c0392b", "#8e44ad", "#2980b9",
    "#27ae60", "#16a085", "#e67e22", "#7f8c9b"
  ];

  ARPO.uid = function () {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return "c-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
  };

  ARPO.loadAll = function () {
    try {
      var raw = localStorage.getItem(KEY);
      var list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch (e) {
      return [];
    }
  };

  ARPO.saveAll = function (list) {
    try {
      localStorage.setItem(KEY, JSON.stringify(list));
      return true;
    } catch (e) {
      return false;
    }
  };

  ARPO.get = function (id) {
    return ARPO.loadAll().filter(function (c) { return c.id === id; })[0] || null;
  };

  ARPO.upsert = function (char) {
    var list = ARPO.loadAll();
    var now = new Date().toISOString();
    if (!char.id) {
      char.id = ARPO.uid();
      char.createdAt = now;
      char.updatedAt = now;
      list.push(char);
    } else {
      char.updatedAt = now;
      var found = false;
      list = list.map(function (c) {
        if (c.id === char.id) { found = true; char.createdAt = c.createdAt || now; return char; }
        return c;
      });
      if (!found) { char.createdAt = now; list.push(char); }
    }
    ARPO.saveAll(list);
    return char;
  };

  ARPO.remove = function (id) {
    ARPO.saveAll(ARPO.loadAll().filter(function (c) { return c.id !== id; }));
  };

  // ---- display helpers ---------------------------------------------------
  ARPO.fullName = function (c) {
    var n = [c.title, c.firstName, c.lastName].filter(Boolean).join(" ").trim();
    return n || "Unnamed character";
  };
  ARPO.initials = function (c) {
    var a = (c.firstName || "").trim(), b = (c.lastName || "").trim();
    var s = ((a[0] || "") + (b[0] || "")).toUpperCase();
    return s || (a[0] || "?").toUpperCase();
  };
  ARPO.raceClass = function (c) {
    return [c.race, c.charClass].filter(Boolean).join(" · ");
  };
  ARPO.escapeHtml = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (ch) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch];
    });
  };
  ARPO.accent = function (c) { return (c && c.accent) || "#d4af6a"; };

  // Avatar = dark tile with the chosen icon (or initials) in the accent color.
  ARPO.avatarStyle = function (c) {
    var a = ARPO.accent(c);
    return "background:#12151f;border:1px solid " + a + "66;color:" + a;
  };
  ARPO.avatarInner = function (c, size) {
    if (c && c.icon && ARPO.iconSVG) {
      var svg = ARPO.iconSVG(c.icon, { size: size || 28 });
      if (svg) return svg;
    }
    return ARPO.escapeHtml(ARPO.initials(c));
  };

  // ---- toast -------------------------------------------------------------
  ARPO.toast = function (msg) {
    var el = document.querySelector(".toast");
    if (!el) { el = document.createElement("div"); el.className = "toast"; document.body.appendChild(el); }
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.classList.remove("show"); }, 2200);
  };
})();
