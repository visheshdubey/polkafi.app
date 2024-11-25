import { jobSchema, openai, prompt } from "@/server/config/open-ai";

import { get } from "lodash";
import { getAuthSession } from "@/features/auth/utils";

export const POST = async (req: Request) => {
    const session = await getAuthSession();
    const body = await req.json();
    const userId = get(session, "user.id");

    const transaction = (await openai.schemaBasedCompletion({
        message: get(body, "text"),
        prompt,
        schema: jobSchema(["VEHICLE", "FOOD"]),
    })) as string;

    return Response.json(JSON.parse(transaction));
};
