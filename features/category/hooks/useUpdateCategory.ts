import { useMutation, useQueryClient } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/lib/api-client/query-keys";
import apiClient from "@/lib/api-client";

interface UpdateCategoryData {
    id: string;
    data: {
        name: string;
    };
}

const updateCategory = async ({ id, data }: UpdateCategoryData) => {
    return await (
        await apiClient.put({
            path: `category/${id}`,
            data,
        })
    ).json();
};

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.categories] });
        },
    });
};
