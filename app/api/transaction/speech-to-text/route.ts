import { forbidden, isUserUnauthorized, unauthorized } from "@/lib/utils/default-response";

import { deductCredit } from "@/server/db/credits";
import { get } from "lodash";
import { getAuthSession } from "@/features/auth/utils";
import { openai } from "@/server/config/open-ai";
import { userHasCredits } from "@/server/db/user/UserRepository";

export const POST = async (req: Request) => {
    const session = await getAuthSession();
    const userId = get(session, "user.id");

    if (isUserUnauthorized(userId)) {
        return unauthorized;
    }

    if (!(await userHasCredits(userId, 1))) {
        return forbidden;
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const text = await openai.speechToText({ file });

    await deductCredit(userId, 1);

    return Response.json(text);
};
