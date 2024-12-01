import apiClient from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

interface ProfileDetails {
    id: string;
    name: string | null;
    avatar: string | null;
    defaultCurrency: string | null;
    credits: number;
}

export const useFetchProfileDetails = () => {
    return useQuery<ProfileDetails>({
        queryKey: ["profile"],
        queryFn: async () => {
            return (await apiClient.get({ path: "profile" })).json();
        },
    });
};
