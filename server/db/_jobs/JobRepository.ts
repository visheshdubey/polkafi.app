// import { AvailableFilters, JobTypeStrings, JobWorkModeStrings, TechnologyStrings } from "@/lib/configs/job";
// import { Job, Prisma } from "@prisma/client";
// import { get, isEmpty } from "lodash";

// import prisma from "@/server/db/prisma";

// type PaginatedResponse<T> = {
//     data: T[];
//     nextCursor: string | null;
//     hasMore: boolean;
//     total: number;
// };

// type JobFindManyWhere = Prisma.JobFindManyArgs["where"];

// const handleSalaryFilter = (value: number[]): JobFindManyWhere => {
//     if (isEmpty(value)) {
//         return {};
//     }

//     const minSalary = get(value, `[0]`, 0);
//     const maxSalary = get(value, `[1]`, 1000000000000);

//     if (minSalary === maxSalary) {
//         return {
//             minSalary: {
//                 lte: minSalary,
//             },
//         };
//     }

//     return {
//         OR: [
//             {
//                 AND: [
//                     {
//                         minSalary: {
//                             gte: minSalary,
//                         },
//                     },
//                     {
//                         maxSalary: {
//                             lte: maxSalary,
//                         },
//                     },
//                 ],
//             },
//             {
//                 AND: [
//                     {
//                         minSalary: null,
//                     },
//                     {
//                         maxSalary: null,
//                     },
//                 ],
//             },
//         ],
//     };
// };

// const handleExperienceFilter = (value: number[]): JobFindManyWhere => {
//     if (isEmpty(value)) {
//         return {};
//     }

//     const minExperience = get(value, `[0]`, 0);
//     const maxExperience = get(value, `[1]`, 10000000);

//     if (minExperience === maxExperience) {
//         return {
//             minExperience: {
//                 lte: minExperience,
//             },
//         };
//     }

//     return {
//         OR: [
//             {
//                 AND: [
//                     {
//                         minExperience: {
//                             gte: minExperience,
//                         },
//                     },
//                     {
//                         maxExperience: {
//                             lte: maxExperience,
//                         },
//                     },
//                 ],
//             },
//             {
//                 AND: [
//                     {
//                         minExperience: null,
//                     },
//                     {
//                         maxExperience: null,
//                     },
//                 ],
//             },
//         ],
//     };
// };

// const handleJobWorkModeFilter = (value: number[]): JobFindManyWhere => {
//     if (isEmpty(value)) {
//         return {};
//     }

//     const mappedValues = value.map((item) => get(JobWorkModeStrings, item));

//     return {
//         OR: [
//             {
//                 jobWorkMode: {
//                     in: mappedValues,
//                 },
//             },
//             { jobWorkMode: null },
//         ],
//     };
// };

// const handleTechnologyFilter = (value: number[]): JobFindManyWhere => {
//     if (isEmpty(value)) {
//         return {};
//     }

//     const mappedValues = value.map((item) => get(TechnologyStrings, item));

//     return {
//         OR: [
//             {
//                 technologyDomain: {
//                     in: mappedValues,
//                 },
//             },
//             // { technologyDomain: null }
//         ],
//     };
// };

// const handleJobTypeFilter = (value: number[]): JobFindManyWhere => {
//     if (isEmpty(value)) {
//         return {};
//     }

//     const mappedValues = value.map((item) => get(JobTypeStrings, item));

//     return {
//         OR: [
//             {
//                 jobType: {
//                     in: mappedValues,
//                 },
//             },
//             { jobType: null },
//         ],
//     };
// };

// // const handleShowOptionsFilter = (value: number[]) => {
// //     if (isEmpty(value)) {
// //         return {};
// //     }

// //     const mappedValues = value.map(item => JobWorkModeKeys[item])

// //     return {
// //         jobWorkMode: {
// //             in: mappedValues
// //         }
// //     }
// // };

// const handleSearchFilter = (searchTerm: string): JobFindManyWhere => {
//     if (isEmpty(searchTerm)) {
//         return;
//     }

//     searchTerm = get(searchTerm, "[0]", searchTerm);

//     return {
//         OR: [
//             { company: { contains: searchTerm, mode: "insensitive" } },
//             { jobTitle: { contains: searchTerm, mode: "insensitive" } },
//             { jobType: { contains: searchTerm, mode: "insensitive" } },
//             { jobWorkMode: { contains: searchTerm, mode: "insensitive" } },
//             { location: { contains: searchTerm, mode: "insensitive" } },
//             { technologyDomain: { contains: searchTerm, mode: "insensitive" } },
//             { raw: { contains: searchTerm, mode: "insensitive" } },
//             { technology: { has: searchTerm } },
//             { tags: { has: searchTerm } },
//         ],
//     };
// };

// const handleCursorFilter = (value: string) => {
//     if (isEmpty(value)) {
//         return;
//     }

//     return {
//         cursor: {
//             id: get(value, "[0]"),
//         },
//         skip: 1,
//     };
// };

// export const getJobList = async (take: number = 10, searchQueryParams: any, userId?: undefined): Promise<PaginatedResponse<Job>> => {
//     const where: JobFindManyWhere = {
//         AND: [
//             // handleSalaryFilter(searchQueryParams[AvailableFilters.salary]) || {},
//             handleExperienceFilter(searchQueryParams[AvailableFilters.experience]) || {},
//             handleJobWorkModeFilter(searchQueryParams[AvailableFilters.jobWorkMode]) || {},
//             handleTechnologyFilter(searchQueryParams[AvailableFilters.technology]) || {},
//             handleJobTypeFilter(searchQueryParams[AvailableFilters.jobType]) || {},
//             handleSearchFilter(searchQueryParams[AvailableFilters.search]) || {},
//             {
//                 seekingWork: {
//                     equals: false,
//                 },
//             },
//             {
//                 AND: [
//                     {
//                         raw: {
//                             not: {
//                                 contains: "dead",
//                             },
//                         },
//                     },
//                     {
//                         raw: {
//                             not: {
//                                 contains: "flagged",
//                             },
//                         },
//                     },
//                 ],
//             },
//         ],
//     };

//     console.log(JSON.stringify(where));

//     const items = await prisma.job.findMany({
//         take: take + 1,
//         ...handleCursorFilter(searchQueryParams[AvailableFilters.cursor]),
//         where,
//         orderBy: {
//             id: "asc",
//         },
//         include: {
//             UserJobBookMarks: {
//                 where: {
//                     userId,
//                 },
//             },
//         },
//     });

//     const totalItemsInDb = await prisma.job.count({ where });

//     const hasMore = items.length > take;
//     const data = hasMore ? items.slice(0, -1) : items;

//     return {
//         data,
//         nextCursor: hasMore ? data[data.length - 1].id : null,
//         hasMore,
//         total: totalItemsInDb,
//     };
// };

// export const addJobToMyBookMarkList = async (userId: string, jobId: string) => {
//     return await prisma.userJobBookMark.create({
//         data: {
//             jobId,
//             userId,
//         },
//     });
// };

// export const getJobById = async (jobId: string) => {
//     return await prisma.job.findUnique({
//         where: {
//             id: jobId,
//         },
//     });
// };

// export const updateJobById = async (jobId: string, jobData: any) => {
//     return await prisma.job.update({
//         where: {
//             id: jobId,
//         },
//         data: jobData,
//     });
// };
