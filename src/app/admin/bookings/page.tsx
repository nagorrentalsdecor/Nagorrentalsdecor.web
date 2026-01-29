"use client";

import { useState, useEffect } from "react";
import { Search, Eye, Check, X, Filter, Download, Calendar as CalendarIcon } from "lucide-react";
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
                b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
            console.log("Bookings Page Received Data:", data);
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
            Approved: "bg-emerald-50 text-emerald-600 border-emerald-100",
            Pending: "bg-amber-50 text-amber-600 border-amber-100",
            Cancelled: "bg-gray-50 text-gray-500 border-gray-100",
            Completed: "bg-blue-50 text-blue-600 border-blue-100"
        };
        const defaultStyle = "bg-gray-50 text-gray-600 border-gray-100";

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${styles[status] || defaultStyle}`}>
                <span className={`w-1.5 h-1.5 rounded-full mr-2 ${status === 'Approved' ? 'bg-emerald-500' : status === 'Pending' ? 'bg-amber-500' : 'bg-gray-400'}`}></span>
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
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Bookings</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage customer reservations.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full sm:w-64 pl-9 pr-4 py-2 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-gray-200 focus:outline-none focus:ring-0 transition-all text-sm"
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-gray-600 transition-colors" size={16} />
                    </div>

                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full sm:w-40 pl-9 pr-8 py-2 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-gray-200 focus:outline-none focus:ring-0 transition-all text-sm appearance-none cursor-pointer"
                        >
                            <option value="All">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="Completed">Completed</option>
                        </select>
                        <Filter className="absolute left-3 top-2.5 text-gray-400" size={16} />
                    </div>

                    <button className="flex items-center justify-center p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors" title="Export CSV">
                        <Download size={18} />
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredBookings.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                                        No bookings found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredBookings.map((booking) => (
                                    <tr
                                        key={booking._id}
                                        className="hover:bg-gray-50 transition-colors group cursor-default"
                                    >
                                        <td className="px-6 py-4 text-xs font-mono text-gray-400">#{booking._id.slice(-6)}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900 text-sm">{booking.customerName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">{new Date(booking.eventDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-500 text-sm">
                                                {booking.eventType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900 text-sm">GH₵ {(booking.totalAmount || booking.totalCost || 0).toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={booking.status} />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => setSelectedBooking(booking)}
                                                    className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye size={16} />
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

            {/* View Details Modal */}
            <Modal
                isOpen={!!selectedBooking}
                onClose={() => setSelectedBooking(null)}
                title="Booking Details"
            >
                {selectedBooking && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Booking Status</p>
                                <StatusBadge status={selectedBooking.status} />
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Total Amount</p>
                                <p className="text-2xl font-bold text-primary">GH₵ {selectedBooking.totalCost?.toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <h3 className="text-sm font-bold text-gray-900 border-b pb-2 mb-3">Customer Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Full Name</p>
                                        <p className="font-medium text-gray-800">{selectedBooking.customerName}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                                        <p className="font-medium text-gray-800">{selectedBooking.phone}</p>
                                    </div>
                                    {selectedBooking.email && (
                                        <div className="col-span-2">
                                            <p className="text-xs text-gray-500 mb-1">Email Address</p>
                                            <p className="font-medium text-gray-800">{selectedBooking.email}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="col-span-2">
                                <h3 className="text-sm font-bold text-gray-900 border-b pb-2 mb-3">Event Details</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Event Type</p>
                                        <p className="font-medium text-gray-800">{selectedBooking.eventType}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Date</p>
                                        <p className="font-medium text-gray-800">{new Date(selectedBooking.eventDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-xs text-gray-500 mb-1">Venue / Location</p>
                                        <p className="font-medium text-gray-800">{selectedBooking.location}</p>
                                    </div>
                                    {selectedBooking.notes && (
                                        <div className="col-span-2">
                                            <p className="text-xs text-gray-500 mb-1">Additional Notes</p>
                                            <p className="font-medium text-gray-800 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">{selectedBooking.notes}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        {selectedBooking.items && selectedBooking.items.length > 0 && (
                            <div className="border border-gray-100 rounded-xl overflow-hidden">
                                <div className="bg-gray-50/50 px-4 py-2 border-b border-gray-100">
                                    <h3 className="text-sm font-bold text-gray-800">Order Items</h3>
                                </div>
                                <div className="divide-y divide-gray-50 max-h-48 overflow-y-auto">
                                    {selectedBooking.items.map((item: any, idx: number) => (
                                        <div key={idx} className="flex justify-between items-center p-3 text-sm">
                                            <div className="flex items-center">
                                                <span className="font-bold text-gray-500 mr-3 w-6 text-center bg-gray-100 rounded-full py-0.5 text-xs">{item.quantity}x</span>
                                                <span className="text-gray-800">{item.name}</span>
                                            </div>
                                            <span className="font-medium text-gray-600">GH₵ {(item.price * item.quantity).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-gray-50/50 px-4 py-3 border-t border-gray-100 flex justify-between items-center">
                                    <span className="text-sm font-semibold text-gray-600">Total</span>
                                    <span className="text-base font-bold text-primary">GH₵ {selectedBooking.totalAmount ? selectedBooking.totalAmount.toLocaleString() : "0"}</span>
                                </div>
                            </div>
                        )}

                        {selectedBooking.selectedPackage && (
                            <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                                <p className="text-xs text-primary font-bold uppercase tracking-wide mb-1">Selected Package</p>
                                <p className="font-heading font-bold text-lg text-gray-800">{selectedBooking.selectedPackage}</p>
                            </div>
                        )}

                        <div className="border-t pt-6 mt-4 flex justify-end space-x-3">
                            {selectedBooking.status === "Pending" && (
                                <>
                                    <button
                                        onClick={() => handleStatusChange(selectedBooking._id, "Approved")}
                                        className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-bold shadow-lg shadow-emerald-200 transition-all flex items-center"
                                    >
                                        <Check size={18} className="mr-2" />
                                        Approve Booking
                                    </button>
                                    <button
                                        onClick={() => handleStatusChange(selectedBooking._id, "Cancelled")}
                                        className="px-5 py-2.5 bg-white border border-rose-200 text-rose-600 rounded-xl hover:bg-rose-50 font-bold transition-all flex items-center"
                                    >
                                        <X size={18} className="mr-2" />
                                        Reject
                                    </button>
                                </>
                            )}
                            <button
                                onClick={() => setSelectedBooking(null)}
                                className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-bold transition-all"
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
