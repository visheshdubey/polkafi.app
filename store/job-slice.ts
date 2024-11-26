import { FilterDefaultValues } from "@/lib/configs/job";
import { ImmerStateCreator } from "./types";

type JobState = {
    filters: JobFilters;
};

type JobStringFilters = {
    search: string;
};

type JobRangeFilters = {
    salary: number[];
    experience: number[];
};

type JobMultiSelectFilters = {
    jobWorkMode: number[];
    technology: number[];
    jobType: number[];
    showOptions: number[];
};

type JobFilters = JobRangeFilters & JobMultiSelectFilters & JobStringFilters;

type JobActions = {
    updateFilter: (filterId: keyof JobFilters, value: any) => void
};

type JobSlice = { jobs: JobState & JobActions };

const initialState: JobState = {
    filters: {
        salary: FilterDefaultValues.salary,
        experience: FilterDefaultValues.experience,
        jobWorkMode: [],
        technology: [],
        jobType: [],
        showOptions: FilterDefaultValues.showOptions,
        search: ''
    },
};

export const createJobSlice: ImmerStateCreator<JobSlice> = (set) => ({
    jobs: {
        ...initialState,
        updateFilter: (filterId, value) =>
            set(({ jobs }: JobSlice) => {
                jobs.filters[filterId] = value;
            }),
    },
});
