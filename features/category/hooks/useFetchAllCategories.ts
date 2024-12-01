import { QUERY_KEYS } from "@/lib/api-client/query-keys";
import apiClient from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

interface Category {
    id: string;
    name: string;
    label: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
}

const fetchCategories = async (): Promise<Category[]> => {
    return await (await apiClient.get({ path: 'category' })).json();
};

export const useFetchAllCategories = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.categories],
        queryFn: fetchCategories,
    });
}; 