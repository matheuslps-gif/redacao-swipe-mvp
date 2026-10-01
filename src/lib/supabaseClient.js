import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Normalização inteligente da URL do Supabase
function getNormalizedSupabaseUrl(url, key) {
  if (url && (url.startsWith('https://') || url.startsWith('http://'))) {
    return url;
  }
  // Se for token JWT do Supabase, extrai a referência do projeto (ex: kstsbkrcrucwbseimlxs)
  try {
    if (key && key.includes('.')) {
      const parts = key.split('.');
      if (parts[1]) {
        const payload = JSON.parse(atob(parts[1]));
        if (payload.ref) {
          return `https://${payload.ref}.supabase.co`;
        }
      }
    }
  } catch (_e) {
    // ignore decoding errors
  }
  return url || 'https://kstsbkrcrucwbseimlxs.supabase.co';
}

const supabaseUrl = getNormalizedSupabaseUrl(rawUrl, rawAnonKey);
const supabaseAnonKey = rawAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy';

export const isSupabaseConfigured = () => {
  return Boolean(
    rawAnonKey &&
    !rawAnonKey.includes('dummy') &&
    supabaseUrl &&
    !supabaseUrl.includes('xyzcompany')
  );
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
  },
});
