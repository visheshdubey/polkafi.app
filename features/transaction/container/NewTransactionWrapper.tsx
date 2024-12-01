"use client";
import CreateTransactionForm from "@/features/transaction/forms/create-transaction/CreateTransactionForm";
import { DynamicBreadcrumb } from "@/features/transaction/components/DynamicBreadcrumb";
import MagicalGradientCard from "@/features/transaction/components/MagicalGradientCard";
import PageTitle from "@/features/transaction/components/PageTitle";
import TransactionAiInput from "@/features/transaction/components/TransactionAiInput";

type Props = {};

const NewTransactionWrapper = (props: Props) => {
    const breadcrumbItems = [
        { name: "App", path: "/" },
        { name: "New Transaction", path: "/docs/components" },
    ];
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
                <TransactionAiInput className="flex flex-row mt-4 mx-auto" />
            </MagicalGradientCard>

            <MagicalGradientCard className="flex flex-col">
                <span className="text-purple-800/70 font-medium text-sm">Fill below form to log your transaction</span>

                <div className="w-full shadow-sm min-h-12 bg-white mt-4 lg:p-6 p-4 rounded-xl">
                    <CreateTransactionForm />
                </div>
            </MagicalGradientCard>
        </div>
    );
};

export default NewTransactionWrapper;
