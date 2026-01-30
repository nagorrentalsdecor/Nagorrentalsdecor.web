"use client";

import { useState, useEffect } from "react";
import { Download, Calendar, Printer, Search } from "lucide-react";
import { getBookings } from "@/lib/api";
import { motion } from "framer-motion";

export default function SalesPage() {
    const [dailySales, setDailySales] = useState<any[]>([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [dateFilter, setDateFilter] = useState("");

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        try {
            const bookings = await getBookings();

            // Filter Confirmed/Paid/Approved bookings
            const confirmedBookings = bookings.filter((b: any) =>
                ["Approved", "Confirmed", "Paid", "Completed"].includes(b.status)
            );

            // Group by Date
            const groupedArgs: Record<string, { date: string, count: number, total: number, bookings: any[] }> = {};

            confirmedBookings.forEach((b: any) => {
                const dateKey = new Date(b.created_at || b.createdAt || b.date).toLocaleDateString('en-CA'); // YYYY-MM-DD
                if (!groupedArgs[dateKey]) {
                    groupedArgs[dateKey] = {
                        date: dateKey,
                        count: 0,
                        total: 0,
                        bookings: []
                    };
                }
                const amount = Number(b.totalAmount || b.totalCost || 0);
                groupedArgs[dateKey].count += 1;
                groupedArgs[dateKey].total += amount;
                groupedArgs[dateKey].bookings.push(b);
            });

            // Convert to array and sort desc
            const salesArray = Object.values(groupedArgs).sort((a, b) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            );

            setDailySales(salesArray);
            setTotalRevenue(salesArray.reduce((sum, day) => sum + day.total, 0));

        } catch (error) {
            console.error("Failed to fetch sales", error);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const filteredSales = dateFilter
        ? dailySales.filter(d => d.date === dateFilter)
        : dailySales;

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
            className="space-y-6"
        >
            <style jsx global>{`
                @media print {
                    aside, header, .no-print { display: none !important; }
                    main { padding: 0 !important; margin: 0 !important; overflow: visible !important; }
                    body { background: white !important; color: black !important; }
                    .print-container { padding: 20px !important; }
                }
            `}</style>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-6 no-print">
                <div>
                    <h1 className="text-2xl font-bold text-secondary tracking-tight">Sales Report</h1>
                    <p className="text-sm text-gray-500 mt-1">Monitor daily revenue and transaction history.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative group">
                        <input
                            type="date"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="w-full sm:w-48 pl-9 pr-4 py-2 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-gray-200 focus:outline-none focus:ring-0 transition-all text-sm"
                        />
                        <Calendar className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-gray-600 transition-colors" size={16} />
                    </div>

                    <button
                        onClick={handlePrint}
                        className="flex items-center justify-center px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors shadow-lg shadow-secondary/20 font-bold text-sm"
                    >
                        <Printer size={16} className="mr-2" />
                        Print Report
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 no-print">
                <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-sm">
                    <p className="text-sm text-gray-400 font-medium mb-1">Total Revenue (All Time)</p>
                    <h3 className="text-3xl font-bold text-primary">GH₵ {totalRevenue.toLocaleString()}</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-sm">
                    <p className="text-sm text-gray-400 font-medium mb-1">Active Sales Days</p>
                    <h3 className="text-3xl font-bold text-secondary">{dailySales.length}</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-sm">
                    <p className="text-sm text-gray-400 font-medium mb-1">Today's Sales</p>
                    <h3 className="text-3xl font-bold text-emerald-600">
                        GH₵ {(dailySales.find(d => d.date === new Date().toLocaleDateString('en-CA'))?.total || 0).toLocaleString()}
                    </h3>
                </div>
            </div>

            {/* Sales Table - Printable Area */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden print-container">
                <div className="p-6 border-b border-gray-100 hidden print:block">
                    <h1 className="text-2xl font-bold text-black mb-2">Nagor Rental & Decor - Sales Report</h1>
                    <p className="text-sm text-gray-600">Generated on {new Date().toLocaleString()}</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Transactions</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Total Sales</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right no-print">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredSales.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                                        No sales records found.
                                    </td>
                                </tr>
                            ) : (
                                filteredSales.map((day) => (
                                    <tr
                                        key={day.date}
                                        className="hover:bg-purple-50/50 transition-colors group"
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-800">
                                            {new Date(day.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700">
                                                {day.count} Orders
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-primary">
                                            GH₵ {day.total.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-right no-print">
                                            <button
                                                onClick={() => {
                                                    setDateFilter(day.date);
                                                    setTimeout(() => window.print(), 100);
                                                }}
                                                className="text-gray-400 hover:text-secondary p-2 transition-colors"
                                                title="Print Daily Report"
                                            >
                                                <Printer size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                        <tfoot className="bg-gray-50 font-bold border-t border-gray-100">
                            <tr>
                                <td className="px-6 py-4 text-gray-800">TOTAL</td>
                                <td className="px-6 py-4 text-center text-gray-800">{filteredSales.reduce((acc, curr) => acc + curr.count, 0)} Orders</td>
                                <td className="px-6 py-4 text-right text-primary">GH₵ {filteredSales.reduce((acc, curr) => acc + curr.total, 0).toLocaleString()}</td>
                                <td className="px-6 py-4 no-print"></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Printable Booking Details for Daily View */}
                {dateFilter && filteredSales.length > 0 && (
                    <div className="hidden print:block p-6 border-t border-gray-200 mt-8 break-before-page">
                        <h2 className="text-xl font-bold mb-4">Detailed Transactions - {new Date(dateFilter).toLocaleDateString()}</h2>
                        <table className="w-full text-left text-sm border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border p-2">Order ID</th>
                                    <th className="border p-2">Customer</th>
                                    <th className="border p-2">Items</th>
                                    <th className="border p-2 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSales[0].bookings.map((b: any) => (
                                    <tr key={b._id}>
                                        <td className="border p-2 font-mono">#{b._id.slice(-6)}</td>
                                        <td className="border p-2">{b.customerName} <br /><span className="text-xs text-gray-500">{b.phone}</span></td>
                                        <td className="border p-2">
                                            {b.items?.map((i: any) => `${i.quantity}x ${i.name}`).join(', ') || b.selectedPackage}
                                        </td>
                                        <td className="border p-2 text-right">GH₵ {(b.totalAmount || b.totalCost).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
