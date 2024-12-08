"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { dashboardStatsDayRangeOptionLabels, dashboardStatsDayRangeOptions } from "@/lib/entities";

import { cn } from "@/lib/utils";

interface DateRangePickerProps {
    value: number[];
    className?: string;
    onChange: (value: number[]) => void;
}

export function DateRangePicker({ className, value, onChange }: DateRangePickerProps) {
    return (
        <Select value={value[0].toString()} onValueChange={(value) => onChange([parseInt(value)])}>
            <SelectTrigger className={cn("h-8 w-[160px]  gap-1 text-xs", className)}>
                <SelectValue placeholder="Select Type" className="text-xs" />
            </SelectTrigger>
            <SelectContent>
                {Object.values(dashboardStatsDayRangeOptions).map((option) => (
                    <SelectItem key={option} value={option.toString()}>
                        {dashboardStatsDayRangeOptionLabels[option]}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
