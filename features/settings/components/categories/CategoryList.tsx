import { Category } from "@prisma/client";
import { CategoryItem } from "./CategoryItem";

interface CategoryListProps {
    categories: Category[];
}

export function CategoryList({ categories }: CategoryListProps) {
    return (
        <div className="space-y-2">
            {categories.map(
                (category) => category.name && category.label !== "OTHER" && <CategoryItem key={category.id} category={category} />,
            )}
        </div>
    );
}
