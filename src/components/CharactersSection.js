"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function CharactersSection() {
    const { t } = useTranslation();
    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [playingAudio, setPlayingAudio] = useState(null);
    const [audioElement, setAudioElement] = useState(null);

    useEffect(() => {
        fetchCharacters();
    }, []);

    const fetchCharacters = async () => {
        try {
            const response = await fetch("/api/Voice");
            const data = await response.json();
            setCharacters(data);
        } catch (error) {
            console.error("Error fetching characters:", error);
        } finally {
            setLoading(false);
        }
    };

    const playAudio = async (character) => {
        try {
            // Stop any currently playing audio
            if (audioElement) {
                audioElement.pause();
                audioElement.currentTime = 0;
            }

            // Create new audio element
            const audio = new Audio(character.voiceUrl);

            audio.addEventListener("loadstart", () => {
                setPlayingAudio(character._id);
            });

            audio.addEventListener("ended", () => {
                setPlayingAudio(null);
                setAudioElement(null);
            });

            audio.addEventListener("error", () => {
                console.error("Error playing audio:", character.name);
                setPlayingAudio(null);
                setAudioElement(null);
            });

            setAudioElement(audio);
            await audio.play();
        } catch (error) {
            console.error("Error playing audio:", error);
            setPlayingAudio(null);
        }
    };

    const stopAudio = () => {
        if (audioElement) {
            audioElement.pause();
            audioElement.currentTime = 0;
            setPlayingAudio(null);
            setAudioElement(null);
        }
    };

    if (loading) {
        return (
            <section className="py-16 bg-gray-50 dark:bg-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-300">
                            جاري تحميل الشخصيات...
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        الشخصيات المتاحة
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        اختر من مجموعة متنوعة من الشخصيات المميزة. اضغط على أي
                        شخصية لسماع صوتها
                    </p>
                </div>

                {/* Characters Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {characters.map((character) => (
                        <div
                            key={character._id}
                            className="bg-white dark:bg-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
                            onClick={() => playAudio(character)}
                        >
                            {/* Character Image */}
                            <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
                                <img
                                    src={character.imageUrl}
                                    alt={character.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src =
                                            "/avatar-placeholder.svg";
                                    }}
                                />

                                {/* Play Button Overlay */}
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                                    <div
                                        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                                            playingAudio === character._id
                                                ? "bg-red-500 animate-pulse"
                                                : "bg-white bg-opacity-90 group-hover:bg-opacity-100"
                                        }`}
                                    >
                                        {playingAudio === character._id ? (
                                            <svg
                                                className="w-8 h-8 text-white"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        ) : (
                                            <svg
                                                className="w-8 h-8 text-gray-800"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        )}
                                    </div>
                                </div>

                                {/* Playing Indicator */}
                                {playingAudio === character._id && (
                                    <div className="absolute top-4 right-4">
                                        <div className="flex space-x-1">
                                            <div className="w-1 h-4 bg-white rounded-full animate-pulse"></div>
                                            <div
                                                className="w-1 h-4 bg-white rounded-full animate-pulse"
                                                style={{
                                                    animationDelay: "0.1s",
                                                }}
                                            ></div>
                                            <div
                                                className="w-1 h-4 bg-white rounded-full animate-pulse"
                                                style={{
                                                    animationDelay: "0.2s",
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Character Info */}
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        {character.name}
                                    </h3>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {character.description}
                                    </span>
                                </div>

                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                                    اضغط لسماع صوت هذه الشخصية
                                </p>

                                {/* Action Buttons */}
                                <div className="flex space-x-2 rtl:space-x-reverse">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (
                                                playingAudio === character._id
                                            ) {
                                                stopAudio();
                                            } else {
                                                playAudio(character);
                                            }
                                        }}
                                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                            playingAudio === character._id
                                                ? "bg-red-500 hover:bg-red-600 text-white"
                                                : "bg-blue-500 hover:bg-blue-600 text-white"
                                        }`}
                                    >
                                        {playingAudio === character._id
                                            ? "إيقاف"
                                            : "تشغيل"}
                                    </button>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // Add to favorites or other action
                                        }}
                                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* No Characters Message */}
                {characters.length === 0 && (
                    <div className="text-center py-12">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                            />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                            لا توجد شخصيات متاحة
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            سيتم إضافة الشخصيات قريباً
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
