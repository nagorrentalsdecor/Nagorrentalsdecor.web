"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, Calendar, Settings, LogOut, Mail, Menu, Bell, MapPin, BarChart2, User, ChevronDown, MessageCircle, FileText } from "lucide-react";
import { useState, useEffect, useRef } from "react";

import { useRouter as useNavigationRouter } from "next/navigation";

// --- Notification Component ---
function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState<any[]>([]);
    const bellRef = useRef<HTMLDivElement>(null);
    const router = useNavigationRouter(); // Get router

    useEffect(() => {
        const fetchUnread = async () => {
            // Mock fetch or real fetch
            try {
                // Fetch bookings or messages to count as notifications
                // For now, simulate functionality or fetch real messages
                const res = await fetch('/api/messages');
                if (res.ok) {
                    const msgs = await res.json();
                    const unread = msgs.filter((m: any) => !m.isRead);
                    setNotifications(unread.slice(0, 5)); // Show top 5
                    setUnreadCount(unread.length);
                }
            } catch (e) { console.error(e); }
        };
        fetchUnread();

        // Close on click outside
        const handleClickOutside = (event: MouseEvent) => {
            if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        // Listen for updates from other components
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
                className="relative text-gray-400 hover:text-[#0F172A] transition-colors p-2 hover:bg-gray-50 rounded-full outline-none"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold text-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-fade-in-up">
                    <div className="p-4 border-b border-gray-50 flex justify-between items-center">
                        <span className="font-bold text-gray-800 text-sm">Notifications</span>
                        <span className="text-xs text-primary font-medium">{unreadCount} unread</span>
                    </div>

                    <div className="max-h-[300px] overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-400 text-sm">
                                <Bell size={24} className="mx-auto mb-2 opacity-20" />
                                No new notifications
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {notifications.map((msg, i) => (
                                    <div
                                        key={i}
                                        onClick={() => router.push('/admin/messages')}
                                        className="p-4 hover:bg-gray-50 cursor-pointer transition-colors block"
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-bold text-xs text-secondary truncate max-w-[150px]">{msg.name}</span>
                                            <span className="text-[10px] text-gray-400">
                                                {new Date(msg.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 line-clamp-2">{msg.message || msg.subject}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
                        <Link href="/admin/messages" className="text-xs font-bold text-primary hover:text-primary-dark">
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
    const profileRef = useRef<HTMLDivElement>(null);

    // Close profile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Auth Protection
    const [user, setUser] = useState({ name: "User", email: "", role: "Admin" });

    // Auth Protection & User Load
    useEffect(() => {
        if (pathname === "/admin/login") return;
        const session = localStorage.getItem("nagor_admin_session");
        if (!session) {
            window.location.href = "/admin/login";
        } else {
            const email = localStorage.getItem("nagor_admin_email") || "admin@nagor.com";
            // Mock name extraction or use saved name if available.
            // In a real app, we'd fetch full user profile here.
            const role = localStorage.getItem("nagor_user_role") || "Admin";
            // Simple name derivation or fallback
            const derivedName = email.split('@')[0].replace(/[._]/g, ' ');
            setUser({ name: derivedName, email, role });
        }
    }, [pathname]);

    const allLinks = [
        { name: "home", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "service", href: "/admin/services", icon: Package },
        { name: "messages", href: "/admin/messages", icon: Mail },
        { name: "testimonials", href: "/admin/testimonials", icon: MessageCircle },
        { name: "content", href: "/admin/content", icon: FileText },
        { name: "booking", href: "/admin/bookings", icon: Calendar },
        { name: "inventory", href: "/admin/inventory", icon: ShoppingBag },
        { name: "settings", href: "/admin/settings", icon: Settings },
    ];

    const links = user.role === 'Editor'
        ? allLinks.filter(l => ["messages", "testimonials", "content"].includes(l.name))
        : allLinks;

    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    return (
        <div className="flex h-screen bg-gray-50 font-sans text-slate-800">
            {/* Sidebar - Old Theme (Secondary Dark Blue + Gold Accents) */}
            <aside
                className={`fixed md:sticky top-0 left-0 w-64 h-full z-40 transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
                bg-secondary text-white flex flex-col shadow-2xl overflow-y-auto scrollbar-none border-r border-white/5`}
            >
                {/* Profile Section (Top) */}
                <div className="pt-12 pb-8 flex flex-col items-center border-b border-white/5 mx-6 relative z-50">
                    <div
                        ref={profileRef}
                        className="relative mb-4 group cursor-pointer"
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                    >
                        <div className="w-20 h-20 rounded-full bg-gradient-primary p-1 shadow-lg ring-4 ring-secondary/50 overflow-hidden transition-transform transform group-hover:scale-105">
                            {/* Initials or Image */}
                            <div className="w-full h-full bg-secondary flex items-center justify-center rounded-full">
                                <span className="text-primary font-bold text-2xl font-heading uppercase">{user.name.substring(0, 2)}</span>
                            </div>
                        </div>
                        <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-secondary"></div>

                        {/* Profile Dropdown */}
                        {isProfileOpen && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white text-gray-800 rounded-xl shadow-xl overflow-hidden z-50 animate-fade-in-up origin-top border border-gray-100">
                                <div className="p-3 border-b border-gray-100 bg-gray-50">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Account Actions</p>
                                </div>
                                <Link
                                    href="/admin/settings"
                                    onClick={() => { setIsProfileOpen(false); setIsMobileMenuOpen(false); }}
                                    className="w-full text-left px-4 py-3 text-gray-600 hover:bg-gray-50 text-sm font-medium flex items-center gap-2 transition-colors"
                                >
                                    <User size={16} />
                                    Profile
                                </Link>
                                <button
                                    onClick={() => {
                                        localStorage.removeItem("nagor_admin_session");
                                        localStorage.removeItem("nagor_admin_email");
                                        localStorage.removeItem("nagor_user_role");
                                        window.location.href = "/admin/login";
                                    }}
                                    className="w-full text-left px-4 py-3 text-red-500 hover:bg-red-50 text-sm font-medium flex items-center gap-2 transition-colors border-t border-gray-50"
                                >
                                    <LogOut size={16} />
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>

                    <div onClick={() => setIsProfileOpen(!isProfileOpen)} className="text-center cursor-pointer group px-2">
                        <h3 className="text-white font-heading font-bold text-lg tracking-wide uppercase group-hover:text-primary transition-colors truncate w-full">{user.name}</h3>
                        <p className="text-xs text-gray-400 font-light mt-1 truncate">{user.email}</p>
                    </div>
                </div>

                {/* Navigation (unchanged) */}
                <nav className="p-4 space-y-1 flex-1 mt-4">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;

                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${isActive
                                    ? "text-primary bg-white/5 shadow-inner"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-primary rounded-r-full"></div>
                                )}
                                <div className={`w-8 flex justify-center mr-3 z-10 transition-transform group-hover:scale-110 ${isActive ? "text-primary" : "text-gray-500 group-hover:text-white"}`}>
                                    <Icon size={20} className={isActive ? "fill-current opacity-20" : ""} />
                                </div>
                                <span className={`text-sm tracking-wide capitalize z-10 ${isActive ? "font-bold" : "font-medium"}`}>{link.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 mt-auto">
                    <div className="bg-gradient-to-br from-primary/10 to-transparent p-4 rounded-2xl border border-primary/20">
                        <p className="text-[10px] text-primary uppercase tracking-widest font-bold mb-2">System Status</p>
                        <div className="flex items-center gap-2 text-xs text-gray-300">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            Operational
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-50">
                {/* Header */}
                {/* Header */}
                <header className="h-20 flex items-center justify-between px-8 bg-white sticky top-0 z-20 shadow-sm border-b border-gray-100">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="md:hidden text-gray-500 hover:text-black transition-colors p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <Menu size={24} />
                        </button>
                        <h2 className="text-xl font-bold text-gray-800 tracking-tight capitalize">
                            {links.find(l => l.href === pathname)?.name || "Dashboard User"}
                        </h2>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Notification Bell */}
                        <NotificationBell />

                        <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-bold text-gray-800 capitalize">{user.name}</p>
                                <p className="text-[10px] text-gray-400 font-medium">{user.role}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden group cursor-pointer" onClick={() => setIsProfileOpen(true)}>
                                {/* Avatar */}
                                <div className="w-full h-full bg-secondary flex items-center justify-center text-primary font-bold text-xs ring-2 ring-transparent group-hover:ring-primary/50 transition-all uppercase">{user.name.substring(0, 2)}</div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-6 md:p-8 scroll-smooth">
                    {children}
                </main>
            </div>
        </div>
    );
}
