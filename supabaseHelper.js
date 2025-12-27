import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ✅ Embedded credentials (as requested)
const SUPABASE_URL = "https://hrpxfnrizypnqwsiasqw.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhydHhmbnJpenlwbnF3c2lhc3F3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwMDY1MjUsImV4cCI6MjA3NDU4MjUyNX0.4btbG22BF7WWtCvq1Du7Bo0aLcKHZIUV4MBwPQW53eY";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
