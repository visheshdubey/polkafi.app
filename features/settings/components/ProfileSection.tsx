import * as z from "zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useFetchProfileDetails } from "../hooks/useFetchProfileDetails";
import { useForm } from "react-hook-form";
import { useUpdateProfileDetails } from "../hooks/useUpdateProfileDetails";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    email: z.string().email(),
    credits: z.number(),
    defaultCurrency: z.string().nullable(),
});

export function ProfileSection() {
    const { data: profile, isLoading } = useFetchProfileDetails();
    const updateProfile = useUpdateProfileDetails();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: profile?.name || "",
            email: "", // This will be disabled
            credits: profile?.credits || 0,
            defaultCurrency: profile?.defaultCurrency || null,
        },
    });

    useEffect(() => {
        form.reset({
            name: profile?.name || "",
            email: "", // This will be disabled
            credits: profile?.credits || 0,
            defaultCurrency: profile?.defaultCurrency || null,
        });
    }, [profile]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        await updateProfile.mutateAsync({
            name: values.name,
        });
    }

    return (
        <div className="relative">
            <Form {...form}>
                <form className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="credits"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Credits</FormLabel>
                                <FormControl>
                                    <Input {...field} disabled type="number" value={profile?.credits || 0} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="defaultCurrency"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Default Currency</FormLabel>
                                <FormControl>
                                    <Input {...field} disabled value={profile?.defaultCurrency || "USD"} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button onClick={() => onSubmit(form.getValues())} size={"sm"} className="h-10 ml-auto rounded-full w-32 font-medium">
                        Update Profile
                    </Button>
                </form>
            </Form>
            {(updateProfile.isPending || isLoading) && (
                <div className="bg-white/80 backdrop-blur-sm absolute top-0 left-0 w-full h-full flex items-center justify-center">
                    <Loader2 className="animate-spin h-10 w-10" />
                </div>
            )}
        </div>
    );
}
