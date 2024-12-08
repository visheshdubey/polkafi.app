import apiClient from "@/lib/api-client";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

interface SpeechToTextOptions {
    onSuccess?: (text: { text: string }) => void;
    onError?: (error: Error) => void;
}

const transcribeAudio = async (audioBlob: Blob): Promise<{ text: string }> => {
    const audioFile = new File(
        [audioBlob],
        `audio-${Date.now()}.webm`,
        { type: audioBlob.type || 'audio/webm' }
    );

    const formData = new FormData();
    formData.append("file", audioFile);

    const response = await apiClient.post({
        path: "transaction/speech-to-text",
        formData,
    });
    if (!response.ok) {
        throw new Error("Failed to transcribe audio");
    }
    return response.json();
};

export function useSpeechToText(options: SpeechToTextOptions = {}) {
    const { onSuccess, onError } = options;

    return useMutation({
        mutationFn: transcribeAudio,
        onSuccess,
        onError: (error: Error) => {
            toast.error("Failed to transcribe audio", {
                description: error.message || "Please try again later",
            });
            onError?.(error);
        },
    });
}
