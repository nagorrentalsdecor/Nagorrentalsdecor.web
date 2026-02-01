"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Package as PackageIcon, Search, Sparkles, ExternalLink, MoreVertical } from "lucide-react";
import Image from "next/image";
import { getPackages, createPackage, updatePackage, deletePackage } from "@/lib/api";
import Modal from "@/components/ui/Modal";
import { motion, AnimatePresence } from "framer-motion";

export default function ServicesPage() {
    const [packages, setPackages] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPkg, setEditingPkg] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        images: ["/images/wedding.png"],
        isFeatured: false
    });

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            console.log('[Services Page] Fetching packages...');
            const data = await getPackages();
            console.log('[Services Page] Packages received:', data);
            console.log('[Services Page] Number of packages:', data?.length);
            setPackages(data || []);
        } catch (error) {
            console.error("Failed to fetch packages", error);
            setPackages([]);
        }
    };

    const handleOpenModal = (pkg?: any) => {
        if (pkg) {
            setEditingPkg(pkg);
            setFormData({
                name: pkg.name,
                description: pkg.description || "",
                price: String(pkg.price),
                images: pkg.images,
                isFeatured: pkg.isFeatured || false
            });
        } else {
            setEditingPkg(null);
            setFormData({
                name: "",
                description: "",
                price: "",
                images: ["/images/wedding.png"],
                isFeatured: false
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
                price: Number(formData.price)
            };

            if (editingPkg) {
                await updatePackage(editingPkg._id || editingPkg.id, dataToSubmit);
            } else {
                await createPackage(dataToSubmit);
            }
            await fetchPackages();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to save package", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this package?")) {
            await deletePackage(id);
            fetchPackages();
        }
    };

    const filteredPackages = packages.filter(pkg =>
        pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
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
            className="space-y-10 pb-20"
        >
            {/* Action Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm shadow-slate-200/50">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner">
                        <PackageIcon size={28} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Our Services</h2>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-widest mt-0.5">{packages.length} Active Services</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative group flex-1 md:w-80">
                        <input
                            type="text"
                            placeholder="Find a service..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-primary/30 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center px-6 py-3 bg-primary text-white text-sm font-bold rounded-2xl hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 active:scale-95 group"
                    >
                        <Plus size={18} className="mr-2 group-hover:rotate-90 transition-transform" />
                        <span>ADD SERVICE</span>
                    </button>
                </div>
            </div>

            {filteredPackages.length === 0 ? (
                <motion.div variants={item} className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-dashed border-slate-200">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                        <PackageIcon className="text-slate-300" size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight tracking-tight">No Services Found</h3>
                    <p className="text-slate-500 max-w-sm text-center mt-2 font-medium">
                        {searchTerm ? "We couldn't find any services matching your search." : "Your service catalog is empty. Start by adding your first premium service."}
                    </p>
                    {!searchTerm && (
                        <button
                            onClick={() => handleOpenModal()}
                            className="mt-8 bg-primary/10 text-primary px-8 py-3 rounded-2xl font-bold hover:bg-primary hover:text-white transition-all uppercase tracking-widest text-xs"
                        >
                            Add Your First Service
                        </button>
                    )}
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredPackages.map((pkg, idx) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            key={pkg._id || pkg.id}
                            className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 group relative"
                        >
                            <div className="relative h-64 w-full bg-slate-50 overflow-hidden">
                                <Image
                                    src={pkg.images?.[0] || "/images/wedding.png"}
                                    alt={pkg.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />

                                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-900/80 to-transparent"></div>

                                {pkg.isFeatured && (
                                    <div className="absolute top-5 left-5 bg-white/10 backdrop-blur-xl text-white text-[10px] font-black px-3 py-1.5 rounded-xl border border-white/20 uppercase tracking-[0.2em] shadow-lg flex items-center gap-2">
                                        <Sparkles size={10} className="text-yellow-400" />
                                        Featured
                                    </div>
                                )}

                                <div className="absolute top-5 right-5 flex flex-col space-y-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleOpenModal(pkg); }}
                                        className="p-3 bg-white/95 backdrop-blur-sm rounded-2xl text-slate-600 hover:text-primary shadow-xl hover:scale-110 transition-all"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDelete(pkg._id || pkg.id); }}
                                        className="p-3 bg-white/95 backdrop-blur-sm rounded-2xl text-slate-600 hover:text-red-600 shadow-xl hover:scale-110 transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div className="absolute bottom-5 left-6 right-6 flex justify-between items-end">
                                    <span className="text-white font-black text-xl tracking-tighter drop-shadow-md">
                                        <span className="text-[10px] uppercase font-bold text-white/70 block mb-0.5 tracking-widest">Entry Price</span>
                                        GH₵ {(pkg.price || 0).toLocaleString()}
                                    </span>
                                    <button className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white hover:bg-primary-hover transition-colors shadow-lg shadow-primary/30">
                                        <ExternalLink size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-7">
                                <h3 className="font-black text-slate-900 text-lg leading-tight mb-2 tracking-tight group-hover:text-primary transition-colors">{pkg.name}</h3>
                                <p className="text-slate-400 text-xs leading-relaxed font-medium line-clamp-3">{pkg.description}</p>

                                <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                                    <div className="flex -space-x-2">
                                        <div className="w-6 h-6 rounded-full bg-slate-100 border border-white"></div>
                                        <div className="w-6 h-6 rounded-full bg-slate-200 border border-white"></div>
                                        <div className="w-6 h-6 rounded-full bg-primary/20 border border-white flex items-center justify-center text-[8px] font-bold text-primary">+3</div>
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">v2.1 Managed</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingPkg ? "Edit Service" : "Add New Service"}
            >
                <form onSubmit={handleSubmit} className="space-y-8 py-4">
                    <div className="space-y-6">
                        <div className="group">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">Service Name</label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. Royal Gold Wedding Suite"
                                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] focus:bg-white focus:border-primary/30 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold text-slate-800"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">Service Image</label>
                            <div className="flex items-start space-x-6 p-6 border border-slate-100 rounded-[1.5rem] bg-slate-50/50">
                                <div className="relative w-28 h-28 bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xl flex-shrink-0 group/img cursor-pointer">
                                    <Image
                                        src={formData.images[0] || "/images/placeholder.png"}
                                        alt="Preview"
                                        fill
                                        className="object-cover group-hover/img:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                        <Edit className="text-white" size={20} />
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        id="image-upload"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                </div>
                                <div className="flex-1 pt-1">
                                    <h4 className="text-sm font-bold text-slate-800 tracking-tight">Primary Image</h4>
                                    <p className="text-[11px] text-slate-500 font-medium mt-1 leading-relaxed">
                                        Upload a high-quality image for this service.
                                    </p>
                                    <label
                                        htmlFor="image-upload"
                                        className="inline-flex items-center px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-bold text-slate-600 hover:text-primary hover:border-primary/30 cursor-pointer shadow-sm transition-all mt-4 uppercase tracking-widest"
                                    >
                                        Change Image
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">Service Description</label>
                            <textarea
                                rows={4}
                                placeholder="Describe the details of this service..."
                                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] focus:bg-white focus:border-primary/30 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium text-slate-600 resize-none"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">Starting Price (GH₵)</label>
                            <div className="relative group">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">GH₵</span>
                                <input
                                    required
                                    type="number"
                                    min="0"
                                    placeholder="0.00"
                                    className="w-full pl-16 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] focus:bg-white focus:border-primary/30 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold text-slate-800"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center p-5 bg-primary/5 rounded-[1.25rem] border border-primary/10 transition-colors hover:bg-primary/10 group cursor-pointer" onClick={() => setFormData({ ...formData, isFeatured: !formData.isFeatured })}>
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData.isFeatured ? 'bg-primary border-primary' : 'bg-white border-slate-200'}`}>
                            {formData.isFeatured && <Sparkles size={12} className="text-white" />}
                        </div>
                        <label className="ml-4 text-xs text-slate-700 font-bold uppercase tracking-widest cursor-pointer select-none">Feature on Homepage</label>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-5 bg-primary text-white font-bold rounded-2xl hover:bg-primary-hover transition-all shadow-xl shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center uppercase tracking-widest text-xs active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></span>
                            ) : (
                                <PackageIcon size={18} className="mr-3" />
                            )}
                            {isLoading ? "Saving..." : editingPkg ? "Update Service" : "Add Service"}
                        </button>
                    </div>
                </form>
            </Modal>
        </motion.div >
    );
}
