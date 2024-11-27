import { PaginatedResponse } from "@/lib/types/shared";
import { Transaction } from "@prisma/client";

const BASE_URL = "http://localhost:3000/api/";

export const fetchTransactions = async (): Promise<PaginatedResponse<Transaction>> => {
    return (await fetch(`${BASE_URL}transactions`)).json();
};
