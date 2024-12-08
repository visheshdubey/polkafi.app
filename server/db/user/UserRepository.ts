import { User, UserRole } from "@prisma/client";
import { get, isEmpty } from "lodash";

import { createCategory } from "../categories";
import { defaultCategories } from "@/lib/entities";
import prisma from "@/server/db/prisma";

export type AuthUserData = {
    email: string;
    name?: string | null;
    avatar?: string | null;
    provider?: string;
};

export async function findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
        where: { email }
    });
}

export async function createUser(userData: AuthUserData): Promise<User> {
    const user = await prisma.user.create({
        data: {
            email: userData.email,
            name: userData.name || null,
            avatar: userData.avatar || null,
            //! TODO:
            // provider: userData.provider,
            role: UserRole.USER
        }
    });

    await createDefaultCategories(user.id);

    return user;
}

async function createDefaultCategories(userId: string) {
    for (const category of defaultCategories) {
        await createCategory(userId, { name: category });
    }
}

export async function updateUserLogin(
    userId: string,
    provider: string
): Promise<User> {
    return prisma.user.update({
        where: { id: userId },
        data: {
            updatedAt: new Date(),
            provider
        }
    });
}

export async function updateUserToken(
    userId: string,
    token: string
): Promise<User> {
    return prisma.user.update({
        where: { id: userId },
        data: { token }
    });
}

export const isUserValid = (userId: string) => {
    const user = prisma.user.findUnique({
        where: { id: userId }
    });

    return isEmpty(user);
};

export const userHasCredits = async (userId: string, credits: number = 1) => {
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });
    console.log(get(user, "credits", 0) > credits, credits);

    return get(user, "credits", 0) > credits;
};

export async function findOrCreateUser(
    userData: AuthUserData,
    token?: string
): Promise<User> {
    const existingUser = await findUserByEmail(userData.email);

    if (existingUser) {
        return prisma.user.update({
            where: { id: existingUser.id },
            data: {
                name: userData.name || existingUser.name,
                avatar: userData.avatar || existingUser.avatar,
                provider: userData.provider,
                token: token || existingUser.token,
                updatedAt: new Date()
            }
        });
    }

    return prisma.user.create({
        data: {
            ...userData,
            token,
            role: UserRole.USER,
        }
    });
}