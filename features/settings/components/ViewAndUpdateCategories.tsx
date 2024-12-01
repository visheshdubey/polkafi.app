import * as z from "zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, PencilIcon } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFetchAllCategories } from "@/features/category/hooks/useFetchAllCategories";
import { useForm } from "react-hook-form";
import { useUpdateCategory } from "@/features/category/hooks/useUpdateCategory";
import { zodResolver } from "@hookform/resolvers/zod";

const updateFormSchema = z.object({
    name: z.string().min(1, "Category name is required"),
});

type UpdateFormValues = z.infer<typeof updateFormSchema>;

export function ViewAndUpdateCategories() {
    const { data: categories, isLoading } = useFetchAllCategories();
    const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();

    const form = useForm<UpdateFormValues>({
        resolver: zodResolver(updateFormSchema),
    });

    const onSubmit = (values: UpdateFormValues, categoryId: string) => {
        updateCategory(
            { id: categoryId, data: values },
            {
                onSuccess: () => {
                    form.reset();
                },
            },
        );
    };

    return (
        <div className="relative space-y-6 min-h-96">
            <div className="space-y-2">
                {categories?.map((category) => (
                    <Sheet key={category.id}>
                        <div className="flex items-center justify-between py-4 px-2 rounded-lg border-b">
                            <div>
                                <h3 className="font-medium">{category.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                    Created: {new Date(category.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="sm" onClick={() => form.setValue("name", category.name)}>
                                    <PencilIcon className="h-4 w-4" />
                                </Button>
                            </SheetTrigger>
                        </div>

                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Update Category</SheetTitle>
                            </SheetHeader>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit((values) => onSubmit(values, category.id))} className="space-y-4 mt-4">
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
                        </SheetContent>
                    </Sheet>
                ))}
            </div>
            {(isUpdating || isLoading) && (
                <div className="bg-white/80 backdrop-blur-sm absolute top-0 left-0 w-full h-full flex items-center justify-center">
                    <Loader2 className="animate-spin h-10 w-10" />
                </div>
            )}
        </div>
    );
}
