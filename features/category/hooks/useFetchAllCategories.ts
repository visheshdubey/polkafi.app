import { QUERY_KEYS } from "@/lib/api-client/query-keys";
import apiClient from "@/lib/api-client";
import { toast } from "sonner";
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
    const response = await apiClient.get({ path: 'category' });
    if (!response.ok) {
        throw new Error("Failed to fetch categories");
    }
    return response.json();
};

export const useFetchAllCategories = () => {
    const query = useQuery({
        queryKey: [QUERY_KEYS.CategoriesList],
        queryFn: fetchCategories,
    });

    const { error } = query;

    if (error) {
        toast.error("Failed to fetch categories", {
            description: error.message || "Please try again later",
        });
    }

    return query;
}; 