import { createTransaction, fetchPaginatedTransactions } from "@/server/db/transactions";
import { internalServerError, isUserUnauthorized, unauthorized } from "@/lib/utils/default-response";

import { get } from "lodash";
import { getAuthSession } from "@/features/auth/utils";
import { queryStringToObject } from "@/lib/utils";
import { serializeBigIntValues } from "@/lib/utils/bigInt-serializer";

export const POST = async (req: Request) => {
    try {
        const session = await getAuthSession();
        const body = await req.json();
        const userId = get(session, "user.id");

        if (isUserUnauthorized(userId)) {
            return unauthorized;
        }

        const transaction = await createTransaction(userId, body);

        return Response.json(serializeBigIntValues(transaction));
    } catch (error) {
        return internalServerError;
    }
};

export const GET = async (req: Request) => {
    try {
        const session = await getAuthSession();
        const userId = get(session, "user.id");
        const reqQueryObj = new URL(req.url || "");
        const search = get(reqQueryObj, "search");
        const searchQueryParamFilters = queryStringToObject(search, { arrayFormat: "comma" });

        // if (isUserUnauthorized(userId)) {
        //     return unauthorized;
        // }

        const trxns = await fetchPaginatedTransactions({ userId, searchQueryParams: searchQueryParamFilters });

        return Response.json(serializeBigIntValues(trxns));
    } catch (error) {
        console.log(error);

        return internalServerError;
    }
};
