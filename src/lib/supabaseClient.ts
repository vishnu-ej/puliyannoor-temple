import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bcnoxycqqycoagfcvtou.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjbm94eWNxcXljb2FnZmN2dG91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxMDE3OTYsImV4cCI6MjEwMzY3Nzc5Nn0.Ob7A7Br5nl-rcFsiCWwjdcKGlYMQjDumwpJqQcQ79OM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
