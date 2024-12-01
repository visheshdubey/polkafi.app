import { useEffect, useRef, useState } from "react";

import { RecordingState } from "./record-audio";

interface UseAudioRecorderProps {
    maxDuration: number;
    onComplete?: (blob: Blob | null) => void;
    onRecChange?: (state: Boolean) => void;
    onStateChange?: (state: RecordingState) => void;
}

interface UseAudioRecorderReturn {
    isRecording: boolean;
    timeLeft: number;
    audioBlob: Blob | null;
    startRecording: () => Promise<void>;
    stopRecording: () => void;
    resetRecording: () => void;
    discardRecording: () => void;
    error: string | null;
    hasPermission: boolean;
}

export function useAudioRecorder({ maxDuration, onComplete, onRecChange, onStateChange }: UseAudioRecorderProps): UseAudioRecorderReturn {
    const [isRecording, setIsRecording] = useState(false);
    const [timeLeft, setTimeLeft] = useState(maxDuration);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [hasPermission, setHasPermission] = useState(false);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        requestPermission();
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
            }
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (timeLeft === 0) {
            stopRecording();
        }
    }, [timeLeft]);

    //TODO: Investigate
    useEffect(() => {
        if (!isRecording && audioBlob) {
            onComplete?.(audioBlob);
        }
    }, [isRecording, audioBlob]);

    const requestPermission = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            setHasPermission(true);
            setError(null);
        } catch (err) {
            setError("Microphone permission denied");
            setHasPermission(false);
        }
    };

    const startRecording = async () => {
        if (!hasPermission) {
            await requestPermission();
        }

        try {
            if (!streamRef.current) {
                throw new Error("No audio stream available");
            }

            chunksRef.current = [];
            mediaRecorderRef.current = new MediaRecorder(streamRef.current);

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: "audio/webm" });
                console.log(123);

                setAudioBlob(blob);
            };

            setTimeLeft(maxDuration);
            mediaRecorderRef.current.start();
            setIsRecording(true);
            onRecChange?.(true);
            onStateChange?.("recording");

            // Start timer
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        stopRecording();

                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } catch (err) {
            setError("Failed to start recording");
            onStateChange?.("idle");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            onRecChange?.(false);
            setIsRecording(false);
            onStateChange?.("stopped");

            if (timerRef.current) {
                clearInterval(timerRef.current);
                setTimeLeft(0);
            }
        }
    };

    const resetRecording = () => {
        setAudioBlob(null);
        setTimeLeft(maxDuration);
        setError(null);
        onStateChange?.("idle");
    };

    const discardRecording = () => {
        setAudioBlob(null);
        setTimeLeft(maxDuration);
        setError(null);
        onStateChange?.("idle");
    };

    return {
        isRecording,
        timeLeft,
        audioBlob,
        startRecording,
        stopRecording,
        resetRecording,
        discardRecording,
        error,
        hasPermission,
    };
}
