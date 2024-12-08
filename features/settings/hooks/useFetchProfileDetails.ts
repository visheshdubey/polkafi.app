import { QUERY_KEYS } from "@/lib/api-client/query-keys";
import apiClient from "@/lib/api-client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

interface ProfileDetails {
    id: string;
    name: string | null;
    avatar: string | null;
    defaultCurrency: string | null;
    credits: number;
}

export const useFetchProfileDetails = () => {
    const query = useQuery<ProfileDetails>({
        queryKey: [QUERY_KEYS.Profile],
        queryFn: async () => {
            const response = await apiClient.get({ path: "profile" });
            if (!response.ok) {
                throw new Error("Failed to fetch profile details");
            }
            return response.json();
        },
    });

    const { error } = query;

    if (error) {
        toast.error("Failed to fetch profile details", {
            description: error.message || "Please try again later",
        });
    }

    return query;
};
