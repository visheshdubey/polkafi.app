import { Category, Prisma } from "@prisma/client";

import { maxCategories } from "@/lib/entities";
import prisma from "../prisma";

const ERRORS = {
    MAX_CATEGORIES: 'Maximum number of categories reached',
    CATEGORY_NOT_FOUND: 'Category not found',
    EMPTY_NAME: 'Category name cannot be empty',
    USER_ID_REQUIRED: 'User ID is required',
    CATEGORY_ID_REQUIRED: 'Category ID is required',
    NAME_REQUIRED: 'Category name is required',
    NAME_EXISTS: 'Category name already exists'
} as const;

interface CreateCategoryInput {
    name: string;
}

interface UpdateCategoryInput {
    name: string;
}

const snakeUpperCase = (str: string): string => {
    if (!str) {
        throw new Error(ERRORS.EMPTY_NAME);
    }
    return str.trim().toUpperCase().replace(/\s+/g, '_');
};

export const fetchAllCategories = async (userId: string): Promise<Category[]> => {
    if (!userId) {
        throw new Error(ERRORS.USER_ID_REQUIRED);
    }

    return await prisma.category.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
    });
};

export const createCategory = async (
    userId: string,
    data: CreateCategoryInput
): Promise<Category> => {
    if (!userId) {
        throw new Error(ERRORS.USER_ID_REQUIRED);
    }
    if (!data.name) {
        throw new Error(ERRORS.NAME_REQUIRED);
    }

    const existingCategoryCount = await prisma.category.count({
        where: { userId },
    });

    if (existingCategoryCount >= maxCategories) {
        throw new Error(ERRORS.MAX_CATEGORIES);
    }

    try {
        return await prisma.category.create({
            data: {
                name: data.name.trim(),
                label: snakeUpperCase(data.name),
                userId,
            },
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                throw new Error(ERRORS.NAME_EXISTS);
            }
        }
        throw error;
    }
};

export const updateCategory = async (
    userId: string,
    categoryId: string,
    data: UpdateCategoryInput
): Promise<Category> => {
    if (!userId) {
        throw new Error(ERRORS.USER_ID_REQUIRED);
    }
    if (!categoryId) {
        throw new Error(ERRORS.CATEGORY_ID_REQUIRED);
    }
    if (!data.name) {
        throw new Error(ERRORS.NAME_REQUIRED);
    }

    try {
        return await prisma.category.update({
            where: {
                id: categoryId,
                userId,
            },
            data: {
                name: data.name.trim(),
                label: snakeUpperCase(data.name),
            },
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                throw new Error(ERRORS.CATEGORY_NOT_FOUND);
            }
        }
        throw error;
    }
};


export const deleteCategory = async (
    userId: string,
    categoryId: string
): Promise<Category> => {
    if (!userId) {
        throw new Error(ERRORS.USER_ID_REQUIRED);
    }
    if (!categoryId) {
        throw new Error(ERRORS.CATEGORY_ID_REQUIRED);
    }

    try {
        return await prisma.category.delete({
            where: {
                id: categoryId,
                userId,
            },
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                throw new Error(ERRORS.CATEGORY_NOT_FOUND);
            }
        }
        throw error;
    }
};
