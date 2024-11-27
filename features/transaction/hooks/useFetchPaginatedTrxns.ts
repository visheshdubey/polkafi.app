import { useInfiniteQuery } from "@tanstack/react-query";
import { type UseInfiniteQueryResult } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { QueryKey } from "@/lib/api-client/query-keys";
import { useEffect, useState } from "react";
import { debounce } from "lodash";
import { PaginatedResponse } from "@/lib/types/shared";
import { Transaction } from "@prisma/client";

interface UseFetchInfiniteJobsOptions {
    enabled?: boolean;
    pageSize?: number;
    filters?: {};
    debounceMs?: number;
}

interface UseFetchInfiniteTrxnsResult extends Omit<UseInfiniteQueryResult<PaginatedResponse<Transaction>, Error>, "data"> {
    data:
        | {
              trannsactions: Transaction[];
              hasMore: boolean;
              total: number;
          }
        | undefined;
}

export function useFetchInfiniteTrxns(options: UseFetchInfiniteJobsOptions = {}): UseFetchInfiniteTrxnsResult {
    const { enabled = true, pageSize = 10, filters, debounceMs = 150 } = options;
    const [debouncedFilters, setDebouncedFilters] = useState(filters);

    useEffect(() => {
        const debouncedUpdate = debounce((newFilters) => {
            setDebouncedFilters(newFilters);
        }, debounceMs);

        debouncedUpdate(filters);

        return () => {
            debouncedUpdate.cancel();
        };
    }, [filters, debounceMs]);

    const query = useInfiniteQuery({
        queryKey: [QueryKey.TransactionsList, pageSize, debouncedFilters],
        queryFn: async ({ pageParam = "" }): Promise<PaginatedResponse<Transaction>> => {
            const response = (
                await apiClient.get({
                    path: "transaction",
                    params: {
                        cursor: pageParam,
                        limit: pageSize,
                        ...debouncedFilters,
                    },
                })
            ).json();

            return response;
        },
        initialPageParam: "",
        getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextCursor : undefined),
        enabled,
    });

    // Transform paginated data into flat array with hasMore flag
    const transformedData = query.data
        ? {
              transactions: query.data.pages.flatMap((page) => page.data),
              hasMore: query.hasNextPage ?? false,
              total: query.data.pages[0].total,
          }
        : undefined;

    return {
        ...query,
        data: transformedData,
    };
}
