"use client";

import { useState, useEffect } from "react";
import { Download, Calendar, Printer, Search, TrendingUp, DollarSign, Activity, FileText, ChevronRight, Filter, ExternalLink, Loader2 } from "lucide-react";
import { getBookings } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

export default function SalesPage() {
    const [dailySales, setDailySales] = useState<any[]>([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [dateFilter, setDateFilter] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        setIsLoading(true);
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
        } finally {
            setIsLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const filteredSales = dateFilter
        ? dailySales.filter(d => d.date === dateFilter)
        : dailySales;

    const stats = [
        {
            label: "Total Revenue",
            value: `GH₵ ${totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            desc: "Cumulative processed earnings"
        },
        {
            label: "Active Days",
            value: `${dailySales.length} Days`,
            icon: Activity,
            color: "text-primary",
            bg: "bg-primary/5",
            desc: "Operational history span"
        },
        {
            label: "Today's Sales",
            value: `GH₵ ${(dailySales.find(d => d.date === new Date().toLocaleDateString('en-CA'))?.total || 0).toLocaleString()}`,
            icon: TrendingUp,
            color: "text-amber-600",
            bg: "bg-amber-50",
            desc: "Revenue generated today"
        }
    ];

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin opacity-20" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Sales Data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20">
            <style jsx global>{`
                @media print {
                    aside, header, nav, .no-print { display: none !important; }
                    main { padding: 0 !important; margin: 0 !important; overflow: visible !important; width: 100% !important; max-width: none !important; }
                    body { background: white !important; color: black !important; padding: 40px !important; }
                    .print-container { border: none !important; box-shadow: none !important; width: 100% !important; }
                    .print-only { display: block !important; }
                }
            `}</style>

            {/* Header Action Bar */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm shadow-slate-200/50 no-print">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                        <TrendingUp size={28} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Sales Analytics</h2>
                        <p className="text-sm text-slate-500 font-medium mt-0.5">Financial performance and reporting</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    <div className="relative group flex-1">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="date"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="w-full sm:w-56 pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-primary/30 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all text-sm font-semibold"
                        />
                    </div>

                    <button
                        onClick={handlePrint}
                        className="flex items-center justify-center px-8 py-4 bg-primary text-white rounded-2xl font-bold text-sm hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all active:scale-95"
                    >
                        <Printer size={16} className="mr-2" />
                        Print Report
                    </button>
                </div>
            </div>

            {/* Metrics Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 no-print">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm shadow-slate-200/50 relative overflow-hidden group"
                    >
                        <div className={`absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-110 group-hover:opacity-[0.08] transition-all duration-700 ${stat.color}`}>
                            <stat.icon size={120} strokeWidth={1} />
                        </div>
                        <div className="relative z-10 space-y-4">
                            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                                <stat.icon size={22} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
                                <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{stat.value}</h3>
                                <p className="text-xs font-medium text-slate-500 mt-2">{stat.desc}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Ledger Portal */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm shadow-slate-200/50 overflow-hidden print-container">
                {/* Print Header */}
                <div className="p-12 border-b-2 border-slate-100 hidden print:block">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Sales Analytics Report</h1>
                            <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Nagor Rentals & Decor</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Generated At</p>
                            <p className="text-sm font-bold text-slate-900">{new Date().toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                        <div className="p-6 bg-slate-50 rounded-2xl">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Revenue</p>
                            <p className="text-xl font-bold text-slate-900">GH₵ {totalRevenue.toLocaleString()}</p>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-2xl">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Days Recorded</p>
                            <p className="text-xl font-bold text-slate-900">{dailySales.length} Days</p>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-2xl">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Report Period</p>
                            <p className="text-xl font-bold text-slate-900">{dateFilter || "Lifetime"}</p>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-10 py-6 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Transaction Date</th>
                                <th className="px-10 py-6 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">Bookings</th>
                                <th className="px-10 py-6 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Daily Total</th>
                                <th className="px-10 py-6 text-right text-xs font-bold text-slate-400 uppercase tracking-wider no-print">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredSales.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-10 py-32 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-20">
                                            <Search size={48} className="text-slate-400" />
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Zero-Point Detected in Temporal Data</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredSales.map((day, idx) => (
                                    <motion.tr
                                        key={day.date}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="hover:bg-slate-50/80 transition-all group"
                                    >
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-2 h-2 rounded-full bg-slate-200 group-hover:bg-primary transition-colors" />
                                                <span className="font-bold text-slate-900 text-sm">
                                                    {new Date(day.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 text-center">
                                            <span className="px-4 py-2 rounded-xl text-xs font-bold bg-white border border-slate-100 text-slate-700 shadow-sm">
                                                {day.count} {day.count === 1 ? 'Booking' : 'Bookings'}
                                            </span>
                                        </td>
                                        <td className="px-10 py-6 text-right font-bold text-slate-900 tabular-nums">
                                            GH₵ {day.total.toLocaleString()}
                                        </td>
                                        <td className="px-10 py-6 text-right no-print">
                                            <button
                                                onClick={() => {
                                                    setDateFilter(day.date);
                                                    setTimeout(() => window.print(), 100);
                                                }}
                                                className="p-3 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                                                title="Print Daily Report"
                                            >
                                                <Printer size={18} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                        <tfoot className="bg-slate-50 font-bold border-t border-slate-100">
                            <tr>
                                <td className="px-10 py-8 text-slate-500 text-sm">Totals</td>
                                <td className="px-10 py-8 text-center text-slate-900">{filteredSales.reduce((acc, curr) => acc + curr.count, 0)} Units</td>
                                <td className="px-10 py-8 text-right text-primary text-lg">GH₵ {filteredSales.reduce((acc, curr) => acc + curr.total, 0).toLocaleString()}</td>
                                <td className="px-10 py-8 no-print"></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Detailed Analysis Extension (Print Only) */}
                <AnimatePresence>
                    {dateFilter && filteredSales.length > 0 && (
                        <div className="hidden print:block p-12 border-t-2 border-slate-100 mt-12 break-before-page">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="p-3 bg-slate-900 rounded-xl text-white"><FileText size={20} /></div>
                                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Granular Transaction Payload — {new Date(dateFilter).toLocaleDateString()}</h2>
                            </div>
                            <table className="w-full text-left text-sm border-collapse">
                                <thead>
                                    <tr className="bg-slate-100 border-2 border-slate-100">
                                        <th className="p-4 font-black uppercase tracking-widest text-[9px]">Module ID</th>
                                        <th className="p-4 font-black uppercase tracking-widest text-[9px]">Entity Interface</th>
                                        <th className="p-4 font-black uppercase tracking-widest text-[9px]">Asset Configuration</th>
                                        <th className="p-4 font-black uppercase tracking-widest text-[9px] text-right">Yield Value</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredSales[0].bookings.map((b: any) => (
                                        <tr key={b._id}>
                                            <td className="p-4 font-mono text-[11px] font-bold text-slate-400">#{b._id.slice(-8).toUpperCase()}</td>
                                            <td className="p-4">
                                                <p className="font-black text-slate-900">{b.customerName}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{b.phone}</p>
                                            </td>
                                            <td className="p-4">
                                                <p className="text-[11px] leading-relaxed font-bold text-slate-600">
                                                    {b.items?.map((i: any) => `${i.quantity}x ${i.name}`).join(', ') || b.selectedPackage}
                                                </p>
                                            </td>
                                            <td className="p-4 text-right font-black text-slate-900">GH₵ {(b.totalAmount || b.totalCost).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="mt-20 pt-10 border-t border-slate-100 flex justify-between items-end grayscale opacity-50">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Official Verification</p>
                                    <div className="w-48 h-0.5 bg-slate-900 rounded-full" />
                                </div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nagor Rentals & Decor — Finance Division</p>
                            </div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
