import prisma from "../prisma";

export const deductCredit = async (userId: string, amount: number) => {
    await prisma.user.update({
        where: { id: userId },
        data: { credits: { decrement: amount } }
    });
};
