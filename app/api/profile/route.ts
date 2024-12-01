import { NextResponse } from "next/server";
import { authOptions } from "@/features/auth/auth-options";
import { getServerSession } from "next-auth";
import prisma from "@/server/db/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: {
                email: session.user.email,
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

        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { name } = body;

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        const user = await prisma.user.update({
            where: {
                email: session.user.email,
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
