import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-logger";

export const dynamic = "force-dynamic";


export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");

        const where: any = {
            userId: session.user.id,
        };

        if (status) {
            where.status = status;
        }

        const reminders = await prisma.reminder.findMany({
            where,
            orderBy: [
                { dueDate: "asc" },
                { priority: "desc" },
            ],
        });

        return NextResponse.json(reminders);
    } catch (error) {
        console.error("Error fetching reminders:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { title, description, dueDate, priority } = body;

        if (!title || !dueDate) {
            return NextResponse.json(
                { error: "Title and due date are required" },
                { status: 400 }
            );
        }

        const reminder = await prisma.reminder.create({
            data: {
                title,
                description,
                dueDate: new Date(dueDate),
                priority: priority || "MEDIUM",
                userId: session.user.id,
            },
        });

        // Log activity
        await logActivity(
            session.user.id,
            "REMINDER",
            "CREATED",
            `Created reminder: ${title}`
        );

        return NextResponse.json(reminder, { status: 201 });
    } catch (error) {
        console.error("Error creating reminder:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { id, title, description, dueDate, status, priority } = body;

        if (!id) {
            return NextResponse.json(
                { error: "Reminder ID required" },
                { status: 400 }
            );
        }

        // Verify ownership
        const existing = await prisma.reminder.findFirst({
            where: { id, userId: session.user.id },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Reminder not found" },
                { status: 404 }
            );
        }

        const reminder = await prisma.reminder.update({
            where: { id },
            data: {
                title,
                description,
                dueDate: dueDate ? new Date(dueDate) : undefined,
                status,
                priority,
            },
        });

        // Log activity
        await logActivity(
            session.user.id,
            "REMINDER",
            "UPDATED",
            `Updated reminder: ${title || existing.title}`
        );

        return NextResponse.json(reminder);
    } catch (error) {
        console.error("Error updating reminder:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { error: "Reminder ID required" },
                { status: 400 }
            );
        }

        // Verify ownership
        const existing = await prisma.reminder.findFirst({
            where: { id, userId: session.user.id },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Reminder not found" },
                { status: 404 }
            );
        }

        await prisma.reminder.delete({
            where: { id },
        });

        // Log activity
        await logActivity(
            session.user.id,
            "REMINDER",
            "DELETED",
            `Deleted reminder: ${existing.title}`
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting reminder:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
