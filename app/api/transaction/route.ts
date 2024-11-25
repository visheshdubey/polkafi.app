import { createTransaction } from "@/server/db/transactions";
import { get } from "lodash";
import { getAuthSession } from "@/features/auth/utils";

export const POST = async (req: Request) => {
    const session = await getAuthSession();
    const body = await req.json();
    const userId = get(session, "user.id");
    const transaction = await createTransaction(userId, body);

    return Response.json(transaction);
};

// export const PUT = async (req: Request, { params }: { params: Promise<{ jobId: string }> }) => {
//     const session = await getAuthSession();
//     const body = await req.json(); // Parse JSON body from the request
//     console.log("Request Body:", body);

//     const userAfterAddingBookmarkedJob = await updateJobById((await params).jobId, body);

//     return Response.json(userAfterAddingBookmarkedJob);
// };

// export const GET = async (req: NextApiRequest, res: NextApiResponse) => {
//     const session = await getAuthSession();
//     const reqQueryObj = new URL(req.url || "");
//     const searchQueryParams = queryStringToObject(reqQueryObj.search, { arrayFormat: "comma" });
//     const jobs = await getJobList(undefined, searchQueryParams, session?.user.id);

//     return Response.json(jobs);
// };
