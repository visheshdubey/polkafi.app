import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useFetchAllCategories } from "@/features/category/hooks/useFetchAllCategories";

interface CategorySelectProps {
    onSelect: (id: string) => void;
    value?: string;
    defaultValue?: string;
    className?: string;
}

export const CategorySelect = ({ onSelect, value, defaultValue, className }: CategorySelectProps) => {
    const { data: categories } = useFetchAllCategories();
    return (
        <Select onValueChange={onSelect} value={value} defaultValue={defaultValue}>
            <SelectTrigger className={`${className}`}>
                <SelectValue placeholder="Select Category" className="text-sm" />
            </SelectTrigger>

            <SelectContent>
                {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                        {category.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};
