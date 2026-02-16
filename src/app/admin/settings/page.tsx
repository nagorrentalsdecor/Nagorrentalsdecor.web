"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Save, Bell, Globe, Lock, Loader2, Smartphone, User, Plus, Trash2, Key, X, Copy, Edit2, Shield, Settings, Server, Users, AlertTriangle, CheckCircle, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { getSettings, updateSettings } from "@/lib/api";
import * as XLSX from "xlsx";

export default function SettingsPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [settings, setSettings] = useState<any>({
        siteName: "",
        contactEmail: "",
        notifyEmail: true,
        notifyWhatsapp: false,
        notifyDaily: true,
        adminPassword: ""
    });
    const [users, setUsers] = useState<any[]>([]);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [newUserStart, setNewUserStart] = useState({ name: "", email: "", role: "Editor" });
    const [editingUser, setEditingUser] = useState<any>(null);
    const [createdUserPassword, setCreatedUserPassword] = useState<string | null>(null);
    const [resetUserPassword, setResetUserPassword] = useState<{ name: string, password: string } | null>(null);
    const [userRole, setUserRole] = useState("Editor");

    useEffect(() => {
        loadData();
        const storedRole = localStorage.getItem("nagor_user_role") || "Editor";
        setUserRole(storedRole);
    }, []);

    const handleBackup = async () => {
        try {
            const res = await fetch('/api/admin/backup');
            const data = await res.json();

            // Create a new workbook
            const wb = XLSX.utils.book_new();

            // Add Inventory Sheet
            if (data.items) {
                const itemsData = data.items.map((it: any) => ({
                    ID: it._id || it.id,
                    Name: it.name,
                    Category: it.category,
                    PricePerDay: it.pricePerDay,
                    Quantity: it.quantity,
                    CreatedAt: it.createdAt
                }));
                const wsItems = XLSX.utils.json_to_sheet(itemsData);
                XLSX.utils.book_append_sheet(wb, wsItems, "Inventory");
            }

            // Add Bookings Sheet
            if (data.bookings) {
                const bookingsData = data.bookings.map((b: any) => ({
                    ID: b._id || b.id,
                    Customer: b.customerName,
                    Phone: b.customerPhone,
                    Email: b.customerEmail,
                    Date: b.date,
                    ReturnDate: b.returnDate,
                    Status: b.status,
                    Total: b.total,
                    Items: (b.items || []).map((i: any) => `${i.name} (${i.quantity})`).join(", ")
                }));
                const wsBookings = XLSX.utils.json_to_sheet(bookingsData);
                XLSX.utils.book_append_sheet(wb, wsBookings, "Bookings");
            }

            // Add Services Sheet
            if (data.packages) {
                const packagesData = data.packages.map((p: any) => ({
                    ID: p._id || p.id,
                    Name: p.name,
                    Description: p.description,
                    Price: p.price
                }));
                const wsPackages = XLSX.utils.json_to_sheet(packagesData);
                XLSX.utils.book_append_sheet(wb, wsPackages, "Services");
            }

            // Trigger download
            XLSX.writeFile(wb, `nagor_system_backup_${new Date().toISOString().split('T')[0]}.xlsx`);

        } catch (e) {
            console.error(e);
            alert("Backup failed");
        }
    };

    const handleRestore = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!confirm("RESTORE ACTION: This will overwrite CURRENT data with the backup file. Proceed?")) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                let backupData: any = {};

                if (file.name.endsWith('.xlsx')) {
                    const data = new Uint8Array(event.target?.result as ArrayBuffer);
                    const workbook = XLSX.read(data, { type: 'array' });

                    // Parse Inventory
                    if (workbook.Sheets["Inventory"]) {
                        backupData.items = XLSX.utils.sheet_to_json(workbook.Sheets["Inventory"]).map((it: any) => ({
                            _id: it.ID,
                            name: it.Name,
                            category: it.Category,
                            pricePerDay: it.PricePerDay,
                            quantity: it.Quantity,
                            createdAt: it.CreatedAt,
                            images: ["/images/chair-gold.png"] // Default placeholder as images aren't in Excel
                        }));
                    }

                    // Parse Bookings
                    if (workbook.Sheets["Bookings"]) {
                        backupData.bookings = XLSX.utils.sheet_to_json(workbook.Sheets["Bookings"]).map((b: any) => {
                            const itemsStr = b.Items || "";
                            const parsedItems = itemsStr.split(", ").filter(Boolean).map((s: string) => {
                                const match = s.match(/(.*) \((\d+)\)/);
                                return match ? { name: match[1], quantity: Number(match[2]) } : { name: s, quantity: 1 };
                            });

                            return {
                                _id: b.ID,
                                customerName: b.Customer,
                                customerPhone: b.Phone,
                                customerEmail: b.Email,
                                date: b.Date,
                                returnDate: b.ReturnDate,
                                status: b.Status,
                                total: b.Total,
                                items: parsedItems
                            };
                        });
                    }

                    // Parse Services
                    if (workbook.Sheets["Services"]) {
                        backupData.packages = XLSX.utils.sheet_to_json(workbook.Sheets["Services"]).map((p: any) => ({
                            _id: p.ID,
                            name: p.Name,
                            description: p.Description,
                            price: p.Price,
                            images: ["/images/wedding.png"]
                        }));
                    }
                } else {
                    backupData = JSON.parse(event.target?.result as string);
                }

                if (!backupData.items || !backupData.bookings) {
                    throw new Error("Invalid backup structure");
                }

                const res = await fetch('/api/admin/backup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(backupData)
                });

                if (res.ok) {
                    alert("System restored successfully from " + (file.name.endsWith('.xlsx') ? "Excel" : "JSON") + "!");
                    window.location.reload();
                } else {
                    const err = await res.json();
                    alert("Restore failed: " + err.error);
                }
            } catch (e) {
                console.error(e);
                alert("Invalid file format or structure. Please use a valid Nagor backup file.");
            }
        };

        if (file.name.endsWith('.xlsx')) {
            reader.readAsArrayBuffer(file);
        } else {
            reader.readAsText(file);
        }
    };

    const loadData = async () => {
        try {
            const [settingsData, usersData] = await Promise.all([
                getSettings(),
                fetch('/api/users').then(res => res.json())
            ]);
            setSettings(settingsData);
            setUsers(usersData);
        } catch (e) {
            console.error(e);
        }
    };

    const handleChange = (key: string, value: any) => {
        setSettings((prev: any) => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            await updateSettings(settings);
            // Show success toast or notification
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

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
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm shadow-slate-200/50">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner">
                        <Settings size={28} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Settings Hub</h2>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-widest mt-0.5">Manage your website configurations and team</p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex items-center px-8 py-4 bg-primary text-white rounded-2xl font-bold text-xs hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
                >
                    {isLoading ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Save size={16} className="mr-2" />}
                    {isLoading ? "Saving..." : "Save All Changes"}
                </button>
            </div>

            {/* Governance Section (Super Admin Only) */}
            {userRole === 'Super Admin' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in-up">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-6 group hover:border-primary/20 transition-all">
                        <div className="w-16 h-16 bg-blue-500/10 rounded-[2rem] flex items-center justify-center text-blue-600 transition-transform group-hover:scale-110">
                            <Server size={32} />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-lg font-bold text-slate-900 leading-none">Database Backup</h3>
                            <p className="text-sm text-slate-500 mt-2 font-medium">Export all system data to a secure file.</p>
                        </div>
                        <button
                            onClick={handleBackup}
                            className="px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-lg flex items-center"
                        >
                            <Download size={14} className="mr-2" />
                            Download Excel Backup
                        </button>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-6 group hover:border-amber/20 transition-all">
                        <div className="w-16 h-16 bg-amber-500/10 rounded-[2rem] flex items-center justify-center text-amber-600 transition-transform group-hover:scale-110">
                            <Globe size={32} />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-lg font-bold text-slate-900 leading-none">Restore Data</h3>
                            <p className="text-sm text-slate-500 mt-2 font-medium">Import data from a previously saved backup.</p>
                        </div>
                        <div className="relative">
                            <input
                                type="file"
                                accept=".json,.xlsx"
                                onChange={handleRestore}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                title="Upload backup file"
                            />
                            <button
                                className="px-6 py-3 bg-slate-100 text-slate-900 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all border border-slate-200"
                            >
                                Upload & Restore
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column: Core Identity & Security */}
                <div className="lg:col-span-2 space-y-10">
                    {/* General Settings */}
                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm shadow-slate-200/50 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 text-primary/5 group-hover:scale-110 transition-transform duration-700">
                            <Globe size={120} />
                        </div>
                        <div className="flex items-center gap-4 mb-10 relative z-10">
                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                                <Plus size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Site Branding</h3>
                                <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mt-0.5">Control your business identity</p>
                            </div>
                        </div>

                        <div className="space-y-8 relative z-10">
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Website Name</label>
                                <input
                                    type="text"
                                    value={settings.siteName || ""}
                                    onChange={(e) => handleChange("siteName", e.target.value)}
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-primary/30 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold text-slate-900"
                                    placeholder="NAGOR RENTAL & DECOR"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">System Contact Email</label>
                                <input
                                    type="email"
                                    value={settings.contactEmail || ""}
                                    onChange={(e) => handleChange("contactEmail", e.target.value)}
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-primary/30 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold text-slate-900"
                                    placeholder="info@nagor.com"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Security Settings */}
                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm shadow-slate-200/50 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 text-rose-500/5 group-hover:rotate-12 transition-transform duration-700">
                            <Shield size={120} />
                        </div>
                        <div className="flex items-center gap-4 mb-10 relative z-10">
                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                                <Lock size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Security Access</h3>
                                <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mt-0.5">Manage administrative credentials</p>
                            </div>
                        </div>
                        <div className="space-y-3 relative z-10">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Change Admin Password</label>
                            <input
                                type="password"
                                value={settings.adminPassword || ""}
                                onChange={(e) => handleChange("adminPassword", e.target.value)}
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-primary/30 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold text-slate-900"
                                placeholder="Enter new password"
                            />
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 px-1 flex items-center">
                                <AlertTriangle size={12} className="mr-2 text-amber-500" />
                                Leave blank to keep current password
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Protocols */}
                <div className="space-y-10">
                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm shadow-slate-200/50">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                                <Bell size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Notifications</h3>
                                <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mt-0.5">Manage how you get alerts</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {[
                                { id: "notifyEmail", label: "Email Alerts", icon: Globe, color: "text-blue-500", bg: "bg-blue-500/10" },
                                { id: "notifyWhatsapp", label: "WhatsApp Alerts", icon: Smartphone, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                            ].map((protocol) => (
                                <div key={protocol.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-3xl border border-slate-100 transition-all hover:bg-white group/toggle">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${protocol.color} ${protocol.bg} transition-transform group-hover/toggle:scale-110`}>
                                            <protocol.icon size={18} />
                                        </div>
                                        <span className="text-xs font-bold text-slate-900 uppercase tracking-tight">{protocol.label}</span>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={settings[protocol.id] || false} onChange={(e) => handleChange(protocol.id, e.target.checked)} />
                                        <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary border border-slate-100"></div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-rose-50/50 p-10 rounded-[2.5rem] border border-rose-100 shadow-sm">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-600">
                                <AlertTriangle size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-rose-900 uppercase tracking-tight">System Reset</h3>
                                <p className="text-xs font-medium text-rose-500 uppercase tracking-widest mt-0.5">Danger zone</p>
                            </div>
                        </div>
                        <p className="text-[11px] text-rose-600 font-bold mb-8 leading-relaxed">Wipe all inventory and bookings data. This action is irreversible.</p>
                        <button
                            onClick={async () => {
                                if (confirm("ARE YOU SURE? THIS WILL DELETE EVERYTHING.")) {
                                    setIsLoading(true);
                                    await fetch('/api/admin/reset', { method: 'DELETE' });
                                    window.location.reload();
                                }
                            }}
                            className="w-full py-4 bg-rose-600 text-white font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-rose-700 shadow-xl shadow-rose-200 transition-all active:scale-95"
                        >
                            Reset System Data
                        </button>
                    </div>
                </div>
            </div>

            {/* Team Management */}
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm shadow-slate-200/50 overflow-hidden relative">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600">
                            <Users size={28} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 tracking-tight uppercase">User Management</h2>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">Assign roles and access levels</p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            setEditingUser(null);
                            setCreatedUserPassword(null);
                            setNewUserStart({ name: "", email: "", role: "Editor" });
                            setIsUserModalOpen(true);
                        }}
                        className="flex items-center px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs hover:bg-slate-800 shadow-xl transition-all active:scale-95"
                    >
                        <Plus size={18} className="mr-2" />
                        Add New User
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-6 text-xs font-bold text-slate-500 uppercase tracking-wider">User Name</th>
                                <th className="px-6 py-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Role / Clearance</th>
                                <th className="px-6 py-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                                <th className="px-8 py-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {users.map((user: any) => {
                                const isSuperAdmin = user.role === 'Super Admin';
                                return (
                                    <tr key={user._id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs shadow-inner transition-transform group-hover:scale-110 ${isSuperAdmin ? "bg-primary text-white" : "bg-slate-100 text-slate-400"}`}>
                                                    {user.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900 tracking-tight">{user.name}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-center">
                                            <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm ${isSuperAdmin ? "bg-primary/10 text-primary border-primary/20" :
                                                user.role === 'Admin' ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
                                                    "bg-slate-100 text-slate-600 border-slate-200"
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6 text-center">
                                            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></span>
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            {!isSuperAdmin && (
                                                <div className="flex justify-end gap-2 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                                                    <button
                                                        onClick={() => {
                                                            setEditingUser(user);
                                                            setNewUserStart({ name: user.name, email: user.email, role: user.role });
                                                            setIsUserModalOpen(true);
                                                        }}
                                                        className="p-3 bg-white text-slate-500 hover:text-primary hover:bg-slate-50 rounded-2xl shadow-xl transition-all active:scale-90 border border-slate-100"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={async () => {
                                                            if (!confirm("Reset security cipher for " + user.name + "?")) return;
                                                            const newPass = Math.random().toString(36).slice(-8);
                                                            await fetch(`/api/users/${user._id}`, {
                                                                method: 'PUT',
                                                                body: JSON.stringify({ resetPassword: true, newPassword: newPass })
                                                            });
                                                            setResetUserPassword({ name: user.name, password: newPass });
                                                            loadData();
                                                        }}
                                                        className="p-3 bg-white text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-2xl shadow-xl transition-all active:scale-90 border border-slate-100"
                                                    >
                                                        <Key size={16} />
                                                    </button>
                                                    <button
                                                        onClick={async () => {
                                                            if (!confirm("Decomission operator entity?")) return;
                                                            await fetch(`/api/users/${user._id}`, { method: 'DELETE' });
                                                            loadData();
                                                        }}
                                                        className="p-3 bg-white text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-2xl shadow-xl transition-all active:scale-90 border border-slate-100"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {isUserModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsUserModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl" />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 30 }} className="bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl relative border border-slate-100">
                            <div className="flex justify-between items-center mb-10 border-b border-slate-50 pb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                        <User size={28} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{editingUser ? "Refine Operator" : "Initialize Entity"}</h2>
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Personnel Authorization Sys</p>
                                    </div>
                                </div>
                                <button onClick={() => { setIsUserModalOpen(false); setEditingUser(null); }} className="p-3 rounded-2xl hover:bg-slate-50 text-slate-300 hover:text-slate-900 transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            {!createdUserPassword ? (
                                <form className="space-y-8" onSubmit={async (e) => {
                                    e.preventDefault();
                                    if (editingUser) {
                                        await fetch(`/api/users/${editingUser._id}`, {
                                            method: 'PUT',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify(newUserStart)
                                        });
                                        setIsUserModalOpen(false);
                                        setEditingUser(null);
                                        loadData();
                                    } else {
                                        const password = Math.random().toString(36).slice(-8) + "!";
                                        const res = await fetch('/api/users', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ ...newUserStart, password })
                                        });
                                        if (res.ok) {
                                            setCreatedUserPassword(password);
                                            loadData();
                                        }
                                    }
                                }}>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Entity Name</label>
                                            <input required value={newUserStart.name} onChange={e => setNewUserStart({ ...newUserStart, name: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-primary/30 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all text-sm font-black text-slate-900" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Identifier (Email)</label>
                                            <input required type="email" value={newUserStart.email} onChange={e => setNewUserStart({ ...newUserStart, email: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-primary/30 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all text-sm font-black text-slate-900" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Clearance Protocol</label>
                                            <select value={newUserStart.role} onChange={e => setNewUserStart({ ...newUserStart, role: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-primary/30 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all text-sm font-black text-slate-600 appearance-none cursor-pointer">
                                                <option value="Admin">Admin</option>
                                                <option value="Manager">Manager</option>
                                                <option value="Editor">Editor</option>
                                            </select>
                                        </div>
                                    </div>
                                    <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all active:scale-95">
                                        {editingUser ? "Sync Entity" : "Authorize Entity"}
                                    </button>
                                </form>
                            ) : (
                                <div className="text-center space-y-8">
                                    <div className="w-20 h-20 bg-emerald-500/10 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
                                        <CheckCircle size={40} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">Authorization Complete</h4>
                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2 px-4 leading-relaxed">Identity authorized. Copy temporary cipher below for first-time authentication.</p>
                                    </div>
                                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center justify-between group cursor-pointer hover:bg-white transition-all shadow-inner" onClick={() => navigator.clipboard.writeText(createdUserPassword)}>
                                        <code className="text-2xl font-black text-slate-900 tracking-[0.1em] font-mono">{createdUserPassword}</code>
                                        <Copy size={24} className="text-primary opacity-50 group-hover:opacity-100 transition-all" />
                                    </div>
                                    <button onClick={() => { setCreatedUserPassword(null); setIsUserModalOpen(false); }} className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-800 shadow-xl transition-all">Secure Portal</button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}

                {resetUserPassword && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setResetUserPassword(null)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl" />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 30 }} className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl relative text-center">
                            <div className="w-20 h-20 bg-amber-500/10 text-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                                <Key size={40} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Cipher Overwritten</h3>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-4 mb-8 leading-relaxed">Temporary security key for <strong className="text-slate-900">{resetUserPassword.name}</strong> has been generated.</p>
                            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center justify-between mb-8 group cursor-pointer" onClick={() => navigator.clipboard.writeText(resetUserPassword.password)}>
                                <code className="text-2xl font-black text-slate-900 tracking-[0.1em] font-mono">{resetUserPassword.password}</code>
                                <Copy size={24} className="text-primary opacity-50 group-hover:opacity-100 transition-all" />
                            </div>
                            <button onClick={() => setResetUserPassword(null)} className="w-full bg-slate-100 text-slate-600 py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-200 transition-all">Secure Entry</button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
