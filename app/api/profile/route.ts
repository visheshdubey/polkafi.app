import { isUserUnauthorized, unauthorized } from "@/lib/utils/default-response";

import { NextResponse } from "next/server";
import { authOptions } from "@/features/auth/auth-options";
import { get } from "lodash";
import { getServerSession } from "next-auth";
import prisma from "@/server/db/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        const userId = get(session, "user.id");
        const userEmail = get(session, "user.email");

        if (isUserUnauthorized(userId)) {
            return unauthorized;
        }

        if (userEmail === undefined) {
            return unauthorized;
        }

        const user = await prisma.user.findUnique({
            where: {
                email: userEmail,
            },
            select: {
                id: true,
                name: true,
                avatar: true,
                defaultCurrency: true,
                credits: true,
            },
        });

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
        const userId = get(session, "user.id");
        const userEmail = get(session, "user.email");

        if (isUserUnauthorized(userId)) {
            return unauthorized;
        }

        if (userEmail === undefined) {
            return unauthorized;
        }

        const body = await req.json();
        const { name } = body;

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        const user = await prisma.user.update({
            where: {
                email: userEmail,
            },
            data: {
                name,
            },
            select: {
                id: true,
                name: true,
                avatar: true,
                defaultCurrency: true,
                credits: true,
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error("[PROFILE_PUT]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
