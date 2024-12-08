import { QUERY_KEYS } from "@/lib/api-client/query-keys";
import { Transaction } from "@prisma/client";
import apiClient from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

const fetchTransactionById = async (transactionId: string): Promise<Transaction> => {
    const response = await apiClient.get({
        path: `transaction/${transactionId}`,
    });
    return response.json();
};

export function useFetchTransactionById(transactionId: string | undefined) {
    return useQuery({
        queryKey: [QUERY_KEYS.TransactionsList, transactionId],
        queryFn: () => fetchTransactionById(transactionId!),
        enabled: !!transactionId,
    });
}
