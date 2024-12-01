import { TransactionType } from "@prisma/client";

// From TransactionListItem.tsx
export interface TransactionListItemType {
    id: string;
    particular: string;
    amount: bigint;
    date: string | Date;
    category?: string;
    type: TransactionType;
}

// From useFetchInfiniteTransaction.ts
export interface UseFetchInfiniteTrxnsOptions {
    enabled?: boolean;
    pageSize?: number;
    filters?: {};
    debounceMs?: number;
}

export interface TransactionData {
    transactions: TransactionListItemType[];
    hasMore: boolean;
    total: number;
}

// From TransactionSummaryChart.tsx
export interface TransactionSummaryData {
    key: string;
    debit: number;
    credit: number;
} 