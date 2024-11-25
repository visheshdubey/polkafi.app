import db from "@/server/db/prisma";
import get from "lodash/get";

export const fetchPaginatedTransactions = (userId: string, filters: any) => {};
export const fetchTransactionsById = (userId: string, trxnId: string) => {};
export const createTransaction = async (userId: string, data: any) => {
    const transaction = await db.transaction.create({
        data: {
            particular: get(data, "particular"),
            amount: get(data, "amount"),
            type: get(data, "type"),
            category: get(data, "category"),
        },
    });

    return transaction;
};
export const updateTransaction = (userId: string, trxnId: string, data: any) => {};
export const deleteTransaction = (userId: string, trxnId: string) => {};
