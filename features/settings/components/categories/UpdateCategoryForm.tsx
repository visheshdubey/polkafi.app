import * as z from "zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Category } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { UpdateFormValues } from "../ViewAndUpdateCategories";
import { useForm } from "react-hook-form";
import { useUpdateCategory } from "@/features/category/hooks/useUpdateCategory";
import { zodResolver } from "@hookform/resolvers/zod";

const updateFormSchema = z.object({
    name: z.string().min(1, "Category name is required"),
});

interface UpdateCategoryFormProps {
    category: Category;
}

export function UpdateCategoryForm({ category }: UpdateCategoryFormProps) {
    const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();

    const form = useForm<UpdateFormValues>({
        resolver: zodResolver(updateFormSchema),
        defaultValues: {
            name: category.name ?? "",
        },
    });

    const onSubmit = (values: UpdateFormValues) => {
        updateCategory(
            { id: category.id, data: values },
            {
                onSuccess: () => {
                    form.reset();
                },
            },
        );
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter category name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={isUpdating}>
                    {isUpdating ? "Updating..." : "Update Category"}
                </Button>
            </form>
        </Form>
    );
}
