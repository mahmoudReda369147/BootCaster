/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class", // Enable class-based dark mode
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
            fontFamily: {
                sans: [
                    "var(--font-inter)",
                    "var(--font-cairo)",
                    "Inter",
                    "Cairo",
                    "ui-sans-serif",
                    "system-ui",
                    "sans-serif",
                ],
                arabic: [
                    "var(--font-cairo)",
                    "Cairo",
                    "Noto Sans Arabic",
                    "ui-sans-serif",
                    "system-ui",
                    "sans-serif",
                ],
                english: [
                    "var(--font-inter)",
                    "Inter",
                    "ui-sans-serif",
                    "system-ui",
                    "sans-serif",
                ],
            },
        },
    },
    plugins: [],
};
