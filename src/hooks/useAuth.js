import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Cookies from "js-cookie";
export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                // حفظ بيانات المستخدم في الكوكيز
                Cookies.set("userData", JSON.stringify(user));
                Cookies.set("isLoggedIn", "true");
            } else {
                setUser(null);
                // حذف بيانات المستخدم من الكوكيز
                Cookies.remove("userData");
                Cookies.remove("isLoggedIn");
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const isLoggedIn = !!user;

    return { user, isLoggedIn, loading };
};
