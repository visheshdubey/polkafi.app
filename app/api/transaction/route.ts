import {
    createTransactionUsingAudioMode,
    createTransactionUsingFormMode,
    createTransactionUsingTextMode,
    fetchPaginatedTransactions,
} from "@/server/db/transactions";
import { forbidden, internalServerError, isUserUnauthorized, unauthorized } from "@/lib/utils/default-response";

import { TransactionCreateMode } from "@/lib/entities";
import { deductCredit } from "@/server/db/credits";
import { get } from "lodash";
import { getAuthSession } from "@/features/auth/utils";
import { queryStringToObject } from "@/lib/utils";
import { serializeBigIntValues } from "@/lib/utils/bigInt-serializer";
import { userHasCredits } from "@/server/db/user/UserRepository";

export const POST = async (req: Request) => {
    try {
        const session = await getAuthSession();
        const userId = get(session, "user.id");
        const reqQueryObj = new URL(req.url || "");
        const search = get(reqQueryObj, "search");
        const searchQueryParamFilters = queryStringToObject(search, { arrayFormat: "comma" });
        const mode: unknown = get(searchQueryParamFilters, "mode[0]", 0);

        if (isUserUnauthorized(userId)) {
            return unauthorized;
        }

        if (!(await userHasCredits(userId, 1))) {
            return forbidden;
        }

        let transaction = {};
        let body;

        if (mode !== TransactionCreateMode.Audio) {
            body = await req.json();
        }

        switch (mode) {
            case TransactionCreateMode.Audio:
                const formData = await req.formData();
                const file = formData.get("file") as File;

                transaction = await createTransactionUsingAudioMode(userId, file);
                break;
            case TransactionCreateMode.Text:
                transaction = await createTransactionUsingTextMode(userId, body);
                break;
            case TransactionCreateMode.Form:
                transaction = await createTransactionUsingFormMode(userId, body);
                break;
            default:
                transaction = await createTransactionUsingFormMode(userId, body);
                break;
        }

        return Response.json(serializeBigIntValues(transaction));
    } catch (error) {
        console.log(error);

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

        if (isUserUnauthorized(userId)) {
            return unauthorized;
        }

        const trxns = await fetchPaginatedTransactions({ userId, searchQueryParams: searchQueryParamFilters });

        return Response.json(serializeBigIntValues(trxns));
    } catch (error) {
        console.log(error);

        return internalServerError;
    }
};
