"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Bell, Clock, AlertCircle, CheckCircle, XCircle } from "lucide-react";

interface Reminder {
    id: string;
    title: string;
    description?: string;
    dueDate: string;
    status: string;
    priority: string;
    createdAt: string;
}

export default function RemindersPage() {
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("all");

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        dueDate: new Date().toISOString().split('T')[0],
        priority: "MEDIUM",
    });

    useEffect(() => {
        fetchReminders();
    }, []);

    const fetchReminders = async () => {
        try {
            const response = await fetch("/api/reminders");
            if (response.ok) {
                setReminders(await response.json());
            }
        } catch (error) {
            console.error("Error fetching reminders:", error);
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
                ...(editingReminder && { id: editingReminder.id }),
            };

            const response = await fetch("/api/reminders", {
                method: editingReminder ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                await fetchReminders();
                resetForm();
            } else {
                const data = await response.json();
                setError(data.error || "Gagal menyimpan pengingat");
            }
        } catch (error) {
            setError("Terjadi kesalahan. Silakan coba lagi.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus pengingat ini?")) return;

        try {
            const response = await fetch(`/api/reminders?id=${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                await fetchReminders();
            } else {
                alert("Gagal menghapus pengingat");
            }
        } catch (error) {
            alert("Terjadi kesalahan saat menghapus pengingat");
        }
    };

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            const response = await fetch("/api/reminders", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status: newStatus }),
            });

            if (response.ok) {
                await fetchReminders();
            }
        } catch (error) {
            alert("Gagal mengubah status");
        }
    };

    const handleEdit = (reminder: Reminder) => {
        setEditingReminder(reminder);
        setFormData({
            title: reminder.title,
            description: reminder.description || "",
            dueDate: new Date(reminder.dueDate).toISOString().split('T')[0],
            priority: reminder.priority,
        });
        setShowForm(true);
    };

    const resetForm = () => {
        setShowForm(false);
        setEditingReminder(null);
        setFormData({
            title: "",
            description: "",
            dueDate: new Date().toISOString().split('T')[0],
            priority: "MEDIUM",
        });
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "HIGH":
                return "text-danger-600 bg-danger-50 dark:bg-danger-900/20";
            case "MEDIUM":
                return "text-warning-600 bg-warning-50 dark:bg-warning-900/20";
            case "LOW":
                return "text-gray-600 bg-gray-50 dark:bg-gray-900/20";
            default:
                return "text-gray-600 bg-gray-50 dark:bg-gray-900/20";
        }
    };

    const getPriorityText = (priority: string) => {
        switch (priority) {
            case "HIGH":
                return "Tinggi";
            case "MEDIUM":
                return "Sedang";
            case "LOW":
                return "Rendah";
            default:
                return priority;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "COMPLETED":
                return <CheckCircle className="h-5 w-5 text-success-600" />;
            case "DISMISSED":
                return <XCircle className="h-5 w-5 text-gray-600" />;
            default:
                return <Clock className="h-5 w-5 text-warning-600" />;
        }
    };

    const isOverdue = (dueDate: string) => {
        return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
    };

    const filteredReminders = reminders.filter((reminder) => {
        if (filterStatus === "all") return true;
        return reminder.status === filterStatus;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Pengingat
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Kelola pengingat dan notifikasi Anda
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                    <Plus className="h-5 w-5" />
                    Tambah Pengingat
                </button>
            </div>

            {/* Filter */}
            <div className="flex gap-2">
                <button
                    onClick={() => setFilterStatus("all")}
                    className={`px-4 py-2 rounded-lg transition-colors ${filterStatus === "all"
                            ? "bg-primary-600 text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                >
                    Semua
                </button>
                <button
                    onClick={() => setFilterStatus("PENDING")}
                    className={`px-4 py-2 rounded-lg transition-colors ${filterStatus === "PENDING"
                            ? "bg-primary-600 text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                >
                    Tertunda
                </button>
                <button
                    onClick={() => setFilterStatus("COMPLETED")}
                    className={`px-4 py-2 rounded-lg transition-colors ${filterStatus === "COMPLETED"
                            ? "bg-primary-600 text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                >
                    Selesai
                </button>
                <button
                    onClick={() => setFilterStatus("DISMISSED")}
                    className={`px-4 py-2 rounded-lg transition-colors ${filterStatus === "DISMISSED"
                            ? "bg-primary-600 text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                >
                    Diabaikan
                </button>
            </div>

            {/* Reminder Form */}
            {showForm && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {editingReminder ? "Edit Pengingat" : "Pengingat Baru"}
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
                                Judul
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                placeholder="Judul pengingat..."
                                required
                            />
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
                                placeholder="Detail tambahan..."
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Tanggal Jatuh Tempo
                                </label>
                                <input
                                    type="date"
                                    value={formData.dueDate}
                                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Prioritas
                                </label>
                                <select
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                    required
                                >
                                    <option value="LOW">Rendah</option>
                                    <option value="MEDIUM">Sedang</option>
                                    <option value="HIGH">Tinggi</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {submitting ? "Menyimpan..." : "Simpan Pengingat"}
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

            {/* Reminders List */}
            {loading ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">Memuat...</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredReminders.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 border border-gray-200 dark:border-gray-700 text-center">
                            <p className="text-gray-500 dark:text-gray-400">
                                {filterStatus === "all"
                                    ? "Belum ada pengingat. Buat pengingat pertama Anda!"
                                    : "Tidak ada pengingat dengan status ini."}
                            </p>
                        </div>
                    ) : (
                        filteredReminders.map((reminder) => (
                            <div
                                key={reminder.id}
                                className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border-l-4 ${isOverdue(reminder.dueDate) && reminder.status === "PENDING"
                                        ? "border-danger-600"
                                        : reminder.status === "COMPLETED"
                                            ? "border-success-600"
                                            : "border-gray-200 dark:border-gray-700"
                                    } hover:shadow-md transition-shadow`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            {getStatusIcon(reminder.status)}
                                            <h3 className={`font-semibold ${reminder.status === "COMPLETED"
                                                    ? "line-through text-gray-500"
                                                    : "text-gray-900 dark:text-white"
                                                }`}>
                                                {reminder.title}
                                            </h3>
                                        </div>

                                        {reminder.description && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                {reminder.description}
                                            </p>
                                        )}

                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-4 w-4 text-gray-400" />
                                                <span className={`${isOverdue(reminder.dueDate) && reminder.status === "PENDING"
                                                        ? "text-danger-600 font-medium"
                                                        : "text-gray-600 dark:text-gray-400"
                                                    }`}>
                                                    {new Date(reminder.dueDate).toLocaleDateString("id-ID", {
                                                        day: "numeric",
                                                        month: "long",
                                                        year: "numeric",
                                                    })}
                                                    {isOverdue(reminder.dueDate) && reminder.status === "PENDING" && " (Terlambat)"}
                                                </span>
                                            </div>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(reminder.priority)}`}>
                                                {getPriorityText(reminder.priority)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex gap-1 ml-4">
                                        {reminder.status === "PENDING" && (
                                            <>
                                                <button
                                                    onClick={() => handleStatusChange(reminder.id, "COMPLETED")}
                                                    className="p-2 text-success-600 hover:bg-success-50 dark:hover:bg-success-900/20 rounded"
                                                    title="Tandai selesai"
                                                >
                                                    <CheckCircle className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(reminder.id, "DISMISSED")}
                                                    className="p-2 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
                                                    title="Abaikan"
                                                >
                                                    <XCircle className="h-4 w-4" />
                                                </button>
                                            </>
                                        )}
                                        <button
                                            onClick={() => handleEdit(reminder)}
                                            className="p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(reminder.id)}
                                            className="p-2 text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
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
