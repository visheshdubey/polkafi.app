import { AvailableFilters } from "@/lib/entities";
import { DateRangePicker } from "@/components/primitives/ui/date-picker-with-range";
import { DynamicBreadcrumb } from "./DynamicBreadcrumb";
import PageTitle from "./PageTitle";
import { useStore } from "@/store/store";

type Props = {
    breadcrumbItems: Array<{ name: string; path: string }>;
};

export const TransactionHeader = ({ breadcrumbItems }: Props) => {
    const { filters, updateFilter } = useStore((state) => state.trxn);

    return (
        <>
            <div className="mt-3 lg:mt-12">
                <DynamicBreadcrumb items={breadcrumbItems} />
            </div>

            <div className="flex flex-wrap items-center w-full gap-2">
                <PageTitle>Transactions</PageTitle>
                <DateRangePicker
                    value={filters.date}
                    onChange={(value) => updateFilter(AvailableFilters.date, value)}
                    className="border border-neutral-300 ml-4 shadow-none rounded-full"
                />
            </div>
        </>
    );
};
