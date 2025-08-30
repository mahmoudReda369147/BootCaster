"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

// مكون لحماية الصفحات التي تتطلب تسجيل دخول
export const ProtectedRoute = ({ children }) => {
    const { isLoggedIn, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isLoggedIn) {
            router.push("/login");
        }
    }, [isLoggedIn, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!isLoggedIn) {
        return null;
    }

    return children;
};

// مكون لحماية الصفحات من المستخدمين المسجلين (مثل صفحة تسجيل الدخول والتسجيل)
export const PublicRoute = ({ children }) => {
    const { isLoggedIn, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && isLoggedIn) {
            router.push("/");
        }
    }, [isLoggedIn, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (isLoggedIn) {
        return null;
    }

    return children;
};
