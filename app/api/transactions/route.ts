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
        const type = searchParams.get("type");
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");

        const where: any = {
            userId: session.user.id,
        };

        if (type) {
            where.type = type;
        }

        if (startDate && endDate) {
            where.date = {
                gte: new Date(startDate),
                lte: new Date(endDate),
            };
        }

        const transactions = await prisma.transaction.findMany({
            where,
            include: {
                category: true,
            },
            orderBy: {
                date: "desc",
            },
        });

        return NextResponse.json(transactions);
    } catch (error) {
        console.error("Error fetching transactions:", error);
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
        const { amount, type, categoryId, date, description } = body;

        if (!amount || !type || !categoryId || !date) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const transaction = await prisma.transaction.create({
            data: {
                amount: parseFloat(amount),
                type,
                categoryId,
                date: new Date(date),
                description,
                userId: session.user.id,
            },
            include: {
                category: true,
            },
        });

        // Log activity
        await logActivity(
            session.user.id,
            "TRANSACTION",
            "CREATED",
            `Added ${type.toLowerCase()}: ${transaction.category.name} - ${amount}`
        );

        return NextResponse.json(transaction, { status: 201 });
    } catch (error) {
        console.error("Error creating transaction:", error);
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
        const { id, amount, type, categoryId, date, description } = body;

        if (!id) {
            return NextResponse.json(
                { error: "Transaction ID required" },
                { status: 400 }
            );
        }

        // Verify ownership
        const existing = await prisma.transaction.findFirst({
            where: { id, userId: session.user.id },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Transaction not found" },
                { status: 404 }
            );
        }

        const transaction = await prisma.transaction.update({
            where: { id },
            data: {
                amount: amount ? parseFloat(amount) : undefined,
                type,
                categoryId,
                date: date ? new Date(date) : undefined,
                description,
            },
            include: {
                category: true,
            },
        });

        // Log activity
        await logActivity(
            session.user.id,
            "TRANSACTION",
            "UPDATED",
            `Updated ${type.toLowerCase()}: ${transaction.category.name}`
        );

        return NextResponse.json(transaction);
    } catch (error) {
        console.error("Error updating transaction:", error);
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
                { error: "Transaction ID required" },
                { status: 400 }
            );
        }

        // Verify ownership
        const existing = await prisma.transaction.findFirst({
            where: { id, userId: session.user.id },
            include: { category: true },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Transaction not found" },
                { status: 404 }
            );
        }

        await prisma.transaction.delete({
            where: { id },
        });

        // Log activity
        await logActivity(
            session.user.id,
            "TRANSACTION",
            "DELETED",
            `Deleted ${existing.type.toLowerCase()}: ${existing.category.name}`
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting transaction:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
