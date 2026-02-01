"use client";

import { useEffect, useState } from "react";
import {
    DollarSign, ThumbsUp, Star, MoreHorizontal,
    Calendar as CalendarIcon, ChevronDown, ChevronLeft, ChevronRight,
    ArrowUpRight, ArrowDownRight, User, Package, Clock,
    ShoppingBag, Activity, Shield, BarChart3, TrendingUp, Zap, Loader2
} from "lucide-react";
import { getBookings, getPackages } from "@/lib/api";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// --- Components ---

const StatCard = ({ title, value, icon: Icon, isPrimary = false, subtext, trend, delay = 0 }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className={`p-8 rounded-[2.5rem] shadow-sm border transition-all duration-700 hover:shadow-2xl hover:-translate-y-1 group relative overflow-hidden ${isPrimary
            ? "bg-primary border-primary text-white"
            : "bg-white border-slate-100 text-slate-800"
            }`}
    >
        {isPrimary ? (
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-white/20 transition-colors duration-700"></div>
        ) : (
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-purple-100 transition-colors duration-700"></div>
        )}
        <div className="flex justify-between items-start mb-8 relative z-10">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:rotate-12 shadow-sm ${isPrimary ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                }`}>
                <Icon size={28} />
            </div>
            {trend && (
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${isPrimary ? "bg-white/10 text-white" : trend > 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                    {trend > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {Math.abs(trend)}%
                </div>
            )}
        </div>
        <div className="relative z-10">
            <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${isPrimary ? "text-purple-100" : "text-slate-400"}`}>{title}</p>
            <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
            {subtext && <p className={`text-xs mt-3 font-semibold opacity-60 ${isPrimary ? "text-purple-100" : "text-slate-500"}`}>{subtext}</p>}
        </div>
    </motion.div>
);

const RevenueChart = ({ monthlyData }: { monthlyData: number[] }) => {
    const maxVal = Math.max(...monthlyData, 1);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentRevenue = monthlyData.reduce((a, b) => a + b, 0);

    return (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 h-full flex flex-col group overflow-hidden relative">
            {/* Header */}
            <div className="flex justify-between items-end mb-8 relative z-10">
                <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total Revenue</h3>
                    <h2 className="text-3xl font-black text-slate-900 mt-1 tracking-tight">GH₵ {currentRevenue.toLocaleString()}</h2>
                </div>
                <div className="bg-primary/5 text-primary px-4 py-2 rounded-2xl border border-primary/10">
                    <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                        <TrendingUp size={14} />
                        Year to Date
                    </span>
                </div>
            </div>

            {/* Chart Container */}
            <div className="flex-1 flex items-end justify-between gap-2 sm:gap-4 relative z-10 w-full min-h-[200px]">
                {/* Horizontal Grid Pattern */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-0">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-full border-t border-dashed border-slate-100"></div>
                    ))}
                </div>

                {monthlyData.map((val, i) => {
                    const heightPercent = Math.max((val / maxVal) * 100, 2); // Min height 2%
                    return (
                        <div key={i} className="relative flex flex-col items-center flex-1 h-full justify-end group/bar">

                            {/* Tooltip */}
                            <div className="absolute bottom-[105%] opacity-0 group-hover/bar:opacity-100 transition-all duration-300 transform translate-y-2 group-hover/bar:translate-y-0 z-20 pointer-events-none">
                                <div className="bg-slate-900 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg shadow-xl border border-slate-700 whitespace-nowrap">
                                    GH₵ {val.toLocaleString()}
                                </div>
                                <div className="w-2 h-2 bg-slate-900 rotate-45 transform origin-center mx-auto -mt-1"></div>
                            </div>

                            {/* Bar Track (Empty Background) */}
                            <div className="w-full h-full absolute bottom-0 bg-slate-50 rounded-t-xl z-0"></div>

                            {/* Active Bar */}
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${heightPercent}%` }}
                                transition={{ duration: 1, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                                className="w-full bg-primary relative z-10 rounded-t-xl group-hover/bar:brightness-110 transition-all"
                            >
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-t-xl"></div>
                            </motion.div>

                            {/* Label */}
                            <span className="text-[9px] font-bold text-slate-300 mt-3 group-hover/bar:text-primary group-hover/bar:scale-110 transition-all uppercase tracking-wider">
                                {months[i]}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const EfficiencyDonut = ({ pendingPercentage, onCheck }: { pendingPercentage: number, onCheck: () => void }) => (
    <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center justify-between relative h-full group overflow-hidden">
        <div className="absolute -bottom-10 -left-10 text-primary/5 group-hover:scale-110 transition-transform duration-1000 rotate-12">
            <Zap size={180} strokeWidth={1} />
        </div>
        <div className="text-center w-full relative z-10">
            <h3 className="font-bold text-slate-900 text-lg tracking-tight">Booking Efficiency</h3>
            <p className="text-[10px] text-slate-500 font-medium mt-1 uppercase tracking-wide">Confirmation Rate</p>
        </div>

        <div className="relative w-40 h-40 my-4 z-10">
            <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="70" stroke="#F8FAFC" strokeWidth="15" fill="none" />
                <motion.circle
                    cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="15" fill="none"
                    strokeDasharray="440"
                    initial={{ strokeDashoffset: 440 }}
                    animate={{ strokeDashoffset: 440 - (440 * pendingPercentage) / 100 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    strokeLinecap="round"
                    className="text-primary"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-3xl font-bold text-slate-900 tracking-tight tabular-nums">{Math.round(pendingPercentage)}%</span>
            </div>
        </div>

        <button
            onClick={onCheck}
            className="bg-primary text-white px-8 py-3 rounded-2xl text-xs font-bold shadow-lg shadow-primary/20 hover:bg-primary-hover hover:-translate-y-1 active:translate-y-0 transition-all w-full relative z-10"
        >
            Manage Bookings
        </button>
    </div>
);

const RecentBookings = ({ bookings }: { bookings: any[] }) => (
    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 group h-full">
        <div className="flex justify-between items-center mb-10">
            <div>
                <h3 className="font-bold text-slate-900 text-xl tracking-tight">Recent Activity</h3>
                <p className="text-sm text-slate-500 font-medium mt-1">Latest event bookings</p>
            </div>
            <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:text-primary transition-colors">
                <MoreHorizontal size={20} />
            </button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-slate-50">
                        <th className="pb-6 text-xs font-bold text-slate-400 px-2 uppercase tracking-wide">Customer</th>
                        <th className="pb-6 text-xs font-bold text-slate-400 text-center uppercase tracking-wide">Date</th>
                        <th className="pb-6 text-xs font-bold text-slate-400 text-right uppercase tracking-wide">Amount</th>
                        <th className="pb-6 text-xs font-bold text-slate-400 text-right px-2 uppercase tracking-wide">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {bookings.slice(0, 6).map((b, i) => (
                        <tr key={i} className="group/row hover:bg-slate-50/50 transition-colors">
                            <td className="py-5 px-2">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-xs font-bold text-primary group-hover/row:scale-110 transition-transform">
                                        {(b.name || b.customerName || "U").substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 tracking-tight">{b.name || b.customerName}</p>
                                        <p className="text-[10px] font-medium text-slate-400">ID: {b._id?.slice(-6).toUpperCase()}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="py-5 text-xs font-bold text-slate-500 text-center">
                                {new Date(b.createdAt || b.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </td>
                            <td className="py-5 text-sm font-bold text-slate-900 text-right tabular-nums">
                                {b.totalAmount ? `GH₵${b.totalAmount.toLocaleString()}` : "—"}
                            </td>
                            <td className="py-5 text-right px-2">
                                <span className={`px-3 py-1.5 rounded-xl text-[10px] font-bold shadow-sm ${["Confirmed", "Approved", "Paid"].includes(b.status) ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                    b.status === 'Pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-slate-50 text-slate-500'
                                    }`}>
                                    {b.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const SimpleCalendar = ({ bookings = [] }: { bookings?: any[] }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const today = new Date();

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) days.push({ num: '', type: 'empty' });
    for (let i = 1; i <= daysInMonth; i++) days.push({ num: i, type: 'current' });
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) days.push({ num: i, type: 'next' });

    const getBookingCount = (day: number) => {
        if (!bookings || !day) return 0;
        const targetDate = new Date(currentYear, currentMonth, day);
        return bookings.filter(b => {
            const bDate = new Date(b.eventDate || b.date);
            return bDate.getDate() === targetDate.getDate() &&
                bDate.getMonth() === targetDate.getMonth() &&
                bDate.getFullYear() === targetDate.getFullYear();
        }).length;
    };

    return (
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 h-full flex flex-col text-slate-900 group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>

            <div className="flex justify-between items-center mb-10 relative z-10">
                <div className="font-bold text-xl flex items-center gap-4 tracking-tight">
                    <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                        <CalendarIcon size={20} />
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{currentDate.toLocaleString('default', { month: 'long' })}</p>
                        <p className="text-sm text-slate-400 font-bold">{currentYear}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={prevMonth} className="p-3 hover:bg-slate-50 rounded-2xl transition-all active:scale-90 border border-slate-100 bg-white">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={nextMonth} className="p-3 hover:bg-slate-50 rounded-2xl transition-all active:scale-90 border border-slate-100 bg-white">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-400 mb-6 uppercase tracking-wider relative z-10">
                <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
            </div>

            <div className="grid grid-cols-7 gap-3 text-center text-xs flex-1 relative z-10">
                {days.map((d, i) => {
                    if (d.type === 'empty' || d.type === 'next') {
                        return <div key={i} className="flex items-center justify-center text-slate-200 font-bold">{d.num}</div>
                    }

                    const bookingCount = getBookingCount(d.num as number);
                    const isToday = d.num === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();

                    return (
                        <div key={i} className="relative flex flex-col items-center justify-center group/day">
                            <div className={`w-11 h-11 flex items-center justify-center rounded-2xl transition-all duration-300 cursor-pointer
                                ${isToday ? "bg-primary text-white font-bold shadow-lg shadow-primary/20 scale-110" :
                                    bookingCount > 0 ? "bg-purple-50 text-primary font-bold border border-purple-100" : "hover:bg-slate-50 text-slate-500 font-semibold"}
                            `}>
                                {d.num}
                            </div>
                            {bookingCount > 0 && !isToday && (
                                <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-primary shadow-sm"></span>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mt-10 flex items-center justify-between px-2 relative z-10 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Event Overview</p>
                    <p className="text-xs font-bold text-primary mt-1">{bookings.filter(b => new Date(b.eventDate || b.date).getMonth() === currentMonth).length} Total Events In {currentDate.toLocaleString('default', { month: 'short' })}</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Active</span>
                </div>
            </div>
        </div>
    );
};

export default function Dashboard() {
    const router = useRouter();
    const [stats, setStats] = useState({
        revenue: 0,
        bookings: 0,
        activePackages: 0,
        pending: 0,
        confirmedPercentage: 0,
        monthlyRevenue: new Array(12).fill(0)
    });
    const [allBookings, setAllBookings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [bookingsData, packagesData] = await Promise.all([
                    getBookings(),
                    getPackages()
                ]);

                let totalRevenue = 0;
                let confirmedCount = 0;
                let pendingCount = 0;
                const monthlyRevenue = new Array(12).fill(0);

                if (Array.isArray(bookingsData)) {
                    bookingsData.forEach((b: any) => {
                        if (["Confirmed", "Approved", "Paid"].includes(b.status)) {
                            confirmedCount++;
                            const amount = Number(b.totalAmount) || 0;
                            totalRevenue += amount;
                            const date = new Date(b.createdAt || b.date);
                            if (!isNaN(date.getTime())) {
                                const month = date.getMonth();
                                monthlyRevenue[month] += amount;
                            }
                        } else if (b.status === "Pending") {
                            pendingCount++;
                        }
                    });
                }

                const totalBookings = bookingsData?.length || 0;
                const confirmedPercentage = totalBookings > 0 ? (confirmedCount / totalBookings) * 100 : 0;

                setStats({
                    revenue: totalRevenue,
                    bookings: totalBookings,
                    activePackages: packagesData?.length || 0,
                    pending: pendingCount,
                    confirmedPercentage,
                    monthlyRevenue
                });
                setAllBookings(bookingsData || []);

            } catch (error) {
                console.error("Dashboard Fetch Error", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const getDBPackages = async () => {
        try {
            const { getPackages } = await import("@/lib/api");
            return await getPackages();
        } catch { return []; }
    };

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin opacity-20" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Syncing Dashboard...</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-10 pb-20"
        >
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard
                    title="Total Revenue"
                    value={`GH₵${stats.revenue.toLocaleString()}`}
                    icon={DollarSign}
                    isPrimary={true}
                    trend={12.5}
                    subtext="Confirmed processed revenue"
                    delay={0.1}
                />
                <StatCard
                    title="Total Bookings"
                    value={stats.bookings}
                    icon={ShoppingBag}
                    trend={8.2}
                    subtext="All event registrations"
                    delay={0.2}
                />
                <StatCard
                    title="Active Packages"
                    value={stats.activePackages}
                    icon={Package}
                    subtext="Total available services"
                    delay={0.3}
                />
                <StatCard
                    title="Pending Requests"
                    value={stats.pending}
                    icon={Clock}
                    subtext="Awaiting administrator review"
                    delay={0.4}
                />
            </div>

            {/* Middle Section: Bar Chart & Donut */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 h-[400px]">
                    <RevenueChart monthlyData={stats.monthlyRevenue} />
                </div>
                <div className="h-[400px]">
                    <EfficiencyDonut pendingPercentage={stats.confirmedPercentage} onCheck={() => router.push('/admin/bookings')} />
                </div>
            </div>

            {/* Bottom Section: Recent Bookings & Calendar */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <RecentBookings bookings={allBookings} />
                <div className="min-h-[450px]">
                    <SimpleCalendar bookings={allBookings} />
                </div>
            </div>
        </motion.div>
    );
}
