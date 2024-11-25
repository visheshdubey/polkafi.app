import { Prisma, Transaction, TransactionType } from "@prisma/client";

import { PaginatedResponse } from "@/lib/types/shared";
import db from "@/server/db/prisma";
import get from "lodash/get";
import { isEmpty } from "lodash";

type TransactionFindManyWhere = Prisma.TransactionFindFirstArgs["where"];

type FetchPaginatedTransactions = (params: {
    userId: string;
    searchQueryParams: any;
    take?: number;
}) => Promise<PaginatedResponse<Transaction>>;

const handleCursorFilter = (value: string) => {
    if (isEmpty(value)) {
        return;
    }

    return {
        cursor: {
            id: get(value, "[0]"),
        },
        skip: 1,
    };
};

const handleTransactionTypeFilter = (value: TransactionType[]): TransactionFindManyWhere => {
    if (isEmpty(value)) {
        return;
    }

    const type = get(value, "[0]");

    if (type !== "CREDIT" && type !== "DEBIT") {
        console.log(type);

        return;
    }

    return {
        OR: [
            {
                type: {
                    equals: type as TransactionType,
                },
            },
        ],
    };
};

const handleTransactionCategoryFilter = (value: string): TransactionFindManyWhere => {
    if (isEmpty(value)) {
        return;
    }

    return {
        OR: [
            {
                category: {
                    id: {
                        equals: value,
                    },
                },
            },
        ],
    };
};

export const fetchPaginatedTransactions: FetchPaginatedTransactions = async ({ userId, searchQueryParams, take = 10 }) => {
    const where: TransactionFindManyWhere = {
        AND: [
            handleTransactionTypeFilter(searchQueryParams["type"]) || {},
            handleTransactionCategoryFilter(searchQueryParams["category"]) || {},
        ],
    };

    const items = await db.transaction.findMany({
        take: take + 1,
        ...handleCursorFilter(searchQueryParams["cursor"]),
        where,
        orderBy: {
            id: "asc",
        },
    });

    const totalItemsInDb = await db.transaction.count({ where });

    const hasMore = items.length > take;
    const data = hasMore ? items.slice(0, -1) : items;

    return {
        data,
        nextCursor: hasMore ? data[data.length - 1].id : null,
        hasMore,
        total: totalItemsInDb,
    };
};
export const fetchTransactionsById = (userId: string, trxnId: string) => {};
export const createTransaction = async (userId: string, data: any) =>
    await db.transaction.create({
        data: {
            particular: get(data, "particular"),
            amount: BigInt(get(data, "amount")),
            type: get(data, "type"),
            category: get(data, "category"),
            textToStruturedJsonId: get(data, "textToStruturedJsonId"),
            userId,
            currency: get(data, "currency"),
        },
    });

export const updateTransaction = (userId: string, trxnId: string, data: any) => {};
export const deleteTransaction = (userId: string, trxnId: string) => {};

export const createTranscription = async (userId: string, data: any) =>
    await db.transcription.create({
        data: {
            rawWhisperResponse: data,
            trxnText: get(data, "text"),
        },
    });

export const createTextToStruturedJson = async (userId: string, data: any) =>
    await db.textToStruturedJson.create({
        data: {
            rawCompletionResponse: data,
            trxnText: get(data, "text"),
            transcriptionId: get(data, "transcriptionId"),
        },
    });
