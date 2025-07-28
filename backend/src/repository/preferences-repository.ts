import prisma from "../prisma/prisma-client";

export async function getPreferences(userId: string) {
    return prisma.preferences.findMany({
        where: {
            userId: userId,
        },
    });
}

export async function setPreferences(userId: string, typeIds: string[]) {
    await prisma.preferences.deleteMany({
        where: { userId },
    });

    const preferencesData = typeIds.map((typeId) => ({
        userId: userId,
        typeId: typeId,
    }));

    return prisma.preferences.createMany({
        data: preferencesData,
    });
}
