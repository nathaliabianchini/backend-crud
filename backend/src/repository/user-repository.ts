import prisma from "../prisma/prisma-client";

export async function findByEmailOrCpf(email: string, cpf: string) {
    return prisma.users.findFirst({
        where: {
            OR: [
                {email},
                {cpf}
            ]
        }
    });
}

export async function create(data: { name: string, email: string, cpf: string, password: string }) {
    return prisma.users.create({
        data: {
            ...data,
            avatar: "uploads/default-avatar.png",
            xp: 0,
            level: 1
        },
    });
}

export async function getByEmail(email: string) {
    return prisma.users.findUnique({
        where: {
            email
        }
    });
}

export async function getById(userId: string) {
    return prisma.users.findFirst({
        where: {
            id: userId
        }
    });
}

export async function update(data: any, userId: string) {
    return prisma.users.update({
        where: {id: userId},
        data: data,
    });
}

export async function deactivate(userId: string) {
    return prisma.users.update({
        where: {id: userId},
        data: {
            deletedAt: new Date(),
        },
    });
}
