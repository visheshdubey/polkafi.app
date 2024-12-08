import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Category } from "@prisma/client";
import { QUERY_KEYS } from "@/lib/api-client/query-keys";
import apiClient from "@/lib/api-client";
import { toast } from "sonner";

interface CreateCategoryRequest {
    data: {
        name: string;
    };
}

const createCategory = async ({ data }: CreateCategoryRequest): Promise<Category> => {
    const response = await apiClient.post({
        path: "category",
        data,
    });

    if (!response.ok) {
        throw new Error("Failed to create category");
    }

    return response.json();
};

export function useCreateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CategoriesList] });
            toast.success("Category created successfully");
        },
        onError: (error: Error) => {
            toast.error("Failed to create category", {
                description: error.message || "Please try again later",
            });
        },
    });
} 