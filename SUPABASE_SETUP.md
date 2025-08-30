# إعداد Supabase

## 1. إنشاء ملف .env.local

أنشئ ملف `.env.local` في مجلد المشروع الرئيسي وأضف المتغيرات التالية:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 2. الحصول على المتغيرات من Supabase

1. اذهب إلى [supabase.com](https://supabase.com)
2. اختر مشروعك أو أنشئ مشروع جديد
3. اذهب إلى Settings > API
4. انسخ:
    - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
    - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 3. اختبار الاتصال

يمكنك اختبار الاتصال في أي صفحة:

```javascript
import { testConnection } from "@/lib/supabase";

// في useEffect
useEffect(() => {
    testConnection();
}, []);
```

## 4. مثال على الاستخدام

```javascript
import { supabase } from "@/lib/supabase";

// جلب البيانات
const { data, error } = await supabase.from("voices").select("*");

// إضافة بيانات
const { data, error } = await supabase
    .from("voices")
    .insert([{ name: "New Voice", description: "Test" }]);

// تحديث بيانات
const { data, error } = await supabase
    .from("voices")
    .update({ description: "Updated" })
    .eq("id", "voice_id");

// حذف بيانات
const { data, error } = await supabase
    .from("voices")
    .delete()
    .eq("id", "voice_id");
```

## 5. التعامل مع الملفات

```javascript
// رفع ملف
const { data, error } = await supabase.storage
    .from("voices")
    .upload("file.wav", file);

// تحميل ملف
const { data } = supabase.storage.from("voices").getPublicUrl("file.wav");
```

## ملاحظات مهمة

-   تأكد من إعادة تشغيل الخادم بعد إضافة `.env.local`
-   استخدم `NEXT_PUBLIC_` للمتغيرات التي تحتاجها في المتصفح
-   تحقق من Console للرسائل التحذيرية
