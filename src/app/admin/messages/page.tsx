"use client";

import { useState, useEffect } from "react";
import { Search, Mail, Eye, Trash2, Send, Inbox, ArrowRight, Clock, User, MessageSquare, RefreshCw } from "lucide-react";
import { getMessages } from "@/lib/api";
import Modal from "@/components/ui/Modal";
import { motion, AnimatePresence } from "framer-motion";

export default function MessagesPage() {
    const [messages, setMessages] = useState<any[]>([]);
    const [filteredMessages, setFilteredMessages] = useState<any[]>([]);
    const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const markAsRead = async (id: string) => {
        try {
            await fetch(`/api/messages/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ isRead: true })
            });
            // Update local state
            setMessages(prev => prev.map(m => m._id === id ? { ...m, isRead: true } : m));
            setFilteredMessages(prev => prev.map(m => m._id === id ? { ...m, isRead: true } : m));
            // Dispatch custom event to notify Bell
            window.dispatchEvent(new Event('messageRead'));
        } catch (e) { console.error("Failed to mark read", e); }
    };

    const deleteMessage = async (id: string) => {
        if (!confirm("Are you sure you want to delete this message?")) return;
        try {
            await fetch(`/api/messages/${id}`, { method: 'DELETE' });
            setMessages(prev => prev.filter(m => m._id !== id));
            setFilteredMessages(prev => prev.filter(m => m._id !== id));
            // Trigger refresh
            window.dispatchEvent(new Event('messageRead'));
        } catch (e) {
            console.error(e);
            alert("Failed to delete");
        }
    };

    useEffect(() => {
        const fetchMessages = async () => {
            const data = await getMessages();
            setMessages(data);
            setFilteredMessages(data);
        };
        fetchMessages();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            setFilteredMessages(messages.filter(msg =>
                (msg.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (msg.subject || "").toLowerCase().includes(searchTerm.toLowerCase())
            ));
        } else {
            setFilteredMessages(messages);
        }
    }, [searchTerm, messages]);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={container}
            className="space-y-10 pb-20"
        >
            {/* Header Action Bar */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm shadow-slate-200/50">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                        <Inbox size={28} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Message Center</h2>
                        <p className="text-sm text-slate-500 font-medium mt-0.5">{messages.length} Total Inquiries</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    <div className="relative group flex-1 sm:w-80">
                        <input
                            type="text"
                            placeholder="Search messages..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-primary/30 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => window.location.reload()}
                            className="flex items-center justify-center h-12 w-12 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-2xl border border-slate-100 transition-all group"
                            title="Refresh Feed"
                        >
                            <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-700" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm shadow-slate-200/50">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Sender</th>
                                <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Subject</th>
                                <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Received At</th>
                                <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredMessages.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-24 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                                <MessageSquare size={40} className="text-slate-200" />
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Inbox Empty</h3>
                                            <p className="text-slate-500 text-sm font-medium mt-2">No messages found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredMessages.map((msg) => (
                                    <tr
                                        key={msg._id}
                                        className="hover:bg-slate-50/50 transition-all group cursor-pointer"
                                        onClick={() => {
                                            setSelectedMessage(msg);
                                            if (!msg.isRead) markAsRead(msg._id);
                                        }}
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xs shadow-sm shadow-primary/10 transition-transform group-hover:scale-110 ${msg.isRead ? 'bg-slate-100 text-slate-400' : 'bg-primary text-white'}`}>
                                                    {msg.name.slice(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className={`text-sm font-bold tracking-tight ${msg.isRead ? 'text-slate-500' : 'text-slate-900'}`}>{msg.name}</div>
                                                    <div className="text-xs font-medium text-slate-400 mt-0.5">{msg.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className={`text-sm tracking-tight line-clamp-1 ${msg.isRead ? 'text-slate-400 font-medium' : 'text-slate-700 font-black'}`}>{msg.subject}</span>
                                                <span className="text-[10px] text-slate-300 line-clamp-1 italic mt-1 font-medium">{msg.message}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col items-start gap-1">
                                                <span className="text-xs font-bold text-slate-900 tracking-tight">{new Date(msg.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                <span className="text-xs font-medium text-slate-400">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-2 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setSelectedMessage(msg); }}
                                                    className="p-3 bg-white text-slate-500 hover:text-primary hover:bg-slate-50 rounded-2xl shadow-xl transition-all active:scale-90 border border-slate-100"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); deleteMessage(msg._id); }}
                                                    className="p-3 bg-white text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-2xl shadow-xl transition-all active:scale-90 border border-slate-100"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal
                isOpen={!!selectedMessage}
                onClose={() => setSelectedMessage(null)}
                title="Message Details"
            >
                {selectedMessage && (
                    <div className="space-y-8 py-2">
                        <div className="bg-primary p-8 rounded-[2rem] text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <div className="relative z-10">
                                <p className="text-[10px] text-purple-100 uppercase tracking-wider font-bold mb-3">Inquiry Overview</p>
                                <h3 className="text-2xl font-bold text-white tracking-tight mb-4">{selectedMessage.subject}</h3>
                                <div className="flex flex-wrap items-center gap-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
                                            <User size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] text-purple-100 font-bold uppercase tracking-widest">Sender</p>
                                            <p className="font-bold text-sm">{selectedMessage.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
                                            <Clock size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] text-purple-100 font-bold uppercase tracking-widest">Received</p>
                                            <p className="font-bold text-sm">{new Date(selectedMessage.createdAt).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-slate-50 border border-slate-100 rounded-[2rem] relative">
                            <div className="absolute top-6 right-8 text-primary/10">
                                <MessageSquare size={40} />
                            </div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-4">Message Content</p>
                            <div className="text-slate-700 text-sm font-medium leading-relaxed bg-white p-6 rounded-2xl border border-slate-100 shadow-sm whitespace-pre-wrap min-h-[150px]">
                                {selectedMessage.message}
                            </div>
                        </div>

                        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-end gap-3">
                            {selectedMessage.phone && (
                                <button
                                    onClick={() => {
                                        let phone = selectedMessage.phone.replace(/\D/g, '');
                                        if (phone.startsWith('0')) phone = '233' + phone.substring(1);
                                        window.open(`https://wa.me/${phone}?text=Hi ${selectedMessage.name}, regarding your inquiry: ${selectedMessage.subject}`, '_blank');
                                    }}
                                    className="px-8 py-4 bg-[#25D366] text-white rounded-2xl hover:bg-[#128C7E] shadow-xl shadow-[#25D366]/20 transition-all font-black text-[10px] uppercase tracking-widest flex items-center justify-center active:scale-95"
                                >
                                    <Send size={18} className="mr-2" />
                                    WhatsApp
                                </button>
                            )}
                            <button
                                onClick={() => window.location.href = `mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                                className="px-8 py-4 bg-primary text-white rounded-2xl hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all font-bold text-xs flex items-center justify-center active:scale-95"
                            >
                                <Mail size={18} className="mr-2" />
                                Reply via Email
                            </button>
                            <button
                                onClick={() => setSelectedMessage(null)}
                                className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 font-bold text-xs transition-all active:scale-95"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </motion.div>
    );
}
