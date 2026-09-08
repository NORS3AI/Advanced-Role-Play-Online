/* Advanced Role Play Online — bundled character icons (self-contained SVG).
   Each icon is 24x24, uses currentColor, and renders/export-captures cleanly. */
(function () {
  "use strict";
  var ARPO = (window.ARPO = window.ARPO || {});
  var L = 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';

  ARPO.ICONS = [
    { key: "sword",     label: "sword blade melee warrior",
      svg: '<path fill="currentColor" d="M12 2l2 4v7h-4V6z"/><path fill="currentColor" d="M7 13h10v2H7z"/><path fill="currentColor" d="M11 15h2v4h-2z"/><circle cx="12" cy="20.5" r="1.5" fill="currentColor"/>' },
    { key: "dagger",    label: "dagger knife rogue",
      svg: '<path fill="currentColor" d="M12 2l1.6 4v6h-3.2V6z"/><path fill="currentColor" d="M9 12h6v1.6H9z"/><path fill="currentColor" d="M11 13.6h2v4.4h-2z"/>' },
    { key: "axe",       label: "axe warrior barbarian",
      svg: '<path '+L+' d="M12 22V8"/><path fill="currentColor" d="M12 8c-3.2 0-5.3-1-6.4-3 3.2-1.2 5.5-1.2 6.4.2zm0 0c3.2 0 5.3-1 6.4-3-3.2-1.2-5.5-1.2-6.4.2z"/>' },
    { key: "bow",       label: "bow arrow hunter ranger archer",
      svg: '<g '+L+'><path d="M6 3a13 13 0 0 1 0 18"/><path d="M6 3v18"/><path d="M4 12h15"/><path d="M16 9l3 3-3 3"/></g>' },
    { key: "shield",    label: "shield guardian tank defender protector",
      svg: '<path fill="currentColor" d="M12 2l8 3v6c0 5-3.4 8.6-8 10.5C7.4 19.6 4 16 4 11V5z"/>' },
    { key: "staff",     label: "staff mage wizard sorcerer caster",
      svg: '<path '+L+' d="M12 22V9"/><circle cx="12" cy="6" r="3.2" fill="currentColor"/>' },
    { key: "wand",      label: "wand spell magic sparkle",
      svg: '<path '+L+' d="M4 20l9-9"/><path fill="currentColor" d="M17 3l1 3 3 1-3 1-1 3-1-3-3-1 3-1z"/>' },
    { key: "flame",     label: "flame fire pyromancer",
      svg: '<path fill="currentColor" d="M12 2c1.6 3.6 5 5 5 9a5 5 0 0 1-10 0c0-1.3.5-2.5 1.3-3.4.4 1 1.3 1.7 2.3 1.7-1.1-2.1 0-4.6 1.4-7.3z"/>' },
    { key: "snowflake", label: "snowflake frost ice mage",
      svg: '<g '+L+'><path d="M12 2v20"/><path d="M4 7l16 10"/><path d="M20 7L4 17"/><path d="M12 6l-2.2-2.2M12 6l2.2-2.2M12 18l-2.2 2.2M12 18l2.2 2.2"/></g>' },
    { key: "bolt",      label: "lightning bolt storm shaman thunder",
      svg: '<path fill="currentColor" d="M13 2L4 14h6l-1 8 9-12h-6z"/>' },
    { key: "sun",       label: "sun holy light paladin priest",
      svg: '<circle cx="12" cy="12" r="4.5" fill="currentColor"/><g '+L+'><path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3M4.5 4.5l2.1 2.1M17.4 17.4l2.1 2.1M19.5 4.5l-2.1 2.1M6.6 17.4l-2.1 2.1"/></g>' },
    { key: "moon",      label: "moon night druid shadow",
      svg: '<path fill="currentColor" d="M20 14.5A8.5 8.5 0 1 1 9.5 4 6.8 6.8 0 0 0 20 14.5z"/>' },
    { key: "skull",     label: "skull death warlock necromancer undead",
      svg: '<path '+L+' d="M6 17c-1.2-1.2-2-2.9-2-5a8 8 0 0 1 16 0c0 2.1-.8 3.8-2 5v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1z"/><circle cx="9.2" cy="11.6" r="1.6" fill="currentColor"/><circle cx="14.8" cy="11.6" r="1.6" fill="currentColor"/><path '+L+' d="M12 15v2M9 20.5v-1.5M12 20.5v-1.5M15 20.5v-1.5"/>' },
    { key: "heart",     label: "heart healer love support",
      svg: '<path fill="currentColor" d="M12 20.5l-1.4-1.3C5.4 14.5 2 11.4 2 7.6 2 4.9 4.1 3 6.8 3 8.3 3 9.8 3.7 12 6c2.2-2.3 3.7-3 5.2-3C19.9 3 22 4.9 22 7.6c0 3.8-3.4 6.9-8.6 11.6z"/>' },
    { key: "book",      label: "book tome scholar spellbook lore",
      svg: '<g '+L+'><path d="M12 5C10 4 6.2 3.4 3 4.4V18.4C6.2 17.4 10 18 12 19"/><path d="M12 5C14 4 17.8 3.4 21 4.4V18.4C17.8 17.4 14 18 12 19"/><path d="M12 5.2V19"/></g>' },
    { key: "scroll",    label: "scroll lore document letter",
      svg: '<g '+L+'><path d="M6 4h9a2 2 0 0 1 2 2v11a3 3 0 0 0 3 3H9a3 3 0 0 1-3-3z"/><path d="M6 4a2 2 0 0 0-2 2v2h4"/><path d="M9 9h5M9 12h5"/></g>' },
    { key: "potion",    label: "potion flask alchemy elixir",
      svg: '<g '+L+'><path d="M9 3h6"/><path d="M10 3v5l-4.6 8.6A2 2 0 0 0 7.2 20h9.6a2 2 0 0 0 1.8-3.4L14 8V3"/><path d="M7.4 14h9.2"/></g>' },
    { key: "crown",     label: "crown king queen royal noble ruler",
      svg: '<path fill="currentColor" d="M3 7l4 4 5-6 5 6 4-4-1.4 12H4.4z"/>' },
    { key: "gem",       label: "gem crystal jewel arcane",
      svg: '<g '+L+'><path d="M6 3h12l3 6-9 12L3 9z"/><path d="M3 9h18M9 3L6 9l6 12 6-12-3-6"/></g>' },
    { key: "paw",       label: "paw beast druid hunter animal",
      svg: '<circle cx="6.5" cy="10.5" r="1.8" fill="currentColor"/><circle cx="10.2" cy="7.5" r="1.9" fill="currentColor"/><circle cx="13.8" cy="7.5" r="1.9" fill="currentColor"/><circle cx="17.5" cy="10.5" r="1.8" fill="currentColor"/><ellipse cx="12" cy="16" rx="4.3" ry="3.5" fill="currentColor"/>' },
    { key: "leaf",      label: "leaf nature druid herbalist",
      svg: '<path fill="currentColor" d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14z"/>' },
    { key: "eye",       label: "eye seer vision watcher",
      svg: '<g '+L+'><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/></g><circle cx="12" cy="12" r="2.6" fill="currentColor"/>' },
    { key: "music",     label: "music note bard minstrel song",
      svg: '<g '+L+'><path d="M9 18V5l10-2v13"/></g><circle cx="6.5" cy="18" r="2.5" fill="currentColor"/><circle cx="16.5" cy="16" r="2.5" fill="currentColor"/>' },
    { key: "anchor",    label: "anchor sailor sea ship kul tiras",
      svg: '<g '+L+'><circle cx="12" cy="5" r="2"/><path d="M12 7v13"/><path d="M8 11h8"/><path d="M5 13a7 7 0 0 0 14 0"/></g>' },
    { key: "mask",      label: "mask rogue trickster drama actor",
      svg: '<g '+L+'><path d="M4 7c0-1 4-2 8-2s8 1 8 2c0 7-4 11-8 11S4 14 4 7z"/><path d="M8 10c1-1 3-1 4 0M12 10c1-1 3-1 4 0"/></g>' },
    { key: "star",      label: "star fate destiny hero",
      svg: '<path fill="currentColor" d="M12 2.5l2.9 5.9 6.6.9-4.8 4.6 1.2 6.6L12 17.9 6.1 20.5l1.2-6.6L2.5 9.3l6.6-.9z"/>' },
    { key: "feather",   label: "feather quill scribe writer",
      svg: '<g '+L+'><path d="M20 4C11 4 6 9 6 17l-2 3"/><path d="M20 4c0 6-4 10-10 11"/><path d="M7.5 14.5H14"/></g>' }
  ];

  ARPO.ICON_MAP = {};
  ARPO.ICONS.forEach(function (i) { ARPO.ICON_MAP[i.key] = i; });

  ARPO.iconSVG = function (key, opts) {
    opts = opts || {};
    var ic = ARPO.ICON_MAP[key];
    if (!ic) return "";
    var size = opts.size || 24;
    return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size +
      '" fill="none" aria-hidden="true" style="display:block">' + ic.svg + "</svg>";
  };
})();
