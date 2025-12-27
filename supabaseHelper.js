import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const url = window.SUPABASE_URL;
const anon = window.SUPABASE_ANON_KEY;

if (!url || !anon) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY");
}

export const supabase = createClient(url, anon);
