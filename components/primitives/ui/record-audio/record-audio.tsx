"use client";

import * as React from "react";

import { Slot } from "@radix-ui/react-slot";
import Waveform from "@/components/primitives/ui/record-audio/WaveformAnimation";
import { cn } from "@/lib/utils";
import { useAudioRecorder } from "./useAudioRecorder";

export function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

interface RecorderContextValue {
    isRecording: boolean;
    timeLeft: number;
    audioBlob: Blob | null;
    startRecording: () => Promise<void>;
    stopRecording: () => void;
    resetRecording: () => void;
    error: string | null;
    hasPermission: boolean;
}

const RecorderContext = React.createContext<RecorderContextValue | undefined>(undefined);

function useRecorder() {
    const context = React.useContext(RecorderContext);
    if (!context) {
        throw new Error("useRecorder must be used within a Recorder");
    }
    return context;
}

interface RecorderProps extends React.HTMLAttributes<HTMLDivElement> {
    maxDuration: number;
    onComplete?: (blob: Blob | null) => void;
    onRecChange?: (state: Boolean) => void;
    asChild?: boolean;
}

function Recorder({ maxDuration, onComplete, onRecChange, children, asChild, className, ...props }: RecorderProps) {
    const Comp = asChild ? Slot : "div";
    const recorder = useAudioRecorder({ maxDuration, onComplete, onRecChange });

    return (
        <RecorderContext.Provider value={recorder}>
            <Comp className={cn("relative", className)} {...props}>
                {children}
            </Comp>
        </RecorderContext.Provider>
    );
}

interface RecorderTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean;
}

function RecorderTrigger({ className, asChild = false, ...props }: RecorderTriggerProps) {
    const { isRecording, startRecording, stopRecording, hasPermission } = useRecorder();
    const Comp = asChild ? Slot : "button";

    return (
        <Comp
            className={cn(
                "inline-flex items-center justify-center rounded-md",
                "disabled:pointer-events-none disabled:opacity-50",
                className,
            )}
            onClick={async () => {
                if (isRecording) {
                    stopRecording();
                } else {
                    await startRecording();
                }
            }}
            disabled={!hasPermission && !isRecording}
            {...props}
        />
    );
}

interface RecorderWaveformProps extends React.HTMLAttributes<HTMLDivElement> {
    barCount?: number;
    minHeight?: number;
    maxHeight?: number;
}

function RecorderWaveform({ className, barCount = 40, minHeight = 0.1, maxHeight = 1, ...props }: RecorderWaveformProps) {
    const { isRecording } = useRecorder();

    return (
        <div className={cn("min-w-[200px]", className)} {...props}>
            <Waveform isPlaying={isRecording} barCount={barCount} minHeight={minHeight} maxHeight={maxHeight} />
        </div>
    );
}

interface RecorderResetProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean;
}

function RecorderReset({ className, asChild = false, ...props }: RecorderResetProps) {
    const { resetRecording, audioBlob, isRecording } = useRecorder();
    const Comp = asChild ? Slot : "button";

    if (!audioBlob || isRecording) return null;

    return <Comp className={cn("inline-flex items-center justify-center rounded-md", className)} onClick={resetRecording} {...props} />;
}

interface RecorderTimeProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
}

function RecorderTime({ className, asChild = false, ...props }: RecorderTimeProps) {
    const { timeLeft } = useRecorder();
    const Comp = asChild ? Slot : "div";

    return (
        <Comp className={cn("text-sm font-medium", className)} {...props}>
            {formatTime(timeLeft)}
        </Comp>
    );
}

interface RecorderErrorProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
}

function RecorderError({ className, asChild = false, ...props }: RecorderErrorProps) {
    const { error } = useRecorder();
    const Comp = asChild ? Slot : "div";

    if (!error) return null;

    return (
        <Comp className={cn("text-sm text-destructive", className)} {...props}>
            {error}
        </Comp>
    );
}

export { Recorder, RecorderTrigger, RecorderWaveform, RecorderReset, RecorderTime, RecorderError, useRecorder };
