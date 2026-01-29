"use client";

import { useState, useEffect } from "react";
import { Plus, Trash, Search, Quote, Edit } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TestimonialsAdmin() {
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newTestimonial, setNewTestimonial] = useState({ name: "", role: "", content: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const res = await fetch("/api/testimonials");
            const data = await res.json();
            setTestimonials(data || []);
        } catch (error) {
            console.error("Failed to fetch testimonials", error);
        }
    };

    const handleSaveTestimonial = async () => {
        if (!newTestimonial.name || !newTestimonial.content) return;
        setIsLoading(true);

        try {
            const url = editingId ? `/api/testimonials/${editingId}` : "/api/testimonials";
            const method = editingId ? "PUT" : "POST";

            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newTestimonial)
            });

            if (res.ok) {
                closeModal();
                fetchTestimonials();
            }
        } catch (error) {
            console.error("Failed to save testimonial", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (testimonial: any) => {
        setNewTestimonial({
            name: testimonial.name,
            role: testimonial.role,
            content: testimonial.content
        });
        setEditingId(testimonial._id);
        setIsAddModalOpen(true);
    };

    const closeModal = () => {
        setIsAddModalOpen(false);
        setNewTestimonial({ name: "", role: "", content: "" });
        setEditingId(null);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this testimonial?")) return;

        try {
            const res = await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
            if (res.ok) {
                fetchTestimonials();
            }
        } catch (error) {
            console.error("Failed to delete testimonial", error);
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Testimonials</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage client reviews and feedback.</p>
                </div>
                <button
                    onClick={() => { setIsAddModalOpen(true); setEditingId(null); setNewTestimonial({ name: "", role: "", content: "" }); }}
                    className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95"
                >
                    <Plus size={18} />
                    <span>Add Review</span>
                </button>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((t) => (
                    <motion.div
                        key={t._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                    {(t.initial || (t.name ? t.name[0] : "?"))}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800">{t.name}</h3>
                                    <p className="text-xs text-gray-500 uppercase">{t.role}</p>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => handleEdit(t)}
                                    className="text-gray-300 hover:text-blue-500 transition-colors p-2"
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(t._id)}
                                    className="text-gray-300 hover:text-red-500 transition-colors p-2"
                                >
                                    <Trash size={16} />
                                </button>
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm italic leading-relaxed">"{t.content}"</p>
                    </motion.div>
                ))}
            </div>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <h3 className="font-bold text-lg text-gray-800">{editingId ? "Edit Testimonial" : "Add New Testimonial"}</h3>
                                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                    <Plus size={24} className="rotate-45" />
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                                    <input
                                        type="text"
                                        value={newTestimonial.name}
                                        onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        placeholder="e.g. Sarah Osei"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Role / Event Type</label>
                                    <input
                                        type="text"
                                        value={newTestimonial.role}
                                        onChange={(e) => setNewTestimonial({ ...newTestimonial, role: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        placeholder="e.g. Bride"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Review Content</label>
                                    <textarea
                                        value={newTestimonial.content}
                                        onChange={(e) => setNewTestimonial({ ...newTestimonial, content: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all h-32 resize-none"
                                        placeholder="Write the testimonial here..."
                                    />
                                </div>
                            </div>
                            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
                                <button
                                    onClick={closeModal}
                                    className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveTestimonial}
                                    disabled={isLoading}
                                    className="px-6 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                                >
                                    {isLoading ? "Saving..." : (editingId ? "Update Review" : "Save Review")}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
