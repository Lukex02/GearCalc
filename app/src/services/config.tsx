import Constants from "expo-constants";
import { createClient, User } from "@supabase/supabase-js";

const supabaseUrl = "https://odrfusjgbctkybkavelg.supabase.co";
// const supabaseKey = Constants.expoConfig?.extra?.supabaseAnonKey;
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kcmZ1c2pnYmN0a3lia2F2ZWxnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Njk0NTM0MiwiZXhwIjoyMDYyNTIxMzQyfQ.QFghw7GsfiIH68YKD5laFt7UabVxBwbhMihbHZPx5V0";
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export default supabase;
