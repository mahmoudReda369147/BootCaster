"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";

import { signUpWithEmailPassword, loginWithGoogle } from "@/lib/loginFunc";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { PublicRoute } from "@/components/ProtectedRoute";
import Loading from "@/components/Loading";
// Schema for data validation using Zod
const registerSchema = z
    .object({
        name: z
            .string()
            .min(1, "Name is required")
            .min(2, "Name must be at least 2 characters")
            .max(50, "Name must be less than 50 characters"),
        email: z.string().min(1, "Email is required").email("Email is invalid"),
        password: z
            .string()
            .min(1, "Password is required")
            .min(6, "Password must be at least 6 characters")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                "Password must contain uppercase, lowercase and number"
            ),
        confirmPassword: z.string().min(1, "Confirm password is required"),
        terms: z
            .boolean()
            .refine(
                (val) => val === true,
                "You must agree to the terms and conditions"
            ),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export default function RegisterPage() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: zodResolver(registerSchema),
        mode: "onChange",
    });

    useEffect(() => {
        // Initialize theme
        console.log("RegisterPage");

        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            document.documentElement.classList.add(savedTheme);
        }
    }, []);

    const onSubmit = async (data) => {
        try {
            // Simulate API call
            const userData = await signUpWithEmailPassword(
                data.email,
                data.password
            );
            const newUser = await fetch("/api/newUser", {
                method: "POST",
                body: JSON.stringify({email: data.email}),
            });
            const newUserResponse = await newUser.json();
            console.log("newUserResponse",newUserResponse);
            Cookies.set("userData", JSON.stringify(userData));
            Cookies.set("isLoggedIn", "true");
            toast.success("Registration successful");
            reset();
            router.push("/");
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <PublicRoute>
            <div className="min-h-screen pt-13 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
                <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-md w-full space-y-8">
                        <div className="text-center">
                            
                            

                            <h2 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-700 via-purple-600 to-pink-500 bg-clip-text text-transparent mb-4 drop-shadow-lg">
                                Create Account
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300">
                                Join BootCaster and start creating amazing
                                BootCasts
                            </p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
                            <form
                                className="space-y-6"
                                onSubmit={handleSubmit(onSubmit)}
                            >
                                {/* Name Field */}
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                    >
                                        Full Name
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        autoComplete="name"
                                        {...register("name")}
                                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                                            errors.name
                                                ? "border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20"
                                                : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                                        } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                                        placeholder="Enter your full name"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {errors.name.message}
                                        </p>
                                    )}
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                    >
                                        Email Address
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        autoComplete="email"
                                        {...register("email")}
                                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                                            errors.email
                                                ? "border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20"
                                                : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                                        } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                                        placeholder="Enter your email"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>

                                {/* Password Field */}
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                    >
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        autoComplete="new-password"
                                        {...register("password")}
                                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                                            errors.password
                                                ? "border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20"
                                                : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                                        } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                                        placeholder="Create a password"
                                    />
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {errors.password.message}
                                        </p>
                                    )}
                                </div>

                                {/* Confirm Password Field */}
                                <div>
                                    <label
                                        htmlFor="confirmPassword"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                    >
                                        Confirm Password
                                    </label>
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        autoComplete="new-password"
                                        {...register("confirmPassword")}
                                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                                            errors.confirmPassword
                                                ? "border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20"
                                                : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                                        } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                                        placeholder="Confirm your password"
                                    />
                                    {errors.confirmPassword && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {errors.confirmPassword.message}
                                        </p>
                                    )}
                                </div>

                                {/* Terms and Conditions */}
                                <div className="flex items-start">
                                    <input
                                        id="terms"
                                        type="checkbox"
                                        {...register("terms")}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                                    />
                                    <label
                                        htmlFor="terms"
                                        className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                                    >
                                        I agree to the{" "}
                                        <Link
                                            href="/terms"
                                            className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
                                        >
                                            Terms of Service
                                        </Link>{" "}
                                        and{" "}
                                        <Link
                                            href="/privacy"
                                            className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
                                        >
                                            Privacy Policy
                                        </Link>
                                    </label>
                                </div>
                                {errors.terms && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                        {errors.terms.message}
                                    </p>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-1"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center w-full">
                                            <span className="mr-2">
                                                <Loading text="" />
                                            </span>
                                            Loading...
                                        </span>
                                    ) : (
                                        "Sign Up"
                                    )}
                                </button>

                                {/* Divider */}
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                                            Or continue with
                                        </span>
                                    </div>
                                </div>

                                {/* Social Login Buttons */}
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            try {
                                                const userData =
                                                    await loginWithGoogle();
                                                const newUser = await fetch("/api/newUser", {
                                                    method: "POST",
                                                    body: JSON.stringify({email: userData.email}),
                                                });
                                                const newUserResponse = await newUser.json();
                                                console.log("newUserResponse",newUserResponse);

                                                Cookies.set(
                                                    "userData",
                                                    JSON.stringify(userData)
                                                );
                                                Cookies.set(
                                                    "isLoggedIn",
                                                    "true"
                                                );

                                                toast.success(
                                                    "Login successful"
                                                );
                                                reset();
                                                router.push("/");
                                            } catch (error) {
                                                toast.error(error.message);
                                            }
                                        }}
                                        className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                fill="currentColor"
                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            />
                                            <path
                                                fill="currentColor"
                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            />
                                            <path
                                                fill="currentColor"
                                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            />
                                            <path
                                                fill="currentColor"
                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            />
                                        </svg>
                                        <span className="ml-2">Google</span>
                                    </button>
                                    <button
                                        disabled={true}
                                        type="button"
                                        className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                                        </svg>
                                        <span className="ml-2">Twitter</span>
                                    </button>
                                </div>
                            </form>

                            {/* Sign In Link */}
                            <div className="mt-6 text-center">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Already have an account?{" "}
                                    <Link
                                        href="/login"
                                        className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
                                    >
                                        Sign In
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PublicRoute>
    );
}
