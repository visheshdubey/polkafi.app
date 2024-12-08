import * as z from "zod";

import { CategoryList } from "./categories/CategoryList";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { useFetchAllCategories } from "@/features/category/hooks/useFetchAllCategories";

const updateFormSchema = z.object({
    name: z.string().min(1, "Category name is required"),
});

export type UpdateFormValues = z.infer<typeof updateFormSchema>;

export function ViewAndUpdateCategories() {
    const { data: categories, isLoading } = useFetchAllCategories();

    return (
        <div className="relative space-y-6 min-h-96">
            <CategoryList categories={categories ?? []} />
            {isLoading && <LoadingOverlay />}
        </div>
    );
}
