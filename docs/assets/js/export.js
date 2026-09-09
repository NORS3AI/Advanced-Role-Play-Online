/* Advanced Role Play Online — character sheet rendering + export (PNG / PDF / Word). */
(function () {
  "use strict";
  var ARPO = (window.ARPO = window.ARPO || {});
  var esc = ARPO.escapeHtml;

  var CHARACTERISTICS = [
    ["race", "Race"], ["charClass", "Class"], ["age", "Age"], ["pronouns", "Pronouns"],
    ["height", "Height"], ["weight", "Weight"], ["eyeColor", "Eyes"], ["alignment", "Alignment"],
    ["birthplace", "Birthplace"], ["residence", "Residence"]
  ];

  function statRow(c) {
    var cells = CHARACTERISTICS
      .filter(function (f) { return c[f[0]]; })
      .map(function (f) {
        return '<div class="stat"><span class="k">' + esc(f[1]) +
          '</span><span class="v">' + esc(c[f[0]]) + "</span></div>";
      }).join("");
    return cells ? '<div class="row">' + cells + "</div>" : "";
  }

  function section(title, text) {
    if (!text) return "";
    return "<h3>" + esc(title) + '</h3><p class="text">' + esc(text) + "</p>";
  }

  // Characteristics stat grid, honoring the character's field order.
  function renderCharacteristics(c) {
    var fields = ARPO.fieldsOf(c, "characteristics").filter(function (k) { return c[k]; });
    if (!fields.length) return "";
    var cells = fields.map(function (k) {
      return '<div class="stat"><span class="k">' + esc(ARPO.FIELD_LABELS[k] || k) +
        '</span><span class="v">' + esc(c[k]) + "</span></div>";
    }).join("");
    return '<div class="row">' + cells + "</div>";
  }
  // About blocks (quote / physical / personality / history), honoring field order.
  function renderAbout(c) {
    var titles = { physical: "Physical Description", personality: "Personality", history: "History" };
    return ARPO.fieldsOf(c, "about").map(function (k) {
      if (!c[k]) return "";
      if (k === "quote") return '<p class="text" style="font-style:italic;color:#d4af6a">“' + esc(c.quote) + "”</p>";
      return section(titles[k], c[k]);
    }).join("");
  }
  function renderCurrentlyBlock(c) { return c.currently ? section("Currently", c.currently) : ""; }

  // ---- custom sections ---------------------------------------------------
  function csItem(it, forExport) {
    var lbl = it.label ? esc(it.label) : "";
    if (it.type === "text") {
      if (!it.value && !lbl) return "";
      return (lbl ? '<h4 class="cs-h">' + lbl + "</h4>" : "") +
        (it.value ? '<p class="text">' + esc(it.value) + "</p>" : "");
    }
    if (it.type === "slider") {
      var min = Number(it.min || 0), max = Number(it.max != null ? it.max : 100), val = Number(it.value || 0);
      var pct = max > min ? Math.max(0, Math.min(100, Math.round((val - min) / (max - min) * 100))) : 0;
      return '<div class="cs-slider"><div class="cs-slider-head"><span>' + (lbl || "") +
        '</span><span class="cs-num">' + esc(val) + " / " + esc(max) + "</span></div>" +
        '<div class="cs-bar"><div class="cs-fill" style="width:' + pct + '%"></div></div></div>';
    }
    if (it.type === "comparison") {
      var left = esc(it.left || ""), right = esc(it.right || "");
      if (!left && !right) return "";
      var cv = Number(it.value != null ? it.value : 50);
      cv = Math.max(0, Math.min(100, isNaN(cv) ? 50 : cv));
      var leftPct = 100 - cv, rightPct = cv;
      var high = it.colorHigh || "#27ae60", low = it.colorLow || "#c0392b";
      var leftColor = leftPct >= rightPct ? high : low;
      var rightColor = rightPct > leftPct ? high : low;
      return '<div class="cs-cmp"><div class="cs-cmp-head"><span>' + left + "</span><span>" + right + "</span></div>" +
        '<div class="cs-cmp-bar">' +
          '<span style="width:' + leftPct + '%;background:' + esc(leftColor) + '"></span>' +
          '<span style="width:' + rightPct + '%;background:' + esc(rightColor) + '"></span>' +
        "</div></div>";
    }
    if (it.type === "link") {
      if (!it.url) return "";
      return '<p class="cs-link">🔗 <a href="' + esc(it.url) + '" target="_blank" rel="noopener noreferrer">' +
        (lbl || esc(it.url)) + "</a></p>";
    }
    if (it.type === "button") {
      if (!it.url) return "";
      return '<p><a class="btn btn-sm cs-btn" href="' + esc(it.url) + '" target="_blank" rel="noopener noreferrer">' +
        (lbl || "Open") + "</a></p>";
    }
    if (it.type === "icon") {
      var ic = ARPO.inlineIcon(it.iconKind, it.icon, 28, forExport);
      if (!ic && !lbl) return "";
      return '<div class="cs-iconrow"><span class="cs-ic">' + ic + "</span>" + (lbl ? "<span>" + lbl + "</span>" : "") + "</div>";
    }
    if (it.type === "image") {
      if (!it.url) return "";
      var co = forExport ? ' crossorigin="anonymous"' : "";
      return '<figure class="cs-image"><img alt=""' + co + ' src="' + esc(it.url) +
        '" onerror="this.style.display=\'none\'">' + (lbl ? "<figcaption>" + lbl + "</figcaption>" : "") + "</figure>";
    }
    return "";
  }
  // Guild & Social block (rendered above Currently).
  function renderGuild(c) {
    if (!c.guildName && !c.guildRank && !c.guildInfo) return "";
    var line = "";
    if (c.guildName || c.guildRank) {
      line = '<p class="guild-line">' +
        (c.guildName ? "<strong>" + esc(c.guildName) + "</strong>" : "") +
        (c.guildRank ? '<span class="rank"> ' + (c.guildName ? "— " : "") + esc(c.guildRank) + "</span>" : "") +
        "</p>";
    }
    return "<h3>Guild &amp; Social</h3>" + line + (c.guildInfo ? '<p class="text">' + esc(c.guildInfo) + "</p>" : "");
  }
  ARPO.renderGuild = renderGuild;

  // "At a Glance" strip (rendered after Currently).
  function renderGlances(c, forExport) {
    var g = (c.glances || []).filter(function (x) { return x.text || x.icon; });
    if (!g.length) return "";
    return '<h3>At a Glance</h3><div class="glances">' + g.map(function (x) {
      var ic = ARPO.inlineIcon(x.iconKind, x.icon, 28, forExport);
      return '<div class="glance"><span class="cs-ic">' + ic + '</span><span class="g-txt">' + esc(x.text || "") + "</span></div>";
    }).join("") + "</div>";
  }
  ARPO.renderGlances = renderGlances;

  ARPO.renderCustomSections = function (c, forExport) {
    var secs = (c && c.customSections) || [];
    if (!secs.length) return "";
    return secs.map(function (s) {
      var items = (s.items || []).map(function (it) { return csItem(it, forExport); }).join("");
      if (!items && !s.title) return "";
      return (s.title ? "<h3>" + esc(s.title) + "</h3>" : "") + items;
    }).join("");
  };

  function wordGuild(c, accent) {
    if (!c.guildName && !c.guildRank && !c.guildInfo) return "";
    var h = '<h2 style="color:' + accent + ';font-family:Georgia,serif;margin:16px 0 4px">Guild &amp; Social</h2>';
    var line = (c.guildName || c.guildRank)
      ? '<p style="margin:0 0 6px">' + (c.guildName ? "<b>" + esc(c.guildName) + "</b>" : "") + (c.guildRank ? " — " + esc(c.guildRank) : "") + "</p>" : "";
    return h + line + (c.guildInfo ? '<p style="margin:0 0 8px">' + esc(c.guildInfo).replace(/\n/g, "<br>") + "</p>" : "");
  }
  function wordGlances(c, accent) {
    var g = (c.glances || []).filter(function (x) { return x.text || x.icon; });
    if (!g.length) return "";
    var rows = g.map(function (x) {
      var img = x.iconKind === "wow" && x.icon ? '<img src="' + esc(ARPO.wowIconUrl(x.icon)) + '" width="18" height="18"> ' : "";
      return "<li>" + img + esc(x.text || "") + "</li>";
    }).join("");
    return '<h2 style="color:' + accent + ';font-family:Georgia,serif;margin:16px 0 4px">At a Glance</h2><ul style="margin:0 0 8px">' + rows + "</ul>";
  }

  // Word (.doc) rendering of custom sections.
  function wordCustom(c, accent) {
    var secs = (c && c.customSections) || [];
    if (!secs.length) return "";
    return secs.map(function (s) {
      var body = (s.items || []).map(function (it) {
        var lbl = it.label ? esc(it.label) : "";
        if (it.type === "text") return (lbl ? "<p><b>" + lbl + "</b></p>" : "") + (it.value ? '<p style="margin:0 0 8px">' + esc(it.value).replace(/\n/g, "<br>") + "</p>" : "");
        if (it.type === "slider") return '<p style="margin:0 0 6px">' + (lbl ? "<b>" + lbl + ":</b> " : "") + esc(it.value != null ? it.value : "") + " / " + esc(it.max != null ? it.max : 100) + "</p>";
        if (it.type === "comparison") { var l = esc(it.left || ""), r = esc(it.right || ""), v = Number(it.value != null ? it.value : 50); return (l || r) ? '<p style="margin:0 0 6px">' + l + " " + (100 - v) + " — " + v + " " + r + "</p>" : ""; }
        if (it.type === "link" || it.type === "button") return it.url ? '<p style="margin:0 0 6px"><a href="' + esc(it.url) + '">' + (lbl || esc(it.url)) + "</a></p>" : "";
        if (it.type === "icon") {
          var img = it.iconKind === "wow" && it.icon ? '<img src="' + esc(ARPO.wowIconUrl(it.icon)) + '" width="20" height="20"> ' : "";
          return (img || lbl) ? '<p style="margin:0 0 6px">' + img + lbl + "</p>" : "";
        }
        if (it.type === "image") return it.url ? '<p style="margin:0 0 6px"><img src="' + esc(it.url) + '" style="max-width:420px"><br>' + lbl + "</p>" : "";
        return "";
      }).join("");
      if (!body && !s.title) return "";
      return (s.title ? '<h2 style="color:' + accent + ';font-family:Georgia,serif;margin:16px 0 4px">' + esc(s.title) + "</h2>" : "") + body;
    }).join("");
  }

  // Build the character-sheet DOM node (styled by .sheet in styles.css).
  ARPO.buildSheet = function (c, forExport) {
    var accent = c.accent || "#d4af6a";
    var status = c.rpStatus === "ic"
      ? '<span class="pill ic"><span class="dot"></span>In Character</span>'
      : '<span class="pill ooc"><span class="dot"></span>Out of Character</span>';

    var renderers = {
      identity: function () { return ""; },   // shown in the banner
      characteristics: renderCharacteristics,
      about: renderAbout,
      guild: renderGuild,
      currently: renderCurrentlyBlock,
      glance: function (x) { return renderGlances(x, forExport); },
      custom: function (x) { return ARPO.renderCustomSections(x, forExport); }
    };
    var body = ARPO.orderList(c.sectionOrder, ARPO.SECTIONS).map(function (k) {
      return renderers[k] ? renderers[k](c) : "";
    }).join("");

    var el = document.createElement("div");
    el.className = "sheet";
    el.innerHTML =
      '<div class="banner">' +
        '<div class="avatar" style="' + ARPO.avatarStyle(c) + '">' +
          ARPO.avatarInner(c, 40, forExport) + "</div>" +
        "<div>" +
          '<div class="full">' + esc(ARPO.fullName(c)) + "</div>" +
          (c.fullTitle ? '<div class="title">' + esc(c.fullTitle) + "</div>" : "") +
          '<div class="sub">' + (ARPO.raceClass(c) || "") +
            (c.nickname ? (ARPO.raceClass(c) ? " &middot; " : "") + '“' + esc(c.nickname) + '”' : "") +
          "</div>" +
        "</div>" +
      "</div>" +
      '<div class="body">' + body + "</div>" +
      '<div class="foot"><span>Advanced Role Play Online</span>' + status + "</div>";
    return el;
  };

  function renderOffscreen(c) {
    var host = document.createElement("div");
    host.className = "export-host";
    var sheet = ARPO.buildSheet(c, true);
    host.appendChild(sheet);
    document.body.appendChild(host);
    return { host: host, sheet: sheet };
  }

  function download(blobOrUrl, filename) {
    var url = typeof blobOrUrl === "string" ? blobOrUrl : URL.createObjectURL(blobOrUrl);
    var a = document.createElement("a");
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    if (typeof blobOrUrl !== "string") setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
  }

  function safeName(c, ext) {
    var base = ARPO.fullName(c).replace(/[^\w\- ]+/g, "").trim().replace(/\s+/g, "_") || "character";
    return base + "." + ext;
  }

  // ---- PNG ---------------------------------------------------------------
  ARPO.exportPNG = function (c) {
    if (typeof html2canvas !== "function") { ARPO.toast("Image library still loading — try again."); return; }
    var r = renderOffscreen(c);
    html2canvas(r.sheet, { backgroundColor: "#14161f", scale: 2, useCORS: true }).then(function (canvas) {
      canvas.toBlob(function (blob) { download(blob, safeName(c, "png")); ARPO.toast("Saved PNG"); }, "image/png");
      r.host.remove();
    }).catch(function () { r.host.remove(); ARPO.toast("Could not export PNG"); });
  };

  // ---- PDF ---------------------------------------------------------------
  ARPO.exportPDF = function (c) {
    var jsPDFctor = window.jspdf && window.jspdf.jsPDF;
    if (typeof html2canvas !== "function" || !jsPDFctor) { ARPO.toast("PDF library still loading — try again."); return; }
    var r = renderOffscreen(c);
    html2canvas(r.sheet, { backgroundColor: "#14161f", scale: 2, useCORS: true }).then(function (canvas) {
      var img = canvas.toDataURL("image/png");
      var pdf = new jsPDFctor({ unit: "pt", format: "a4" });
      var pw = pdf.internal.pageSize.getWidth();
      var ph = pdf.internal.pageSize.getHeight();
      var margin = 28;
      var w = pw - margin * 2;
      var h = (canvas.height / canvas.width) * w;
      var y = margin;
      if (h <= ph - margin * 2) {
        pdf.addImage(img, "PNG", margin, y, w, h);
      } else {
        // paginate tall sheets
        var pageContentH = ph - margin * 2;
        var sliceH = (pageContentH / h) * canvas.height;
        var sY = 0, first = true;
        while (sY < canvas.height) {
          var part = document.createElement("canvas");
          part.width = canvas.width;
          part.height = Math.min(sliceH, canvas.height - sY);
          part.getContext("2d").drawImage(canvas, 0, sY, canvas.width, part.height, 0, 0, canvas.width, part.height);
          if (!first) pdf.addPage();
          pdf.addImage(part.toDataURL("image/png"), "PNG", margin, margin, w, (part.height / canvas.width) * w);
          sY += sliceH; first = false;
        }
      }
      pdf.save(safeName(c, "pdf"));
      ARPO.toast("Saved PDF");
      r.host.remove();
    }).catch(function () { r.host.remove(); ARPO.toast("Could not export PDF"); });
  };

  // ---- Word (.doc) -------------------------------------------------------
  ARPO.exportWord = function (c) {
    var accent = c.accent || "#d4af6a";
    var block = function (title, text) {
      return text ? '<h2 style="color:' + accent + ';font-family:Georgia,serif;margin:16px 0 4px">' +
        esc(title) + '</h2><p style="white-space:pre-wrap;margin:0 0 8px">' + esc(text).replace(/\n/g, "<br>") + "</p>" : "";
    };
    var stats = CHARACTERISTICS.filter(function (f) { return c[f[0]]; }).map(function (f) {
      return '<tr><td style="color:#666;padding:3px 16px 3px 0">' + esc(f[1]) +
        '</td><td style="padding:3px 0"><b>' + esc(c[f[0]]) + "</b></td></tr>";
    }).join("");

    var html =
      '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">' +
      '<head><meta charset="utf-8"><title>' + esc(ARPO.fullName(c)) + "</title></head>" +
      '<body style="font-family:Calibri,Arial,sans-serif;color:#1a1a1a;max-width:680px">' +
        '<h1 style="font-family:Georgia,serif;margin:0 0 2px">' + esc(ARPO.fullName(c)) + "</h1>" +
        (c.fullTitle ? '<div style="color:' + accent + ';font-size:15px">' + esc(c.fullTitle) + "</div>" : "") +
        '<div style="color:#666;margin:2px 0 14px">' + esc(ARPO.raceClass(c)) +
          (c.nickname ? " &middot; “" + esc(c.nickname) + "”" : "") + "</div>" +
        (c.quote ? '<p style="font-style:italic;color:' + accent + '">“' + esc(c.quote) + '”</p>' : "") +
        (stats ? "<table>" + stats + "</table>" : "") +
        block("Physical Description", c.physical) +
        block("Personality", c.personality) +
        block("History", c.history) +
        wordGuild(c, accent) +
        block("Currently", c.currently) +
        wordGlances(c, accent) +
        wordCustom(c, accent) +
        '<hr><div style="color:#999;font-size:12px">Advanced Role Play Online &middot; ' +
          (c.rpStatus === "ic" ? "In Character" : "Out of Character") + "</div>" +
      "</body></html>";

    download(new Blob(["﻿", html], { type: "application/msword" }), safeName(c, "doc"));
    ARPO.toast("Saved Word document");
  };
})();
