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

        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");

        const where: any = {
            userId: session.user.id,
        };

        if (status) {
            where.status = status;
        }

        const notes = await prisma.note.findMany({
            where,
            include: {
                blocks: {
                    orderBy: {
                        order: "asc",
                    },
                },
            },
            orderBy: {
                updatedAt: "desc",
            },
        });

        return NextResponse.json(notes);
    } catch (error) {
        console.error("Error fetching notes:", error);
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
        const { title, tags, blocks } = body;

        if (!title) {
            return NextResponse.json(
                { error: "Title is required" },
                { status: 400 }
            );
        }

        const note = await prisma.note.create({
            data: {
                title,
                tags: tags || [],
                userId: session.user.id,
                blocks: {
                    create: blocks?.map((block: any, index: number) => ({
                        type: block.type,
                        content: block.content,
                        order: index,
                    })) || [],
                },
            },
            include: {
                blocks: {
                    orderBy: {
                        order: "asc",
                    },
                },
            },
        });

        // Log activity
        await logActivity(
            session.user.id,
            "NOTE",
            "CREATED",
            `Created note: ${title}`
        );

        return NextResponse.json(note, { status: 201 });
    } catch (error) {
        console.error("Error creating note:", error);
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
        const { id, title, tags, status, blocks } = body;

        if (!id) {
            return NextResponse.json(
                { error: "Note ID required" },
                { status: 400 }
            );
        }

        // Verify ownership
        const existing = await prisma.note.findFirst({
            where: { id, userId: session.user.id },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Note not found" },
                { status: 404 }
            );
        }

        // Update note and blocks
        const note = await prisma.note.update({
            where: { id },
            data: {
                title,
                tags,
                status,
            },
            include: {
                blocks: {
                    orderBy: {
                        order: "asc",
                    },
                },
            },
        });

        // Update blocks if provided
        if (blocks) {
            // Delete existing blocks
            await prisma.noteBlock.deleteMany({
                where: { noteId: id },
            });

            // Create new blocks
            await prisma.noteBlock.createMany({
                data: blocks.map((block: any, index: number) => ({
                    noteId: id,
                    type: block.type,
                    content: block.content,
                    order: index,
                })),
            });
        }

        // Log activity
        await logActivity(
            session.user.id,
            "NOTE",
            "UPDATED",
            `Updated note: ${title}`
        );

        return NextResponse.json(note);
    } catch (error) {
        console.error("Error updating note:", error);
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
                { error: "Note ID required" },
                { status: 400 }
            );
        }

        // Verify ownership
        const existing = await prisma.note.findFirst({
            where: { id, userId: session.user.id },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Note not found" },
                { status: 404 }
            );
        }

        await prisma.note.delete({
            where: { id },
        });

        // Log activity
        await logActivity(
            session.user.id,
            "NOTE",
            "DELETED",
            `Deleted note: ${existing.title}`
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting note:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
