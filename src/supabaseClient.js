import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://pcjkmbfyxebgsdxorbiy.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjamttYmZ5eGViZ3NkeG9yYml5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNjQ5MTksImV4cCI6MjA3NjY0MDkxOX0.rzcGnBItMwooFDCI44ICWCIRxeABnfolaFWaMUhnA0c"

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
