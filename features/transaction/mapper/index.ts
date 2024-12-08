import { Transaction, TransactionType } from "@prisma/client";

import { InfiniteData } from "@tanstack/react-query";
import { PaginatedResponse } from "@/lib/types/shared";
import { TransactionListItemProps } from "../components/TransactionListItem";
import { get } from "lodash";

type TransactionQueryType = InfiniteData<PaginatedResponse<Transaction>>;

export const mapInfiniteTransactionAPIResToUI = (query: TransactionQueryType): TransactionListItemProps[] => {
    const pages = get(query, "pages", []);
    const data = pages.flatMap((page) => page.data);

    const transformedData: TransactionListItemProps[] = data.map((item) => {
        return {
            ...item,
            id: item.id,
            shortId: getShortTransactionId(item.id),
            particular: getParticulars(item.particular),
            amount: BigInt(item.amount),
            type: item.type as TransactionType,
            date: item.createdAt,
        };
    });

    return transformedData;
};

const getShortTransactionId = (id: string) => "TRXN-" + id.slice(id.length - 5).toUpperCase();
const getParticulars = (particular: string | null) => {
    const firstCharInUppercase = get(particular, "[0]", "").toUpperCase();

    return firstCharInUppercase + particular?.slice(1);
};
