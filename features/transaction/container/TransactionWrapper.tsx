"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/primitives/ui/date-picker-with-range";
import { DynamicBreadcrumb } from "@/features/transaction/components/DynamicBreadcrumb";
import KpiCard from "@/features/transaction/components/KpiCard";
import MagicalGradientCard from "@/features/transaction/components/MagicalGradientCard";
import PageTitle from "@/features/transaction/components/PageTitle";
import { Plus } from "lucide-react";
import TransactionListItem from "../components/TransactionListItem";
import TransactionListItemSkeleton from "../components/TransactionListItemSkeleton";
import { TransactionSummaryChart } from "@/features/transaction/components/TransactionSummaryChart";
import { useEffect } from "react";
import { useFetchInfiniteTrxns } from "@/features/transaction/hooks/useFetchInfiniteTransaction";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import { useRouter } from "next/navigation";

type Props = {};

const chartData = [
    { key: "Jan", debit: 186, credit: 80 },
    { key: "Feb", debit: 305, credit: 200 },
    { key: "Mar", debit: 237, credit: 120 },
    { key: "Apr", debit: 73, credit: 190 },
    { key: "May", debit: 209, credit: 130 },
    { key: "Jun", debit: 214, credit: 140 },
    { key: "Jul", debit: 305, credit: 200 },
    { key: "Aug", debit: 237, credit: 120 },
    { key: "Sep", debit: 73, credit: 190 },
    { key: "Oct", debit: 209, credit: 130 },
    { key: "Nov", debit: 73, credit: 190 },
];

const TransactionWrapper = (props: Props) => {
    const { data, isFetching, isPending, fetchNextPage, hasNextPage } = useFetchInfiniteTrxns();
    const { targetRef, isIntersecting } = useIntersectionObserver({
        threshold: 0.1,
        enabled: !isFetching && hasNextPage,
    });
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

            <div className="flex flex-wrap items-baseline w-full gap-2">
                <PageTitle>Transactions</PageTitle>
                <DatePickerWithRange className="p-0" />
            </div>

            <MagicalGradientCard className="w-full flex items-center gap-6 overflow-x-auto scrollbar-none rounded-xl">
                <div className="bg-white shadow-sm w-1/3 min-w-[320px] rounded-xl p-4 grow h-44">
                    <TransactionSummaryChart data={chartData} />
                </div>
                <div className="bg-white shadow-sm min-w-[740px] rounded-xl items-center grid-cols-3 grid grow h-44">
                    <KpiCard label="Net PnL" variant="danger" value={"272065"} />
                    <KpiCard label="Total Credit" value={"0003399"} />
                    <KpiCard label="Total Debit" value={"9654255"} className="border-r-0" />
                </div>
            </MagicalGradientCard>

            <div className="flex px-3 lg:px-6 items-center justify-between">
                <div className="items-center flex gap-3 lg:gap-6">
                    <Select>
                        <SelectTrigger className="h-8 w-[160px] rounded-full bg-white text-xs ">
                            <SelectValue placeholder="Select Category" className="text-sm" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="light">Long text long text long text</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select>
                        <SelectTrigger className="h-8 w-[160px] rounded-full bg-white  gap-1 text-xs">
                            <SelectValue placeholder="Select Type" className="text-xs" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="light">Credit</SelectItem>
                            <SelectItem value="dark">Debit</SelectItem>
                        </SelectContent>
                    </Select>
                </div>{" "}
                <div className="hidden lg:flex items-center gap-3">
                    <Button onClick={() => fetchNextPage()} size={"sm"} variant={"outline"} className="bg-transparent rounded-full">
                        <Plus /> New Category
                    </Button>
                    {/* <AudioRecordContainer> */}
                    <Button size={"sm"} className="rounded-full" onClick={() => router.push("app/new")}>
                        <Plus /> New Transaction
                    </Button>
                    {/* </AudioRecordContainer> */}
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

            {/* <AudioRecorder
                maxDuration={30} // Optional: override default 20 seconds
                onRecordingComplete={() => {}} // Optional: handle completed recording
            />

            <AudioRecordContainer>
                <Button size={"icon"} className="lg:hidden fixed size-12 z-50 bottom-4 right-4 rounded-full">
                    <Plus className="text-xl"></Plus>
                </Button>
            </AudioRecordContainer> */}
        </div>
    );
};

export default TransactionWrapper;
