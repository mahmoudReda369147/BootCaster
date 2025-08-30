import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPBASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPBASE_API_KEY;
console.log(supabaseUrl, supabaseAnonKey);

// التحقق من وجود المتغيرات المطلوبة
if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("⚠️ Supabase environment variables are missing!");
    console.warn(
        "Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file"
    );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
