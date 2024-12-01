import { cn } from "@/lib/utils";
import { formatCompactNumber } from "@/lib/utils/currency";

type Props = {
    label: string;
    value: string;
    variant?: "default" | "danger";
    className?: string;
};

const KpiCard = ({ label, value, variant = "default", className }: Props) => {
    const isAmountNegative = Number(value) < 0;
    const isValueNaN = Number.isNaN(Number(value));
    return (
        <div className={cn("flex px-6 border-r flex-col gap-4", className)}>
            <p className="text-xs font-medium text-neutral-500">{label}</p>
            <p className={`text-5xl font-bold tracking-tighter ${isAmountNegative ? "text-red-800" : "text-neutral-800"}`}>
                {isValueNaN ? "--" : `${isAmountNegative ? "-" : ""}$${formatCompactNumber(Math.abs(Number(value)))}`}
            </p>
        </div>
    );
};

export default KpiCard;
