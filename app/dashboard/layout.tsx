"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Wallet,
    FileText,
    Target,
    Bell,
    LogOut,
    Menu,
    X,
} from "lucide-react";
import { useState } from "react";

const navigation = [
    { name: "Beranda", href: "/dashboard", icon: LayoutDashboard },
    { name: "Keuangan", href: "/dashboard/finance", icon: Wallet },
    { name: "Catatan", href: "/dashboard/notes", icon: FileText },
    { name: "Target", href: "/dashboard/goals", icon: Target },
    { name: "Pengingat", href: "/dashboard/reminders", icon: Bell },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Mobile sidebar */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="fixed inset-0 bg-gray-600 bg-opacity-75"
                        onClick={() => setSidebarOpen(false)}
                    />
                    <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white dark:bg-gray-800">
                        <div className="flex h-16 items-center justify-between px-6">
                            <h1 className="text-2xl font-bold text-primary-600">MyFlow</h1>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <nav className="flex-1 space-y-1 px-4 py-4">
                            {navigation.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${isActive
                                            ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
                                            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                            }`}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>
                        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                            <div className="mb-4">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {session?.user?.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {session?.user?.email}
                                </p>
                            </div>
                            <button
                                onClick={() => signOut({ callbackUrl: "/login" })}
                                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                <LogOut className="h-5 w-5" />
                                Keluar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Desktop sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                <div className="flex flex-col flex-1 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
                    <div className="flex h-16 items-center px-6">
                        <h1 className="text-2xl font-bold text-primary-600">MyFlow</h1>
                    </div>
                    <nav className="flex-1 space-y-1 px-4 py-4">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${isActive
                                        ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
                                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                        }`}
                                >
                                    <item.icon className="h-5 w-5" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                    <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                        <div className="mb-4">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {session?.user?.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {session?.user?.email}
                            </p>
                        </div>
                        <button
                            onClick={() => signOut({ callbackUrl: "/login" })}
                            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            <LogOut className="h-5 w-5" />
                            Keluar
                        </button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-64">
                <div className="sticky top-0 z-10 flex h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 lg:hidden">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="px-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                    <div className="flex flex-1 items-center justify-center">
                        <h1 className="text-xl font-bold text-primary-600">MyFlow</h1>
                    </div>
                    <div className="w-16" />
                </div>
                <main className="p-4 lg:p-8">{children}</main>
            </div>
        </div>
    );
}
