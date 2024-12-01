import { useMutation, useQueryClient } from "@tanstack/react-query";

import { QueryKey } from "@/lib/api-client/query-keys";
import { Transaction } from "@prisma/client";
import { TransactionCreateMode } from "@/lib/entities";
import apiClient from "@/lib/api-client";

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
    return response.json();
};

export function useCreateTransaction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createTransaction,
        onSuccess: () => {
            // Invalidate the transactions list query to refetch with new data
            queryClient.invalidateQueries({ queryKey: [QueryKey.TransactionsList] });
        },
    });
} 