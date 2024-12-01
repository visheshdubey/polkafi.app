import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Category } from "@prisma/client";
import { QUERY_KEYS } from "@/lib/api-client/query-keys";
import apiClient from "@/lib/api-client";
import { toast } from "sonner";

interface CreateCategoryParams {
    data: {
        name: string;
    };
}

const createCategory = async ({ data }: CreateCategoryParams): Promise<Category> => {
    const response = await apiClient.post({
        path: "category",
        data,
    });
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
        onError: (error) => {
            toast.error("Failed to create category");
        },
    });
} 