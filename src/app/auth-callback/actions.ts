'use server';

import { db } from "@/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { User } from "next-auth";

interface ExtendedUser extends User {
    id: string;
}

export const getAuthStatus = async (): Promise<{ success: boolean }> => {
    const session = await getServerSession(authOptions);
    const user = session?.user as ExtendedUser | undefined;

    if (!user?.id || !user?.email) {
        throw new Error('Invalid user data');
    }

    const existingUser = await db.user.findFirst({
        where: { id: user.id }
    });

    if (!existingUser) {
        await db.user.create({
            data: {
                id: user.id,
                email: user.email,
            }
        });
    }

    return { success: true };
};