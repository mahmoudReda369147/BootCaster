"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";

export default function WaveformPlayer({ src }) {
    const [playing, setPlaying] = useState(false);
    const audioRef = useRef(null);

    const handlePlayPause = () => {
        if (playing) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setPlaying(!playing);
    };

    return (
        <div className="w-full flex flex-col items-center">
            <audio
                ref={audioRef}
                src={src}
                onEnded={() => setPlaying(false)}
                className="hidden"
            />
            <button
                onClick={handlePlayPause}
                className="mb-4 w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition"
            >
                {playing ? (
                    <svg
                        width="32"
                        height="32"
                        fill="none"
                        stroke="currentColor"
                        className="text-white"
                    >
                        <rect x="8" y="8" width="6" height="16" rx="2" />
                        <rect x="18" y="8" width="6" height="16" rx="2" />
                    </svg>
                ) : (
                    <svg
                        width="32"
                        height="32"
                        fill="none"
                        stroke="currentColor"
                        className="text-white"
                    >
                        <path d="M8 5v22l18-11z" />
                    </svg>
                )}
            </button>
            <div className="w-full max-w-xl flex items-end gap-1 h-16">
                {[...Array(40)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            height: playing
                                ? `${Math.random() * 60 + 20}px`
                                : "20px",
                        }}
                        transition={{ duration: 0.3 }}
                        className="w-1 rounded bg-purple-400"
                        style={{ minHeight: 8 }}
                    />
                ))}
            </div>
        </div>
    );
}
