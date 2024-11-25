// import { Job, Prisma } from "@prisma/client";

// // Base Types
// export type SortOrder = 'asc' | 'desc';

// export type JobSortField = 'createdAt' | 'updatedAt' | 'company' | 'jobTitle' | 'location';

// export type PaginatedResponse<T> = {
//     items: T[];
//     nextCursor: string | null;
//     hasMore: boolean;
//     total: number;
// };

// // Filter Types
// export type JobFilters = {
//     technology?: string[];
//     jobType?: string[];
//     jobWorkMode?: string[];
//     experienceRange?: number[];
//     location?: string;
//     salaryCurrency?: string;
//     salaryRange?: [number, number];
// };

// // Query Parameter Types
// export type JobListParams = {
//     take?: number;
//     cursor?: string;
//     sortBy?: JobSortField;
//     sortOrder?: SortOrder;
//     filters?: JobFilters;
//     search?: string;
// };

// // Function Signatures
// export interface JobRepository {
//     /**
//      * Creates a new job posting
//      * @param data The job data to create
//      * @returns The created job
//      */
//     createJob: (data: Prisma.JobCreateInput) => Promise<Job>;

//     /**
//      * Retrieves a job by its ID
//      * @param id The job ID
//      * @returns The job if found, null otherwise
//      */
//     getJobById: (id: string) => Promise<Job | null>;

//     /**
//      * Retrieves a paginated, sorted, and filtered list of jobs
//      * @param params Query parameters including pagination, sorting, filtering, and search
//      * @returns Paginated response containing jobs and metadata
//      */
//     getJobList: (params?: JobListParams) => Promise<PaginatedResponse<Job>>;

//     /**
//      * Updates an existing job
//      * @param id The job ID to update
//      * @param data The update data
//      * @returns The updated job
//      */
//     updateJob: (id: string, data: Prisma.JobUpdateInput) => Promise<Job>;

//     /**
//      * Deletes a job by its ID
//      * @param id The job ID to delete
//      * @returns The deleted job
//      */
//     deleteJob: (id: string) => Promise<Job>;

//     /**
//      * Adds a job to a user's bookmarks
//      * @param userId The user ID
//      * @param jobId The job ID to bookmark
//      */
//     bookmarkJob: (userId: string, jobId: string) => Promise<void>;

//     /**
//      * Removes a job from a user's bookmarks
//      * @param userId The user ID
//      * @param jobId The job ID to unbookmark
//      */
//     unbookmarkJob: (userId: string, jobId: string) => Promise<void>;

//     /**
//      * Retrieves a user's bookmarked jobs with pagination and sorting
//      * @param userId The user ID
//      * @param params Query parameters for pagination and sorting
//      * @returns Paginated response containing bookmarked jobs
//      */
//     getUserBookmarks: (
//         userId: string,
//         params?: Omit<JobListParams, 'filters'>
//     ) => Promise<PaginatedResponse<Job>>;

//     /**
//      * Searches for jobs matching the query string
//      * @param query The search query
//      * @param params Additional query parameters
//      * @returns Paginated response containing matching jobs
//      */
//     searchJobs: (
//         query: string,
//         params?: Omit<JobListParams, 'search'>
//     ) => Promise<PaginatedResponse<Job>>;
// }

// // Error Types
// export type JobError = {
//     code: 'NOT_FOUND' | 'UNAUTHORIZED' | 'VALIDATION_ERROR' | 'DATABASE_ERROR';
//     message: string;
//     details?: unknown;
// };

// // Result Types
// export type Result<T> = {
//     success: true;
//     data: T;
// } | {
//     success: false;
//     error: JobError;
// };

// // Input Types
// export type CreateJobInput = Omit<
//     Prisma.JobCreateInput,
//     'id' | 'createdAt' | 'updatedAt'
// >;

// export type UpdateJobInput = Omit<
//     Prisma.JobUpdateInput,
//     'id' | 'createdAt' | 'updatedAt'
// >;

// // Query Types
// export type JobQuery = {
//     id?: string;
//     company?: string;
//     jobTitle?: string;
//     technology?: string[];
//     jobType?: string;
//     jobWorkMode?: string;
//     location?: string;
//     experienceRange?: number[];
//     salaryRange?: string[];
//     salaryCurrency?: string;
// };

// // Response Types
// export type JobResponse = {
//     job: Job;
//     bookmarkedBy?: number;
//     similarJobs?: Job[];
// };

// export type JobListResponse = PaginatedResponse<Job> & {
//     filters?: {
//         availableLocations: string[];
//         availableTechnologies: string[];
//         salaryRanges: [number, number][];
//     };
// };
