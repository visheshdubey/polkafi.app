"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { DynamicBreadcrumb } from "../components/DynamicBreadcrumb";
import { Input } from "@/components/ui/input";
import MagicalGradientCard from "../components/MagicalGradientCard";
import PageTitle from "../components/PageTitle";
import RecordTransactionWidget from "../components/RecordTransactionWidget";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type Props = {};
export const formSchema = z.object({
    particulars: z.string().optional(),
    amount: z.string().optional(),
    category: z.enum(["FOOD"]).optional(),
    type: z.enum(["CREDIT", "DEBIT"]).optional(),
});

const NewTransactionWrapper = (props: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            particulars: "",
        },
    });
    const [first, setFirst] = useState(0);

    const breadcrumbItems = [
        { name: "App", path: "/" },
        { name: "New Transaction", path: "/docs/components" },
    ];

    const handleComplete = async () => {
        setIsLoading(true);
        try {
            // Your submission logic here
            // await submitData();
            alert("time up");
        } finally {
            setIsLoading(false);
        }
    };
    const handleTimeout = () => {
        const x = first / 100; // This gives 1% of the current value
        setTimeout(() => {
            setFirst((prevFirst) => prevFirst + x);
        }, 100);
    };

    const onSubmit = () => {};
    return (
        <div className="max-w-screen-xl flex flex-col gap-3 lg:gap-6 px-3 lg:px-6 mx-auto w-full min-h-screen">
            <div className="mt-3 lg:mt-12">
                <DynamicBreadcrumb items={breadcrumbItems} />
            </div>
            <div className="flex flex-wrap items-baseline w-full gap-2">
                <PageTitle>New Transaction</PageTitle>
            </div>
            <MagicalGradientCard className="flex flex-col mt-3">
                <span className="text-purple-800/70 font-medium text-sm">Use voice or text to log transaction</span>
                <RecordTransactionWidget className="flex flex-row mt-4 mx-auto" />
            </MagicalGradientCard>

            <MagicalGradientCard className="flex flex-col">
                <span className="text-purple-800/70 font-medium text-sm">Fill below form to log your transaction</span>

                <div className="w-full shadow-sm min-h-12 bg-white mt-4 lg:p-6 p-4 rounded-xl">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="particulars"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Particulars</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Tell us a little bit about your transaction"
                                                className="_resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 flex-wrap items-center">
                                <FormField
                                    control={form.control}
                                    name="amount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Amount</FormLabel>
                                            <FormControl>
                                                <Input className="w-full" placeholder="Enter amount" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a verified email to display" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="m@example.com">m@example.com</SelectItem>
                                                    <SelectItem value="m@google.com">m@google.com</SelectItem>
                                                    <SelectItem value="m@support.com">m@support.com</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Type</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a verified email to display" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="m@example.com">m@example.com</SelectItem>
                                                    <SelectItem value="m@google.com">m@google.com</SelectItem>
                                                    <SelectItem value="m@support.com">m@support.com</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Button type="submit" className="h-10 ml-auto rounded-full w-32 font-medium">
                                Submit
                            </Button>
                        </form>
                    </Form>
                </div>
            </MagicalGradientCard>
        </div>
    );
};

export default NewTransactionWrapper;
