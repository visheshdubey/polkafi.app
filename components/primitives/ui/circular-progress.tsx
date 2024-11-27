"use client";

import * as React from "react";

import { cn } from "@/lib/utils/shadcn";

interface CircularProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: number;
    size?: number;
    strokeWidth?: number;
}

const CircularProgress = React.forwardRef<HTMLDivElement, CircularProgressProps>(
    ({ className, value = 0, size = 40, strokeWidth = 4, ...props }, ref) => {
        const radius = (size - strokeWidth) / 2;
        const circumference = 2 * Math.PI * radius;
        const strokeDashoffset = circumference - (value / 100) * circumference;

        return (
            <div ref={ref} className={cn("relative", className)} style={{ width: size, height: size }} {...props}>
                <svg className="rotate-[-90deg]" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    {/* Background circle */}
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
                        className="text-primary transition-all duration-300 ease-in-out"
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
                <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">{value}%</div>
            </div>
        );
    },
);
CircularProgress.displayName = "CircularProgress";

export { CircularProgress };
