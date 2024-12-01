import apiClient from "@/lib/api-client";
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
    return response.json();
};

export function useSpeechToText(options: SpeechToTextOptions = {}) {
    const { onSuccess, onError } = options;

    return useMutation({
        mutationFn: transcribeAudio,
        onSuccess,
        onError,
    });
}
