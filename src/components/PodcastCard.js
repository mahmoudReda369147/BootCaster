import React from "react";
import { FaDownload, FaShareAlt } from "react-icons/fa";

// مكون مشغل الصوت المخصص (من الديمو)
function CustomAudioPlayer({ src }) {
    const audioRef = React.useRef(null);
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [currentTime, setCurrentTime] = React.useState(0);
    const [duration, setDuration] = React.useState(0);

    React.useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);
        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);
        audio.addEventListener('ended', () => setIsPlaying(false));
        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
            audio.removeEventListener('ended', () => setIsPlaying(false));
        };
    }, []);

    React.useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        let playPromise;
        if (isPlaying) {
            playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch((error) => {
                    // Ignore AbortError, log others
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
        if (isNaN(t)) return '0:00';
        const m = Math.floor(t / 60);
        const s = Math.floor(t % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    return (
        <div className="w-full flex items-center space-x-4 rtl:space-x-reverse bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 rounded-xl px-4 py-3 shadow-md border border-blue-200 dark:border-blue-700">
            <button
                onClick={togglePlay}
                className="flex items-center justify-center w-12 h-12 rounded-full shadow-lg bg-gradient-to-tr from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label={isPlaying ? 'إيقاف' : 'تشغيل'}
            >
                {isPlaying ? (
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="2" /><rect x="14" y="5" width="4" height="14" rx="2" /></svg>
                ) : (
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21 5,3" /></svg>
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
                        style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
                    />
                </div>
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300 mt-1 font-mono">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>
            <audio ref={audioRef} src={src} preload="metadata" style={{ display: 'none' }} />
        </div>
    );
}

export default function PodcastCard({
    title,
    date,
    duration,
    audioUrl,
   
 
    characterImages = [],
    characterNames = [],
    onDownload,
    onShare,
}) {
    return (
        <div className="relative w-full max-w-2xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-blue-200 dark:border-blue-800 flex flex-col gap-6 p-0 transition-all duration-300 group mx-auto my-8">
            {/* Accent Bar */}
            <div className="hidden md:block absolute left-0 top-0 h-full w-2 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 z-10" />
            {/* Header: Avatars + Title */}
            <div className="flex items-center gap-6 px-8 pt-8 pb-2 relative z-20">
                <div className="relative flex items-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-400 to-purple-400 flex items-center justify-center shadow-xl border-4 border-white dark:border-gray-900 ring-4 ring-blue-200 dark:ring-blue-900">
                        {characterImages[0] ? (
                            <img src={characterImages[0]} alt={characterNames[0] || ""} className="w-16 h-16 rounded-full object-cover" />
                        ) : (
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                        )}
                    </div>
                    {characterImages[1] && (
                        <div className="absolute -bottom-2 -right-6 w-14 h-14 rounded-full bg-gradient-to-tr from-purple-400 to-pink-400 flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-900 ring-2 ring-pink-200 dark:ring-pink-900">
                            <img src={characterImages[1]} alt={characterNames[1] || ""} className="w-10 h-10 rounded-full object-cover" />
                        </div>
                    )}
                </div>
                <div className="flex-1 flex flex-col items-start justify-center">
                    <span className="text-2xl font-extrabold text-blue-900 dark:text-blue-200 mb-1 drop-shadow">{title}</span>
                    <span className="text-base text-gray-500 dark:text-gray-300 font-medium">{characterNames.join(' & ')}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">{date} • {duration}</span>
                </div>
            </div>
            {/* Audio Player or Error */}
            <div className="flex flex-col items-center justify-center px-8">
                <div className="w-full max-w-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg p-6 flex flex-col items-center relative border border-blue-100 dark:border-blue-900">
                <CustomAudioPlayer src={audioUrl} />
                </div>
            </div>
           
            {/* Actions */}
            <div className="flex flex-row justify-end gap-4 px-8 pb-8 mt-2 w-full">
                <button
                    onClick={onDownload}
                    className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white py-2 px-5 rounded-2xl shadow-lg transition-all duration-200 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-400"
                    title="تحميل البودكاست"
                >
                    <FaDownload className="inline-block mb-0.5" />
                    <span className="hidden sm:inline">Download</span>
                </button>
                <button
                    onClick={onShare}
                    className="flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white py-2 px-5 rounded-2xl shadow-lg transition-all duration-200 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-purple-400"
                    title="مشاركة البودكاست"
                >
                    <FaShareAlt className="inline-block mb-0.5" />
                    <span className="hidden sm:inline">Share</span>
                </button>
            </div>
        </div>
    );
} 