"use client";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
const chartData = [
    { month: "January", debit: 186, credit: 80 },
    { month: "February", debit: 305, credit: 200 },
    { month: "March", debit: 237, credit: 120 },
    { month: "April", debit: 73, credit: 190 },
    { month: "May", debit: 209, credit: 130 },
    { month: "June", debit: 214, credit: 140 },
    { month: "July", debit: 305, credit: 200 },
    { month: "August", debit: 237, credit: 120 },
    { month: "September", debit: 73, credit: 190 },
    { month: "October", debit: 209, credit: 130 },
    { month: "November", debit: 73, credit: 190 },
];
const chartConfig = {
    debit: {
        label: "Desktop",
        color: "#231A97", // "hsl(var(--chart-1))",
    },
    credit: {
        label: "Mobile",
        color: "#4A3AFF", //"hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

export function TransactionSummaryChart() {
    return (
        <ChartContainer config={chartConfig} className="w-full h-full">
            <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value.slice(0, 3)} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
                <Bar dataKey="debit" fill="var(--color-debit)" radius={4} />
                <Bar dataKey="credit" fill="var(--color-credit)" radius={4} />
            </BarChart>
        </ChartContainer>
    );
}
