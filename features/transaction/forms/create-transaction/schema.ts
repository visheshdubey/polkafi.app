import { z } from "zod";

export const createTrxnFormSchema = z.object({
    particulars: z.string().optional(),
    amount: z.string().optional(),
    category: z.enum(["FOOD"]).optional(),
    type: z.enum(["CREDIT", "DEBIT"]).optional(),
});
