"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";

type BlockType = "TEXT" | "CHECKLIST" | "TABLE";

interface Block {
    type: BlockType;
    content: any;
}

interface Note {
    id: string;
    title: string;
    tags: string[];
    status: string;
    blocks: Block[];
    createdAt: string;
    updatedAt: string;
}

export default function NotesPage() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingNote, setEditingNote] = useState<Note | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        tags: "",
        blocks: [{ type: "TEXT" as BlockType, content: { text: "" } }],
    });

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const response = await fetch("/api/notes");
            if (response.ok) {
                setNotes(await response.json());
            }
        } catch (error) {
            console.error("Error fetching notes:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            const tags = formData.tags
                .split(",")
                .map((t) => t.trim())
                .filter((t) => t);

            const payload = {
                ...formData,
                tags,
                ...(editingNote && { id: editingNote.id }),
            };

            const response = await fetch("/api/notes", {
                method: editingNote ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                await fetchNotes();
                resetForm();
            } else {
                const data = await response.json();
                setError(data.error || "Gagal menyimpan catatan");
            }
        } catch (error) {
            setError("Terjadi kesalahan. Silakan coba lagi.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus catatan ini?")) return;

        try {
            const response = await fetch(`/api/notes?id=${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                await fetchNotes();
            } else {
                alert("Gagal menghapus catatan");
            }
        } catch (error) {
            alert("Terjadi kesalahan saat menghapus catatan");
        }
    };

    const handleEdit = (note: Note) => {
        setEditingNote(note);
        setFormData({
            title: note.title,
            tags: note.tags.join(", "),
            blocks: note.blocks.length > 0 ? note.blocks : [{ type: "TEXT", content: { text: "" } }],
        });
        setShowForm(true);
    };

    const resetForm = () => {
        setShowForm(false);
        setEditingNote(null);
        setFormData({
            title: "",
            tags: "",
            blocks: [{ type: "TEXT", content: { text: "" } }],
        });
    };

    const addBlock = (type: BlockType) => {
        const newBlock = {
            type,
            content:
                type === "TEXT"
                    ? { text: "" }
                    : type === "CHECKLIST"
                        ? { items: [{ text: "", checked: false }] }
                        : { rows: [[""]] },
        };
        setFormData({ ...formData, blocks: [...formData.blocks, newBlock] });
    };

    const updateBlock = (index: number, content: any) => {
        const newBlocks = [...formData.blocks];
        newBlocks[index].content = content;
        setFormData({ ...formData, blocks: newBlocks });
    };

    const removeBlock = (index: number) => {
        if (formData.blocks.length === 1) return;
        const newBlocks = formData.blocks.filter((_, i) => i !== index);
        setFormData({ ...formData, blocks: newBlocks });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Catatan Pintar
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Buat dan kelola catatan terstruktur Anda
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                    <Plus className="h-5 w-5" />
                    Buat Catatan
                </button>
            </div>

            {/* Note Form */}
            {showForm && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {editingNote ? "Edit Catatan" : "Catatan Baru"}
                        </h2>
                        <button
                            onClick={resetForm}
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

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Judul
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                placeholder="Judul catatan..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Tag (pisahkan dengan koma)
                            </label>
                            <input
                                type="text"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                placeholder="pekerjaan, pribadi, penting..."
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Blok Konten
                                </label>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => addBlock("TEXT")}
                                        className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                                    >
                                        + Teks
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => addBlock("CHECKLIST")}
                                        className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                                    >
                                        + Checklist
                                    </button>
                                </div>
                            </div>

                            {formData.blocks.map((block, index) => (
                                <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                            {block.type === "TEXT" ? "Teks" : "Checklist"}
                                        </span>
                                        {formData.blocks.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeBlock(index)}
                                                className="text-danger-600 hover:text-danger-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>

                                    {block.type === "TEXT" && (
                                        <textarea
                                            value={block.content.text || ""}
                                            onChange={(e) =>
                                                updateBlock(index, { text: e.target.value })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                            rows={3}
                                            placeholder="Tulis teks di sini..."
                                        />
                                    )}

                                    {block.type === "CHECKLIST" && (
                                        <div className="space-y-2">
                                            {block.content.items?.map((item: any, itemIndex: number) => (
                                                <div key={itemIndex} className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={item.checked}
                                                        onChange={(e) => {
                                                            const newItems = [...block.content.items];
                                                            newItems[itemIndex].checked = e.target.checked;
                                                            updateBlock(index, { items: newItems });
                                                        }}
                                                        className="rounded"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={item.text}
                                                        onChange={(e) => {
                                                            const newItems = [...block.content.items];
                                                            newItems[itemIndex].text = e.target.value;
                                                            updateBlock(index, { items: newItems });
                                                        }}
                                                        className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                                        placeholder="Item checklist..."
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newItems = block.content.items.filter(
                                                                (_: any, i: number) => i !== itemIndex
                                                            );
                                                            updateBlock(index, { items: newItems });
                                                        }}
                                                        className="text-danger-600"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newItems = [
                                                        ...block.content.items,
                                                        { text: "", checked: false },
                                                    ];
                                                    updateBlock(index, { items: newItems });
                                                }}
                                                className="text-sm text-primary-600 hover:text-primary-700"
                                            >
                                                + Tambah item
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {submitting ? "Menyimpan..." : "Simpan Catatan"}
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

            {/* Notes List */}
            {loading ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">Memuat...</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {notes.length === 0 ? (
                        <div className="col-span-full bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 border border-gray-200 dark:border-gray-700 text-center">
                            <p className="text-gray-500 dark:text-gray-400">
                                Belum ada catatan. Buat catatan pertama Anda!
                            </p>
                        </div>
                    ) : (
                        notes.map((note) => (
                            <div
                                key={note.id}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                        {note.title}
                                    </h3>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => handleEdit(note)}
                                            className="p-1 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(note.id)}
                                            className="p-1 text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                {note.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {note.tags.map((tag, i) => (
                                            <span
                                                key={i}
                                                className="text-xs px-2 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                    {note.blocks.slice(0, 2).map((block: any, i) => (
                                        <div key={i}>
                                            {block.type === "TEXT" && (
                                                <p className="line-clamp-2">{block.content.text}</p>
                                            )}
                                            {block.type === "CHECKLIST" && (
                                                <div className="space-y-1">
                                                    {block.content.items?.slice(0, 3).map((item: any, j: number) => (
                                                        <div key={j} className="flex items-center gap-2">
                                                            <Check className={`h-3 w-3 ${item.checked ? "text-success-600" : "text-gray-400"}`} />
                                                            <span className={item.checked ? "line-through" : ""}>
                                                                {item.text}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {note.blocks.length > 2 && (
                                        <p className="text-xs text-gray-500">
                                            +{note.blocks.length - 2} blok lainnya
                                        </p>
                                    )}
                                </div>

                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                                    {new Date(note.updatedAt).toLocaleDateString("id-ID", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
