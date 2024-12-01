import { QUERY_KEYS } from "@/lib/api-client/query-keys";
import apiClient from "@/lib/api-client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

export interface ChartData {
    time_bucket: string
    debit: string
    credit: string
}

function formatDate(dateString: string, dayRange: number) {
    const date = new Date(dateString);

    // For ranges between 180-365 days, show only month
    if (dayRange > 180) {
        return date.toLocaleString('default', { month: 'short' });
    }

    // For ranges 1-180 days, show DD/MM
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
}

export function useDashboardStats(dayRange: number) {
    const query = useQuery({
        queryKey: [QUERY_KEYS.DashboardStats, dayRange],
        queryFn: async () => {
            const response = await apiClient.get({
                path: `dashboard-stats?dayRange=${dayRange}`
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
