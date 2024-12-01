"use client";

import { useEffect, useRef } from "react";

const Waveform = ({ barCount = 40, height = "50px", isPlaying = false, minHeight = 0.1, maxHeight = 1 }) => {
    const barsRef = useRef<HTMLDivElement[]>([]);
    const animationFramesRef = useRef<number[]>([]);
    const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

    const cleanupAnimations = () => {
        animationFramesRef.current.forEach((frameId) => {
            cancelAnimationFrame(frameId);
        });
        animationFramesRef.current = [];

        timeoutsRef.current.forEach((timeoutId) => {
            clearTimeout(timeoutId);
        });
        timeoutsRef.current = [];

        barsRef.current.forEach((bar) => {
            if (bar) {
                bar.style.transform = "scaleY(0.2)";
            }
        });
    };

    useEffect(() => {
        if (isPlaying) {
            barsRef.current.forEach((bar) => {
                if (!bar) return;
                animateBar(bar);
            });
        } else {
            cleanupAnimations();
        }

        return () => {
            cleanupAnimations();
        };
    }, [isPlaying]);

    const animateBar = (bar: HTMLDivElement) => {
        if (!isPlaying || !bar) return;

        const getRandomHeight = () => minHeight + Math.random() * (maxHeight - minHeight);

        const animate = () => {
            if (!isPlaying) return;

            const newHeight = getRandomHeight();
            bar.style.transform = `scaleY(${newHeight})`;

            const duration = 200 + Math.random() * 200;
            const timeoutId = setTimeout(() => {
                if (isPlaying) {
                    const frameId = requestAnimationFrame(animate);
                    animationFramesRef.current.push(frameId);
                }
            }, duration);

            timeoutsRef.current.push(timeoutId);
        };

        const frameId = requestAnimationFrame(animate);
        animationFramesRef.current.push(frameId);
    };

    return (
        <div className="flex items-center justify-center gap-[2px]" style={{ height }}>
            {Array(barCount)
                .fill(null)
                .map((_, i) => (
                    <div
                        key={i}
                        ref={(el) => {
                            if (el) barsRef.current[i] = el;
                        }}
                        className="w-1 h-full bg-brand rounded-full transition-transform"
                        style={{
                            transform: "scaleY(0.2)",
                            transition: "transform 200ms ease",
                        }}
                    />
                ))}
        </div>
    );
};

export default Waveform;
