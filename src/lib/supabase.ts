import { createClient } from "@supabase/supabase-js";

// Use placeholder values when environment variables are not available
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://placeholder-project.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "placeholder-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
