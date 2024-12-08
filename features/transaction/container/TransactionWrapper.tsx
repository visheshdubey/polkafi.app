"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import KpiCard from "@/features/transaction/components/KpiCard";
import MagicalGradientCard from "@/features/transaction/components/MagicalGradientCard";
import { PlusIcon } from "lucide-react";
import { TransactionFilters } from "@/features/transaction/components/TransactionFilters";
import { TransactionHeader } from "@/features/transaction/components/TransactionHeader";
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
    const { filters } = useStore((state) => state.trxn);
    const { data, isFetching, fetchNextPage, hasNextPage } = useFetchInfiniteTrxns({ filters });
    const { targetRef, isIntersecting } = useIntersectionObserver({
        threshold: 0.1,
        enabled: !isFetching && hasNextPage,
    });
    const { data: dashboardStats } = useDashboardStats(filters);
    const router = useRouter();

    useEffect(() => {
        if (isIntersecting && hasNextPage) {
            fetchNextPage();
        }
    }, [isIntersecting, hasNextPage, fetchNextPage]);

    const breadcrumbItems = [{ name: "App", path: "/" }];

    return (
        <div className="max-w-screen-xl flex flex-col gap-3 lg:gap-6 px-3 lg:px-6 mx-auto w-full min-h-screen">
            <TransactionHeader breadcrumbItems={breadcrumbItems} />

            <MagicalGradientCard className="w-full mt-3 lg:mt-0 flex items-center gap-6 overflow-x-auto scrollbar-none rounded-xl">
                <div className="bg-white shadow-sm w-1/3 min-w-[320px] rounded-xl p-4 grow h-44">
                    <TransactionSummaryChart data={dashboardStats?.charts} />
                </div>
                <div className="bg-white shadow-sm min-w-[740px] rounded-xl items-center grid-cols-3 grid grow h-44">
                    <KpiCard label="Net PnL" variant="danger" value={dashboardStats?.netPnl} />
                    <KpiCard label="Total Credit" value={dashboardStats?.totalCredit} />
                    <KpiCard label="Total Debit" value={dashboardStats?.totalDebit} className="border-r-0" />
                </div>
            </MagicalGradientCard>

            <TransactionFilters onFetchNextPage={fetchNextPage} />

            <MagicalGradientCard>
                <div className="w-full shadow-sm flex flex-col *:border-b *:border-neutral-100 last-of-type:border-b-0 rounded-xl overflow-hidden bg-white">
                    {data?.transactions.length === 0 && !isFetching && (
                        <div className="w-full h-full py-16 px-4 flex flex-col items-center justify-center gap-3">
                            <Image src="/assets/illustrations/undraw_no_data_re_kwbl.svg" alt="Empty State" width={100} height={100} />
                            <p className="text-sm text-neutral-500">No transactions found</p>
                        </div>
                    )}
                    {data &&
                        data.transactions.map((item, index) => {
                            return <TransactionListItem key={`tansaction-list-item-${index}`} {...item} />;
                        })}
                    {isFetching ? (
                        <>
                            <TransactionListItemSkeleton />
                            <TransactionListItemSkeleton />
                            <TransactionListItemSkeleton />
                        </>
                    ) : (
                        <></>
                    )}
                </div>

                <div className="size-20" ref={targetRef}></div>
            </MagicalGradientCard>

            <Button
                onClick={() => router.push("app/new")}
                size={"icon"}
                className="lg:hidden fixed size-14 z-50 bottom-4 right-4 rounded-full"
            >
                <PlusIcon className="size-12" />
            </Button>
        </div>
    );
};

export default TransactionWrapper;
