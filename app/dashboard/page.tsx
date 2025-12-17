"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Wallet, TrendingUp, TrendingDown, Activity, FileText, Target, Bell } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
    const { data: session } = useSession();
    const [stats, setStats] = useState({
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
        transactionCount: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch("/api/transactions");
            if (response.ok) {
                const transactions = await response.json();

                const income = transactions
                    .filter((t: any) => t.type === "INCOME")
                    .reduce((sum: number, t: any) => sum + t.amount, 0);

                const expense = transactions
                    .filter((t: any) => t.type === "EXPENSE")
                    .reduce((sum: number, t: any) => sum + t.amount, 0);

                setStats({
                    totalIncome: income,
                    totalExpense: expense,
                    balance: income - expense,
                    transactionCount: transactions.length,
                });
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Selamat datang kembali, {session?.user?.name}!
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Berikut ringkasan kehidupan pribadi Anda
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Total Saldo
                            </p>
                            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                                {loading ? "..." : formatCurrency(stats.balance)}
                            </p>
                        </div>
                        <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                            <Wallet className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Total Pemasukan
                            </p>
                            <p className="mt-2 text-2xl font-bold text-success-600 dark:text-success-400">
                                {loading ? "..." : formatCurrency(stats.totalIncome)}
                            </p>
                        </div>
                        <div className="p-3 bg-success-50 dark:bg-success-900/20 rounded-lg">
                            <TrendingUp className="h-6 w-6 text-success-600 dark:text-success-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Total Pengeluaran
                            </p>
                            <p className="mt-2 text-2xl font-bold text-danger-600 dark:text-danger-400">
                                {loading ? "..." : formatCurrency(stats.totalExpense)}
                            </p>
                        </div>
                        <div className="p-3 bg-danger-50 dark:bg-danger-900/20 rounded-lg">
                            <TrendingDown className="h-6 w-6 text-danger-600 dark:text-danger-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Transactions
                            </p>
                            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                                {loading ? "..." : stats.transactionCount}
                            </p>
                        </div>
                        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <Activity className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Aksi Cepat
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <a
                        href="/dashboard/finance"
                        className="flex items-center gap-3 p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-colors"
                    >
                        <Wallet className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                        <span className="font-medium text-gray-900 dark:text-white">
                            Tambah Transaksi
                        </span>
                    </a>
                    <a
                        href="/dashboard/notes"
                        className="flex items-center gap-3 p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-colors"
                    >
                        <FileText className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                        <span className="font-medium text-gray-900 dark:text-white">
                            Buat Catatan
                        </span>
                    </a>
                    <a
                        href="/dashboard/goals"
                        className="flex items-center gap-3 p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-colors"
                    >
                        <Target className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                        <span className="font-medium text-gray-900 dark:text-white">
                            Buat Target
                        </span>
                    </a>
                    <a
                        href="/dashboard/reminders"
                        className="flex items-center gap-3 p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-colors"
                    >
                        <Bell className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                        <span className="font-medium text-gray-900 dark:text-white">
                            Tambah Pengingat
                        </span>
                    </a>
                </div>
            </div>

            {/* Coming Soon Sections */}
            <div className="grid gap-6 lg:grid-cols-2">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Aktivitas Terbaru
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                        Timeline aktivitas akan muncul di sini
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Pengingat Aktif
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                        Pengingat Anda akan muncul di sini
                    </p>
                </div>
            </div>
        </div>
    );
}
