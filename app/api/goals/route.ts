import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-logger";

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const goals = await prisma.goal.findMany({
            where: {
                userId: session.user.id,
            },
            include: {
                category: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(goals);
    } catch (error) {
        console.error("Error fetching goals:", error);
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
        const { title, type, targetAmount, period, categoryId } = body;

        if (!title || !type || !targetAmount || !period) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const goal = await prisma.goal.create({
            data: {
                title,
                type,
                targetAmount: parseFloat(targetAmount),
                period,
                categoryId: categoryId || null,
                userId: session.user.id,
            },
            include: {
                category: true,
            },
        });

        // Log activity
        await logActivity(
            session.user.id,
            "GOAL",
            "CREATED",
            `Created goal: ${title}`
        );

        return NextResponse.json(goal, { status: 201 });
    } catch (error) {
        console.error("Error creating goal:", error);
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
        const { id, title, type, targetAmount, currentAmount, period, categoryId } = body;

        if (!id) {
            return NextResponse.json(
                { error: "Goal ID required" },
                { status: 400 }
            );
        }

        // Verify ownership
        const existing = await prisma.goal.findFirst({
            where: { id, userId: session.user.id },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Goal not found" },
                { status: 404 }
            );
        }

        // Calculate status based on progress
        let status: "SAFE" | "WARNING" | "EXCEEDED" = "SAFE";
        const current = currentAmount !== undefined ? parseFloat(currentAmount) : existing.currentAmount;
        const target = targetAmount !== undefined ? parseFloat(targetAmount) : existing.targetAmount;
        const goalType = type || existing.type;

        if (goalType === "SAVING") {
            // Untuk SAVING: semakin tinggi progress = semakin baik
            const progress = (current / target) * 100;
            if (progress >= 100) status = "SAFE";        // Sudah tercapai atau lebih
            else if (progress >= 70) status = "WARNING"; // Hampir tercapai (70-99%)
            else status = "EXCEEDED";                    // Masih jauh dari target (<70%)
        } else if (goalType === "SPENDING_LIMIT") {
            // Untuk SPENDING_LIMIT: semakin rendah progress = semakin baik
            const progress = (current / target) * 100;
            if (progress <= 70) status = "SAFE";         // Pengeluaran masih aman (<70%)
            else if (progress <= 100) status = "WARNING"; // Mendekati batas (71-100%)
            else status = "EXCEEDED";                    // Melebihi batas (>100%)
        }

        const goal = await prisma.goal.update({
            where: { id },
            data: {
                title,
                type,
                targetAmount: targetAmount ? parseFloat(targetAmount) : undefined,
                currentAmount: currentAmount !== undefined ? parseFloat(currentAmount) : undefined,
                period,
                categoryId: categoryId !== undefined ? (categoryId === "" ? null : categoryId) : undefined,
                status,
            },
            include: {
                category: true,
            },
        });

        // Log activity
        await logActivity(
            session.user.id,
            "GOAL",
            "UPDATED",
            `Updated goal: ${title || existing.title}`
        );

        return NextResponse.json(goal);
    } catch (error) {
        console.error("Error updating goal:", error);
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
                { error: "Goal ID required" },
                { status: 400 }
            );
        }

        // Verify ownership
        const existing = await prisma.goal.findFirst({
            where: { id, userId: session.user.id },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Goal not found" },
                { status: 404 }
            );
        }

        await prisma.goal.delete({
            where: { id },
        });

        // Log activity
        await logActivity(
            session.user.id,
            "GOAL",
            "DELETED",
            `Deleted goal: ${existing.title}`
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting goal:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
