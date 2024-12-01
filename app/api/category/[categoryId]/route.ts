import { NextRequest, NextResponse } from "next/server";

import { get } from "lodash";
import { getAuthSession } from "@/features/auth/utils";
import { updateCategory } from "@/server/db/categories";
import { z } from "zod";

const updateCategorySchema = z.object({
    name: z.string().min(1, "Category name is required"),
});

export async function PUT(
    req: NextRequest,
    { params }: { params: { categoryId: string } }
) {
    try {
        const session = await getAuthSession();
        const userId = get(session, "user.id");

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const validatedData = updateCategorySchema.parse(body);

        const updatedCategory = await updateCategory(
            userId,
            params.categoryId,
            validatedData
        );

        return NextResponse.json(updatedCategory);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { errors: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
