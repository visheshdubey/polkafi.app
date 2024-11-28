"use client";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
    debit: {
        label: "Debit",
        color: "#231A97", // "hsl(var(--chart-1))",
    },
    credit: {
        label: "Credit",
        color: "#4A3AFF", //"hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

export type TransactionSummaryChartProps = {
    data: {
        key: string;
        debit: number;
        credit: number;
    }[];
};

export function TransactionSummaryChart({ data }: TransactionSummaryChartProps) {
    return (
        <ChartContainer config={chartConfig} className="w-full h-full">
            <BarChart accessibilityLayer data={data}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="key" tickLine={false} tickMargin={10} axisLine={false} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
                <Bar dataKey="debit" fill="var(--color-debit)" radius={4} />
                <Bar dataKey="credit" fill="var(--color-credit)" radius={4} />
            </BarChart>
        </ChartContainer>
    );
}
