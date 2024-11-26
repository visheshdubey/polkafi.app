import { isUserUnauthorized, unauthorized } from "@/lib/utils/default-response";
import { openai, prompt, trxnSchema } from "@/server/config/open-ai";

import { get } from "lodash";
import { getAuthSession } from "@/features/auth/utils";

export const POST = async (req: Request) => {
    const session = await getAuthSession();
    const body = await req.json();
    const userId = get(session, "user.id");

    if (isUserUnauthorized(userId)) {
        return unauthorized;
    }

    const transaction = (await openai.schemaBasedCompletion({
        message: get(body, "text"),
        prompt,
        schema: trxnSchema(["VEHICLE", "FOOD"]),
    })) as string;

    return Response.json(JSON.parse(transaction));
};
