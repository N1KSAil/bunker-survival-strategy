import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dmzbxgoqncqiaowukbah.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtemJ4Z29xbmNxaWFvd3VrYmFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDYyNjc1MzAsImV4cCI6MjAyMTg0MzUzMH0.SbUPsID5zqOVcNWrRDGxjEbvJJBGo0uNI4_3KFxvQJE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);