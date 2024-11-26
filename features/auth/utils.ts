import authOptions from "./auth-options";
import { getServerSession } from "next-auth";

export async function getAuthSession() {
    return await getServerSession(authOptions);;
}