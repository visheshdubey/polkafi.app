"use client";

import {
    AvailableFilters,
    TransactionType,
    TransactionTypeLabel,
    mapFilterValueToTransactionType,
    mapTransactionTypeToFilterValue,
} from "@/lib/entities";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { CategorySelect } from "@/features/category/components/CategorySelect";
import { CreateCategoryForm } from "@/features/category/components/CreateCategoryForm";
import { DateRangePicker } from "@/components/primitives/ui/date-picker-with-range";
import { DynamicBreadcrumb } from "@/features/transaction/components/DynamicBreadcrumb";
import KpiCard from "@/features/transaction/components/KpiCard";
import MagicalGradientCard from "@/features/transaction/components/MagicalGradientCard";
import PageTitle from "@/features/transaction/components/PageTitle";
import { Plus } from "lucide-react";
import TransactionListItem from "../components/TransactionListItem";
import TransactionListItemSkeleton from "../components/TransactionListItemSkeleton";
import { TransactionSummaryChart } from "@/features/transaction/components/TransactionSummaryChart";
import { useDashboardStats } from "../hooks/useDashboardStats";
import { useEffect } from "react";
import { useFetchInfiniteTrxns } from "@/features/transaction/hooks/useFetchInfiniteTransaction";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/store";

type Props = {};

const TransactionWrapper = (props: Props) => {
    const { filters, updateFilter } = useStore((state) => state.trxn);
    const { data, isFetching, isPending, fetchNextPage, hasNextPage } = useFetchInfiniteTrxns({ filters });
    const { targetRef, isIntersecting } = useIntersectionObserver({
        threshold: 0.1,
        enabled: !isFetching && hasNextPage,
    });
    const { data: dashboardStats } = useDashboardStats(filters);
    const router = useRouter();

    useEffect(() => {
        if (isIntersecting && hasNextPage) {
            fetchNextPage();
            console.log("fetching next page");
        }
    }, [isIntersecting, hasNextPage, fetchNextPage]);

    const breadcrumbItems = [{ name: "App", path: "/" }];

    return (
        <div className="max-w-screen-xl flex flex-col gap-3 lg:gap-6 px-3 lg:px-6 mx-auto w-full min-h-screen">
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

            <MagicalGradientCard className="w-full flex items-center gap-6 overflow-x-auto scrollbar-none rounded-xl">
                <div className="bg-white shadow-sm w-1/3 min-w-[320px] rounded-xl p-4 grow h-44">
                    <TransactionSummaryChart data={dashboardStats?.charts} />
                </div>
                <div className="bg-white shadow-sm min-w-[740px] rounded-xl items-center grid-cols-3 grid grow h-44">
                    <KpiCard label="Net PnL" variant="danger" value={dashboardStats?.netPnl} />
                    <KpiCard label="Total Credit" value={dashboardStats?.totalCredit} />
                    <KpiCard label="Total Debit" value={dashboardStats?.totalDebit} className="border-r-0" />
                </div>
            </MagicalGradientCard>

            <div className="flex px-3 lg:px-6 items-center justify-between">
                <div className="items-center flex gap-3 lg:gap-6">
                    <CategorySelect
                        className="h-8 w-[160px] rounded-full bg-white text-xs"
                        value={filters.category[0]}
                        onSelect={(value) => updateFilter(AvailableFilters.category, [value])}
                    />

                    <Select
                        value={mapTransactionTypeToFilterValue(filters.type[0])}
                        onValueChange={(value) => updateFilter(AvailableFilters.type, [mapFilterValueToTransactionType(value)])}
                    >
                        <SelectTrigger className="h-8 w-[160px] rounded-full bg-white  gap-1 text-xs">
                            <SelectValue placeholder="Select Type" className="text-xs" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={TransactionType.CREDIT}>{TransactionTypeLabel.CREDIT}</SelectItem>
                            <SelectItem value={TransactionType.DEBIT}>{TransactionTypeLabel.DEBIT}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>{" "}
                <div className="hidden lg:flex items-center gap-3">
                    <CreateCategoryForm>
                        <Button onClick={() => fetchNextPage()} size={"sm"} variant={"outline"} className="bg-transparent rounded-full">
                            <Plus /> New Category
                        </Button>
                    </CreateCategoryForm>
                    <Button size={"sm"} className="rounded-full" onClick={() => router.push("app/new")}>
                        <Plus /> New Transaction
                    </Button>
                </div>
            </div>
            <MagicalGradientCard>
                <div className="w-full shadow-sm flex flex-col *:border-b *:border-neutral-100 last-of-type:border-b-0 rounded-xl overflow-hidden bg-white">
                    {data &&
                        data.transactions.map((item, index) => {
                            return <TransactionListItem key={`tansaction-list-item-${index}`} {...item} />;
                        })}
                </div>
                {isFetching ? (
                    <>
                        <TransactionListItemSkeleton />
                        <TransactionListItemSkeleton />
                        <TransactionListItemSkeleton />
                    </>
                ) : (
                    <></>
                )}
                <div className="size-20" ref={targetRef}></div>
            </MagicalGradientCard>

            <Button
                onClick={() => router.push("app/new")}
                size={"icon"}
                className="lg:hidden fixed size-12 z-50 bottom-4 right-4 rounded-full"
            >
                <Plus className="text-xl"></Plus>
            </Button>
        </div>
    );
};

export default TransactionWrapper;
