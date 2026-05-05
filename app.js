const { useState, useEffect, useMemo, useRef } = React;

// ═══ THEMES ═══
const DARK_T = {
  bg:        "#0a0b10",
  bg2:       "#0e1020",
  bg3:       "#12141e",
  bg4:       "#0d0f17",
  bgGrad:    "linear-gradient(140deg,#0e1020,#141729)",
  bgFlash:   "#112214",
  bgDanger:  "#180c0c",
  bgWarn:    "#1a0c0c",
  bgOk:      "#091810",
  bgOk2:     "#0a1410",
  bgFood:    "#0a1a0d",
  bgJoin:    "#1d283a",
  bgReset:   "#100e20",
  bgBar:     "#181c2c",
  border:    "#171a2a",
  border2:   "#1e2132",
  borderNav: "#13151f",
  borderIn:  "#222638",
  text:      "#dde0ee",
  textBr:    "#e8eaf0",
  text2:     "#6870a0",
  m1:        "#555",
  m2:        "#444",
  m3:        "#333",
  m4:        "#3a3f5a",
  m5:        "#2a2e44",
  toast:     "#181b28",
  toastB:    "#2a2e48",
};
const LIGHT_T = {
  bg:        "#f4f5fb",
  bg2:       "#ffffff",
  bg3:       "#ffffff",
  bg4:       "#f0f2fa",
  bgGrad:    "linear-gradient(140deg,#ffffff,#f0f2fa)",
  bgFlash:   "#e8fff0",
  bgDanger:  "#fff0f0",
  bgWarn:    "#fff0f0",
  bgOk:      "#f0fff5",
  bgOk2:     "#ecfff5",
  bgFood:    "#e8fff3",
  bgJoin:    "#e8ecf8",
  bgReset:   "#f0eeff",
  bgBar:     "#e8eaf4",
  border:    "#e0e3f5",
  border2:   "#d0d4ec",
  borderNav: "#e4e6f2",
  borderIn:  "#d0d4ec",
  text:      "#1a1c2e",
  textBr:    "#1a1c2e",
  text2:     "#505880",
  m1:        "#8890b0",
  m2:        "#9098b8",
  m3:        "#b0b8d0",
  m4:        "#a0a8c0",
  m5:        "#c4c8e0",
  toast:     "#ffffff",
  toastB:    "#d0d4ec",
};

const ThemeContext = React.createContext(DARK_T);

// ═══ CONSTANTS ═══
const COUNTRIES = [
  { id: "ch", flag: "🇨🇭", name: "Schweiz", limit: 0.5, note: "0.0‰ für Neulenker & Berufsfahrer" },
  { id: "de", flag: "🇩🇪", name: "Deutschland", limit: 0.5, note: "0.0‰ unter 21 J. / Probezeit" },
  { id: "at", flag: "🇦🇹", name: "Österreich", limit: 0.5, note: "0.1‰ für Probeführerschein" },
  { id: "fr", flag: "🇫🇷", name: "Frankreich", limit: 0.5, note: "0.2‰ für Fahranfänger" },
  { id: "it", flag: "🇮🇹", name: "Italien", limit: 0.5, note: "0.0‰ unter 21 J. / Neulenker" },
  { id: "es", flag: "🇪🇸", name: "Spanien", limit: 0.5, note: "0.3‰ für Profis & Fahranfänger" },
  { id: "gr", flag: "🇬🇷", name: "Griechenland", limit: 0.5, note: "" },
  { id: "nl", flag: "🇳🇱", name: "Niederlande", limit: 0.5, note: "0.2‰ für Fahranfänger" },
  { id: "be", flag: "🇧🇪", name: "Belgien", limit: 0.5, note: "" },
  { id: "dk", flag: "🇩🇰", name: "Dänemark", limit: 0.5, note: "" },
  { id: "no", flag: "🇳🇴", name: "Norwegen", limit: 0.2, note: "" },
  { id: "se", flag: "🇸🇪", name: "Schweden", limit: 0.2, note: "" },
  { id: "pl", flag: "🇵🇱", name: "Polen", limit: 0.2, note: "" },
  { id: "ee", flag: "🇪🇪", name: "Estland", limit: 0.2, note: "" },
  { id: "cz", flag: "🇨🇿", name: "Tschechien", limit: 0.0, note: "Nulltoleranz" },
  { id: "hu", flag: "🇭🇺", name: "Ungarn", limit: 0.0, note: "Nulltoleranz" },
  { id: "sk", flag: "🇸🇰", name: "Slowakei", limit: 0.0, note: "Nulltoleranz" },
  { id: "ro", flag: "🇷🇴", name: "Rumänien", limit: 0.0, note: "Nulltoleranz" },
  { id: "gb", flag: "🇬🇧", name: "United Kingdom", limit: 0.8, note: "Schottland: 0.5‰" },
  { id: "mt", flag: "🇲🇹", name: "Malta", limit: 0.8, note: "" },
];

const DEFAULT_DRINKS = [
  { id: "bier", cat: "🍺 Bier", name: "Bier", vol: 0.33, abv: 5.0, kcal: 150, icon: "🍺" },
  { id: "wein", cat: "🍷 Wein", name: "Wein / Prosecco", vol: 0.1, abv: 12.0, kcal: 85, icon: "🍷" },
  { id: "shot", cat: "🔥 Shots", name: "Shot allgemein", vol: 0.04, abv: 30.0, kcal: 90, icon: "🔥" },
  { id: "longdrink", cat: "🍹 Longdrinks", name: "Longdrink / Mix", vol: 0.3, abv: 12.0, kcal: 180, icon: "🍹" },
  { id: "gin-tonic", cat: "🍹 Longdrinks", name: "Gin Tonic", vol: 0.3, abv: 10.0, kcal: 150, icon: "🍹" },
  { id: "vodka-bull", cat: "🍹 Longdrinks", name: "Vodka Bull", vol: 0.3, abv: 12.0, kcal: 180, icon: "🍹" },
  { id: "cuba-libre", cat: "🍹 Longdrinks", name: "Cuba Libre", vol: 0.3, abv: 11.0, kcal: 160, icon: "🍹" },
  { id: "aperol-spriz", cat: "🍹 Longdrinks", name: "Aperol Spritz", vol: 0.2, abv: 7.0, kcal: 140, icon: "🍹" },
  { id: "cocktail", cat: "🍹 Longdrinks", name: "Cocktail", vol: 0.2, abv: 18.0, kcal: 220, icon: "🍸" },
  { id: "vodka", cat: "🫙 Spirituosen", name: "Wodka", vol: 0.04, abv: 40.0, kcal: 95, icon: "🫙" },
  { id: "vodka-shot", cat: "🫙 Spirituosen", name: "Vodka", vol: 0.04, abv: 40.0, kcal: 90, icon: "🫙" },
  { id: "tequila-shot", cat: "🫙 Spirituosen", name: "Tequila", vol: 0.04, abv: 38.0, kcal: 85, icon: "🫙" },
  { id: "whisky-shot", cat: "🫙 Spirituosen", name: "Whisky", vol: 0.04, abv: 43.0, kcal: 100, icon: "🫙" },
  { id: "jagermeister", cat: "🫙 Spirituosen", name: "Jägermeister", vol: 0.04, abv: 35.0, kcal: 110, icon: "🫙" },
  { id: "rum-shot", cat: "🫙 Spirituosen", name: "Weisser Rum", vol: 0.04, abv: 37.5, kcal: 95, icon: "🫙" },
  { id: "gin", cat: "🫙 Spirituosen", name: "Gin", vol: 0.04, abv: 40.0, kcal: 110, icon: "🌿" },
  { id: "rum", cat: "🫙 Spirituosen", name: "Rum", vol: 0.04, abv: 40.0, kcal: 100, icon: "🥃" },
  { id: "whisky", cat: "🫙 Spirituosen", name: "Whisky", vol: 0.04, abv: 40.0, kcal: 112, icon: "🥃" },
  { id: "aperitif", cat: "🍸 Aperitif", name: "Aperitif (Aperol/etc)", vol: 0.2, abv: 11.0, kcal: 160, icon: "🥂" },
];

const ALL_CATS = ["Alle", ...new Set(DEFAULT_DRINKS.map(d => d.cat))];
const MEAL_TYPES = ["🥐 Frühstück", "🍽️ Mittagessen", "🍝 Abendessen", "🍿 Snack"];

// ═══ HELPERS ═══
function fmtTime(ts) {
  const d = new Date(ts);
  return d.getHours().toString().padStart(2, "0") + ":" + d.getMinutes().toString().padStart(2, "0");
}
function tsFromTime(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  const d = new Date(); d.setHours(h, m, 0, 0); return d.getTime();
}
function calcBac(entries, weight, gender, meals = []) {
  if (!entries.length) return 0;
  const r = gender === "m" ? 0.7 : 0.6;
  const now = Date.now();
  let totalG = 0;
  // Gramm = Volumen (ml) * (Abv/100) * 0.8
  for (const e of entries) totalG += (e.vol * 1000) * (e.abv / 100) * 0.8;
  const firstTs = Math.min(...entries.map(x => x.ts));
  const activeMeals = meals.filter(m => Math.abs(m.ts - firstTs) < 3 * 3600000 || m.ts < firstTs);
  const foodFactor = activeMeals.length === 0 ? 1.0 : activeMeals.length === 1 ? 0.80 : 0.65;
  const rawBac = (totalG * foodFactor) / (weight * r);
  const elapsedH = (now - firstTs) / 3600000;
  return Math.max(0, rawBac - 0.15 * elapsedH);
}
function hitBac(d, w, g) {
  const r = g === "m" ? 0.7 : 0.6;
  return (d.vol * (d.abv / 100) * 789) / (w * r);
}
const bacColor = (v) => {
  if (v <= 0) return "#4ade80";
  if (v < 0.3) return "#4ade80";
  if (v < 0.5) return "#a3e635";
  if (v < 0.8) return "#facc15";
  if (v < 1.2) return "#fb923c";
  return "#f87171";
};
const getCurrentGrams = (list) => list.reduce((a, e) => a + (e.vol * 1000 * (e.abv / 100) * 0.8), 0);

// BAC zu einem bestimmten Zeitpunkt berechnen (für Chart)
function calcBacAt(entries, weight, gender, meals, atTime) {
  const e2 = entries.filter(e => e.ts <= atTime);
  if (!e2.length) return 0;
  const r = gender === "m" ? 0.7 : 0.6;
  let totalG = 0;
  for (const e of e2) totalG += (e.vol * 1000) * (e.abv / 100) * 0.8;
  const firstTs = Math.min(...e2.map(x => x.ts));
  const activeMeals = meals.filter(m => Math.abs(m.ts - firstTs) < 3 * 3600000 || m.ts < firstTs);
  const foodFactor = activeMeals.length === 0 ? 1.0 : activeMeals.length === 1 ? 0.80 : 0.65;
  const rawBac = (totalG * foodFactor) / (weight * r);
  const elapsedH = (atTime - firstTs) / 3600000;
  return Math.max(0, rawBac - 0.15 * elapsedH);
}

function fmtCountdown(ms) {
  if (ms <= 0) return "nüchtern";
  const totalMin = Math.ceil(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h === 0) return `${m}min`;
  return `${h}h ${m > 0 ? m + "min" : ""}`;
}

// ═══ BAC VERLAUFSCHART ═══
function BacChart({ session, profile, meals, limit, color }) {
  if (session.length === 0) return null;
  const W = 320, H = 110;
  const PL = 26, PR = 8, PT = 8, PB = 22;
  const now = Date.now();
  const firstTs = Math.min(...session.map(x => x.ts));
  const currentBac = calcBacAt(session, profile.weight, profile.gender, meals, now);
  const soberMs = currentBac > 0 ? (currentBac / 0.15) * 3600000 : 0;
  const soberTs = now + soberMs;
  const endTs = soberTs + 1800000;

  const step = 900000;
  const pts = [];
  for (let ts = firstTs; ts <= endTs; ts += step) {
    pts.push({ ts, bac: calcBacAt(session, profile.weight, profile.gender, meals, ts) });
  }
  if (!pts.find(p => Math.abs(p.ts - now) < 60000)) pts.push({ ts: now, bac: currentBac });
  pts.sort((a, b) => a.ts - b.ts);

  const maxBac = Math.max(...pts.map(p => p.bac), limit || 0.5, 0.2) * 1.15;
  const xS = ts => PL + (ts - firstTs) / (endTs - firstTs) * (W - PL - PR);
  const yS = b => PT + (1 - b / maxBac) * (H - PT - PB);

  const past = pts.filter(p => p.ts <= now);
  const future = pts.filter(p => p.ts >= now);
  const toPath = arr => arr.map((p, i) => `${i === 0 ? 'M' : 'L'}${xS(p.ts).toFixed(1)},${yS(p.bac).toFixed(1)}`).join(' ');

  const nowX = xS(Math.min(Math.max(now, firstTs), endTs));
  const limitY = limit > 0 ? yS(limit) : null;

  const hourLabels = [];
  const h1 = 3600000;
  let lts = Math.ceil(firstTs / h1) * h1;
  while (lts <= endTs) { hourLabels.push(lts); lts += h1; }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block', overflow: 'visible' }}>
      {[0.5, 1.0, 1.5].filter(v => v <= maxBac).map(v => (
        <line key={v} x1={PL} x2={W - PR} y1={yS(v)} y2={yS(v)} stroke="#ffffff08" strokeWidth="0.5" />
      ))}
      {limitY !== null && (
        <line x1={PL} x2={W - PR} y1={limitY} y2={limitY} stroke="#f87171" strokeWidth="1" strokeDasharray="4,3" opacity="0.6" />
      )}
      <line x1={nowX} x2={nowX} y1={PT} y2={H - PB} stroke="#ffffff20" strokeWidth="0.8" strokeDasharray="3,3" />
      {past.length > 1 && <path d={toPath(past)} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />}
      {future.length > 1 && <path d={toPath(future)} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="5,4" opacity="0.45" />}
      <circle cx={nowX} cy={yS(currentBac)} r="4" fill={color} />
      <circle cx={nowX} cy={yS(currentBac)} r="7" fill={color} opacity="0.2" />
      {[0, 0.5, 1.0, 1.5].filter(v => v <= maxBac).map(v => (
        <text key={v} x={PL - 4} y={yS(v) + 3.5} textAnchor="end" style={{ fontSize: 8, fill: '#555', fontFamily: 'monospace' }}>{v.toFixed(1)}</text>
      ))}
      {hourLabels.map(ts => (
        <text key={ts} x={xS(ts)} y={H - 5} textAnchor="middle" style={{ fontSize: 8, fill: '#555', fontFamily: 'sans-serif' }}>{fmtTime(ts)}</text>
      ))}
    </svg>
  );
}

// ═══ DISCLAIMER ═══
function DisclaimerScreen({ onAccept }) {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0b10', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', maxWidth: 440, margin: '0 auto' }}>
      <div style={{ fontSize: 52, marginBottom: 20 }}>⚠️</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: '#e8eaf0', marginBottom: 12, textAlign: 'center' }}>Wichtiger Hinweis</div>
      <div style={{ background: '#12141e', border: '1px solid #1e2132', borderRadius: 20, padding: '24px', marginBottom: 24 }}>
        {[
          ['🔬', 'Kein Medizinprodukt', 'Die berechneten Promillewerte sind Schätzungen basierend auf Durchschnittswerten. Individuelle Faktoren wie Medikamente, Gesundheit oder Stoffwechsel sind nicht berücksichtigt.'],
          ['🚗', 'Nie fahren wenn unsicher', 'Verlasse dich NIEMALS auf diese App um zu entscheiden ob du Auto fahren kannst. Im Zweifel: gar nicht fahren.'],
          ['🍺', 'Verantwortungsvoll trinken', 'Diese App hilft dir deinen Konsum im Blick zu behalten – sie ersetzt kein verantwortungsbewusstes Verhalten.'],
        ].map(([icon, title, text]) => (
          <div key={title} style={{ display: 'flex', gap: 14, marginBottom: 18 }}>
            <div style={{ fontSize: 22, flexShrink: 0 }}>{icon}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#e8eaf0', marginBottom: 4 }}>{title}</div>
              <div style={{ fontSize: 12, color: '#666', lineHeight: 1.6 }}>{text}</div>
            </div>
          </div>
        ))}
      </div>
      <div onClick={onAccept} style={{ width: '100%', background: '#2563eb', borderRadius: 14, padding: '15px', textAlign: 'center', fontWeight: 700, fontSize: 15, color: '#fff', cursor: 'pointer' }}>
        Ich habe verstanden →
      </div>
      <div style={{ fontSize: 11, color: '#333', marginTop: 14, textAlign: 'center', lineHeight: 1.6 }}>
        Mit der Nutzung dieser App stimmst du zu, dass du diese Hinweise gelesen und verstanden hast.
      </div>
    </div>
  );
}

// ═══ COMPONENTS ═══
function Modal({ title, onClose, children }) {
  const T = React.useContext(ThemeContext);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,.7)", display: "flex", alignItems: "flex-end" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: T.bg3, borderRadius: "22px 22px 0 0", padding: "22px 20px 16px", width: "100%", maxWidth: 440, margin: "0 auto", border: `1px solid ${T.border2}`, animation: "slideUp .25s ease", maxHeight: "92vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexShrink: 0 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: T.text }}>{title}</div>
          <div onClick={onClose} style={{ color: T.m1, fontSize: 28, cursor: "pointer", lineHeight: 1, padding: 4 }}>×</div>
        </div>
        <div style={{ flex: 1, minHeight: 0, overflowY: "auto", WebkitOverflowScrolling: "touch", paddingBottom: 24 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function Inp({ label, value, onChange, type = "text", placeholder = "", onKeyDown, autoFocus }) {
  const T = React.useContext(ThemeContext);
  const s = { width: "100%", background: T.bg4, border: `1px solid ${T.borderIn}`, borderRadius: 10, padding: "10px 13px", color: T.textBr, fontSize: 13, outline: "none", fontFamily: "inherit" };
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 10, color: T.m1, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 6 }}>{label}</div>
      <input type={type} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} onKeyDown={onKeyDown} autoFocus={autoFocus} style={s} />
    </div>
  );
}

function TimePicker({ value, onChange }) {
  const T = React.useContext(ThemeContext);
  const now = Date.now();
  const opts = [
    { label: "Jetzt", ts: now },
    { label: "-15min", ts: now - 15 * 60000 },
    { label: "-30min", ts: now - 30 * 60000 },
    { label: "-45min", ts: now - 45 * 60000 },
    { label: "-1h", ts: now - 60 * 60000 },
    { label: "-2h", ts: now - 120 * 60000 },
  ];
  const [custom, setCustom] = useState(false);
  const [customVal, setCustomVal] = useState(fmtTime(value));
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 10, color: T.m1, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8 }}>Uhrzeit</div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {opts.map(o => (
          <div key={o.label} className="tap" onClick={() => { onChange(o.ts); setCustom(false); }}
            style={{
              padding: "5px 11px", borderRadius: 20, fontSize: 11, fontWeight: 500, cursor: "pointer",
              background: !custom && Math.abs(o.ts - value) < 65000 ? "#2563eb" : T.bg4,
              border: `1px solid ${!custom && Math.abs(o.ts - value) < 65000 ? "#2563eb" : T.borderIn}`,
              color: !custom && Math.abs(o.ts - value) < 65000 ? "#fff" : T.m1
            }}>
            {o.label}
          </div>
        ))}
        <div className="tap" onClick={() => setCustom(true)}
          style={{
            padding: "5px 11px", borderRadius: 20, fontSize: 11, fontWeight: 500, cursor: "pointer",
            background: custom ? "#7c3aed" : T.bg4, border: `1px solid ${custom ? "#7c3aed" : T.borderIn}`,
            color: custom ? "#fff" : T.m1
          }}>
          Andere…
        </div>
      </div>
      {custom && (
        <input type="time" value={customVal}
          onChange={e => { setCustomVal(e.target.value); onChange(tsFromTime(e.target.value)); }}
          style={{ marginTop: 10, background: T.bg4, border: `1px solid ${T.borderIn}`, borderRadius: 10, padding: "9px 13px", color: T.textBr, fontSize: 13, outline: "none", width: "100%", fontFamily: "inherit" }} />
      )}
    </div>
  );
}

// PLACEHOLDER — App component follows below

// ═══ MAIN APP ═══
function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showAuthScreen, setShowAuthScreen] = useState(false);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(() => !!localStorage.getItem('pt_disclaimer'));

  const [screen, setScreen] = useState("home");
  const [profile, setProfile] = useState({ name: "Gast", display_name: "Gast", weight: 75, gender: "m", country: "ch", novice: false });
  const [session, setSession] = useState([]);
  const [drinks, setDrinks] = useState(DEFAULT_DRINKS);
  const [cat, setCat] = useState("Alle");
  const [search, setSearch] = useState("");
  const [bac, setBac] = useState(0);
  const [toast, setToast] = useState(null);
  const [editDrink, setEditDrink] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newDrink, setNewDrink] = useState({ name: "", cat: "🍺 Bier", abv: "5", vol: "0.33", kcal: "150", icon: "🍺" });
  const [flashIds, setFlashIds] = useState({});
  const [editProfile, setEditProfile] = useState(false);
  const [tmpProf, setTmpProf] = useState(profile);
  const [meals, setMeals] = useState([]);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [newMeal, setNewMeal] = useState({ type: "🍽️ Mittagessen", desc: "", ts: Date.now() });
  const [pendingDrink, setPendingDrink] = useState(null);
  const [pendingTs, setPendingTs] = useState(Date.now());

  // Gruppen-Session / Leaderboard
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [roomCreationStep, setRoomCreationStep] = useState(1); // 1: Room name, 2: Display name
  const [roomNameInput, setRoomNameInput] = useState("");
  const [joinCodeInput, setJoinCodeInput] = useState("");
  const [activeRoom, setActiveRoom] = useState(null); // { roomCode, roomName, isHost }
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardTab, setLeaderboardTab] = useState("bac"); // "bac" or "grams"
  const [sessionSyncLoading, setSessionSyncLoading] = useState(false);
  const [sessionSyncError, setSessionSyncError] = useState(null);
  const [sessionSub, setSessionSub] = useState(null);
  const [tempDisplayName, setTempDisplayName] = useState("");
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [resetSignal, setResetSignal] = useState(0);
  const [kickSignal, setKickSignal] = useState(0);
  const [wasKicked, setWasKicked] = useState(false);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('pt_theme') !== 'light');
  const T = isDark ? DARK_T : LIGHT_T;

  useEffect(() => {
    document.body.classList.toggle('light-mode', !isDark);
    localStorage.setItem('pt_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Auth Check
  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    if (!window.supabaseClient) {
      console.warn('⚠️ Supabase nicht initialisiert');
      setAuthLoading(false);
      return;
    }
    try {
      const session = await getSession();
      if (session?.user) {
        setUser(session.user);
        await loadUserData(session.user);
      }
    } catch (err) {
      console.error('Auth-Fehler:', err);
    }
    setAuthLoading(false);
  }

  async function loadUserData(user) {
    const { data: profileData } = await loadProfileFromCloud();
    if (profileData) {
      setProfile({
        name: profileData.name || user.user_metadata?.name || 'Benutzer',
        display_name: profileData.display_name || profileData.name || user.user_metadata?.name || 'Benutzer',
        weight: profileData.weight || 75,
        gender: profileData.gender || 'm',
        country: profileData.country || 'ch',
        novice: profileData.novice || false
      });
    }
  }

  async function handleLogin(userData) {
    setShowAuthScreen(false);
    if (userData) {
      setUser(userData);
      localStorage.removeItem('pt_guest_mode');
      await loadUserData(userData);
      toast_("Willkommen zurück! ☁️");
    } else {
      localStorage.setItem('pt_guest_mode', 'true');
      toast_("Gast-Modus – Daten nur lokal");
    }
  }

  async function handleLogout() {
    await signOut();
    setUser(null);
    setProfile({ name: "Gast", display_name: "Gast", weight: 75, gender: "m", country: "ch", novice: false });
    setSession([]);
    setMeals([]);
    setActiveRoom(null);
    setLeaderboard([]);
    setScreen("home");
    if (sessionSub && typeof sessionSub.unsubscribe === "function") {
      sessionSub.unsubscribe();
    }
    window.location.reload();
  }

  // LocalStorage + Auto-Sync
  useEffect(() => {
    const savedProfile = localStorage.getItem('pt_profile');
    const savedDrinks = localStorage.getItem('pt_drinks');
    const savedSession = localStorage.getItem('pt_session');
    const savedMeals = localStorage.getItem('pt_meals');

    if (savedProfile && !user) setProfile(JSON.parse(savedProfile));
    if (savedDrinks) setDrinks(JSON.parse(savedDrinks));
    if (savedSession) setSession(JSON.parse(savedSession));
    if (savedMeals) setMeals(JSON.parse(savedMeals));
  }, []);

  useEffect(() => {
    localStorage.setItem('pt_profile', JSON.stringify(profile));
    if (user) saveProfileToCloud(profile);
  }, [profile, user]);

  useEffect(() => {
    localStorage.setItem('pt_drinks', JSON.stringify(drinks));
  }, [drinks]);

  useEffect(() => {
    localStorage.setItem('pt_session', JSON.stringify(session));
  }, [session]);

  useEffect(() => {
    localStorage.setItem('pt_meals', JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    const nb = calcBac(session, profile.weight, profile.gender, meals);
    setBac(nb);
    const id = setInterval(() => setBac(calcBac(session, profile.weight, profile.gender, meals)), 10000);
    return () => clearInterval(id);
  }, [session, profile.weight, profile.gender, meals]);

  // Sync to active session
  useEffect(() => {
    async function sync() {
      if (activeRoom?.roomCode) {
        const totalGrams = session.reduce((a, e) => a + (e.vol * 1000 * (e.abv / 100) * 0.8), 0);
        const { error } = await updateSessionData(activeRoom.roomCode, session, meals, bac, totalGrams, session.length, profile.display_name);
        if (error) {
          console.error('❌ Sync-Fehler Detail:', error);
          toast_("⚠️ " + (error.message || error.code || 'Sync-Fehler'));
        }
      }
    }
    sync();
  }, [bac, session.length, meals.length, profile.display_name, activeRoom?.roomCode]);

  // Heartbeat: hält die eigene Zeile in Supabase am Leben (verhindert Auto-Kick durch DB-Cleanup)
  useEffect(() => {
    if (!activeRoom?.roomCode) return;
    const id = setInterval(async () => {
      const totalGrams = session.reduce((a, e) => a + (e.vol * 1000 * (e.abv / 100) * 0.8), 0);
      await updateSessionData(activeRoom.roomCode, session, meals, bac, totalGrams, session.length, profile.display_name);
    }, 4 * 60 * 1000); // alle 4 Minuten
    return () => clearInterval(id);
  }, [activeRoom?.roomCode, session, meals, bac, profile.display_name]);

  useEffect(() => {
    return () => {
      if (sessionSub && typeof sessionSub.unsubscribe === "function") {
        sessionSub.unsubscribe();
      }
    };
  }, [sessionSub]);

  async function refreshLeaderboard(roomCode) {
    if (!roomCode) return;
    const { data } = await getSessionLeaderboard(roomCode);
    if (data) {
      setLeaderboard(data);
    }
  }

  function setupRealtime(roomCode, mySyncId, isHost) {
    if (!roomCode || !window.supabaseClient) return;
    if (sessionSub && typeof sessionSub.unsubscribe === "function") {
      sessionSub.unsubscribe();
    }
    const ch = subscribeToSession(roomCode, (payload) => {
      // Kick-Erkennung: eigene Zeile wurde vom Host gelöscht (nie für den Host selbst)
      if (payload.eventType === 'DELETE' && payload.old?.sync_id === mySyncId && !isHost) {
        setKickSignal(s => s + 1);
        return;
      }
      if (payload.new) {
        // Reset-Signal vom Host erkennen
        if (payload.new.drink_count === -1 && payload.new.is_host) {
          setResetSignal(s => s + 1);
          return;
        }
        setFlashIds(prev => ({ ...prev, [payload.new.sync_id]: true }));
        setTimeout(() => setFlashIds(prev => {
          const next = { ...prev };
          delete next[payload.new.sync_id];
          return next;
        }), 1000);
      }
      refreshLeaderboard(roomCode);
    });
    setSessionSub(ch);
  }

  function toast_(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  }

  // Reset-Signal empfangen (von Host ausgelöst)
  useEffect(() => {
    if (resetSignal === 0) return;
    setSession([]);
    setMeals([]);
    setBac(0);
    localStorage.setItem('pt_session', '[]');
    localStorage.setItem('pt_meals', '[]');
    toast_("🔄 Session zurückgestellt");
  }, [resetSignal]);

  // Kick-Signal empfangen (Host hat uns rausgeworfen)
  useEffect(() => {
    if (kickSignal === 0) return;
    if (sessionSub && typeof sessionSub.unsubscribe === "function") {
      sessionSub.unsubscribe();
      setSessionSub(null);
    }
    setActiveRoom(null);
    setLeaderboard([]);
    setWasKicked(true);
    setScreen("group");
  }, [kickSignal]);

  async function handleHostReset() {
    if (!activeRoom?.roomCode || !activeRoom?.isHost) return;
    const syncId = user ? user.id : getSyncId();
    // Reset-Signal senden: drink_count = -1 signalisiert allen Clients den Reset
    await window.supabaseClient
      .from('drinking_sessions')
      .update({ drink_count: -1, updated_at: new Date().toISOString() })
      .eq('room_code', activeRoom.roomCode)
      .eq('sync_id', syncId);
    // Eigene Daten lokal zurücksetzen
    setSession([]);
    setMeals([]);
    setBac(0);
    localStorage.setItem('pt_session', '[]');
    localStorage.setItem('pt_meals', '[]');
    // Eigene DB-Zeile auf 0 zurücksetzen
    setTimeout(() => {
      updateSessionData(activeRoom.roomCode, [], [], 0, 0, 0, profile.display_name);
      refreshLeaderboard(activeRoom.roomCode);
    }, 800);
    toast_("🔄 Alle Stats zurückgestellt");
  }

  async function handleKickParticipant(row) {
    if (!activeRoom?.roomCode || !activeRoom?.isHost) return;
    await window.supabaseClient
      .from('drinking_sessions')
      .delete()
      .eq('room_code', activeRoom.roomCode)
      .eq('sync_id', row.sync_id);
    setSelectedParticipant(null);
    refreshLeaderboard(activeRoom.roomCode);
    toast_(`🚪 ${row.display_name || "Gast"} wurde rausgeworfen`);
  }

  async function handleHostSession() {
    if (!roomNameInput.trim()) {
      setSessionSyncError("Bitte einen Raumnamen eingeben.");
      return;
    }
    // Step 1 done, move to Step 2
    if (roomCreationStep === 1) {
      setTempDisplayName(profile.display_name !== "Gast" ? profile.display_name : "");
      setRoomCreationStep(2);
      return;
    }

    // Step 2: Finalize
    if (!tempDisplayName.trim()) {
      setSessionSyncError("Bitte einen Anzeigenamen für das Leaderboard wählen.");
      return;
    }

    setSessionSyncLoading(true);
    setSessionSyncError(null);
    const totalG = getCurrentGrams(session);
    const { data, error } = await createSession(roomNameInput.trim(), tempDisplayName.trim(), session, meals, bac, totalG);
    setSessionSyncLoading(false);
    if (error || !data) {
      setSessionSyncError(error?.message || "Fehler beim Erstellen der Session.");
      return;
    }

    // Update profile display name if it was "Gast" or changed
    setProfile(p => ({ ...p, display_name: tempDisplayName.trim() }));

    const info = { roomCode: data.room_code, roomName: data.room_name, isHost: data.is_host };
    setActiveRoom(info);
    
    // Cleanup modal
    setRoomNameInput("");
    setRoomCreationStep(1);
    setScreen("home");

    await refreshLeaderboard(info.roomCode);
    const mySyncIdH = user ? user.id : getSyncId();
    setupRealtime(info.roomCode, mySyncIdH, true);
    toast_(`Raum „${info.roomName}” erstellt · Code ${info.roomCode}`);
  }

  async function handleJoinSession(overrideName = null) {
    // Immer nach Namen fragen wenn kein Override übergeben
    if (!overrideName) {
      const code = joinCodeInput.trim();
      if (code.length !== 4) {
        setSessionSyncError("Bitte einen 4-stelligen Code eingeben.");
        return;
      }
      // Vorausgefüllt mit letztem Namen (ausser "Gast")
      setTempDisplayName(profile.display_name !== "Gast" ? profile.display_name : "");
      setScreen("home");
      setShowNamePrompt(true);
      return;
    }

    const finalName = overrideName;
    const code = joinCodeInput.trim();
    if (code.length !== 4) {
      setSessionSyncError("Bitte einen 4-stelligen Code eingeben.");
      return;
    }

    setSessionSyncLoading(true);
    setSessionSyncError(null);
    const totalG = getCurrentGrams(session);

    // Call joinSession with explicit arguments
    const { data, error } = await joinSession(code, finalName, session, meals, bac, totalG);
    
    setSessionSyncLoading(false);

    if (error || !data) {
      setSessionSyncError(error?.message || "Session nicht gefunden.");
      return;
    }

    const info = { roomCode: data.room_code, roomName: data.room_name, isHost: data.is_host };
    setActiveRoom(info);

    await refreshLeaderboard(info.roomCode);
    const mySyncIdJ = user ? user.id : getSyncId();
    setupRealtime(info.roomCode, mySyncIdJ, false);
    toast_(`Session „${info.roomName}” beigetreten · Code ${info.roomCode}`);
  }

  async function handleLeaveSession() {
    if (sessionSub && typeof sessionSub.unsubscribe === "function") {
      sessionSub.unsubscribe();
      setSessionSub(null);
    }
    if (!activeRoom) {
      setActiveRoom(null);
      setLeaderboard([]);
      return;
    }
    if (user) {
      setSessionSyncLoading(true);
      await leaveSession(activeRoom.roomCode);
      setSessionSyncLoading(false);
    }
    setActiveRoom(null);
    setLeaderboard([]);
    toast_("Gruppen-Session verlassen");
  }

  function addDrinkToSession(d, ts) {
    const entry = { ...d, ts, sid: Math.random().toString(36).slice(2) };
    const next = [...session, entry].sort((a, b) => a.ts - b.ts);
    setSession(next);
    const nb = calcBac(next, profile.weight, profile.gender, meals);
    setBac(nb);
    setFlashIds(f => ({ ...f, [d.id]: true }));
    setTimeout(() => setFlashIds(f => { const c = { ...f }; delete c[d.id]; return c; }), 700);
    toast_(`${d.icon} ${d.name}  →  ${nb.toFixed(2)}‰`);

    if (activeRoom?.roomCode) {
      const totalGrams = next.reduce((a, e) => a + (e.vol * 1000 * (e.abv / 100) * 0.8), 0);
      updateSessionData(activeRoom.roomCode, next, meals, nb, totalGrams, next.length, profile.display_name).then(({ error }) => {
        if (error) toast_("⚠️ Sync-Fehler: Netz prüfen!");
        else refreshLeaderboard(activeRoom.roomCode);
      });
    }
  }

  function confirmAddDrink() {
    if (!pendingDrink) return;
    addDrinkToSession(pendingDrink, pendingTs);
    setPendingDrink(null);
  }

  function removeEntry(sid) {
    const next = session.filter(x => x.sid !== sid);
    setSession(next);
    const nb = calcBac(next, profile.weight, profile.gender, meals);
    setBac(nb);
    if (activeRoom?.roomCode) {
      const totalG = getCurrentGrams(next);
      updateSessionData(activeRoom.roomCode, next, meals, nb, totalG, next.length, profile.display_name).then(({ error }) => {
        if (error) toast_("⚠️ Sync-Fehler: Netz prüfen!");
        else refreshLeaderboard(activeRoom.roomCode);
      });
    }
  }

  function saveDrink() {
    setDrinks(ds => ds.map(d => d.id === editDrink.id ? { ...editDrink, abv: +editDrink.abv, vol: +editDrink.vol, kcal: +editDrink.kcal } : d));
    setEditDrink(null);
    toast_("Gespeichert ✓");
  }

  function deleteDrink(id) {
    setDrinks(ds => ds.filter(d => d.id !== id));
    setEditDrink(null);
    toast_("Gelöscht");
  }

  function addDrink() {
    if (!newDrink.name.trim()) return;
    const d = { ...newDrink, id: "c_" + Date.now(), abv: +newDrink.abv, vol: +newDrink.vol, kcal: +newDrink.kcal };
    setDrinks(ds => [...ds, d]);
    setShowAdd(false);
    setNewDrink({ name: "", cat: "🍺 Bier", abv: "5", vol: "0.33", kcal: "150", icon: "🍺" });
    toast_(`${d.icon} ${d.name} hinzugefügt`);
  }

  function confirmAddMeal() {
    if (!newMeal.desc.trim()) return;
    const m = { ...newMeal, id: "m_" + Date.now() };
    const next = [...meals, m];
    setMeals(next);
    setShowAddMeal(false);
    setNewMeal({ type: "🍽️ Mittagessen", desc: "", ts: Date.now() });
    const nb = calcBac(session, profile.weight, profile.gender, next);
    setBac(nb);
    if (activeRoom?.roomCode) {
      const totalG = getCurrentGrams(session);
      updateSessionData(activeRoom.roomCode, session, next, nb, totalG, session.length, profile.display_name)
        .then(() => refreshLeaderboard(activeRoom.roomCode));
    }
    toast_(`${m.type.split(" ")[0]} eingetragen`);
  }

  function removeMeal(id) {
    const next = meals.filter(m => m.id !== id);
    setMeals(next);
    const nb = calcBac(session, profile.weight, profile.gender, next);
    setBac(nb);
    if (activeRoom?.roomCode) {
      const totalG = getCurrentGrams(session);
      updateSessionData(activeRoom.roomCode, session, next, nb, totalG, session.length, profile.display_name)
        .then(() => refreshLeaderboard(activeRoom.roomCode));
    }
  }

  const filtered = React.useMemo(() => {
    let list = cat === "Alle" ? drinks : drinks.filter(d => d.cat === cat);
    if (search.trim()) { const q = search.toLowerCase(); list = list.filter(d => d.name.toLowerCase().includes(q) || d.cat.toLowerCase().includes(q)); }
    return list;
  }, [drinks, cat, search]);

  const country = COUNTRIES.find(c => c.id === profile.country) || COUNTRIES[0];
  const effectiveLimit = profile.novice ? 0.0 : country.limit;
  const canDrive = bac < effectiveLimit || (effectiveLimit === 0 && bac === 0);

  const soberMins = bac > 0 ? (bac / 0.15) * 60 : 0;
  const soberTime = new Date(Date.now() + soberMins * 60000);
  const color = bacColor(bac);
  const totalKcal = session.reduce((a, x) => a + (x.kcal || 0), 0);
  const recentMeals = meals.filter(m => (Date.now() - m.ts) < 3 * 3600000);

  const timeline = [
    ...session.map(e => ({ ...e, _type: "drink" })),
    ...meals.map(m => ({ ...m, _type: "meal" }))
  ].sort((a, b) => b.ts - a.ts);

  const aiTip = bac === 0 ? "Noch nüchtern – schönen Abend! 🎉"
    : bac < 0.3 ? "Alles grün. Bleib hydratisiert! 💧"
      : bac < 0.5 ? "Leicht angeheitert. Glas Wasser? 🚰"
        : bac < 0.8 ? "⚠️ Führerschein-Grenze bald – kein Fahren!"
          : bac < 1.2 ? "🔴 Limit überschritten – bitte aufhören."
            : "🆘 Sehr hoher Pegel! Wasser trinken & stopp.";

  const inp = { width: "100%", background: T.bg4, border: `1px solid ${T.borderIn}`, borderRadius: 10, padding: "10px 13px", color: T.textBr, fontSize: 13, outline: "none", fontFamily: "inherit" };
  const screenTitle = { home: "Dashboard", drinks: "Getränke", session: "Session", food: "Essen", profile: "Profil", group: "Gruppe" }[screen];

  // Loading Screen
  if (authLoading) {
    return (
      <ThemeContext.Provider value={T}>
        <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, animation: 'pulse 1.5s infinite' }}>🍺</div>
            <div style={{ fontSize: 14, color: T.m1, marginTop: 16 }}>Laden...</div>
          </div>
        </div>
      </ThemeContext.Provider>
    );
  }

  // Disclaimer (einmalig beim ersten Start)
  if (!disclaimerAccepted) {
    return <ThemeContext.Provider value={T}><DisclaimerScreen onAccept={() => { localStorage.setItem('pt_disclaimer', '1'); setDisclaimerAccepted(true); }} /></ThemeContext.Provider>;
  }

  // Auth Screen
  if (showAuthScreen || (!user && !localStorage.getItem('pt_guest_mode'))) {
    return <ThemeContext.Provider value={T}><AuthScreen onLogin={handleLogin} /></ThemeContext.Provider>;
  }

  // Main App
  return (
    <ThemeContext.Provider value={T}>
    <div style={{ height: "100vh", maxHeight: "100vh", background: T.bg, color: T.text, fontFamily: "'DM Sans','Segoe UI',sans-serif", display: "flex", flexDirection: "column", maxWidth: 440, margin: "0 auto", overflow: "hidden", position: "relative" }}>
      {toast && <div style={{ position: "fixed", bottom: activeRoom ? 154 : 86, left: "50%", transform: "translateX(-50%)", zIndex: 999, background: T.toast, border: "1px solid #2a2e48", borderRadius: 14, padding: "10px 20px", fontSize: 13, fontWeight: 500, animation: "toast .2s ease", boxShadow: "0 8px 32px #0008", whiteSpace: "nowrap", maxWidth: "88vw" }}>{toast}</div>}

      {/* Gruppen-Session Modal */}
      {/* Modal is now integrated in groupModalOpen flow */}
      {showNamePrompt && (
        <Modal title="Wie heisst du in der Session?" onClose={() => setShowNamePrompt(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>
              Code <span style={{ fontFamily: "'Space Mono',monospace", color: "#3b82f6", fontWeight: 700 }}>{joinCodeInput}</span> · Unter diesem Namen siehst du dich im Leaderboard.
            </div>
            <Inp
              label="Dein Name"
              value={tempDisplayName}
              onChange={setTempDisplayName}
              placeholder="z.B. Party-König"
              autoFocus
              onKeyDown={e => {
                if (e.key === 'Enter' && tempDisplayName.trim()) {
                  const name = tempDisplayName.trim();
                  setProfile(p => ({ ...p, display_name: name }));
                  setShowNamePrompt(false);
                  handleJoinSession(name);
                }
              }}
            />
            <div className="tap" onClick={() => {
              const name = tempDisplayName.trim();
              if (!name) return;
              setProfile(p => ({ ...p, display_name: name }));
              setShowNamePrompt(false);
              handleJoinSession(name);
            }} style={{ background: "#2563eb", borderRadius: 10, padding: "12px", textAlign: "center", fontWeight: 700, fontSize: 14 }}>
              Beitreten →
            </div>
          </div>
        </Modal>
      )}


      {selectedParticipant && (
        <Modal title={selectedParticipant.display_name || "Gast"} onClose={() => setSelectedParticipant(null)}>
          {(selectedParticipant.current_bac || 0) >= 1.5 && (
            <div style={{ background: T.bgWarn, border: "1px solid #f8717166", borderRadius: 12, padding: "10px 14px", marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ fontSize: 22 }}>⚠️</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#f87171" }}>Aufpassen!</div>
                <div style={{ fontSize: 11, color: "#8a4040", marginTop: 2 }}>Diese Person hat sehr hohen Promillewert. Bitte im Auge behalten.</div>
              </div>
            </div>
          )}
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1, background: T.bg2, borderRadius: 10, padding: "10px 12px", textAlign: "center" }}>
              <div style={{ fontSize: 9, color: T.m1, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 4 }}>Promille</div>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 20, fontWeight: 700, color: bacColor(selectedParticipant.current_bac || 0) }}>
                {(selectedParticipant.current_bac || 0).toFixed(2)}‰
              </div>
            </div>
            <div style={{ flex: 1, background: T.bg2, borderRadius: 10, padding: "10px 12px", textAlign: "center" }}>
              <div style={{ fontSize: 9, color: T.m1, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 4 }}>Alkohol</div>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 20, fontWeight: 700, color: "#3b82f6" }}>
                {Math.round(selectedParticipant.total_alcohol_grams || 0)}g
              </div>
            </div>
            <div style={{ flex: 1, background: T.bg2, borderRadius: 10, padding: "10px 12px", textAlign: "center" }}>
              <div style={{ fontSize: 9, color: T.m1, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 4 }}>Getränke</div>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 20, fontWeight: 700, color: T.textBr }}>
                {(selectedParticipant.drinks || []).length}
              </div>
            </div>
          </div>
          <div style={{ fontSize: 10, color: T.m1, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8 }}>Getränke-Liste</div>
          {(selectedParticipant.drinks || []).length === 0 ? (
            <div style={{ fontSize: 12, color: T.m2, textAlign: "center", padding: "16px 0" }}>Noch keine Getränke eingetragen</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[...(selectedParticipant.drinks || [])].sort((a, b) => a.ts - b.ts).map((d, i) => (
                <div key={i} style={{ background: T.bg2, borderRadius: 10, padding: "9px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 18 }}>{d.icon || "🍺"}</span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{d.name}</div>
                      <div style={{ fontSize: 10, color: T.m1 }}>{(d.vol * 1000).toFixed(0)}ml · {d.abv}%</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: bacColor(hitBac(d, 75, "m")) }}>+{hitBac(d, 75, "m").toFixed(2)}‰</div>
                    <div style={{ fontSize: 10, color: T.m2 }}>{fmtTime(d.ts)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {(() => {
            const isMe = (user && selectedParticipant.user_id === user.id) || selectedParticipant.sync_id === localStorage.getItem('pt_sync_id');
            if (activeRoom?.isHost && !isMe && !selectedParticipant.is_host) {
              return (
                <div className="tap" onClick={() => handleKickParticipant(selectedParticipant)}
                  style={{ background: T.bgDanger, border: "1px solid #f8717133", borderRadius: 10, padding: "10px", textAlign: "center", fontSize: 13, color: "#f87171", fontWeight: 600, marginTop: 14 }}>
                  🚪 Aus Session entfernen
                </div>
              );
            }
            return null;
          })()}
        </Modal>
      )}

      {pendingDrink && (
        <Modal title={`${pendingDrink.icon} ${pendingDrink.name}`} onClose={() => setPendingDrink(null)}>
          <TimePicker value={pendingTs} onChange={setPendingTs} />

          <div style={{ marginBottom: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: T.m1, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8 }}>
              <span>Menge</span>
              <span style={{ color: T.textBr, fontFamily: "'Space Mono',monospace" }}>{(pendingDrink.vol * 1000).toFixed(0)} ml</span>
            </div>
            <input type="range" min="0.01" max="1.0" step="0.01" value={pendingDrink.vol}
              onChange={e => setPendingDrink(d => ({ ...d, vol: +e.target.value }))}
              style={{ width: "100%", accentColor: "#2563eb", cursor: "pointer" }} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 9, color: T.m3 }}>
              <span>0.01L</span><span>0.5L</span><span>1.0L</span>
            </div>
          </div>

          <div style={{ marginBottom: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: T.m1, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8 }}>
              <span>Alkoholgehalt</span>
              <span style={{ color: T.textBr, fontFamily: "'Space Mono',monospace" }}>{pendingDrink.abv.toFixed(1)}%</span>
            </div>
            <input type="range" min="0" max="80" step="0.5" value={pendingDrink.abv}
              onChange={e => setPendingDrink(d => ({ ...d, abv: +e.target.value }))}
              style={{ width: "100%", accentColor: "#2563eb", cursor: "pointer" }} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 9, color: T.m3 }}>
              <span>0%</span><span>40%</span><span>80%</span>
            </div>
          </div>

          <div style={{ background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 12, padding: "12px 14px", marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontSize: 12, color: T.m1 }}>Wirkung ca.</div>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 13, fontWeight: 700, color: bacColor(hitBac(pendingDrink, profile.weight, profile.gender)) }}>+{hitBac(pendingDrink, profile.weight, profile.gender).toFixed(2)}‰</div>
          </div>
          <div className="tap" onClick={confirmAddDrink} style={{ background: "#2563eb", borderRadius: 11, padding: "13px", textAlign: "center", fontWeight: 700, fontSize: 14 }}>Eintragen ✓</div>
        </Modal>
      )}

      {editDrink && (
        <Modal title="Getränk bearbeiten" onClose={() => setEditDrink(null)}>
          <Inp label="Name" value={editDrink.name} onChange={v => setEditDrink(d => ({ ...d, name: v }))} />
          <Inp label="Alkohol (%)" type="number" value={editDrink.abv} onChange={v => setEditDrink(d => ({ ...d, abv: v }))} />
          <Inp label="Menge (Liter)" type="number" value={editDrink.vol} onChange={v => setEditDrink(d => ({ ...d, vol: v }))} />
          <Inp label="Kalorien" type="number" value={editDrink.kcal} onChange={v => setEditDrink(d => ({ ...d, kcal: v }))} />
          <Inp label="Icon" value={editDrink.icon} onChange={v => setEditDrink(d => ({ ...d, icon: v }))} />
          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            <div className="tap" onClick={() => deleteDrink(editDrink.id)} style={{ flex: 1, background: "#1e0f0f", border: "1px solid #f8717130", borderRadius: 11, padding: "11px", textAlign: "center", color: "#f87171", fontSize: 13, fontWeight: 600 }}>🗑 Löschen</div>
            <div className="tap" onClick={saveDrink} style={{ flex: 2, background: "#2563eb", borderRadius: 11, padding: "11px", textAlign: "center", fontWeight: 700, fontSize: 14 }}>Speichern ✓</div>
          </div>
        </Modal>
      )}

      {showAdd && (
        <Modal title="Neues Getränk" onClose={() => setShowAdd(false)}>
          <Inp label="Name" value={newDrink.name} onChange={v => setNewDrink(d => ({ ...d, name: v }))} placeholder="z.B. Aperol Spritz" />
          <Inp label="Alkohol (%)" type="number" value={newDrink.abv} onChange={v => setNewDrink(d => ({ ...d, abv: v }))} />
          <Inp label="Menge (Liter)" type="number" value={newDrink.vol} onChange={v => setNewDrink(d => ({ ...d, vol: v }))} />
          <Inp label="Kalorien" type="number" value={newDrink.kcal} onChange={v => setNewDrink(d => ({ ...d, kcal: v }))} />
          <Inp label="Icon" value={newDrink.icon} onChange={v => setNewDrink(d => ({ ...d, icon: v }))} />
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: T.m1, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 6 }}>Kategorie</div>
            <select value={newDrink.cat} onChange={e => setNewDrink(d => ({ ...d, cat: e.target.value }))} style={inp}>
              {ALL_CATS.filter(c => c !== "Alle").map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="tap" onClick={addDrink} style={{ background: "#2563eb", borderRadius: 11, padding: "12px", textAlign: "center", fontWeight: 700, fontSize: 14 }}>Hinzufügen ＋</div>
        </Modal>
      )}

      {showAddMeal && (
        <Modal title="Mahlzeit eintragen" onClose={() => setShowAddMeal(false)}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: T.m1, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8 }}>Mahlzeit</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {MEAL_TYPES.map(t => (
                <div key={t} className="tap" onClick={() => setNewMeal(m => ({ ...m, type: t }))}
                  style={{
                    padding: "10px 8px", borderRadius: 12, textAlign: "center", fontSize: 13,
                    background: newMeal.type === t ? "#16a34a" : T.bg2,
                    border: `1px solid ${newMeal.type === t ? "#16a34a" : "#1d2030"}`,
                    color: newMeal.type === t ? "#fff" : "#666"
                  }}>{t}</div>
              ))}
            </div>
          </div>
          <TimePicker value={newMeal.ts} onChange={ts => setNewMeal(m => ({ ...m, ts }))} />
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: T.m1, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 6 }}>Was hast du gegessen?</div>
            <textarea value={newMeal.desc} onChange={e => setNewMeal(m => ({ ...m, desc: e.target.value }))}
              placeholder="z.B. Pizza, Burger, Salat…" rows={3}
              style={{ width: "100%", background: T.bg4, border: `1px solid ${T.borderIn}`, borderRadius: 10, padding: "10px 13px", color: T.textBr, fontSize: 13, outline: "none", fontFamily: "inherit", resize: "none", lineHeight: 1.5 }} />
          </div>
          <div className="tap" onClick={confirmAddMeal} style={{ background: "#16a34a", borderRadius: 11, padding: "12px", textAlign: "center", fontWeight: 700, fontSize: 14 }}>Eintragen ✓</div>
        </Modal>
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px 12px", borderBottom: `1px solid ${T.borderNav}`, background: T.bg, position: "sticky", top: 0, zIndex: 100 }}>
        <div>
          <div style={{ fontSize: 9, letterSpacing: 3, color: T.m3, textTransform: "uppercase", fontFamily: "'Space Mono',monospace" }}>PromilleTracker</div>
          <div style={{ fontSize: 17, fontWeight: 700, marginTop: 1 }}>{screenTitle}</div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {!user && (
            <div className="tap" onClick={() => { localStorage.removeItem('pt_guest_mode'); setShowAuthScreen(true); }}
              style={{ background: "#2563eb", padding: "5px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 4 }}>
              ☁️ <span style={{ fontSize: 10 }}>Anmelden</span>
            </div>
          )}
          {session.length > 0 && (
            <div key={bac.toFixed(2)} style={{ background: color + "18", border: `1px solid ${color}40`, borderRadius: 20, padding: "4px 13px", fontFamily: "'Space Mono',monospace", fontSize: 15, fontWeight: 700, color, animation: "pop .3s ease" }}>
              {bac.toFixed(2)}‰
            </div>
          )}
          <div className="tap" onClick={() => setIsDark(d => !d)}
            style={{ background: T.bg2, border: `1px solid ${T.border2}`, borderRadius: 20, padding: "5px 10px", fontSize: 15, cursor: "pointer", lineHeight: 1 }}>
            {isDark ? "☀️" : "🌙"}
          </div>
          <UserMenu user={user} onLogout={handleLogout} onShowSession={() => setScreen("group")} onShowLogin={() => { localStorage.removeItem('pt_guest_mode'); setShowAuthScreen(true); }} activeRoom={activeRoom} />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch", paddingBottom: activeRoom ? 166 : 98 }}>
        {screen === "home" && (
          <div style={{ padding: "16px 16px 0", animation: "fadeUp .25s ease" }}>
            <div style={{ background: T.bgGrad, border: `1px solid ${color}28`, borderRadius: 22, padding: "22px 22px 18px", marginBottom: 14, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -24, right: -24, width: 110, height: 110, borderRadius: "50%", background: color + "09", pointerEvents: "none" }} />
              <div key={bac.toFixed(3)} style={{ fontSize: 68, fontWeight: 700, fontFamily: "'Space Mono',monospace", color, lineHeight: 1, animation: "pop .3s ease" }}>
                {bac.toFixed(2)}<span style={{ fontSize: 24, color: color + "77" }}>‰</span>
              </div>
              {session.length > 0 && <>
                <div style={{ marginTop: 14, height: 5, borderRadius: 3, background: T.bgBar }}>
                  <div style={{ height: "100%", width: `${Math.min(bac / 2.5 * 100, 100)}%`, background: color, borderRadius: 3, transition: "width .6s ease" }} />
                </div>
                {bac > 0 ? (
                  <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: 12, color: T.m2 }}>
                      ⏰ Nüchtern um <span style={{ color: T.textBr, fontWeight: 600 }}>{fmtTime(soberTime.getTime())} Uhr</span>
                    </div>
                    <div style={{ background: color + "22", border: `1px solid ${color}44`, borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 700, color, fontFamily: "'Space Mono',monospace" }}>
                      {fmtCountdown(soberTime.getTime() - Date.now())}
                    </div>
                  </div>
                ) : (
                  <div style={{ marginTop: 10, fontSize: 13, color: "#4ade80" }}>✅ Nüchtern</div>
                )}
                <div style={{ marginTop: 14 }}>
                  <BacChart session={session} profile={profile} meals={meals} limit={effectiveLimit} color={color} />
                </div>
              </>}
              {session.length === 0 && <div style={{ marginTop: 10, fontSize: 13, color: T.m5 }}>Noch keine Getränke – starte die Session!</div>}
            </div>

            <div style={{ background: canDrive ? T.bgOk : T.bgWarn, border: `1px solid ${canDrive ? "#16a34a33" : "#f8717133"}`, borderRadius: 16, padding: "13px 16px", marginBottom: 14, display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ fontSize: 24 }}>{canDrive ? "✅" : "🚫"}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: canDrive ? "#4ade80" : "#f87171" }}>
                  {canDrive ? "Fahrbereit" : "Nicht fahren!"}
                </div>
                <div style={{ fontSize: 11, color: canDrive ? "#2d6040" : "#8a4040", marginTop: 2 }}>
                  {country.flag} {country.name} · Limit: {effectiveLimit === 0 ? "0.0" : effectiveLimit}‰
                  {profile.novice ? " (Neulenker)" : ""}
                  {country.note ? ` · ${country.note}` : ""}
                </div>
              </div>
              {!canDrive && bac > 0 && (
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 10, color: T.m1 }}>Legal ab</div>
                  <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, fontWeight: 700, color: "#f87171" }}>
                    {fmtTime(Date.now() + ((bac - effectiveLimit) / 0.15) * 3600000)}
                  </div>
                </div>
              )}
            </div>

            <div style={{ background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 16, padding: "13px 15px", marginBottom: 14, display: "flex", gap: 12 }}>
              <div style={{ fontSize: 18 }}>🤖</div>
              <div>
                <div style={{ fontSize: 9, color: T.m3, textTransform: "uppercase", letterSpacing: 2, marginBottom: 3 }}>KI-Analyse</div>
                <div style={{ fontSize: 13, lineHeight: 1.6, color: T.text2 }}>{aiTip}</div>
              </div>
            </div>

            {session.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 9, marginBottom: 14 }}>
                {[{ icon: "🥤", val: session.length, label: "Getränke" }, { icon: "🔥", val: totalKcal + " kcal", label: "Kalorien" }, { icon: "🍽️", val: recentMeals.length > 0 ? `-${recentMeals.length >= 2 ? 35 : 20}% BAC` : "Nüchtern", label: "Essen-Effekt" }].map(s => (
                  <div key={s.label} style={{ background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 14, padding: "12px 10px", textAlign: "center" }}>
                    <div style={{ fontSize: 20 }}>{s.icon}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, marginTop: 4 }}>{s.val}</div>
                    <div style={{ fontSize: 9, color: T.m3, marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            {session.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 9, color: T.m3, textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>Nochmal?</div>
                <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
                  {[...new Map(session.map(x => [x.name, x])).values()].slice(-5).map(d => (
                    <div key={d.name} className="tap hov" onClick={() => addDrinkToSession(d, Date.now())}
                      style={{ flexShrink: 0, background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 13, padding: "10px 13px", textAlign: "center", minWidth: 76, position: "relative" }}>
                      <div className="tap" onClick={(e) => { e.stopPropagation(); setPendingDrink(d); setPendingTs(Date.now()); }}
                        style={{ position: "absolute", top: 5, right: 5, fontSize: 10, padding: 4, background: T.bg, borderRadius: "50%", border: `1px solid ${T.border2}` }}>✏️</div>
                      <div style={{ fontSize: 22 }}>{d.icon}</div>
                      <div style={{ fontSize: 10, color: T.m1, marginTop: 3, maxWidth: 68, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</div>
                      <div style={{ fontSize: 9, fontFamily: "'Space Mono',monospace", color: bacColor(hitBac(d, profile.weight, profile.gender)), marginTop: 3 }}>+{hitBac(d, profile.weight, profile.gender).toFixed(2)}‰</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {screen === "drinks" && (
          <div style={{ padding: "14px 14px 0", animation: "fadeUp .25s ease" }}>
            <div style={{ position: "relative", marginBottom: 10 }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: T.m2 }}>🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Getränk suchen…"
                style={{ ...inp, paddingLeft: 36, fontSize: 14 }} />
              {search && <span className="tap" onClick={() => setSearch("")} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: T.m2, fontSize: 18 }}>×</span>}
            </div>
            <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 10 }}>
              {ALL_CATS.map(c => (
                <div key={c} className="tap" onClick={() => setCat(c)} style={{ flexShrink: 0, padding: "5px 13px", borderRadius: 20, fontSize: 11, fontWeight: 500, background: cat === c ? "#2563eb" : T.bg2, border: `1px solid ${cat === c ? "#2563eb" : "#1d2030"}`, color: cat === c ? "#fff" : T.m1 }}>{c}</div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 2px 10px" }}>
              <div style={{ fontSize: 10, color: T.m3 }}>{filtered.length} Getränke</div>
              <div className="tap" onClick={() => setShowAdd(true)} style={{ fontSize: 11, color: "#3b82f6", fontWeight: 600 }}>＋ Neues Getränk</div>
            </div>
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px 0", color: T.m3 }}>
                <div style={{ fontSize: 34 }}>🔍</div>
                <div style={{ marginTop: 10, fontSize: 13 }}>Nichts für „{search}"</div>
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
              {filtered.map(d => {
                const hit = hitBac(d, profile.weight, profile.gender);
                return (
                  <div key={d.id} className="hov" style={{ background: flashIds[d.id] ? T.bgFlash : T.bg2, border: `1px solid ${flashIds[d.id] ? "#4ade8040" : T.border}`, borderRadius: 14, padding: 12, position: "relative", transition: "background .4s,border-color .4s" }}>
                    <div style={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 6 }}>
                      <div className="tap" onClick={(e) => { e.stopPropagation(); setPendingDrink(d); setPendingTs(Date.now()); }}
                        style={{ fontSize: 13, background: T.bg, borderRadius: "50%", width: 24, height: 24, display: "grid", placeItems: "center", border: `1px solid ${T.border2}` }}>✏️</div>
                    </div>
                    <div className="tap" onClick={() => addDrinkToSession(d, Date.now())}>
                      <div style={{ fontSize: 26, marginBottom: 7 }}>{d.icon}</div>
                      <div style={{ fontWeight: 600, fontSize: 12, paddingRight: 30, lineHeight: 1.3 }}>{d.name}</div>
                      <div style={{ fontSize: 10, color: T.m4, marginTop: 3 }}>{d.vol * 1000}ml · {d.abv}%</div>
                      <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontSize: 12, fontFamily: "'Space Mono',monospace", fontWeight: 700, color: bacColor(hit) }}>+{hit.toFixed(2)}‰</div>
                        <div style={{ fontSize: 9, color: T.m5 }}>{d.kcal} kcal</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ height: 16 }} />
          </div>
        )}

        {screen === "session" && (
          <div style={{ padding: "16px 16px 0", animation: "fadeUp .25s ease" }}>
            {timeline.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: T.m5 }}>
                <div style={{ fontSize: 44 }}>🥤</div>
                <div style={{ marginTop: 14, fontSize: 14 }}>Noch keine Einträge</div>
                <div className="tap" onClick={() => setScreen("drinks")} style={{ display: "inline-block", marginTop: 18, padding: "10px 24px", background: "#2563eb", borderRadius: 20, fontSize: 13, fontWeight: 600, color: "#fff" }}>Getränk hinzufügen</div>
              </div>
            ) : <>
              <div style={{ background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 16, padding: 16, marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                  <div style={{ fontSize: 9, color: T.m3, textTransform: "uppercase", letterSpacing: 2 }}>Live Promille</div>
                  <div key={bac.toFixed(3)} style={{ fontFamily: "'Space Mono',monospace", fontSize: 22, fontWeight: 700, color, animation: "pop .3s ease" }}>{bac.toFixed(2)}‰</div>
                </div>
                <div style={{ height: 5, borderRadius: 3, background: T.bgBar }}>
                  <div style={{ height: "100%", width: `${Math.min(bac / 2.5 * 100, 100)}%`, background: color, borderRadius: 3, transition: "width .5s" }} />
                </div>
                <div style={{ marginTop: 8, fontSize: 11, color: T.m2, display: "flex", justifyContent: "space-between" }}>
                  <span>Nüchtern ca. {fmtTime(soberTime.getTime())} Uhr</span>
                  <span style={{ color: canDrive ? "#4ade80" : "#f87171" }}>{canDrive ? "✅ Fahrbereit" : "🚫 Nicht fahren"}</span>
                </div>
              </div>

              <div className="tap" onClick={() => setShowAddMeal(true)}
                style={{ background: T.bgOk2, border: "1px solid #16a34a33", borderRadius: 12, padding: "10px 14px", marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ fontSize: 18 }}>🍽️</div>
                <div style={{ fontSize: 12, color: "#2d6040" }}>Mahlzeit zur Session hinzufügen</div>
                <div style={{ marginLeft: "auto", fontSize: 18, color: "#16a34a33" }}>＋</div>
              </div>

              {timeline.map((item, i) => {
                if (item._type === "meal") {
                  const ageH = (Date.now() - item.ts) / 3600000;
                  const active = ageH < 3;
                  return (
                    <div key={item.id} style={{ display: "flex", alignItems: "flex-start", gap: 12, background: T.bgOk2, border: `1px solid ${active ? "#16a34a33" : "#0f2018"}`, borderRadius: 13, padding: "11px 13px", marginBottom: 8, animation: `fadeUp .18s ease ${i * .02}s both`, opacity: active ? 1 : 0.5 }}>
                      <div style={{ fontSize: 22, marginTop: 1 }}>{item.type.split(" ")[0]}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <div style={{ fontWeight: 600, fontSize: 12, color: "#4ade80" }}>{item.type.split(" ").slice(1).join(" ")}</div>
                          {active && <div style={{ fontSize: 8, background: "#16a34a22", color: "#4ade80", borderRadius: 8, padding: "1px 6px", fontWeight: 600 }}>AKTIV</div>}
                        </div>
                        <div style={{ fontSize: 11, color: "#2d5030", marginTop: 2 }}>{item.desc}</div>
                        <div style={{ fontSize: 9, color: T.m3, marginTop: 3 }}>{fmtTime(item.ts)} Uhr{active ? ` · noch ${(3 - ageH).toFixed(1)}h aktiv` : ""}</div>
                      </div>
                      <div className="tap" onClick={() => removeMeal(item.id)} style={{ color: "#1a2e1a", fontSize: 15, padding: 4 }}>×</div>
                    </div>
                  );
                }
                return (
                  <div key={item.sid} style={{ display: "flex", alignItems: "center", gap: 12, background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 13, padding: "11px 13px", marginBottom: 8, animation: `fadeUp .18s ease ${i * .02}s both` }}>
                    <div style={{ fontSize: 22 }}>{item.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{item.name}</div>
                      <div style={{ fontSize: 10, color: T.m4, marginTop: 2 }}>{fmtTime(item.ts)} · {item.vol * 1000}ml · {item.abv}%</div>
                    </div>
                    <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, fontWeight: 700, color: bacColor(hitBac(item, profile.weight, profile.gender)) }}>+{hitBac(item, profile.weight, profile.gender).toFixed(2)}‰</div>
                    <div className="tap" onClick={() => removeEntry(item.sid)} style={{ color: T.m5, fontSize: 16, padding: 4 }}>×</div>
                  </div>
                );
              })}

               <div className="tap" onClick={() => { 
                setSession([]); setMeals([]); setBac(0); setScreen("home"); 
                if (activeRoom?.roomCode) { 
                  updateSessionData(activeRoom.roomCode, [], [], 0, 0, 0, profile.display_name); 
                  refreshLeaderboard(activeRoom.roomCode); 
                } 
                toast_("Session zurückgesetzt"); 
              }}
                style={{ background: T.bgDanger, border: "1px solid #f8717120", borderRadius: 12, padding: "12px", textAlign: "center", fontSize: 12, color: "#f87171", marginTop: 8 }}>
                🗑 Session & Mahlzeiten zurücksetzen
              </div>
              <div style={{ height: 16 }} />
            </>}
          </div>
        )}

        {screen === "food" && (
          <div style={{ padding: "16px 16px 0", animation: "fadeUp .25s ease" }}>
            <div style={{ background: T.bgFood, border: "1px solid #14532d44", borderRadius: 16, padding: "14px 16px", marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#4ade80", marginBottom: 6 }}>🍽️ Wie wirkt Essen auf den BAC?</div>
              <div style={{ fontSize: 12, color: "#2d6040", lineHeight: 1.7 }}>
                1 Mahlzeit in den letzten 3h → <span style={{ color: "#4ade80", fontWeight: 600 }}>−20% BAC</span><br />
                2+ Mahlzeiten → <span style={{ color: "#4ade80", fontWeight: 600 }}>−35% BAC</span><br />
                Fettreiches Essen verzögert Absorption am stärksten.
              </div>
            </div>
            <div style={{ background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 11, color: T.m2, textTransform: "uppercase", letterSpacing: 1 }}>Aktueller Effekt</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: recentMeals.length > 0 ? "#4ade80" : T.m1, marginTop: 4 }}>
                  {recentMeals.length === 0 ? "Kein Effekt" : recentMeals.length === 1 ? "−20% BAC" : "−35% BAC"}
                </div>
              </div>
              <div style={{ fontSize: 11, color: T.m3 }}>{recentMeals.length} aktive Mahlzeit{recentMeals.length !== 1 ? "en" : ""}</div>
            </div>
            <div className="tap" onClick={() => setShowAddMeal(true)}
              style={{ background: T.bgFood, border: "1px solid #16a34a55", borderRadius: 14, padding: "14px 16px", marginBottom: 14, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 26 }}>＋</div>
              <div><div style={{ fontWeight: 600, fontSize: 14, color: "#4ade80" }}>Mahlzeit hinzufügen</div>
                <div style={{ fontSize: 11, color: "#2d5030", marginTop: 2 }}>Mit Zeitauswahl</div></div>
            </div>
            {meals.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: T.m5 }}>
                <div style={{ fontSize: 44 }}>🍽️</div>
                <div style={{ marginTop: 14, fontSize: 14 }}>Noch keine Mahlzeiten</div>
              </div>
            ) : <>
              <div style={{ fontSize: 10, color: T.m3, textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>Alle Mahlzeiten</div>
              {[...meals].reverse().map((m, i) => {
                const ageH = (Date.now() - m.ts) / 3600000;
                const active = ageH < 3;
                return (
                  <div key={m.id} style={{ display: "flex", alignItems: "flex-start", gap: 12, background: T.bg2, border: `1px solid ${active ? "#16a34a33" : T.border}`, borderRadius: 13, padding: "12px 13px", marginBottom: 8, animation: `fadeUp .18s ease ${i * .03}s both` }}>
                    <div style={{ fontSize: 22, marginTop: 1 }}>{m.type.split(" ")[0]}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{m.type.split(" ").slice(1).join(" ")}</div>
                        {active && <div style={{ fontSize: 9, background: "#16a34a22", color: "#4ade80", borderRadius: 10, padding: "2px 7px", fontWeight: 600 }}>AKTIV</div>}
                      </div>
                      <div style={{ fontSize: 12, color: T.text2, marginTop: 3, lineHeight: 1.4 }}>{m.desc}</div>
                      <div style={{ fontSize: 10, color: T.m3, marginTop: 4 }}>
                        {fmtTime(m.ts)} Uhr{active ? ` · noch ${(3 - ageH).toFixed(1)}h aktiv` : " · abgelaufen"}
                      </div>
                    </div>
                    <div className="tap" onClick={() => removeMeal(m.id)} style={{ color: T.m5, fontSize: 16, padding: 4, marginTop: -2 }}>×</div>
                  </div>
                );
              })}
              <div className="tap" onClick={() => { setMeals([]); const nb = calcBac(session, profile.weight, profile.gender, []); setBac(nb); if (activeRoom?.roomCode) { updateSessionData(activeRoom.roomCode, session, [], nb, session.length); refreshLeaderboard(activeRoom.roomCode); } toast_("Mahlzeiten gelöscht"); }}
                style={{ background: T.bgDanger, border: "1px solid #f8717120", borderRadius: 12, padding: "11px", textAlign: "center", fontSize: 12, color: "#f87171", marginTop: 8 }}>
                🗑 Alle Mahlzeiten löschen
              </div>
            </>}
            <div style={{ height: 16 }} />
          </div>
        )}

        {screen === "profile" && (
          <div style={{ padding: "16px 16px 0", animation: "fadeUp .25s ease" }}>
            <div style={{ background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 18, padding: 20, marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>Mein Profil</div>
                <div className="tap" onClick={() => { setEditProfile(!editProfile); setTmpProf(profile) }} style={{ fontSize: 12, color: "#3b82f6", fontWeight: 600 }}>
                  {editProfile ? "Abbrechen" : "Bearbeiten"}
                </div>
              </div>
              {!editProfile ? (
                <div style={{ display: "grid", gap: 16 }}>
                  {[
                    { icon: "👤", label: "Name (privat)", val: profile.name },
                    { icon: "🏷️", label: "Anzeigename im Leaderboard", val: profile.display_name || profile.name },
                    { icon: "⚖️", label: "Gewicht", val: profile.weight + " kg" },
                    { icon: "🧬", label: "Geschlecht", val: profile.gender === "m" ? "Männlich" : "Weiblich" },
                    { icon: country.flag, label: "Land", val: country.name },
                    { icon: "🚗", label: "Führerschein-Limit", val: `${effectiveLimit === 0 ? "0.0" : effectiveLimit}‰${profile.novice ? " (Neulenker)" : ""}` },
                    { icon: user ? "☁️" : "👤", label: "Account", val: user ? "Cloud-Sync aktiv" : "Gast-Modus (lokal)" },
                  ].map(r => (
                    <div key={r.label} style={{ display: "flex", gap: 14, alignItems: "center" }}>
                      <div style={{ fontSize: 22, width: 32, textAlign: "center" }}>{r.icon}</div>
                      <div><div style={{ fontSize: 10, color: T.m2 }}>{r.label}</div><div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>{r.val}</div></div>
                    </div>
                  ))}
                </div>
              ) : (
                <Modal title="Profil bearbeiten" onClose={() => setEditProfile(false)}>
                  <div style={{ display: "grid", gap: 14 }}>
                    {[
                      { label: "Name (privat)", key: "name", type: "text" },
                      { label: "Anzeigename im Leaderboard", key: "display_name", type: "text" },
                      { label: "Gewicht (kg)", key: "weight", type: "number" },
                    ].map(f => (
                      <div key={f.key}>
                        <div style={{ fontSize: 10, color: T.m2, marginBottom: 6 }}>{f.label}</div>
                        <input type={f.type} value={tmpProf[f.key]} onChange={e => setTmpProf(p => ({ ...p, [f.key]: f.type === "number" ? +e.target.value : e.target.value }))} style={inp} />
                      </div>
                    ))}
                    <div>
                      <div style={{ fontSize: 10, color: T.m2, marginBottom: 8 }}>Geschlecht</div>
                      <div style={{ display: "flex", gap: 10 }}>
                        {[["m", "Männlich"], ["f", "Weiblich"]].map(([v, l]) => (
                          <div key={v} className="tap" onClick={() => setTmpProf(p => ({ ...p, gender: v }))}
                            style={{ flex: 1, textAlign: "center", padding: "10px", borderRadius: 10, fontSize: 13, background: tmpProf.gender === v ? "#2563eb" : T.bg4, border: `1px solid ${tmpProf.gender === v ? "#2563eb" : T.borderIn}`, color: tmpProf.gender === v ? "#fff" : T.m1 }}>{l}</div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: T.m2, marginBottom: 8 }}>Land / Führerschein-Grenzwert</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, maxHeight: 180, overflowY: "auto", paddingRight: 2 }}>
                        {COUNTRIES.map(c => (
                          <div key={c.id} className="tap" onClick={() => setTmpProf(p => ({ ...p, country: c.id }))}
                            style={{
                              padding: "8px 10px", borderRadius: 10, fontSize: 12, display: "flex", alignItems: "center", gap: 8,
                              background: tmpProf.country === c.id ? (isDark ? "#1e2f5e" : "#dbeafe") : T.bg4,
                              border: `1px solid ${tmpProf.country === c.id ? "#2563eb" : T.borderIn}`,
                              color: tmpProf.country === c.id ? "#fff" : "#666"
                            }}>
                            <span style={{ fontSize: 16 }}>{c.flag}</span>
                            <div>
                              <div style={{ fontWeight: 500, lineHeight: 1.2 }}>{c.name}</div>
                              <div style={{ fontSize: 9, opacity: .6 }}>{c.limit === 0 ? "0.0" : c.limit}‰</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="tap" onClick={() => setTmpProf(p => ({ ...p, novice: !p.novice }))}
                      style={{ background: tmpProf.novice ? "#1a1a0f" : T.bg4, border: `1px solid ${tmpProf.novice ? "#ca8a04" : T.borderIn}`, borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ fontSize: 20 }}>🔰</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>Neulenker / Probezeit</div>
                        <div style={{ fontSize: 11, color: T.m1, marginTop: 1 }}>0.0‰ Limit aktiv</div>
                      </div>
                      <div style={{ marginLeft: "auto", fontSize: 18 }}>{tmpProf.novice ? "✅" : "⬜"}</div>
                    </div>
                  </div>
                  <div className="tap" onClick={() => {
                    setProfile(tmpProf);
                    setEditProfile(false);
                    const nb = calcBac(session, tmpProf.weight, tmpProf.gender, meals);
                    setBac(nb);
                    if (activeRoom?.roomCode) {
                      window.supabaseClient.from('drinking_sessions').update({ display_name: tmpProf.display_name }).eq('room_code', activeRoom.roomCode).eq('user_id', user.id);
                    }
                    toast_("Profil gespeichert ✓");
                  }}
                    style={{ background: "#2563eb", borderRadius: 11, padding: "12px", textAlign: "center", fontWeight: 700, fontSize: 14, marginTop: 20 }}>Speichern</div>
                </Modal>
              )}
            </div>
            <div style={{ background: T.bgOk2, border: "1px solid #0f3020", borderRadius: 14, padding: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#4ade80", marginBottom: 6 }}>ℹ️ Hinweis</div>
              <div style={{ fontSize: 11, color: "#2a5040", lineHeight: 1.7 }}>Berechnung nach Widmark-Formel – Schätzwert. Essen, Medikamente und Metabolismus beeinflussen den Pegel. Im Zweifel: Nicht fahren!</div>
            </div>
            <div style={{ height: 16 }} />
          </div>
        )}

        {screen === "group" && (
          <div style={{ padding: "16px 16px 0", animation: "fadeUp .25s ease" }}>
            {!activeRoom ? (
              <div>
                {/* Kicked Banner */}
                {wasKicked && (
                  <div style={{ background: T.bgDanger, border: "1px solid #f8717155", borderRadius: 18, padding: "20px", marginBottom: 20, textAlign: "center", animation: "slideUp .3s ease" }}>
                    <div style={{ fontSize: 40, marginBottom: 10 }}>🚪</div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: "#f87171", marginBottom: 6 }}>Du wurdest rausgeworfen</div>
                    <div style={{ fontSize: 13, color: "#8a4040", lineHeight: 1.6 }}>Der Host hat dich aus der Session entfernt. Du kannst einem neuen Raum beitreten oder selbst einen erstellen.</div>
                    <div className="tap" onClick={() => setWasKicked(false)}
                      style={{ marginTop: 14, display: "inline-block", padding: "8px 20px", borderRadius: 20, background: "#f8717122", border: "1px solid #f8717144", fontSize: 12, color: "#f87171", fontWeight: 600 }}>
                      Alles klar ✕
                    </div>
                  </div>
                )}

                {/* Hero */}
                <div style={{ textAlign: "center", padding: "8px 0 28px" }}>
                  <div style={{ fontSize: 52, marginBottom: 10 }}>👥</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: T.textBr }}>Gruppen-Session</div>
                  <div style={{ fontSize: 13, color: T.m1, marginTop: 6, lineHeight: 1.6 }}>Vergleiche live Promillewerte<br/>mit deinen Freunden</div>
                </div>

                {/* Create Room Card */}
                <div style={{ background: T.bg2, border: `1px solid ${T.border2}`, borderRadius: 22, padding: "22px 20px", marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 14, background: "#2563eb22", display: "grid", placeItems: "center", fontSize: 22 }}>🎯</div>
                    <div>
                      <div style={{ fontSize: 17, fontWeight: 700, color: T.textBr }}>Raum erstellen</div>
                      <div style={{ fontSize: 12, color: T.m1, marginTop: 2 }}>Du bist der Host</div>
                    </div>
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 10, color: T.m1, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8 }}>Raumname</div>
                    <input
                      value={roomNameInput}
                      onChange={e => { setRoomNameInput(e.target.value); setSessionSyncError(null); }}
                      placeholder="z.B. Hüttenwochenende 🏔️"
                      style={{ width: "100%", background: T.bg4, border: `1px solid ${T.borderIn}`, borderRadius: 12, padding: "14px 16px", color: T.textBr, fontSize: 14, outline: "none", fontFamily: "inherit" }}
                    />
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 10, color: T.m1, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8 }}>Dein Name im Leaderboard</div>
                    <input
                      value={tempDisplayName}
                      onChange={e => { setTempDisplayName(e.target.value); setSessionSyncError(null); }}
                      placeholder={profile.display_name && profile.display_name !== "Gast" ? profile.display_name : "z.B. Party-König"}
                      style={{ width: "100%", background: T.bg4, border: `1px solid ${T.borderIn}`, borderRadius: 12, padding: "14px 16px", color: T.textBr, fontSize: 14, outline: "none", fontFamily: "inherit" }}
                    />
                  </div>

                  {sessionSyncError && (
                    <div style={{ background: T.bgWarn, border: "1px solid #f8717133", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 12, color: "#f87171" }}>
                      ⚠️ {sessionSyncError}
                    </div>
                  )}

                  <div className="tap" onClick={async () => {
                    if (!roomNameInput.trim()) { setSessionSyncError("Bitte einen Raumnamen eingeben."); return; }
                    const name = (tempDisplayName.trim()) || (profile.display_name !== "Gast" ? profile.display_name : "");
                    if (!name) { setSessionSyncError("Bitte einen Anzeigenamen eingeben."); return; }
                    setSessionSyncError(null);
                    setWasKicked(false);
                    setSessionSyncLoading(true);
                    const totalG = getCurrentGrams(session);
                    const { data, error } = await createSession(roomNameInput.trim(), name, session, meals, bac, totalG);
                    setSessionSyncLoading(false);
                    if (error || !data) { setSessionSyncError(error?.message || "Fehler beim Erstellen."); return; }
                    setProfile(p => ({ ...p, display_name: name }));
                    const info = { roomCode: data.room_code, roomName: data.room_name, isHost: data.is_host };
                    setActiveRoom(info);
                    setRoomNameInput("");
                    await refreshLeaderboard(info.roomCode);
                    const mySyncIdH = user ? user.id : getSyncId();
                    setupRealtime(info.roomCode, mySyncIdH, true);
                    toast_(`Raum „${info.roomName}" erstellt · Code ${info.roomCode}`);
                  }}
                    style={{ background: sessionSyncLoading ? "#1e3a8a" : "#2563eb", borderRadius: 13, padding: "16px", textAlign: "center", fontWeight: 700, fontSize: 15, color: "#fff", opacity: sessionSyncLoading ? 0.7 : 1 }}>
                    {sessionSyncLoading ? "Erstelle Raum…" : "Raum erstellen →"}
                  </div>
                </div>

                {/* Join Room Card */}
                <div style={{ background: T.bg2, border: `1px solid ${T.border2}`, borderRadius: 22, padding: "22px 20px", marginBottom: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 14, background: "#16a34a22", display: "grid", placeItems: "center", fontSize: 22 }}>🔑</div>
                    <div>
                      <div style={{ fontSize: 17, fontWeight: 700, color: T.textBr }}>Mit Code beitreten</div>
                      <div style={{ fontSize: 12, color: T.m1, marginTop: 2 }}>4-stelliger Raumcode</div>
                    </div>
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 10, color: T.m1, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8 }}>Raumcode</div>
                    <input
                      value={joinCodeInput}
                      onChange={e => { setJoinCodeInput(e.target.value.replace(/\D/g, "").slice(0, 4)); setSessionSyncError(null); }}
                      placeholder="0000"
                      maxLength={4}
                      inputMode="numeric"
                      style={{ width: "100%", background: T.bg4, border: `1px solid ${joinCodeInput.length === 4 ? "#16a34a" : T.borderIn}`, borderRadius: 12, padding: "14px 16px", color: "#3b82f6", fontSize: 32, outline: "none", fontFamily: "'Space Mono',monospace", fontWeight: 700, letterSpacing: 10, textAlign: "center", transition: "border-color .2s" }}
                    />
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 10, color: T.m1, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8 }}>Dein Name im Leaderboard</div>
                    <input
                      value={tempDisplayName}
                      onChange={e => { setTempDisplayName(e.target.value); setSessionSyncError(null); }}
                      placeholder={profile.display_name && profile.display_name !== "Gast" ? profile.display_name : "z.B. Feierkönig"}
                      style={{ width: "100%", background: T.bg4, border: `1px solid ${T.borderIn}`, borderRadius: 12, padding: "14px 16px", color: T.textBr, fontSize: 14, outline: "none", fontFamily: "inherit" }}
                    />
                  </div>

                  <div className="tap" onClick={async () => {
                    const code = joinCodeInput.trim();
                    if (code.length !== 4) { setSessionSyncError("Bitte einen 4-stelligen Code eingeben."); return; }
                    const name = (tempDisplayName.trim()) || (profile.display_name !== "Gast" ? profile.display_name : "");
                    if (!name) { setSessionSyncError("Bitte einen Anzeigenamen eingeben."); return; }
                    setSessionSyncError(null);
                    setWasKicked(false);
                    setSessionSyncLoading(true);
                    const totalG = getCurrentGrams(session);
                    const { data, error } = await joinSession(code, name, session, meals, bac, totalG);
                    setSessionSyncLoading(false);
                    if (error || !data) { setSessionSyncError(error?.message || "Session nicht gefunden."); return; }
                    setProfile(p => ({ ...p, display_name: name }));
                    const info = { roomCode: data.room_code, roomName: data.room_name, isHost: data.is_host };
                    setActiveRoom(info);
                    await refreshLeaderboard(info.roomCode);
                    const mySyncIdJ = user ? user.id : getSyncId();
                    setupRealtime(info.roomCode, mySyncIdJ, false);
                    toast_(`Session „${info.roomName}" beigetreten · Code ${info.roomCode}`);
                  }}
                    style={{ background: sessionSyncLoading ? "#14532d" : "#16a34a", borderRadius: 13, padding: "16px", textAlign: "center", fontWeight: 700, fontSize: 15, color: "#fff", opacity: sessionSyncLoading ? 0.7 : 1 }}>
                    {sessionSyncLoading ? "Trete bei…" : "Beitreten →"}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {/* Room Header */}
                <div style={{ background: isDark ? "linear-gradient(135deg,#1e3a8a22,#2563eb11)" : "linear-gradient(135deg,#dbeafe,#eff6ff)", border: "1px solid #2563eb33", borderRadius: 22, padding: "20px", marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 10, color: "#3b82f6", textTransform: "uppercase", letterSpacing: 2, marginBottom: 6 }}>
                        {activeRoom.isHost ? "👑 Du bist Host" : "👤 Teilnehmer"}
                      </div>
                      <div style={{ fontSize: 21, fontWeight: 700, color: T.textBr, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{activeRoom.roomName}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
                        <div style={{ fontSize: 11, color: T.m1 }}>Code</div>
                        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 28, fontWeight: 700, color: "#3b82f6", letterSpacing: 6 }}>{activeRoom.roomCode}</div>
                      </div>
                    </div>
                    <div style={{ flexShrink: 0, textAlign: "right" }}>
                      <div style={{ fontSize: 11, color: T.m1, marginBottom: 10 }}>{leaderboard.length} Teilnehmer</div>
                      <div className="tap" onClick={() => refreshLeaderboard(activeRoom.roomCode)}
                        style={{ background: T.bg, border: `1px solid ${T.border2}`, borderRadius: 10, padding: "9px 13px", fontSize: 13, color: T.m1, display: "inline-flex", alignItems: "center", gap: 5 }}>
                        ↻ <span style={{ fontSize: 11 }}>Aktualisieren</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Danger Banner */}
                {leaderboard.filter(r => (r.current_bac || 0) >= 1.5).length > 0 && (() => {
                  const danger = leaderboard.filter(r => (r.current_bac || 0) >= 1.5);
                  return (
                    <div style={{ background: T.bgWarn, border: "1px solid #f8717155", borderRadius: 16, padding: "14px 16px", marginBottom: 14, display: "flex", alignItems: "center", gap: 12, animation: "pulse 1.5s infinite" }}>
                      <div style={{ fontSize: 26 }}>⚠️</div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#f87171" }}>Aufpassen!</div>
                        <div style={{ fontSize: 12, color: "#8a4040", marginTop: 3, lineHeight: 1.5 }}>
                          {danger.map(r => r.display_name || "Gast").join(", ")} {danger.length === 1 ? "hat" : "haben"} sehr hohe Promillewerte!
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Sort Tabs */}
                <div style={{ display: "flex", background: T.bg4, borderRadius: 14, padding: 4, marginBottom: 16 }}>
                  {[{ id: "bac", label: "‰  Nach Promille" }, { id: "grams", label: "🍺  Nach Menge" }].map(tab => (
                    <div key={tab.id} className="tap" onClick={() => setLeaderboardTab(tab.id)}
                      style={{ flex: 1, textAlign: "center", padding: "11px 0", borderRadius: 11, fontSize: 13, fontWeight: 600, background: leaderboardTab === tab.id ? "#2563eb" : "transparent", color: leaderboardTab === tab.id ? "#fff" : T.m1, transition: "all .2s" }}>
                      {tab.label}
                    </div>
                  ))}
                </div>

                {/* Leaderboard Cards */}
                {(() => {
                  const sorted = leaderboard.slice().sort((a, b) =>
                    leaderboardTab === "bac"
                      ? (b.current_bac || 0) - (a.current_bac || 0)
                      : (b.total_alcohol_grams || 0) - (a.total_alcohol_grams || 0)
                  );
                  const medals = ["🥇", "🥈", "🥉"];
                  return (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                      {sorted.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "40px 0", color: T.m3 }}>
                          <div style={{ fontSize: 44 }}>👥</div>
                          <div style={{ marginTop: 14, fontSize: 14 }}>Noch niemand in der Session</div>
                        </div>
                      ) : sorted.map((row, idx) => {
                        const isMe = (user && row.user_id === user.id) || row.sync_id === localStorage.getItem('pt_sync_id');
                        const bv = row.current_bac || 0;
                        const grams = row.total_alcohol_grams || 0;
                        const danger = bv >= 1.5;
                        const c = bacColor(bv);
                        return (
                          <div key={row.sync_id} className="tap hov" onClick={() => setSelectedParticipant(row)}
                            style={{ background: danger ? T.bgWarn : isMe ? (isDark ? "#1e2f5e33" : "#dbeafe66") : T.bg2, border: `2px solid ${danger ? "#f87171" : isMe ? "#2563eb55" : T.border2}`, borderRadius: 18, padding: "16px 18px", animation: flashIds[row.sync_id] ? "pop .3s ease" : "none", transition: "background .3s" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                              {/* Medal / Rank */}
                              <div style={{ width: 38, textAlign: "center", flexShrink: 0 }}>
                                {idx < 3
                                  ? <span style={{ fontSize: 28 }}>{medals[idx]}</span>
                                  : <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 16, fontWeight: 700, color: T.m2 }}>#{idx + 1}</span>}
                              </div>
                              {/* Info */}
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap", marginBottom: 8 }}>
                                  <div style={{ fontWeight: 700, fontSize: 16, color: T.textBr }}>{row.display_name || "Gast"}</div>
                                  {isMe && <div style={{ fontSize: 9, background: "#2563eb22", color: "#3b82f6", borderRadius: 8, padding: "2px 8px", fontWeight: 700 }}>ICH</div>}
                                  {row.is_host && <div style={{ fontSize: 9, background: "#ca8a0422", color: "#f59e0b", borderRadius: 8, padding: "2px 8px", fontWeight: 700 }}>HOST</div>}
                                  {danger && <div style={{ fontSize: 9, background: "#f8717122", color: "#f87171", borderRadius: 8, padding: "2px 8px", fontWeight: 700 }}>⚠️ AUFPASSEN</div>}
                                </div>
                                {/* BAC Bar */}
                                <div style={{ height: 6, borderRadius: 4, background: T.bgBar, marginBottom: 7 }}>
                                  <div style={{ height: "100%", width: `${Math.min(bv / 2.5 * 100, 100)}%`, background: c, borderRadius: 4, transition: "width .6s ease" }} />
                                </div>
                                <div style={{ fontSize: 11, color: T.m2 }}>
                                  {(row.drinks || []).length} Getränke · {Math.round(grams)}g Alkohol
                                </div>
                              </div>
                              {/* BAC Value */}
                              <div style={{ textAlign: "right", flexShrink: 0 }}>
                                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 26, fontWeight: 700, color: c, lineHeight: 1 }}>{bv.toFixed(2)}</div>
                                <div style={{ fontSize: 11, color: T.m2, marginTop: 2 }}>‰</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}

                {/* Host Controls */}
                {activeRoom.isHost && (
                  <div style={{ background: T.bgReset, border: "1px solid #7c3aed33", borderRadius: 18, padding: "18px", marginBottom: 12 }}>
                    <div style={{ fontSize: 11, color: "#7c3aed", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14, fontWeight: 700 }}>👑 Host-Steuerung</div>
                    <div className="tap" onClick={handleHostReset}
                      style={{ background: T.bgDanger, border: "1px solid #f8717133", borderRadius: 12, padding: "14px", textAlign: "center", fontSize: 14, color: "#f87171", fontWeight: 700 }}>
                      🔄 Alle Stats zurücksetzen
                    </div>
                  </div>
                )}

                {/* Leave Button */}
                <div className="tap" onClick={handleLeaveSession}
                  style={{ background: T.bg2, border: `1px solid ${T.border2}`, borderRadius: 14, padding: "15px", textAlign: "center", fontSize: 14, color: T.m1, fontWeight: 600, marginBottom: 24 }}>
                  🚪 Session verlassen
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {activeRoom && (() => {
        const sortedLb = leaderboard.slice().sort((a, b) => (b.current_bac || 0) - (a.current_bac || 0));
        const dangerCount = sortedLb.filter(r => (r.current_bac || 0) >= 1.5).length;
        return (
          <div style={{ position: "fixed", bottom: 57, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 440, background: T.bg2, borderTop: `1px solid ${T.border}`, zIndex: 59 }}>
            <div style={{ padding: "7px 12px 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 13, fontWeight: 700, color: "#3b82f6", flexShrink: 0 }}>{activeRoom.roomCode}</div>
                  <div style={{ fontSize: 11, color: T.m1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{activeRoom.roomName}</div>
                  {dangerCount > 0 && (
                    <div style={{ flexShrink: 0, fontSize: 9, background: "#f8717122", color: "#f87171", padding: "1px 6px", borderRadius: 10, fontWeight: 700, animation: "pulse 1.5s infinite" }}>
                      ⚠️ {dangerCount} aufpassen
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                  <div className="tap" onClick={() => refreshLeaderboard(activeRoom.roomCode)}
                    style={{ background: T.bg, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "4px 8px", fontSize: 13, color: T.m1 }}>↻</div>
                  <div className="tap" onClick={() => setScreen("group")}
                    style={{ background: "#2563eb18", border: "1px solid #2563eb44", borderRadius: 8, padding: "4px 9px", fontSize: 10, color: "#3b82f6", fontWeight: 700 }}>
                    {leaderboard.length} Leute
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 5, overflowX: "auto", paddingBottom: 7, paddingTop: 5, WebkitOverflowScrolling: "touch" }}>
                {sortedLb.length === 0 ? (
                  <div style={{ fontSize: 10, color: T.m3, padding: "2px 4px" }}>Noch keine Teilnehmer…</div>
                ) : sortedLb.map((row, idx) => {
                  const isMe = (user && row.user_id === user.id) || row.sync_id === localStorage.getItem('pt_sync_id');
                  const val = row.current_bac || 0;
                  const danger = val >= 1.5;
                  return (
                    <div key={row.sync_id} className="tap" onClick={() => { setSelectedParticipant(row); }}
                      style={{ flexShrink: 0, background: danger ? T.bgWarn : T.bg, border: `1px solid ${danger ? "#f8717144" : isMe ? "#2563eb44" : T.border2}`, borderRadius: 10, padding: "4px 9px", display: "flex", alignItems: "center", gap: 5 }}>
                      <span style={{ fontSize: 9, color: T.m2, fontFamily: "'Space Mono',monospace" }}>{idx + 1}</span>
                      <span style={{ fontSize: 10, fontWeight: isMe ? 700 : 500, color: isMe ? T.textBr : "#888" }}>{row.display_name || "Gast"}</span>
                      <span style={{ fontSize: 10, fontFamily: "'Space Mono',monospace", fontWeight: 700, color: bacColor(val) }}>{val.toFixed(2)}‰</span>
                      {danger && <span style={{ fontSize: 9 }}>⚠️</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}

      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 440, background: T.bg, borderTop: `1px solid ${T.borderNav}`, display: "grid", gridTemplateColumns: "repeat(5,1fr)", padding: "8px 0", zIndex: 60 }}>
        {[
          { id: "home",    icon: "🏠",        label: "Home" },
          { id: "drinks",  icon: "🍺",        label: "Getränke" },
          { id: "session", icon: "📋",        label: "Session",  badge:  session.length },
          { id: "group",   icon: "👥",        label: "Gruppe",   badge3: activeRoom ? leaderboard.length : null },
          { id: "profile", icon: country.flag, label: "Profil" },
        ].map(tab => (
          <div key={tab.id} className="tap" onClick={() => setScreen(tab.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "5px 0", position: "relative" }}>
            {screen === tab.id && <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 20, height: 2, background: "#3b82f6", borderRadius: 2 }} />}
            <div style={{ fontSize: 18 }}>{tab.icon}</div>
            <div style={{ fontSize: 8, marginTop: 2, color: screen === tab.id ? "#3b82f6" : T.m3, fontWeight: screen === tab.id ? 700 : 400 }}>{tab.label}</div>
            {tab.badge  > 0 && <div style={{ position: "absolute", top: 3, right: "50%", transform: "translateX(10px)", background: "#3b82f6", borderRadius: "50%", width: 14, height: 14, fontSize: 8, display: "grid", placeItems: "center", fontWeight: 700 }}>{tab.badge}</div>}
            {tab.badge3 > 0 && <div style={{ position: "absolute", top: 3, right: "50%", transform: "translateX(10px)", background: "#f59e0b", borderRadius: "50%", width: 14, height: 14, fontSize: 8, display: "grid", placeItems: "center", fontWeight: 700 }}>{tab.badge3}</div>}
            {tab.id === "group" && activeRoom && !tab.badge3 && <div style={{ position: "absolute", top: 5, right: "50%", transform: "translateX(10px)", width: 7, height: 7, borderRadius: "50%", background: "#f59e0b", animation: "pulse 1.5s infinite" }} />}
          </div>
        ))}
      </div>
    </div>
    </ThemeContext.Provider>
  );
}

// ═══ BOOTSTRAP ═══
function init() {
  if (window.supabaseClient) {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
  } else {
    setTimeout(init, 50);
  }
}
init();
