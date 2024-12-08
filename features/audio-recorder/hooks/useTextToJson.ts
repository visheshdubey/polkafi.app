import apiClient from "@/lib/api-client";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

interface TextToJsonOptions {
    onSuccess?: (data: any) => void;
    onError?: (error: Error) => void;
}

interface TextToJsonRequest {
    text: string;
}

const convertTextToJson = async (text: TextToJsonRequest): Promise<any> => {
    const response = await apiClient.post({
        path: "transaction/text-to-json",
        data: text,
    });

    if (!response.ok) {
        throw new Error("Failed to convert text to JSON");
    }

    return response.json();
};

export function useTextToJson(options: TextToJsonOptions = {}) {
    const { onSuccess, onError } = options;

    return useMutation({
        mutationFn: convertTextToJson,
        onSuccess,
        onError: (error: Error) => {
            toast.error("Failed to convert text", {
                description: error.message || "Please try again later",
            });
            onError?.(error);
        },
    });
} 