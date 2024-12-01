import { z } from "zod";

export const createTrxnFormSchema = z.object({
    particular: z.string().min(1, "Particulars is required"),
    amount: z.string().min(1, "Amount is required"),
    category: z.string().min(1, "Category is required"),
    type: z.string().min(1, "Type is required"),
});
