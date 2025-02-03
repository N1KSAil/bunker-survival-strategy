import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dmzbxgoqncqiaowukbah.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtemJ4Z29xbmNxaWFvd3VrYmFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4Nzk2ODgsImV4cCI6MjA1MzQ1NTY4OH0.NAYettxg55P61alDFTXXqOu_1bPHWxOeD1wMb2-TOLM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});