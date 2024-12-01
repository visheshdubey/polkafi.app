import apiClient from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";

interface TextToJsonOptions {
    onSuccess?: (data: any) => void;
    onError?: (error: Error) => void;
}

const convertTextToJson = async (text: { text: string }): Promise<any> => {
    const response = await apiClient.post({
        path: "transaction/text-to-json",
        data: text,
    });
    return response.json();
};

export function useTextToJson(options: TextToJsonOptions = {}) {
    const { onSuccess, onError } = options;

    return useMutation({
        mutationFn: convertTextToJson,
        onSuccess,
        onError,
    });
} 