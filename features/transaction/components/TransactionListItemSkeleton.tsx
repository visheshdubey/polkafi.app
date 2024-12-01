import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface TransactionListItemSkeletonProps {
    className?: string;
}

const TransactionListItemSkeleton: React.FC<TransactionListItemSkeletonProps> = ({ className }) => {
    return (
        <div className={cn("bg-white flex justify-between items-center lg:items-end gap-2 w-full p-3 lg:p-4", className)}>
            <div className="flex flex-col gap-1 lg:gap-2">
                <Skeleton className="h-3 w-20 bg-neutral-100" /> {/* Transaction ID */}
                <div className="flex items-center flex-wrap gap-3 lg:gap-6">
                    <Skeleton className="h-6 w-40 bg-neutral-100" /> {/* Description */}
                    <div className="flex *:rounded-full items-center flex-wrap gap-2">
                        <Skeleton className="h-5 w-20 bg-neutral-100" /> {/* Category */}
                        <Skeleton className="h-5 w-24 bg-neutral-100" /> {/* Date */}
                        <Skeleton className="h-5 w-16 bg-neutral-100" /> {/* Type */}
                    </div>
                </div>
            </div>
            <Skeleton className="h-7 w-24" /> {/* Amount */}
        </div>
    );
};

export default TransactionListItemSkeleton;
