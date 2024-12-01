import { createCategory, fetchAllCategories } from "@/server/db/categories";
import { internalServerError, isUserUnauthorized, unauthorized } from "@/lib/utils/default-response";

import { get } from "lodash";
import { getAuthSession } from "@/features/auth/utils";
import { serializeBigIntValues } from "@/lib/utils/bigInt-serializer";

export const POST = async (req: Request) => {
    try {
        const session = await getAuthSession();
        const userId = get(session, "user.id");

        if (isUserUnauthorized(userId)) {
            return unauthorized;
        }

        const body = await req.json();
        const category = await createCategory(userId, body);

        return Response.json(serializeBigIntValues(category));
    } catch (error) {
        console.log(error);
        return internalServerError;
    }
};

export const GET = async (req: Request) => {
    try {
        const session = await getAuthSession();
        const userId = get(session, "user.id");

        if (isUserUnauthorized(userId)) {
            return unauthorized;
        }

        const categories = await fetchAllCategories(userId);

        return Response.json(serializeBigIntValues(categories));
    } catch (error) {
        console.log(error);
        return internalServerError;
    }
};
