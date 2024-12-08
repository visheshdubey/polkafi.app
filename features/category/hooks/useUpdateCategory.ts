import { useMutation, useQueryClient } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/lib/api-client/query-keys";
import apiClient from "@/lib/api-client";
import { toast } from "sonner";

interface UpdateCategoryData {
    id: string;
    data: {
        name: string;
    };
}

const updateCategory = async ({ id, data }: UpdateCategoryData) => {
    const response = await apiClient.put({
        path: `category/${id}`,
        data,
    });
    if (!response.ok) {
        throw new Error("Failed to update category");
    }
    return response.json();
};

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CategoriesList] });
            toast.success("Category updated successfully");
        },
        onError: (error) => {
            toast.error("Failed to update category");
        },
    });
};
