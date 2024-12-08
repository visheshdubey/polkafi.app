"use client";

import { ButtonAsync } from "@/components/primitives/ui/button-async";
import { DeleteTrxnAlert } from "../components/DeleteTrxnAlert";
import { DynamicBreadcrumb } from "@/features/transaction/components/DynamicBreadcrumb";
import MagicalGradientCard from "@/features/transaction/components/MagicalGradientCard";
import PageTitle from "@/features/transaction/components/PageTitle";
import { Trash2 } from "lucide-react";
import UpdateTransactionForm from "@/features/transaction/forms/update-transaction/UpdateTransactionForm";
import { useDeleteTransaction } from "../hooks/useDeleteTransaction";
import { useFetchTransactionById } from "../hooks/useFetchTransactionById";
import { useRouter } from "next/navigation";

type Props = {
    transactionId: string;
};

const UpdateTransactionWrapper = ({ transactionId }: Props) => {
    const { data: transaction, error } = useFetchTransactionById(transactionId);
    const { mutate: deleteTransaction, isPending: deleteTransactionPending } = useDeleteTransaction();
    const router = useRouter();
    const breadcrumbItems = [
        { name: "App", path: "/" },
        { name: "Update Transaction", path: `/app/${transactionId}` },
    ];

    return (
        <div className="max-w-screen-xl flex flex-col gap-3 lg:gap-6 px-3 lg:px-6 mx-auto w-full min-h-screen">
            <div className="mt-3 lg:mt-12">
                <DynamicBreadcrumb items={breadcrumbItems} />
            </div>
            <div className="flex flex-wrap items-baseline w-full gap-2">
                <PageTitle>Update Transaction</PageTitle>
            </div>

            <MagicalGradientCard className="flex flex-col">
                <div className="flex items-center justify-between">
                    <span className="text-purple-800/70 font-medium text-sm">Update your transaction details below</span>
                    <DeleteTrxnAlert onDelete={() => deleteTransaction(transactionId, { onSuccess: () => router.push("/app") })}>
                        <ButtonAsync variant={"ghost"} size={"icon"} isLoading={deleteTransactionPending}>
                            <Trash2 className="w-5 h-5 text-neutral-500" />
                        </ButtonAsync>
                    </DeleteTrxnAlert>
                </div>

                <div className="w-full shadow-sm min-h-12 bg-white mt-4 lg:p-6 p-4 rounded-xl">
                    {error ? <div className="text-red-500">{error.message}</div> : <UpdateTransactionForm transaction={transaction} />}
                </div>
            </MagicalGradientCard>
        </div>
    );
};

export default UpdateTransactionWrapper;
