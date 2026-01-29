"use client";

import { useState, useEffect } from "react";
import { Save, Plus, Trash2, Layout, Info, HelpCircle, Phone, FileText, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

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
                setStatus({ type: "success", message: "Content updated successfully!" });
                setTimeout(() => setStatus({ type: "", message: "" }), 3000);
            }
        } catch (error) {
            setStatus({ type: "error", message: "Failed to update content." });
        } finally {
            setIsLoading(false);
        }
    };

    if (!content) return <div className="p-8 text-center">Loading...</div>;

    const tabs = [
        { id: "hero", label: "Hero Section", icon: Layout },
        { id: "whyChooseUs", label: "Why Choose Us", icon: HelpCircle },
        { id: "about", label: "About Page", icon: Info },
        { id: "contact", label: "Contact Info", icon: Phone },
        { id: "pages", label: "Other Pages", icon: FileText },
        { id: "footer", label: "Footer & CTA", icon: MessageSquare },
        { id: "legal", label: "Legal Items", icon: FileText }
    ];

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Website Content</h1>
                    <p className="text-gray-500 text-sm mt-1">Customize the text and information across your site.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50"
                >
                    <Save size={18} />
                    <span>{isLoading ? "Saving..." : "Save Changes"}</span>
                </button>
            </div>

            {status.message && (
                <div className={`p-4 rounded-xl mb-6 text-sm font-medium ${status.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"
                    }`}>
                    {status.message}
                </div>
            )}

            {/* Tabs */}
            <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-x-auto">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap
                                ${activeTab === tab.id ? "bg-slate-900 text-white shadow-md scale-105" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"}
                            `}
                        >
                            <Icon size={16} />
                            {tab.label}
                        </button>
                    )
                })}
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm transition-all duration-300">
                {activeTab === "hero" && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Badge Text</label>
                                <input
                                    type="text"
                                    value={content.hero.badge}
                                    onChange={(e) => setContent({ ...content, hero: { ...content.hero, badge: e.target.value } })}
                                    className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-slate-900 focus:ring-0 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Main Title</label>
                                <input
                                    type="text"
                                    value={content.hero.title}
                                    onChange={(e) => setContent({ ...content, hero: { ...content.hero, title: e.target.value } })}
                                    className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-slate-900 focus:ring-0 outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">Subtitle / Description</label>
                            <textarea
                                value={content.hero.subtitle}
                                onChange={(e) => setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } })}
                                rows={3}
                                className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-slate-900 focus:ring-0 outline-none transition-all resize-none"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Primary CTA Button</label>
                                <input
                                    type="text"
                                    value={content.hero.ctaPrimary}
                                    onChange={(e) => setContent({ ...content, hero: { ...content.hero, ctaPrimary: e.target.value } })}
                                    className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-slate-900 focus:ring-0 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Secondary CTA Button</label>
                                <input
                                    type="text"
                                    value={content.hero.ctaSecondary}
                                    onChange={(e) => setContent({ ...content, hero: { ...content.hero, ctaSecondary: e.target.value } })}
                                    className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-slate-900 focus:ring-0 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "whyChooseUs" && (
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Section Title</label>
                                <input
                                    type="text"
                                    value={content.whyChooseUs.title}
                                    onChange={(e) => setContent({ ...content, whyChooseUs: { ...content.whyChooseUs, title: e.target.value } })}
                                    className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-slate-900 focus:ring-0 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Description Text</label>
                                <textarea
                                    value={content.whyChooseUs.description}
                                    onChange={(e) => setContent({ ...content, whyChooseUs: { ...content.whyChooseUs, description: e.target.value } })}
                                    rows={3}
                                    className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-slate-900 focus:ring-0 outline-none transition-all resize-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-bold text-gray-700 ml-1 block">Key Benefits / Reasons</label>
                            {content.whyChooseUs.benefits.map((benefit: string, index: number) => (
                                <div key={index} className="flex gap-2 group">
                                    <input
                                        type="text"
                                        value={benefit}
                                        onChange={(e) => {
                                            const newBenefits = [...content.whyChooseUs.benefits];
                                            newBenefits[index] = e.target.value;
                                            setContent({ ...content, whyChooseUs: { ...content.whyChooseUs, benefits: newBenefits } });
                                        }}
                                        className="flex-1 px-5 py-3 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-slate-900 focus:ring-0 outline-none transition-all"
                                    />
                                    <button
                                        onClick={() => {
                                            const newBenefits = content.whyChooseUs.benefits.filter((_: any, i: number) => i !== index);
                                            setContent({ ...content, whyChooseUs: { ...content.whyChooseUs, benefits: newBenefits } });
                                        }}
                                        className="p-3 text-gray-300 hover:text-rose-500 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={() => {
                                    const newBenefits = [...content.whyChooseUs.benefits, ""];
                                    setContent({ ...content, whyChooseUs: { ...content.whyChooseUs, benefits: newBenefits } });
                                }}
                                className="flex items-center gap-2 text-primary font-bold text-sm bg-primary/5 px-6 py-3 rounded-2xl border border-dashed border-primary/20 hover:bg-primary/10 transition-all w-full justify-center"
                            >
                                <Plus size={16} />
                                <span>Add Benefit</span>
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === "about" && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Page Badge / Title</label>
                                <input
                                    type="text"
                                    value={content.about.title}
                                    onChange={(e) => setContent({ ...content, about: { ...content.about, title: e.target.value } })}
                                    className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-slate-900 focus:ring-0 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Main Heading</label>
                                <input
                                    type="text"
                                    value={content.about.heading}
                                    onChange={(e) => setContent({ ...content, about: { ...content.about, heading: e.target.value } })}
                                    className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-slate-900 focus:ring-0 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-bold text-gray-700 ml-1 block">About Paragraphs</label>
                            {content.about.paragraphs.map((p: string, index: number) => (
                                <div key={index} className="flex gap-2">
                                    <textarea
                                        value={p}
                                        onChange={(e) => {
                                            const newPs = [...content.about.paragraphs];
                                            newPs[index] = e.target.value;
                                            setContent({ ...content, about: { ...content.about, paragraphs: newPs } });
                                        }}
                                        rows={3}
                                        className="flex-1 px-5 py-3 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-slate-900 focus:ring-0 outline-none transition-all resize-none font-body"
                                    />
                                    <button
                                        onClick={() => {
                                            const newPs = content.about.paragraphs.filter((_: any, i: number) => i !== index);
                                            setContent({ ...content, about: { ...content.about, paragraphs: newPs } });
                                        }}
                                        className="p-3 text-gray-300 hover:text-rose-500 transition-colors h-fit mt-1"
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
                                className="flex items-center gap-2 text-primary font-bold text-sm bg-primary/5 px-6 py-3 rounded-2xl border border-dashed border-primary/20 hover:bg-primary/10 transition-all w-full justify-center"
                            >
                                <Plus size={16} />
                                <span>Add Paragraph</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100 pt-8">
                            {content.about.stats.map((stat: any, index: number) => (
                                <div key={index} className="space-y-4 p-6 bg-gray-50 rounded-2xl relative">
                                    <button
                                        onClick={() => {
                                            const newStats = content.about.stats.filter((_: any, i: number) => i !== index);
                                            setContent({ ...content, about: { ...content.about, stats: newStats } });
                                        }}
                                        className="absolute top-2 right-2 text-gray-300 hover:text-rose-500"
                                    >
                                        <X size={14} />
                                    </button>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Stat Label</label>
                                        <input
                                            type="text"
                                            value={stat.label}
                                            onChange={(e) => {
                                                const newStats = [...content.about.stats];
                                                newStats[index] = { ...newStats[index], label: e.target.value };
                                                setContent({ ...content, about: { ...content.about, stats: newStats } });
                                            }}
                                            className="w-full px-4 py-2 rounded-xl bg-white border border-gray-100 focus:border-slate-900 focus:ring-0 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Value</label>
                                        <input
                                            type="text"
                                            value={stat.value}
                                            onChange={(e) => {
                                                const newStats = [...content.about.stats];
                                                newStats[index] = { ...newStats[index], value: e.target.value };
                                                setContent({ ...content, about: { ...content.about, stats: newStats } });
                                            }}
                                            className="w-full px-4 py-2 rounded-xl bg-white border border-gray-100 focus:border-slate-900 focus:ring-0 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => {
                                    const newStats = [...content.about.stats, { label: "", value: "" }];
                                    setContent({ ...content, about: { ...content.about, stats: newStats } });
                                }}
                                className="h-full min-h-[160px] flex flex-col items-center justify-center gap-2 text-gray-400 font-bold text-sm bg-gray-50/50 px-6 py-4 rounded-2xl border border-dashed border-gray-200 hover:bg-gray-50 hover:text-gray-600 transition-all"
                            >
                                <Plus size={24} />
                                <span>Add Stat</span>
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === "contact" && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Main Phone Number</label>
                                <input
                                    type="text"
                                    value={content.contact.phone}
                                    onChange={(e) => setContent({ ...content, contact: { ...content.contact, phone: e.target.value } })}
                                    className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-slate-900 focus:ring-0 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Secondary Phone Number</label>
                                <input
                                    type="text"
                                    value={content.contact.phoneSecondary}
                                    onChange={(e) => setContent({ ...content, contact: { ...content.contact, phoneSecondary: e.target.value } })}
                                    className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-slate-900 focus:ring-0 outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Contact Email</label>
                                <input
                                    type="email"
                                    value={content.contact.email}
                                    onChange={(e) => setContent({ ...content, contact: { ...content.contact, email: e.target.value } })}
                                    className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-slate-900 focus:ring-0 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Working Hours</label>
                                <input
                                    type="text"
                                    value={content.contact.workingHours}
                                    onChange={(e) => setContent({ ...content, contact: { ...content.contact, workingHours: e.target.value } })}
                                    className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-slate-900 focus:ring-0 outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">Office Address</label>
                            <textarea
                                value={content.contact.address}
                                onChange={(e) => setContent({ ...content, contact: { ...content.contact, address: e.target.value } })}
                                rows={2}
                                className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-slate-900 focus:ring-0 outline-none transition-all resize-none"
                            />
                        </div>
                    </div>
                )}

                {activeTab === "pages" && (
                    <div className="space-y-10">
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-2">Services Page</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Page Title</label>
                                    <input
                                        type="text"
                                        value={content.servicesPage.title}
                                        onChange={(e) => setContent({ ...content, servicesPage: { ...content.servicesPage, title: e.target.value } })}
                                        className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-slate-900 focus:ring-0 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Subtitle / Description</label>
                                    <textarea
                                        value={content.servicesPage.subtitle}
                                        onChange={(e) => setContent({ ...content, servicesPage: { ...content.servicesPage, subtitle: e.target.value } })}
                                        rows={2}
                                        className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-slate-900 focus:ring-0 outline-none transition-all resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-2">Rentals Page</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Page Title</label>
                                    <input
                                        type="text"
                                        value={content.rentalsPage.title}
                                        onChange={(e) => setContent({ ...content, rentalsPage: { ...content.rentalsPage, title: e.target.value } })}
                                        className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-slate-900 focus:ring-0 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Subtitle / Description</label>
                                    <textarea
                                        value={content.rentalsPage.subtitle}
                                        onChange={(e) => setContent({ ...content, rentalsPage: { ...content.rentalsPage, subtitle: e.target.value } })}
                                        rows={2}
                                        className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-slate-900 focus:ring-0 outline-none transition-all resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "footer" && (
                    <div className="space-y-10">
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-2">Footer Content</h3>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Brand Description</label>
                                <textarea
                                    value={content.footer.description}
                                    onChange={(e) => setContent({ ...content, footer: { ...content.footer, description: e.target.value } })}
                                    rows={3}
                                    className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-slate-900 focus:ring-0 outline-none transition-all resize-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-2">Home CTA Section</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">CTA Title</label>
                                    <input
                                        type="text"
                                        value={content.homeCTA.title}
                                        onChange={(e) => setContent({ ...content, homeCTA: { ...content.homeCTA, title: e.target.value } })}
                                        className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-slate-900 focus:ring-0 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">CTA Subtitle</label>
                                    <textarea
                                        value={content.homeCTA.subtitle}
                                        onChange={(e) => setContent({ ...content, homeCTA: { ...content.homeCTA, subtitle: e.target.value } })}
                                        rows={2}
                                        className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-slate-900 focus:ring-0 outline-none transition-all resize-none"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Primary Button Text</label>
                                    <input
                                        type="text"
                                        value={content.homeCTA.primaryBtn}
                                        onChange={(e) => setContent({ ...content, homeCTA: { ...content.homeCTA, primaryBtn: e.target.value } })}
                                        className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-slate-900 focus:ring-0 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Secondary Button Text</label>
                                    <input
                                        type="text"
                                        value={content.homeCTA.secondaryBtn}
                                        onChange={(e) => setContent({ ...content, homeCTA: { ...content.homeCTA, secondaryBtn: e.target.value } })}
                                        className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-slate-900 focus:ring-0 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "legal" && (
                    <div className="space-y-12">
                        {/* Terms of Service Section */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-2">Terms of Service</h3>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Last Updated</label>
                                <input
                                    type="text"
                                    value={content.termsOfService?.lastUpdated || ""}
                                    onChange={(e) => setContent({
                                        ...content,
                                        termsOfService: { ...content.termsOfService, lastUpdated: e.target.value }
                                    })}
                                    className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-slate-900 focus:ring-0 outline-none transition-all font-mono text-sm"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-sm font-bold text-gray-700 ml-1 block">Sections</label>
                                {content.termsOfService?.sections?.map((section: any, index: number) => (
                                    <div key={index} className="p-6 bg-gray-50 rounded-2xl space-y-4 relative">
                                        <button
                                            onClick={() => {
                                                const newSections = content.termsOfService.sections.filter((_: any, i: number) => i !== index);
                                                setContent({ ...content, termsOfService: { ...content.termsOfService, sections: newSections } });
                                            }}
                                            className="absolute top-4 right-4 text-gray-300 hover:text-rose-500 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Section Title</label>
                                            <input
                                                type="text"
                                                value={section.title}
                                                onChange={(e) => {
                                                    const newSections = [...content.termsOfService.sections];
                                                    newSections[index] = { ...newSections[index], title: e.target.value };
                                                    setContent({ ...content, termsOfService: { ...content.termsOfService, sections: newSections } });
                                                }}
                                                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-100 focus:border-slate-900 focus:ring-0 outline-none transition-all font-bold"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Content</label>
                                            <textarea
                                                value={section.content}
                                                onChange={(e) => {
                                                    const newSections = [...content.termsOfService.sections];
                                                    newSections[index] = { ...newSections[index], content: e.target.value };
                                                    setContent({ ...content, termsOfService: { ...content.termsOfService, sections: newSections } });
                                                }}
                                                rows={3}
                                                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-100 focus:border-slate-900 focus:ring-0 outline-none transition-all resize-none"
                                            />
                                        </div>
                                    </div>
                                ))}
                                <button
                                    onClick={() => {
                                        const newSections = [...(content.termsOfService?.sections || []), { title: "", content: "" }];
                                        setContent({ ...content, termsOfService: { ...content.termsOfService, sections: newSections } });
                                    }}
                                    className="flex items-center gap-2 text-primary font-bold text-sm bg-primary/5 px-6 py-3 rounded-2xl border border-dashed border-primary/20 hover:bg-primary/10 transition-all w-full justify-center"
                                >
                                    <Plus size={16} />
                                    <span>Add TOS Section</span>
                                </button>
                            </div>
                        </div>

                        {/* Privacy Policy Section */}
                        <div className="space-y-6 pt-12 border-t border-gray-100">
                            <h3 className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-2">Privacy Policy</h3>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Last Updated</label>
                                <input
                                    type="text"
                                    value={content.privacyPolicy?.lastUpdated || ""}
                                    onChange={(e) => setContent({
                                        ...content,
                                        privacyPolicy: { ...content.privacyPolicy, lastUpdated: e.target.value }
                                    })}
                                    className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-slate-900 focus:ring-0 outline-none transition-all font-mono text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Intro Policy Text</label>
                                <textarea
                                    value={content.privacyPolicy?.content || ""}
                                    onChange={(e) => setContent({
                                        ...content,
                                        privacyPolicy: { ...content.privacyPolicy, content: e.target.value }
                                    })}
                                    rows={3}
                                    className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-slate-900 focus:ring-0 outline-none transition-all resize-none"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-sm font-bold text-gray-700 ml-1 block">Policy Sections</label>
                                {content.privacyPolicy?.sections?.map((section: any, index: number) => (
                                    <div key={index} className="p-6 bg-gray-50 rounded-2xl space-y-4 relative">
                                        <button
                                            onClick={() => {
                                                const newSections = content.privacyPolicy.sections.filter((_: any, i: number) => i !== index);
                                                setContent({ ...content, privacyPolicy: { ...content.privacyPolicy, sections: newSections } });
                                            }}
                                            className="absolute top-4 right-4 text-gray-300 hover:text-rose-500 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Section Title</label>
                                            <input
                                                type="text"
                                                value={section.title}
                                                onChange={(e) => {
                                                    const newSections = [...content.privacyPolicy.sections];
                                                    newSections[index] = { ...newSections[index], title: e.target.value };
                                                    setContent({ ...content, privacyPolicy: { ...content.privacyPolicy, sections: newSections } });
                                                }}
                                                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-100 focus:border-slate-900 focus:ring-0 outline-none transition-all font-bold"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Content</label>
                                            <textarea
                                                value={section.content}
                                                onChange={(e) => {
                                                    const newSections = [...content.privacyPolicy.sections];
                                                    newSections[index] = { ...newSections[index], content: e.target.value };
                                                    setContent({ ...content, privacyPolicy: { ...content.privacyPolicy, sections: newSections } });
                                                }}
                                                rows={3}
                                                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-100 focus:border-slate-900 focus:ring-0 outline-none transition-all resize-none"
                                            />
                                        </div>
                                    </div>
                                ))}
                                <button
                                    onClick={() => {
                                        const newSections = [...(content.privacyPolicy?.sections || []), { title: "", content: "" }];
                                        setContent({ ...content, privacyPolicy: { ...content.privacyPolicy, sections: newSections } });
                                    }}
                                    className="flex items-center gap-2 text-primary font-bold text-sm bg-primary/5 px-6 py-3 rounded-2xl border border-dashed border-primary/20 hover:bg-primary/10 transition-all w-full justify-center"
                                >
                                    <Plus size={16} />
                                    <span>Add Policy Section</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

const X = ({ size, className }: { size: number, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M18 6 6 18M6 6l12 12" />
    </svg>
);
