import { useMutation, useQueryClient } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/lib/api-client/query-keys";
import apiClient from "@/lib/api-client";

interface UpdateProfileData {
    name: string;
}

interface ProfileDetails {
    id: string;
    name: string | null;
    avatar: string | null;
    defaultCurrency: string | null;
    credits: number;
}

export const useUpdateProfileDetails = () => {
    const queryClient = useQueryClient();

    return useMutation<ProfileDetails, Error, UpdateProfileData>({
        mutationFn: async (data) => {
            return (await apiClient.put({ path: "profile", data })).json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.Profile] });
        },
    });
};
