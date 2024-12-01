import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { ButtonAsync } from "@/components/primitives/ui/button-async";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TransactionCreateMode } from "@/lib/entities";
import { createTrxnFormSchema } from "./schema";
import { useCreateTransaction } from "../../hooks/useCreateTransaction";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const CreateTransactionForm = () => {
    const router = useRouter();
    const { mutate: createTransaction, isPending } = useCreateTransaction();

    const form = useForm<z.infer<typeof createTrxnFormSchema>>({
        resolver: zodResolver(createTrxnFormSchema),
        defaultValues: {
            particular: "",
            amount: "",
            category: "",
            type: "",
        },
    });

    const onSubmit = (values: z.infer<typeof createTrxnFormSchema>) => {
        createTransaction(
            {
                data: values,
                mode: TransactionCreateMode.Form,
            },
            {
                onSuccess: () => {
                    form.reset();
                    // router.push("/transactions"); // or wherever you want to redirect
                },
            },
        );
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="particular"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Particulars</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Tell us a little bit about your transaction" className="_resize-none" {...field} />
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
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="food">Food</SelectItem>
                                        <SelectItem value="transport">Transport</SelectItem>
                                        <SelectItem value="entertainment">Entertainment</SelectItem>
                                        <SelectItem value="utilities">Utilities</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
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
                                            <SelectValue placeholder="Select transaction type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="DEBIT">Expense</SelectItem>
                                        <SelectItem value="CREDIT">Income</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <ButtonAsync
                    type="submit"
                    className="h-10 ml-auto rounded-full w-32 font-medium"
                    isLoading={isPending}
                    loadingText="Submitting..."
                >
                    Submit
                </ButtonAsync>
            </form>
        </Form>
    );
};

export default CreateTransactionForm;
