"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";

/* ================= TYPES ================= */

type BlockType = "TEXT" | "CHECKLIST" | "TABLE";

type TextBlock = {
    type: "TEXT";
    content: { text: string };
};

type ChecklistBlock = {
    type: "CHECKLIST";
    content: { items: { text: string; checked: boolean }[] };
};

type TableBlock = {
    type: "TABLE";
    content: { rows: string[][] };
};

type Block = TextBlock | ChecklistBlock | TableBlock;

interface Note {
    id: string;
    title: string;
    tags: string[];
    status: string;
    blocks: Block[];
    createdAt: string;
    updatedAt: string;
}

interface NoteFormData {
    title: string;
    tags: string;
    blocks: Block[];
}

/* ================= COMPONENT ================= */

export default function NotesPage() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingNote, setEditingNote] = useState<Note | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState<NoteFormData>({
        title: "",
        tags: "",
        blocks: [{ type: "TEXT", content: { text: "" } }],
    });

    /* ================= EFFECT ================= */

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const res = await fetch("/api/notes");
            if (res.ok) setNotes(await res.json());
        } finally {
            setLoading(false);
        }
    };

    /* ================= FORM ================= */

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");

        try {
            const payload = {
                ...formData,
                tags: formData.tags
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
                ...(editingNote && { id: editingNote.id }),
            };

            const res = await fetch("/api/notes", {
                method: editingNote ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Gagal menyimpan");
            await fetchNotes();
            resetForm();
        } catch {
            setError("Terjadi kesalahan");
        } finally {
            setSubmitting(false);
        }
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

    /* ================= BLOCKS ================= */

    const addBlock = (type: BlockType) => {
        const newBlock: Block =
            type === "TEXT"
                ? { type: "TEXT", content: { text: "" } }
                : type === "CHECKLIST"
                ? {
                      type: "CHECKLIST",
                      content: { items: [{ text: "", checked: false }] },
                  }
                : { type: "TABLE", content: { rows: [[""]] } };

        setFormData((prev) => ({
            ...prev,
            blocks: [...prev.blocks, newBlock],
        }));
    };

    const updateBlock = (index: number, block: Block) => {
        setFormData((prev) => {
            const blocks = [...prev.blocks];
            blocks[index] = block;
            return { ...prev, blocks };
        });
    };

    const removeBlock = (index: number) => {
        if (formData.blocks.length === 1) return;
        setFormData((prev) => ({
            ...prev,
            blocks: prev.blocks.filter((_, i) => i !== index),
        }));
    };

    /* ================= UI ================= */

    return (
        <div className="space-y-6">
            {/* UI kamu TIDAK aku ubah */}
        </div>
    );
}
