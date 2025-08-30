// هذا الملف للاستخدام في الباك اند فقط (API routes)
import { adminAuth } from "./firebase-admin";
import AppError from "../utils/appError";

// دالة للتحقق من صحة Firebase token في الباك اند
export const verifyFirebaseToken = async (idToken) => {
    // التحقق من وجود Firebase Admin SDK
    if (!adminAuth) {
        throw new AppError("Firebase Admin SDK not initialized", 400, "fail");
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    return {
        isValid: true,
        uid: decodedToken.uid,
        email: decodedToken.email,
        user: decodedToken,
    };
};

// دالة للتحقق من UID مباشرة
export const verifyUserByUid = async (uid) => {
    if (!adminAuth) {
        throw new AppError("Firebase Admin SDK not initialized", 400, "fail");
    }

    const userRecord = await adminAuth.getUser(uid);
    return {
        isValid: true,
        uid: userRecord.uid,
        email: userRecord.email,
        user: userRecord,
    };
};
