"use client";

import { useEffect, useRef } from "react";

interface WaveformProps {
    barCount?: number;
    height?: string;
    isPlaying?: boolean;
    minHeight?: number;
    maxHeight?: number;
}

const DEFAULT_SCALE = 0.2;
const DEFAULT_ANIMATION_DURATION = 200;

const Waveform = ({ barCount = 40, height = "50px", isPlaying = false, minHeight = 0.1, maxHeight = 1 }: WaveformProps) => {
    const barsRef = useRef<HTMLDivElement[]>([]);
    const animationFramesRef = useRef<number[]>([]);
    const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

    const getRandomHeight = () => minHeight + Math.random() * (maxHeight - minHeight);
    const getRandomDuration = () => DEFAULT_ANIMATION_DURATION + Math.random() * DEFAULT_ANIMATION_DURATION;

    const cleanupAnimations = () => {
        animationFramesRef.current.forEach(cancelAnimationFrame);
        animationFramesRef.current = [];

        timeoutsRef.current.forEach(clearTimeout);
        timeoutsRef.current = [];

        barsRef.current.forEach((bar) => {
            if (bar) bar.style.transform = `scaleY(${DEFAULT_SCALE})`;
        });
    };

    const animateBar = (bar: HTMLDivElement) => {
        if (!isPlaying || !bar) return;

        const animate = () => {
            if (!isPlaying) return;

            bar.style.transform = `scaleY(${getRandomHeight()})`;

            const timeoutId = setTimeout(() => {
                if (isPlaying) {
                    const frameId = requestAnimationFrame(animate);
                    animationFramesRef.current.push(frameId);
                }
            }, getRandomDuration());

            timeoutsRef.current.push(timeoutId);
        };

        const frameId = requestAnimationFrame(animate);
        animationFramesRef.current.push(frameId);
    };

    useEffect(() => {
        if (isPlaying) {
            barsRef.current.forEach((bar) => bar && animateBar(bar));
        } else {
            cleanupAnimations();
        }

        return cleanupAnimations;
    }, [isPlaying]);

    return (
        <div className="flex items-center justify-center gap-[2px]" style={{ height }}>
            {Array(barCount)
                .fill(null)
                .map((_, index) => (
                    <div
                        key={index}
                        ref={(el) => {
                            if (el) barsRef.current[index] = el;
                        }}
                        className="w-1 h-full bg-brand rounded-full transition-transform"
                        style={{
                            transform: `scaleY(${DEFAULT_SCALE})`,
                            transition: "transform 200ms ease",
                        }}
                    />
                ))}
        </div>
    );
};

export default Waveform;
