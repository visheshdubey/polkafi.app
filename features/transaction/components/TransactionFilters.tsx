import {
    AvailableFilters,
    FilterDefaultValues,
    TransactionType,
    TransactionTypeLabel,
    mapFilterValueToTransactionType,
    mapTransactionTypeToFilterValue,
} from "@/lib/entities";
import { Plus, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { CategorySelect } from "@/features/category/components/CategorySelect";
import { CreateCategoryForm } from "@/features/category/components/CreateCategoryForm";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/store";

type Props = {
    onFetchNextPage: () => void;
};

export const TransactionFilters = ({ onFetchNextPage }: Props) => {
    const { filters, updateFilter } = useStore((state) => state.trxn);
    const router = useRouter();

    const clearFilters = () => {
        updateFilter(AvailableFilters.date, FilterDefaultValues[AvailableFilters.date]);
        updateFilter(AvailableFilters.category, FilterDefaultValues[AvailableFilters.category]);
        updateFilter(AvailableFilters.type, FilterDefaultValues[AvailableFilters.type]);
    };

    const hasFilters = () => {
        const filterToCheck = [AvailableFilters.category, AvailableFilters.type];
        return filterToCheck.map((key) => filters[key] !== FilterDefaultValues[key]).some((value) => value);
    };

    const getTransactionTypeValue = () => {
        const value = filters.type[0];
        return value ? mapTransactionTypeToFilterValue(value) : "";
    };

    return (
        <div className="flex px-3 lg:px-6 items-center justify-between">
            <div className="items-center flex gap-3 lg:gap-6">
                <CategorySelect
                    className="h-8 w-[160px] rounded-full bg-white text-xs"
                    value={filters.category[0] || ""}
                    onSelect={(value) => updateFilter(AvailableFilters.category, [value])}
                />

                <Select
                    value={getTransactionTypeValue()}
                    onValueChange={(value) => updateFilter(AvailableFilters.type, [mapFilterValueToTransactionType(value)])}
                >
                    <SelectTrigger className="h-8 w-[160px] rounded-full bg-white gap-1 text-xs">
                        <SelectValue placeholder="Select Type" className="text-xs" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={TransactionType.CREDIT}>{TransactionTypeLabel.CREDIT}</SelectItem>
                        <SelectItem value={TransactionType.DEBIT}>{TransactionTypeLabel.DEBIT}</SelectItem>
                    </SelectContent>
                </Select>
                {hasFilters() && (
                    <Button size={"sm"} variant={"link"} className="bg-transparent rounded-full -ml-3" onClick={clearFilters}>
                        Clear Filters <X className="size-2.5" />
                    </Button>
                )}
            </div>
            <div className="hidden lg:flex items-center gap-3">
                <CreateCategoryForm>
                    <Button onClick={onFetchNextPage} size={"sm"} variant={"outline"} className="bg-transparent rounded-full">
                        <Plus /> New Category
                    </Button>
                </CreateCategoryForm>
                <Button size={"sm"} className="rounded-full" onClick={() => router.push("app/new")}>
                    <Plus /> New Transaction
                </Button>
            </div>
        </div>
    );
};
