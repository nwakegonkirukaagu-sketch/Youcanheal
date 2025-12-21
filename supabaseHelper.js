// supabaseHelper.js
// Small helper to give you a Supabase client on the front-end.
// It reuses the globals from index.html: window.SUPABASE_URL + window.SUPABASE_ANON_KEY

let cachedSupabase = null;

export async function ensureSupabase() {
  if (cachedSupabase) return cachedSupabase;

  const url = window.SUPABASE_URL;
  const key = window.SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.warn('Supabase URL or key missing from window.SUPABASE_URL / window.SUPABASE_ANON_KEY');
    return null;
  }

  // Try different patterns from the CDN script
  if (window.supabase && typeof window.supabase.createClient === 'function') {
    cachedSupabase = window.supabase.createClient(url, key);
    console.log('✅ Supabase initialised via window.supabase');
    return cachedSupabase;
  }

  if (typeof window.createClient === 'function') {
    cachedSupabase = window.createClient(url, key);
    console.log('✅ Supabase initialised via window.createClient');
    return cachedSupabase;
  }

  console.warn('❌ Supabase client not found on window. Is the CDN script loaded in index.html?');
  return null;
}

// Example: save a mood for the logged-in user
export async function saveMoodToSupabase(mood) {
  const sb = await ensureSupabase();
  if (!sb) return false;

  try {
    const { data, error } = await sb
      .from('moods')
      .insert([{ mood, created_at: new Date().toISOString() }]);

    if (error) {
      console.error('Error saving mood:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Exception saving mood:', err);
    return false;
  }
}

// Example: get recent moods
export async function loadServerMoodHistory(limit = 10) {
  const sb = await ensureSupabase();
  if (!sb) return [];

  try {
    const { data, error } = await sb
      .from('moods')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error loading moods:', error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('Exception loading moods:', err);
    return [];
  }
}
