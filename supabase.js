// ═══ SUPABASE CONFIG ═══
const SUPABASE_URL = 'https://teqoajmnqrdantvrbcgs.supabase.co';
const SUPABASE_KEY = 'sb_publishable__rl4Ft5kUTrS2dTNFsg2Lw_qpuIPvMY'; // ← Project Settings → API → anon/public

const script = document.createElement('script');
script.src = 'https://unpkg.com/@supabase/supabase-js@2';
script.onload = () => {
  window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  console.log('✅ Supabase ready');
};
document.head.appendChild(script);

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
async function createSession(roomName) {
  const user = await getUser();
  if (!user) return { error: 'Not logged in' };
  
  const roomCode = Math.floor(1000 + Math.random() * 9000).toString();
  
  const { data, error } = await window.supabaseClient
    .from('drinking_sessions')
    .insert({
      user_id: user.id,
      room_name: roomName,
      room_code: roomCode,
      drinks: [],
      meals: [],
      is_host: true,
      display_name: user.user_metadata?.name || 'Gast',
      current_bac: 0,
      drink_count: 0,
      created_at: new Date().toISOString()
    })
    .select()
    .single();
  
  return { data, error };
}

async function joinSession(roomCode) {
  const user = await getUser();
  if (!user) return { error: 'Not logged in' };
  
  // Prüfe ob Session existiert
  const { data: existingSession, error: findError } = await window.supabaseClient
    .from('drinking_sessions')
    .select('*')
    .eq('room_code', roomCode)
    .single();
  
  if (findError || !existingSession) return { error: 'Session nicht gefunden' };
  
  // Erstelle eigene Session-Eintrag für diesen User im selben Raum
  const { data, error } = await window.supabaseClient
    .from('drinking_sessions')
    .insert({
      user_id: user.id,
      room_name: existingSession.room_name,
      room_code: roomCode,
      drinks: [],
      meals: [],
      is_host: false,
      display_name: user.user_metadata?.name || 'Gast',
      current_bac: 0,
      drink_count: 0,
      created_at: new Date().toISOString()
    })
    .select()
    .single();
  
  return { data, error };
}

async function updateSessionData(roomCode, sessionData, mealsData, bac, drinkCount) {
  const user = await getUser();
  if (!user) return { error: 'Not logged in' };
  
  const { error } = await window.supabaseClient
    .from('drinking_sessions')
    .update({
      drinks: sessionData,
      meals: mealsData || [],
      current_bac: bac,
      drink_count: drinkCount,
      updated_at: new Date().toISOString()
    })
    .eq('room_code', roomCode)
    .eq('user_id', user.id);
  
  return { error };
}

async function getSessionLeaderboard(roomCode) {
  const { data, error } = await window.supabaseClient
    .from('drinking_sessions')
    .select('user_id, display_name, current_bac, drink_count, is_host')
    .eq('room_code', roomCode)
    .order('current_bac', { ascending: false });
  
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
