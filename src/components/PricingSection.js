"use client";

import { useState } from "react";
import Link from "next/link";

export default function PricingSection() {
    const [billingCycle, setBillingCycle] = useState("monthly"); // "monthly" or "yearly"

    const plans = [
        {
            name: "Starter",
            description: "Perfect for individuals and small projects",
            monthlyPrice: 0,
            yearlyPrice: 0,
            originalPrice: 9,
            features: [
                "3 BootCasts per month",
                "Basic AI processing",
                "Standard audio quality",
                "Email support",
                "Basic templates",
                "Download in MP3 format",
            ],
            popular: false,
            color: "blue",
            isFree: true,
        },
        {
            name: "Professional",
            description: "Ideal for content creators and businesses",
            monthlyPrice: 29,
            yearlyPrice: 290,
            features: [
                "10 BootCasts per month",
                "Advanced AI processing",
                "High-quality audio output",
                "Priority email support",
                "Custom templates",
                "Multiple export formats",
                "Analytics dashboard",
                "Team collaboration (3 users)",
            ],
            popular: true,
            color: "purple",
            stripeLink: "https://buy.stripe.com/test_fZucN45Qj9SY8r5eik5sA01",
        },
        {
            name: "Enterprise",
            description: "For large organizations and agencies",
            monthlyPrice: 99,
            yearlyPrice: 990,
            features: [
                "30 BootCasts per month",
                "Premium AI processing",
                "Studio-quality audio",
                "24/7 phone support",
                "Custom branding",
                "All export formats",
                "Advanced analytics",
                "Unlimited team members",
                "API access",
                "White-label solution",
            ],
            popular: false,
            color: "green",
            stripeLink:"https://buy.stripe.com/test_dRm8wO92ve9eePt7TW5sA02" ,
            isPremium: true,
        },
    ];

    const getColorClasses = (color) => {
        const colors = {
            blue: {
                bg: "bg-blue-50 dark:bg-blue-900/20",
                border: "border-blue-200 dark:border-blue-700",
                text: "text-blue-600 dark:text-blue-400",
                button: "bg-blue-600 hover:bg-blue-700",
            },
            purple: {
                bg: "bg-purple-50 dark:bg-purple-900/20",
                border: "border-purple-200 dark:border-purple-700",
                text: "text-purple-600 dark:text-purple-400",
                button: "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700",
            },
            green: {
                bg: "bg-green-50 dark:bg-green-900/20",
                border: "border-green-200 dark:border-green-700",
                text: "text-green-600 dark:text-green-400",
                button: "bg-green-600 hover:bg-green-700",
            },
        };
        return colors[color] || colors.blue;
    };

    return (
        <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300" id="pricing">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Pricing Plans
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                        Choose the plan that fits your needs.
                    </p>

                    {/* Billing Toggle */}
                    {/* <div className="flex items-center justify-center space-x-4 rtl:space-x-reverse">
                        <span
                            className={`text-sm font-medium ${
                                billingCycle === "monthly"
                                    ? "text-gray-900 dark:text-white"
                                    : "text-gray-500 dark:text-gray-400"
                            }`}
                        >
                            Monthly
                        </span>
                        <button
                            onClick={() =>
                                setBillingCycle(
                                    billingCycle === "monthly"
                                        ? "yearly"
                                        : "monthly"
                                )
                            }
                            className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-blue-600"
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ${
                                    billingCycle === "yearly"
                                        ? "translate-x-6"
                                        : "translate-x-1"
                                }`}
                            />
                        </button>
                        <span
                            className={`text-sm font-medium ${
                                billingCycle === "yearly"
                                    ? "text-gray-900 dark:text-white"
                                    : "text-gray-500 dark:text-gray-400"
                            }`}
                        >
                            Yearly
                            <span className="ml-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
                                Save
                            </span>
                        </span>
                    </div> */}
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, index) => {
                        const colors = getColorClasses(plan.color);
                        const price =
                            billingCycle === "monthly"
                                ? plan.monthlyPrice
                                : plan.yearlyPrice;

                        return (
                            <div
                                key={index}
                                className={`relative rounded-2xl border-2 p-8 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2 ${
                                    plan.popular
                                        ? `${colors.border} ${colors.bg} ring-2 ring-purple-500 ring-opacity-50`
                                        : plan.isFree
                                        ? "border-green-300 dark:border-green-600 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 ring-2 ring-green-400 ring-opacity-30"
                                        : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                                }`}
                            >
                                {/* Popular Badge */}
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                                            Popular
                                        </span>
                                    </div>
                                )}
                                
                                {/* Free Badge for Starter Plan */}
                                {plan.isFree && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1 rounded-full text-sm font-medium animate-pulse">
                                            🎉 FREE NOW
                                        </span>
                                    </div>
                                )}
                                
                                {/* Premium Badge for Enterprise Plan */}
                                {plan.isPremium && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white px-4 py-1 rounded-full text-sm font-medium animate-pulse shadow-lg">
                                            ⭐ PREMIUM
                                        </span>
                                    </div>
                                )}

                                {/* Plan Header */}
                                <div className="text-center mb-8">
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                        {plan.name}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                                        {plan.description}
                                    </p>

                                    {/* Price */}
                                    <div className="mb-6">
                                        {plan.isFree ? (
                                            <div className="text-center">
                                                {/* Free Badge */}
                                                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full mb-3">
                                                    <svg className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                                    </svg>
                                                    <span className="text-green-800 dark:text-green-200 font-bold text-sm">FREE FOREVER</span>
                                                </div>
                                                
                                                {/* Price with Slash */}
                                                <div className="flex items-baseline justify-center">
                                                    <div className="relative">
                                                        <span className="text-4xl font-bold text-gray-400 dark:text-gray-500 line-through">
                                                            ${plan.originalPrice}
                                                        </span>
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <div className="w-full h-0.5 bg-gradient-to-r from-red-500 to-red-600 transform rotate-12"></div>
                                                        </div>
                                                    </div>
                                                    <span className="text-4xl font-bold text-green-600 dark:text-green-400 ml-3">
                                                        $0
                                                    </span>
                                                    <span className="text-gray-500 dark:text-gray-400 ml-1">
                                                        /{billingCycle === "monthly" ? "mo" : "year"}
                                                    </span>
                                                </div>
                                                
                                                {/* Savings Badge */}
                                                <div className="mt-2">
                                                    <span className="inline-flex items-center px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 text-sm font-semibold rounded-full">
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                        </svg>
                                                        Save ${plan.originalPrice}/mo
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-baseline justify-center">
                                                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                                                    ${price}
                                                </span>
                                                <span className="text-gray-500 dark:text-gray-400 ml-1">
                                                    /{billingCycle === "monthly" ? "mo" : "year"}
                                                </span>
                                            </div>
                                        )}
                                        
                                        {billingCycle === "yearly" && !plan.isFree && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                ${plan.monthlyPrice}/mo when billed monthly
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Features */}
                                <ul className="space-y-4 mb-8">
                                    {plan.features.map(
                                        (feature, featureIndex) => (
                                            <li
                                                key={featureIndex}
                                                className="flex items-start"
                                            >
                                                <svg
                                                    className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                                <span className="text-gray-700 dark:text-gray-300">
                                                    {feature}
                                                </span>
                                            </li>
                                        )
                                    )}
                                </ul>

                                {/* CTA Button */}
                                <div className="text-center">
                                    <Link
                                        href={
                                            plan.name === "Starter"
                                                ? "/register"
                                                : plan.stripeLink
                                                ? plan.stripeLink
                                                : "/contact"
                                        }
                                        target={plan.stripeLink ? "_blank" : "_self"}
                                        className={`inline-flex items-center justify-center w-full px-6 py-3 text-white font-semibold rounded-xl transition-all duration-200 transform hover:-translate-y-1 ${
                                            plan.popular
                                                ? colors.button
                                                : colors.button
                                        }`}
                                    >
                                        {plan.name === "Starter"
                                            ? "Get Started"
                                            : plan.stripeLink
                                            ? "Subscribe Now"
                                            : "Contact Sales"}
                                        <svg
                                            className="ml-2 w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                                            />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* CTA Section */}
                <div className="mt-20 text-center">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8 lg:p-12">
                        <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Ready to Start Creating BootCasts?
                        </h3>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                            Join thousands of creators who are already using
                            BootCaster to transform their content into engaging
                            audio experiences.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/register"
                                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-lg"
                            >
                                Start Free Trial
                                <svg
                                    className="ml-2 w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                                    />
                                </svg>
                            </Link>
                            <Link
                                href="/demo"
                                className="inline-flex items-center px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 text-lg"
                            >
                                Try Demo
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
