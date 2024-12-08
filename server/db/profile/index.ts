import prisma from "../prisma";

export const fetchUserProfile = async (userId: string) => {
    return await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            avatar: true,
            email: true,
            defaultCurrency: true,
            credits: true
        }
    });
};

export const updateUserProfile = async (userId: string, data: { name: string }) => {
    return await prisma.user.update({
        where: { id: userId },
        data,
        select: {
            id: true,
            name: true,
            avatar: true,
            email: true,
            defaultCurrency: true,
            credits: true
        }
    });
}; 