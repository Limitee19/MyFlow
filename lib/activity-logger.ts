import { prisma } from "./prisma";
import { ActivityType, ActivityAction } from "@prisma/client";

export async function logActivity(
    userId: string,
    type: ActivityType,
    action: ActivityAction,
    description: string,
    metadata?: any
) {
    try {
        await prisma.activity.create({
            data: {
                userId,
                type,
                action,
                description,
                metadata: metadata || {},
            },
        });
    } catch (error) {
        console.error("Failed to log activity:", error);
    }
}
