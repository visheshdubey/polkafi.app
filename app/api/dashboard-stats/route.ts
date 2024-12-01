import { NextRequest, NextResponse } from "next/server";

import { get } from "lodash";
import { getAuthSession } from "@/features/auth/utils";
import { getDashboardStats } from "@/server/db/transactions/stats";

export async function GET(request: NextRequest) {
    try {
        const session = await getAuthSession();
        const userId = get(session, "user.id");

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }


        const searchParams = request.nextUrl.searchParams;
        const dayRange = parseInt(searchParams.get("dayRange") || "30");

        const validRanges = [1, 7, 30, 90, 180, 365];
        if (!validRanges.includes(dayRange)) {
            return NextResponse.json(
                { error: "Invalid dayRange. Must be one of: 1, 7, 30, 90, 180, 365" },
                { status: 400 }
            );
        }

        const stats = await getDashboardStats(userId, dayRange);
        return NextResponse.json(stats);

    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
} 