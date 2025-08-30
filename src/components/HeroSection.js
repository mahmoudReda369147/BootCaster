"use client";

import Link from "next/link";

export default function HeroSection() {
    return (
        <section className="relative pt-20 pb-16 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>

            {/* Floating Elements */}
            <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20 animate-pulse delay-1000"></div>
            <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-pink-200 dark:bg-pink-800 rounded-full opacity-20 animate-pulse delay-2000"></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    {/* Main Heading */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                        Transform Your Content Into
                        <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Amazing BootCasts
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                        Create professional audio content from your text files
                        using advanced AI technology. Turn your ideas into
                        engaging BootCasts in minutes.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                        <Link
                            href="/register"
                            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 transform hover:-translate-y-1 hover:shadow-xl"
                        >
                            Get Started Free
                        </Link>
                        <Link
                            href="/demo"
                            className="w-full sm:w-auto bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-8 py-4 rounded-xl text-lg font-semibold border-2 border-gray-300 dark:border-gray-600 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-xl"
                        >
                            Try Demo
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                                10K+
                            </div>
                            <div className="text-gray-600 dark:text-gray-400">
                                BootCasts Created
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                                5K+
                            </div>
                            <div className="text-gray-600 dark:text-gray-400">
                                Happy Users
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                                99%
                            </div>
                            <div className="text-gray-600 dark:text-gray-400">
                                Satisfaction Rate
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
