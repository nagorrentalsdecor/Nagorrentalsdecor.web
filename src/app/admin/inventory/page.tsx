"use client";

import { useState, useEffect } from "react";
import { Plus, Search, AlertCircle, Edit, Trash2, Filter, Package, DollarSign, BarChart3, X, Image as ImageIcon, ChevronRight } from "lucide-react";
import Image from "next/image";
import { getItems, createItem, updateItem, deleteItem } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

// --- Components ---

const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-2xl border border-purple-100 hover:border-purple-200 hover:shadow-sm transition-all duration-300"
    >
        <div className="flex items-center justify-between mb-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color.replace('text', 'bg')}/10 text-${color.split('-')[1]}-600`}>
                <Icon size={20} />
            </div>
            {trend && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{trend}</span>}
        </div>
        <h3 className="text-2xl font-bold text-secondary tracking-tight">{value}</h3>
        <p className="text-sm font-medium text-gray-400 mt-1">{title}</p>
    </motion.div>
);

const CategoryTab = ({ active, label, onClick }: any) => (
    <button
        onClick={onClick}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${active
            ? "bg-secondary text-white border-secondary"
            : "bg-transparent text-gray-500 border-gray-200 hover:border-purple-200 hover:text-purple-700"
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

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        category: "Chairs",
        pricePerDay: 0,
        quantity: 0,
        images: ["/images/chair-gold.png"]
    });

    useEffect(() => {
        fetchItems();
    }, []);

    useEffect(() => {
        let result = items;
        if (searchTerm) {
            result = result.filter(item =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (categoryFilter !== "All") {
            result = result.filter(item => item.category === categoryFilter);
        }
        setFilteredItems(result);
    }, [searchTerm, categoryFilter, items]);

    const fetchItems = async () => {
        try {
            const data = await getItems();
            setItems(data);
            setFilteredItems(data);
        } catch (error) {
            console.error("Failed to fetch items", error);
        }
    };

    const handleOpenModal = (item?: any) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                name: item.name,
                category: item.category,
                pricePerDay: item.pricePerDay,
                quantity: item.quantity,
                images: item.images
            });
        } else {
            setEditingItem(null);
            setFormData({
                name: "",
                category: "Chairs",
                pricePerDay: 0,
                quantity: 0,
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
            if (editingItem) {
                await updateItem(editingItem._id, formData);
            } else {
                await createItem(formData);
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
    const totalValue = items.reduce((acc, item) => acc + (item.pricePerDay * item.quantity), 0);
    const lowStock = items.filter(item => item.quantity < 5).length;

    const categories = ["All", "Chairs", "Tents", "Tables", "Lighting", "Backdrops", "Flooring", "Decor", "Tableware", "Kitchen ware", "Flowers", "Systems", "Electronics"];

    return (
        <div className="space-y-8">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Inventory"
                    value={totalItems}
                    icon={Package}
                    color="text-blue-500"
                    trend="+12%"
                />
                <StatCard
                    title="Asset Value (Daily)"
                    value={`GH₵ ${totalValue.toLocaleString()}`}
                    icon={DollarSign}
                    color="text-amber-500"
                    trend="+5%"
                />
                <StatCard
                    title="Low Stock Alerts"
                    value={lowStock}
                    icon={AlertCircle}
                    color="text-rose-500"
                />
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
                <div className="w-full md:w-auto">
                    <div className="flex flex-wrap gap-2">
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

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative group flex-1 md:w-64">
                        <input
                            type="text"
                            placeholder="Search items..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                        />
                        <Search className="absolute left-3 top-3.5 text-gray-400 group-hover:text-primary transition-colors" size={18} />
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 active:scale-95 transition-all duration-200"
                    >
                        <Plus size={20} className="mr-2" />
                        Add Item
                    </button>
                </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Item Details</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Category</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Price / Day</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Stock</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            <AnimatePresence>
                                {filteredItems.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-20 text-center text-gray-400">
                                            <div className="flex flex-col items-center">
                                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                                    <Search size={32} className="opacity-50" />
                                                </div>
                                                <p className="text-lg font-medium text-gray-600">No items found</p>
                                                <p className="text-sm">Try adjusting your search or filters</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredItems.map((item, idx) => (
                                        <motion.tr
                                            key={item._id || idx}
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="group hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                                        >
                                            <td className="px-8 py-4">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 rounded-lg bg-gray-100 relative overflow-hidden mr-4">
                                                        <Image src={item.images[0] || "/images/placeholder.png"} alt={item.name} fill className="object-cover" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                                                        <p className="text-xs text-gray-400 font-mono">#{item._id?.slice(-6)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                                                    {item.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-medium text-gray-900 text-sm">
                                                GH₵ {item.pricePerDay.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="text-sm text-gray-700">{item.quantity} units</div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {item.quantity > 5 ? (
                                                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-wider">In Stock</span>
                                                ) : item.quantity > 0 ? (
                                                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full uppercase tracking-wider">Low Stock</span>
                                                ) : (
                                                    <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full uppercase tracking-wider">Out Stock</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleOpenModal(item)}
                                                        className="p-1.5 text-gray-400 hover:text-gray-900 rounded-md transition-colors"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={async () => {
                                                            if (confirm(`Are you sure you want to delete ${item.name}?`)) {
                                                                await deleteItem(item._id);
                                                                await fetchItems();
                                                            }
                                                        }}
                                                        className="p-1.5 text-gray-400 hover:text-red-500 rounded-md transition-colors"
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

            {/* Modal Overlay */}
            <AnimatePresence>
                {isModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-secondary/80 backdrop-blur-sm z-[60]"
                            onClick={() => setIsModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-0 flex items-center justify-center z-[70] p-4 pointer-events-none"
                        >
                            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-8 pointer-events-auto h-auto max-h-[90vh] overflow-y-auto scrollbar-none">
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <h2 className="text-2xl font-heading font-bold text-secondary">
                                            {editingItem ? "Edit Item" : "Add New Item"}
                                        </h2>
                                        <p className="text-gray-500 text-sm">Fill in the details below to update your inventory.</p>
                                    </div>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-secondary transition-colors"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="flex gap-6">
                                        <div className="w-1/3">
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Item Image</label>
                                            <div className="relative aspect-square bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 hover:border-primary/50 transition-colors flex flex-col items-center justify-center overflow-hidden group cursor-pointer text-center p-4">
                                                {formData.images[0] ? (
                                                    <Image src={formData.images[0]} alt="Preview" fill className="object-cover" />
                                                ) : (
                                                    <div className="text-gray-400 group-hover:text-primary transition-colors">
                                                        <ImageIcon size={32} className="mx-auto mb-2" />
                                                        <span className="text-xs font-bold">Upload</span>
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

                                        <div className="w-2/3 space-y-4">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Item Name</label>
                                                <input
                                                    required
                                                    type="text"
                                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-xl outline-none transition-all font-medium"
                                                    placeholder="e.g. Royal Throne Chair"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                                                    <select
                                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-xl outline-none transition-all font-medium appearance-none"
                                                        value={formData.category}
                                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                    >
                                                        {categories.filter(c => c !== "All").map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-2">Price (GH₵)</label>
                                                    <input
                                                        required
                                                        type="number"
                                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-xl outline-none transition-all font-medium"
                                                        value={formData.pricePerDay}
                                                        onChange={(e) => setFormData({ ...formData, pricePerDay: Number(e.target.value) })}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Stock Quantity</label>
                                                <input
                                                    required
                                                    type="number"
                                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-xl outline-none transition-all font-medium"
                                                    value={formData.quantity}
                                                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="px-6 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/20 flex items-center"
                                        >
                                            {isLoading ? "Saving..." : "Save Changes"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
