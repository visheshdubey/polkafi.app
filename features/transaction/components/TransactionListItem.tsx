export type TransactionType = "credit" | "debit";

export interface TransactionListItemProps {
    transactionId: string;
    description: string;
    amount: number;
    date: string | Date;
    category?: string;
    type?: TransactionType;
    className?: string;
}

import { Badge } from "@/components/ui/badge";
import React from "react";
import { cn } from "@/lib/utils";

const TransactionListItem: React.FC<TransactionListItemProps> = ({
    transactionId,
    description,
    amount,
    date,
    category,
    type = "credit",
    className,
}) => {
    const isCredit = type.toLowerCase() === "credit";

    const amountColor = isCredit ? "text-green-700" : "text-red-700";
    const typeColor = isCredit ? "text-green-800 bg-green-600/10" : "text-red-800 bg-red-600/10";

    const formattedAmount = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(Math.abs(amount));

    const formattedDate =
        date instanceof Date
            ? date.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
              })
            : new Date(date).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
              });

    return (
        <div className={cn("bg-white flex justify-between items-center lg:items-end gap-2 w-full p-3 lg:p-4", className)}>
            <div className="flex flex-col gap-1 lg:gap-2">
                <span className="text-[11px] text-neutral-400">{transactionId}</span>
                <div className="flex items-center flex-wrap gap-3 lg:gap-6">
                    <div className="text-base/[120%] lg:text-lg font-medium text-neutral-800">{description}</div>
                    <div className="flex *:rounded-full items-center flex-wrap gap-2">
                        {category && (
                            <Badge variant="secondary" className="font-normal">
                                {category}
                            </Badge>
                        )}
                        <Badge variant="secondary" className="font-normal">
                            {formattedDate}
                        </Badge>
                        <Badge variant="secondary" className={cn("font-normal", typeColor)}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </Badge>
                    </div>
                </div>
            </div>
            <span className={cn("text-lg font-bold", amountColor)}>{formattedAmount}</span>
        </div>
    );
};

export default TransactionListItem;
