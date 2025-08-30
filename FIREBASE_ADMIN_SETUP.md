# إعداد Firebase Admin SDK

## الخطوات المطلوبة:

### 1. الحصول على Service Account Key

1. اذهب إلى [Firebase Console](https://console.firebase.google.com/)
2. اختر مشروعك
3. اذهب إلى **Project Settings** (إعدادات المشروع)
4. اختر تبويب **Service Accounts**
5. اضغط على **Generate New Private Key**
6. احفظ الملف JSON

### 2. إضافة متغيرات البيئة

أنشئ ملف `.env.local` في مجلد المشروع وأضف المتغيرات التالية:

```env
# Firebase Admin SDK Configuration
NEXT_PUBLIC_FIREASE_CLINT_EMAILL=your-service-account-email@your-project.iam.gserviceaccount.com
NEXT_PUBLIC_FIREASE_ADMIN="-----BEGIN PRIVATE KEY-----\nYour Private Key Here\n-----END PRIVATE KEY-----\n"

# Firebase Client Configuration (موجود بالفعل)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_ID=your-project-id
NEXT_PUBLIC_FIREBASE_MESSAGE_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 3. كيفية الحصول على القيم:

#### NEXT_PUBLIC_FIREASE_CLINT_EMAILL

-   موجود في ملف JSON الذي حصلت عليه من Service Account
-   يبدو مثل: `firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com`

#### NEXT_PUBLIC_FIREASE_ADMIN

-   موجود في ملف JSON تحت مفتاح `private_key`
-   يجب نسخه بالكامل مع `-----BEGIN PRIVATE KEY-----` و `-----END PRIVATE KEY-----`

### 4. اختبار التحقق من صحة المستخدم

الآن يمكنك استخدام الكود التالي في أي API route:

```javascript
import { verifyFirebaseToken } from "@/lib/server-auth";

export const POST = async (request) => {
    try {
        // الحصول على token من header
        const authHeader = request.headers.get("authorization");
        const token = authHeader.split(" ")[1];

        // التحقق من صحة token
        const decodedToken = await verifyFirebaseToken(token);

        if (!decodedToken.isValid) {
            return new Response(JSON.stringify({ error: "Invalid token" }), {
                status: 401,
            });
        }

        // الآن يمكنك الوصول إلى معلومات المستخدم
        const userUid = decodedToken.uid;
        const userEmail = decodedToken.email;

        // باقي الكود...
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
        });
    }
};
```

### 5. من Frontend

في Frontend، أرسل token مع كل request:

```javascript
// الحصول على token من Firebase Auth
const token = await auth.currentUser.getIdToken();

// إرسال request مع token
const response = await fetch("/api/compile", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
});
```

## ملاحظات مهمة:

-   لا تشارك ملف Service Account Key مع أي شخص
-   لا ترفعه إلى Git
-   استخدم متغيرات البيئة دائماً
-   تأكد من أن Firebase Admin SDK مثبت: `npm install firebase-admin`
