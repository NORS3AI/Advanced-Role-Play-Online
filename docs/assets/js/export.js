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

  // Build the character-sheet DOM node (styled by .sheet in styles.css).
  ARPO.buildSheet = function (c, forExport) {
    var accent = c.accent || "#d4af6a";
    var status = c.rpStatus === "ic"
      ? '<span class="pill ic"><span class="dot"></span>In Character</span>'
      : '<span class="pill ooc"><span class="dot"></span>Out of Character</span>';

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
      '<div class="body">' +
        statRow(c) +
        (c.quote ? '<p class="text" style="font-style:italic;color:#d4af6a">“' + esc(c.quote) + '”</p>' : "") +
        section("Physical Description", c.physical) +
        section("Personality", c.personality) +
        section("History", c.history) +
        (c.currently ? section("Currently", c.currently) : "") +
      "</div>" +
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
        block("Currently", c.currently) +
        '<hr><div style="color:#999;font-size:12px">Advanced Role Play Online &middot; ' +
          (c.rpStatus === "ic" ? "In Character" : "Out of Character") + "</div>" +
      "</body></html>";

    download(new Blob(["﻿", html], { type: "application/msword" }), safeName(c, "doc"));
    ARPO.toast("Saved Word document");
  };
})();
