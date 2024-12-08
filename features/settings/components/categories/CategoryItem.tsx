import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Category } from "@prisma/client";
import { PencilIcon } from "lucide-react";
import { UpdateCategoryForm } from "./UpdateCategoryForm";

interface CategoryItemProps {
    category: Category;
}

export function CategoryItem({ category }: CategoryItemProps) {
    return (
        <Sheet>
            <div className="flex items-center justify-between py-4 px-2 rounded-lg border-b">
                <div>
                    <h3 className="font-medium">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">Created: {new Date(category.createdAt).toLocaleDateString()}</p>
                </div>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="sm">
                        <PencilIcon className="h-4 w-4" />
                    </Button>
                </SheetTrigger>
            </div>

            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Update Category</SheetTitle>
                </SheetHeader>
                <UpdateCategoryForm category={category} />
            </SheetContent>
        </Sheet>
    );
}
