import { useMutation, useQueryClient } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/lib/api-client/query-keys";
import { Transaction } from "@prisma/client";
import apiClient from "@/lib/api-client";
import { toast } from "sonner";

interface CreateTransactionParams {
    data: any;
}

const updateTransaction = async ({ data }: CreateTransactionParams): Promise<Transaction> => {
    const response = await apiClient.put({
        path: `transaction/${data.id}`,
        data,
    });
    return response.json();
};

export function useUpdateTransaction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateTransaction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TransactionsList] });
            toast.success("Transaction updated successfully");
        },
        onError: (error) => {
            toast.error("Failed to update transaction");
        },
    });
} 