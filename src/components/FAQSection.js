"use client";

import { useState } from "react";

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState(0);

    const faqs = [
        {
            question: "How does BootCaster work?",
            answer: "BootCaster uses advanced AI technology to transform your text content into engaging audio BootCasts. Simply upload two formatted text files or write your content directly, and our AI will create professional-quality audio content that maintains your message's essence while adding natural flow and engaging presentation.",
        },
        {
            question: "What file formats are supported?",
            answer: "We support TXT, DOC, DOCX, and PDF files. Each file should be under 10MB for optimal processing. The system works best with well-formatted, structured text content.",
        },
        {
            question: "Can I change my plan anytime?",
            answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and you&apos;ll only pay the difference for the remainder of your billing cycle. No cancellation fees or long-term commitments required.",
        },
        {
            question: "What&apos;s the difference between the plans?",
            answer: "Our Starter plan is perfect for individuals with 5 BootCasts per month. Professional plan offers 50 BootCasts with advanced features and team collaboration. Enterprise provides unlimited BootCasts with premium AI processing, studio-quality audio, and white-label solutions.",
        },
        {
            question: "How is the audio quality?",
            answer: "All plans include high-quality AI-generated audio with natural speech patterns. Professional and Enterprise plans offer enhanced audio quality, while Enterprise provides studio-quality output suitable for professional broadcasting.",
        },
        {
            question: "Is there a free trial?",
            answer: "Yes! Start with our free tier and experience BootCaster&apos;s capabilities. You can create your first BootCast without any commitment. Upgrade when you&apos;re ready for more features and higher limits.",
        },
        {
            question: "Do you offer refunds?",
            answer: "We offer a 30-day money-back guarantee. If you&apos;re not satisfied with our service, we&apos;ll refund your payment. No questions asked. Your satisfaction is our priority.",
        },
        {
            question: "Can I cancel anytime?",
            answer: "Absolutely. You can cancel your subscription at any time with no cancellation fees. Your access continues until the end of your current billing period, and you can reactivate anytime.",
        },
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? -1 : index);
    };

    return (
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 transition-colors duration-300">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Find answers to common questions below.{' '}
                        <a
                            href="/contact"
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                        >
                            Contact Support
                        </a>
                    </p>
                </div>

                {/* FAQ Accordion */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-lg"
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full px-6 py-6 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset transition-colors duration-200"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                                        {faq.question}
                                    </h3>
                                    <div className="flex-shrink-0">
                                        <svg
                                            className={`w-6 h-6 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
                                                openIndex === index
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
                                    </div>
                                </div>
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                    openIndex === index
                                        ? "max-h-96 opacity-100"
                                        : "max-h-0 opacity-0"
                                }`}
                            >
                                <div className="px-6 pb-6">
                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Additional Help Section */}
                <div className="mt-16 text-center">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 lg:p-12 text-white">
                        <div className="max-w-2xl mx-auto">
                            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                                Still have questions?
                            </h3>
                            <p className="text-lg text-blue-100 mb-8">
                                Our team is here to help you.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a
                                    href="/contact"
                                    className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors duration-200"
                                >
                                    <svg
                                        className="w-5 h-5 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                        />
                                    </svg>
                                    Contact Support
                                </a>
                                <a
                                    href="/demo"
                                    className="inline-flex items-center px-6 py-3 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transition-colors duration-200"
                                >
                                    <svg
                                        className="w-5 h-5 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    Try Demo
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
