"use client";

import { useState, useEffect, useRef, memo, useLayoutEffect } from "react";
import { useForm } from "react-hook-form";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import axios from "axios";
import Link from "next/link";
import { handleUniversalDownload } from "@/utils/downloadUtils";

// Custom Audio Player Component
function CustomAudioPlayer({ src }) {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [seeking, setSeeking] = useState(false);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);
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
        if (isPlaying) {
            audio.play();
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
        <div className="w-full flex items-center space-x-4 rtl:space-x-reverse bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 rounded-xl px-4 py-3 shadow-md border border-blue-200 dark:border-blue-700">
            {/* Play/Pause Button */}
            <button
                onClick={togglePlay}
                className={`flex items-center justify-center w-12 h-12 rounded-full shadow-lg bg-gradient-to-tr from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400`}
                aria-label={isPlaying ? "إيقاف" : "تشغيل"} 
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
            {/* Progress Bar */}
            <div className="flex-1 flex flex-col">
                <div
                    className="relative h-3 w-full cursor-pointer group"
                    onClick={handleSeek}
                    onMouseDown={() => setSeeking(true)}
                    onMouseUp={() => setSeeking(false)}
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
                    {/* Removed the circular indicator (dot) */}
                </div>
                {/* Time Display */}
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300 mt-1 font-mono">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>
            {/* Hidden Native Audio */}
            <audio
                ref={audioRef}
                src={src}
                preload="metadata"
                style={{ display: "none" }}
            />
        </div>
    );
}

// CharacterNameInput: memoized input for character name
const CharacterNameInput = memo(function CharacterNameInput({
    value,
    onChange,
    placeholder,
    className,
    maxLength,
    inputRef,
}) {
    return (
        <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={className}
            maxLength={maxLength}
        />
    );
});

export default function DemoPage() {
    const [activeTab, setActiveTab] = useState("upload"); // "upload" or "write"
    const [selectedCharacters, setSelectedCharacters] = useState([]);
    const [characters, setCharacters] = useState([]);
    const [isLoadingCharacters, setIsLoadingCharacters] = useState(true);
    const [files, setFiles] = useState({
        promptFile: null,
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState(null);
    const [dragActive, setDragActive] = useState({
        promptFile: false,
    });
    const [playingAudio, setPlayingAudio] = useState(null);
    // Add state for download loading
    const [downloading, setDownloading] = useState(false);
    // characterNames state for custom names
    const [characterNames, setCharacterNames] = useState(["", ""]);
    // refs لكل حقل اسم شخصية حسب characterId
    const nameInputRefs = useRef({});
    // آخر characterId تم تغييره
    const lastFocusedId = useRef(null);
    const [isPrompit, setIsPrompit] = useState(false); // true = Prompt, false = Direct Conversation
    const [bootcastName, setBootcastName] = useState("");
    // Add userPlan state to main component
    const [userPlan, setUserPlan] = useState(null);
    const [isLoadingUserPlan, setIsLoadingUserPlan] = useState(true);

    // React Hook Form setup
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            textInput: "",
        },
    });

    const textInput = watch("textInput");
    const textareaRef = useRef(null);

    // Function to get character selection classes
    const getSelectedCharacterClass = (color) => {
        const colorClasses = {
            blue: "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md",
            green: "border-green-500 bg-green-50 dark:bg-green-900/20 shadow-md",
            yellow: "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 shadow-md",
            purple: "border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-md",
            orange: "border-orange-500 bg-orange-50 dark:bg-orange-900/20 shadow-md",
            red: "border-red-500 bg-red-50 dark:bg-red-900/20 shadow-md",
        };
        return (
            colorClasses[color] ||
            "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md"
        );
    };

    // Function to get selection indicator classes
    const getSelectionIndicatorClass = (color) => {
        const indicatorClasses = {
            blue: "bg-blue-500",
            green: "bg-green-500",
            yellow: "bg-yellow-500",
            purple: "bg-purple-500",
            orange: "bg-orange-500",
            red: "bg-red-500",
        };
        return indicatorClasses[color] || "bg-blue-500";
    };

    // Color mapping for characters
    const getCharacterColor = (index) => {
        const colors = ["blue", "green", "yellow", "purple", "orange", "red"];
        return colors[index % colors.length];
    };

    // Fetch user plan data
    useEffect(() => {
        const fetchUserPlan = async () => {
            try {
                setIsLoadingUserPlan(true);
                const userPlanResponse = await fetch("/api/newUser?email=" + JSON.parse(Cookies.get("userData")).email);
                const userPlanData = await userPlanResponse.json();
                setUserPlan(userPlanData);
            } catch (error) {
                console.error("Error fetching user plan:", error);
            } finally {
                setIsLoadingUserPlan(false);
            }
        };
        fetchUserPlan();
    }, []);

    useEffect(() => {
        // Initialize theme
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            document.documentElement.classList.add(savedTheme);
        }

        // Fetch characters from API
        const fetchCharacters = async () => {
            try {
                setIsLoadingCharacters(true);
                const response = await fetch("/api/Voice");
                const data = await response.json();

                // Transform the data to match our component structure
                const transformedCharacters = data.map((char, index) => ({
                    id: char._id,
                    name: char.name,
                    description: char.description,
                    image: char.imageUrl,
                    voiceUrl: char.voiceUrl,
                    color: getCharacterColor(index),
                }));

                setCharacters(transformedCharacters);
            } catch (error) {
                console.error("Error fetching characters:", error);
            } finally {
                setIsLoadingCharacters(false);
            }
        };

        fetchCharacters();
    }, []);

    // Focus textarea when switching to write tab
    useEffect(() => {
        if (activeTab === "write" && textareaRef.current) {
            setTimeout(() => {
                textareaRef.current.focus();
            }, 100);
        }
    }, [activeTab]);

    // Cleanup audio when component unmounts
    useEffect(() => {
        return () => {
            if (playingAudio) {
                playingAudio.pause();
                playingAudio.currentTime = 0;
            }
        };
    }, [playingAudio]);

    // When selectedCharacters changes, set default names if not set
    useEffect(() => {
        setCharacterNames((prev) => {
            return [0, 1].map((i) => {
                if (selectedCharacters[i]) {
                    if (prev[i]) return prev[i];
                    const char = characters.find(
                        (c) => c.id === selectedCharacters[i]
                    );
                    return char ? char.name : "";
                }
                return "";
            });
        });
    }, [selectedCharacters, characters]);

    // إعادة الفوكس على آخر input تم تغييره بعد تحديث characterNames
    useLayoutEffect(() => {
        if (
            lastFocusedId.current &&
            nameInputRefs.current[lastFocusedId.current]
        ) {
            nameInputRefs.current[lastFocusedId.current].focus();
        }
    }, [characterNames]);

    const handleFileChange = (fileType, e) => {
        const file = e.target.files[0];
        if (file) {
            setFiles((prev) => ({
                ...prev,
                [fileType]: file,
            }));
        }
    };

    const handleDrag = (fileType, e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive((prev) => ({
                ...prev,
                [fileType]: true,
            }));
        } else if (e.type === "dragleave") {
            setDragActive((prev) => ({
                ...prev,
                [fileType]: false,
            }));
        }
    };

    const handleDrop = (fileType, e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive((prev) => ({
            ...prev,
            [fileType]: false,
        }));

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFiles((prev) => ({
                ...prev,
                [fileType]: e.dataTransfer.files[0],
            }));
        }
    };

    const removeFile = (fileType) => {
        setFiles((prev) => ({
            ...prev,
            [fileType]: null,
        }));
    };

    // دالة لقراءة محتوى ملف TXT
    const readTextFile = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(new Error("Error reading file"));
            reader.readAsText(file, "UTF-8");
        });
    };

    const onSubmit = async (data) => {
        setIsGenerating(true);
        setResult(null);
        try {
            const token = JSON.parse(Cookies.get("userData")).stsTokenManager
                .accessToken;

            // تحديد المحتوى: إما من الملف أو من النص المكتوب
            let content = "";
            if (activeTab === "upload" && files.promptFile) {
                // قراءة محتوى الملف
                content = await readTextFile(files.promptFile);
            } else {
                // استخدام النص المكتوب
                content = data.textInput || "";
            }

            const body = {
                content: content,
                name1:
                    characterNames[0] ||
                    characters.find((c) => c.id === selectedCharacters[0])
                        ?.name ||
                    "",
                name2:
                    characterNames[1] ||
                    characters.find((c) => c.id === selectedCharacters[1])
                        ?.name ||
                    "",
                characters: selectedCharacters.map((id) => {
                    const char = characters.find((c) => c.id === id);
                    return char ? char.name : "";
                }),
                isPrompit, // Add the toggle value to the request body
                bootcastName, // Add the BootCast name to the request body
            };
            console.log("body", body);

            const bootCaste = await axios.post(
                "/api/compile",
                body,
                {
                    //make the time out 5 minutes
                    timeout: 300000,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Parse real API response
            const apiData = bootCaste.data?.data;
            console.log("apiData", bootCaste);

            // Map character names to full info from characters state
            const characterDetails = (apiData.characters || []).map(
                (charName, idx) => {
                    // Try to find by name (case-insensitive)
                    const found = characters.find(
                        (c) => c.name?.toLowerCase() === charName?.toLowerCase()
                    );
                    return (
                        found || {
                            name: charName,
                            description: "",
                            image: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                charName
                            )}&background=blue&color=fff&size=64`,
                            color: idx === 0 ? "blue" : "purple",
                        }
                    );
                }
            );

            setIsGenerating(false);
            setResult({
                uid: apiData.uid,
                content: apiData.content,
                audioUrl: apiData.link,
                characterNames: [apiData.name1, apiData.name2],
                characterDetails,
                bootcastName: bootcastName, // Include bootcastName in result
            });

            // Refresh user plan data after successful BootCast compilation
            try {
                const userPlanResponse = await fetch("/api/newUser?email=" + JSON.parse(Cookies.get("userData")).email);
                const userPlanData = await userPlanResponse.json();
                window.refreshUserPlan();
                setUserPlan(userPlanData);
                console.log("Plan data refreshed after BootCast compilation");
            } catch (error) {
                console.error("Error refreshing plan data:", error);
            }
        } catch (error) {
            setIsGenerating(false);

            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    "error in generating bootcast please try again"
            );
            throw error;
        }
    };

    const handleGenerate = () => {
        if (activeTab === "write") {
            // Use react-hook-form for text input
            handleSubmit(onSubmit)();
        } else {
            // Handle file upload case
            onSubmit({});
        }
    };

    // Download handler using utility function
    const handleDownload = async (url, filename = "bootcast.wav") => {
        await handleUniversalDownload(url, filename, setDownloading);
    };

    const FileUploadArea = ({ fileType, label, placeholder }) => (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
            </label>
            <div
                className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors duration-200 ${
                    dragActive[fileType]
                        ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                        : files[fileType]
                        ? "border-green-400 bg-green-50 dark:bg-green-900/20"
                        : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                }`}
                onDragEnter={(e) => handleDrag(fileType, e)}
                onDragLeave={(e) => handleDrag(fileType, e)}
                onDragOver={(e) => handleDrag(fileType, e)}
                onDrop={(e) => handleDrop(fileType, e)}
            >
                {files[fileType] ? (
                    <div className="space-y-2">
                        <div className="flex items-center justify-center">
                            <svg
                                className="w-8 h-8 text-green-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {files[fileType].name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {(files[fileType].size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <button
                            type="button"
                            onClick={() => removeFile(fileType)}
                            className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                        >
                            Remove file
                        </button>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                        >
                            <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {placeholder}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            TXT files up to 10MB
                        </p>
                        <input
                            type="file"
                            id={fileType}
                            accept=".txt"
                            onChange={(e) => handleFileChange(fileType, e)}
                            className="hidden"
                        />
                        <label
                            htmlFor={fileType}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-colors duration-200"
                        >
                            <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                            </svg>
                            Upload file
                        </label>
                    </div>
                )}
            </div>
        </div>
    );

    const CharacterSelector = () => {
        const handleCharacterSelect = (characterId) => {
            setSelectedCharacters((prev) => {
                if (prev.includes(characterId)) {
                    // Remove character if already selected
                    return prev.filter((id) => id !== characterId);
                } else {
                    // Add character if not selected and less than 2
                    if (prev.length < 2) {
                        return [...prev, characterId];
                    }
                    // Replace the first character if already have 2
                    return [prev[1], characterId];
                }
            });
        };

        const handleCharacterClick = (character) => {
            // Play audio when character is clicked
            if (character.voiceUrl) {
                // Stop any currently playing audio
                if (playingAudio) {
                    playingAudio.pause();
                    playingAudio.currentTime = 0;
                }

                const audio = new Audio(character.voiceUrl);
                audio.addEventListener("ended", () => {
                    setPlayingAudio(null);
                });

                audio.play().catch((error) => {
                    console.error("Error playing audio:", error);
                });

                setPlayingAudio(audio);
            }
        };

        return (
            <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Choose Two Character Voices (Max 2)
                </label>
                {isLoadingCharacters ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {[...Array(6)].map((_, index) => (
                            <div
                                key={index}
                                className="p-4 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 animate-pulse"
                            >
                                <div className="flex flex-col items-center space-y-3">
                                    <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                                    <div className="text-center space-y-2">
                                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
                                        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {characters.map((character) => {
                            const isSelected = selectedCharacters.includes(
                                character.id
                            );
                            const isFirstSelected =
                                selectedCharacters[0] === character.id;
                            const isSecondSelected =
                                selectedCharacters[1] === character.id;
                            const isPlaying =
                                playingAudio &&
                                playingAudio.src === character.voiceUrl;

                            return (
                                <div key={character.id} className="relative">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleCharacterSelect(character.id)
                                        }
                                        className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left relative ${
                                            isSelected
                                                ? getSelectedCharacterClass(
                                                      character.color
                                                  )
                                                : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700"
                                        }`}
                                    >
                                        {/* Selection indicator */}
                                        {isSelected && (
                                            <div
                                                className={`absolute -top-2 -right-2 w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center shadow-sm ${getSelectionIndicatorClass(
                                                    character.color
                                                )}`}
                                            >
                                                {isFirstSelected ? "1" : "2"}
                                            </div>
                                        )}

                                        <div className="flex flex-col items-center space-y-3">
                                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 relative">
                                                <img
                                                    src={character.image}
                                                    alt={character.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src = `https://ui-avatars.com/api/?name=${character.name}&background=${character.color}&color=fff&size=64`;
                                                    }}
                                                />
                                            </div>
                                            <div className="text-center">
                                                <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                                                    {character.name}
                                                </h4>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {character.description}
                                                </p>
                                            </div>
                                        </div>
                                    </button>

                                    {/* Audio play button */}
                                    {character.voiceUrl && (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCharacterClick(character);
                                            }}
                                            className={`absolute top-2 left-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg ${
                                                isPlaying
                                                    ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                                                    : "bg-blue-500 hover:bg-blue-600 text-white"
                                            }`}
                                            title={`${
                                                isPlaying ? "Stop" : "Play"
                                            } ${character.name}'s voice`}
                                        >
                                            {isPlaying ? (
                                                <svg
                                                    className="w-4 h-4"
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
                                                    className="w-4 h-4"
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
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Selected characters summary */}
                {selectedCharacters.length > 0 && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                                🎭 Selected Characters
                            </h4>
                            <span className="text-xs text-blue-600 dark:text-blue-300 bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded-full">
                                {selectedCharacters.length}/2
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {selectedCharacters.map((charId, index) => {
                                const char = characters.find(
                                    (c) => c.id === charId
                                );
                                if (!char) return null;

                                return (
                                    <div
                                        key={charId}
                                        className={`flex items-center p-3 rounded-lg border-2 transition-all duration-200 ${
                                            index === 0
                                                ? "border-blue-300 bg-blue-100/50 dark:bg-blue-900/30"
                                                : "border-purple-300 bg-purple-100/50 dark:bg-purple-900/30"
                                        }`}
                                    >
                                        <div className="relative">
                                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white dark:border-gray-700 shadow-sm">
                                                <img
                                                    src={char.image}
                                                    alt={char.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src = `https://ui-avatars.com/api/?name=${char.name}&background=${char.color}&color=fff&size=48`;
                                                    }}
                                                />
                                            </div>
                                            <div
                                                className={`absolute -top-1 -right-1 w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center shadow-sm ${
                                                    index === 0
                                                        ? "bg-blue-500"
                                                        : "bg-purple-500"
                                                }`}
                                            >
                                                {index + 1}
                                            </div>
                                        </div>

                                        <div className="ml-3 flex-1">
                                            <div className="flex items-center space-x-2">
                                                <h5 className="font-semibold text-gray-900 dark:text-white text-sm">
                                                    {char.name}
                                                </h5>
                                                <span
                                                    className={`text-xs px-2 py-1 rounded-full ${
                                                        index === 0
                                                            ? "bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200"
                                                            : "bg-purple-200 text-purple-800 dark:bg-purple-800 dark:text-purple-200"
                                                    }`}
                                                >
                                                    {index === 0
                                                        ? "Primary"
                                                        : "Secondary"}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                                                {char.description}
                                            </p>
                                            {/* Custom name input */}
                                            <CharacterNameInput
                                                key={charId}
                                                value={characterNames[index]}
                                                onChange={(e) => {
                                                    const newNames = [
                                                        ...characterNames,
                                                    ];
                                                    newNames[index] =
                                                        e.target.value;
                                                    setCharacterNames(newNames);
                                                    lastFocusedId.current =
                                                        charId;
                                                }}
                                                placeholder={`اسم الشخصية ${
                                                    index + 1
                                                }`}
                                                className={`mt-2 w-full px-3 py-2 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm text-sm bg-white dark:bg-gray-800 ${
                                                    index === 0
                                                        ? "border-blue-300 focus:border-blue-500 focus:ring-blue-200"
                                                        : "border-purple-300 focus:border-purple-500 focus:ring-purple-200"
                                                } text-gray-900 dark:text-white placeholder-gray-400`}
                                                maxLength={24}
                                                inputRef={(el) => {
                                                    if (el)
                                                        nameInputRefs.current[
                                                            charId
                                                        ] = el;
                                                }}
                                            />
                                        </div>

                                        {/* Audio play button for selected character */}
                                        {char.voiceUrl && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleCharacterClick(char)
                                                }
                                                className="ml-2 p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200"
                                                title={`Play ${char.name}'s voice`}
                                            >
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {selectedCharacters.length === 1 && (
                            <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                                <p className="text-xs text-yellow-800 dark:text-yellow-200 text-center">
                                    💡 You can select one more character for a
                                    multi-voice BootCast
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const TextInputArea = ({ label, placeholder, maxLength = 2000 }) => {
        const handleTextChange = (e) => {
            setTimeout(() => {
                if (textareaRef.current) {
                    textareaRef.current.focus();
                    // Set cursor position to end
                    const length = e.target.value.length;
                    textareaRef.current.setSelectionRange(length, length);
                }
            }, 0);
        };

        return (
            <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                </label>
                <div className="relative">
                    <textarea
                        {...register("textInput", {
                            required:
                                activeTab === "write"
                                    ? "Text input is required"
                                    : false,
                            maxLength: {
                                value: maxLength,
                                message: `Text cannot exceed ${maxLength} characters`,
                            },
                        })}
                        ref={(e) => {
                            textareaRef.current = e;
                            register("textInput").ref(e);
                        }}
                        onChange={(e) => {
                            register("textInput").onChange(e);
                            handleTextChange(e);
                        }}
                        placeholder={placeholder}
                        rows={8}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                        dir="ltr"
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-gray-500 dark:text-gray-400">
                        {textInput.length}/{maxLength}
                    </div>
                    {errors.textInput && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors.textInput.message}
                        </p>
                    )}
                </div>
            </div>
        );
    };

    return (
        <ProtectedRoute>
            <div className="relative min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex flex-col items-center py-16 px-2">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-700 via-purple-600 to-pink-500 bg-clip-text text-transparent mb-4 drop-shadow-lg">
                            BootCast Playground
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            Try our AI-powered BootCast generation with sample
                            content
                        </p>
                    </div>

                    {/* Loading State */}
                    {isLoadingUserPlan && (
                        <div className="mb-8">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                    <p className="text-gray-600 dark:text-gray-400">Loading your plan information...</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Plan Limit Exceeded UI */}
                    {!isLoadingUserPlan && userPlan && !userPlan.canCreateBootCastes && (
                        <div className="mb-8">
                            <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl shadow-xl border-2 border-red-200 dark:border-red-700 p-8 relative overflow-hidden">
                                {/* Background Pattern */}
                                <div className="absolute inset-0 opacity-5">
                                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-red-400 to-orange-400"></div>
                                </div>
                                
                                {/* Content */}
                                <div className="relative z-10 text-center">
                                    {/* Icon */}
                                    <div className="mx-auto w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
                                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                    </div>
                                    
                                    {/* Title */}
                                    <h2 className="text-2xl sm:text-3xl font-bold text-red-800 dark:text-red-200 mb-4">
                                        BootCast Limit Reached! 🚫
                                    </h2>
                                    
                                    {/* Message */}
                                    <p className="text-lg text-red-700 dark:text-red-300 mb-6 max-w-2xl mx-auto">
                                        You&apos;ve used all {userPlan.botcastPlanNumber} BootCasts in your <span className="font-semibold capitalize">{userPlan.plan}</span> plan. 
                                        Upgrade your plan to create unlimited BootCasts and unlock premium features!
                                    </p>
                                    
                                    {/* Current Usage */}
                                    <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 mb-6 max-w-md mx-auto">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Current Usage</span>
                                            <span className="text-sm font-bold text-red-600 dark:text-red-400">
                                                {userPlan.NumberOfBootCastesIsUsed}/{userPlan.botcastPlanNumber}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                            <div 
                                                className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${(userPlan.NumberOfBootCastesIsUsed / userPlan.botcastPlanNumber) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    
                                    {/* Upgrade Button */}
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                        <Link
                                            href="/#pricing" 
                                            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg transform hover:-translate-y-1 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                            </svg>
                                            Upgrade Plan
                                        </Link>
                                        <a 
                                            href="/dashboard" 
                                            className="inline-flex items-center px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                            View Dashboard
                                        </a>
                                    </div>
                                    
                                    {/* Features Preview */}
                                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                                        <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-4 text-center">
                                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                            </div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Unlimited BootCasts</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">Create as many BootCasts as you want</p>
                                        </div>
                                        <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-4 text-center">
                                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                                </svg>
                                            </div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Premium Audio</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">Studio-quality audio processing</p>
                                        </div>
                                        <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-4 text-center">
                                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                            </div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Team Features</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">Collaborate with your team</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
{/*i want hiddin this section if he spend his bootcastes */}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 ">
                        {/* Input Section */}
                        <div className="space-y-6">
                            <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700 ${!isLoadingUserPlan && userPlan && !userPlan.canCreateBootCastes ? 'hidden' : ''}`}>
                                {/* Tab Navigation */}
                                <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                                    <button
                                        onClick={() => setActiveTab("upload")}
                                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
                                            activeTab === "upload"
                                                ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                                                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                                        }`}
                                    >
                                        Upload File
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("write")}
                                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
                                            activeTab === "write"
                                                ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                                                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                                        }`}
                                    >
                                        Write Text
                                    </button>
                                </div>

                                {/* Toggle Switch: Prompt or Direct Conversation */}
                                <div className="flex items-center justify-between mb-6 w-full max-w-md mx-auto">
                                    <span className="text-sm font-semibold text-blue-700 dark:text-blue-200">
                                        Prompt
                                    </span>
                                    <div className="flex-1 flex justify-center">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={!isPrompit}
                                                onChange={() =>
                                                    setIsPrompit(
                                                        (prev) => !prev
                                                    )
                                                }
                                                className="sr-only peer"
                                            />
                                            <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 dark:bg-gray-700 rounded-full peer peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-500 transition-all duration-300"></div>
                                            <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white border border-gray-300 rounded-full shadow-md transition-transform duration-300 peer-checked:translate-x-6"></div>
                                        </label>
                                    </div>
                                    <span className="text-sm font-semibold text-purple-700 dark:text-purple-200">
                                        Direct Conversation
                                    </span>
                                </div>

                                {/* Character Selector - Always visible */}
                                <div className="space-y-6">
                                    <CharacterSelector />
                                </div>

                                {/* BootCast Name Input - move here, above content input */}
                                <div className="mb-6 mt-5 w-full">
                                    <label className="block text-base font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                                        BootCast Name
                                    </label>
                                    <input
                                        type="text"
                                        value={bootcastName}
                                        onChange={(e) =>
                                            setBootcastName(e.target.value)
                                        }
                                        maxLength={64}
                                        placeholder="Enter a creative BootCast name..."
                                        className="w-full px-5 py-3 border-2 border-blue-200 dark:border-blue-700 rounded-2xl shadow focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 bg-white dark:bg-gray-800 text-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-medium"
                                    />
                                </div>

                                {/* Content based on active tab */}
                                {activeTab === "upload" ? (
                                    <div className="space-y-6">
                                        <FileUploadArea
                                            fileType="promptFile"
                                            label="Prompt File"
                                            placeholder="Upload your prompt or main content file..."
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <TextInputArea
                                            label="Prompt Text"
                                            placeholder="Enter your main content, prompt, or script here..."
                                        />
                                    </div>
                                )}

                                {/* Generate Button */}
                                <div className="mt-8">
                                    <button
                                        onClick={handleGenerate}
                                        disabled={
                                            isGenerating ||
                                            bootcastName.length <= 3 ||
                                            selectedCharacters.length !== 2 ||
                                            characterNames[0].length <= 2 ||
                                            characterNames[1].length <= 2 ||
                                            (activeTab === "upload"
                                                ? !files.promptFile
                                                : !textInput.trim()) ||
                                            (activeTab === "write" &&
                                                Object.keys(errors).length > 0)
                                        }
                                        className="w-full flex justify-center items-center py-3 px-6 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-1"
                                    >
                                        {isGenerating ? (
                                            <>
                                                <svg
                                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                </svg>
                                                Generating BootCast...
                                            </>
                                        ) : (
                                            <>
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
                                                        d="M13 10V3L4 14h7v7l9-11h-7z"
                                                    />
                                                </svg>
                                                Generate BootCast
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Tips Section */}
                            <div className={`bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-700 ${!isLoadingUserPlan && userPlan && !userPlan.canCreateBootCastes ? 'hidden' : ''}`}>
                                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                                    💡 Playground Tips
                                </h3>
                                <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                                    <li>
                                        • <strong>Prompt File:</strong> Contains
                                        your main content, script, or primary
                                        message
                                    </li>
                                    <li>
                                        • Use clear, well-structured text for
                                        best results
                                    </li>
                                    <li>
                                        • Experiment with different content
                                        combinations
                                    </li>
                                    <li>
                                        • This is a demo - results are simulated
                                        for preview
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Results Section */}
                        <div className="space-y-6">
                            <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700 ${!isLoadingUserPlan && userPlan && !userPlan.canCreateBootCastes ? 'hidden' : ''}`}>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                                    Generated BootCast
                                </h2>

                                {isGenerating ? (
                                    <div className="text-center py-12">
                                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Creating your BootCast...
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                                            This may take a few moments
                                        </p>
                                    </div>
                                ) : result ? (
                                    <div className="flex justify-center px-2">
                                        <div className="relative w-full max-w-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border-2 border-blue-200 dark:border-blue-800 flex flex-col gap-6 p-0 sm:p-0 transition-all duration-300 group">
                                            {/* Accent Bar */}
                                            <div className="hidden md:block absolute left-0 top-0 h-full w-2 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500" />
                                            {/* BootCast Name Heading */}
                                            {result.bootcastName && (
                                                <div className="w-full px-6 pt-6 pb-2 flex items-center">
                                                    <h2
                                                        className="text-2xl sm:text-3xl font-extrabold text-blue-700 dark:text-blue-200 truncate"
                                                        title={
                                                            result.bootcastName
                                                        }
                                                    >
                                                        {result.bootcastName}
                                                    </h2>
                                                </div>
                                            )}
                                            {/* Header: Avatars + Title */}
                                            <div className="flex items-center gap-4 px-6 pt-2 pb-2">
                                                <div className="relative flex items-center">
                                                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-400 to-purple-400 flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-900">
                                                        <img
                                                            src={
                                                                result
                                                                    .characterDetails[0]
                                                                    ?.image
                                                            }
                                                            alt={
                                                                result
                                                                    .characterNames[0]
                                                            }
                                                            className="w-16 h-16 rounded-full object-cover"
                                                            onError={(e) => {
                                                                e.target.src = `https://ui-avatars.com/api/?name=${result.characterNames[0]}&background=blue&color=fff&size=64`;
                                                            }}
                                                        />
                                                    </div>
                                                    {result
                                                        .characterDetails[1] && (
                                                        <div className="absolute -bottom-2 -right-4 w-12 h-12 rounded-full bg-gradient-to-tr from-purple-400 to-pink-400 flex items-center justify-center shadow-md border-4 border-white dark:border-gray-900">
                                                            <img
                                                                src={
                                                                    result
                                                                        .characterDetails[1]
                                                                        ?.image
                                                                }
                                                                alt={
                                                                    result
                                                                        .characterNames[1]
                                                                }
                                                                className="w-9 h-9 rounded-full object-cover"
                                                                onError={(
                                                                    e
                                                                ) => {
                                                                    e.target.src = `https://ui-avatars.com/api/?name=${result.characterNames[1]}&background=purple&color=fff&size=64`;
                                                                }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 flex flex-col items-start justify-center">
                                                    <span className="text-lg font-bold text-blue-900 dark:text-blue-200 mb-1">
                                                        BootCast Generated
                                                    </span>
                                                    <span className="text-sm text-gray-500 dark:text-gray-300">
                                                        {result.characterNames.join(
                                                            " & "
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                            {/* Audio Player with Wave Icon */}
                                            <div className="flex flex-col items-center justify-center px-6">
                                                <div className="w-full max-w-md bg-white/60 dark:bg-gray-800/60 backdrop-blur rounded-2xl shadow-lg p-4 flex flex-col items-center relative">
                                                    <CustomAudioPlayer
                                                        src={result.audioUrl}
                                                    />
                                                </div>
                                            </div>
                                            {/* Dialogue Content (no quote icon) */}
                                            <div className="relative w-full overflow-x-auto px-6">
                                                <div className="flex items-start bg-white/95 dark:bg-gray-800/95 rounded-2xl shadow-inner border-l-4 border-blue-500 dark:border-blue-600 p-6 relative">
                                                    <pre
                                                        className="flex-1 text-lg sm:text-xl text-gray-900 dark:text-gray-100 whitespace-pre-wrap font-sans bg-transparent border-0 shadow-none p-0 m-0"
                                                        dir="ltr"
                                                    >
                                                        {result.content}
                                                    </pre>
                                                </div>
                                            </div>
                                            {/* Actions */}
                                            <div className="flex flex-col sm:flex-row sm:space-x-4 rtl:space-x-reverse mt-2 w-full gap-3 px-6 pb-6">
                                                <button
                                                    onClick={() =>
                                                        handleDownload(
                                                            result.audioUrl,
                                                            "bootcast.wav"
                                                        )
                                                    }
                                                    disabled={downloading}
                                                    className={`flex-1 bg-blue-700 hover:bg-blue-800 text-white py-3 px-4 rounded-2xl shadow-lg transition-all duration-200 text-lg font-bold mb-2 sm:mb-0 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center ${
                                                        downloading
                                                            ? "opacity-60 cursor-not-allowed"
                                                            : ""
                                                    }`}
                                                >
                                                    {downloading
                                                        ? "Downloading..."
                                                        : "Download"}
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        navigator.clipboard.writeText(
                                                            result.audioUrl
                                                        )
                                                    }
                                                    className="flex-1 bg-purple-700 hover:bg-purple-800 text-white py-3 px-4 rounded-2xl shadow-lg transition-all duration-200 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-purple-400 text-center"
                                                >
                                                    Copy Link
                                                </button>
                                            </div>
                                            {/* UID */}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <svg
                                            className="mx-auto h-12 w-12 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 48 48"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1}
                                                d="M8 14v20c0 4.418 3.582 8 8 8s8-3.582 8-8V14M8 14c0 4.418 3.582 8 8 8s8-3.582 8-8M8 14c0-4.418 3.582-8 8-8s8 3.582 8 8m-8 6v4m-4-4h8"
                                            />
                                        </svg>
                                        <p className="mt-4 text-gray-600 dark:text-gray-400">
                                            Your generated BootCast will appear
                                            here...
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                                            Upload files or write text to get
                                            started
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Demo Info */}
                            <div className={`bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-6 border border-yellow-200 dark:border-yellow-700 ${!isLoadingUserPlan && userPlan && !userPlan.canCreateBootCastes ? 'hidden' : ''}`}>
                                <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-3">
                                    🎭 Demo Mode
                                </h3>
                                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                    This is a demonstration of the BootCast
                                    Playground. The generated content is
                                    simulated to show how the interface works.
                                    In a real implementation, this would connect
                                    to AI services to create actual BootCasts
                                    from your input.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
