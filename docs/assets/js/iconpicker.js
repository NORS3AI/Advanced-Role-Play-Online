/* Advanced Role Play Online — modal icon picker.
   A Pinterest-style overlay: search + WoW/Simple filter, lazy fade-in grid over
   the full WoW library (or the bundled Simple set). Calls onPick(kind, name). */
(function () {
  "use strict";
  var ARPO = (window.ARPO = window.ARPO || {});

  ARPO.openIconPicker = function (opts) {
    opts = opts || {};
    var BATCH = 120;
    var src = opts.kind === "svg" ? "svg" : "wow";
    var master = ARPO._wowLib || ARPO.WOW_ICONS;
    var filtered = master, shown = 0, sentinel = null, obs = null;

    var overlay = document.createElement("div");
    overlay.className = "icon-modal";
    overlay.innerHTML =
      '<div class="icon-modal-panel" role="dialog" aria-label="Choose an icon">' +
        '<div class="icon-modal-head">' +
          '<div class="seg">' +
            '<button type="button" class="seg-btn" data-src="wow">WoW Icons</button>' +
            '<button type="button" class="seg-btn" data-src="svg">Simple</button>' +
          "</div>" +
          '<input type="search" class="icon-modal-search" placeholder="Search icons — sword, holy, wolf…">' +
          '<button type="button" class="icon-modal-close" aria-label="Close">✕</button>' +
        "</div>" +
        '<div class="icon-modal-count"></div>' +
        '<div class="icon-modal-grid"></div>' +
      "</div>";
    document.body.appendChild(overlay);

    var search = overlay.querySelector(".icon-modal-search");
    var grid = overlay.querySelector(".icon-modal-grid");
    var countEl = overlay.querySelector(".icon-modal-count");
    var seg = overlay.querySelector(".seg");
    function markSeg() { [].forEach.call(seg.children, function (x) { x.classList.toggle("active", x.dataset.src === src); }); }

    function tile(kind, name) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "im-tile" + (kind === "svg" ? " im-svg" : "") + (kind === opts.kind && name === opts.value ? " sel" : "");
      b.dataset.kind = kind; b.dataset.name = name; b.title = name;
      if (kind === "svg") {
        b.innerHTML = ARPO.iconSVG(name, { size: 24 });
      } else {
        var img = document.createElement("img");
        img.alt = ""; img.loading = "lazy";
        img.addEventListener("load", function () { img.classList.add("loaded"); });
        img.addEventListener("error", function () { b.style.display = "none"; });
        img.src = ARPO.wowIconUrl(name, "medium");
        b.appendChild(img);
      }
      b.addEventListener("click", function () { if (opts.onPick) opts.onPick(kind, name); close(); });
      return b;
    }
    function updateCount() {
      if (!filtered.length) { countEl.textContent = "No icons match your search."; return; }
      countEl.textContent = (src === "svg" || shown >= filtered.length)
        ? filtered.length.toLocaleString() + " icons"
        : "Showing " + shown + " of " + filtered.length.toLocaleString() + " icons — scroll for more";
    }
    function appendBatch() {
      var end = src === "svg" ? filtered.length : Math.min(shown + BATCH, filtered.length);
      var frag = document.createDocumentFragment();
      for (var i = shown; i < end; i++) frag.appendChild(tile(src, src === "svg" ? filtered[i].key : filtered[i]));
      shown = end;
      grid.insertBefore(frag, sentinel);
      updateCount();
      if (shown >= filtered.length && obs) obs.unobserve(sentinel);
    }
    // Add batches (one per frame, so layout settles between them) until the
    // grid actually overflows its panel and becomes a real scroll area —
    // otherwise there's nothing to scroll and the observer, which only fires
    // on state changes, never asks for more. The scroll then loads the rest.
    function ensureFilled() {
      if (!overlay.isConnected || src === "svg") return;
      if (shown >= filtered.length || shown >= 1000) return;   // cap; scroll loads the rest
      if (grid.scrollHeight > grid.clientHeight + 40) return;   // already scrollable
      appendBatch();
      requestAnimationFrame(ensureFilled);
    }
    function reset(q) {
      q = (q || "").trim().toLowerCase();
      if (src === "svg") filtered = ARPO.ICONS.filter(function (i) { return !q || i.key.indexOf(q) !== -1 || i.label.indexOf(q) !== -1; });
      else filtered = q ? master.filter(function (n) { return n.indexOf(q) !== -1; }) : master;
      grid.innerHTML = ""; shown = 0;
      sentinel = document.createElement("div"); sentinel.className = "wow-sentinel";
      grid.appendChild(sentinel);
      if (!obs) obs = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) appendBatch(); }); }, { root: grid, rootMargin: "300px" });
      obs.observe(sentinel);
      appendBatch();
      ensureFilled();
    }

    var t;
    search.addEventListener("input", function () { clearTimeout(t); t = setTimeout(function () { reset(search.value); }, 150); });
    search.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        var v = search.value.trim().toLowerCase();
        if (src === "wow" && v) { if (opts.onPick) opts.onPick("wow", v); close(); }
      }
    });
    seg.addEventListener("click", function (e) {
      var btn = e.target.closest(".seg-btn"); if (!btn) return;
      src = btn.dataset.src; markSeg(); reset(search.value);
    });
    // Fallback to the IntersectionObserver: load the next batch as the grid
    // nears its bottom (covers browsers where the sentinel observer misfires).
    grid.addEventListener("scroll", function () {
      if (src === "svg" || shown >= filtered.length) return;
      if (grid.scrollTop + grid.clientHeight >= grid.scrollHeight - 400) appendBatch();
    });

    function onKey(e) { if (e.key === "Escape") close(); }
    function close() { document.removeEventListener("keydown", onKey); overlay.remove(); }
    overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });
    overlay.querySelector(".icon-modal-close").addEventListener("click", close);
    document.addEventListener("keydown", onKey);

    markSeg();
    reset("");
    ARPO.loadWowLibrary().then(function (list) { master = list; if (src === "wow") reset(search.value); });
    setTimeout(function () { search.focus(); }, 30);
    return overlay;
  };
})();
