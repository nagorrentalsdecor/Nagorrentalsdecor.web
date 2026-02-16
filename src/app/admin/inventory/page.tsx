"use client";

import { useState, useEffect } from "react";
import { Plus, Search, AlertCircle, Edit, Trash2, Filter, Package, DollarSign, BarChart3, X, Image as ImageIcon, ChevronRight, ArrowUpRight, TrendingUp, LayoutGrid, List } from "lucide-react";
import Image from "next/image";
import { getItems, createItem, updateItem, deleteItem } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

// --- Components ---

const StatCard = ({ title, value, icon: Icon, colorClass, trend }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm shadow-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden"
    >
        <div className="flex justify-between items-start mb-6">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colorClass} transition-transform group-hover:rotate-6`}>
                <Icon size={24} />
            </div>
            {trend && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-600 uppercase tracking-tighter">
                    <TrendingUp size={12} />
                    {trend}
                </div>
            )}
        </div>
        <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
        </div>
    </motion.div>
);

const CategoryTab = ({ active, label, onClick }: any) => (
    <button
        onClick={onClick}
        className={`px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-300 border shadow-sm ${active
            ? "bg-slate-900 text-white border-slate-900 shadow-slate-200"
            : "bg-white text-slate-400 border-slate-100 hover:border-primary/30 hover:text-primary"
            }`}
    >
        {label}
    </button>
);

export default function InventoryPage() {
    const [items, setItems] = useState<any[]>([]);
    const [filteredItems, setFilteredItems] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        category: "Chairs",
        customCategory: "",
        pricePerDay: "",
        quantity: "",
        images: ["/images/chair-gold.png"]
    });

    useEffect(() => {
        fetchItems();
    }, []);

    useEffect(() => {
        if (!items) return;
        let result = items;
        if (searchTerm) {
            result = result.filter(item =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (categoryFilter !== "All") {
            const standardCategories = categories.filter(c => c !== "All" && c !== "Others").map(c => c.toLowerCase());

            result = result.filter(item => {
                if (!item.category) return false;
                const itemCat = item.category.toLowerCase();

                if (categoryFilter === "Others") {
                    return !standardCategories.includes(itemCat);
                }

                const filterNorm = categoryFilter.toLowerCase().replace(/s$/, "");
                const itemNorm = itemCat.replace(/s$/, "");
                return itemNorm === filterNorm || itemCat === categoryFilter.toLowerCase();
            });
        }
        setFilteredItems(result);
    }, [searchTerm, categoryFilter, items]);

    const fetchItems = async () => {
        setIsLoading(true);
        try {
            const data = await getItems();
            console.log("Fetched Items:", data?.length);
            if (Array.isArray(data)) {
                setItems(data);
                setFilteredItems(data);
            } else {
                setItems([]);
                setFilteredItems([]);
            }
        } catch (error) {
            console.error("Failed to fetch items", error);
            setItems([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (item?: any) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                name: item.name,
                category: item.category,
                pricePerDay: String(item.pricePerDay),
                quantity: String(item.quantity),
                images: item.images
            });
        } else {
            setEditingItem(null);
            setFormData({
                name: "",
                category: "Chairs",
                customCategory: "",
                pricePerDay: "",
                quantity: "",
                images: ["/images/chair-gold.png"]
            });
        }
        setIsModalOpen(true);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, images: [reader.result as string] }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const dataToSubmit = {
                ...formData,
                category: formData.category === "Others" ? formData.customCategory : formData.category,
                pricePerDay: Number(formData.pricePerDay),
                quantity: Number(formData.quantity)
            };
            delete (dataToSubmit as any).customCategory;
            if (editingItem) {
                await updateItem(editingItem._id || editingItem.id, dataToSubmit);
            } else {
                await createItem(dataToSubmit);
            }
            await fetchItems();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to save item", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Derived Stats
    const totalItems = items.length;
    const totalValue = items.reduce((acc, item) => acc + (Number(item.pricePerDay || 0) * Number(item.quantity || 0)), 0);
    const lowStock = items.filter(item => Number(item.quantity || 0) < 5).length;

    const categories = ["All", "Chairs", "Tents", "Tables", "Lighting", "Backdrops", "Flooring", "Decor", "Tableware", "Kitchen ware", "Flowers", "Systems", "Electronics", "Others"];

    return (
        <div className="space-y-10 pb-20">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <StatCard
                    title="Active Items"
                    value={totalItems}
                    icon={Package}
                    colorClass="bg-blue-500/10 text-blue-600"
                    trend="ACTIVE"
                />
                <StatCard
                    title="Inventory Value"
                    value={`GH₵ ${totalValue.toLocaleString()}`}
                    icon={DollarSign}
                    colorClass="bg-amber-500/10 text-amber-600"
                    trend="+5%"
                />
                <StatCard
                    title="Low Stock"
                    value={lowStock}
                    icon={AlertCircle}
                    colorClass="bg-rose-500/10 text-rose-600"
                    trend={lowStock > 0 ? "URGENT" : "STABLE"}
                />
            </div>

            {/* Controls Action Bar */}
            <div className="flex flex-col gap-8 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm shadow-slate-200/50">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                            <BarChart3 size={28} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Inventory Management</h2>
                            <p className="text-sm text-slate-500 font-medium mt-0.5">Track and manage rental items</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative group flex-1 md:w-80">
                            <input
                                type="text"
                                placeholder="Search items..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-primary/30 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium"
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                        </div>

                        {/* View Toggle */}
                        <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2.5 rounded-xl transition-all ${viewMode === 'list'
                                    ? 'bg-white text-primary shadow-sm'
                                    : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
                                    }`}
                            >
                                <List size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid'
                                    ? 'bg-white text-primary shadow-sm'
                                    : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
                                    }`}
                            >
                                <LayoutGrid size={18} />
                            </button>
                        </div>
                        <button
                            onClick={() => handleOpenModal()}
                            className="flex items-center px-6 py-3 bg-primary text-white text-sm font-bold rounded-2xl hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 active:scale-95 group"
                        >
                            <Plus size={18} className="mr-2 group-hover:rotate-90 transition-transform" />
                            Add Item
                        </button>
                    </div>
                </div>

                <div className="w-full">
                    <div className="flex flex-wrap gap-2.5">
                        {categories.map(cat => (
                            <CategoryTab
                                key={cat}
                                label={cat}
                                active={categoryFilter === cat}
                                onClick={() => setCategoryFilter(cat)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Inventory Content */}
            {viewMode === 'list' ? (
                <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm shadow-slate-200/50">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Item Details</th>
                                    <th className="px-6 py-6 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Category</th>
                                    <th className="px-6 py-6 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Daily Rate</th>
                                    <th className="px-6 py-6 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Quantity</th>
                                    <th className="px-6 py-6 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
                                    <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                <AnimatePresence>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={6} className="px-8 py-24 text-center">
                                                <div className="flex flex-col items-center justify-center animate-pulse">
                                                    <div className="w-16 h-16 bg-slate-100 rounded-full mb-4"></div>
                                                    <div className="h-4 bg-slate-100 rounded w-48 mb-2"></div>
                                                    <div className="h-3 bg-slate-100 rounded w-32"></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredItems.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-8 py-24 text-center">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                                        <Package size={40} className="text-slate-200" />
                                                    </div>
                                                    <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">No Items Found</h3>
                                                    <p className="text-slate-500 text-xs font-medium uppercase tracking-widest mt-2">{categoryFilter !== "All" ? `No ${categoryFilter} found` : 'Try a different search term'}</p>
                                                    <button
                                                        onClick={() => { setCategoryFilter("All"); setSearchTerm(""); }}
                                                        className="mt-6 text-primary font-bold text-sm hover:underline"
                                                    >
                                                        Clear Filters
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredItems.map((item, idx) => (
                                            <motion.tr
                                                key={item._id || item.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: Math.min(idx * 0.03, 0.2) }}
                                                className="group border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors"
                                            >
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-slate-100 relative overflow-hidden shadow-inner flex-shrink-0 group-hover:scale-110 transition-transform">
                                                            <Image src={item.images[0] || "/images/placeholder.png"} alt={item.name} fill className="object-cover" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-900 text-sm tracking-tight">{item.name}</p>
                                                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">SKU: {(item._id || item.id || "").slice(-8).toUpperCase()}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-xl uppercase tracking-wider border border-primary/10">
                                                        {item.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-right font-bold text-slate-900 text-sm tabular-nums">
                                                    GH₵ {item.pricePerDay.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <div className="text-sm font-bold text-slate-700">{item.quantity} units</div>
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    {item.quantity > 5 ? (
                                                        <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-xl uppercase tracking-wider border border-emerald-500/10">In Stock</span>
                                                    ) : item.quantity > 0 ? (
                                                        <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-xl uppercase tracking-wider border border-amber-500/10">Low Stock</span>
                                                    ) : (
                                                        <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-3 py-1.5 rounded-xl uppercase tracking-wider border border-rose-500/10">Out of Stock</span>
                                                    )}
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <div className="flex justify-end gap-2 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                                                        <button
                                                            onClick={() => handleOpenModal(item)}
                                                            className="p-3 bg-white text-slate-500 hover:text-primary hover:bg-slate-50 rounded-2xl shadow-xl transition-all active:scale-90 border border-slate-100"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button
                                                            onClick={async () => {
                                                                if (confirm(`Authorize resource deletion for ${item.name}?`)) {
                                                                    await deleteItem(item._id || item.id);
                                                                    await fetchItems();
                                                                }
                                                            }}
                                                            className="p-3 bg-white text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-2xl shadow-xl transition-all active:scale-90 border border-slate-100"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence>
                        {filteredItems.map((item, idx) => (
                            <motion.div
                                key={item._id || item.id || idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: Math.min(idx * 0.03, 0.2) }}
                                layout
                                className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group"
                            >
                                <div className="relative h-48 bg-slate-50">
                                    <Image
                                        src={item.images?.[0] || "/images/placeholder.png"}
                                        alt={item.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-700 shadow-sm">
                                        {item.category}
                                    </div>
                                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleOpenModal(item); }}
                                            className="p-2 bg-white rounded-lg shadow-sm hover:text-primary transition-colors"
                                        >
                                            <Edit size={14} />
                                        </button>
                                        <button
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                if (confirm(`Delete ${item.name}?`)) {
                                                    await deleteItem(item._id || item.id);
                                                    fetchItems();
                                                }
                                            }}
                                            className="p-2 bg-white rounded-lg shadow-sm hover:text-rose-600 transition-colors"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-slate-800 text-sm">{item.name}</h3>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${(item.quantity || 0) > 5
                                            ? 'bg-emerald-50 text-emerald-600'
                                            : (item.quantity || 0) > 0
                                                ? 'bg-amber-50 text-amber-600'
                                                : 'bg-rose-50 text-rose-600'
                                            }`}>
                                            {(item.quantity || 0) > 0 ? `${item.quantity} In Stock` : 'Out of Stock'}
                                        </span>
                                    </div>
                                    <div className="flex items-end justify-between mt-4">
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Daily Rate</p>
                                            <p className="text-lg font-black text-slate-900">GH₵ {(item.pricePerDay || 0).toLocaleString()}</p>
                                        </div>
                                        <p className="text-[10px] font-medium text-slate-400">ID: {(item._id || item.id || "").slice(-4).toUpperCase()}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                    </AnimatePresence>
                </div>
            )}

            {/* Modal Overlay */}
            <AnimatePresence>
                {
                    isModalOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-slate-900/40 backdrop-blur-xl z-[60]"
                                onClick={() => setIsModalOpen(false)}
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                                className="fixed inset-0 flex items-center justify-center z-[70] p-6 pointer-events-none"
                            >
                                <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl p-10 pointer-events-auto h-auto max-h-[90vh] overflow-y-auto scrollbar-none border border-slate-100">
                                    <div className="flex justify-between items-center mb-10 border-b border-slate-50 pb-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                                <Package size={28} />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                                                    {editingItem ? "Edit Item" : "Add New Item"}
                                                </h2>
                                                <p className="text-slate-500 font-medium uppercase tracking-widest text-[10px] mt-1">Inventory Management System</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setIsModalOpen(false)}
                                            className="p-3 rounded-2xl hover:bg-slate-50 text-slate-300 hover:text-slate-900 transition-colors"
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-10">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                            <div className="md:col-span-1">
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-1 text-center">Item Image</label>
                                                <div className="relative aspect-square bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 hover:border-primary/50 transition-colors flex flex-col items-center justify-center overflow-hidden group/img cursor-pointer p-4 shadow-inner">
                                                    {formData.images[0] ? (
                                                        <Image src={formData.images[0]} alt="Preview" fill className="object-cover group-hover/img:scale-110 transition-transform duration-700" />
                                                    ) : (
                                                        <div className="text-slate-300 group-hover/img:text-primary transition-colors flex flex-col items-center text-center">
                                                            <ImageIcon size={40} className="mb-3" />
                                                            <span className="text-[10px] font-bold uppercase tracking-wider">Upload Image</span>
                                                        </div>
                                                    )}
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageUpload}
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                    />
                                                </div>
                                            </div>

                                            <div className="md:col-span-2 space-y-6">
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">Item Title</label>
                                                    <input
                                                        required
                                                        type="text"
                                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] focus:bg-white focus:border-primary/30 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold text-slate-900"
                                                        placeholder="e.g. Gold Phoenix Chair"
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">Item Category</label>
                                                        <select
                                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] focus:bg-white focus:border-primary/30 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold text-slate-600 appearance-none cursor-pointer"
                                                            value={formData.category}
                                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                        >
                                                            {categories.filter(c => c !== "All").map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                                        </select>
                                                    </div>
                                                    {formData.category === "Others" && (
                                                        <div className="col-span-2">
                                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">Specify Other Category</label>
                                                            <input
                                                                required
                                                                type="text"
                                                                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] focus:bg-white focus:border-primary/30 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold text-slate-900"
                                                                placeholder="e.g. Stage Equipment"
                                                                value={formData.customCategory}
                                                                onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                                                            />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">Rate (GH₵)</label>
                                                        <input
                                                            required
                                                            type="number"
                                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] focus:bg-white focus:border-primary/30 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold text-slate-900"
                                                            value={formData.pricePerDay}
                                                            onChange={(e) => setFormData({ ...formData, pricePerDay: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">Total Quantity</label>
                                                    <input
                                                        required
                                                        type="number"
                                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] focus:bg-white focus:border-primary/30 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold text-slate-900"
                                                        placeholder="Total stock count"
                                                        value={formData.quantity}
                                                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-8 border-t border-slate-50 flex justify-end gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setIsModalOpen(false)}
                                                className="px-8 py-4 font-bold text-xs text-slate-400 hover:text-slate-900 rounded-2xl transition-all"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="px-10 py-4 bg-primary text-white font-bold text-xs rounded-2xl hover:bg-primary-hover shadow-lg shadow-primary/20 flex items-center transition-all active:scale-95"
                                            >
                                                {isLoading ? "Saving..." : "Save Item"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        </>
                    )
                }
            </AnimatePresence >
        </div >
    );
}
