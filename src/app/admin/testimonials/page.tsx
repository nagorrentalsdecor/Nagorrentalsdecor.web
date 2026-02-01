"use client";

import { useState, useEffect } from "react";
import { Plus, Trash, Search, Quote, Edit, User, Star, X, Check, Loader2 } from "lucide-react";
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
        if (!confirm("Are you sure you want to delete this transmission?")) return;

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
        <div className="space-y-10">
            {/* Header Action Bar */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm shadow-slate-200/50">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner">
                        <Quote size={28} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Public Resonance</h2>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Verified Client Feedback Registry</p>
                    </div>
                </div>
                <button
                    onClick={() => { setIsAddModalOpen(true); setEditingId(null); setNewTestimonial({ name: "", role: "", content: "" }); }}
                    className="flex items-center px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all active:scale-95"
                >
                    <Plus size={18} className="mr-2" />
                    Archive New Entry
                </button>
            </div>

            {/* Testimonials Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                    {testimonials.map((t, idx) => (
                        <motion.div
                            key={t._id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm shadow-slate-200/50 relative group overflow-hidden"
                        >
                            <div className="absolute -top-4 -right-4 p-8 text-primary/5 group-hover:scale-110 transition-transform duration-700">
                                <Quote size={100} />
                            </div>

                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-lg shadow-xl shadow-slate-200">
                                        {(t.name ? t.name[0] : "?").toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-slate-900 tracking-tight text-lg">{t.name}</h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{t.role || "Client"}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                                    <button
                                        onClick={() => handleEdit(t)}
                                        className="p-3 bg-white text-slate-400 hover:text-primary hover:bg-slate-50 rounded-2xl shadow-xl border border-slate-100 active:scale-90"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(t._id)}
                                        className="p-3 bg-white text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl shadow-xl border border-slate-100 active:scale-90"
                                    >
                                        <Trash size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="flex gap-1 mb-4 text-amber-400">
                                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                            </div>
                            <p className="text-slate-600 text-[13px] font-medium leading-relaxed italic relative z-10">
                                "{t.content}"
                            </p>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Entry Portal Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeModal}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl relative border border-slate-100"
                        >
                            <div className="flex justify-between items-center mb-10 border-b border-slate-50 pb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                        <Quote size={28} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{editingId ? "Refine entry" : "New entry"}</h2>
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Feedback Registry Sys</p>
                                    </div>
                                </div>
                                <button onClick={closeModal} className="p-3 rounded-2xl hover:bg-slate-50 text-slate-300 hover:text-slate-900 transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Source Name</label>
                                        <input
                                            type="text"
                                            value={newTestimonial.name}
                                            onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-primary/30 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all text-sm font-black text-slate-900"
                                            placeholder="Sarah Osei"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Source Role</label>
                                        <input
                                            type="text"
                                            value={newTestimonial.role}
                                            onChange={(e) => setNewTestimonial({ ...newTestimonial, role: e.target.value })}
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-primary/30 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all text-sm font-black text-slate-900"
                                            placeholder="Vercel Executive"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Resonance Payload</label>
                                        <textarea
                                            value={newTestimonial.content}
                                            onChange={(e) => setNewTestimonial({ ...newTestimonial, content: e.target.value })}
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-primary/30 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all text-sm font-black text-slate-900 h-32 resize-none"
                                            placeholder="Write the public feedback here..."
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={handleSaveTestimonial}
                                    disabled={isLoading}
                                    className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all active:scale-95 flex items-center justify-center"
                                >
                                    {isLoading ? <Loader2 className="animate-spin mr-2" size={16} /> : <Check className="mr-2" size={16} />}
                                    {isLoading ? "Synchronizing..." : (editingId ? "Update Entry" : "Commit Entry")}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
