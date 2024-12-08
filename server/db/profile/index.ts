import prisma from "../prisma";

export const fetchUserProfile = async (email: string) => {
    return await prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            name: true,
            avatar: true,
            defaultCurrency: true,
            credits: true
        }
    });
};

export const updateUserProfile = async (email: string, data: { name: string }) => {
    return await prisma.user.update({
        where: { email },
        data,
        select: {
            id: true,
            name: true,
            avatar: true,
            defaultCurrency: true,
            credits: true
        }
    });
}; 