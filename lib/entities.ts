import { format, subDays, subMonths } from "date-fns";

const today = new Date();

export const dateOptions = Object.freeze({
    today: new Date(),
    lastMonth: format(subMonths(today, 1), "yyyy-MM-dd"),
});

export const dashboardStatsDayRangeOptions = Object.freeze({
    last1Day: 1,
    last7Days: 7,
    last30Days: 30,
    last90Days: 90,
    last180Days: 180,
    last365Days: 365,
});

export const dashboardStatsDayRangeOptionLabels = Object.freeze({
    [dashboardStatsDayRangeOptions.last1Day]: "Last 1 Day",
    [dashboardStatsDayRangeOptions.last7Days]: "Last 7 Days",
    [dashboardStatsDayRangeOptions.last30Days]: "Last 30 Days",
    [dashboardStatsDayRangeOptions.last90Days]: "Last 90 Days",
    [dashboardStatsDayRangeOptions.last180Days]: "Last 180 Days",
    [dashboardStatsDayRangeOptions.last365Days]: "Last 365 Days",
});

export const dashboardStatsDayRangeOptionNowMinus = Object.freeze({
    [dashboardStatsDayRangeOptions.last1Day]: subDays(today, 1),
    [dashboardStatsDayRangeOptions.last7Days]: subDays(today, 7),
    [dashboardStatsDayRangeOptions.last30Days]: subDays(today, 30),
    [dashboardStatsDayRangeOptions.last90Days]: subDays(today, 90),
    [dashboardStatsDayRangeOptions.last180Days]: subDays(today, 180),
    [dashboardStatsDayRangeOptions.last365Days]: subDays(today, 365),
});

export enum TransactionCreateMode {
    Unknown = 0,
    Audio,
    Text,
    Form,
}

export enum TransactionType {
    CREDIT = "credit",
    DEBIT = "debit",
}

export enum TransactionTypeLabel {
    CREDIT = "Income",
    DEBIT = "Expense",
}

export const AvailableFilters = Object.freeze({
    date: "date",
    type: "type",
    category: "category",
});

export const FilterOptions = Object.freeze({
    [AvailableFilters.date]: [],
    [AvailableFilters.type]: [
        { id: TransactionType.CREDIT, label: TransactionTypeLabel.CREDIT },
        { id: TransactionType.DEBIT, label: TransactionTypeLabel.DEBIT },
    ],
});

export const FilterDefaultValues = {
    [AvailableFilters.date]: [dashboardStatsDayRangeOptions.last30Days],
    [AvailableFilters.type]: [TransactionType.CREDIT],
    [AvailableFilters.category]: [],
};

export const mapTransactionTypeToFilterValue = (type: TransactionType) => {
    return FilterOptions[AvailableFilters.type].find((t) => t.id === type)?.id;
};

export const mapFilterValueToTransactionType = (value: string) => {
    return FilterOptions[AvailableFilters.type].find((t) => t.id === value)?.id;
};
