import { Category, Transaction } from "@prisma/client";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { TransactionData, UseFetchInfiniteTrxnsOptions } from "../types";
import { debounce, get } from "lodash";
import { useEffect, useState } from "react";

import { PaginatedResponse } from "@/lib/types/shared";
import { QUERY_KEYS } from "@/lib/api-client/query-keys";
import apiClient from "@/lib/api-client";
import { mapInfiniteTransactionAPIResToUI } from "../mapper";
import { toast } from "sonner";

interface FetchTransactionsParams {
    pageParam?: string;
    pageSize: number;
    filters?: Record<string, unknown>;
}

const fetchTransactions = async ({ pageParam = "", pageSize, filters }: FetchTransactionsParams): Promise<PaginatedResponse<Transaction & { category: Category }>> => {
    const response = await apiClient.get({
        path: "transaction",
        params: {
            cursor: pageParam,
            limit: pageSize,
            ...filters,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch transactions");
    }
    return response.json();
};

const transformQueryData = (query: InfiniteData<PaginatedResponse<Transaction & { category: Category }>>): TransactionData => ({
    transactions: mapInfiniteTransactionAPIResToUI(query),
    hasMore: get(query, "pages[0].hasMore", false),
    total: get(query, "pages[0].total", 0),
});

export function useFetchInfiniteTrxns(options: UseFetchInfiniteTrxnsOptions = {}) {
    const { enabled = true, pageSize = 10, filters, debounceMs = 150 } = options;
    const [debouncedFilters, setDebouncedFilters] = useState(filters);

    useEffect(() => {
        const debouncedUpdate = debounce(setDebouncedFilters, debounceMs);
        debouncedUpdate(filters);
        return () => debouncedUpdate.cancel();
    }, [filters, debounceMs]);

    const query = useInfiniteQuery({
        queryKey: [QUERY_KEYS.TransactionsList, pageSize, debouncedFilters],
        queryFn: ({ pageParam }) => fetchTransactions({ pageParam, pageSize, filters: debouncedFilters }),
        initialPageParam: "",
        getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextCursor : undefined,
        enabled,
        select: transformQueryData,

    });

    const { error } = query;

    if (error) {
        toast.error("Failed to fetch transactions", {
            description: error.message || "Please try again later",
        });
    }

    return query;
}
