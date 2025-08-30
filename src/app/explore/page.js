"use client";

import { useState, useRef, useEffect } from "react";
import { FiMoreVertical } from "react-icons/fi";
import PodcastCard from "@/components/PodcastCard";
import { handleUniversalDownload } from "@/utils/downloadUtils";

const bootcasts = [
    {
        id: 1,
        title: "Chill Vibes Bootcast",
        date: "2024-07-20",
        duration: "3:45",
        audioUrl: "/audio/BootCaster_2025-07-17_19-21-42.wav",
        image: "/avatar-placeholder.svg",
    },
    {
        id: 2,
        title: "Morning Boost Bootcast",
        date: "2024-07-19",
        duration: "4:12",
        audioUrl: "/audio/BootCaster_2025-07-18_07-16-41.wav",
        image: "/avatar-placeholder.svg",
    },
    {
        id: 3,
        title: "Night Drive Bootcast",
        date: "2024-07-18",
        duration: "5:01",
        audioUrl: "/audio/BootCaster_2025-07-19_07-13-41.wav",
        image: "/avatar-placeholder.svg",
    },
];

// --- CustomAudioPlayer copied from PodcastCard ---
function CustomAudioPlayer({ src }) {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        const updateTime = () => {
            setCurrentTime(audio.currentTime);
            console.log("Time update:", audio.currentTime);
        };
        const updateDuration = () => {
            setDuration(audio.duration);
            console.log("Loaded metadata, duration:", audio.duration);
        };
        audio.addEventListener("timeupdate", updateTime);
        audio.addEventListener("loadedmetadata", updateDuration);
        audio.addEventListener("ended", () => setIsPlaying(false));
        return () => {
            audio.removeEventListener("timeupdate", updateTime);
            audio.removeEventListener("loadedmetadata", updateDuration);
            audio.removeEventListener("ended", () => setIsPlaying(false));
        };
    }, []);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        let playPromise;
        if (isPlaying) {
            playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch((error) => {
                    if (error.name !== "AbortError") {
                        console.error("Audio play error:", error);
                    }
                });
            }
        } else {
            audio.pause();
        }
    }, [isPlaying]);

    const togglePlay = () => setIsPlaying((p) => !p);

    const handleSeek = (e) => {
        const rect = e.target.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        const seekTime = percent * duration;
        setCurrentTime(seekTime);
        audioRef.current.currentTime = seekTime;
    };

    const formatTime = (t) => {
        if (isNaN(t)) return "0:00";
        const m = Math.floor(t / 60);
        const s = Math.floor(t % 60)
            .toString()
            .padStart(2, "0");
        return `${m}:${s}`;
    };

    return (
        <>
            <div className="w-full flex items-center space-x-4 rtl:space-x-reverse bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 rounded-xl px-4 py-3 shadow-md border border-blue-200 dark:border-blue-700">
                <button
                    onClick={togglePlay}
                    className="flex items-center justify-center w-12 h-12 rounded-full shadow-lg bg-gradient-to-tr from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    aria-label={isPlaying ? "Pause" : "Play"}
                >
                    {isPlaying ? (
                        <svg
                            className="w-7 h-7 text-white"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <rect x="6" y="5" width="4" height="14" rx="2" />
                            <rect x="14" y="5" width="4" height="14" rx="2" />
                        </svg>
                    ) : (
                        <svg
                            className="w-7 h-7 text-white"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <polygon points="5,3 19,12 5,21 5,3" />
                        </svg>
                    )}
                </button>
                <div className="flex-1 flex flex-col">
                    <div
                        className="relative h-3 w-full cursor-pointer group"
                        onClick={handleSeek}
                    >
                        <div className="absolute top-1/2 left-0 w-full h-2 -translate-y-1/2 bg-gray-200 dark:bg-gray-700 rounded-full" />
                        <div
                            className="absolute top-1/2 left-0 h-2 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-200"
                            style={{
                                width: duration
                                    ? `${(currentTime / duration) * 100}%`
                                    : "0%",
                            }}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300 mt-1 font-mono">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>
                <audio
                    ref={audioRef}
                    src={src}
                    preload="metadata"
                    style={{ display: "none" }}
                />
            </div>
            {/* Debug output for currentTime and duration */}
            <div style={{ color: "red", fontSize: "12px" }}>
                Debug: currentTime={currentTime}, duration={duration}
            </div>
        </>
    );
}
// --- End CustomAudioPlayer ---

function BootcastMenu({ audioUrl, onFavorite }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="relative">
            <button
                onClick={() => setOpen((o) => !o)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
                aria-label="Open menu"
            >
                <FiMoreVertical className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
            {open && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-20">
                    <button
                        onClick={() => {
                            onFavorite();
                            setOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                    >
                        Add to Favorite
                    </button>
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(
                                window.location.origin + audioUrl
                            );
                            setOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                    >
                        Copy Link
                    </button>
                    <button
                        onClick={() => {
                            handleUniversalDownload(audioUrl, `bootcast-${Date.now()}.wav`);
                            setOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                    >
                        Download
                    </button>
                </div>
            )}
        </div>
    );
}

export default function ExplorePage() {
    return (
        <div className="relative min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex flex-col items-center py-12 px-2">
            <div className="w-full max-w-3xl text-center mb-10 mt-4">
                <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-700 via-purple-600 to-pink-500 bg-clip-text text-transparent mb-4 drop-shadow-lg">
                    Explore BootCaster
                </h1>
                <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-200 font-medium max-w-2xl mx-auto mb-2">
                    Discover albums and bootcasters. Listen, follow, and enjoy
                    the best audio content!
                </p>
            </div>
            <main className="flex-1 w-full flex flex-col items-center">
                <div className="w-full max-w-6xl mx-auto px-2 sm:px-4">
                    {/* Search Bar */}
                    <div className="mb-10 flex justify-center">
                        <input
                            type="text"
                            placeholder="Search bootcasts, albums, creators..."
                            className="w-full max-w-xl rounded-full bg-white/70 dark:bg-white/10 text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/60 px-6 py-3 outline-none shadow-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-400"
                        />
                    </div>
                    <section>
                        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-purple-700 dark:text-purple-300">
                            Bootcasts
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {bootcasts.map((bootcast) => (
                                <PodcastCard
                                    key={bootcast.id}
                                    title={bootcast.title}
                                    date={bootcast.date}
                                    duration={bootcast.duration}
                                    audioUrl={bootcast.audioUrl}
                                    characterImages={[bootcast.image]}
                                    characterNames={["Creator"]}
                                    content={""}
                                    onDownload={() =>
                                        handleUniversalDownload(bootcast.audioUrl, `bootcast-${bootcast.id}.wav`)
                                    }
                                    onShare={() =>
                                        navigator.clipboard.writeText(
                                            window.location.origin +
                                                bootcast.audioUrl
                                        )
                                    }
                                />
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
