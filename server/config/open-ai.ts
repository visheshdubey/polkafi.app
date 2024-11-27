import OpenAIClient, { PromptArray } from "@/server/services/open-ai/OpenAIClient";

import { z } from "zod";

export const openai = OpenAIClient.getInstance({ key: process.env.OPENAI_KEY || "", model: "gpt-4o", audioModel: "whisper-1" });

const instruction = `Please extract the following information from the given financial transaction text. If a piece of information is not available or cannot be determined, use "undefined" as the value. Return the data in a JSON format with the following structure:

{
  "particulars": String or undefined,
  "amount": String or undefined,
  "category": String or undefined, 
  "type": CREDIT | DEBIT,
}

Notes:
- particulars - format will be <object> <english filling words> <amount> without currency, remember object and amount will always be present in the particulars.
- amount is a bigInt, in lakhs crores, you always extract equivalent numeric BigInt or decimal value.
- category relevant category provided in the zod schema.
- type - either DEBIT or CREDIT.

Please provide the extracted information in JSON format for the given financial transaction text.`;

export const prompt: PromptArray[] = [
    { role: "system", content: "You are a helpful finance expert, designed to analyze financial transaction text and output in JSON." },
    { role: "user", content: instruction },
];

export const trxnSchema = (categories: string[]) => {
    return z.object({
        particulars: z.string().optional(),
        amount: z.string().optional(),
        category: z.enum(["FOOD", ...categories]).optional(),
        type: z.enum(["CREDIT", "DEBIT"]).optional(),
    });
};
