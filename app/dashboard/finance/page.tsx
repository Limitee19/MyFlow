"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, X } from "lucide-react";

export default function FinancePage() {
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    // Form state
    const [formData, setFormData] = useState({
        amount: "",
        type: "EXPENSE",
        categoryId: "",
        date: new Date().toISOString().split('T')[0],
        description: "",
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [transRes, catRes] = await Promise.all([
                fetch("/api/transactions"),
                fetch("/api/categories"),
            ]);

            if (transRes.ok) setTransactions(await transRes.json());
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
            const response = await fetch("/api/transactions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                await fetchData();
                setShowForm(false);
                setFormData({
                    amount: "",
                    type: "EXPENSE",
                    categoryId: "",
                    date: new Date().toISOString().split('T')[0],
                    description: "",
                });
            } else {
                const data = await response.json();
                setError(data.error || "Gagal menambahkan transaksi");
            }
        } catch (error) {
            setError("Terjadi kesalahan. Silakan coba lagi.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) return;

        try {
            const response = await fetch(`/api/transactions?id=${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                await fetchData();
            } else {
                alert("Gagal menghapus transaksi");
            }
        } catch (error) {
            alert("Terjadi kesalahan saat menghapus transaksi");
        }
    };

    const filteredCategories = categories.filter(
        (cat: any) => cat.type === formData.type
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Pelacak Keuangan
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Kelola pemasukan dan pengeluaran Anda
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                    <Plus className="h-5 w-5" />
                    Tambah Transaksi
                </button>
            </div>

            {/* Transaction Form */}
            {showForm && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Transaksi Baru
                        </h2>
                        <button
                            onClick={() => setShowForm(false)}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-danger-50 border border-danger-500 text-danger-600 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Tipe Transaksi
                                </label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value, categoryId: "" })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                    required
                                >
                                    <option value="EXPENSE">Pengeluaran</option>
                                    <option value="INCOME">Pemasukan</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Kategori
                                </label>
                                <select
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                    required
                                >
                                    <option value="">Pilih Kategori</option>
                                    {filteredCategories.map((cat: any) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Jumlah (Rp)
                                </label>
                                <input
                                    type="number"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="0"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Tanggal
                                </label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Deskripsi (Opsional)
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                rows={3}
                                placeholder="Catatan tambahan..."
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {submitting ? "Menyimpan..." : "Simpan Transaksi"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                Batal
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Transactions List */}
            {loading ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">Memuat...</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Transaksi Terbaru
                    </h2>
                    {transactions.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                            Belum ada transaksi. Tambahkan transaksi pertama Anda untuk memulai!
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {transactions.map((transaction: any) => (
                                <div
                                    key={transaction.id}
                                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                >
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {transaction.category.name}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(transaction.date).toLocaleDateString("id-ID", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric"
                                            })}
                                        </p>
                                        {transaction.description && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                {transaction.description}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <p
                                            className={`font-semibold text-lg ${transaction.type === "INCOME"
                                                ? "text-success-600"
                                                : "text-danger-600"
                                                }`}
                                        >
                                            {transaction.type === "INCOME" ? "+" : "-"}
                                            {new Intl.NumberFormat("id-ID", {
                                                style: "currency",
                                                currency: "IDR",
                                                minimumFractionDigits: 0,
                                            }).format(transaction.amount)}
                                        </p>
                                        <button
                                            onClick={() => handleDelete(transaction.id)}
                                            className="p-2 text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-lg transition-colors"
                                            title="Hapus transaksi"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
