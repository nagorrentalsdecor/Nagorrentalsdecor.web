"use client";

import { useState, useEffect } from "react";
import { Search, Mail, Eye, Trash2, Send } from "lucide-react";
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
            await fetch(`/api/messages/${id}`, { method: 'PUT' });
            // Update local state
            setMessages(prev => prev.map(m => m._id === id ? { ...m, isRead: true } : m));
            // Dispatch custom event to notify Bell (optional, but good for UI sync)
            window.dispatchEvent(new Event('messageRead'));
        } catch (e) { console.error("Failed to mark read", e); }
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
                msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                msg.subject.toLowerCase().includes(searchTerm.toLowerCase())
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

    const item = {
        hidden: { opacity: 0, x: -10 },
        show: { opacity: 1, x: 0 }
    };

    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={container}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Messages</h1>
                    <p className="text-sm text-gray-500 mt-1">Inbox & Inquiries.</p>
                </div>

                <div className="relative w-full md:w-80 group">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-gray-200 focus:outline-none focus:ring-0 transition-all text-sm"
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-gray-600 transition-colors" size={16} />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Sender</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Subject</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredMessages.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400 font-medium">
                                        No messages found.
                                    </td>
                                </tr>
                            ) : (
                                filteredMessages.map((msg) => (
                                    <tr
                                        key={msg._id}
                                        className="hover:bg-blue-50/30 transition-colors group cursor-pointer"
                                        onClick={() => {
                                            setSelectedMessage(msg);
                                            if (!msg.isRead) markAsRead(msg._id);
                                        }}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-xs mr-3">
                                                    {msg.name.slice(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900 text-sm">{msg.name}</div>
                                                    <div className="text-xs text-gray-400">{msg.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-700 font-medium text-sm line-clamp-1">{msg.subject}</span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-xs font-mono">
                                            {new Date(msg.createdAt).toLocaleDateString()} &middot; {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setSelectedMessage(msg); }}
                                                className="text-primary hover:text-primary-hover p-2 rounded-full hover:bg-primary/5 transition-colors"
                                                title="Read Message"
                                            >
                                                <Eye size={18} />
                                            </button>
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
                    <div className="space-y-6">
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{selectedMessage.subject}</h3>
                                    <p className="text-sm text-gray-500">From: <span className="font-semibold text-gray-800">{selectedMessage.name}</span> &lt;{selectedMessage.email}&gt;</p>
                                </div>
                                <div className="text-xs text-right text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                                    {new Date(selectedMessage.createdAt).toLocaleDateString()} <br />
                                    {new Date(selectedMessage.createdAt).toLocaleTimeString()}
                                </div>
                            </div>
                            <div className="bg-white p-5 rounded-lg border border-gray-100 text-gray-700 whitespace-pre-wrap leading-relaxed shadow-sm min-h-[150px]">
                                {selectedMessage.message}
                            </div>
                        </div>

                        <div className="flex justify-end pt-2 border-t border-gray-100 gap-3">
                            {selectedMessage.phone && (
                                <button
                                    onClick={() => {
                                        let phone = selectedMessage.phone.replace(/\D/g, '');
                                        if (phone.startsWith('0')) phone = '233' + phone.substring(1);
                                        window.open(`https://wa.me/${phone}?text=Hi ${selectedMessage.name}, regarding your inquiry: ${selectedMessage.subject}`, '_blank');
                                    }}
                                    className="flex items-center px-6 py-3 bg-[#25D366] text-white rounded-xl hover:bg-[#128C7E] shadow-lg shadow-[#25D366]/20 transition-all font-bold"
                                >
                                    <Send size={16} className="mr-2" />
                                    WhatsApp
                                </button>
                            )}
                            <button
                                onClick={() => window.location.href = `mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                                className="flex items-center px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all font-bold"
                            >
                                <Mail size={16} className="mr-2" />
                                Reply via Email
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </motion.div>
    );
}
