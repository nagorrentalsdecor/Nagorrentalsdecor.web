"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard, Package, ShoppingBag, Calendar, Settings,
    LogOut, Mail, Menu, Bell, MapPin, BarChart2, User,
    ChevronDown, MessageCircle, FileText, Search, Plus, Download
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter as useNavigationRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// --- Notification Component ---
function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState<any[]>([]);
    const bellRef = useRef<HTMLDivElement>(null);
    const router = useNavigationRouter();

    useEffect(() => {
        const fetchUnread = async () => {
            try {
                const res = await fetch('/api/messages');
                if (res.ok) {
                    const msgs = await res.json();
                    const unread = msgs.filter((m: any) => !m.isRead);
                    setNotifications(unread.slice(0, 5));
                    setUnreadCount(unread.length);
                }
            } catch (e) { console.error(e); }
        };
        fetchUnread();

        const handleClickOutside = (event: MouseEvent) => {
            if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("messageRead", fetchUnread);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("messageRead", fetchUnread);
        };
    }, []);

    return (
        <div className="relative" ref={bellRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative text-slate-500 hover:text-primary transition-all duration-300 p-2.5 hover:bg-primary/5 rounded-xl outline-none group"
            >
                <Bell size={20} className="group-hover:rotate-12 transition-transform" />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold text-white animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-3 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/50 z-50 overflow-hidden animate-fade-in-up ring-1 ring-black/5">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <span className="font-bold text-slate-800 text-sm">Notifications</span>
                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-wider">{unreadCount} New</span>
                    </div>

                    <div className="max-h-[300px] overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-10 text-center text-slate-400">
                                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Bell size={24} className="opacity-20" />
                                </div>
                                <p className="text-sm font-medium">All caught up!</p>
                                <p className="text-xs">No new notifications for you.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-50">
                                {notifications.map((msg, i) => (
                                    <div
                                        key={i}
                                        onClick={() => { router.push('/admin/messages'); setIsOpen(false); }}
                                        className="p-4 hover:bg-primary/5 cursor-pointer transition-colors block group"
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-bold text-xs text-slate-800 group-hover:text-primary transition-colors truncate max-w-[150px]">{msg.name}</span>
                                            <span className="text-[10px] text-slate-400 font-medium">
                                                {new Date(msg.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 line-clamp-2 group-hover:text-slate-600">{msg.message || msg.subject}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="p-3 bg-slate-50/80 border-t border-slate-100 text-center">
                        <Link href="/admin/messages" className="text-xs font-bold text-primary hover:text-primary-hover transition-colors inline-flex items-center gap-1" onClick={() => setIsOpen(false)}>
                            View All Messages
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = (e: any) => {
            const target = e.target as HTMLElement;
            setScrolled(target.scrollTop > 10);
        };
        const mainElement = document.getElementById("main-content-area");
        if (mainElement) {
            mainElement.addEventListener("scroll", handleScroll);
        }
        return () => mainElement?.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const [user, setUser] = useState({ name: "Admin", email: "admin@nagor.com", role: "Admin" });

    useEffect(() => {
        if (pathname === "/admin/login") return;
        const session = localStorage.getItem("nagor_admin_session");
        if (!session) {
            window.location.href = "/admin/login";
        } else {
            const email = localStorage.getItem("nagor_admin_email") || "admin@nagor.com";
            const role = localStorage.getItem("nagor_user_role") || "Admin";
            const derivedName = email.split('@')[0].replace(/[._]/g, ' ');
            setUser({ name: derivedName, email, role });
        }
    }, [pathname]);

    const allLinks = [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Services", href: "/admin/services", icon: Package },
        { name: "Messages", href: "/admin/messages", icon: Mail },
        { name: "Testimonials", href: "/admin/testimonials", icon: MessageCircle },
        { name: "Content", href: "/admin/content", icon: FileText },
        { name: "Sales", href: "/admin/sales", icon: BarChart2 },
        { name: "Bookings", href: "/admin/bookings", icon: Calendar },
        { name: "Inventory", href: "/admin/inventory", icon: ShoppingBag },
        { name: "Settings", href: "/admin/settings", icon: Settings },
    ];

    const links = user.role === 'Editor'
        ? allLinks.filter(l => ["Messages", "Testimonials", "Content"].includes(l.name))
        : allLinks;

    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-800 overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`fixed md:sticky top-0 left-0 w-80 h-full z-40 transition-all duration-500 ease-in-out
                ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
                bg-gradient-to-br from-[#6B21A8] via-[#4C1D95] to-[#2E1065] text-white flex flex-col shadow-2xl overflow-y-auto scrollbar-none border-r border-[#581C87]/30`}
            >
                {/* Brand Logo */}
                <div className="p-10 flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-[1.25rem] flex items-center justify-center shadow-xl border border-white/20 transition-transform duration-500 hover:rotate-6">
                        <Package className="text-white" size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-white font-heading leading-none">Nagor Rentals</h1>
                        <p className="text-[11px] text-purple-200/60 font-medium mt-1 uppercase tracking-widest">Administrator</p>
                    </div>
                </div>

                {/* Main Menu Label */}
                <div className="px-10 mb-4 mt-4">
                    <span className="text-[11px] font-bold text-purple-200/40 uppercase tracking-[0.2em]">Management</span>
                </div>

                {/* Navigation */}
                <nav className="px-5 space-y-1.5 flex-1 mb-8">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;

                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center px-6 py-4 rounded-[1.25rem] transition-all duration-300 group relative overflow-hidden ${isActive
                                    ? "text-white bg-white/10 backdrop-blur-md shadow-lg border border-white/10"
                                    : "text-purple-100/60 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                <div className={`w-8 flex justify-center mr-3 z-10 transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-white" : "text-purple-200/50 group-hover:text-white"}`}>
                                    <Icon size={20} />
                                </div>
                                <span className={`text-sm z-10 tracking-tight ${isActive ? "font-bold" : "font-medium"}`}>{link.name}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="active-pill"
                                        className="absolute left-0 w-1 h-6 bg-white rounded-r-full shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                                    ></motion.div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="px-8 mb-10 mt-auto">
                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-[2rem] border border-white/10 relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-[11px] text-white font-bold flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                                System Active
                            </div>
                            <span className="text-[11px] font-bold text-purple-200/60 font-mono tracking-tighter">SECURED</span>
                        </div>
                        <div className="mt-5 pt-5 border-t border-white/10 flex items-center justify-between">
                            <span className="text-[11px] text-purple-100/60 font-medium">Nagor Cloud v1.2</span>
                            <div className="flex -space-x-1.5">
                                <div className="w-6 h-6 rounded-lg border border-white/10 bg-white/10 backdrop-blur-md flex items-center justify-center text-[8px] font-bold text-white shadow-sm">GH</div>
                                <div className="w-6 h-6 rounded-lg border border-white/10 bg-white flex items-center justify-center text-[8px] font-bold text-primary shadow-sm">PRO</div>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/60 z-30 md:hidden backdrop-blur-md transition-opacity duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto h-screen">
                {/* Modern Header */}
                <header className={`min-h-[5.5rem] flex items-center justify-between px-6 md:px-10 relative z-30 transition-all duration-300 ${scrolled ? "bg-white/80 backdrop-blur-xl shadow-lg shadow-slate-200/50 py-4" : "bg-transparent py-6"
                    }`}>
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="md:hidden text-slate-500 hover:text-slate-900 transition-all p-3 hover:bg-white rounded-2xl shadow-sm border border-slate-100"
                        >
                            <Menu size={24} />
                        </button>

                        <div className="hidden lg:flex items-center gap-2 text-sm font-medium text-slate-400">
                            <Link href="/admin/dashboard" className="hover:text-primary transition-colors">Nagor</Link>
                            <span className="text-slate-300">/</span>
                            <span className="text-slate-800 font-bold capitalize">
                                {links.find(l => l.href === pathname)?.name || "Overview"}
                            </span>
                        </div>

                        <div className="md:hidden">
                            <h2 className="text-xl font-bold text-slate-800 tracking-tight capitalize">
                                {links.find(l => l.href === pathname)?.name || "Nagor"}
                            </h2>
                        </div>
                    </div>


                    <div className="flex items-center gap-2 md:gap-4">


                        <NotificationBell />

                        <Link
                            href="/admin/settings"
                            className="relative text-slate-500 hover:text-primary transition-all duration-300 p-2.5 hover:bg-primary/5 rounded-xl outline-none group hidden sm:block"
                        >
                            <Settings size={20} className="group-hover:rotate-45 transition-transform" />
                        </Link>

                        <div className="relative" ref={profileRef}>
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 font-bold text-xs cursor-pointer hover:border-primary/30 transition-all overflow-hidden group shadow-sm bg-gradient-to-br from-slate-50 to-slate-200"
                            >
                                <span className="group-hover:text-primary transition-colors">{user.name.substring(0, 2).toUpperCase()}</span>
                            </button>

                            {/* Profile Popover Moved to Header */}
                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute top-full right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 py-2"
                                    >
                                        <div className="px-5 py-4 border-b border-slate-50 mb-1">
                                            <p className="text-xs font-bold text-slate-900 capitalize">{user.name}</p>
                                            <p className="text-[10px] text-slate-400 font-medium truncate">{user.email}</p>
                                        </div>
                                        <Link
                                            href="/admin/settings"
                                            onClick={() => setIsProfileOpen(false)}
                                            className="w-full text-left px-5 py-3 hover:bg-purple-50 text-xs font-bold flex items-center gap-3 transition-colors text-slate-700"
                                        >
                                            <User size={16} className="text-primary" />
                                            Account Settings
                                        </Link>
                                        <button
                                            onClick={() => {
                                                localStorage.removeItem("nagor_admin_session");
                                                localStorage.removeItem("nagor_admin_email");
                                                localStorage.removeItem("nagor_user_role");
                                                window.location.href = "/admin/login";
                                            }}
                                            className="w-full text-left px-5 py-3 hover:bg-rose-50 text-xs font-bold flex items-center gap-3 transition-colors text-rose-600 border-t border-slate-50 mt-1"
                                        >
                                            <LogOut size={16} />
                                            Sign Out
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                {/* Page Content Area */}
                <main
                    id="main-content-area"
                    className="flex-1 p-6 md:p-10 relative"
                >
                    {/* Welcome Header (Optional, could be conditional) */}
                    <div className="mb-10 animate-fade-in-up">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            <span className="capitalize">{links.find(l => l.href === pathname)?.name || "Overview"}</span>
                            {pathname === "/admin/dashboard" && <span className="text-primary text-sm font-bold bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest">Live</span>}
                        </h1>
                        <p className="text-slate-500 mt-2 font-medium">Welcome back, {user.name.split(' ')[0]}! Here's what's happening today.</p>
                    </div>

                    <div className="relative z-10 min-h-full">
                        {children}
                    </div>

                    {/* Background Decorative Elements */}
                    <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 -mr-64 -mt-64"></div>
                    <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 -ml-64 -mb-64"></div>
                </main>
            </div>
        </div>
    );
}
