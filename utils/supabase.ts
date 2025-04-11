import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bojsdyqeykaldxxkuomp.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvanNkeXFleWthbGR4eGt1b21wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkyNDg4NTAsImV4cCI6MjA0NDgyNDg1MH0.npiGWSm8aKSzALz5FA7qKgVVk9Rgih9sw8s-Im0YFiU";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
