import { format, subMonths } from "date-fns";

const today = new Date();

export const dateOptions = Object.freeze({
    today: new Date(),
    lastMonth: format(subMonths(today, 1), "yyyy-MM-dd"),
});

export enum TransactionCreateMode {
    Unknown = 0,
    Audio,
    Text,
    Form,
}

export enum TransactionType {
    "CREDIT",
    "DEBIT",
}

export const AvailableFilters = Object.freeze({
    date: "date",
    type: "type",
    category: "category",
});

export const FilterOptions = Object.freeze({
    [AvailableFilters.date]: [],
    [AvailableFilters.type]: [
        { id: TransactionType.CREDIT, label: TransactionType.CREDIT },
        { id: TransactionType.DEBIT, label: TransactionType.DEBIT },
    ],
});

export const FilterDefaultValues = {
    [AvailableFilters.date]: [dateOptions.today, dateOptions.lastMonth],
    [AvailableFilters.type]: [TransactionType.CREDIT],
    [AvailableFilters.category]: [],
};
