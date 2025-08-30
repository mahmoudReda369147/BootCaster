import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPBASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPBASE_API_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
