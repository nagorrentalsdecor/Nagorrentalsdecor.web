"use client";

import { useEffect, useState } from "react";
import { DollarSign, Share2, ThumbsUp, Star, MoreHorizontal, Calendar as CalendarIcon, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { getBookings } from "@/lib/api";
import { useRouter } from "next/navigation";

// --- Components ---

const StatCard = ({ title, value, icon: Icon, isPrimary = false, subtext }: any) => (
    <div className={`p-6 rounded-3xl shadow-md border transition-all duration-300 hover:-translate-y-1 ${isPrimary
        ? "bg-primary border-primary text-white"
        : "bg-white border-gray-100 text-gray-800"
        }`}>
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className={`text-sm font-medium ${isPrimary ? "text-purple-200" : "text-gray-400"}`}>{title}</p>
                <h3 className="text-3xl font-bold mt-2 tracking-tight">{value}</h3>
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isPrimary ? "bg-white/10 text-white" : "bg-purple-50 text-primary"
                }`}>
                <Icon size={20} />
            </div>
        </div>
        {subtext && <p className={`text-xs ${isPrimary ? "text-purple-300" : "text-gray-400"}`}>{subtext}</p>}
    </div>
);

const BarChart = ({ monthlyData, onCheck }: { monthlyData: number[], onCheck: () => void }) => {
    const maxVal = Math.max(...monthlyData, 1); // Avoid div by zero

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="font-bold text-gray-800 text-lg">Financial Performance</h3>
                    <p className="text-xs text-gray-400">Monthly Revenue (GH₵)</p>
                </div>
                <button
                    onClick={onCheck}
                    className="bg-purple-50 text-primary px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-purple-100 transition-colors"
                >
                    View Details
                </button>
            </div>

            <div className="flex-1 flex items-end justify-between gap-2 h-48 px-2">
                {monthlyData.map((val, i) => {
                    const heightPercent = (val / maxVal) * 100;
                    return (
                        <div key={i} className="flex flex-col items-center gap-2 group flex-1 h-full justify-end">
                            {/* Tooltip */}
                            <div className="opacity-0 group-hover:opacity-100 mb-2 bg-secondary text-white text-[10px] px-2 py-1 rounded absolute -mt-8 transition-opacity z-10 whitespace-nowrap">
                                GH₵{val.toLocaleString()}
                            </div>
                            <div
                                className={`w-full rounded-t-sm transition-all duration-500 ${val > 0 ? "bg-primary group-hover:bg-primary-hover" : "bg-gray-100"}`}
                                style={{ height: `${Math.max(heightPercent, 2)}%` }} // Min height 2% for visibility
                            ></div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase">{["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i].substring(0, 3)}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const DonutChart = ({ pendingPercentage, onCheck }: { pendingPercentage: number, onCheck: () => void }) => (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center relative h-full">
        <div className="relative w-40 h-40">
            <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="70" stroke="#F3F4F6" strokeWidth="15" fill="none" />
                <circle
                    cx="80" cy="80" r="70" stroke="#9333EA" strokeWidth="15" fill="none"
                    strokeDasharray="440"
                    strokeDashoffset={440 - (440 * pendingPercentage) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-3xl font-bold text-primary">{Math.round(pendingPercentage)}%</span>
                <span className="text-xs text-gray-400 font-medium uppercase mt-1">Confirmed</span>
            </div>
        </div>

        <div className="mt-8 text-center space-y-2 w-full">
            <p className="text-gray-400 text-xs text-center w-full">Based on total booking volume</p>
            <button
                onClick={onCheck}
                className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all w-full"
            >
                Review Bookings
            </button>
        </div>
    </div>
);

const WaveChart = () => (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-80 flex flex-col overflow-hidden relative">
        <div className="flex justify-between items-center mb-4 z-10">
            <div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    <span className="text-xs font-bold text-gray-500">Site Traffic</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                    <span className="text-xs font-bold text-gray-500">Unique Visitors</span>
                </div>
            </div>
            <MoreHorizontal size={20} className="text-gray-400" />
        </div>

        {/* SVG Wave */}
        <div className="absolute bottom-0 left-0 right-0 h-40">
            <svg viewBox="0 0 1440 320" className="w-full h-full" preserveAspectRatio="none">
                <path fill="#9333EA" fillOpacity="0.2" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                <path fill="#2E1065" fillOpacity="0.8" d="M0,160L48,170.7C96,181,192,203,288,202.7C384,203,480,181,576,165.3C672,149,768,139,864,154.7C960,171,1056,213,1152,218.7C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
        </div>
    </div>
);

const SimpleCalendar = ({ bookings = [] }: { bookings?: any[] }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // 0-indexed
    const today = new Date();

    // Get first day of month and number of days
    const firstDay = new Date(currentYear, currentMonth, 1).getDay(); // 0 (Sun) - 6 (Sat)
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Generate calendar grid
    const days = [];
    // Padding for prev month
    for (let i = 0; i < firstDay; i++) {
        days.push({ num: '', type: 'empty' });
    }
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
        days.push({ num: i, type: 'current' });
    }
    // Remaining cells to fill 6 rows (42 cells)
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
        days.push({ num: i, type: 'next' });
    }

    const isSameDay = (date1: Date, date2: Date) => {
        return date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear();
    };

    const getBookingCount = (day: number) => {
        if (!bookings) return 0;
        const targetDate = new Date(currentYear, currentMonth, day);
        return bookings.filter(b => {
            const bDate = new Date(b.eventDate || b.date);
            return isSameDay(bDate, targetDate);
        }).length;
    };

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-80 flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <div className="font-bold text-gray-800 text-sm flex items-center gap-2">
                    <CalendarIcon size={16} className="text-primary" />
                    {currentDate.toLocaleString('default', { month: 'long' })} {currentYear}
                </div>
                <div className="flex gap-1">
                    <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                        <ChevronLeft size={18} />
                    </button>
                    <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wider">
                <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-700 flex-1">
                {days.map((d, i) => {
                    if (d.type === 'empty' || d.type === 'next') {
                        return <div key={i} className="flex items-center justify-center text-gray-200">{d.num}</div>
                    }

                    const bookingCount = getBookingCount(d.num as number);
                    const isToday = d.num === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();

                    return (
                        <div key={i} className="relative flex flex-col items-center justify-center p-1">
                            <div className={`w-8 h-8 flex items-center justify-center rounded-full transition-all
                                ${isToday ? "bg-secondary text-white font-bold shadow-md" :
                                    bookingCount > 0 ? "bg-purple-50 text-primary font-bold border border-purple-100" : "hover:bg-gray-50 text-gray-600"}
                            `}
                                title={bookingCount > 0 ? `${bookingCount} Bookings` : ''}
                            >
                                {d.num}
                            </div>
                            {bookingCount > 0 && !isToday && (
                                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-primary"></span>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mt-2 flex items-center justify-end gap-3 text-[10px] text-gray-400">
                <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Today
                </div>
                <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Event
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch real data
                const [bookingsData, packagesData] = await Promise.all([
                    getBookings(),
                    getDBPackages()
                ]);

                // Calculate Revenue and Status Stats
                let totalRevenue = 0;
                let confirmedCount = 0;
                let pendingCount = 0;
                const monthlyRevenue = new Array(12).fill(0);

                if (Array.isArray(bookingsData)) {
                    bookingsData.forEach((b: any) => {
                        // Status Stats
                        if (["Confirmed", "Approved", "Paid"].includes(b.status)) {
                            confirmedCount++;
                            // Add to total revenue
                            const amount = Number(b.totalAmount) || 0;
                            totalRevenue += amount;

                            // Add to monthly revenue
                            const date = new Date(b.createdAt || b.date);
                            if (!isNaN(date.getTime())) {
                                const month = date.getMonth(); // 0-11
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

    return (
        <div className="space-y-6">
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Earning"
                    value={`GH₵${stats.revenue.toLocaleString()}`}
                    icon={DollarSign}
                    isPrimary={true}
                    subtext="Total Revenue"
                />
                <StatCard
                    title="Bookings"
                    value={stats.bookings}
                    icon={Share2}
                    subtext="Total orders"
                />
                <StatCard
                    title="Services"
                    value={stats.activePackages}
                    icon={ThumbsUp}
                    subtext="Active Offerings"
                />
                <StatCard
                    title="Pending"
                    value={stats.pending}
                    icon={Star}
                    subtext="Needs Attention"
                />
            </div>

            {/* Middle Section: Bar Chart & Donut */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[400px]">
                {/* Bar Chart - Spans 2 Cols */}
                <div className="lg:col-span-2 h-[350px] lg:h-full">
                    <BarChart monthlyData={stats.monthlyRevenue} onCheck={() => router.push('/admin/bookings')} />
                </div>
                {/* Donut Chart - Spans 1 Col */}
                <div className="h-[350px] lg:h-full">
                    <DonutChart pendingPercentage={stats.confirmedPercentage} onCheck={() => router.push('/admin/bookings')} />
                </div>
            </div>

            {/* Bottom Section: Wave Graph & Calendar */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WaveChart />
                <SimpleCalendar bookings={allBookings} />
            </div>
        </div>
    );
}
