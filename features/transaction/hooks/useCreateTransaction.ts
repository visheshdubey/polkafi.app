import { useMutation, useQueryClient } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/lib/api-client/query-keys";
import { Transaction } from "@prisma/client";
import { TransactionCreateMode } from "@/lib/entities";
import apiClient from "@/lib/api-client";
import { toast } from "sonner";

interface CreateTransactionParams {
    data: any;
    mode?: TransactionCreateMode;
}

const createTransaction = async ({ data, mode = TransactionCreateMode.Form }: CreateTransactionParams): Promise<Transaction> => {
    const response = await apiClient.post({
        path: "transaction",
        params: { mode },
        data,
    });

    if (!response.ok) {
        throw new Error("Failed to create transaction");
    }

    return response.json();
};

export function useCreateTransaction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createTransaction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TransactionsList] });
            toast.success("Transaction created successfully");
        },
        onError: (error) => {
            toast.error("Failed to create transaction");
        },
    });
} 