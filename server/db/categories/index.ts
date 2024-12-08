import { maxCategories } from "@/lib/entities";
import prisma from "../prisma";

const snakeUpperCase = (str: string): string => {
    return str.toUpperCase().replace(/\s+/g, '_');
};

export const fetchAllCategories = async (userId: string) => {
    return await prisma.category.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
};

export const createCategory = async (userId: string, data: { name: string }) => {
    const existingCategoryCount = await prisma.category.count({
        where: {
            name: data.name,
            userId,
        },
    });

    if (existingCategoryCount >= maxCategories) {
        throw new Error("User has reached the maximum number of categories");
    }

    return await prisma.category.create({
        data: {
            name: data.name,
            label: snakeUpperCase(data.name),
            userId,
        },
    });
};

export const updateCategory = async (userId: string, categoryId: string, data: { name: string }) => {
    return await prisma.category.update({
        where: {
            id: categoryId,
            userId,
        },
        data: {
            name: data.name,
            label: snakeUpperCase(data.name),
        },
    });
};

export const deleteCategory = async (userId: string, categoryId: string) => {
    return await prisma.category.delete({
        where: {
            id: categoryId,
            userId,
        },
    });
};
