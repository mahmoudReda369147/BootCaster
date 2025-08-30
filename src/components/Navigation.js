"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { signOutUser } from "@/lib/loginFunc";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

export default function Navigation() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [userPlan, setUserPlan] = useState(null);
    const { theme, toggleTheme } = useTheme();
    const { isLoggedIn, user } = useAuth();
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await signOutUser();
            toast.success("logged out successfully"); 
            router.push("/");
        } catch (error) {
            toast.error("error in logging out");
        }
    };

    // Function to get plan display name and color
    const getPlanInfo = (plan) => {
        switch (plan) {
            case 'start':
                return {
                    name: 'Start',
                    color: 'from-green-500 to-green-600',
                    bgColor: 'from-green-50 to-green-100',
                    textColor: 'text-green-700',
                    borderColor: 'border-green-200',
                    icon: (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                        </svg>
                    )
                };
            case 'pro':
                return {
                    name: 'Pro',
                    color: 'from-blue-500 to-blue-600',
                    bgColor: 'from-blue-50 to-blue-100',
                    textColor: 'text-blue-700',
                    borderColor: 'border-blue-200',
                    icon: (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L15.09 8.26L22 9L15.09 9.74L12 16L8.91 9.74L2 9L8.91 8.26L12 2Z"/>
                        </svg>
                    )
                };
            case 'enterprise':
                return {
                    name: 'Enterprise',
                    color: 'from-purple-500 to-purple-600',
                    bgColor: 'from-purple-50 to-purple-100',
                    textColor: 'text-purple-700',
                    borderColor: 'border-purple-200',
                    icon: (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L16.09 8.26L24 9L16.09 9.74L12 16L7.91 9.74L0 9L7.91 8.26L12 2Z"/>
                        </svg>
                    )
                };
            default:
                return {
                    name: 'Free',
                    color: 'from-gray-500 to-gray-600',
                    bgColor: 'from-gray-50 to-gray-100',
                    textColor: 'text-gray-700',
                    borderColor: 'border-gray-200',
                    icon: (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                        </svg>
                    )
                };
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        const handleClickOutside = (event) => {
            if (isUserMenuOpen && !event.target.closest(".user-menu")) {
                setIsUserMenuOpen(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        document.addEventListener("click", handleClickOutside);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            document.removeEventListener("click", handleClickOutside);
        };
    }, [isUserMenuOpen]);

    useEffect(() => {
        const getPlanData = async () => {
            try {
                const userData = Cookies.get("userData");
                if (userData) {
                    const { email } = JSON.parse(userData);
                    const planData = await fetch(`/api/newUser?email=${email}`, {
                        method: "GET",
                    });
                    const planDataResponse = await planData.json();
                    console.log("planDataResponse", planDataResponse);
                    setUserPlan(planDataResponse);
                }
            } catch (error) {
                console.error("Error fetching plan data:", error);
            }
        };
        
        if (isLoggedIn) {
            getPlanData();
        }
    }, [isLoggedIn]);

    // Global function to refresh plan data - can be called from other components
    const refreshPlanData = async () => {
        try {
            const userData = Cookies.get("userData");
            if (userData) {
                const { email } = JSON.parse(userData);
                const planData = await fetch(`/api/newUser?email=${email}`, {
                    method: "GET",
                });
                const planDataResponse = await planData.json();
                console.log("Refreshed planDataResponse", planDataResponse);
                setUserPlan(planDataResponse);
                return planDataResponse;
            }
        } catch (error) {
            console.error("Error refreshing plan data:", error);
        }
    };

    // Expose the refresh function globally so other components can call it
    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.refreshUserPlan = refreshPlanData;
        }
        
        return () => {
            if (typeof window !== 'undefined') {
                delete window.refreshUserPlan;
            }
        };
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled
                    ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-gray-700"
                    : "bg-transparent"
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center space-x-3 text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                    >
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-sm">
                                BC
                            </span>
                        </div>
                        <span className="text-2xl">BootCaster</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center justify-between flex-1 ml-12">
                        {/* Navigation Links */}
                        <div className="flex items-center space-x-10">
                            <Link
                                href="/"
                                className="relative text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 font-medium group text-lg"
                            >
                                <span className="relative z-10">Home</span>
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                            <Link
                                href="/explore"
                                className="relative text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 font-medium group text-lg"
                            >
                                <span className="relative z-10">Explore</span>
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                            {isLoggedIn && (
                                <Link
                                    href="/demo"
                                    className="relative text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 font-medium group text-lg"
                                >
                                    <span className="relative z-10">Demo</span>
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                            )}
                            {isLoggedIn && (
                                <Link
                                    href="/dashboard"
                                    className="relative text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 font-medium group text-lg"
                                >
                                    <span className="relative z-10">
                                        Dashboard
                                    </span>
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                            )}
                        </div>

                        {/* Right Side - Auth & Theme */}
                        <div className="flex items-center space-x-6">
                            {isLoggedIn ? (
                                <div className="relative user-menu">
                                    {/* User Profile Section - Clickable */}
                                    <button
                                        onClick={() =>
                                            setIsUserMenuOpen(!isUserMenuOpen)
                                        }
                                        className="flex items-center space-x-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-6 py-3 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl group"
                                    >
                                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center ring-2 ring-white dark:ring-gray-800 shadow-md group-hover:ring-blue-200 dark:group-hover:ring-blue-800 transition-all duration-300">
                                            {user?.photoURL ? (
                                                <img
                                                    src={user.photoURL}
                                                    alt="صورة المستخدم"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <svg
                                                    className="w-7 h-7 text-white"
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                                </svg>
                                            )}
                                        </div>
                                        <div className="flex flex-col items-start">
                                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                                {user?.displayName ||
                                                    user?.email?.split(
                                                        "@"
                                                    )[0] ||
                                                    "user"}
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {user?.email || "user"}
                                            </span>
                                            {/* {userPlan && (
                                                <div className="flex items-center space-x-3 mt-2">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getPlanInfo(userPlan.plan).bgColor} ${getPlanInfo(userPlan.plan).textColor} ${getPlanInfo(userPlan.plan).borderColor} border shadow-sm`}>
                                                        {getPlanInfo(userPlan.plan).name}
                                                    </span>
                                                    <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                                                        {userPlan.NumberOfBootCastesIsUsed}/{userPlan.botcastPlanNumber} BootCasts
                                                    </span>
                                                </div>
                                            )} */}
                                        </div>
                                        <svg
                                            className={`w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 transition-all duration-200 ${
                                                isUserMenuOpen
                                                    ? "rotate-180"
                                                    : ""
                                            }`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isUserMenuOpen && (
                                        <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 py-4 z-50">
                                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                                <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                                    {user?.displayName ||
                                                        user?.email?.split(
                                                            "@"
                                                        )[0] ||
                                                        "user"}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                                    {user?.email || "user"}
                                                </div>
                                                {userPlan && (
                                                    <div className="space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">Current Plan:</span>
                                                            <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r ${getPlanInfo(userPlan.plan).bgColor} ${getPlanInfo(userPlan.plan).textColor} ${getPlanInfo(userPlan.plan).borderColor} border shadow-sm`}>
                                                                {getPlanInfo(userPlan.plan).icon}
                                                                <span>{getPlanInfo(userPlan.plan).name}</span>
                                                            </span>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">BootCasts Usage:</span>
                                                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                                                    {userPlan.NumberOfBootCastesIsUsed}/{userPlan.botcastPlanNumber}
                                                                </span>
                                                            </div>
                                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                                <div 
                                                                    className={`h-2 rounded-full bg-gradient-to-r ${getPlanInfo(userPlan.plan).color} shadow-sm`}
                                                                    style={{ 
                                                                        width: `${Math.min((userPlan.NumberOfBootCastesIsUsed / userPlan.botcastPlanNumber) * 100, 100)}%` 
                                                                    }}
                                                                ></div>
                                                            </div>
                                                            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                                                {userPlan.botcastPlanNumber - userPlan.NumberOfBootCastesIsUsed} BootCasts remaining
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => {
                                                    handleSignOut();
                                                    setIsUserMenuOpen(false);
                                                }}
                                                className="w-full text-left px-6 py-4 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 flex items-center space-x-3 group"
                                            >
                                                <svg
                                                    className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-0.5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                                    />
                                                </svg>
                                                <span className="font-semibold text-lg">
                                                    Log out
                                                </span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 font-medium px-6 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-lg"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl font-semibold text-lg"
                                    >
                                        Sign up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center space-x-3">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
                            aria-label="Toggle menu"
                        >
                            <svg
                                className="w-7 h-7"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                {isMenuOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-4 pt-4 pb-6 space-y-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 mt-4">
                            {/* Navigation Links */}
                            <div className="space-y-2">
                                <Link
                                    href="/"
                                    className="block px-6 py-4 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 text-lg"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Home
                                </Link>
                                <Link
                                    href="/explore"
                                    className="block px-6 py-4 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 text-lg"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Explore
                                </Link>
                                {isLoggedIn && (
                                    <Link
                                        href="/demo"
                                        className="block px-6 py-4 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 text-lg"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Demo
                                    </Link>
                                )}
                                {isLoggedIn && (
                                    <Link
                                        href="/dashboard"
                                        className="block px-6 py-4 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 text-lg"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                )}
                            </div>

                            {/* Divider */}
                            <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

                            {isLoggedIn ? (
                                <div className="space-y-3">
                                    {/* User Profile Section - Clickable */}
                                    <button
                                        onClick={() => {
                                            handleSignOut();
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full flex items-center space-x-4 px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-700/50 hover:from-red-50 hover:to-red-50 dark:hover:from-red-900/20 dark:hover:to-red-900/20 transition-all duration-200 group"
                                    >
                                        <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center ring-2 ring-white dark:ring-gray-800 shadow-md group-hover:from-red-400 group-hover:to-red-500 transition-all duration-200">
                                            {user?.photoURL ? (
                                                <img
                                                    src={user.photoURL}
                                                    alt="صورة المستخدم"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <svg
                                                    className="w-8 h-8 text-white"
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                                </svg>
                                            )}
                                        </div>
                                        <div className="flex flex-col flex-1 text-left">
                                            <span className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-200">
                                                {user?.displayName ||
                                                    user?.email?.split(
                                                        "@"
                                                    )[0] ||
                                                    "user"}
                                            </span>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                {user?.email || "user"}
                                            </span>
                                            {userPlan && (
                                                <div className="flex items-center space-x-3 mt-2">
                                                    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getPlanInfo(userPlan.plan).bgColor} ${getPlanInfo(userPlan.plan).textColor} ${getPlanInfo(userPlan.plan).borderColor} border shadow-sm`}>
                                                        {getPlanInfo(userPlan.plan).icon}
                                                        <span>{getPlanInfo(userPlan.plan).name}</span>
                                                    </span>
                                                    <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                                                        {userPlan.NumberOfBootCastesIsUsed}/{userPlan.botcastPlanNumber} BootCasts
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <svg
                                            className="w-6 h-6 text-blue-500 group-hover:text-red-500 transition-colors duration-200"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="block px-6 py-4 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 text-lg"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="block px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 font-semibold text-center text-lg"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Sign up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
