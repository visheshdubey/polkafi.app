import { AvailableFilters, FilterDefaultValues, TransactionType } from "@/lib/entities";

import { ImmerStateCreator } from "./types";

type TrxnState = {
    filters: TrxnFilters;
};

type TrxnFilters = {
    [AvailableFilters.date]: number[];
    [AvailableFilters.category]: string[];
    [AvailableFilters.type]: TransactionType[];
};

type TrxnActions = {
    updateFilter: (filterId: keyof TrxnFilters, value: any) => void;
};

type TrxnSlice = { trxn: TrxnState & TrxnActions };

const initialState: TrxnState = {
    filters: {
        [AvailableFilters.date]: FilterDefaultValues[AvailableFilters.date],
        [AvailableFilters.category]: FilterDefaultValues[AvailableFilters.category],
        [AvailableFilters.type]: FilterDefaultValues[AvailableFilters.type],
    },
};

export const createTrxnSlice: ImmerStateCreator<TrxnSlice> = (set) => ({
    trxn: {
        ...initialState,
        updateFilter: (filterId, value) =>
            set(({ trxn: jobs }: TrxnSlice) => {
                jobs.filters[filterId] = value;
            }),
    },
});
