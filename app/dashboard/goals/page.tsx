"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Target, TrendingUp } from "lucide-react";

interface Goal {
    id: string;
    title: string;
    type: string;
    targetAmount: number;
    currentAmount: number;
    period: string;
    status: string;
    category?: { name: string };
    createdAt: string;
}

export default function GoalsPage() {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        type: "SAVING",
        targetAmount: "",
        currentAmount: "0",
        period: "MONTHLY",
        categoryId: "",
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [goalsRes, catRes] = await Promise.all([
                fetch("/api/goals"),
                fetch("/api/categories"),
            ]);

            if (goalsRes.ok) setGoals(await goalsRes.json());
            if (catRes.ok) setCategories(await catRes.json());
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            const payload = {
                ...formData,
                ...(editingGoal && { id: editingGoal.id }),
            };

            const response = await fetch("/api/goals", {
                method: editingGoal ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                await fetchData();
                resetForm();
            } else {
                const data = await response.json();
                setError(data.error || "Gagal menyimpan target");
            }
        } catch (error) {
            setError("Terjadi kesalahan. Silakan coba lagi.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus target ini?")) return;

        try {
            const response = await fetch(`/api/goals?id=${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                await fetchData();
            } else {
                alert("Gagal menghapus target");
            }
        } catch (error) {
            alert("Terjadi kesalahan saat menghapus target");
        }
    };

    const handleEdit = (goal: Goal) => {
        setEditingGoal(goal);
        setFormData({
            title: goal.title,
            type: goal.type,
            targetAmount: goal.targetAmount.toString(),
            currentAmount: goal.currentAmount.toString(),
            period: goal.period,
            categoryId: "", // Reset categoryId saat edit, karena Goals tidak wajib punya kategori
        });
        setShowForm(true);
    };

    const resetForm = () => {
        setShowForm(false);
        setEditingGoal(null);
        setFormData({
            title: "",
            type: "SAVING",
            targetAmount: "",
            currentAmount: "0",
            period: "MONTHLY",
            categoryId: "",
        });
    };

    const getProgress = (goal: Goal) => {
        return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "SAFE":
                return "text-success-600 bg-success-50 dark:bg-success-900/20";
            case "WARNING":
                return "text-warning-600 bg-warning-50 dark:bg-warning-900/20";
            case "EXCEEDED":
                return "text-danger-600 bg-danger-50 dark:bg-danger-900/20";
            default:
                return "text-gray-600 bg-gray-50 dark:bg-gray-900/20";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "SAFE":
                return "Aman";
            case "WARNING":
                return "Peringatan";
            case "EXCEEDED":
                return "Belum tercapai";
            default:
                return status;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Target & Tujuan
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Lacak target keuangan dan batas pengeluaran Anda
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                    <Plus className="h-5 w-5" />
                    Tambah Target
                </button>
            </div>

            {/* Goal Form */}
            {showForm && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {editingGoal ? "Edit Target" : "Target Baru"}
                        </h2>
                        <button
                            onClick={resetForm}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            ×
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-danger-50 border border-danger-500 text-danger-600 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Judul Target
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                placeholder="Misal: Tabungan Liburan"
                                required
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Tipe Target
                                </label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                    required
                                >
                                    <option value="SAVING">Tabungan</option>
                                    <option value="SPENDING_LIMIT">Batas Pengeluaran</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Periode
                                </label>
                                <select
                                    value={formData.period}
                                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                    required
                                >
                                    <option value="MONTHLY">Bulanan</option>
                                    <option value="YEARLY">Tahunan</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Target Jumlah (Rp)
                                </label>
                                <input
                                    type="number"
                                    value={formData.targetAmount}
                                    onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="0"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Jumlah Saat Ini (Rp)
                                </label>
                                <input
                                    type="number"
                                    value={formData.currentAmount}
                                    onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="0"
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {submitting ? "Menyimpan..." : "Simpan Target"}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                Batal
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Goals List */}
            {loading ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">Memuat...</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {goals.length === 0 ? (
                        <div className="col-span-full bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 border border-gray-200 dark:border-gray-700 text-center">
                            <p className="text-gray-500 dark:text-gray-400">
                                Belum ada target. Buat target pertama Anda!
                            </p>
                        </div>
                    ) : (
                        goals.map((goal) => (
                            <div
                                key={goal.id}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Target className="h-5 w-5 text-primary-600" />
                                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                                {goal.title}
                                            </h3>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {goal.type === "SAVING" ? "Tabungan" : "Batas Pengeluaran"} •{" "}
                                            {goal.period === "MONTHLY" ? "Bulanan" : "Tahunan"}
                                        </p>
                                    </div>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => handleEdit(goal)}
                                            className="p-1 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(goal.id)}
                                            className="p-1 text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Progress</span>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(goal.status)}`}>
                                            {getStatusText(goal.status)}
                                        </span>
                                    </div>

                                    <div className="relative w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className={`absolute top-0 left-0 h-full transition-all ${goal.status === "SAFE"
                                                ? "bg-success-600"
                                                : goal.status === "WARNING"
                                                    ? "bg-warning-600"
                                                    : "bg-danger-600"
                                                }`}
                                            style={{ width: `${getProgress(goal)}%` }}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Saat Ini</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {new Intl.NumberFormat("id-ID", {
                                                    style: "currency",
                                                    currency: "IDR",
                                                    minimumFractionDigits: 0,
                                                }).format(goal.currentAmount)}
                                            </p>
                                        </div>
                                        <TrendingUp className="h-5 w-5 text-gray-400" />
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Target</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {new Intl.NumberFormat("id-ID", {
                                                    style: "currency",
                                                    currency: "IDR",
                                                    minimumFractionDigits: 0,
                                                }).format(goal.targetAmount)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-primary-600">
                                            {getProgress(goal).toFixed(1)}%
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
