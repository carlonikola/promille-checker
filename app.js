const { useState, useEffect, useMemo, useRef } = React;

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
function bacColor(v) {
  if (v <= 0) return "#4ade80";
  if (v < 0.3) return "#4ade80";
  if (v < 0.5) return "#a3e635";
  if (v < 0.8) return "#facc15";
  if (v < 1.2) return "#fb923c";
  return "#f87171";
}

// ═══ COMPONENTS ═══
function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,.8)", display: "flex", alignItems: "flex-end" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "#12141e", borderRadius: "22px 22px 0 0", padding: "22px 20px 16px", width: "100%", maxWidth: 440, margin: "0 auto", border: "1px solid #1e2132", animation: "slideUp .25s ease", maxHeight: "92vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexShrink: 0 }}>
          <div style={{ fontSize: 17, fontWeight: 700 }}>{title}</div>
          <div onClick={onClose} style={{ color: "#888", fontSize: 28, cursor: "pointer", lineHeight: 1, padding: 4 }}>×</div>
        </div>
        <div style={{ flex: 1, minHeight: 0, overflowY: "auto", WebkitOverflowScrolling: "touch", paddingBottom: 24 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function Inp({ label, value, onChange, type = "text", placeholder = "" }) {
  const s = { width: "100%", background: "#0d0f17", border: "1px solid #222638", borderRadius: 10, padding: "10px 13px", color: "#e8eaf0", fontSize: 13, outline: "none", fontFamily: "inherit" };
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 6 }}>{label}</div>
      <input type={type} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} style={s} />
    </div>
  );
}

function TimePicker({ value, onChange }) {
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
      <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8 }}>Uhrzeit</div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {opts.map(o => (
          <div key={o.label} className="tap" onClick={() => { onChange(o.ts); setCustom(false); }}
            style={{
              padding: "5px 11px", borderRadius: 20, fontSize: 11, fontWeight: 500, cursor: "pointer",
              background: !custom && Math.abs(o.ts - value) < 65000 ? "#2563eb" : "#0d0f17",
              border: `1px solid ${!custom && Math.abs(o.ts - value) < 65000 ? "#2563eb" : "#222638"}`,
              color: !custom && Math.abs(o.ts - value) < 65000 ? "#fff" : "#666"
            }}>
            {o.label}
          </div>
        ))}
        <div className="tap" onClick={() => setCustom(true)}
          style={{
            padding: "5px 11px", borderRadius: 20, fontSize: 11, fontWeight: 500, cursor: "pointer",
            background: custom ? "#7c3aed" : "#0d0f17", border: `1px solid ${custom ? "#7c3aed" : "#222638"}`,
            color: custom ? "#fff" : "#666"
          }}>
          Andere…
        </div>
      </div>
      {custom && (
        <input type="time" value={customVal}
          onChange={e => { setCustomVal(e.target.value); onChange(tsFromTime(e.target.value)); }}
          style={{ marginTop: 10, background: "#0d0f17", border: "1px solid #222638", borderRadius: 10, padding: "9px 13px", color: "#e8eaf0", fontSize: 13, outline: "none", width: "100%", fontFamily: "inherit" }} />
      )}
    </div>
  );
}

// PLACEHOLDER — App component follows below

// ═══ MAIN APP ═══
function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

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

  // Auth Check
  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const session = await getSession();
    if (session?.user) {
      setUser(session.user);
      await loadUserData(session.user);
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
    if (userData) {
      setUser(userData);
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
    setGroupModalOpen(false);
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
        if (error) toast_("⚠️ Sync-Fehler: Netz prüfen!");
      }
    }
    sync();
  }, [bac, session.length, meals.length, profile.display_name, activeRoom?.roomCode]);

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

  function setupRealtime(roomCode) {
    if (!roomCode || !window.supabaseClient) return;
    if (sessionSub && typeof sessionSub.unsubscribe === "function") {
      sessionSub.unsubscribe();
    }
    const ch = subscribeToSession(roomCode, () => {
      refreshLeaderboard(roomCode);
    });
    setSessionSub(ch);
  }

  function toast_(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
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
    const { data, error } = await createSession(roomNameInput.trim(), tempDisplayName.trim());
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
    setGroupModalOpen(false);

    // Initial sync
    const totalGrams = session.reduce((a, e) => a + (e.vol * 1000 * (e.abv / 100) * 0.8), 0);
    const { error: syncError } = await updateSessionData(data.room_code, session, meals, bac, totalGrams, session.length, tempDisplayName.trim());
    if (syncError) toast_("⚠️ Initialer Sync fehlgeschlagen");

    await refreshLeaderboard(info.roomCode);
    setupRealtime(info.roomCode);
    toast_(`Raum „${info.roomName}“ erstellt · Code ${info.roomCode}`);
  }

  async function handleJoinSession() {
    if (profile.display_name === "Gast") {
      setShowNamePrompt(true);
      return;
    }
    const code = joinCodeInput.trim();
    if (code.length !== 4) {
      setSessionSyncError("Bitte einen 4-stelligen Code eingeben.");
      return;
    }
    setSessionSyncLoading(true);
    setSessionSyncError(null);
    const { data, error } = await joinSession(code, profile.display_name);
    setSessionSyncLoading(false);
    if (error || !data) {
      setSessionSyncError(error?.message || "Session nicht gefunden.");
      return;
    }
    const info = { roomCode: data.room_code, roomName: data.room_name, isHost: data.is_host };
    setActiveRoom(info);

    // Initial sync
    const { error: syncError } = await updateSessionData(code, session, meals, bac, session.length, profile.display_name);
    if (syncError) toast_("⚠️ Sync-Fehler beim Beitreten");

    await refreshLeaderboard(info.roomCode);
    setupRealtime(info.roomCode);
    toast_(`Session „${info.roomName}“ beigetreten · Code ${info.roomCode}`);
  }

  async function handleLeaveSession() {
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
    if (sessionSub && typeof sessionSub.unsubscribe === "function") {
      sessionSub.unsubscribe();
      setSessionSub(null);
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
      });
      refreshLeaderboard(activeRoom.roomCode);
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
      updateSessionData(activeRoom.roomCode, next, meals, nb, next.length, profile.display_name).then(({ error }) => {
        if (error) toast_("⚠️ Sync-Fehler: Netz prüfen!");
      });
      refreshLeaderboard(activeRoom.roomCode);
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
    if (user && activeRoom?.roomCode) {
      updateSessionData(activeRoom.roomCode, session, next, nb, session.length);
      refreshLeaderboard(activeRoom.roomCode);
    }
    toast_(`${m.type.split(" ")[0]} eingetragen`);
  }

  function removeMeal(id) {
    const next = meals.filter(m => m.id !== id);
    setMeals(next);
    const nb = calcBac(session, profile.weight, profile.gender, next);
    setBac(nb);
    if (user && activeRoom?.roomCode) {
      updateSessionData(activeRoom.roomCode, session, next, nb, session.length);
      refreshLeaderboard(activeRoom.roomCode);
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

  const inp = { width: "100%", background: "#0d0f17", border: "1px solid #222638", borderRadius: 10, padding: "10px 13px", color: "#e8eaf0", fontSize: 13, outline: "none", fontFamily: "inherit" };
  const screenTitle = { home: "Dashboard", drinks: "Getränke", session: "Session", food: "Essen", profile: "Profil" }[screen];

  // Loading Screen
  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0b10', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, animation: 'pulse 1.5s infinite' }}>🍺</div>
          <div style={{ fontSize: 14, color: '#555', marginTop: 16 }}>Laden...</div>
        </div>
      </div>
    );
  }

  // Auth Screen
  if (!user && !localStorage.getItem('pt_guest_mode')) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  // Main App
  return (
    <div style={{ height: "100vh", maxHeight: "100vh", background: "#0a0b10", color: "#dde0ee", fontFamily: "'DM Sans','Segoe UI',sans-serif", display: "flex", flexDirection: "column", maxWidth: 440, margin: "0 auto", overflow: "hidden", position: "relative" }}>
      {toast && <div style={{ position: "fixed", bottom: 86, left: "50%", transform: "translateX(-50%)", zIndex: 999, background: "#181b28", border: "1px solid #2a2e48", borderRadius: 14, padding: "10px 20px", fontSize: 13, fontWeight: 500, animation: "toast .2s ease", boxShadow: "0 8px 32px #0008", whiteSpace: "nowrap", maxWidth: "88vw" }}>{toast}</div>}

      {/* Gruppen-Session Modal */}
      {/* Modal is now integrated in groupModalOpen flow */}
      {groupModalOpen && (
        <Modal title="Gruppen-Session" onClose={() => { setGroupModalOpen(false); setRoomCreationStep(1); setSessionSyncError(null); }}>
          {!user ? (
            <div style={{ fontSize: 13, color: "#bbb", lineHeight: 1.6 }}>
              Bitte melde dich an, um eine Gruppen-Session zu nutzen.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {activeRoom ? (
                <div style={{ background: "#0e1020", border: "1px solid #171a2a", borderRadius: 14, padding: "12px 14px" }}>
                  <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>Aktiver Raum</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{activeRoom.roomName}</div>
                      <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>
                        {activeRoom.isHost ? "Du bist Host" : "Du bist Teilnehmer"}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 10, color: "#555", marginBottom: 2 }}>Code</div>
                      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 20, fontWeight: 700, letterSpacing: 2 }}>
                        {activeRoom.roomCode}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: "#444" }}>
                    Teile den Code mit Freunden. Alle im Raum sehen sich im Leaderboard.
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ background: "#0e1020", border: "1px solid #171a2a", borderRadius: 14, padding: "12px 14px" }}>
                    <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>{roomCreationStep === 1 ? "Session hosten" : "Anzeigename wählen"}</div>
                    {roomCreationStep === 1 ? (
                      <Inp label="Raumname" value={roomNameInput} onChange={setRoomNameInput} placeholder="z.B. WG-Party, Stammtisch…" />
                    ) : (
                      <Inp label="Dein Anzeigename für das Leaderboard" value={tempDisplayName} onChange={setTempDisplayName} placeholder="z.B. Captain Hook" />
                    )}
                    <div className="tap" onClick={handleHostSession} style={{ background: "#2563eb", borderRadius: 10, padding: "10px", textAlign: "center", fontWeight: 700, fontSize: 13, opacity: sessionSyncLoading ? 0.7 : 1, cursor: sessionSyncLoading ? "default" : "pointer" }}>
                      {sessionSyncLoading ? "Verarbeite..." : roomCreationStep === 1 ? "Raum erstellen" : "Session starten & beitreten"}
                    </div>
                  </div>

                  <div style={{ background: "#0e1020", border: "1px solid #171a2a", borderRadius: 14, padding: "12px 14px" }}>
                    <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>Session beitreten</div>
                    <Inp label="Code (4-stellig)" value={joinCodeInput} onChange={v => setJoinCodeInput(v.replace(/\D/g, "").slice(0, 4))} placeholder="z.B. 4821" />
                    <div className="tap" onClick={handleJoinSession} style={{ background: "#1d283a", borderRadius: 10, padding: "10px", textAlign: "center", fontWeight: 700, fontSize: 13, opacity: sessionSyncLoading ? 0.7 : 1, cursor: sessionSyncLoading ? "default" : "pointer" }}>
                      {sessionSyncLoading ? "Verbinde..." : "Mit Code beitreten"}
                    </div>
                  </div>
                </>
              )}

              {sessionSyncError && (
                <div style={{ background: "#1a0c0c", border: "1px solid #f8717130", borderRadius: 10, padding: "8px 10px", fontSize: 12, color: "#fca5a5" }}>
                  {sessionSyncError}
                </div>
              )}

              {activeRoom && (
                <>
                  <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                    <div className="tap" onClick={() => setLeaderboardTab("bac")} 
                      style={{ flex: 1, padding: "8px", textAlign: "center", fontSize: 10, fontWeight: 700, borderRadius: 8, background: leaderboardTab === "bac" ? "#2563eb" : "#0e1020", border: `1px solid ${leaderboardTab === "bac" ? "#2563eb" : "#171a2a"}`, color: leaderboardTab === "bac" ? "#fff" : "#555" }}>
                      PROMILLE-RANKING
                    </div>
                    <div className="tap" onClick={() => setLeaderboardTab("grams")} 
                      style={{ flex: 1, padding: "8px", textAlign: "center", fontSize: 10, fontWeight: 700, borderRadius: 8, background: leaderboardTab === "grams" ? "#2563eb" : "#0e1020", border: `1px solid ${leaderboardTab === "grams" ? "#2563eb" : "#171a2a"}`, color: leaderboardTab === "grams" ? "#fff" : "#555" }}>
                      ALKOHOL-MENGE
                    </div>
                  </div>

                  <div style={{ background: "#0e1020", border: "1px solid #171a2a", borderRadius: 14, padding: "10px 10px", maxHeight: 260, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
                    {leaderboard.length === 0 ? (
                      <div style={{ fontSize: 12, color: "#555", textAlign: "center", padding: "14px 4px" }}>
                        Noch keine Daten. Füge ein Getränk hinzu!
                      </div>
                    ) : (
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                        <thead>
                          <tr style={{ color: "#666", textAlign: "left" }}>
                            <th style={{ padding: "4px 4px", width: 24 }}>#</th>
                            <th style={{ padding: "4px 4px" }}>Name</th>
                            <th style={{ padding: "4px 4px", textAlign: "right" }}>{leaderboardTab === "bac" ? "Promille" : "Gramm"}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {leaderboard
                            .slice()
                            .sort((a, b) => leaderboardTab === "bac" 
                              ? (b.current_bac || 0) - (a.current_bac || 0)
                              : (b.total_alcohol_grams || 0) - (a.total_alcohol_grams || 0)
                            )
                            .map((row, idx) => {
                              const isMe = (user && row.user_id === user.id) || row.sync_id === localStorage.getItem('pt_sync_id');
                              const val = leaderboardTab === "bac" ? (row.current_bac || 0) : (row.total_alcohol_grams || 0);
                              const rowColor = leaderboardTab === "bac" ? bacColor(val) : "#3b82f6";
                              return (
                                <tr key={row.sync_id || row.user_id} style={{ background: isMe ? rowColor + "12" : "transparent" }}>
                                  <td style={{ padding: "6px 4px", fontFamily: "'Space Mono',monospace", color: "#444" }}>{idx + 1}</td>
                                  <td style={{ padding: "6px 4px", fontWeight: isMe ? 700 : 500 }}>
                                    {row.display_name || "Gast"}
                                    {row.is_host && <span style={{ fontSize: 9, color: "#facc15", marginLeft: 4 }}>HOST</span>}
                                  </td>
                                  <td style={{ padding: "6px 4px", textAlign: "right", fontFamily: "'Space Mono',monospace", color: rowColor, fontWeight: 700 }}>
                                    {leaderboardTab === "bac" ? val.toFixed(2) + "‰" : Math.round(val) + "g"}
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    )}
                  </div>
                  <div className="tap" onClick={handleLeaveSession} style={{ background: "#180c0c", border: "1px solid #f8717125", borderRadius: 10, padding: "9px", textAlign: "center", fontSize: 12, color: "#fca5a5" }}>
                    {sessionSyncLoading ? "Verlasse..." : "Session verlassen"}
                  </div>
                </>
              )}
            </div>
          )}
        </Modal>
      )}

      {pendingDrink && (
        <Modal title={`${pendingDrink.icon} ${pendingDrink.name}`} onClose={() => setPendingDrink(null)}>
          <TimePicker value={pendingTs} onChange={setPendingTs} />

          <div style={{ marginBottom: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8 }}>
              <span>Menge</span>
              <span style={{ color: "#e8eaf0", fontFamily: "'Space Mono',monospace" }}>{(pendingDrink.vol * 1000).toFixed(0)} ml</span>
            </div>
            <input type="range" min="0.01" max="1.0" step="0.01" value={pendingDrink.vol}
              onChange={e => setPendingDrink(d => ({ ...d, vol: +e.target.value }))}
              style={{ width: "100%", accentColor: "#2563eb", cursor: "pointer" }} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 9, color: "#333" }}>
              <span>0.01L</span><span>0.5L</span><span>1.0L</span>
            </div>
          </div>

          <div style={{ marginBottom: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8 }}>
              <span>Alkoholgehalt</span>
              <span style={{ color: "#e8eaf0", fontFamily: "'Space Mono',monospace" }}>{pendingDrink.abv.toFixed(1)}%</span>
            </div>
            <input type="range" min="0" max="80" step="0.5" value={pendingDrink.abv}
              onChange={e => setPendingDrink(d => ({ ...d, abv: +e.target.value }))}
              style={{ width: "100%", accentColor: "#2563eb", cursor: "pointer" }} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 9, color: "#333" }}>
              <span>0%</span><span>40%</span><span>80%</span>
            </div>
          </div>

          <div style={{ background: "#0e1020", border: "1px solid #171a2a", borderRadius: 12, padding: "12px 14px", marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontSize: 12, color: "#555" }}>Wirkung ca.</div>
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
            <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 6 }}>Kategorie</div>
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
            <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8 }}>Mahlzeit</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {MEAL_TYPES.map(t => (
                <div key={t} className="tap" onClick={() => setNewMeal(m => ({ ...m, type: t }))}
                  style={{
                    padding: "10px 8px", borderRadius: 12, textAlign: "center", fontSize: 13,
                    background: newMeal.type === t ? "#16a34a" : "#0e1020",
                    border: `1px solid ${newMeal.type === t ? "#16a34a" : "#1d2030"}`,
                    color: newMeal.type === t ? "#fff" : "#666"
                  }}>{t}</div>
              ))}
            </div>
          </div>
          <TimePicker value={newMeal.ts} onChange={ts => setNewMeal(m => ({ ...m, ts }))} />
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 6 }}>Was hast du gegessen?</div>
            <textarea value={newMeal.desc} onChange={e => setNewMeal(m => ({ ...m, desc: e.target.value }))}
              placeholder="z.B. Pizza, Burger, Salat…" rows={3}
              style={{ width: "100%", background: "#0d0f17", border: "1px solid #222638", borderRadius: 10, padding: "10px 13px", color: "#e8eaf0", fontSize: 13, outline: "none", fontFamily: "inherit", resize: "none", lineHeight: 1.5 }} />
          </div>
          <div className="tap" onClick={confirmAddMeal} style={{ background: "#16a34a", borderRadius: 11, padding: "12px", textAlign: "center", fontWeight: 700, fontSize: 14 }}>Eintragen ✓</div>
        </Modal>
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px 12px", borderBottom: "1px solid #13151f", background: "#0a0b10", position: "sticky", top: 0, zIndex: 100 }}>
        <div>
          <div style={{ fontSize: 9, letterSpacing: 3, color: "#333", textTransform: "uppercase", fontFamily: "'Space Mono',monospace" }}>PromilleTracker</div>
          <div style={{ fontSize: 17, fontWeight: 700, marginTop: 1 }}>{screenTitle}</div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {!user && (
            <div className="tap" onClick={() => { localStorage.removeItem('pt_guest_mode'); setUser(null); }}
              style={{ background: "#2563eb", padding: "5px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 4 }}>
              ☁️ <span style={{ fontSize: 10 }}>Anmelden</span>
            </div>
          )}
          {session.length > 0 && (
            <div key={bac.toFixed(2)} style={{ background: color + "18", border: `1px solid ${color}40`, borderRadius: 20, padding: "4px 13px", fontFamily: "'Space Mono',monospace", fontSize: 15, fontWeight: 700, color, animation: "pop .3s ease" }}>
              {bac.toFixed(2)}‰
            </div>
          )}
          <UserMenu user={user} onLogout={handleLogout} onShowSession={() => setGroupModalOpen(true)} onShowLogin={() => { localStorage.removeItem('pt_guest_mode'); setUser(null); }} activeRoom={activeRoom} />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch", paddingBottom: 94 }}>
        {screen === "home" && (
          <div style={{ padding: "16px 16px 0", animation: "fadeUp .25s ease" }}>
            <div style={{ background: "linear-gradient(140deg,#0e1020,#141729)", border: `1px solid ${color}28`, borderRadius: 22, padding: "22px 22px 18px", marginBottom: 14, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -24, right: -24, width: 110, height: 110, borderRadius: "50%", background: color + "09", pointerEvents: "none" }} />
              <div key={bac.toFixed(3)} style={{ fontSize: 68, fontWeight: 700, fontFamily: "'Space Mono',monospace", color, lineHeight: 1, animation: "pop .3s ease" }}>
                {bac.toFixed(2)}<span style={{ fontSize: 24, color: color + "77" }}>‰</span>
              </div>
              {session.length > 0 && <>
                <div style={{ marginTop: 14, height: 5, borderRadius: 3, background: "#181c2c" }}>
                  <div style={{ height: "100%", width: `${Math.min(bac / 2.5 * 100, 100)}%`, background: color, borderRadius: 3, transition: "width .6s ease" }} />
                </div>
                <div style={{ marginTop: 10, fontSize: 13, color: "#555" }}>
                  Nüchtern ~<span style={{ color: "#bcc", fontWeight: 600 }}>{fmtTime(soberTime.getTime())} Uhr</span> · {(soberMins / 60).toFixed(1)}h
                </div>
              </>}
              {session.length === 0 && <div style={{ marginTop: 10, fontSize: 13, color: "#2a2f45" }}>Noch keine Getränke – starte die Session!</div>}
            </div>

            <div style={{ background: canDrive ? "#091810" : "#1a0c0c", border: `1px solid ${canDrive ? "#16a34a33" : "#f8717133"}`, borderRadius: 16, padding: "13px 16px", marginBottom: 14, display: "flex", gap: 12, alignItems: "center" }}>
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
                  <div style={{ fontSize: 10, color: "#555" }}>Legal ab</div>
                  <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, fontWeight: 700, color: "#f87171" }}>
                    {fmtTime(Date.now() + ((bac - effectiveLimit) / 0.15) * 3600000)}
                  </div>
                </div>
              )}
            </div>

            <div style={{ background: "#0e1020", border: "1px solid #171a2a", borderRadius: 16, padding: "13px 15px", marginBottom: 14, display: "flex", gap: 12 }}>
              <div style={{ fontSize: 18 }}>🤖</div>
              <div>
                <div style={{ fontSize: 9, color: "#333", textTransform: "uppercase", letterSpacing: 2, marginBottom: 3 }}>KI-Analyse</div>
                <div style={{ fontSize: 13, lineHeight: 1.6, color: "#6870a0" }}>{aiTip}</div>
              </div>
            </div>

            {session.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 9, marginBottom: 14 }}>
                {[{ icon: "🥤", val: session.length, label: "Getränke" }, { icon: "🔥", val: totalKcal + " kcal", label: "Kalorien" }, { icon: "🍽️", val: recentMeals.length > 0 ? `-${recentMeals.length >= 2 ? 35 : 20}% BAC` : "Nüchtern", label: "Essen-Effekt" }].map(s => (
                  <div key={s.label} style={{ background: "#0e1020", border: "1px solid #171a2a", borderRadius: 14, padding: "12px 10px", textAlign: "center" }}>
                    <div style={{ fontSize: 20 }}>{s.icon}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, marginTop: 4 }}>{s.val}</div>
                    <div style={{ fontSize: 9, color: "#333", marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            {session.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 9, color: "#333", textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>Nochmal?</div>
                <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
                  {[...new Map(session.map(x => [x.name, x])).values()].slice(-5).map(d => (
                    <div key={d.name} className="tap hov" onClick={() => addDrinkToSession(d, Date.now())}
                      style={{ flexShrink: 0, background: "#0e1020", border: "1px solid #171a2a", borderRadius: 13, padding: "10px 13px", textAlign: "center", minWidth: 76, position: "relative" }}>
                      <div className="tap" onClick={(e) => { e.stopPropagation(); setPendingDrink(d); setPendingTs(Date.now()); }}
                        style={{ position: "absolute", top: 5, right: 5, fontSize: 10, padding: 4, background: "#13151f", borderRadius: "50%", border: "1px solid #1e2132" }}>✏️</div>
                      <div style={{ fontSize: 22 }}>{d.icon}</div>
                      <div style={{ fontSize: 10, color: "#555", marginTop: 3, maxWidth: 68, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</div>
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
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "#444" }}>🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Getränk suchen…"
                style={{ ...inp, paddingLeft: 36, fontSize: 14 }} />
              {search && <span className="tap" onClick={() => setSearch("")} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#444", fontSize: 18 }}>×</span>}
            </div>
            <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 10 }}>
              {ALL_CATS.map(c => (
                <div key={c} className="tap" onClick={() => setCat(c)} style={{ flexShrink: 0, padding: "5px 13px", borderRadius: 20, fontSize: 11, fontWeight: 500, background: cat === c ? "#2563eb" : "#0e1020", border: `1px solid ${cat === c ? "#2563eb" : "#1d2030"}`, color: cat === c ? "#fff" : "#555" }}>{c}</div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 2px 10px" }}>
              <div style={{ fontSize: 10, color: "#333" }}>{filtered.length} Getränke</div>
              <div className="tap" onClick={() => setShowAdd(true)} style={{ fontSize: 11, color: "#3b82f6", fontWeight: 600 }}>＋ Neues Getränk</div>
            </div>
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px 0", color: "#333" }}>
                <div style={{ fontSize: 34 }}>🔍</div>
                <div style={{ marginTop: 10, fontSize: 13 }}>Nichts für „{search}"</div>
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
              {filtered.map(d => {
                const hit = hitBac(d, profile.weight, profile.gender);
                return (
                  <div key={d.id} className="hov" style={{ background: flashIds[d.id] ? "#112214" : "#0e1020", border: `1px solid ${flashIds[d.id] ? "#4ade8040" : "#171a2a"}`, borderRadius: 14, padding: 12, position: "relative", transition: "background .4s,border-color .4s" }}>
                    <div style={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 6 }}>
                      <div className="tap" onClick={(e) => { e.stopPropagation(); setPendingDrink(d); setPendingTs(Date.now()); }}
                        style={{ fontSize: 13, background: "#13151f", borderRadius: "50%", width: 24, height: 24, display: "grid", placeItems: "center", border: "1px solid #1e2132" }}>✏️</div>
                    </div>
                    <div className="tap" onClick={() => addDrinkToSession(d, Date.now())}>
                      <div style={{ fontSize: 26, marginBottom: 7 }}>{d.icon}</div>
                      <div style={{ fontWeight: 600, fontSize: 12, paddingRight: 30, lineHeight: 1.3 }}>{d.name}</div>
                      <div style={{ fontSize: 10, color: "#3a3f5a", marginTop: 3 }}>{d.vol * 1000}ml · {d.abv}%</div>
                      <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontSize: 12, fontFamily: "'Space Mono',monospace", fontWeight: 700, color: bacColor(hit) }}>+{hit.toFixed(2)}‰</div>
                        <div style={{ fontSize: 9, color: "#2a2e44" }}>{d.kcal} kcal</div>
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
              <div style={{ textAlign: "center", padding: "60px 0", color: "#2a2e44" }}>
                <div style={{ fontSize: 44 }}>🥤</div>
                <div style={{ marginTop: 14, fontSize: 14 }}>Noch keine Einträge</div>
                <div className="tap" onClick={() => setScreen("drinks")} style={{ display: "inline-block", marginTop: 18, padding: "10px 24px", background: "#2563eb", borderRadius: 20, fontSize: 13, fontWeight: 600, color: "#fff" }}>Getränk hinzufügen</div>
              </div>
            ) : <>
              <div style={{ background: "#0e1020", border: "1px solid #171a2a", borderRadius: 16, padding: 16, marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                  <div style={{ fontSize: 9, color: "#333", textTransform: "uppercase", letterSpacing: 2 }}>Live Promille</div>
                  <div key={bac.toFixed(3)} style={{ fontFamily: "'Space Mono',monospace", fontSize: 22, fontWeight: 700, color, animation: "pop .3s ease" }}>{bac.toFixed(2)}‰</div>
                </div>
                <div style={{ height: 5, borderRadius: 3, background: "#181c2c" }}>
                  <div style={{ height: "100%", width: `${Math.min(bac / 2.5 * 100, 100)}%`, background: color, borderRadius: 3, transition: "width .5s" }} />
                </div>
                <div style={{ marginTop: 8, fontSize: 11, color: "#444", display: "flex", justifyContent: "space-between" }}>
                  <span>Nüchtern ca. {fmtTime(soberTime.getTime())} Uhr</span>
                  <span style={{ color: canDrive ? "#4ade80" : "#f87171" }}>{canDrive ? "✅ Fahrbereit" : "🚫 Nicht fahren"}</span>
                </div>
              </div>

              <div className="tap" onClick={() => setShowAddMeal(true)}
                style={{ background: "#0a1410", border: "1px solid #16a34a33", borderRadius: 12, padding: "10px 14px", marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ fontSize: 18 }}>🍽️</div>
                <div style={{ fontSize: 12, color: "#2d6040" }}>Mahlzeit zur Session hinzufügen</div>
                <div style={{ marginLeft: "auto", fontSize: 18, color: "#16a34a33" }}>＋</div>
              </div>

              {timeline.map((item, i) => {
                if (item._type === "meal") {
                  const ageH = (Date.now() - item.ts) / 3600000;
                  const active = ageH < 3;
                  return (
                    <div key={item.id} style={{ display: "flex", alignItems: "flex-start", gap: 12, background: "#091410", border: `1px solid ${active ? "#16a34a33" : "#0f2018"}`, borderRadius: 13, padding: "11px 13px", marginBottom: 8, animation: `fadeUp .18s ease ${i * .02}s both`, opacity: active ? 1 : 0.5 }}>
                      <div style={{ fontSize: 22, marginTop: 1 }}>{item.type.split(" ")[0]}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <div style={{ fontWeight: 600, fontSize: 12, color: "#4ade80" }}>{item.type.split(" ").slice(1).join(" ")}</div>
                          {active && <div style={{ fontSize: 8, background: "#16a34a22", color: "#4ade80", borderRadius: 8, padding: "1px 6px", fontWeight: 600 }}>AKTIV</div>}
                        </div>
                        <div style={{ fontSize: 11, color: "#2d5030", marginTop: 2 }}>{item.desc}</div>
                        <div style={{ fontSize: 9, color: "#333", marginTop: 3 }}>{fmtTime(item.ts)} Uhr{active ? ` · noch ${(3 - ageH).toFixed(1)}h aktiv` : ""}</div>
                      </div>
                      <div className="tap" onClick={() => removeMeal(item.id)} style={{ color: "#1a2e1a", fontSize: 15, padding: 4 }}>×</div>
                    </div>
                  );
                }
                return (
                  <div key={item.sid} style={{ display: "flex", alignItems: "center", gap: 12, background: "#0e1020", border: "1px solid #171a2a", borderRadius: 13, padding: "11px 13px", marginBottom: 8, animation: `fadeUp .18s ease ${i * .02}s both` }}>
                    <div style={{ fontSize: 22 }}>{item.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{item.name}</div>
                      <div style={{ fontSize: 10, color: "#3a3f5a", marginTop: 2 }}>{fmtTime(item.ts)} · {item.vol * 1000}ml · {item.abv}%</div>
                    </div>
                    <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, fontWeight: 700, color: bacColor(hitBac(item, profile.weight, profile.gender)) }}>+{hitBac(item, profile.weight, profile.gender).toFixed(2)}‰</div>
                    <div className="tap" onClick={() => removeEntry(item.sid)} style={{ color: "#2a2e44", fontSize: 16, padding: 4 }}>×</div>
                  </div>
                );
              })}

              <div className="tap" onClick={() => { setSession([]); setMeals([]); setBac(0); setScreen("home"); if (user && activeRoom?.roomCode) { updateSessionData(activeRoom.roomCode, [], [], 0, 0); refreshLeaderboard(activeRoom.roomCode); } toast_("Session zurückgesetzt"); }}
                style={{ background: "#180c0c", border: "1px solid #f8717120", borderRadius: 12, padding: "12px", textAlign: "center", fontSize: 12, color: "#f87171", marginTop: 8 }}>
                🗑 Session & Mahlzeiten zurücksetzen
              </div>
              <div style={{ height: 16 }} />
            </>}
          </div>
        )}

        {screen === "food" && (
          <div style={{ padding: "16px 16px 0", animation: "fadeUp .25s ease" }}>
            <div style={{ background: "#0a1a0d", border: "1px solid #14532d44", borderRadius: 16, padding: "14px 16px", marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#4ade80", marginBottom: 6 }}>🍽️ Wie wirkt Essen auf den BAC?</div>
              <div style={{ fontSize: 12, color: "#2d6040", lineHeight: 1.7 }}>
                1 Mahlzeit in den letzten 3h → <span style={{ color: "#4ade80", fontWeight: 600 }}>−20% BAC</span><br />
                2+ Mahlzeiten → <span style={{ color: "#4ade80", fontWeight: 600 }}>−35% BAC</span><br />
                Fettreiches Essen verzögert Absorption am stärksten.
              </div>
            </div>
            <div style={{ background: "#0e1020", border: "1px solid #171a2a", borderRadius: 14, padding: "14px 16px", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 11, color: "#444", textTransform: "uppercase", letterSpacing: 1 }}>Aktueller Effekt</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: recentMeals.length > 0 ? "#4ade80" : "#555", marginTop: 4 }}>
                  {recentMeals.length === 0 ? "Kein Effekt" : recentMeals.length === 1 ? "−20% BAC" : "−35% BAC"}
                </div>
              </div>
              <div style={{ fontSize: 11, color: "#333" }}>{recentMeals.length} aktive Mahlzeit{recentMeals.length !== 1 ? "en" : ""}</div>
            </div>
            <div className="tap" onClick={() => setShowAddMeal(true)}
              style={{ background: "#0a1a0d", border: "1px solid #16a34a55", borderRadius: 14, padding: "14px 16px", marginBottom: 14, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 26 }}>＋</div>
              <div><div style={{ fontWeight: 600, fontSize: 14, color: "#4ade80" }}>Mahlzeit hinzufügen</div>
                <div style={{ fontSize: 11, color: "#2d5030", marginTop: 2 }}>Mit Zeitauswahl</div></div>
            </div>
            {meals.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: "#2a2e44" }}>
                <div style={{ fontSize: 44 }}>🍽️</div>
                <div style={{ marginTop: 14, fontSize: 14 }}>Noch keine Mahlzeiten</div>
              </div>
            ) : <>
              <div style={{ fontSize: 10, color: "#333", textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>Alle Mahlzeiten</div>
              {[...meals].reverse().map((m, i) => {
                const ageH = (Date.now() - m.ts) / 3600000;
                const active = ageH < 3;
                return (
                  <div key={m.id} style={{ display: "flex", alignItems: "flex-start", gap: 12, background: "#0e1020", border: `1px solid ${active ? "#16a34a33" : "#171a2a"}`, borderRadius: 13, padding: "12px 13px", marginBottom: 8, animation: `fadeUp .18s ease ${i * .03}s both` }}>
                    <div style={{ fontSize: 22, marginTop: 1 }}>{m.type.split(" ")[0]}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{m.type.split(" ").slice(1).join(" ")}</div>
                        {active && <div style={{ fontSize: 9, background: "#16a34a22", color: "#4ade80", borderRadius: 10, padding: "2px 7px", fontWeight: 600 }}>AKTIV</div>}
                      </div>
                      <div style={{ fontSize: 12, color: "#6870a0", marginTop: 3, lineHeight: 1.4 }}>{m.desc}</div>
                      <div style={{ fontSize: 10, color: "#333", marginTop: 4 }}>
                        {fmtTime(m.ts)} Uhr{active ? ` · noch ${(3 - ageH).toFixed(1)}h aktiv` : " · abgelaufen"}
                      </div>
                    </div>
                    <div className="tap" onClick={() => removeMeal(m.id)} style={{ color: "#2a2e44", fontSize: 16, padding: 4, marginTop: -2 }}>×</div>
                  </div>
                );
              })}
              <div className="tap" onClick={() => { setMeals([]); const nb = calcBac(session, profile.weight, profile.gender, []); setBac(nb); if (user && activeRoom?.roomCode) { updateSessionData(activeRoom.roomCode, session, [], nb, session.length); refreshLeaderboard(activeRoom.roomCode); } toast_("Mahlzeiten gelöscht"); }}
                style={{ background: "#180c0c", border: "1px solid #f8717120", borderRadius: 12, padding: "11px", textAlign: "center", fontSize: 12, color: "#f87171", marginTop: 8 }}>
                🗑 Alle Mahlzeiten löschen
              </div>
            </>}
            <div style={{ height: 16 }} />
          </div>
        )}

        {screen === "profile" && (
          <div style={{ padding: "16px 16px 0", animation: "fadeUp .25s ease" }}>
            <div style={{ background: "#0e1020", border: "1px solid #171a2a", borderRadius: 18, padding: 20, marginBottom: 14 }}>
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
                      <div><div style={{ fontSize: 10, color: "#444" }}>{r.label}</div><div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>{r.val}</div></div>
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
                        <div style={{ fontSize: 10, color: "#444", marginBottom: 6 }}>{f.label}</div>
                        <input type={f.type} value={tmpProf[f.key]} onChange={e => setTmpProf(p => ({ ...p, [f.key]: f.type === "number" ? +e.target.value : e.target.value }))} style={inp} />
                      </div>
                    ))}
                    <div>
                      <div style={{ fontSize: 10, color: "#444", marginBottom: 8 }}>Geschlecht</div>
                      <div style={{ display: "flex", gap: 10 }}>
                        {[["m", "Männlich"], ["f", "Weiblich"]].map(([v, l]) => (
                          <div key={v} className="tap" onClick={() => setTmpProf(p => ({ ...p, gender: v }))}
                            style={{ flex: 1, textAlign: "center", padding: "10px", borderRadius: 10, fontSize: 13, background: tmpProf.gender === v ? "#2563eb" : "#151826", border: `1px solid ${tmpProf.gender === v ? "#2563eb" : "#222638"}`, color: tmpProf.gender === v ? "#fff" : "#555" }}>{l}</div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: "#444", marginBottom: 8 }}>Land / Führerschein-Grenzwert</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, maxHeight: 180, overflowY: "auto", paddingRight: 2 }}>
                        {COUNTRIES.map(c => (
                          <div key={c.id} className="tap" onClick={() => setTmpProf(p => ({ ...p, country: c.id }))}
                            style={{
                              padding: "8px 10px", borderRadius: 10, fontSize: 12, display: "flex", alignItems: "center", gap: 8,
                              background: tmpProf.country === c.id ? "#1e2f5e" : "#0d0f17",
                              border: `1px solid ${tmpProf.country === c.id ? "#2563eb" : "#222638"}`,
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
                      style={{ background: tmpProf.novice ? "#1a1a0f" : "#0d0f17", border: `1px solid ${tmpProf.novice ? "#ca8a04" : "#222638"}`, borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ fontSize: 20 }}>🔰</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>Neulenker / Probezeit</div>
                        <div style={{ fontSize: 11, color: "#555", marginTop: 1 }}>0.0‰ Limit aktiv</div>
                      </div>
                      <div style={{ marginLeft: "auto", fontSize: 18 }}>{tmpProf.novice ? "✅" : "⬜"}</div>
                    </div>
                  </div>
                  <div className="tap" onClick={() => {
                    setProfile(tmpProf);
                    setEditProfile(false);
                    const nb = calcBac(session, tmpProf.weight, tmpProf.gender, meals);
                    setBac(nb);
                    if (user && activeRoom?.roomCode) {
                      window.supabaseClient.from('drinking_sessions').update({ display_name: tmpProf.display_name }).eq('room_code', activeRoom.roomCode).eq('user_id', user.id);
                    }
                    toast_("Profil gespeichert ✓");
                  }}
                    style={{ background: "#2563eb", borderRadius: 11, padding: "12px", textAlign: "center", fontWeight: 700, fontSize: 14, marginTop: 20 }}>Speichern</div>
                </Modal>
              )}
            </div>
            <div style={{ background: "#091410", border: "1px solid #0f3020", borderRadius: 14, padding: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#4ade80", marginBottom: 6 }}>ℹ️ Hinweis</div>
              <div style={{ fontSize: 11, color: "#2a5040", lineHeight: 1.7 }}>Berechnung nach Widmark-Formel – Schätzwert. Essen, Medikamente und Metabolismus beeinflussen den Pegel. Im Zweifel: Nicht fahren!</div>
            </div>
            <div style={{ height: 16 }} />
          </div>
        )}
      </div>

      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 440, background: "#0a0b10", borderTop: "1px solid #13151f", display: "grid", gridTemplateColumns: "repeat(5,1fr)", padding: "8px 0", zIndex: 60 }}>
        {[{ id: "home", icon: "🏠", label: "Home" }, { id: "drinks", icon: "🍺", label: "Getränke" }, { id: "session", icon: "📋", label: "Session", badge: session.length }, { id: "food", icon: "🍽️", label: "Essen", badge2: recentMeals.length || null }, { id: "profile", icon: country.flag, label: "Profil" }].map(tab => (
          <div key={tab.id} className="tap" onClick={() => setScreen(tab.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "5px 0", position: "relative" }}>
            {screen === tab.id && <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 20, height: 2, background: "#3b82f6", borderRadius: 2 }} />}
            <div style={{ fontSize: 18 }}>{tab.icon}</div>
            <div style={{ fontSize: 8, marginTop: 2, color: screen === tab.id ? "#3b82f6" : "#333", fontWeight: screen === tab.id ? 700 : 400 }}>{tab.label}</div>
            {tab.badge > 0 && <div style={{ position: "absolute", top: 3, right: "50%", transform: "translateX(10px)", background: "#3b82f6", borderRadius: "50%", width: 14, height: 14, fontSize: 8, display: "grid", placeItems: "center", fontWeight: 700 }}>{tab.badge}</div>}
            {tab.badge2 > 0 && <div style={{ position: "absolute", top: 3, right: "50%", transform: "translateX(10px)", background: "#16a34a", borderRadius: "50%", width: 14, height: 14, fontSize: 8, display: "grid", placeItems: "center", fontWeight: 700 }}>{tab.badge2}</div>}
          </div>
        ))}
      </div>
    </div>
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
