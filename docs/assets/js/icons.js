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
      svg: '<g '+L+'><path d="M20 4C11 4 6 9 6 17l-2 3"/><path d="M20 4c0 6-4 10-10 11"/><path d="M7.5 14.5H14"/></g>' },
    { key: "hammer",    label: "hammer maul mace smith warrior",
      svg: '<path fill="currentColor" d="M4 5h14v4H4z"/><path fill="currentColor" d="M9.5 9h3v11h-3z"/>' },
    { key: "spear",     label: "spear lance polearm pike",
      svg: '<path fill="currentColor" d="M12 2l3.2 6H8.8z"/><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M12 8v13M9.5 10h5"/>' },
    { key: "ring",      label: "ring band jewelry wedding",
      svg: '<circle cx="12" cy="14.5" r="6" fill="none" stroke="currentColor" stroke-width="2"/><path fill="currentColor" d="M12 2l2.6 3.6L12 9.2 9.4 5.6z"/>' },
    { key: "lock",      label: "lock secret secure vault",
      svg: '<path fill="currentColor" d="M5 11h14v9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z"/><path fill="none" stroke="currentColor" stroke-width="2" d="M8 11V8a4 4 0 0 1 8 0v3"/>' },
    { key: "key",       label: "key unlock access secret",
      svg: '<circle cx="7.5" cy="8" r="3.6" fill="none" stroke="currentColor" stroke-width="2"/><g '+L+'><path d="M10 10.5L20 20"/><path d="M16 16l2.5-2.5"/><path d="M18 18l1.6-1.6"/></g>' },
    { key: "flag",      label: "flag banner faction guild standard",
      svg: '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M6 3v18"/><path fill="currentColor" d="M6 4h12l-3 3.6L18 11H6z"/>' },
    { key: "tree",      label: "tree pine forest nature wood",
      svg: '<path fill="currentColor" d="M12 2l5 7h-3l4 6H7l4-6H8z"/><path fill="currentColor" d="M11 15h2v5h-2z"/>' },
    { key: "mountain",  label: "mountain peak travel highlands",
      svg: '<path fill="currentColor" d="M3 20l6-11 4 6 2-3 6 8z"/>' },
    { key: "droplet",   label: "droplet blood water rain tear",
      svg: '<path fill="currentColor" d="M12 3c3.5 4.5 6 8 6 11a6 6 0 0 1-12 0c0-3 2.5-6.5 6-11z"/>' },
    { key: "fish",      label: "fish sea food fishing",
      svg: '<path fill="currentColor" d="M2.5 12c4-5 11-5 15 0-4 5-11 5-15 0z"/><path fill="currentColor" d="M17 12l4.5-3v6z"/>' },
    { key: "candle",    label: "candle light lantern flame",
      svg: '<path fill="currentColor" d="M9 9h6v11H9z"/><path fill="currentColor" d="M12 2c2.2 2.2 2.2 4.6 0 6.6-2.2-2-2.2-4.4 0-6.6z"/>' },
    { key: "bell",      label: "bell alarm announce call",
      svg: '<path fill="currentColor" d="M12 3a5 5 0 0 0-5 5c0 4-2 6-2 6h14s-2-2-2-6a5 5 0 0 0-5-5z"/><path fill="currentColor" d="M10.3 18a1.7 1.7 0 0 0 3.4 0z"/>' },
    { key: "compass",   label: "compass explore direction travel navigate",
      svg: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path fill="currentColor" d="M12 6l2.3 5.7L12 18l-2.3-6.3z"/>' },
    { key: "map",       label: "map travel journey quest",
      svg: '<g '+L+'><path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/></g>' },
    { key: "die",       label: "dice die gamble luck game chance",
      svg: '<rect x="4" y="4" width="16" height="16" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="9" cy="9" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="15" cy="15" r="1.5" fill="currentColor"/>' },
    { key: "chalice",   label: "chalice goblet cup drink wine ale",
      svg: '<path fill="currentColor" d="M7 4h10l-1.2 6a4 4 0 0 1-7.6 0z"/><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M12 13.5v5.5M8.5 20h7"/>' },
    { key: "scales",    label: "scales balance justice law order",
      svg: '<g '+L+'><path d="M12 3v17"/><path d="M8 20h8"/><path d="M4 8h16"/></g><path fill="currentColor" d="M1.6 12l2.4-4 2.4 4z"/><path fill="currentColor" d="M17.6 12l2.4-4 2.4 4z"/><circle cx="12" cy="5.5" r="1.6" fill="currentColor"/>' },
    { key: "torch",     label: "torch fire light flame beacon",
      svg: '<path fill="currentColor" d="M12 2c2.6 2.6 2.6 5.2 0 7.8-2.6-2.6-2.6-5.2 0-7.8z"/><path fill="currentColor" d="M9 9.5h6l-1 2.2h-4z"/><path fill="currentColor" d="M10.4 11.5h3.2l-.5 8.5h-2.2z"/>' },
    { key: "target",    label: "target bullseye hunter aim goal focus",
      svg: '<g '+L+'><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/></g><circle cx="12" cy="12" r="1.7" fill="currentColor"/>' },
    { key: "sparkles",  label: "sparkles magic shiny glitter enchant",
      svg: '<path fill="currentColor" d="M11 2l1.9 5.1L18 9l-5.1 1.9L11 16l-1.9-5.1L4 9l5.1-1.9z"/><path fill="currentColor" d="M18 13l.9 2.1L21 16l-2.1.9L18 19l-.9-2.1L15 16l2.1-.9z"/>' },
    { key: "hourglass", label: "hourglass time sand wait patience",
      svg: '<path fill="currentColor" d="M6 3h12v2.5c0 3-3 5-6 6.5 3 1.5 6 3.5 6 6.5V21H6v-2.5c0-3 3-5 6-6.5-3-1.5-6-3.5-6-6.5z"/>' },
    { key: "horns",     label: "horns demon fel evil beast",
      svg: '<g '+L+'><path d="M4 4c0 6 3.2 9.5 8 10.5M20 4c0 6-3.2 9.5-8 10.5"/></g>' },
    { key: "coin",      label: "coin gold money currency wealth",
      svg: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="5.4" fill="none" stroke="currentColor" stroke-width="2"/>' },
    { key: "bone",      label: "bone death skeleton beast pet",
      svg: '<path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" d="M7 8.5l9.5 9.5"/><circle cx="6" cy="6.6" r="2.1" fill="currentColor"/><circle cx="8.2" cy="8.8" r="2.1" fill="currentColor"/><circle cx="15.8" cy="15.2" r="2.1" fill="currentColor"/><circle cx="18" cy="17.4" r="2.1" fill="currentColor"/>' },
    { key: "arrow",     label: "arrow direction move next go",
      svg: '<g '+L+'><path d="M4 12h14"/><path d="M12 6l6 6-6 6"/></g>' },
    { key: "cloud",     label: "cloud sky weather storm",
      svg: '<path fill="currentColor" d="M7 18a4 4 0 0 1 0-8 5 5 0 0 1 9.6-1.4A3.5 3.5 0 0 1 18 18z"/>' },
    { key: "wave",      label: "wave water sea ocean tide sailor",
      svg: '<g '+L+'><path d="M2 9c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/><path d="M2 14c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/><path d="M2 19c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/></g>' },
    { key: "wing",      label: "wing angel valkyr flight holy",
      svg: '<path fill="currentColor" d="M3 7c7 0 13.5 3 18 11-5-3-9-3-13-2 3-2.5 2.5-6-5-9z"/>' }
  ];

  ARPO.ICON_MAP = {};
  ARPO.ICONS.forEach(function (i) { ARPO.ICON_MAP[i.key] = i; });

  // ---- Wowhead (authentic WoW) icons -------------------------------------
  // Served from Wowhead's public icon CDN. Any WoW icon works by name; the
  // grid below is a curated starter set. Names are the in-game icon file name.
  ARPO.WOW_ICON_BASE = "https://wow.zamimg.com/images/wow/icons/";
  ARPO.wowIconUrl = function (name, size) {
    return ARPO.WOW_ICON_BASE + (size || "large") + "/" +
      String(name || "").trim().toLowerCase() + ".jpg";
  };

  // Load the full icon-name library once (cached); falls back to the curated set.
  ARPO.loadWowLibrary = function () {
    if (ARPO._wowLibPromise) return ARPO._wowLibPromise;
    ARPO._wowLib = ARPO.WOW_ICONS.slice();
    ARPO._wowLibPromise = fetch("assets/data/wow-icons.json")
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (list) { if (list && list.length) ARPO._wowLib = list; return ARPO._wowLib; })
      .catch(function () { return ARPO._wowLib; });
    return ARPO._wowLibPromise;
  };
  ARPO.WOW_ICONS = [
    // Weapons & combat
    "inv_sword_04", "inv_sword_27", "inv_sword_39", "inv_axe_02", "inv_mace_01",
    "inv_hammer_16", "inv_staff_13", "inv_weapon_bow_07", "inv_weapon_rifle_01",
    "inv_wand_07", "inv_shield_06", "inv_shield_04", "inv_spear_04",
    "ability_stealth", "ability_dualwield", "ability_warrior_savageblow", "ability_warrior_charge",
    // Magic
    "spell_fire_fireball02", "spell_fire_flamebolt", "spell_frost_frostbolt02", "spell_frost_frostnova",
    "spell_nature_lightning", "spell_nature_healingtouch", "spell_nature_starfall",
    "spell_shadow_shadowbolt", "spell_shadow_deathcoil", "spell_shadow_raisedead",
    "spell_holy_holybolt", "spell_holy_powerwordshield", "spell_holy_flashheal",
    "spell_arcane_blast", "spell_arcane_arcanetorrent",
    // Items & theme
    "inv_misc_book_09", "inv_misc_book_11", "inv_scroll_03", "inv_potion_51", "inv_potion_54",
    "inv_misc_gem_diamond_02", "inv_misc_gem_ruby_02", "inv_misc_head_dragon_01",
    "ability_mount_ridinghorse", "inv_banner_02", "inv_misc_note_01", "inv_drink_05",
    "inv_misc_key_03", "inv_jewelry_ring_03",
    // Race portraits
    "achievement_character_human_male", "achievement_character_human_female",
    "achievement_character_dwarf_male", "achievement_character_nightelf_female",
    "achievement_character_gnome_male", "achievement_character_draenei_male",
    "achievement_character_orc_male", "achievement_character_undead_male",
    "achievement_character_tauren_male", "achievement_character_troll_male",
    "achievement_character_bloodelf_female", "achievement_character_pandaren_male",
    "achievement_character_worgen_male", "achievement_character_goblin_male",
    // More weapons & combat
    "inv_sword_62", "inv_axe_09", "inv_mace_25", "inv_weapon_halberd_06",
    "inv_weapon_crossbow_02", "inv_throwingknife_04", "ability_backstab",
    "ability_parry", "ability_warrior_rampage", "ability_warrior_shieldbash",
    "ability_rogue_ambush", "ability_hunter_snipershot",
    // More magic
    "spell_holy_layonhands", "spell_holy_renew", "spell_holy_sealofmight",
    "spell_fire_immolation", "spell_fire_flameshock", "spell_frost_frostshock",
    "spell_frost_wizardmark", "spell_nature_earthbind", "spell_nature_polymorph",
    "spell_nature_wispsplode", "spell_shadow_summoninfernal", "spell_shadow_metamorphosis",
    "spell_shadow_lifedrain", "spell_arcane_teleportstormwind", "spell_holy_prayerofhealing",
    // Professions & tradeskills
    "trade_alchemy", "trade_blacksmithing", "trade_engineering", "trade_tailoring",
    "trade_leatherworking", "trade_mining", "inv_misc_herb_07", "inv_fishingpole_02",
    // Items & theme
    "inv_misc_map_01", "inv_misc_spyglass_02", "inv_misc_pocketwatch_01",
    "inv_letter_15", "inv_misc_rune_01", "inv_jewelry_talisman_05",
    "inv_misc_coin_01", "inv_misc_key_11", "inv_misc_gem_emerald_02",
    "inv_misc_gem_sapphire_02", "inv_drink_16", "inv_misc_food_15",
    "ability_hunter_pet_cat", "ability_hunter_pet_bear", "ability_mount_nightmarehorse",
    // More race portraits
    "achievement_character_nightelf_male",
    "achievement_character_dwarf_female", "achievement_character_gnome_female",
    "achievement_character_draenei_female", "achievement_character_orc_female",
    "achievement_character_tauren_female", "achievement_character_troll_female",
    "achievement_character_undead_female", "achievement_character_bloodelf_male"
  ];

  ARPO.iconSVG = function (key, opts) {
    opts = opts || {};
    var ic = ARPO.ICON_MAP[key];
    if (!ic) return "";
    var size = opts.size || 24;
    return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size +
      '" fill="none" aria-hidden="true" style="display:block">' + ic.svg + "</svg>";
  };

  // Inline icon markup for custom-section items: a WoW image or a bundled SVG.
  ARPO.inlineIcon = function (kind, name, size, forExport) {
    if (!name) return "";
    if (kind === "wow") {
      var co = forExport ? ' crossorigin="anonymous"' : "";
      return '<img class="ci-img" alt=""' + co + ' src="' + ARPO.wowIconUrl(name) +
        '" onerror="this.style.display=\'none\'">';
    }
    return ARPO.iconSVG(name, { size: size || 22 });
  };
})();
