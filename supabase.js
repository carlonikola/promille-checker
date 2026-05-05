// ═══ SUPABASE CONFIG ═══
const SUPABASE_URL = 'https://teqoajmnqrdantvrbcgs.supabase.co';
const SUPABASE_KEY = 'sb_publishable__rl4Ft5kUTrS2dTNFsg2Lw_qpuIPvMY'; // ← Project Settings → API → anon/public

// Supabase wird synchron über index.html geladen – direkt initialisieren
if (typeof supabase === 'undefined') {
  console.error('❌ Supabase-Script nicht geladen! CDN erreichbar?');
} else {
  window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  console.log('✅ Supabase ready', window.supabaseClient);
}

// ═══ AUTH FUNCTIONS ═══
async function signUp(email, password, name) {
  const { data, error } = await window.supabaseClient.auth.signUp({
    email,
    password,
    options: { data: { name } }
  });
  return { data, error };
}

async function signIn(email, password) {
  const { data, error } = await window.supabaseClient.auth.signInWithPassword({ email, password });
  return { data, error };
}

async function signOut() {
  const { error } = await window.supabaseClient.auth.signOut();
  localStorage.removeItem('pt_guest_mode');
  return { error };
}

async function getSession() {
  const { data: { session } } = await window.supabaseClient.auth.getSession();
  return session;
}

async function getUser() {
  const { data: { user } } = await window.supabaseClient.auth.getUser();
  return user;
}

// ═══ PROFILE FUNCTIONS ═══
async function saveProfileToCloud(profile) {
  const user = await getUser();
  if (!user) return { error: 'Not logged in' };

  const { error } = await window.supabaseClient
    .from('profiles')
    .upsert({
      id: user.id,
      name: profile.name,
      display_name: profile.display_name || profile.name,
      weight: profile.weight,
      gender: profile.gender,
      country: profile.country,
      novice: profile.novice,
      updated_at: new Date().toISOString()
    });
  return { error };
}

async function loadProfileFromCloud() {
  const user = await getUser();
  if (!user) return { data: null, error: 'Not logged in' };

  const { data, error } = await window.supabaseClient
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  return { data, error };
}

// ═══ SESSION FUNCTIONS ═══
async function createSession(roomName, displayName, initialDrinks = [], initialMeals = [], initialBac = 0, initialGrams = 0) {
  const user = await getUser();
  const sync_id = user ? user.id : getSyncId();
  const roomCode = Math.floor(1000 + Math.random() * 9000).toString();

  const payload = {
    room_name: roomName,
    room_code: roomCode,
    sync_id: sync_id,
    drinks: initialDrinks,
    meals: initialMeals,
    is_host: true,
    display_name: displayName || (user ? user.user_metadata?.name : 'Gast'),
    current_bac: initialBac,
    total_alcohol_grams: initialGrams,
    drink_count: initialDrinks.length,
    created_at: new Date().toISOString()
  };

  if (user) payload.user_id = user.id;

  console.log('📡 Creating session with payload:', payload);

  const { data, error } = await window.supabaseClient
    .from('drinking_sessions')
    .upsert(payload, { onConflict: 'room_code, sync_id' })
    .select()
    .single();

  return { data, error };
}

async function joinSession(roomCode, displayName, initialDrinks = [], initialMeals = [], initialBac = 0, initialGrams = 0) {
  const user = await getUser();
  const sync_id = user ? user.id : getSyncId();

  // 1. Raum-Validierung: Prüfe ob der Raum existiert (Suche nach Host oder beliebigem Teilnehmer)
  const { data: rooms, error: findError } = await window.supabaseClient
    .from('drinking_sessions')
    .select('room_name')
    .eq('room_code', roomCode)
    .limit(1);

  if (findError || !rooms || rooms.length === 0) {
    console.error('❌ Raum nicht gefunden oder Fehler:', findError || 'Keine Daten');
    return { error: { message: 'Raum nicht gefunden' } };
  }

  const roomName = rooms[0].room_name;

  // 2. Daten-Mitnahme: Das Ziel-Objekt für den upsert
  // MUSS room_code UND sync_id enthalten, damit jeder User eine eigene Zeile bekommt.
  const payload = {
    room_code: roomCode, // Der eingegebene Code
    sync_id: sync_id,    // Die eindeutige ID des Users
    display_name: displayName || (user ? user.user_metadata?.name : 'Gast'),
    current_bac: initialBac,
    total_alcohol_grams: initialGrams,
    is_host: false,      // Wichtig: Teilnehmer, kein Host!
    room_name: roomName,
    drinks: initialDrinks,
    meals: initialMeals,
    drink_count: initialDrinks.length,
    created_at: new Date().toISOString()
  };

  if (user) payload.user_id = user.id;

  console.log('📡 Beitreten via Upsert:', payload);

  const { data, error } = await window.supabaseClient
    .from('drinking_sessions')
    .upsert(payload, { onConflict: 'room_code, sync_id' })
    .select()
    .single();

  // 3. Fehler-Logging
  if (error) {
    console.error('❌ Supabase Join Fehler (RLS oder Schema prüfen):', error);
  }

  return { data, error };
}

function getSyncId() {
  const local = localStorage.getItem('pt_sync_id');
  if (local) return local;
  const newId = 's_' + Math.random().toString(36).slice(2, 11) + '_' + Date.now().toString(36);
  localStorage.setItem('pt_sync_id', newId);
  return newId;
}

async function updateSessionData(roomCode, sessionData, mealsData, bac, totalGrams, drinkCount, displayName) {
  const user = await getUser();

  const payload = {
    room_code: roomCode,
    sync_id: user ? user.id : getSyncId(),
    drinks: sessionData,
    meals: mealsData || [],
    current_bac: bac,
    total_alcohol_grams: totalGrams || 0,
    drink_count: drinkCount,
    updated_at: new Date().toISOString(),
    display_name: displayName || (user ? user.user_metadata?.name : "Gast")
  };

  if (user) payload.user_id = user.id;

  console.log('📡 Syncing to Supabase:', payload);

  const { error } = await window.supabaseClient
    .from('drinking_sessions')
    .upsert(payload, { onConflict: 'room_code, sync_id' });

  return { error };
}

async function getSessionLeaderboard(roomCode) {
  const { data, error } = await window.supabaseClient
    .from('drinking_sessions')
    .select('sync_id, user_id, display_name, current_bac, total_alcohol_grams, drink_count, is_host, drinks')
    .eq('room_code', roomCode);

  return { data, error };
}

async function leaveSession(roomCode) {
  const user = await getUser();
  if (!user) return { error: 'Not logged in' };

  const { error } = await window.supabaseClient
    .from('drinking_sessions')
    .delete()
    .eq('room_code', roomCode)
    .eq('user_id', user.id);

  return { error };
}

// ═══ REALTIME SUBSCRIPTION ═══
function subscribeToSession(roomCode, callback) {
  return window.supabaseClient
    .channel(`session_${roomCode}`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'drinking_sessions',
      filter: `room_code=eq.${roomCode}`
    }, (payload) => {
      callback(payload);
    })
    .subscribe();
}
