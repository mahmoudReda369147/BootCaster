import React from "react";

export default function Loading({ text = "Loading..." }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[200px]">
            <svg
                className="animate-spin h-10 w-10 text-purple-500 mb-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                ></circle>
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                ></path>
            </svg>
            <span className="text-gray-600 dark:text-gray-300">{text}</span>
        </div>
    );
}
