import { forbidden, isUserUnauthorized, unauthorized } from "@/lib/utils/default-response";
import { openai, prompt, trxnSchema } from "@/server/config/open-ai";

import { deductCredit } from "@/server/db/credits";
import { fetchAllCategories } from "@/server/db/categories";
import { get } from "lodash";
import { getAuthSession } from "@/features/auth/utils";
import { userHasCredits } from "@/server/db/user/UserRepository";

export const POST = async (req: Request) => {
    const session = await getAuthSession();
    const body = await req.json();
    const userId = get(session, "user.id");

    if (isUserUnauthorized(userId)) {
        return unauthorized;
    }

    if (!(await userHasCredits(userId, 1))) {
        return forbidden;
    }

    const userCategories = await fetchAllCategories(userId);
    const categories = userCategories.map((category) => category.label).filter((label): label is string => label !== null);
    const transaction = (await openai.schemaBasedCompletion({
        message: get(body, "text"),
        prompt,
        schema: trxnSchema(categories),
    })) as string;

    await deductCredit(userId, 1);

    return Response.json(JSON.parse(transaction));
};
