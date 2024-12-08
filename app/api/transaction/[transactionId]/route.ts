import { deleteTransaction, fetchTransactionsById, updateTransaction } from "@/server/db/transactions";

import { get } from "lodash";
import { getAuthSession } from "@/features/auth/utils";
import { internalServerError } from "@/lib/utils/default-response";
import { serializeBigIntValues } from "@/lib/utils/bigInt-serializer";

export const GET = async (req: Request, { params }: { params: { transactionId: string } }) => {
    try {
        const session = await getAuthSession();
        const userId = get(session, "user.id");

        // if (isUserUnauthorized(userId)) {
        //     return unauthorized;
        // }

        const trxns = await fetchTransactionsById(userId, params.transactionId);

        return Response.json(serializeBigIntValues(trxns));
    } catch (error) {
        console.log(error);

        return internalServerError;
    }
};

export const DELETE = async (req: Request, { params }: { params: { transactionId: string } }) => {
    try {
        const session = await getAuthSession();
        const userId = get(session, "user.id");

        // if (isUserUnauthorized(userId)) {
        //     return unauthorized;
        // }

        const trxns = await deleteTransaction(userId, params.transactionId);

        return Response.json({ message: "Transaction deleted successfully" });
    } catch (error) {
        console.log(error);

        return internalServerError;
    }
}

export const PUT = async (req: Request, { params }: { params: { transactionId: string } }) => {
    try {
        const session = await getAuthSession();
        const userId = get(session, "user.id");
        const body = await req.json();

        // if (isUserUnauthorized(userId)) {
        //     return unauthorized;
        // }

        const trxns = await updateTransaction(userId, params.transactionId, body);

        return Response.json(serializeBigIntValues(trxns));
    } catch (error) {
        console.log(error);

        return internalServerError;
    }
};
