import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "http://localhost:54321";
const SUPABASE_ANON_KEY = "sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Supabase env variables are not set');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
