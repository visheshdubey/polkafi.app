import { cn } from "@/lib/utils";

type Props = {
    label: string;
    value: string;
    variant?: "default" | "danger";
    className?: string;
};

const KpiCard = ({ label, value, variant = "default", className }: Props) => {
    return (
        <div className={cn("flex px-6 border-r flex-col gap-4", className)}>
            <p className="text-xs font-medium text-neutral-500">{label}</p>
            <p className={`text-5xl font-bold tracking-tighter ${variant === "danger" ? "text-red-800" : "text-neutral-800"}`}>{value}</p>
        </div>
    );
};

export default KpiCard;
