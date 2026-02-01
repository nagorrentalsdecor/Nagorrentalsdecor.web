"use client";

import { useState, useEffect } from "react";
import { Save, Plus, Trash2, Layout, Info, HelpCircle, Phone, FileText, MessageSquare, Globe, Check, AlertCircle, Loader2, Sparkles, Layers, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ContentAdmin() {
    const [content, setContent] = useState<any>(null);
    const [activeTab, setActiveTab] = useState("hero");
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState({ type: "", message: "" });

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const res = await fetch("/api/content");
            const data = await res.json();
            setContent(data);
        } catch (error) {
            console.error("Failed to fetch content", error);
        }
    };

    const handleSave = async () => {
        setIsLoading(true);
        setStatus({ type: "", message: "" });
        try {
            const res = await fetch("/api/content", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(content)
            });

            if (res.ok) {
                setStatus({ type: "success", message: "Core Content Synchronized" });
                setTimeout(() => setStatus({ type: "", message: "" }), 3000);
            }
        } catch (error) {
            setStatus({ type: "error", message: "Synchronization Failure" });
        } finally {
            setIsLoading(false);
        }
    };

    if (!content) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin opacity-20" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Resources...</p>
        </div>
    );

    const tabs = [
        { id: "hero", label: "Hero", icon: Layout, desc: "Main landing section" },
        { id: "whyChooseUs", label: "Features", icon: HelpCircle, desc: "Why Choose Us section" },
        { id: "about", label: "About Us", icon: Info, desc: "About Nagor and mission" },
        { id: "contact", label: "Contact", icon: Phone, desc: "Contact details and map" },
        { id: "pages", label: "Page Headers", icon: FileText, desc: "Services & Rentals headers" },
        { id: "footer", label: "Footer", icon: MessageSquare, desc: "Footer info and links" },
        { id: "legal", label: "Legal", icon: Globe, desc: "TOS and Privacy Policy" }
    ];

    const inputClasses = "w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all text-sm font-semibold text-slate-900 placeholder:text-slate-400";
    const labelClasses = "text-xs font-bold text-slate-700 px-1 block mb-2";
    const cardClasses = "bg-white p-10 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10 pb-20"
        >
            {/* Header Action Bar */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                        <Sparkles size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Content Management</h2>
                        <p className="text-sm text-slate-500 font-medium mt-0.5">Manage website sections and information</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <AnimatePresence>
                        {status.message && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 ${status.type === "success" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                                    }`}
                            >
                                {status.type === "success" ? <Check size={14} /> : <AlertCircle size={14} />}
                                {status.message}
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="flex items-center px-8 py-4 bg-primary text-white rounded-2xl font-bold text-sm hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Save size={16} className="mr-2" />}
                        {isLoading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>

            {/* Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Side Navigation */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="bg-white p-3 rounded-[2rem] border border-slate-100 sticky top-10 shadow-sm">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group relative overflow-hidden ${activeTab === tab.id
                                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                                    : "text-slate-500 hover:text-primary hover:bg-purple-50"
                                    }`}
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${activeTab === tab.id ? "bg-white/20" : "bg-slate-50 group-hover:bg-white border border-slate-100"
                                    }`}>
                                    <tab.icon size={18} />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-bold">{tab.label}</p>
                                    <p className={`text-[11px] font-medium mt-0.5 ${activeTab === tab.id ? "text-purple-100" : "text-slate-400"
                                        }`}>{tab.desc}</p>
                                </div>
                                {activeTab === tab.id && (
                                    <motion.div layoutId="tab-indicator" className="absolute right-0 top-0 bottom-0 w-1 bg-white" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Calibration Interface */}
                <div className="lg:col-span-9">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-10"
                        >
                            {/* Hero Tab */}
                            {activeTab === "hero" && (
                                <div className={cardClasses}>
                                    <div className="absolute top-0 right-0 p-8 text-primary/5 group-hover:scale-110 transition-transform duration-700">
                                        <Layout size={120} />
                                    </div>
                                    <div className="flex items-center gap-4 mb-10 relative z-10">
                                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100">
                                            <Layers size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Hero Section</h3>
                                            <p className="text-sm text-slate-500 font-medium">Main landing experience and CTAs</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                                        <div className="space-y-2">
                                            <label className={labelClasses}>Badge Label</label>
                                            <input
                                                type="text"
                                                value={content.hero.badge}
                                                onChange={(e) => setContent({ ...content, hero: { ...content.hero, badge: e.target.value } })}
                                                className={inputClasses}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className={labelClasses}>Main Headline</label>
                                            <input
                                                type="text"
                                                value={content.hero.title}
                                                onChange={(e) => setContent({ ...content, hero: { ...content.hero, title: e.target.value } })}
                                                className={inputClasses}
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className={labelClasses}>Sub-headline / Description</label>
                                            <textarea
                                                value={content.hero.subtitle}
                                                onChange={(e) => setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } })}
                                                rows={3}
                                                className={`${inputClasses} resize-none`}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className={labelClasses}>Primary Button Text</label>
                                            <input
                                                type="text"
                                                value={content.hero.ctaPrimary}
                                                onChange={(e) => setContent({ ...content, hero: { ...content.hero, ctaPrimary: e.target.value } })}
                                                className={inputClasses}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className={labelClasses}>Secondary Button Text</label>
                                            <input
                                                type="text"
                                                value={content.hero.ctaSecondary}
                                                onChange={(e) => setContent({ ...content, hero: { ...content.hero, ctaSecondary: e.target.value } })}
                                                className={inputClasses}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Why Choose Us */}
                            {activeTab === "whyChooseUs" && (
                                <div className="space-y-10">
                                    <div className={cardClasses}>
                                        <div className="flex items-center gap-4 mb-10 relative z-10">
                                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100">
                                                <HelpCircle size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Feature Highlights</h3>
                                                <p className="text-sm text-slate-500 font-medium">Core benefits and differentiators</p>
                                            </div>
                                        </div>
                                        <div className="space-y-8 relative z-10">
                                            <div className="space-y-2">
                                                <label className={labelClasses}>Section Title</label>
                                                <input
                                                    type="text"
                                                    value={content.whyChooseUs.title}
                                                    onChange={(e) => setContent({ ...content, whyChooseUs: { ...content.whyChooseUs, title: e.target.value } })}
                                                    className={inputClasses}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className={labelClasses}>Section Description</label>
                                                <textarea
                                                    value={content.whyChooseUs.description}
                                                    onChange={(e) => setContent({ ...content, whyChooseUs: { ...content.whyChooseUs, description: e.target.value } })}
                                                    rows={3}
                                                    className={`${inputClasses} resize-none`}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`${cardClasses} bg-slate-50/50`}>
                                        <label className={labelClasses}>Feature Registry</label>
                                        <div className="space-y-4">
                                            {content.whyChooseUs.benefits.map((benefit: string, index: number) => (
                                                <motion.div layout key={index} className="flex gap-4 group/item">
                                                    <div className="flex-1 relative">
                                                        <input
                                                            type="text"
                                                            value={benefit}
                                                            onChange={(e) => {
                                                                const newBenefits = [...content.whyChooseUs.benefits];
                                                                newBenefits[index] = e.target.value;
                                                                setContent({ ...content, whyChooseUs: { ...content.whyChooseUs, benefits: newBenefits } });
                                                            }}
                                                            className={inputClasses}
                                                        />
                                                        <div className="absolute left-[-1.5rem] top-1/2 -translate-y-1/2 w-1 h-8 bg-slate-200 rounded-full group-hover/item:bg-primary transition-colors" />
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            const newBenefits = content.whyChooseUs.benefits.filter((_: any, i: number) => i !== index);
                                                            setContent({ ...content, whyChooseUs: { ...content.whyChooseUs, benefits: newBenefits } });
                                                        }}
                                                        className="p-4 bg-white text-slate-300 hover:text-rose-500 rounded-2xl border border-slate-100 shadow-sm transition-all active:scale-90"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </motion.div>
                                            ))}
                                            <button
                                                onClick={() => {
                                                    const newBenefits = [...content.whyChooseUs.benefits, ""];
                                                    setContent({ ...content, whyChooseUs: { ...content.whyChooseUs, benefits: newBenefits } });
                                                }}
                                                className="w-full py-5 rounded-[1.5rem] border-2 border-dashed border-slate-200 text-slate-400 font-bold text-xs uppercase tracking-wide hover:bg-white hover:border-primary/50 hover:text-primary transition-all flex items-center justify-center gap-2"
                                            >
                                                <Plus size={16} />
                                                Add New Feature
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* About Identity */}
                            {activeTab === "about" && (
                                <div className="space-y-10">
                                    <div className={cardClasses}>
                                        <div className="flex items-center gap-4 mb-10">
                                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100">
                                                <Info size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 tracking-tight">About Identity</h3>
                                                <p className="text-sm text-slate-500 font-medium">History and mission statement</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className={labelClasses}>Identity Label</label>
                                                <input
                                                    type="text"
                                                    value={content.about.title}
                                                    onChange={(e) => setContent({ ...content, about: { ...content.about, title: e.target.value } })}
                                                    className={inputClasses}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className={labelClasses}>Master Heading</label>
                                                <input
                                                    type="text"
                                                    value={content.about.heading}
                                                    onChange={(e) => setContent({ ...content, about: { ...content.about, heading: e.target.value } })}
                                                    className={inputClasses}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className={cardClasses}>
                                        <label className={labelClasses}>Narrative Transmissions</label>
                                        <div className="space-y-6">
                                            {content.about.paragraphs.map((p: string, index: number) => (
                                                <div key={index} className="flex gap-4 group/item">
                                                    <textarea
                                                        value={p}
                                                        onChange={(e) => {
                                                            const newPs = [...content.about.paragraphs];
                                                            newPs[index] = e.target.value;
                                                            setContent({ ...content, about: { ...content.about, paragraphs: newPs } });
                                                        }}
                                                        rows={3}
                                                        className={`${inputClasses} resize-none`}
                                                    />
                                                    <button
                                                        onClick={() => {
                                                            const newPs = content.about.paragraphs.filter((_: any, i: number) => i !== index);
                                                            setContent({ ...content, about: { ...content.about, paragraphs: newPs } });
                                                        }}
                                                        className="p-4 h-fit bg-white text-slate-300 hover:text-rose-500 rounded-2xl border border-slate-100 shadow-sm transition-all active:scale-90"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                onClick={() => {
                                                    const newPs = [...content.about.paragraphs, ""];
                                                    setContent({ ...content, about: { ...content.about, paragraphs: newPs } });
                                                }}
                                                className="w-full py-5 rounded-[1.5rem] border-2 border-dashed border-slate-200 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                                            >
                                                <Plus size={16} />
                                                New Narrative Sequence
                                            </button>
                                        </div>
                                    </div>

                                    <div className={`${cardClasses} bg-slate-900 text-white`}>
                                        <label className={`${labelClasses} text-slate-500`}>Telemetry Metrics</label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {content.about.stats.map((stat: any, index: number) => (
                                                <div key={index} className="p-8 bg-white/5 border border-white/10 rounded-[2rem] relative group/stat">
                                                    <button
                                                        onClick={() => {
                                                            const newStats = content.about.stats.filter((_: any, i: number) => i !== index);
                                                            setContent({ ...content, about: { ...content.about, stats: newStats } });
                                                        }}
                                                        className="absolute top-4 right-4 text-white/20 hover:text-rose-400 transition-colors opacity-0 group-hover/stat:opacity-100"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                    <div className="space-y-4">
                                                        <div className="space-y-2">
                                                            <label className="text-[9px] font-black text-white/30 uppercase tracking-widest px-1">Metric Label</label>
                                                            <input
                                                                type="text"
                                                                value={stat.label}
                                                                onChange={(e) => {
                                                                    const newStats = [...content.about.stats];
                                                                    newStats[index] = { ...newStats[index], label: e.target.value };
                                                                    setContent({ ...content, about: { ...content.about, stats: newStats } });
                                                                }}
                                                                className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-black placeholder:text-white/20"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-[9px] font-black text-white/30 uppercase tracking-widest px-1">Quantum Value</label>
                                                            <input
                                                                type="text"
                                                                value={stat.value}
                                                                onChange={(e) => {
                                                                    const newStats = [...content.about.stats];
                                                                    newStats[index] = { ...newStats[index], value: e.target.value };
                                                                    setContent({ ...content, about: { ...content.about, stats: newStats } });
                                                                }}
                                                                className="w-full bg-transparent border-none p-0 focus:ring-0 text-3xl font-black placeholder:text-white/20"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <button
                                                onClick={() => {
                                                    const newStats = [...content.about.stats, { label: "", value: "" }];
                                                    setContent({ ...content, about: { ...content.about, stats: newStats } });
                                                }}
                                                className="flex flex-col items-center justify-center p-8 rounded-[2rem] border-2 border-dashed border-white/10 hover:border-white/20 hover:bg-white/5 transition-all gap-3 text-white/40 font-black text-[10px] uppercase tracking-widest"
                                            >
                                                <Plus size={24} />
                                                Append Telemetry
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Contact Communications */}
                            {activeTab === "contact" && (
                                <div className={cardClasses}>
                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                                            <Phone size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Signal Endpoints</h3>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Direct communication pathways</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className={labelClasses}>Primary Frequency (Phone)</label>
                                            <input
                                                type="text"
                                                value={content.contact.phone}
                                                onChange={(e) => setContent({ ...content, contact: { ...content.contact, phone: e.target.value } })}
                                                className={inputClasses}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className={labelClasses}>Secondary Frequency</label>
                                            <input
                                                type="text"
                                                value={content.contact.phoneSecondary}
                                                onChange={(e) => setContent({ ...content, contact: { ...content.contact, phoneSecondary: e.target.value } })}
                                                className={inputClasses}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className={labelClasses}>Encryption Mail (Email)</label>
                                            <input
                                                type="email"
                                                value={content.contact.email}
                                                onChange={(e) => setContent({ ...content, contact: { ...content.contact, email: e.target.value } })}
                                                className={inputClasses}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className={labelClasses}>Operational Windows</label>
                                            <input
                                                type="text"
                                                value={content.contact.workingHours}
                                                onChange={(e) => setContent({ ...content, contact: { ...content.contact, workingHours: e.target.value } })}
                                                className={inputClasses}
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className={labelClasses}>Geospatial Coordinates (Address)</label>
                                            <textarea
                                                value={content.contact.address}
                                                onChange={(e) => setContent({ ...content, contact: { ...content.contact, address: e.target.value } })}
                                                rows={2}
                                                className={`${inputClasses} resize-none`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Aux Pages Modules */}
                            {activeTab === "pages" && (
                                <div className="space-y-10">
                                    {/* Services Header */}
                                    <div className={cardClasses}>
                                        <div className="flex items-center gap-2 mb-8">
                                            <div className="p-2 bg-slate-900 rounded-lg text-white"><Layout size={14} /></div>
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Services Module Configuration</h4>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className={labelClasses}>Header Title</label>
                                                <input
                                                    type="text"
                                                    value={content.servicesPage.title}
                                                    onChange={(e) => setContent({ ...content, servicesPage: { ...content.servicesPage, title: e.target.value } })}
                                                    className={inputClasses}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className={labelClasses}>Header Resonance</label>
                                                <input
                                                    type="text"
                                                    value={content.servicesPage.subtitle}
                                                    onChange={(e) => setContent({ ...content, servicesPage: { ...content.servicesPage, subtitle: e.target.value } })}
                                                    className={inputClasses}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Rentals Header */}
                                    <div className={cardClasses}>
                                        <div className="flex items-center gap-2 mb-8">
                                            <div className="p-2 bg-slate-900 rounded-lg text-white"><FileText size={14} /></div>
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Inventory Module Configuration</h4>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className={labelClasses}>Header Title</label>
                                                <input
                                                    type="text"
                                                    value={content.rentalsPage.title}
                                                    onChange={(e) => setContent({ ...content, rentalsPage: { ...content.rentalsPage, title: e.target.value } })}
                                                    className={inputClasses}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className={labelClasses}>Header Resonance</label>
                                                <input
                                                    type="text"
                                                    value={content.rentalsPage.subtitle}
                                                    onChange={(e) => setContent({ ...content, rentalsPage: { ...content.rentalsPage, subtitle: e.target.value } })}
                                                    className={inputClasses}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Footer & CTA Terminal */}
                            {activeTab === "footer" && (
                                <div className="space-y-10">
                                    <div className={cardClasses}>
                                        <div className="flex items-center gap-4 mb-10">
                                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                                                <MessageSquare size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">System Termination (Footer)</h3>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Final brand resonance</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className={labelClasses}>Core Brand Description</label>
                                            <textarea
                                                value={content.footer.description}
                                                onChange={(e) => setContent({ ...content, footer: { ...content.footer, description: e.target.value } })}
                                                rows={3}
                                                className={`${inputClasses} resize-none`}
                                            />
                                        </div>
                                    </div>

                                    <div className={`${cardClasses} bg-primary/5 border-primary/10`}>
                                        <div className="flex items-center gap-2 mb-8">
                                            <div className="p-2 bg-primary rounded-lg text-white"><Sparkles size={14} /></div>
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">High-Intensity Call To Action</h4>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className={labelClasses}>CTA Payload Title</label>
                                                <input
                                                    type="text"
                                                    value={content.homeCTA.title}
                                                    onChange={(e) => setContent({ ...content, homeCTA: { ...content.homeCTA, title: e.target.value } })}
                                                    className={inputClasses}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className={labelClasses}>CTA Payload Subtext</label>
                                                <input
                                                    type="text"
                                                    value={content.homeCTA.subtitle}
                                                    onChange={(e) => setContent({ ...content, homeCTA: { ...content.homeCTA, subtitle: e.target.value } })}
                                                    className={inputClasses}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className={labelClasses}>Primary Execution Label</label>
                                                <input
                                                    type="text"
                                                    value={content.homeCTA.primaryBtn}
                                                    onChange={(e) => setContent({ ...content, homeCTA: { ...content.homeCTA, primaryBtn: e.target.value } })}
                                                    className={inputClasses}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className={labelClasses}>Secondary Execution Label</label>
                                                <input
                                                    type="text"
                                                    value={content.homeCTA.secondaryBtn}
                                                    onChange={(e) => setContent({ ...content, homeCTA: { ...content.homeCTA, secondaryBtn: e.target.value } })}
                                                    className={inputClasses}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Governance & Legal */}
                            {activeTab === "legal" && (
                                <div className="space-y-12">
                                    {/* Terms Matrix */}
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-end px-2">
                                            <div>
                                                <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Governance Protocols (TOS)</h4>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Rule of engagement</p>
                                            </div>
                                            <div className="text-right">
                                                <label className="text-[8px] font-black text-slate-300 uppercase tracking-widest block mb-1">Last Sync</label>
                                                <input
                                                    type="text"
                                                    value={content.termsOfService?.lastUpdated || ""}
                                                    onChange={(e) => setContent({
                                                        ...content,
                                                        termsOfService: { ...content.termsOfService, lastUpdated: e.target.value }
                                                    })}
                                                    className="bg-transparent border-none p-0 text-[10px] font-black text-slate-900 text-right focus:ring-0"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            {content.termsOfService?.sections?.map((section: any, index: number) => (
                                                <div key={index} className={`${cardClasses} border-l-4 border-l-slate-200`}>
                                                    <button
                                                        onClick={() => {
                                                            const newSections = content.termsOfService.sections.filter((_: any, i: number) => i !== index);
                                                            setContent({ ...content, termsOfService: { ...content.termsOfService, sections: newSections } });
                                                        }}
                                                        className="absolute top-8 right-8 text-slate-300 hover:text-rose-500 transition-colors"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                    <div className="space-y-6 pr-10">
                                                        <div className="space-y-2">
                                                            <label className={labelClasses}>Protocol Label</label>
                                                            <input
                                                                type="text"
                                                                value={section.title}
                                                                onChange={(e) => {
                                                                    const newSections = [...content.termsOfService.sections];
                                                                    newSections[index] = { ...newSections[index], title: e.target.value };
                                                                    setContent({ ...content, termsOfService: { ...content.termsOfService, sections: newSections } });
                                                                }}
                                                                className={`${inputClasses} bg-white shadow-sm border-slate-100`}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className={labelClasses}>Legal Payload</label>
                                                            <textarea
                                                                value={section.content}
                                                                onChange={(e) => {
                                                                    const newSections = [...content.termsOfService.sections];
                                                                    newSections[index] = { ...newSections[index], content: e.target.value };
                                                                    setContent({ ...content, termsOfService: { ...content.termsOfService, sections: newSections } });
                                                                }}
                                                                rows={4}
                                                                className={`${inputClasses} bg-white shadow-sm border-slate-100 resize-none`}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <button
                                                onClick={() => {
                                                    const newSections = [...(content.termsOfService?.sections || []), { title: "", content: "" }];
                                                    setContent({ ...content, termsOfService: { ...content.termsOfService, sections: newSections } });
                                                }}
                                                className="w-full py-5 rounded-[1.5rem] border-2 border-dashed border-slate-200 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white hover:border-slate-300 transition-all flex items-center justify-center gap-2"
                                            >
                                                <Plus size={16} />
                                                Append Governance Protocol
                                            </button>
                                        </div>
                                    </div>

                                    {/* Privacy Matrix */}
                                    <div className="space-y-6 pt-12 border-t border-slate-100">
                                        <div className="flex justify-between items-end px-2">
                                            <div>
                                                <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Privacy Architecture</h4>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Data security framework</p>
                                            </div>
                                            <div className="text-right">
                                                <label className="text-[8px] font-black text-slate-300 uppercase tracking-widest block mb-1">Last Sync</label>
                                                <input
                                                    type="text"
                                                    value={content.privacyPolicy?.lastUpdated || ""}
                                                    onChange={(e) => setContent({
                                                        ...content,
                                                        privacyPolicy: { ...content.privacyPolicy, lastUpdated: e.target.value }
                                                    })}
                                                    className="bg-transparent border-none p-0 text-[10px] font-black text-slate-900 text-right focus:ring-0"
                                                />
                                            </div>
                                        </div>

                                        <div className={cardClasses}>
                                            <label className={labelClasses}>Interrogator Narrative</label>
                                            <textarea
                                                value={content.privacyPolicy?.content || ""}
                                                onChange={(e) => setContent({
                                                    ...content,
                                                    privacyPolicy: { ...content.privacyPolicy, content: e.target.value }
                                                })}
                                                rows={3}
                                                className={inputClasses}
                                            />
                                        </div>

                                        <div className="space-y-6">
                                            {content.privacyPolicy?.sections?.map((section: any, index: number) => (
                                                <div key={index} className={`${cardClasses} border-l-4 border-l-primary/20`}>
                                                    <button
                                                        onClick={() => {
                                                            const newSections = content.privacyPolicy.sections.filter((_: any, i: number) => i !== index);
                                                            setContent({ ...content, privacyPolicy: { ...content.privacyPolicy, sections: newSections } });
                                                        }}
                                                        className="absolute top-8 right-8 text-slate-300 hover:text-rose-500 transition-colors"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                    <div className="space-y-6 pr-10">
                                                        <div className="space-y-2">
                                                            <label className={labelClasses}>Sub-Policy Identity</label>
                                                            <input
                                                                type="text"
                                                                value={section.title}
                                                                onChange={(e) => {
                                                                    const newSections = [...content.privacyPolicy.sections];
                                                                    newSections[index] = { ...newSections[index], title: e.target.value };
                                                                    setContent({ ...content, privacyPolicy: { ...content.privacyPolicy, sections: newSections } });
                                                                }}
                                                                className={`${inputClasses} bg-white shadow-sm border-slate-100`}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className={labelClasses}>Data Security Payload</label>
                                                            <textarea
                                                                value={section.content}
                                                                onChange={(e) => {
                                                                    const newSections = [...content.privacyPolicy.sections];
                                                                    newSections[index] = { ...newSections[index], content: e.target.value };
                                                                    setContent({ ...content, privacyPolicy: { ...content.privacyPolicy, sections: newSections } });
                                                                }}
                                                                rows={4}
                                                                className={`${inputClasses} bg-white shadow-sm border-slate-100 resize-none`}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <button
                                                onClick={() => {
                                                    const newSections = [...(content.privacyPolicy?.sections || []), { title: "", content: "" }];
                                                    setContent({ ...content, privacyPolicy: { ...content.privacyPolicy, sections: newSections } });
                                                }}
                                                className="w-full py-5 rounded-[1.5rem] border-2 border-dashed border-slate-200 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white hover:border-primary/30 hover:text-primary transition-all flex items-center justify-center gap-2"
                                            >
                                                <Plus size={16} />
                                                Append Privacy Vector
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}
