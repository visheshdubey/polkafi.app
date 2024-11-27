"use client";

import * as React from "react";

import { Pause, Play, RotateCcw } from "lucide-react";

import { cn } from "@/lib/utils/shadcn";

interface RecordProgressButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    size?: number;
    strokeWidth?: number;
    duration?: number;
    onDurationComplete?: () => void;
    isLoading?: boolean;
}

const RecordProgressButton = React.forwardRef<HTMLButtonElement, RecordProgressButtonProps>(
    (
        {
            className,
            size = 64,
            strokeWidth = 4,
            duration = 3000, // 3 seconds by default
            onDurationComplete,
            isLoading = false,
            ...props
        },
        ref,
    ) => {
        const [currentValue, setCurrentValue] = React.useState(0);
        const [isRecording, setIsRecording] = React.useState(false);
        const [isComplete, setIsComplete] = React.useState(false);
        const animationRef = React.useRef<NodeJS.Timeout>();

        const radius = (size - strokeWidth) / 2;
        const circumference = 2 * Math.PI * radius;
        const strokeDashoffset = circumference - (currentValue / 100) * circumference;

        const handleClick = () => {
            if (isComplete) {
                // Reset state
                setCurrentValue(0);
                setIsComplete(false);
                setIsRecording(false);
                return;
            }

            if (isRecording) {
                // Stop recording
                if (animationRef.current) {
                    clearInterval(animationRef.current);
                }
                setCurrentValue(0);
                setIsRecording(false);
            } else {
                // Start recording
                setIsRecording(true);
                const stepDuration = duration / 100; // Time for each 1% increment

                const animate = () => {
                    setCurrentValue((prev) => {
                        if (prev >= 100) {
                            if (animationRef.current) {
                                clearInterval(animationRef.current);
                            }
                            setIsComplete(true);
                            setIsRecording(false);
                            onDurationComplete?.();
                            return 100;
                        }
                        return prev + 1;
                    });
                };

                animationRef.current = setInterval(animate, stepDuration);
            }
        };

        React.useEffect(() => {
            return () => {
                if (animationRef.current) {
                    clearInterval(animationRef.current);
                }
            };
        }, []);

        return (
            <button
                ref={ref}
                className={cn(
                    "relative outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    className,
                )}
                onClick={handleClick}
                disabled={isLoading}
                {...props}
            >
                <div className="relative" style={{ width: size, height: size }}>
                    {/* Background circle */}
                    <svg className="rotate-[-90deg] absolute inset-0" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                        <circle
                            className="text-primary/20"
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="none"
                            strokeWidth={strokeWidth}
                            stroke="currentColor"
                        />
                        {/* Progress circle */}
                        <circle
                            className="text-primary transition-all duration-200 ease-linear"
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="none"
                            strokeWidth={strokeWidth}
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                        />
                    </svg>

                    {/* Inner button */}
                    <div
                        className={cn(
                            "absolute inset-0 flex items-center justify-center",
                            "transition-transform duration-200",
                            isRecording && "scale-90",
                        )}
                    >
                        <div
                            className={cn(
                                "w-3/4 h-3/4 rounded-full bg-primary flex items-center justify-center",
                                "transition-colors duration-200",
                                isRecording && "bg-red-500",
                            )}
                        >
                            {isComplete ? (
                                <RotateCcw className="w-1/2 h-1/2 text-white" />
                            ) : isRecording ? (
                                <Pause className="w-1/2 h-1/2 text-white" />
                            ) : (
                                <Play className="w-1/2 h-1/2 text-white translate-x-0.5" />
                            )}
                        </div>
                    </div>

                    {/* Loading spinner */}
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
                            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        </div>
                    )}
                </div>
            </button>
        );
    },
);
RecordProgressButton.displayName = "RecordProgressButton";

export { RecordProgressButton };
