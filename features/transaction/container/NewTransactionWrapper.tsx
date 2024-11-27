"use client";

import CreateTransactionForm from "../forms/create-transaction/CreateTransactionForm";
import { DynamicBreadcrumb } from "@/features/transaction/components/DynamicBreadcrumb";
import MagicalGradientCard from "@/features/transaction/components/MagicalGradientCard";
import PageTitle from "@/features/transaction/components/PageTitle";
import TransactionAudioRecorder from "@/features/transaction/components/TransactionAudioRecorder";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type Props = {};
export const formSchema = z.object({
    particulars: z.string().optional(),
    amount: z.string().optional(),
    category: z.enum(["FOOD"]).optional(),
    type: z.enum(["CREDIT", "DEBIT"]).optional(),
});

const NewTransactionWrapper = (props: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            particulars: "",
        },
    });
    const [first, setFirst] = useState(0);

    const breadcrumbItems = [
        { name: "App", path: "/" },
        { name: "New Transaction", path: "/docs/components" },
    ];

    const handleComplete = async () => {
        setIsLoading(true);
        try {
            // Your submission logic here
            // await submitData();
            alert("time up");
        } finally {
            setIsLoading(false);
        }
    };
    const handleTimeout = () => {
        const x = first / 100; // This gives 1% of the current value
        setTimeout(() => {
            setFirst((prevFirst) => prevFirst + x);
        }, 100);
    };

    const onSubmit = (values: z.infer<typeof formSchema>) => {};

    return (
        <div className="max-w-screen-xl flex flex-col gap-3 lg:gap-6 px-3 lg:px-6 mx-auto w-full min-h-screen">
            <div className="mt-3 lg:mt-12">
                <DynamicBreadcrumb items={breadcrumbItems} />
            </div>
            <div className="flex flex-wrap items-baseline w-full gap-2">
                <PageTitle>New Transaction</PageTitle>
            </div>
            <MagicalGradientCard className="flex flex-col mt-3">
                <span className="text-purple-800/70 font-medium text-sm">Use voice or text to log transaction</span>
                <TransactionAudioRecorder className="flex flex-row mt-4 mx-auto" />
            </MagicalGradientCard>

            <MagicalGradientCard className="flex flex-col">
                <span className="text-purple-800/70 font-medium text-sm">Fill below form to log your transaction</span>

                <div className="w-full shadow-sm min-h-12 bg-white mt-4 lg:p-6 p-4 rounded-xl">
                    <CreateTransactionForm onSubmit={onSubmit} />
                </div>
            </MagicalGradientCard>
        </div>
    );
};

export default NewTransactionWrapper;
