"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, User, ShieldCheck, Mail, ArrowRight, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [requiresNewPassword, setRequiresNewPassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            if (requiresNewPassword) {
                if (newPassword !== confirmPassword) {
                    setError("Credentials mismatch. Re-verify payload.");
                    setIsLoading(false);
                    return;
                }
                if (newPassword.length < 6) {
                    setError("Security protocol requires 6+ characters.");
                    setIsLoading(false);
                    return;
                }

                const res = await fetch("/api/auth", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, newPassword })
                });

                const data = await res.json();
                if (data.success) {
                    localStorage.setItem("nagor_admin_session", "true");
                    localStorage.setItem("nagor_admin_email", email);
                    localStorage.setItem("nagor_user_role", data.user?.role || "Admin");
                    router.push("/admin/dashboard");
                } else {
                    setError(data.message || "Auth update failed.");
                }
            } else {
                const res = await fetch("/api/auth", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                const data = await res.json();
                if (data.success) {
                    if (data.requirePasswordChange) {
                        setRequiresNewPassword(true);
                        setError("");
                    } else {
                        localStorage.setItem("nagor_admin_session", "true");
                        localStorage.setItem("nagor_admin_email", email);
                        localStorage.setItem("nagor_user_role", data.user.role);
                        router.push("/admin/dashboard");
                    }
                } else {
                    setError(data.message || "Identity verification failed.");
                }
            }
        } catch (err) {
            setError("Network anomaly detected. Try again.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-100 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-50 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-5 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #9333EA 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-md relative z-10"
            >
                {/* Brand Header */}
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-primary shadow-2xl shadow-primary/20 mb-6"
                    >
                        <Lock className="text-white" size={40} />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Nagor Rentals & Decor</h1>
                    <p className="text-slate-500 font-medium text-sm">Administrative Access Terminal</p>
                </div>

                {/* Login Card */}
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-hidden">
                    <form className="space-y-6 relative z-10" onSubmit={handleLogin}>
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-3 rounded-2xl text-xs font-semibold flex items-center"
                                >
                                    <Shield className="mr-2" size={14} />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {!requiresNewPassword ? (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 px-1">Email Address</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                            <Mail size={18} />
                                        </div>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 placeholder-slate-400 focus:bg-white focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium"
                                            placeholder="admin@nagor.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 px-1">Password</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                            <Lock size={18} />
                                        </div>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 placeholder-slate-400 focus:bg-white focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="p-5 bg-amber-50 border border-amber-100 rounded-2xl">
                                    <p className="text-xs font-bold text-amber-600 mb-1">Password Reset Required</p>
                                    <p className="text-[11px] text-slate-500 font-medium">Please set a new secure password for your account.</p>
                                </div>
                                <div className="space-y-4">
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 placeholder-slate-400 focus:bg-white focus:border-primary focus:outline-none transition-all text-sm font-medium"
                                        placeholder="New Password"
                                    />
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 placeholder-slate-400 focus:bg-white focus:border-primary focus:outline-none transition-all text-sm font-medium"
                                        placeholder="Confirm New Password"
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full group relative flex items-center justify-center py-4 px-6 rounded-2xl text-sm font-bold text-white overflow-hidden transition-all active:scale-95
                            ${requiresNewPassword ? "bg-amber-600 hover:bg-amber-500" : "bg-primary hover:bg-primary-hover"}
                            disabled:opacity-50 shadow-lg shadow-primary/20`}
                        >
                            <span className="relative z-10 flex items-center">
                                {isLoading ? (
                                    <Loader2 className="animate-spin mr-2" size={16} />
                                ) : (
                                    <>
                                        {requiresNewPassword ? "Reset Password" : "Sign In to Dashboard"}
                                        <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                                    </>
                                )}
                            </span>
                        </button>
                    </form>
                </div>

                {/* Footer Credits */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-12 text-center"
                >
                    <p className="text-xs font-medium text-slate-400 mb-4">&copy; 2026 Nagor Rentals & Decor. All rights reserved.</p>
                    <div className="flex justify-center gap-6 text-slate-400 font-semibold text-[10px] uppercase tracking-wider">
                        <span className="hover:text-primary cursor-pointer transition-colors">Privacy Policy</span>
                        <span className="hover:text-primary cursor-pointer transition-colors">Help Center</span>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
