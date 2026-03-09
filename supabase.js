// ═══ SUPABASE CONFIG ═══
// HIER DEINE DATEN EINFÜGEN:
const SUPABASE_URL = 'https://teqoajmnqrdantvrbcgs.supabase.co';
const SUPABASE_KEY = 'sb_publishable__rl4Ft5kUTrS2dTNFsg2Lw_qpuIPvMY'; // ← Project Settings → API → anon/public

// Supabase CDN laden
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
  const { data, error } = await window.supabaseClient.auth.signInWithPassword({
    email,
    password
  });
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

// ═══ DATABASE FUNCTIONS ═══
async function saveProfileToCloud(profile) {
  const user = await getUser();
  if (!user) return { error: 'Not logged in' };
  
  const { error } = await window.supabaseClient
    .from('profiles')
    .upsert({ 
      id: user.id,
      name: profile.name,
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

async function saveSessionToCloud(sessionData, mealsData) {
  const user = await getUser();
  if (!user) return { error: 'Not logged in' };
  
  const { error } = await window.supabaseClient
    .from('drinking_sessions')
    .insert({
      user_id: user.id,
      drinks: sessionData,
      meals: mealsData || [],
      created_at: new Date().toISOString()
    });
  return { error };
}

async function getSessionHistory() {
  const user = await getUser();
  if (!user) return { data: [], error: 'Not logged in' };
  
  const { data, error } = await window.supabaseClient
    .from('drinking_sessions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  return { data, error };
}
