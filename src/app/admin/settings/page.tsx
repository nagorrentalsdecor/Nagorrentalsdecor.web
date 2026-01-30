"use client";

import { motion } from "framer-motion";
import { Save, Bell, Globe, Lock, Loader2, Smartphone, User, Plus, Trash2, Key, X, Copy, Edit2 } from "lucide-react";
import { useState, useEffect } from "react";
import { getSettings, updateSettings } from "@/lib/api";

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

    useEffect(() => {
        loadData();
    }, []);

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
            alert("Settings saved successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to save settings.");
        } finally {
            setIsLoading(false);
        }
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={container}
            className="max-w-5xl mx-auto"
        >
            <div className="mb-8">
                <h1 className="text-3xl font-heading font-bold text-gray-900">Settings</h1>
                <p className="text-gray-500 mt-2">Manage your system configurations and preferences.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: General & Security */}
                <div className="lg:col-span-2 space-y-8">
                    {/* General Settings */}
                    <motion.div variants={item} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center mb-6 text-[#101F3C]">
                            <Globe className="mr-3" size={24} />
                            <h3 className="text-xl font-bold">General Information</h3>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Site Name</label>
                                <input
                                    type="text"
                                    value={settings.siteName || ""}
                                    onChange={(e) => handleChange("siteName", e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    placeholder="e.g. Nagor Rental & Decor"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Contact Email</label>
                                <input
                                    type="email"
                                    value={settings.contactEmail || ""}
                                    onChange={(e) => handleChange("contactEmail", e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    placeholder="info@example.com"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Security */}
                    <motion.div variants={item} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center mb-6 text-[#101F3C]">
                            <Lock className="mr-3" size={24} />
                            <h3 className="text-xl font-bold">Security</h3>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Admin Password</label>
                                <input
                                    type="password"
                                    value={settings.adminPassword || ""}
                                    onChange={(e) => handleChange("adminPassword", e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    placeholder="Enter new password to change"
                                />
                                <p className="text-xs text-gray-400 mt-2">Leave blank to keep current password.</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right Column: Toggles */}
                <div className="space-y-8">
                    {/* Notifications */}
                    <motion.div variants={item} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center mb-6 text-[#101F3C]">
                            <Bell className="mr-3" size={24} />
                            <h3 className="text-xl font-bold">Notifications</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                        <Globe size={16} />
                                    </div>
                                    <span className="font-medium text-gray-700">Email Alerts</span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={settings.notifyEmail || false} onChange={(e) => handleChange("notifyEmail", e.target.checked)} />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                        <Smartphone size={16} />
                                    </div>
                                    <span className="font-medium text-gray-700">WhatsApp</span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={settings.notifyWhatsapp || false} onChange={(e) => handleChange("notifyWhatsapp", e.target.checked)} />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Team Management Section */}
            <motion.div variants={item} className="mt-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center text-[#101F3C]">
                        <div className="p-2 bg-blue-50 rounded-lg mr-3">
                            <User size={24} className="text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">User Access Control</h3>
                            <p className="text-sm text-gray-400">Manage who has access to the admin dashboard.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            setEditingUser(null);
                            setCreatedUserPassword(null);
                            setNewUserStart({ name: "", email: "", role: "Editor" });
                            setIsUserModalOpen(true);
                        }}
                        className="flex items-center px-4 py-2 bg-secondary text-white rounded-lg text-sm font-bold hover:bg-secondary/90 transition-colors shadow-lg shadow-secondary/20"
                    >
                        <Plus size={16} className="mr-2" />
                        Add New User
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        {/* ... table content remains same ... */}
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="pb-4 font-bold text-gray-400 text-xs uppercase tracking-wider pl-4">User</th>
                                <th className="pb-4 font-bold text-gray-400 text-xs uppercase tracking-wider">Role</th>
                                <th className="pb-4 font-bold text-gray-400 text-xs uppercase tracking-wider">Status</th>
                                <th className="pb-4 font-bold text-gray-400 text-xs uppercase tracking-wider text-right pr-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {users.map((user: any) => {
                                const isSuperAdmin = user.role === 'Super Admin';
                                return (
                                    <tr key={user._id} className="group hover:bg-gray-50 transition-colors">
                                        <td className="py-4 pl-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isSuperAdmin ? "bg-secondary text-white" : "bg-orange-100 text-orange-600"}`}>
                                                    {user.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-800 text-sm">{user.name}</p>
                                                    <p className="text-xs text-gray-400">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold border ${isSuperAdmin ? "bg-purple-50 text-purple-600 border-purple-100" :
                                                user.role === 'Admin' ? "bg-blue-50 text-blue-600 border-blue-100" :
                                                    "bg-gray-100 text-gray-600 border-gray-200"
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="py-4">
                                            <span className="flex items-center gap-2 text-xs font-bold text-green-600">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Active
                                            </span>
                                        </td>
                                        <td className="py-4 text-right pr-4">
                                            {/* Actions... */}
                                            <div className="flex items-center justify-end gap-2">
                                                {!isSuperAdmin && (
                                                    <>
                                                        <button
                                                            onClick={() => {
                                                                setEditingUser(user);
                                                                setNewUserStart({ name: user.name, email: user.email, role: user.role });
                                                                setIsUserModalOpen(true);
                                                            }}
                                                            className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-all"
                                                            title="Edit User"
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        {/* Rest of buttons */}
                                                        <button
                                                            onClick={async () => {
                                                                if (!confirm("Reset password for " + user.name + "?")) return;
                                                                const newPass = Math.random().toString(36).slice(-8);
                                                                await fetch(`/api/users/${user._id}`, {
                                                                    method: 'PUT',
                                                                    body: JSON.stringify({ resetPassword: true, newPassword: newPass })
                                                                });
                                                                setResetUserPassword({ name: user.name, password: newPass });
                                                                loadData();
                                                            }}
                                                            className="p-1.5 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded transition-all"
                                                            title="Reset Password"
                                                        >
                                                            <Key size={16} />
                                                        </button>
                                                        <button
                                                            onClick={async () => {
                                                                if (!confirm("Are you sure you want to delete this user?")) return;
                                                                await fetch(`/api/users/${user._id}`, { method: 'DELETE' });
                                                                loadData();
                                                            }}
                                                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-all"
                                                            title="Delete User"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* System Management */}
            <motion.div variants={item} className="mt-8 bg-red-50 p-8 rounded-2xl shadow-sm border border-red-100">
                <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center">
                    <Trash2 className="mr-2" /> Danger Zone
                </h3>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-bold text-red-800">Clear All Monitoring Data</p>
                        <p className="text-sm text-red-600">This will delete all bookings, sales history, and dashboard stats. Cannot be undone.</p>
                    </div>
                    <button
                        onClick={async () => {
                            if (confirm("WARNING: Are you sure you want to DELETE ALL DATA? This action cannot be undone.")) {
                                if (confirm("Please confirm again. Type 'DELETE' mentally and click OK.")) {
                                    setIsLoading(true);
                                    await fetch('/api/admin/reset', { method: 'DELETE' });
                                    alert("System data cleared.");
                                    window.location.reload();
                                }
                            }
                        }}
                        className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-lg shadow-red-200 transition-colors"
                    >
                        Reset System Data
                    </button>
                </div>
            </motion.div>

            {/* User Modal */}
            {isUserModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-fade-in-up">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-800">{editingUser ? "Edit User" : "Add New User"}</h3>
                            <button onClick={() => { setIsUserModalOpen(false); setEditingUser(null); }} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        {!createdUserPassword ? (
                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                if (editingUser) {
                                    const res = await fetch(`/api/users/${editingUser._id}`, {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify(newUserStart)
                                    });
                                    if (res.ok) {
                                        setIsUserModalOpen(false);
                                        setEditingUser(null);
                                        loadData();
                                    }
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
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                                        <input
                                            required
                                            value={newUserStart.name}
                                            onChange={e => setNewUserStart({ ...newUserStart, name: e.target.value })}
                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                                        <input
                                            required
                                            type="email"
                                            value={newUserStart.email}
                                            onChange={e => setNewUserStart({ ...newUserStart, email: e.target.value })}
                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Role</label>
                                        <select
                                            value={newUserStart.role}
                                            onChange={e => setNewUserStart({ ...newUserStart, role: e.target.value })}
                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        >
                                            <option value="Admin">Admin</option>
                                            <option value="Manager">Manager</option>
                                            <option value="Editor">Editor</option>
                                        </select>
                                    </div>
                                    <button type="submit" className="w-full bg-secondary text-white py-3 rounded-xl font-bold hover:bg-secondary/90 transition-colors mt-4">
                                        {editingUser ? "Update User" : "Create User"}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <Key size={32} />
                                </div>
                                <h4 className="text-lg font-bold text-gray-800">User Created Successfully!</h4>
                                <p className="text-sm text-gray-500">Please copy the temporary password below and share it with the user. They will be required to change it on first login.</p>

                                <div className="bg-gray-100 p-4 rounded-xl border border-gray-200 flex items-center justify-between mt-2">
                                    <code className="text-lg font-mono font-bold text-secondary">{createdUserPassword}</code>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(createdUserPassword)}
                                        className="text-gray-400 hover:text-gray-600 p-2"
                                        title="Copy to clipboard"
                                    >
                                        <Copy size={20} />
                                    </button>
                                </div>

                                <button
                                    onClick={() => { setCreatedUserPassword(null); setIsUserModalOpen(false); }}
                                    className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition-colors"
                                >
                                    Done
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Reset Password Modal */}
            {resetUserPassword && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-fade-in-up text-center">
                        <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Key size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Password Reset Successful</h3>
                        <p className="text-sm text-gray-500 mb-6">The password for <strong className="text-gray-800">{resetUserPassword.name}</strong> has been reset. Please share this new temporary password.</p>

                        <div className="bg-gray-100 p-4 rounded-xl border border-gray-200 flex items-center justify-between mb-6">
                            <code className="text-lg font-mono font-bold text-secondary">{resetUserPassword.password}</code>
                            <button
                                onClick={() => navigator.clipboard.writeText(resetUserPassword.password)}
                                className="text-gray-400 hover:text-gray-600 p-2"
                            >
                                <Copy size={20} />
                            </button>
                        </div>

                        <button
                            onClick={() => setResetUserPassword(null)}
                            className="w-full bg-secondary text-white py-3 rounded-xl font-bold hover:bg-secondary/90 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            <div className="mt-8 flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex items-center px-8 py-4 bg-secondary text-white rounded-xl font-bold hover:bg-secondary/90 shadow-lg shadow-secondary/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-1"
                >
                    {isLoading ? (
                        <Loader2 size={20} className="mr-2 animate-spin" />
                    ) : (
                        <Save size={20} className="mr-2" />
                    )}
                    {isLoading ? "Saving..." : "Save Configuration"}
                </button>
            </div>
        </motion.div>
    );
}
