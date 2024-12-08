import { fetchUserProfile, updateUserProfile } from "@/server/db/profile";

import { NextResponse } from "next/server";
import { authOptions } from "@/features/auth/auth-options";
import { get } from "lodash";
import { getServerSession } from "next-auth";
import { unauthorized } from "@/lib/utils/default-response";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        const userEmail = get(session, "user.email");

        if (!userEmail) {
            return unauthorized;
        }

        const user = await fetchUserProfile(userEmail);

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("[PROFILE_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const userEmail = get(session, "user.email");

        if (!userEmail) {
            return unauthorized;
        }

        const body = await req.json();
        const { name } = body;

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        const user = await updateUserProfile(userEmail, { name });

        return NextResponse.json(user);
    } catch (error) {
        console.error("[PROFILE_PUT]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
