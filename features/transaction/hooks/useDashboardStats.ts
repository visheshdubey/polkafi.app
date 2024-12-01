import apiClient from "@/lib/api-client";
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
    return useQuery({
        queryKey: ['dashboard-stats', dayRange],
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
} 