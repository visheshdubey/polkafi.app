import { isUserUnauthorized, unauthorized } from "@/lib/utils/default-response";

import { get } from "lodash";
import { getAuthSession } from "@/features/auth/utils";
import { openai } from "@/server/config/open-ai";

export const POST = async (req: Request) => {
    const session = await getAuthSession();
    const userId = get(session, "user.id");

    if (isUserUnauthorized(userId)) {
        return unauthorized;
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const text = await openai.speechToText({ file });

    return Response.json(text);
};
