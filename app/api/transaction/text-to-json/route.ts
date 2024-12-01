import { isUserUnauthorized, unauthorized } from "@/lib/utils/default-response";
import { openai, prompt, trxnSchema } from "@/server/config/open-ai";

import { fetchAllCategories } from "@/server/db/categories";
import { get } from "lodash";
import { getAuthSession } from "@/features/auth/utils";

export const POST = async (req: Request) => {
    const session = await getAuthSession();
    const body = await req.json();
    const userId = get(session, "user.id");

    if (isUserUnauthorized(userId)) {
        return unauthorized;
    }

    const userCategories = await fetchAllCategories(userId);
    const categories = userCategories.map((category) => category.label).filter((label): label is string => label !== null);

    const transaction = (await openai.schemaBasedCompletion({
        message: get(body, "text"),
        prompt,
        schema: trxnSchema(categories),
    })) as string;

    return Response.json(JSON.parse(transaction));
};
