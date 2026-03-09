const { useState, useEffect, useMemo } = React;

// ─── Country limits ───────────────────────────────────────────────────────────
const COUNTRIES = [
  { id:"ch",  flag:"🇨🇭", name:"Schweiz",          limit:0.5, note:"0.0‰ für Neulenker & Berufsfahrer" },
  { id:"de",  flag:"🇩🇪", name:"Deutschland",       limit:0.5, note:"0.0‰ unter 21 J. / Probezeit" },
  { id:"at",  flag:"🇦🇹", name:"Österreich",        limit:0.5, note:"0.1‰ für Probeführerschein" },
  { id:"fr",  flag:"🇫🇷", name:"Frankreich",        limit:0.5, note:"0.2‰ für Fahranfänger" },
  { id:"it",  flag:"🇮🇹", name:"Italien",           limit:0.5, note:"0.0‰ unter 21 J. / Neulenker" },
  { id:"es",  flag:"🇪🇸", name:"Spanien",           limit:0.5, note:"0.3‰ für Profis & Fahranfänger" },
  { id:"gr",  flag:"🇬🇷", name:"Griechenland",      limit:0.5, note:"" },
  { id:"nl",  flag:"🇳🇱", name:"Niederlande",       limit:0.5, note:"0.2‰ für Fahranfänger" },
  { id:"be",  flag:"🇧🇪", name:"Belgien",           limit:0.5, note:"" },
  { id:"dk",  flag:"🇩🇰", name:"Dänemark",          limit:0.5, note:"" },
  { id:"no",  flag:"🇳🇴", name:"Norwegen",          limit:0.2, note:"" },
  { id:"se",  flag:"🇸🇪", name:"Schweden",          limit:0.2, note:"" },
  { id:"pl",  flag:"🇵🇱", name:"Polen",             limit:0.2, note:"" },
  { id:"ee",  flag:"🇪🇪", name:"Estland",           limit:0.2, note:"" },
  { id:"cz",  flag:"🇨🇿", name:"Tschechien",        limit:0.0, note:"Nulltoleranz" },
  { id:"hu",  flag:"🇭🇺", name:"Ungarn",            limit:0.0, note:"Nulltoleranz" },
  { id:"sk",  flag:"🇸🇰", name:"Slowakei",          limit:0.0, note:"Nulltoleranz" },
  { id:"ro",  flag:"🇷🇴", name:"Rumänien",          limit:0.0, note:"Nulltoleranz" },
  { id:"gb",  flag:"🇬🇧", name:"United Kingdom",    limit:0.8, note:"Schottland: 0.5‰" },
  { id:"mt",  flag:"🇲🇹", name:"Malta",             limit:0.8, note:"" },
];

// ─── Drinks ───────────────────────────────────────────────────────────────────
const DEFAULT_DRINKS = [
  { id:"cafe_lutz",  cat:"☕ Warme Getränke", name:"Café Lutz",            vol:0.15,  abv:13,   kcal:90,  icon:"☕" },
  { id:"cafe_bail",  cat:"☕ Warme Getränke", name:"Café Baileys",         vol:0.15,  abv:13,   kcal:110, icon:"☕" },
  { id:"schueml",    cat:"☕ Warme Getränke", name:"Schümli Pflümli",      vol:0.15,  abv:22,   kcal:105, icon:"☕" },
  { id:"coretto",    cat:"☕ Warme Getränke", name:"Coretto Grappa",       vol:0.1,   abv:38,   kcal:90,  icon:"☕" },
  { id:"tee_rum",    cat:"☕ Warme Getränke", name:"Tee Rum",              vol:0.2,   abv:35,   kcal:120, icon:"🍵" },
  { id:"irish_coff", cat:"☕ Warme Getränke", name:"Irish Coffee",         vol:0.2,   abv:22,   kcal:180, icon:"☕" },
  { id:"stange",     cat:"🍺 Bier",          name:"Stange (0.3l)",        vol:0.3,   abv:5.0,  kcal:130, icon:"🍺" },
  { id:"panache",    cat:"🍺 Bier",          name:"Panaché",              vol:0.5,   abv:2.5,  kcal:175, icon:"🍺" },
  { id:"kubel",      cat:"🍺 Bier",          name:"Kübel / Maas (0.5l)", vol:0.5,   abv:5.0,  kcal:215, icon:"🍺" },
  { id:"calanda",    cat:"🍺 Bier",          name:"Calanda Edelbräu",    vol:0.5,   abv:5.0,  kcal:215, icon:"🍺" },
  { id:"calanda_g",  cat:"🍺 Bier",          name:"Calanda Glatsch",     vol:0.5,   abv:4.9,  kcal:210, icon:"🍺" },
  { id:"corona",     cat:"🍺 Bier",          name:"Corona",               vol:0.355, abv:4.5,  kcal:148, icon:"🍺" },
  { id:"heineken",   cat:"🍺 Bier",          name:"Heineken",             vol:0.33,  abv:5.0,  kcal:138, icon:"🍺" },
  { id:"moretti",    cat:"🍺 Bier",          name:"Birra Moretti",        vol:0.33,  abv:4.6,  kcal:143, icon:"🍺" },
  { id:"erdinger",   cat:"🍺 Bier",          name:"Erdinger Urweisse",   vol:0.5,   abv:5.3,  kcal:240, icon:"🍺" },
  { id:"radler",     cat:"🍺 Bier",          name:"Radler",               vol:0.5,   abv:2.5,  kcal:175, icon:"🍺" },
  { id:"smice",      cat:"🍺 Bier",          name:"Smirnoff Ice",         vol:0.275, abv:4.5,  kcal:196, icon:"🍹" },
  { id:"somersby",   cat:"🍺 Bier",          name:"Somersby",             vol:0.33,  abv:4.5,  kcal:165, icon:"🍹" },
  { id:"campari",    cat:"🍸 Aperitif",      name:"Campari (4cl)",        vol:0.04,  abv:25,   kcal:98,  icon:"🍸" },
  { id:"mart_b",     cat:"🍸 Aperitif",      name:"Martini Bianco",       vol:0.06,  abv:15,   kcal:72,  icon:"🍸" },
  { id:"mart_r",     cat:"🍸 Aperitif",      name:"Martini Rosso",        vol:0.06,  abv:15,   kcal:72,  icon:"🍸" },
  { id:"jaeger_ap",  cat:"🍸 Aperitif",      name:"Jägermeister (4cl)",  vol:0.04,  abv:35,   kcal:103, icon:"🍸" },
  { id:"appenz",     cat:"🍸 Aperitif",      name:"Appenzeller (4cl)",   vol:0.04,  abv:29,   kcal:92,  icon:"🍸" },
  { id:"averna",     cat:"🍸 Aperitif",      name:"Averna (4cl)",         vol:0.04,  abv:29,   kcal:95,  icon:"🍸" },
  { id:"monteneg",   cat:"🍸 Aperitif",      name:"Montenegro (4cl)",    vol:0.04,  abv:23,   kcal:85,  icon:"🍸" },
  { id:"cynar",      cat:"🍸 Aperitif",      name:"Cynar (4cl)",          vol:0.04,  abv:16.5, kcal:70,  icon:"🍸" },
  { id:"fernet",     cat:"🍸 Aperitif",      name:"Fernet-Branca (4cl)", vol:0.04,  abv:39,   kcal:105, icon:"🍸" },
  { id:"ramaz",      cat:"🍸 Aperitif",      name:"Ramazzotti (4cl)",    vol:0.04,  abv:30,   kcal:95,  icon:"🍸" },
  { id:"braulio",    cat:"🍸 Aperitif",      name:"Braulio (4cl)",        vol:0.04,  abv:21,   kcal:80,  icon:"🍸" },
  { id:"weiss",      cat:"🍷 Wein",          name:"Weisswein (2dl)",      vol:0.2,   abv:12.5, kcal:148, icon:"🍾" },
  { id:"rose",       cat:"🍷 Wein",          name:"Rosé Lenz (2dl)",     vol:0.2,   abv:12,   kcal:142, icon:"🥂" },
  { id:"gespritzt",  cat:"🍷 Wein",          name:"Gespritzter",          vol:0.3,   abv:6.5,  kcal:90,  icon:"🥂" },
  { id:"prosecco",   cat:"🍷 Wein",          name:"Prosecco (1dl)",       vol:0.1,   abv:11,   kcal:80,  icon:"🥂" },
  { id:"hugo",       cat:"🍷 Wein",          name:"Hugo",                 vol:0.3,   abv:8.5,  kcal:160, icon:"🥂" },
  { id:"erd_hugo",   cat:"🍷 Wein",          name:"Erdbeer Hugo",         vol:0.3,   abv:8.5,  kcal:170, icon:"🥂" },
  { id:"lillet_t",   cat:"🍷 Wein",          name:"Lillet Tonic",         vol:0.25,  abv:13,   kcal:145, icon:"🥂" },
  { id:"lillet_b",   cat:"🍷 Wein",          name:"Lillet Berry",         vol:0.25,  abv:13,   kcal:150, icon:"🥂" },
  { id:"lillet_p",   cat:"🍷 Wein",          name:"Lillet Passion",       vol:0.25,  abv:13,   kcal:148, icon:"🥂" },
  { id:"aperol",     cat:"🍷 Wein",          name:"Aperol Spritz",        vol:0.3,   abv:10.5, kcal:168, icon:"🥂" },
  { id:"sum_secc",   cat:"🍷 Wein",          name:"Summer Secco",         vol:0.25,  abv:9.5,  kcal:140, icon:"🥂" },
  { id:"marito",     cat:"🍷 Wein",          name:"Marito",               vol:0.3,   abv:8,    kcal:155, icon:"🥂" },
  { id:"cherry_b",   cat:"🍷 Wein",          name:"Cherry Berry",         vol:0.3,   abv:8,    kcal:160, icon:"🥂" },
  { id:"moet",       cat:"🍾 Champagner",    name:"Moët & Chandon",       vol:0.1,   abv:12,   kcal:88,  icon:"🍾" },
  { id:"moet_ice",   cat:"🍾 Champagner",    name:"Moët Ice Impérial",   vol:0.1,   abv:12,   kcal:88,  icon:"🍾" },
  { id:"dom_per",    cat:"🍾 Champagner",    name:"Dom Pérignon",         vol:0.1,   abv:12.5, kcal:92,  icon:"🍾" },
  { id:"roederer",   cat:"🍾 Champagner",    name:"Louis Roederer",       vol:0.1,   abv:12,   kcal:88,  icon:"🍾" },
  { id:"cristal",    cat:"🍾 Champagner",    name:"Cristal",              vol:0.1,   abv:12,   kcal:88,  icon:"🍾" },
  { id:"sex_beach",  cat:"🍹 Cocktails",     name:"Sex on the Beach",     vol:0.3,   abv:15,   kcal:255, icon:"🏖️" },
  { id:"pina_col",   cat:"🍹 Cocktails",     name:"Piña Colada",          vol:0.3,   abv:13,   kcal:296, icon:"🍍" },
  { id:"ocean_b",    cat:"🍹 Cocktails",     name:"Ocean Blue",           vol:0.3,   abv:14,   kcal:230, icon:"🌊" },
  { id:"frozen_m",   cat:"🍹 Cocktails",     name:"Frozen Margarita",     vol:0.3,   abv:13,   kcal:220, icon:"🍹" },
  { id:"caipir",     cat:"🍹 Cocktails",     name:"Caipirinha",           vol:0.25,  abv:18,   kcal:215, icon:"🍋" },
  { id:"mojito",     cat:"🍹 Cocktails",     name:"Mojito",               vol:0.3,   abv:14,   kcal:195, icon:"🌿" },
  { id:"erd_moj",    cat:"🍹 Cocktails",     name:"Erdbeer-Mojito",       vol:0.3,   abv:13,   kcal:210, icon:"🍓" },
  { id:"mar_moj",    cat:"🍹 Cocktails",     name:"Maracuja-Mojito",      vol:0.3,   abv:13,   kcal:205, icon:"🍹" },
  { id:"espr_mart",  cat:"🍹 Cocktails",     name:"Espresso Martini",     vol:0.2,   abv:20,   kcal:220, icon:"🍸" },
  { id:"bail_mart",  cat:"🍹 Cocktails",     name:"Baileys Martini",      vol:0.2,   abv:18,   kcal:240, icon:"🍸" },
  { id:"amar_sour",  cat:"🍹 Cocktails",     name:"Amaretto Sauer",       vol:0.2,   abv:15,   kcal:200, icon:"🍸" },
  { id:"whisk_sour", cat:"🍹 Cocktails",     name:"Whiskey Sauer",        vol:0.2,   abv:18,   kcal:210, icon:"🍸" },
  { id:"mosc_mule",  cat:"🍹 Cocktails",     name:"Moscow Mule",          vol:0.3,   abv:16,   kcal:195, icon:"🍹" },
  { id:"lond_mule",  cat:"🍹 Cocktails",     name:"London Mule",          vol:0.3,   abv:16,   kcal:190, icon:"🍹" },
  { id:"volcano",    cat:"🍹 Cocktails",     name:"Volcano",              vol:0.3,   abv:17,   kcal:230, icon:"🌋" },
  { id:"teq_sun",    cat:"🍹 Cocktails",     name:"Tequila Sunrise",      vol:0.3,   abv:16,   kcal:232, icon:"🌅" },
  { id:"long_isl",   cat:"🍹 Cocktails",     name:"Long Island Iced Tea", vol:0.35,  abv:22,   kcal:320, icon:"🍹" },
  { id:"berry_m",    cat:"🍹 Cocktails",     name:"Berry Mule",           vol:0.3,   abv:14,   kcal:185, icon:"🫐" },
  { id:"porn_m",     cat:"🍹 Cocktails",     name:"Pornstar Martini",     vol:0.2,   abv:16,   kcal:210, icon:"🍸" },
  { id:"negroni",    cat:"🍹 Cocktails",     name:"Negroni",              vol:0.2,   abv:26,   kcal:200, icon:"🍸" },
  { id:"negr_sb",    cat:"🍹 Cocktails",     name:"Negroni Sbagliato",    vol:0.25,  abv:16,   kcal:180, icon:"🍸" },
  { id:"white_r",    cat:"🍹 Cocktails",     name:"White Russian",        vol:0.2,   abv:20,   kcal:260, icon:"🍸" },
  { id:"black_r",    cat:"🍹 Cocktails",     name:"Black Russian",        vol:0.15,  abv:25,   kcal:190, icon:"🍸" },
  { id:"manhat",     cat:"🍹 Cocktails",     name:"Manhattan",            vol:0.15,  abv:25,   kcal:165, icon:"🍸" },
  { id:"cosmo",      cat:"🍹 Cocktails",     name:"Cosmopolitan",         vol:0.2,   abv:20,   kcal:210, icon:"🍸" },
  { id:"old_fash",   cat:"🍹 Cocktails",     name:"Old Fashioned",        vol:0.15,  abv:30,   kcal:160, icon:"🥃" },
  { id:"daiquiri",   cat:"🍹 Cocktails",     name:"Daiquiri",             vol:0.2,   abv:18,   kcal:175, icon:"🍸" },
  { id:"bob_marl",   cat:"🍹 Cocktails",     name:"Bob Marley",           vol:0.2,   abv:17,   kcal:190, icon:"🌿" },
  { id:"bob_sbag",   cat:"🍹 Cocktails",     name:"Bob Marley Sbagliato", vol:0.25,  abv:17,   kcal:195, icon:"🌿" },
  { id:"street_l",   cat:"🍹 Cocktails",     name:"Street-Lady",          vol:0.25,  abv:14,   kcal:175, icon:"🍹" },
  { id:"solero",     cat:"🍹 Cocktails",     name:"Solero",               vol:0.25,  abv:12,   kcal:165, icon:"🍹" },
  { id:"gin_tonic",  cat:"🍹 Cocktails",     name:"Gin Tonic",            vol:0.3,   abv:7.5,  kcal:143, icon:"🍸" },
  { id:"cuba_libre", cat:"🍹 Cocktails",     name:"Cuba Libre",           vol:0.3,   abv:8,    kcal:181, icon:"🍸" },
  { id:"remy",       cat:"🥃 Cognac & Rum",  name:"Rémy Martin (4cl)",   vol:0.04,  abv:40,   kcal:112, icon:"🥃" },
  { id:"henn",       cat:"🥃 Cognac & Rum",  name:"Hennessy (4cl)",       vol:0.04,  abv:40,   kcal:112, icon:"🥃" },
  { id:"veterano",   cat:"🥃 Cognac & Rum",  name:"Veterano (4cl)",       vol:0.04,  abv:30,   kcal:95,  icon:"🥃" },
  { id:"carlos",     cat:"🥃 Cognac & Rum",  name:"Carlos I Imperial",    vol:0.04,  abv:38,   kcal:108, icon:"🥃" },
  { id:"brugal",     cat:"🥃 Cognac & Rum",  name:"Brugal Ron Añejo",    vol:0.04,  abv:38,   kcal:108, icon:"🥃" },
  { id:"captain",    cat:"🥃 Cognac & Rum",  name:"Captain Morgan",       vol:0.04,  abv:35,   kcal:103, icon:"🥃" },
  { id:"havana_e",   cat:"🥃 Cognac & Rum",  name:"Havana Club Especial", vol:0.04,  abv:37.5, kcal:105, icon:"🥃" },
  { id:"havana_7",   cat:"🥃 Cognac & Rum",  name:"Havana Club 7",        vol:0.04,  abv:40,   kcal:112, icon:"🥃" },
  { id:"zacapa23",   cat:"🥃 Cognac & Rum",  name:"Zacapa 23",            vol:0.04,  abv:40,   kcal:112, icon:"🥃" },
  { id:"zacapa_xo",  cat:"🥃 Cognac & Rum",  name:"Zacapa XO",            vol:0.04,  abv:40,   kcal:112, icon:"🥃" },
  { id:"mamajuana",  cat:"🥃 Cognac & Rum",  name:"Mamajuana (4cl)",      vol:0.04,  abv:30,   kcal:95,  icon:"🥃" },
  { id:"jw_black",   cat:"🥃 Whisky",        name:"J.W. Black Label",     vol:0.04,  abv:40,   kcal:112, icon:"🥃" },
  { id:"jw_blue",    cat:"🥃 Whisky",        name:"J.W. Blue Label",      vol:0.04,  abv:40,   kcal:112, icon:"🥃" },
  { id:"ballant",    cat:"🥃 Whisky",        name:"Ballantine's",         vol:0.04,  abv:40,   kcal:112, icon:"🥃" },
  { id:"chivas",     cat:"🥃 Whisky",        name:"Chivas Regal",         vol:0.04,  abv:40,   kcal:112, icon:"🥃" },
  { id:"jameson",    cat:"🥃 Whisky",        name:"Jameson",              vol:0.04,  abv:40,   kcal:112, icon:"🥃" },
  { id:"tullamore",  cat:"🥃 Whisky",        name:"Tullamore Dew",        vol:0.04,  abv:40,   kcal:112, icon:"🥃" },
  { id:"canad_cl",   cat:"🥃 Whisky",        name:"Canadian Club",        vol:0.04,  abv:40,   kcal:112, icon:"🥃" },
  { id:"jim_beam",   cat:"🥃 Whisky",        name:"Jim Beam",             vol:0.04,  abv:40,   kcal:112, icon:"🥃" },
  { id:"four_ros",   cat:"🥃 Whisky",        name:"Four Roses",           vol:0.04,  abv:40,   kcal:112, icon:"🥃" },
  { id:"jd",         cat:"🥃 Whisky",        name:"Jack Daniel's",        vol:0.04,  abv:40,   kcal:112, icon:"🥃" },
  { id:"dalwh",      cat:"🥃 Whisky",        name:"Dalwhinnie 15J.",      vol:0.04,  abv:43,   kcal:118, icon:"🥃" },
  { id:"glenkch",    cat:"🥃 Whisky",        name:"Glenkinchie 10J.",     vol:0.04,  abv:43,   kcal:118, icon:"🥃" },
  { id:"craggan",    cat:"🥃 Whisky",        name:"Cragganmore",          vol:0.04,  abv:40,   kcal:112, icon:"🥃" },
  { id:"lagavulin",  cat:"🥃 Whisky",        name:"Lagavulin 16J.",       vol:0.04,  abv:43,   kcal:118, icon:"🥃" },
  { id:"talisker",   cat:"🥃 Whisky",        name:"Talisker 10J.",        vol:0.04,  abv:45.8, kcal:122, icon:"🥃" },
  { id:"oban",       cat:"🥃 Whisky",        name:"Oban 14J.",            vol:0.04,  abv:43,   kcal:118, icon:"🥃" },
  { id:"macallan",   cat:"🥃 Whisky",        name:"Macallan Amber",       vol:0.04,  abv:40,   kcal:112, icon:"🥃" },
  { id:"laphroaig",  cat:"🥃 Whisky",        name:"Laphroaig 10J.",       vol:0.04,  abv:40,   kcal:112, icon:"🥃" },
  { id:"dalmore",    cat:"🥃 Whisky",        name:"Dalmore 15J.",         vol:0.04,  abv:40,   kcal:112, icon:"🥃" },
  { id:"gordons",    cat:"🌿 Gin",           name:"Gordon's (4cl)",       vol:0.04,  abv:37.5, kcal:105, icon:"🌿" },
  { id:"bombay",     cat:"🌿 Gin",           name:"Bombay (4cl)",         vol:0.04,  abv:40,   kcal:112, icon:"🌿" },
  { id:"hendricks",  cat:"🌿 Gin",           name:"Hendrick's (4cl)",    vol:0.04,  abv:41.4, kcal:114, icon:"🌿" },
  { id:"amuerte_b",  cat:"🌿 Gin",           name:"Amuerte Black (4cl)", vol:0.04,  abv:43,   kcal:118, icon:"🌿" },
  { id:"monkey47",   cat:"🌿 Gin",           name:"Monkey 47 (4cl)",      vol:0.04,  abv:47,   kcal:126, icon:"🐒" },
  { id:"bulldog",    cat:"🌿 Gin",           name:"Bulldog (4cl)",        vol:0.04,  abv:40,   kcal:112, icon:"🌿" },
  { id:"tanqueray",  cat:"🌿 Gin",           name:"Tanqueray Royale",     vol:0.04,  abv:41.3, kcal:114, icon:"🌿" },
  { id:"huckle",     cat:"🌿 Gin",           name:"Huckleberry (4cl)",   vol:0.04,  abv:40,   kcal:112, icon:"🌿" },
  { id:"brockmans",  cat:"🌿 Gin",           name:"Brockmans (4cl)",      vol:0.04,  abv:40,   kcal:112, icon:"🌿" },
  { id:"opihr",      cat:"🌿 Gin",           name:"Opihr (4cl)",          vol:0.04,  abv:40,   kcal:112, icon:"🌿" },
  { id:"gin_mare",   cat:"🌿 Gin",           name:"Gin Mare (4cl)",       vol:0.04,  abv:42.7, kcal:116, icon:"🌿" },
  { id:"botanist",   cat:"🌿 Gin",           name:"The Botanist (4cl)",  vol:0.04,  abv:46,   kcal:122, icon:"🌿" },
  { id:"absolut",    cat:"🫙 Vodka",         name:"Absolut (4cl)",        vol:0.04,  abv:40,   kcal:112, icon:"🫙" },
  { id:"greygoose",  cat:"🫙 Vodka",         name:"Grey Goose (4cl)",    vol:0.04,  abv:40,   kcal:112, icon:"🫙" },
  { id:"belvedere",  cat:"🫙 Vodka",         name:"Belvedere (4cl)",      vol:0.04,  abv:40,   kcal:112, icon:"🫙" },
  { id:"elit",       cat:"🫙 Vodka",         name:"Elit (4cl)",           vol:0.04,  abv:40,   kcal:112, icon:"🫙" },
  { id:"trojka_r",   cat:"🫙 Vodka",         name:"Trojka Red (4cl)",    vol:0.04,  abv:17,   kcal:65,  icon:"🫙" },
  { id:"trojka_blk", cat:"🫙 Vodka",         name:"Trojka Black (4cl)",  vol:0.04,  abv:17,   kcal:65,  icon:"🫙" },
  { id:"trojka_g",   cat:"🫙 Vodka",         name:"Trojka Green (4cl)",  vol:0.04,  abv:17,   kcal:65,  icon:"🫙" },
  { id:"ingwerer",   cat:"🔥 Shots",         name:"Ingwerer",             vol:0.04,  abv:18,   kcal:60,  icon:"🔥" },
  { id:"erd_chill",  cat:"🔥 Shots",         name:"Erdbeer-Chilli",       vol:0.04,  abv:17,   kcal:58,  icon:"🔥" },
  { id:"mango_ing",  cat:"🔥 Shots",         name:"Mango-Ingwer",         vol:0.04,  abv:18,   kcal:60,  icon:"🔥" },
  { id:"wint_apf",   cat:"🔥 Shots",         name:"Winter-Apfel",         vol:0.04,  abv:17,   kcal:58,  icon:"🔥" },
  { id:"licor43",    cat:"🔥 Shots",         name:"Licor 43",             vol:0.04,  abv:31,   kcal:98,  icon:"🔥" },
  { id:"berl_luft",  cat:"🔥 Shots",         name:"Berliner Luft",        vol:0.04,  abv:18,   kcal:60,  icon:"🔥" },
  { id:"saur_apf",   cat:"🔥 Shots",         name:"Saurer Apfel",         vol:0.04,  abv:16,   kcal:55,  icon:"🔥" },
  { id:"sambuca",    cat:"🔥 Shots",         name:"Sambuca",              vol:0.04,  abv:38,   kcal:108, icon:"🔥" },
  { id:"jager_sh",   cat:"🔥 Shots",         name:"Jägermeister Shot",   vol:0.04,  abv:35,   kcal:103, icon:"🔥" },
  { id:"mama_sh",    cat:"🔥 Shots",         name:"Mamajuana Shot",       vol:0.04,  abv:30,   kcal:95,  icon:"🔥" },
  { id:"teq_sierr",  cat:"🔥 Shots",         name:"Tequila Sierra",       vol:0.04,  abv:38,   kcal:108, icon:"🔥" },
  { id:"teq_bco",    cat:"🔥 Shots",         name:"Tequila Padre Bianco", vol:0.04,  abv:40,   kcal:112, icon:"🔥" },
  { id:"teq_rep",    cat:"🔥 Shots",         name:"Tequila Reposado",     vol:0.04,  abv:40,   kcal:112, icon:"🔥" },
  { id:"teq_anj",    cat:"🔥 Shots",         name:"Tequila Añejo",       vol:0.04,  abv:40,   kcal:112, icon:"🔥" },
  { id:"flying_h",   cat:"🔥 Shots",         name:"Flying Hirsch",        vol:0.04,  abv:19,   kcal:62,  icon:"🔥" },
  { id:"b52",        cat:"🔥 Shots",         name:"B-52",                 vol:0.04,  abv:27,   kcal:88,  icon:"🔥" },
  { id:"candy_sh",   cat:"🔥 Shots",         name:"Candy / Hot Love",     vol:0.04,  abv:22,   kcal:72,  icon:"🔥" },
  { id:"jagbomb",    cat:"🔥 Shots",         name:"Jägerbomb",           vol:0.25,  abv:7,    kcal:185, icon:"💣" },
  { id:"blowjob",    cat:"🔥 Shots",         name:"Blowjob",              vol:0.04,  abv:22,   kcal:72,  icon:"🔥" },
  { id:"smurf_sh",   cat:"🔥 Shots",         name:"Smurf Shot",           vol:0.04,  abv:22,   kcal:72,  icon:"🔥" },
  { id:"mclaren",    cat:"🔥 Shots",         name:"McLaren",              vol:0.04,  abv:22,   kcal:72,  icon:"🔥" },
  { id:"kamikaze",   cat:"🔥 Shots",         name:"Blue Kamikaze",        vol:0.04,  abv:22,   kcal:72,  icon:"🔥" },
];

const ALL_CATS = ["Alle", ...new Set(DEFAULT_DRINKS.map(d => d.cat))];
const MEAL_TYPES = ["🥐 Frühstück","🍽️ Mittagessen","🍝 Abendessen","🍿 Snack"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtTime(ts) {
  const d = new Date(ts);
  return d.getHours().toString().padStart(2,"0")+":"+d.getMinutes().toString().padStart(2,"0");
}

function tsFromTime(hhmm) {
  const [h,m] = hhmm.split(":").map(Number);
  const d = new Date();
  d.setHours(h,m,0,0);
  return d.getTime();
}

function calcBac(entries, weight, gender, meals=[]) {
  if (!entries.length) return 0;
  const r = gender === "m" ? 0.7 : 0.6;
  const now = Date.now();
  let totalG = 0;
  for (const e of entries) totalG += e.vol * (e.abv/100) * 789;
  const firstTs = Math.min(...entries.map(x=>x.ts));
  const activeMeals = meals.filter(m => Math.abs(m.ts - firstTs) < 3*3600000 || m.ts < firstTs);
  const foodFactor = activeMeals.length === 0 ? 1.0 : activeMeals.length === 1 ? 0.80 : 0.65;
  const rawBac = (totalG * foodFactor) / (weight * r);
  const elapsedH = (now - firstTs) / 3600000;
  return Math.max(0, rawBac - 0.15 * elapsedH);
}

function hitBac(d, w, g) {
  const r = g === "m" ? 0.7 : 0.6;
  return (d.vol * (d.abv/100) * 789) / (w * r);
}

function bacColor(v) {
  if (v <= 0)  return "#4ade80";
  if (v < 0.3) return "#4ade80";
  if (v < 0.5) return "#a3e635";
  if (v < 0.8) return "#facc15";
  if (v < 1.2) return "#fb923c";
  return "#f87171";
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({title, onClose, children}) {
  return (
    <div style={{position:"fixed",inset:0,zIndex:900,background:"rgba(0,0,0,.75)",display:"flex",alignItems:"flex-end"}}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:"#12141e",borderRadius:"22px 22px 0 0",padding:"22px 20px 36px",width:"100%",maxWidth:440,margin:"0 auto",border:"1px solid #1e2132",animation:"slideUp .22s ease",maxHeight:"88vh",overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <div style={{fontSize:16,fontWeight:700}}>{title}</div>
          <div onClick={onClose} style={{color:"#555",fontSize:24,cursor:"pointer",lineHeight:1}}>×</div>
        </div>
        {children}
      </div>
    </div>
  );
}

function Inp({label, value, onChange, type="text", placeholder=""}) {
  const s = {width:"100%",background:"#0d0f17",border:"1px solid #222638",borderRadius:10,padding:"10px 13px",color:"#e8eaf0",fontSize:13,outline:"none",fontFamily:"inherit"};
  return (
    <div style={{marginBottom:14}}>
      <div style={{fontSize:10,color:"#555",textTransform:"uppercase",letterSpacing:1.2,marginBottom:6}}>{label}</div>
      <input type={type} value={value} placeholder={placeholder} onChange={e=>onChange(e.target.value)} style={s}/>
    </div>
  );
}

function TimePicker({value, onChange}) {
  const now = Date.now();
  const opts = [
    {label:"Jetzt",  ts: now},
    {label:"-15min", ts: now - 15*60000},
    {label:"-30min", ts: now - 30*60000},
    {label:"-45min", ts: now - 45*60000},
    {label:"-1h",    ts: now - 60*60000},
    {label:"-2h",    ts: now - 120*60000},
  ];
  const [custom, setCustom] = useState(false);
  const [customVal, setCustomVal] = useState(fmtTime(value));

  return (
    <div style={{marginBottom:16}}>
      <div style={{fontSize:10,color:"#555",textTransform:"uppercase",letterSpacing:1.2,marginBottom:8}}>Uhrzeit</div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        {opts.map(o=>(
          <div key={o.label} className="tap" onClick={()=>{onChange(o.ts);setCustom(false);}}
            style={{padding:"5px 11px",borderRadius:20,fontSize:11,fontWeight:500,cursor:"pointer",
              background:!custom&&Math.abs(o.ts-value)<65000?"#2563eb":"#0d0f17",
              border:`1px solid ${!custom&&Math.abs(o.ts-value)<65000?"#2563eb":"#222638"}`,
              color:!custom&&Math.abs(o.ts-value)<65000?"#fff":"#666"}}>
            {o.label}
          </div>
        ))}
        <div className="tap" onClick={()=>setCustom(true)}
          style={{padding:"5px 11px",borderRadius:20,fontSize:11,fontWeight:500,cursor:"pointer",
            background:custom?"#7c3aed":"#0d0f17",border:`1px solid ${custom?"#7c3aed":"#222638"}`,
            color:custom?"#fff":"#666"}}>
          Andere…
        </div>
      </div>
      {custom && (
        <input type="time" value={customVal}
          onChange={e=>{setCustomVal(e.target.value);onChange(tsFromTime(e.target.value));}}
          style={{marginTop:10,background:"#0d0f17",border:"1px solid #222638",borderRadius:10,padding:"9px 13px",color:"#e8eaf0",fontSize:13,outline:"none",width:"100%",fontFamily:"inherit"}}/>
      )}
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
function App() {
  const [screen, setScreen]         = useState("home");
  const [profile, setProfile]       = useState({name:"Gast", weight:75, gender:"m", country:"ch", novice:false});
  const [session, setSession]       = useState([]);
  const [drinks, setDrinks]         = useState(DEFAULT_DRINKS);
  const [cat, setCat]               = useState("Alle");
  const [search, setSearch]         = useState("");
  const [bac, setBac]               = useState(0);
  const [toast, setToast]           = useState(null);
  const [editDrink, setEditDrink]   = useState(null);
  const [showAdd, setShowAdd]       = useState(false);
  const [newDrink, setNewDrink]     = useState({name:"",cat:"🍺 Bier",abv:"5",vol:"0.33",kcal:"150",icon:"🍺"});
  const [flashIds, setFlashIds]     = useState({});
  const [editProfile, setEditProfile] = useState(false);
  const [tmpProf, setTmpProf]       = useState(profile);
  const [meals, setMeals]           = useState([]);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [newMeal, setNewMeal]       = useState({type:"🍽️ Mittagessen", desc:"", ts:Date.now()});
  const [pendingDrink, setPendingDrink] = useState(null);
  const [pendingTs, setPendingTs]   = useState(Date.now());

  // Load from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('pt_profile');
    const savedDrinks = localStorage.getItem('pt_drinks');
    if (savedProfile) setProfile(JSON.parse(savedProfile));
    if (savedDrinks) setDrinks(JSON.parse(savedDrinks));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('pt_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('pt_drinks', JSON.stringify(drinks));
  }, [drinks]);

  useEffect(()=>{
    const id = setInterval(()=>setBac(calcBac(session,profile.weight,profile.gender,meals)),10000);
    return ()=>clearInterval(id);
  },[session,profile,meals]);

  function toast_(msg){setToast(msg);setTimeout(()=>setToast(null),2800);}

  function confirmAddDrink() {
    if (!pendingDrink) return;
    const entry = {...pendingDrink, ts:pendingTs, sid:Math.random().toString(36).slice(2)};
    const next = [...session, entry].sort((a,b)=>a.ts-b.ts);
    setSession(next);
    const nb = calcBac(next,profile.weight,profile.gender,meals);
    setBac(nb);
    setFlashIds(f=>({...f,[pendingDrink.id]:true}));
    setTimeout(()=>setFlashIds(f=>{const c={...f};delete c[pendingDrink.id];return c;}),700);
    toast_(`${pendingDrink.icon} ${pendingDrink.name}  →  ${nb.toFixed(2)}‰`);
    setPendingDrink(null);
  }

  function removeEntry(sid){
    const next=session.filter(x=>x.sid!==sid);
    setSession(next);setBac(calcBac(next,profile.weight,profile.gender,meals));
  }

  function saveDrink(){
    setDrinks(ds=>ds.map(d=>d.id===editDrink.id?{...editDrink,abv:+editDrink.abv,vol:+editDrink.vol,kcal:+editDrink.kcal}:d));
    setEditDrink(null);toast_("Gespeichert ✓");
  }
  function deleteDrink(id){setDrinks(ds=>ds.filter(d=>d.id!==id));setEditDrink(null);toast_("Gelöscht");}
  function addDrink(){
    if(!newDrink.name.trim())return;
    const d={...newDrink,id:"c_"+Date.now(),abv:+newDrink.abv,vol:+newDrink.vol,kcal:+newDrink.kcal};
    setDrinks(ds=>[...ds,d]);setShowAdd(false);
    setNewDrink({name:"",cat:"🍺 Bier",abv:"5",vol:"0.33",kcal:"150",icon:"🍺"});
    toast_(`${d.icon} ${d.name} hinzugefügt`);
  }

  function confirmAddMeal(){
    if(!newMeal.desc.trim())return;
    const m={...newMeal,id:"m_"+Date.now()};
    const next=[...meals,m];
    setMeals(next);setShowAddMeal(false);
    setNewMeal({type:"🍽️ Mittagessen",desc:"",ts:Date.now()});
    setBac(calcBac(session,profile.weight,profile.gender,next));
    toast_(`${m.type.split(" ")[0]} eingetragen`);
  }
  function removeMeal(id){
    const next=meals.filter(m=>m.id!==id);
    setMeals(next);setBac(calcBac(session,profile.weight,profile.gender,next));
  }

  const filtered = useMemo(()=>{
    let list=cat==="Alle"?drinks:drinks.filter(d=>d.cat===cat);
    if(search.trim()){const q=search.toLowerCase();list=list.filter(d=>d.name.toLowerCase().includes(q)||d.cat.toLowerCase().includes(q));}
    return list;
  },[drinks,cat,search]);

  const country = COUNTRIES.find(c=>c.id===profile.country)||COUNTRIES[0];
  const limit = profile.novice ? Math.min(country.limit, 0.0) || 0.0 : country.limit;
  const effectiveLimit = profile.novice ? 0.0 : country.limit;
  const canDrive = bac < effectiveLimit || (effectiveLimit === 0 && bac === 0);

  const soberMins = bac > 0 ? (bac/0.15)*60 : 0;
  const soberTime = new Date(Date.now()+soberMins*60000);
  const color = bacColor(bac);
  const totalKcal = session.reduce((a,x)=>a+(x.kcal||0),0);
  const recentMeals = meals.filter(m=>(Date.now()-m.ts)<3*3600000);

  const timeline = [
    ...session.map(e=>({...e, _type:"drink"})),
    ...meals.map(m=>({...m, _type:"meal"}))
  ].sort((a,b)=>b.ts-a.ts);

  const aiTip = bac===0?"Noch nüchtern – schönen Abend! 🎉"
    :bac<0.3?"Alles grün. Bleib hydratisiert! 💧"
    :bac<0.5?"Leicht angeheitert. Glas Wasser? 🚰"
    :bac<0.8?"⚠️ Führerschein-Grenze bald – kein Fahren!"
    :bac<1.2?"🔴 Limit überschritten – bitte aufhören."
    :"🆘 Sehr hoher Pegel! Wasser trinken & stopp.";

  const inp = {width:"100%",background:"#0d0f17",border:"1px solid #222638",borderRadius:10,padding:"10px 13px",color:"#e8eaf0",fontSize:13,outline:"none",fontFamily:"inherit"};
  const screenTitle = {home:"Dashboard",drinks:"Getränke",session:"Session",food:"Essen",profile:"Profil"}[screen];

  return (
    <div style={{minHeight:"100vh",background:"#0a0b10",color:"#dde0ee",fontFamily:"'DM Sans','Segoe UI',sans-serif",display:"flex",flexDirection:"column",maxWidth:440,margin:"0 auto"}}>
      {/* Toast */}
      {toast&&<div style={{position:"fixed",bottom:86,left:"50%",transform:"translateX(-50%)",zIndex:999,background:"#181b28",border:"1px solid #2a2e48",borderRadius:14,padding:"10px 20px",fontSize:13,fontWeight:500,animation:"toast .2s ease",boxShadow:"0 8px 32px #0008",whiteSpace:"nowrap",maxWidth:"88vw"}}>{toast}</div>}

      {/* Drink time modal */}
      {pendingDrink&&(
        <Modal title={`${pendingDrink.icon} ${pendingDrink.name} hinzufügen`} onClose={()=>setPendingDrink(null)}>
          <TimePicker value={pendingTs} onChange={setPendingTs}/>
          <div style={{background:"#0e1020",border:"1px solid #171a2a",borderRadius:12,padding:"12px 14px",marginBottom:16,display:"flex",justifyContent:"space-between"}}>
            <div style={{fontSize:12,color:"#555"}}>Promille-Wirkung</div>
            <div style={{fontFamily:"'Space Mono',monospace",fontSize:13,fontWeight:700,color:bacColor(hitBac(pendingDrink,profile.weight,profile.gender))}}>+{hitBac(pendingDrink,profile.weight,profile.gender).toFixed(2)}‰</div>
          </div>
          <div className="tap" onClick={confirmAddDrink} style={{background:"#2563eb",borderRadius:11,padding:"13px",textAlign:"center",fontWeight:700,fontSize:14}}>Hinzufügen ✓</div>
        </Modal>
      )}

      {/* Edit drink modal */}
      {editDrink&&(
        <Modal title="Getränk bearbeiten" onClose={()=>setEditDrink(null)}>
          <Inp label="Name" value={editDrink.name} onChange={v=>setEditDrink(d=>({...d,name:v}))}/>
          <Inp label="Alkohol (%)" type="number" value={editDrink.abv} onChange={v=>setEditDrink(d=>({...d,abv:v}))}/>
          <Inp label="Menge (Liter)" type="number" value={editDrink.vol} onChange={v=>setEditDrink(d=>({...d,vol:v}))}/>
          <Inp label="Kalorien" type="number" value={editDrink.kcal} onChange={v=>setEditDrink(d=>({...d,kcal:v}))}/>
          <Inp label="Icon" value={editDrink.icon} onChange={v=>setEditDrink(d=>({...d,icon:v}))}/>
          <div style={{display:"flex",gap:10,marginTop:4}}>
            <div className="tap" onClick={()=>deleteDrink(editDrink.id)} style={{flex:1,background:"#1e0f0f",border:"1px solid #f8717130",borderRadius:11,padding:"11px",textAlign:"center",color:"#f87171",fontSize:13,fontWeight:600}}>🗑 Löschen</div>
            <div className="tap" onClick={saveDrink} style={{flex:2,background:"#2563eb",borderRadius:11,padding:"11px",textAlign:"center",fontWeight:700,fontSize:14}}>Speichern ✓</div>
          </div>
        </Modal>
      )}

      {/* Add drink modal */}
      {showAdd&&(
        <Modal title="Neues Getränk" onClose={()=>setShowAdd(false)}>
          <Inp label="Name" value={newDrink.name} onChange={v=>setNewDrink(d=>({...d,name:v}))} placeholder="z.B. Aperol Spritz"/>
          <Inp label="Alkohol (%)" type="number" value={newDrink.abv} onChange={v=>setNewDrink(d=>({...d,abv:v}))}/>
          <Inp label="Menge (Liter)" type="number" value={newDrink.vol} onChange={v=>setNewDrink(d=>({...d,vol:v}))}/>
          <Inp label="Kalorien" type="number" value={newDrink.kcal} onChange={v=>setNewDrink(d=>({...d,kcal:v}))}/>
          <Inp label="Icon" value={newDrink.icon} onChange={v=>setNewDrink(d=>({...d,icon:v}))}/>
          <div style={{marginBottom:16}}>
            <div style={{fontSize:10,color:"#555",textTransform:"uppercase",letterSpacing:1.2,marginBottom:6}}>Kategorie</div>
            <select value={newDrink.cat} onChange={e=>setNewDrink(d=>({...d,cat:e.target.value}))} style={inp}>
              {ALL_CATS.filter(c=>c!=="Alle").map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="tap" onClick={addDrink} style={{background:"#2563eb",borderRadius:11,padding:"12px",textAlign:"center",fontWeight:700,fontSize:14}}>Hinzufügen ＋</div>
        </Modal>
      )}

      {/* Add meal modal */}
      {showAddMeal&&(
        <Modal title="Mahlzeit eintragen" onClose={()=>setShowAddMeal(false)}>
          <div style={{marginBottom:16}}>
            <div style={{fontSize:10,color:"#555",textTransform:"uppercase",letterSpacing:1.2,marginBottom:8}}>Mahlzeit</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {MEAL_TYPES.map(t=>(
                <div key={t} className="tap" onClick={()=>setNewMeal(m=>({...m,type:t}))}
                  style={{padding:"10px 8px",borderRadius:12,textAlign:"center",fontSize:13,
                    background:newMeal.type===t?"#16a34a":"#0e1020",
                    border:`1px solid ${newMeal.type===t?"#16a34a":"#1d2030"}`,
                    color:newMeal.type===t?"#fff":"#666"}}>{t}</div>
              ))}
            </div>
          </div>
          <TimePicker value={newMeal.ts} onChange={ts=>setNewMeal(m=>({...m,ts}))}/>
          <div style={{marginBottom:16}}>
            <div style={{fontSize:10,color:"#555",textTransform:"uppercase",letterSpacing:1.2,marginBottom:6}}>Was hast du gegessen?</div>
            <textarea value={newMeal.desc} onChange={e=>setNewMeal(m=>({...m,desc:e.target.value}))}
              placeholder="z.B. Pizza, Burger, Salat…" rows={3}
              style={{width:"100%",background:"#0d0f17",border:"1px solid #222638",borderRadius:10,padding:"10px 13px",color:"#e8eaf0",fontSize:13,outline:"none",fontFamily:"inherit",resize:"none",lineHeight:1.5}}/>
          </div>
          <div className="tap" onClick={confirmAddMeal} style={{background:"#16a34a",borderRadius:11,padding:"12px",textAlign:"center",fontWeight:700,fontSize:14}}>Eintragen ✓</div>
        </Modal>
      )}

      {/* Header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 18px 12px",borderBottom:"1px solid #13151f",background:"#0a0b10",position:"sticky",top:0,zIndex:50}}>
        <div>
          <div style={{fontSize:9,letterSpacing:3,color:"#252840",textTransform:"uppercase",fontFamily:"'Space Mono',monospace"}}>PromilleTracker</div>
          <div style={{fontSize:17,fontWeight:700,marginTop:1}}>{screenTitle}</div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {session.length>0&&(
            <div key={bac.toFixed(2)} style={{background:color+"18",border:`1px solid ${color}40`,borderRadius:20,padding:"4px 13px",fontFamily:"'Space Mono',monospace",fontSize:15,fontWeight:700,color,animation:"pop .3s ease"}}>
              {bac.toFixed(2)}‰
            </div>
          )}
          <div className="tap" onClick={()=>setScreen("profile")} style={{width:36,height:36,borderRadius:"50%",background:"#13151e",display:"grid",placeItems:"center",fontSize:18,border:"1px solid #1d2030"}}>
            {country.flag}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{flex:1,overflowY:"auto",paddingBottom:88}}>

        {/* ══ HOME ══ */}
        {screen==="home"&&(
          <div style={{padding:"16px 16px 0",animation:"fadeUp .25s ease"}}>
            {/* BAC hero */}
            <div style={{background:"linear-gradient(140deg,#0e1020,#141729)",border:`1px solid ${color}28`,borderRadius:22,padding:"22px 22px 18px",marginBottom:14,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:-24,right:-24,width:110,height:110,borderRadius:"50%",background:color+"09",pointerEvents:"none"}}/>
              <div style={{fontSize:10,color:"#333",letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>Aktueller Promillewert</div>
              <div key={bac.toFixed(3)} style={{fontSize:68,fontWeight:700,fontFamily:"'Space Mono',monospace",color,lineHeight:1,animation:"pop .3s ease"}}>
                {bac.toFixed(2)}<span style={{fontSize:24,color:color+"77"}}>‰</span>
              </div>
              {session.length>0&&<>
                <div style={{marginTop:14,height:5,borderRadius:3,background:"#181c2c"}}>
                  <div style={{height:"100%",width:`${Math.min(bac/2.5*100,100)}%`,background:color,borderRadius:3,transition:"width .6s ease"}}/>
                </div>
                <div style={{marginTop:10,fontSize:13,color:"#555"}}>
                  Nüchtern ~<span style={{color:"#bcc",fontWeight:600}}>{fmtTime(soberTime.getTime())} Uhr</span> · {(soberMins/60).toFixed(1)}h
                </div>
              </>}
              {session.length===0&&<div style={{marginTop:10,fontSize:13,color:"#2a2f45"}}>Noch keine Getränke – starte die Session!</div>}
            </div>

            {/* Drive status */}
            <div style={{background: canDrive?"#091810":"#1a0c0c", border:`1px solid ${canDrive?"#16a34a33":"#f8717133"}`, borderRadius:16,padding:"13px 16px",marginBottom:14,display:"flex",gap:12,alignItems:"center"}}>
              <div style={{fontSize:24}}>{canDrive?"✅":"🚫"}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:13,color:canDrive?"#4ade80":"#f87171"}}>
                  {canDrive?"Fahrbereit":"Nicht fahren!"}
                </div>
                <div style={{fontSize:11,color:canDrive?"#2d6040":"#8a4040",marginTop:2}}>
                  {country.flag} {country.name} · Limit: {effectiveLimit===0?"0.0":effectiveLimit}‰
                  {profile.novice?" (Neulenker)":""}
                  {country.note?` · ${country.note}`:""}
                </div>
              </div>
              {!canDrive&&bac>0&&(
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:10,color:"#555"}}>Legal ab</div>
                  <div style={{fontFamily:"'Space Mono',monospace",fontSize:12,fontWeight:700,color:"#f87171"}}>
                    {fmtTime(Date.now()+((bac-effectiveLimit)/0.15)*3600000)}
                  </div>
                </div>
              )}
            </div>

            {/* AI tip */}
            <div style={{background:"#0e1020",border:"1px solid #171a2a",borderRadius:16,padding:"13px 15px",marginBottom:14,display:"flex",gap:12}}>
              <div style={{fontSize:18}}>🤖</div>
              <div>
                <div style={{fontSize:9,color:"#333",textTransform:"uppercase",letterSpacing:2,marginBottom:3}}>KI-Analyse</div>
                <div style={{fontSize:13,lineHeight:1.6,color:"#6870a0"}}>{aiTip}</div>
              </div>
            </div>

            {/* Stats */}
            {session.length>0&&(
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:9,marginBottom:14}}>
                {[{icon:"🥤",val:session.length,label:"Getränke"},{icon:"🔥",val:totalKcal+" kcal",label:"Kalorien"},{icon:"🍽️",val:recentMeals.length>0?`-${recentMeals.length>=2?35:20}% BAC`:"Nüchtern",label:"Essen-Effekt"}].map(s=>(
                  <div key={s.label} style={{background:"#0e1020",border:"1px solid #171a2a",borderRadius:14,padding:"12px 10px",textAlign:"center"}}>
                    <div style={{fontSize:20}}>{s.icon}</div>
                    <div style={{fontSize:12,fontWeight:700,marginTop:4}}>{s.val}</div>
                    <div style={{fontSize:9,color:"#333",marginTop:2}}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Quick repeat */}
            {session.length>0&&(
              <div style={{marginBottom:14}}>
                <div style={{fontSize:9,color:"#333",textTransform:"uppercase",letterSpacing:2,marginBottom:10}}>Nochmal?</div>
                <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4}}>
                  {[...new Map(session.map(x=>[x.name,x])).values()].slice(-5).map(d=>(
                    <div key={d.name} className="tap hov" onClick={()=>{setPendingDrink(d);setPendingTs(Date.now());}}
                      style={{flexShrink:0,background:"#0e1020",border:"1px solid #171a2a",borderRadius:13,padding:"10px 13px",textAlign:"center",minWidth:76}}>
                      <div style={{fontSize:22}}>{d.icon}</div>
                      <div style={{fontSize:10,color:"#555",marginTop:3,maxWidth:68,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.name}</div>
                      <div style={{fontSize:9,fontFamily:"'Space Mono',monospace",color:bacColor(hitBac(d,profile.weight,profile.gender)),marginTop:3}}>+{hitBac(d,profile.weight,profile.gender).toFixed(2)}‰</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ DRINKS ══ */}
        {screen==="drinks"&&(
          <div style={{padding:"14px 14px 0",animation:"fadeUp .25s ease"}}>
            <div style={{position:"relative",marginBottom:10}}>
              <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:13,color:"#444"}}>🔍</span>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Getränk suchen…"
                style={{...inp,paddingLeft:36,fontSize:14}}/>
              {search&&<span className="tap" onClick={()=>setSearch("")} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",color:"#444",fontSize:18}}>×</span>}
            </div>
            <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:10}}>
              {ALL_CATS.map(c=>(
                <div key={c} className="tap" onClick={()=>setCat(c)} style={{flexShrink:0,padding:"5px 13px",borderRadius:20,fontSize:11,fontWeight:500,background:cat===c?"#2563eb":"#0e1020",border:`1px solid ${cat===c?"#2563eb":"#1d2030"}`,color:cat===c?"#fff":"#555"}}>{c}</div>
              ))}
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 2px 10px"}}>
              <div style={{fontSize:10,color:"#333"}}>{filtered.length} Getränke</div>
              <div className="tap" onClick={()=>setShowAdd(true)} style={{fontSize:11,color:"#3b82f6",fontWeight:600}}>＋ Neues Getränk</div>
            </div>
            {filtered.length===0&&(
              <div style={{textAlign:"center",padding:"40px 0",color:"#333"}}>
                <div style={{fontSize:34}}>🔍</div>
                <div style={{marginTop:10,fontSize:13}}>Nichts für „{search}"</div>
              </div>
            )}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
              {filtered.map(d=>{
                const hit=hitBac(d,profile.weight,profile.gender);
                return(
                  <div key={d.id} className="hov" style={{background:flashIds[d.id]?"#112214":"#0e1020",border:`1px solid ${flashIds[d.id]?"#4ade8040":"#171a2a"}`,borderRadius:14,padding:12,position:"relative",transition:"background .4s,border-color .4s"}}>
                    <div className="tap" onClick={()=>setEditDrink({...d,abv:String(d.abv),vol:String(d.vol),kcal:String(d.kcal)})}
                      style={{position:"absolute",top:8,right:8,fontSize:12,color:"#2a2e44",padding:3,lineHeight:1}}>✏️</div>
                    <div className="tap" onClick={()=>{setPendingDrink(d);setPendingTs(Date.now());}}>
                      <div style={{fontSize:26,marginBottom:7}}>{d.icon}</div>
                      <div style={{fontWeight:600,fontSize:12,paddingRight:18,lineHeight:1.3}}>{d.name}</div>
                      <div style={{fontSize:10,color:"#3a3f5a",marginTop:3}}>{d.vol*1000}ml · {d.abv}%</div>
                      <div style={{marginTop:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div style={{fontSize:12,fontFamily:"'Space Mono',monospace",fontWeight:700,color:bacColor(hit)}}>+{hit.toFixed(2)}‰</div>
                        <div style={{fontSize:9,color:"#2a2e44"}}>{d.kcal} kcal</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{height:16}}/>
          </div>
        )}

        {/* ══ SESSION ══ */}
        {screen==="session"&&(
          <div style={{padding:"16px 16px 0",animation:"fadeUp .25s ease"}}>
            {timeline.length===0?(
              <div style={{textAlign:"center",padding:"60px 0",color:"#2a2e44"}}>
                <div style={{fontSize:44}}>🥤</div>
                <div style={{marginTop:14,fontSize:14}}>Noch keine Einträge</div>
                <div className="tap" onClick={()=>setScreen("drinks")} style={{display:"inline-block",marginTop:18,padding:"10px 24px",background:"#2563eb",borderRadius:20,fontSize:13,fontWeight:600,color:"#fff"}}>Getränk hinzufügen</div>
              </div>
            ):<>
              {/* Live bar */}
              <div style={{background:"#0e1020",border:"1px solid #171a2a",borderRadius:16,padding:16,marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:10}}>
                  <div style={{fontSize:9,color:"#333",textTransform:"uppercase",letterSpacing:2}}>Live Promille</div>
                  <div key={bac.toFixed(3)} style={{fontFamily:"'Space Mono',monospace",fontSize:22,fontWeight:700,color,animation:"pop .3s ease"}}>{bac.toFixed(2)}‰</div>
                </div>
                <div style={{height:5,borderRadius:3,background:"#181c2c"}}>
                  <div style={{height:"100%",width:`${Math.min(bac/2.5*100,100)}%`,background:color,borderRadius:3,transition:"width .5s"}}/>
                </div>
                <div style={{marginTop:8,fontSize:11,color:"#444",display:"flex",justifyContent:"space-between"}}>
                  <span>Nüchtern ca. {fmtTime(soberTime.getTime())} Uhr</span>
                  <span style={{color:canDrive?"#4ade80":"#f87171"}}>{canDrive?"✅ Fahrbereit":"🚫 Nicht fahren"}</span>
                </div>
              </div>

              {/* Add meal shortcut */}
              <div className="tap" onClick={()=>setShowAddMeal(true)}
                style={{background:"#0a1410",border:"1px solid #16a34a33",borderRadius:12,padding:"10px 14px",marginBottom:12,display:"flex",alignItems:"center",gap:10}}>
                <div style={{fontSize:18}}>🍽️</div>
                <div style={{fontSize:12,color:"#2d6040"}}>Mahlzeit zur Session hinzufügen</div>
                <div style={{marginLeft:"auto",fontSize:18,color:"#16a34a33"}}>＋</div>
              </div>

              {/* Timeline */}
              {timeline.map((item,i)=>{
                if(item._type==="meal"){
                  const ageH=(Date.now()-item.ts)/3600000;
                  const active=ageH<3;
                  return(
                    <div key={item.id} style={{display:"flex",alignItems:"flex-start",gap:12,background:"#091410",border:`1px solid ${active?"#16a34a33":"#0f2018"}`,borderRadius:13,padding:"11px 13px",marginBottom:8,animation:`fadeUp .18s ease ${i*.02}s both`,opacity:active?1:0.5}}>
                      <div style={{fontSize:22,marginTop:1}}>{item.type.split(" ")[0]}</div>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:6}}>
                          <div style={{fontWeight:600,fontSize:12,color:"#4ade80"}}>{item.type.split(" ").slice(1).join(" ")}</div>
                          {active&&<div style={{fontSize:8,background:"#16a34a22",color:"#4ade80",borderRadius:8,padding:"1px 6px",fontWeight:600}}>AKTIV</div>}
                        </div>
                        <div style={{fontSize:11,color:"#2d5030",marginTop:2}}>{item.desc}</div>
                        <div style={{fontSize:9,color:"#333",marginTop:3}}>{fmtTime(item.ts)} Uhr{active?` · noch ${(3-ageH).toFixed(1)}h aktiv`:""}</div>
                      </div>
                      <div className="tap" onClick={()=>removeMeal(item.id)} style={{color:"#1a2e1a",fontSize:15,padding:4}}>×</div>
                    </div>
                  );
                }
                return(
                  <div key={item.sid} style={{display:"flex",alignItems:"center",gap:12,background:"#0e1020",border:"1px solid #171a2a",borderRadius:13,padding:"11px 13px",marginBottom:8,animation:`fadeUp .18s ease ${i*.02}s both`}}>
                    <div style={{fontSize:22}}>{item.icon}</div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:600,fontSize:13}}>{item.name}</div>
                      <div style={{fontSize:10,color:"#3a3f5a",marginTop:2}}>{fmtTime(item.ts)} · {item.vol*1000}ml · {item.abv}%</div>
                    </div>
                    <div style={{fontFamily:"'Space Mono',monospace",fontSize:12,fontWeight:700,color:bacColor(hitBac(item,profile.weight,profile.gender))}}>+{hitBac(item,profile.weight,profile.gender).toFixed(2)}‰</div>
                    <div className="tap" onClick={()=>removeEntry(item.sid)} style={{color:"#2a2e44",fontSize:16,padding:4}}>×</div>
                  </div>
                );
              })}

              <div className="tap" onClick={()=>{setSession([]);setMeals([]);setBac(0);setScreen("home");toast_("Session zurückgesetzt");}}
                style={{background:"#180c0c",border:"1px solid #f8717120",borderRadius:12,padding:"12px",textAlign:"center",fontSize:12,color:"#f87171",marginTop:8}}>
                🗑 Session & Mahlzeiten zurücksetzen
              </div>
              <div style={{height:16}}/>
            </>}
          </div>
        )}

        {/* ══ FOOD ══ */}
        {screen==="food"&&(
          <div style={{padding:"16px 16px 0",animation:"fadeUp .25s ease"}}>
            <div style={{background:"#0a1a0d",border:"1px solid #14532d44",borderRadius:16,padding:"14px 16px",marginBottom:14}}>
              <div style={{fontSize:12,fontWeight:600,color:"#4ade80",marginBottom:6}}>🍽️ Wie wirkt Essen auf den BAC?</div>
              <div style={{fontSize:12,color:"#2d6040",lineHeight:1.7}}>
                1 Mahlzeit in den letzten 3h → <span style={{color:"#4ade80",fontWeight:600}}>−20% BAC</span><br/>
                2+ Mahlzeiten → <span style={{color:"#4ade80",fontWeight:600}}>−35% BAC</span><br/>
                Fettreiches Essen verzögert Absorption am stärksten.
              </div>
            </div>
            <div style={{background:"#0e1020",border:"1px solid #171a2a",borderRadius:14,padding:"14px 16px",marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:11,color:"#444",textTransform:"uppercase",letterSpacing:1}}>Aktueller Effekt</div>
                <div style={{fontSize:13,fontWeight:700,color:recentMeals.length>0?"#4ade80":"#555",marginTop:4}}>
                  {recentMeals.length===0?"Kein Effekt":recentMeals.length===1?"−20% BAC":"−35% BAC"}
                </div>
              </div>
              <div style={{fontSize:11,color:"#333"}}>{recentMeals.length} aktive Mahlzeit{recentMeals.length!==1?"en":""}</div>
            </div>
            <div className="tap" onClick={()=>setShowAddMeal(true)}
              style={{background:"#0a1a0d",border:"1px solid #16a34a55",borderRadius:14,padding:"14px 16px",marginBottom:14,display:"flex",alignItems:"center",gap:12}}>
              <div style={{fontSize:26}}>＋</div>
              <div><div style={{fontWeight:600,fontSize:14,color:"#4ade80"}}>Mahlzeit hinzufügen</div>
              <div style={{fontSize:11,color:"#2d5030",marginTop:2}}>Mit Zeitauswahl</div></div>
            </div>
            {meals.length===0?(
              <div style={{textAlign:"center",padding:"40px 0",color:"#2a2e44"}}>
                <div style={{fontSize:44}}>🍽️</div>
                <div style={{marginTop:14,fontSize:14}}>Noch keine Mahlzeiten</div>
              </div>
            ):<>
              <div style={{fontSize:10,color:"#333",textTransform:"uppercase",letterSpacing:2,marginBottom:10}}>Alle Mahlzeiten</div>
              {[...meals].reverse().map((m,i)=>{
                const ageH=(Date.now()-m.ts)/3600000;
                const active=ageH<3;
                return(
                  <div key={m.id} style={{display:"flex",alignItems:"flex-start",gap:12,background:"#0e1020",border:`1px solid ${active?"#16a34a33":"#171a2a"}`,borderRadius:13,padding:"12px 13px",marginBottom:8,animation:`fadeUp .18s ease ${i*.03}s both`}}>
                    <div style={{fontSize:22,marginTop:1}}>{m.type.split(" ")[0]}</div>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div style={{fontWeight:600,fontSize:13}}>{m.type.split(" ").slice(1).join(" ")}</div>
                        {active&&<div style={{fontSize:9,background:"#16a34a22",color:"#4ade80",borderRadius:10,padding:"2px 7px",fontWeight:600}}>AKTIV</div>}
                      </div>
                      <div style={{fontSize:12,color:"#6870a0",marginTop:3,lineHeight:1.4}}>{m.desc}</div>
                      <div style={{fontSize:10,color:"#333",marginTop:4}}>
                        {fmtTime(m.ts)} Uhr{active?` · noch ${(3-ageH).toFixed(1)}h aktiv`:" · abgelaufen"}
                      </div>
                    </div>
                    <div className="tap" onClick={()=>removeMeal(m.id)} style={{color:"#2a2e44",fontSize:16,padding:4,marginTop:-2}}>×</div>
                  </div>
                );
              })}
              <div className="tap" onClick={()=>{setMeals([]);setBac(calcBac(session,profile.weight,profile.gender,[]));toast_("Mahlzeiten gelöscht");}}
                style={{background:"#180c0c",border:"1px solid #f8717120",borderRadius:12,padding:"11px",textAlign:"center",fontSize:12,color:"#f87171",marginTop:8}}>
                🗑 Alle Mahlzeiten löschen
              </div>
            </>}
            <div style={{height:16}}/>
          </div>
        )}

        {/* ══ PROFILE ══ */}
        {screen==="profile"&&(
          <div style={{padding:"16px 16px 0",animation:"fadeUp .25s ease"}}>
            <div style={{background:"#0e1020",border:"1px solid #171a2a",borderRadius:18,padding:20,marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                <div style={{fontSize:15,fontWeight:700}}>Mein Profil</div>
                <div className="tap" onClick={()=>{setEditProfile(!editProfile);setTmpProf(profile)}} style={{fontSize:12,color:"#3b82f6",fontWeight:600}}>
                  {editProfile?"Abbrechen":"Bearbeiten"}
                </div>
              </div>
              {!editProfile?(
                <div style={{display:"grid",gap:16}}>
                  {[
                    {icon:"👤",label:"Name",val:profile.name},
                    {icon:"⚖️",label:"Gewicht",val:profile.weight+" kg"},
                    {icon:"🧬",label:"Geschlecht",val:profile.gender==="m"?"Männlich":"Weiblich"},
                    {icon:country.flag,label:"Land",val:country.name},
                    {icon:"🚗",label:"Führerschein-Limit",val:`${effectiveLimit===0?"0.0":effectiveLimit}‰${profile.novice?" (Neulenker)":""}`},
                  ].map(r=>(
                    <div key={r.label} style={{display:"flex",gap:14,alignItems:"center"}}>
                      <div style={{fontSize:22,width:32,textAlign:"center"}}>{r.icon}</div>
                      <div><div style={{fontSize:10,color:"#444"}}>{r.label}</div><div style={{fontSize:14,fontWeight:600,marginTop:2}}>{r.val}</div></div>
                    </div>
                  ))}
                </div>
              ):(
                <div style={{display:"grid",gap:14}}>
                  {[{label:"Name",key:"name",type:"text"},{label:"Gewicht (kg)",key:"weight",type:"number"}].map(f=>(
                    <div key={f.key}>
                      <div style={{fontSize:10,color:"#444",marginBottom:6}}>{f.label}</div>
                      <input type={f.type} value={tmpProf[f.key]} onChange={e=>setTmpProf(p=>({...p,[f.key]:f.type==="number"?+e.target.value:e.target.value}))} style={inp}/>
                    </div>
                  ))}
                  <div>
                    <div style={{fontSize:10,color:"#444",marginBottom:8}}>Geschlecht</div>
                    <div style={{display:"flex",gap:10}}>
                      {[["m","Männlich"],["f","Weiblich"]].map(([v,l])=>(
                        <div key={v} className="tap" onClick={()=>setTmpProf(p=>({...p,gender:v}))}
                          style={{flex:1,textAlign:"center",padding:"10px",borderRadius:10,fontSize:13,background:tmpProf.gender===v?"#2563eb":"#151826",border:`1px solid ${tmpProf.gender===v?"#2563eb":"#222638"}`,color:tmpProf.gender===v?"#fff":"#555"}}>{l}</div>
                      ))}
                    </div>
                  </div>
                  {/* Country picker */}
                  <div>
                    <div style={{fontSize:10,color:"#444",marginBottom:8}}>Land / Führerschein-Grenzwert</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,maxHeight:220,overflowY:"auto"}}>
                      {COUNTRIES.map(c=>(
                        <div key={c.id} className="tap" onClick={()=>setTmpProf(p=>({...p,country:c.id}))}
                          style={{padding:"8px 10px",borderRadius:10,fontSize:12,display:"flex",alignItems:"center",gap:8,
                            background:tmpProf.country===c.id?"#1e2f5e":"#0d0f17",
                            border:`1px solid ${tmpProf.country===c.id?"#2563eb":"#222638"}`,
                            color:tmpProf.country===c.id?"#fff":"#666"}}>
                          <span style={{fontSize:16}}>{c.flag}</span>
                          <div>
                            <div style={{fontWeight:500,lineHeight:1.2}}>{c.name}</div>
                            <div style={{fontSize:9,opacity:.6}}>{c.limit===0?"0.0":c.limit}‰</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Novice toggle */}
                  <div className="tap" onClick={()=>setTmpProf(p=>({...p,novice:!p.novice}))}
                    style={{background:tmpProf.novice?"#1a1a0f":"#0d0f17",border:`1px solid ${tmpProf.novice?"#ca8a04":"#222638"}`,borderRadius:10,padding:"12px 14px",display:"flex",alignItems:"center",gap:12}}>
                    <div style={{fontSize:20}}>🔰</div>
                    <div>
                      <div style={{fontSize:13,fontWeight:500}}>Neulenker / Probezeit</div>
                      <div style={{fontSize:11,color:"#555",marginTop:1}}>0.0‰ Limit aktiv</div>
                    </div>
                    <div style={{marginLeft:"auto",fontSize:18}}>{tmpProf.novice?"✅":"⬜"}</div>
                  </div>
                  <div className="tap" onClick={()=>{setProfile(tmpProf);setEditProfile(false);setBac(calcBac(session,tmpProf.weight,tmpProf.gender,meals));toast_("Profil gespeichert ✓");}}
                    style={{background:"#2563eb",borderRadius:11,padding:"12px",textAlign:"center",fontWeight:700,fontSize:14}}>Speichern</div>
                </div>
              )}
            </div>
            <div style={{background:"#091410",border:"1px solid #0f3020",borderRadius:14,padding:16}}>
              <div style={{fontSize:12,fontWeight:600,color:"#4ade80",marginBottom:6}}>ℹ️ Hinweis</div>
              <div style={{fontSize:11,color:"#2a5040",lineHeight:1.7}}>Berechnung nach Widmark-Formel – Schätzwert. Essen, Medikamente und Metabolismus beeinflussen den Pegel. Im Zweifel: Nicht fahren!</div>
            </div>
            <div style={{height:16}}/>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:440,background:"#0a0b10",borderTop:"1px solid #13151f",display:"grid",gridTemplateColumns:"repeat(5,1fr)",padding:"8px 0",zIndex:60}} className="safe-bottom">
        {[{id:"home",icon:"🏠",label:"Home"},{id:"drinks",icon:"🍺",label:"Getränke"},{id:"session",icon:"📋",label:"Session",badge:session.length},{id:"food",icon:"🍽️",label:"Essen",badge2:recentMeals.length||null},{id:"profile",icon:country.flag,label:"Profil"}].map(tab=>(
          <div key={tab.id} className="tap" onClick={()=>setScreen(tab.id)} style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"5px 0",position:"relative"}}>
            {screen===tab.id&&<div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:20,height:2,background:"#3b82f6",borderRadius:2}}/>}
            <div style={{fontSize:18}}>{tab.icon}</div>
            <div style={{fontSize:8,marginTop:2,color:screen===tab.id?"#3b82f6":"#333",fontWeight:screen===tab.id?700:400}}>{tab.label}</div>
            {tab.badge>0&&<div style={{position:"absolute",top:3,right:"50%",transform:"translateX(10px)",background:"#3b82f6",borderRadius:"50%",width:14,height:14,fontSize:8,display:"grid",placeItems:"center",fontWeight:700}}>{tab.badge}</div>}
            {tab.badge2>0&&<div style={{position:"absolute",top:3,right:"50%",transform:"translateX(10px)",background:"#16a34a",borderRadius:"50%",width:14,height:14,fontSize:8,display:"grid",placeItems:"center",fontWeight:700}}>{tab.badge2}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
