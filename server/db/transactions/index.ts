import { Prisma, Transaction, TransactionType } from "@prisma/client";
import { openai, prompt, trxnSchema } from "@/server/config/open-ai";

import { PaginatedResponse } from "@/lib/types/shared";
import { Uploadable } from "openai/uploads.mjs";
import { dashboardStatsDayRangeOptionNowMinus } from "@/lib/entities";
import db from "@/server/db/prisma";
import get from "lodash/get";
import { isEmpty } from "lodash";

const ERRORS = {
    USER_ID_REQUIRED: 'User ID is required',
    TRANSACTION_ID_REQUIRED: 'Transaction ID is required',
    TRANSACTION_NOT_FOUND: 'Transaction not found',
    INVALID_AMOUNT: 'Invalid transaction amount',
    INVALID_TYPE: 'Invalid transaction type',
    CATEGORY_REQUIRED: 'Category is required',
    INVALID_CURRENCY: 'Invalid currency',
    INVALID_FILE: 'Invalid file upload',
    TEXT_REQUIRED: 'Transaction text is required',
} as const;

export type TransactionFindManyWhere = Prisma.TransactionFindFirstArgs["where"];

export type FetchPaginatedTransactionsParams = {
    userId: string;
    searchQueryParams: any;
    take?: number;
};

export type FetchPaginatedTransactions = (
    params: FetchPaginatedTransactionsParams
) => Promise<PaginatedResponse<Transaction>>;

export type CreateTransactionFormData = {
    particular: string;
    amount: string | number | bigint;
    type: TransactionType;
    category: string;
    textToStruturedJsonId?: string;
    currency: string;
};

export type CreateTransactionTextData = {
    text: string;
    transcriptionId?: string;
    currency: string;
};

export type CreateTranscriptionData = {
    text: string;
    rawWhisperResponse: string;
};

export type CreateTextToStructuredJsonData = {
    text: string;
    rawCompletionResponse: string;
    transcriptionId?: string;
};

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

const validateUserId = (userId: string): void => {
    if (!userId) {
        throw new Error(ERRORS.USER_ID_REQUIRED);
    }
};

const validateTransactionId = (trxnId: string): void => {
    if (!trxnId) {
        throw new Error(ERRORS.TRANSACTION_ID_REQUIRED);
    }
};

export const fetchPaginatedTransactions: FetchPaginatedTransactions = async ({ userId, searchQueryParams, take = 5 }) => {
    validateUserId(userId);

    const where: TransactionFindManyWhere = {
        AND: [
            handleTransactionTypeFilter(searchQueryParams["type"]) || {},
            handleTransactionCategoryFilter(searchQueryParams["category"]) || {},
            handleDateFilter(searchQueryParams["date"]) || {},
        ],
    };

    try {
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
    } catch (error) {
        throw error;
    }
};

export const fetchTransactionsById = async (userId: string, trxnId: string) => {
    validateUserId(userId);
    validateTransactionId(trxnId);

    try {
        const transaction = await db.transaction.findUnique({
            where: {
                id: trxnId,
                userId,
            },
        });

        if (!transaction) {
            throw new Error(ERRORS.TRANSACTION_NOT_FOUND);
        }

        return transaction;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                throw new Error(ERRORS.TRANSACTION_NOT_FOUND);
            }
        }
        throw error;
    }
};

export const createTransactionUsingFormMode = async (userId: string, data: CreateTransactionFormData) => {
    validateUserId(userId);

    if (!data.category) {
        throw new Error(ERRORS.CATEGORY_REQUIRED);
    }

    if (!data.amount || isNaN(Number(data.amount))) {
        throw new Error(ERRORS.INVALID_AMOUNT);
    }

    try {
        const category = await db.category.findMany({
            where: {
                name: data.category,
            },
        });

        return await db.transaction.create({
            data: {
                particular: data.particular,
                amount: BigInt(data.amount),
                type: data.type,
                categoryId: get(category, "[0].id"),
                textToStruturedJsonId: data.textToStruturedJsonId,
                userId,
                currency: data.currency,
            },
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            throw error;
        }
        throw error;
    }
};

export const createTransactionUsingTextMode = async (userId: string, data: any) => {
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

    const createTrxnInput = {
        text: get(openaiRes, "text"),
        transcriptionId: transcriptionId.id
    };

    return await createTransactionUsingTextMode(userId, createTrxnInput);
};

export const updateTransaction = (userId: string, trxnId: string, data: Transaction) => {
    const dataToUpdate = {
        ...data,
        categoryId: get(data, "category"),
        category: undefined,
    };

    return db.transaction.update({
        where: {
            id: trxnId,
            userId
        },
        data: {
            ...dataToUpdate,
        },
    });
};

export const deleteTransaction = (userId: string, trxnId: string) => {
    return db.transaction.delete({
        where: {
            id: trxnId,
            userId
        },
    });
};

export const createTranscription = async (userId: string, data: any) => {
    return await db.transcription.create({
        data: {
            rawWhisperResponse: data,
            trxnText: get(data, "text"),
        },
    });
};

export const createTextToStruturedJson = async (userId: string, data: any) => {
    return await db.textToStruturedJson.create({
        data: {
            rawCompletionResponse: data,
            trxnText: get(data, "text"),
            transcriptionId: get(data, "transcriptionId"),
        },
    });
};
