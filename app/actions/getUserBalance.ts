'use server';

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

async function getUserBalance(): Promise<{
    balance?: number;
    error?: string;
}> {
    const { userId } = auth();
    if(!userId) {
        return { error: 'User nor found' } 
    }

    try {
        const transactions = await db.transaction.findMany({
            where: { userId }
        });

        const balance = transactions.reduce((sum, transaction) => sum + transaction.amount, 0 );

        return { balance }
    } catch (error) {
        return { error: "database error"}
    }
};

export default getUserBalance