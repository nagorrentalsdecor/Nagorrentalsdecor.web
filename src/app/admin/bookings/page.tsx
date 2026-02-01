"use client";

import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Search, Download, Eye, Trash2, ChevronLeft, ChevronRight, ArrowRight, Loader2, Printer, Check, X, Filter, User, MapPin, Phone, Mail, FileText } from "lucide-react";
import { getBookings, updateBookingStatus } from "@/lib/api";
import Modal from "@/components/ui/Modal";
import { motion, AnimatePresence } from "framer-motion";

export default function BookingsPage() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [filteredBookings, setFilteredBookings] = useState<any[]>([]);
    const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    useEffect(() => {
        fetchBookings();
    }, []);

    useEffect(() => {
        let result = bookings;

        // Filter by Search
        if (searchTerm) {
            result = result.filter(b =>
                (b.customerName || b.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                b._id.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by Status
        if (statusFilter !== "All") {
            result = result.filter(b => b.status === statusFilter);
        }

        setFilteredBookings(result);
    }, [searchTerm, statusFilter, bookings]);

    const fetchBookings = async () => {
        try {
            const data = await getBookings();
            setBookings(data);
            setFilteredBookings(data);
        } catch (error) {
            console.error("Failed to fetch bookings", error);
        }
    };

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            await updateBookingStatus(id, newStatus);
            fetchBookings();
            if (selectedBooking && selectedBooking._id === id) {
                setSelectedBooking({ ...selectedBooking, status: newStatus });
            }
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const styles: Record<string, string> = {
            Approved: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
            Confirmed: "bg-blue-500/10 text-blue-600 border-blue-500/20",
            Pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
            Cancelled: "bg-rose-500/10 text-rose-600 border-rose-500/20",
            Completed: "bg-slate-500/10 text-slate-600 border-slate-500/20"
        };
        const defaultStyle = "bg-slate-50 text-slate-400 border-slate-100";

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[status] || defaultStyle}`}>
                <span className={`w-1.5 h-1.5 rounded-full mr-2 ${status === 'Approved' || status === 'Confirmed' ? 'bg-emerald-500' :
                    status === 'Pending' ? 'bg-amber-500' :
                        status === 'Cancelled' ? 'bg-rose-500' : 'bg-slate-400'
                    }`}></span>
                {status}
            </span>
        );
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
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
                        <CalendarIcon size={28} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Booking Management</h2>
                        <p className="text-sm text-slate-500 font-medium mt-0.5">{bookings.length} Total Bookings</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    <div className="relative group flex-1 sm:w-80">
                        <input
                            type="text"
                            placeholder="Search client or Order ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-primary/30 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                    </div>

                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full sm:w-48 pl-10 pr-10 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-primary/30 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold uppercase tracking-wider appearance-none cursor-pointer text-slate-600"
                        >
                            <option value="All">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="Completed">Completed</option>
                        </select>
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <ArrowRight size={14} className="rotate-90 text-slate-300" />
                        </div>
                    </div>

                    <button
                        onClick={() => window.print()}
                        className="flex items-center justify-center p-3 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-2xl border border-slate-100 transition-all group"
                        title="Print Report"
                    >
                        <Printer size={20} className="group-hover:scale-110 transition-transform" />
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm shadow-slate-200/50">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Order ID</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Customer</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Event Date</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Total Cost</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">View</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredBookings.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                                <FileText className="text-slate-200" size={32} />
                                            </div>
                                            <p className="text-slate-500 font-bold uppercase tracking-wider text-xs">No bookings found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredBookings.map((booking) => (
                                    <tr
                                        key={booking._id}
                                        className="hover:bg-slate-50/50 transition-colors group"
                                    >
                                        <td className="px-8 py-6 text-xs font-bold text-slate-400 tracking-wider">
                                            #{booking._id.slice(-6).toUpperCase()}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900 text-sm tracking-tight">{booking.customerName || booking.name}</span>
                                                <span className="text-xs font-medium text-slate-500 mt-0.5">{booking.eventType || "Event"}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                                                    <CalendarIcon size={14} />
                                                </div>
                                                <span className="text-xs font-bold text-slate-600">{new Date(booking.eventDate || booking.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="font-bold text-slate-900 text-sm tabular-nums">GH₵ {(booking.totalAmount || booking.totalCost || 0).toLocaleString()}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <StatusBadge status={booking.status} />
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button
                                                onClick={() => setSelectedBooking(booking)}
                                                className="p-3 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all active:scale-95 border border-transparent hover:border-primary/10"
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

            {/* View Details Modal */}
            <Modal
                isOpen={!!selectedBooking}
                onClose={() => setSelectedBooking(null)}
                title="Booking Details"
            >
                {selectedBooking && (
                    <div className="space-y-8 py-2">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6 bg-primary p-8 rounded-[2rem] text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <div className="relative z-10">
                                <p className="text-[10px] text-purple-100 uppercase tracking-wider font-bold mb-2">Order ID</p>
                                <p className="text-lg font-bold text-white tracking-tight">#{selectedBooking._id.slice(-8).toUpperCase()}</p>
                                <p className="text-[9px] text-purple-200 mt-2">
                                    Booked: {selectedBooking.createdAt ? new Date(selectedBooking.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                                </p>
                            </div>
                            <div className="relative z-10">
                                <p className="text-[10px] text-purple-100 uppercase tracking-wider font-bold mb-2">Booking Status</p>
                                <StatusBadge status={selectedBooking.status} />
                            </div>
                            <div className="text-right sm:text-right relative z-10">
                                <p className="text-[10px] text-purple-100 uppercase tracking-wider font-bold mb-2">Total Amount</p>
                                <p className="text-3xl font-bold text-white tracking-tight">GH₵ {(selectedBooking.totalCost || selectedBooking.totalAmount || 0).toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-slate-50 p-7 rounded-[2rem] border border-slate-100">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-primary">
                                        <User size={18} />
                                    </div>
                                    <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs">Customer Information</h3>
                                </div>
                                <div className="space-y-5">
                                    <div>
                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Full Name</p>
                                        <p className="font-bold text-slate-800 text-sm tracking-tight">{selectedBooking.customerName || selectedBooking.name}</p>
                                    </div>
                                    <div className="flex gap-6">
                                        <div>
                                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Phone Number</p>
                                            <div className="flex items-center gap-2 font-bold text-slate-800 text-sm tracking-tight">
                                                <Phone size={14} className="text-slate-300" />
                                                {selectedBooking.phone}
                                            </div>
                                        </div>
                                        {selectedBooking.email && (
                                            <div>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Email Address</p>
                                                <div className="flex items-center gap-2 font-bold text-slate-800 text-sm tracking-tight">
                                                    <Mail size={14} className="text-slate-300" />
                                                    {selectedBooking.email}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-7 rounded-[2rem] border border-slate-100">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-primary">
                                        <MapPin size={18} />
                                    </div>
                                    <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs">Event Details</h3>
                                </div>
                                <div className="space-y-5">
                                    <div className="flex gap-8">
                                        <div>
                                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Event Type</p>
                                            <p className="font-bold text-slate-800 text-sm tracking-tight">{selectedBooking.eventType || "Standard"}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Date</p>
                                            <p className="font-bold text-slate-800 text-sm tracking-tight">{new Date(selectedBooking.eventDate || selectedBooking.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Event Location</p>
                                        <p className="font-bold text-slate-800 text-sm tracking-tight flex items-center gap-2">
                                            <MapPin size={14} className="text-slate-300" />
                                            {selectedBooking.location}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {selectedBooking.notes && (
                            <div className="p-7 bg-white border border-slate-100 rounded-[2rem]">
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-3">Additional Notes</p>
                                <p className="text-slate-600 text-sm font-medium leading-relaxed italic">"{selectedBooking.notes}"</p>
                            </div>
                        )}

                        {/* Order Items */}
                        {selectedBooking.items && selectedBooking.items.length > 0 && (
                            <div className="border border-slate-100 rounded-[2rem] overflow-hidden">
                                <div className="bg-slate-50/80 px-7 py-4 border-b border-slate-100">
                                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Booked Items</h3>
                                </div>
                                <div className="divide-y divide-slate-50 max-h-64 overflow-y-auto bg-white">
                                    {selectedBooking.items.map((item: any, idx: number) => (
                                        <div key={idx} className="flex justify-between items-center px-7 py-4 text-sm hover:bg-slate-50/50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center text-[10px] font-bold">
                                                    {item.quantity}x
                                                </div>
                                                <span className="font-bold text-slate-700">{item.name}</span>
                                            </div>
                                            <span className="font-bold text-slate-900 tabular-nums">GH₵ {(item.price * item.quantity).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-slate-50/80 px-7 py-5 border-t border-slate-100 flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Value</span>
                                    <span className="text-xl font-bold text-primary">GH₵ {selectedBooking.totalAmount ? selectedBooking.totalAmount.toLocaleString() : "0"}</span>
                                </div>
                            </div>
                        )}

                        {selectedBooking.selectedPackage && (
                            <div className="bg-primary/5 p-7 rounded-[2rem] border border-primary/10 flex items-center justify-between">
                                <div>
                                    <p className="text-[9px] text-primary font-bold uppercase tracking-wider mb-1.5">Selected Package</p>
                                    <p className="font-bold text-xl text-slate-900 tracking-tight">{selectedBooking.selectedPackage}</p>
                                </div>
                                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                    <FileText size={20} />
                                </div>
                            </div>
                        )}

                        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-end gap-3">
                            {selectedBooking.status === "Pending" && (
                                <>
                                    <button
                                        onClick={() => handleStatusChange(selectedBooking._id, "Approved")}
                                        className="px-8 py-4 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 font-bold text-xs shadow-lg shadow-emerald-100 transition-all flex items-center justify-center active:scale-95"
                                    >
                                        <Check size={18} className="mr-2" />
                                        Approve Booking
                                    </button>
                                    <button
                                        onClick={() => handleStatusChange(selectedBooking._id, "Cancelled")}
                                        className="px-8 py-4 bg-white border border-rose-200 text-rose-600 rounded-2xl hover:bg-rose-50 font-bold text-xs transition-all flex items-center justify-center active:scale-95"
                                    >
                                        <X size={18} className="mr-2" />
                                        Cancel Booking
                                    </button>
                                </>
                            )}
                            <button
                                onClick={() => setSelectedBooking(null)}
                                className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 font-bold text-xs transition-all active:scale-95"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </motion.div >
    );
}
