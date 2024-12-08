import { QUERY_KEYS } from "@/lib/api-client/query-keys";
import apiClient from "@/lib/api-client";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

const deleteTransactionById = async (transactionId: string) => {
    const response = await apiClient.delete({ path: `/transaction/${transactionId}` });
    return response.json();
};

export const useDeleteTransaction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (transactionId: string) => deleteTransactionById(transactionId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TransactionsList] });
            toast.success("Transaction deleted successfully");
        },
        onError: (error) => {
            toast.error("Failed to delete transaction");
        },
    });
};
