// التحقق من أننا في بيئة server-side
let adminAuth = null;
import AppError from "../utils/appError";
if (typeof window === "undefined") {
    try {
        // نحن في server-side
        const { initializeApp, getApps, cert } = require("firebase-admin/app");
        const { getAuth } = require("firebase-admin/auth");

        // التحقق من وجود المتغيرات البيئية المطلوبة
        const projectId = process.env.NEXT_PUBLIC_FIREBASE_ID;
        const clientEmail = process.env.NEXT_PUBLIC_FIREASE_CLINT_EMAIL;
        const privateKey = process.env.NEXT_PUBLIC_FIREASE_ADMIN;
        console.log(projectId, clientEmail, privateKey);
        if (!projectId || !clientEmail || !privateKey) {
            throw new AppError(
                "Missing Firebase Admin environment variables",
                400,
                "fail"
            );
            // لا نرمي خطأ هنا، فقط نترك adminAuth كـ null
        } else {
            // تكوين Firebase Admin SDK
            const firebaseAdminConfig = {
                projectId: projectId,
                clientEmail: clientEmail,
                privateKey: privateKey.replace(/\\n/g, "\n"),
            };

            // تهيئة Firebase Admin SDK إذا لم يكن مثبتاً بالفعل
            let adminApp;
            if (!getApps().length) {
                adminApp = initializeApp({
                    credential: cert(firebaseAdminConfig),
                    projectId: projectId,
                });
            } else {
                adminApp = getApps()[0];
            }

            // تصدير admin auth
            adminAuth = getAuth(adminApp);
        }
    } catch (error) {
        throw new AppError(error.message, 400, "fail");
        // لا نرمي خطأ هنا، فقط نترك adminAuth كـ null
    }
}

export { adminAuth };
