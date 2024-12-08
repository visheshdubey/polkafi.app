import { QUERY_KEYS } from "@/lib/api-client/query-keys";
import apiClient from "@/lib/api-client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

export interface ChartData {
    time_bucket: string
    debit: string
    credit: string
}

export function useDashboardStats(filters: Record<string, unknown>) {
    const query = useQuery({
        queryKey: [QUERY_KEYS.DashboardStats, filters],
        queryFn: async () => {
            const response = await apiClient.get({
                path: `dashboard-stats`,
                params: {
                    ...filters,
                },
            });
            const data = await response.json();

            if (data.charts) {
                data.charts = data.charts.reverse();
            }

            return data;
        }
    });

    const { error } = query;

    if (error) {
        toast.error("Failed to fetch dashboard stats", {
            description: error.message || "Please try again later",
        });
    }

    return query;
} 
