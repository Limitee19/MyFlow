import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, name } = body;

        if (!email || !password || !name) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });

        // Create default categories for the user
        const defaultCategories = [
            // Income categories
            { name: "Salary", type: "INCOME", icon: "💼", color: "#10b981" },
            { name: "Freelance", type: "INCOME", icon: "💻", color: "#3b82f6" },
            { name: "Investment", type: "INCOME", icon: "📈", color: "#8b5cf6" },
            { name: "Other Income", type: "INCOME", icon: "💰", color: "#06b6d4" },

            // Expense categories
            { name: "Food", type: "EXPENSE", icon: "🍔", color: "#ef4444" },
            { name: "Transportation", type: "EXPENSE", icon: "🚗", color: "#f59e0b" },
            { name: "Shopping", type: "EXPENSE", icon: "🛍️", color: "#ec4899" },
            { name: "Entertainment", type: "EXPENSE", icon: "🎮", color: "#a855f7" },
            { name: "Bills", type: "EXPENSE", icon: "📄", color: "#6366f1" },
            { name: "Health", type: "EXPENSE", icon: "🏥", color: "#14b8a6" },
            { name: "Education", type: "EXPENSE", icon: "📚", color: "#0ea5e9" },
            { name: "Other Expense", type: "EXPENSE", icon: "💸", color: "#64748b" },
        ];

        await prisma.category.createMany({
            data: defaultCategories.map((cat) => ({
                ...cat,
                userId: user.id,
            })),
        });

        return NextResponse.json(
            {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
