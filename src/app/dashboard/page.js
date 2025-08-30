"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import PodcastCard from "@/components/PodcastCard";
import Loading from "@/components/Loading";

export default function DashboardPage() {
    const [podcasts, setPodcasts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const podcastsPerPage = 6;

    useEffect(() => {
        let userData;
        const userCookie = Cookies.get("userData");
        if (!userCookie || userCookie === "undefined") {
            setError("User not authenticated. Please log in.");
            setIsLoading(false);
            return;
        }
        try {
            userData = JSON.parse(userCookie);
        } catch (e) {
            setError("User data corrupted. Please log in again.");
            setIsLoading(false);
            return;
        }
        if (!userData?.uid) {
            setError("User ID not found. Please log in.");
            setIsLoading(false);
            return;
        }
        fetch(`/api/podcasts?uid=${userData.uid}`)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch podcasts");
                return res.json();
            })
            .then((data) => {
                const reverseData = data.data.reverse();
                console.log(reverseData);

                setPodcasts(reverseData || []);
                setIsLoading(false);
            })
            .catch((err) => {
                setError("Failed to fetch podcasts. Please try again later.");
                setIsLoading(false);
            });
    }, []);

    // Helper to check if audio is valid
    const isValidAudio = (url) => {
        if (!url) return false;
        return (
            url.endsWith(".mp3") || url.endsWith(".wav") || url.endsWith(".ogg")
        );
    };

    // Pagination logic
    const indexOfLastPodcast = currentPage * podcastsPerPage;
    const indexOfFirstPodcast = indexOfLastPodcast - podcastsPerPage;
    const currentPodcasts = podcasts.slice(
        indexOfFirstPodcast,
        indexOfLastPodcast
    );
    const totalPages = Math.ceil(podcasts.length / podcastsPerPage);

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex flex-col items-center py-12 px-2">
            {/* Header */}
            <div className="w-full max-w-3xl text-center mb-10 mt-4">
                <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-700 via-purple-600 to-pink-500 bg-clip-text text-transparent mb-4 drop-shadow-lg">
                    Your BootCasts
                </h1>
                <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-200 font-medium max-w-2xl mx-auto mb-2">
                    All your audio creations in one place. Listen, download, or
                    share your BootCasts with the world.
                </p>
            </div>
            {/* Loading spinner */}
            {isLoading && <Loading text="Loading your podcasts..." />}
            {/* Error message */}
            {error && !isLoading && (
                <div className="bg-red-100 text-red-700 px-4 py-3 rounded shadow max-w-md mx-auto mb-6">
                    {error}
                </div>
            )}
            {/* Podcast grid */}
            {!isLoading && !error && (
                <>
                    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {currentPodcasts.length === 0 ? (
                            <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-12">
                                No podcasts found. Start creating your first
                                BootCast!
                            </div>
                        ) : (
                            currentPodcasts.map((podcast) => (
                                <PodcastCard
                                    key={podcast._id}
                                    title={podcast.bootcastName || "Untitled"}
                                    date={
                                        podcast.createdAt
                                            ? new Date(
                                                  podcast.createdAt
                                              ).toLocaleDateString()
                                            : ""
                                    }
                                    duration={podcast.duration || "Unknown"}
                                    audioUrl={
                                        podcast.link ? podcast.link : null
                                    }
                                    audioError={!isValidAudio(podcast.link)}
                                    content={podcast.content}
                                    characterImages={
                                        podcast.characterImages || []
                                    }
                                    characterNames={
                                        [podcast.name1, podcast.name2] || []
                                    }
                                    onDownload={() =>
                                        window.open(podcast.link, "_blank")
                                    }
                                    onShare={() =>
                                        navigator.clipboard.writeText(
                                            podcast.link
                                        )
                                    }
                                />
                            ))
                        )}
                    </div>
                    {/* Pagination controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-8 space-x-2 items-center">
                            <button
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.max(prev - 1, 1)
                                    )
                                }
                                disabled={currentPage === 1}
                                className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
                            >
                                Prev
                            </button>
                            {/* Show ellipsis if needed before */}
                            {currentPage > 2 && (
                                <span className="px-2 text-xl text-gray-400 select-none">
                                    &hellip;
                                </span>
                            )}
                            {/* Previous page */}
                            {currentPage > 1 && (
                                <button
                                    onClick={() =>
                                        setCurrentPage(currentPage - 1)
                                    }
                                    className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                                >
                                    {currentPage - 1}
                                </button>
                            )}
                            {/* Current page */}
                            <button
                                className="px-3 py-1 rounded bg-purple-500 text-white font-bold border-2 border-purple-700"
                                disabled
                            >
                                {currentPage}
                            </button>
                            {/* Next page */}
                            {currentPage < totalPages && (
                                <button
                                    onClick={() =>
                                        setCurrentPage(currentPage + 1)
                                    }
                                    className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                                >
                                    {currentPage + 1}
                                </button>
                            )}
                            {/* Show ellipsis if needed after */}
                            {currentPage < totalPages - 1 && (
                                <span className="px-2 text-xl text-gray-400 select-none">
                                    &hellip;
                                </span>
                            )}
                            <button
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.min(prev + 1, totalPages)
                                    )
                                }
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
