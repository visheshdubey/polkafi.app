import { Prisma, Transaction, TransactionType } from "@prisma/client";
import { openai, prompt, trxnSchema } from "@/server/config/open-ai";

import { PaginatedResponse } from "@/lib/types/shared";
import { Uploadable } from "openai/uploads.mjs";
import { dashboardStatsDayRangeOptionNowMinus } from "@/lib/entities";
import db from "@/server/db/prisma";
import get from "lodash/get";
import { isEmpty } from "lodash";

export type TransactionFindManyWhere = Prisma.TransactionFindFirstArgs["where"];

export type FetchPaginatedTransactions = (params: {
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

    const type = get(value, "[0]", "").toUpperCase();

    if (type !== TransactionType.CREDIT && type !== TransactionType.DEBIT) {
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
                        equals: get(value, "[0]"),
                    },
                },
            },
        ],
    };
};

const handleDateFilter = (value: number[]): TransactionFindManyWhere => {
    if (isEmpty(value)) {
        return;
    }

    const date = get(value, "[0]");

    return {
        createdAt: {
            gte: dashboardStatsDayRangeOptionNowMinus[date as keyof typeof dashboardStatsDayRangeOptionNowMinus],
        },
    };
};

export const fetchPaginatedTransactions: FetchPaginatedTransactions = async ({ userId, searchQueryParams, take = 5 }) => {
    const where: TransactionFindManyWhere = {
        AND: [
            handleTransactionTypeFilter(searchQueryParams["type"]) || {},
            handleTransactionCategoryFilter(searchQueryParams["category"]) || {},
            handleDateFilter(searchQueryParams["date"]) || {},
        ],
    };

    const items = await db.transaction.findMany({
        take: take + 1,
        ...handleCursorFilter(searchQueryParams["cursor"]),
        where,
        orderBy: {
            id: "asc",
        },
        include: {
            category: true,
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

export const fetchTransactionsById = (userId: string, trxnId: string) => {
    return db.transaction.findUnique({
        where: {
            id: trxnId,
            userId,
        },
    });
};

export const createTransactionUsingFormMode = async (userId: string, data: any) => {
    const category = await db.category.findMany({
        where: {
            name: get(data, "category"),
        },
    });

    return await db.transaction.create({
        data: {
            particular: get(data, "particular"),
            amount: BigInt(get(data, "amount")),
            type: get(data, "type"),
            categoryId: get(category, "[0].id"),
            textToStruturedJsonId: get(data, "textToStruturedJsonId"),
            userId,
            currency: get(data, "currency"),
        },
    });
};

export const createTransactionUsingTextMode = async (userId: string, data: any) => {
    // TODO: fetch user categories
    const openaiRes = (await openai.schemaBasedCompletion({
        message: get(data, "text"),
        prompt,
        schema: trxnSchema(["VEHICLE", "FOOD"]),
    })) as string;

    const parsedOpenAiRes = JSON.parse(openaiRes);

    const textToStruturedJson = await db.textToStruturedJson.create({
        data: {
            trxnText: get(data, "text"),
            transcriptionId: get(data, "transcriptionId"),
            rawCompletionResponse: openaiRes,
        },
    });

    const createTrxnInput = {
        particular: get(parsedOpenAiRes, "particulars"),
        amount: BigInt(get(parsedOpenAiRes, "amount")),
        type: get(parsedOpenAiRes, "type"),
        category: get(parsedOpenAiRes, "category"),
        textToStruturedJsonId: textToStruturedJson.id,
        userId,
        currency: get(data, "currency"),
    };

    return await createTransactionUsingFormMode(userId, createTrxnInput);
};

export const createTransactionUsingAudioMode = async (userId: string, file: Uploadable) => {
    const openaiRes = await openai.speechToText({ file });

    const transcriptionId = await db.transcription.create({
        data: {
            trxnText: get(openaiRes, "text"),
            rawWhisperResponse: JSON.stringify(openaiRes),
        },
    });

    const createTrxnInput = { text: get(openaiRes, "text"), transcriptionId: transcriptionId.id };

    return await createTransactionUsingTextMode(userId, createTrxnInput);
};

export const updateTransaction = (userId: string, trxnId: string, data: Transaction) => {
    const dataToUpdate = {
        ...data,
        categoryId: get(data, "category"),
        category: undefined,
    };
    return db.transaction.update({
        where: { id: trxnId, userId },
        data: {
            ...dataToUpdate,
        },
    });
};
export const deleteTransaction = (userId: string, trxnId: string) => {
    return db.transaction.delete({
        where: { id: trxnId, userId },
    });
};

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
