"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Package as PackageIcon, Search } from "lucide-react";
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
        price: 0,
        images: ["/images/wedding.png"],
        isFeatured: false
    });

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            const data = await getPackages();
            setPackages(data);
        } catch (error) {
            console.error("Failed to fetch packages", error);
        }
    };

    const handleOpenModal = (pkg?: any) => {
        if (pkg) {
            setEditingPkg(pkg);
            setFormData({
                name: pkg.name,
                description: pkg.description || "",
                price: pkg.price,
                images: pkg.images,
                isFeatured: pkg.isFeatured || false
            });
        } else {
            setEditingPkg(null);
            setFormData({
                name: "",
                description: "",
                price: 0,
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
            if (editingPkg) {
                await updatePackage(editingPkg._id, formData);
            } else {
                await createPackage(formData);
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
            className="space-y-8"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Services</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your packages.</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative group flex-1 md:w-64">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-gray-200 focus:outline-none focus:ring-0 transition-all text-sm"
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-gray-600 transition-colors" size={16} />
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-black transition-colors"
                    >
                        <Plus size={16} className="mr-2" />
                        Add
                    </button>
                </div>
            </div>

            {filteredPackages.length === 0 ? (
                <motion.div variants={item} className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <PackageIcon className="text-gray-400" size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No packages found</h3>
                    <p className="text-gray-500 max-w-sm text-center mt-1">
                        {searchTerm ? "Try adjusting your search terms" : "Get started by creating your first decoration package"}
                    </p>
                    {!searchTerm && (
                        <button
                            onClick={() => handleOpenModal()}
                            className="mt-6 text-primary font-medium hover:underline"
                        >
                            Create a package
                        </button>
                    )}
                </motion.div>
            ) : (
                <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    {filteredPackages.map((pkg) => (
                        <div
                            key={pkg._id}
                            className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-gray-300 transition-all duration-300 group"
                        >
                            <div className="relative h-48 w-full bg-gray-100">
                                <Image
                                    src={pkg.images[0] || "/images/wedding.png"}
                                    alt={pkg.name}
                                    fill
                                    className="object-cover"
                                />

                                {pkg.isFeatured && (
                                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-900 text-[10px] font-bold px-2 py-0.5 rounded-full border border-gray-100">
                                        Featured
                                    </div>
                                )}

                                <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleOpenModal(pkg); }}
                                        className="p-1.5 bg-white rounded-full text-gray-500 hover:text-gray-900 shadow-sm"
                                    >
                                        <Edit size={14} />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDelete(pkg._id); }}
                                        className="p-1.5 bg-white rounded-full text-gray-500 hover:text-red-600 shadow-sm"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-gray-900 text-lg leading-tight">{pkg.name}</h3>
                                    <span className="text-sm font-semibold text-gray-700 bg-gray-50 px-2 py-1 rounded">GH₵ {pkg.price.toLocaleString()}</span>
                                </div>
                                <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{pkg.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingPkg ? "Edit Package" : "Create New Package"}
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Package Name</label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. Gold Wedding Package"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Package Image</label>
                            <div className="flex items-start space-x-4 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                                <div className="relative w-24 h-24 bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm flex-shrink-0">
                                    <Image
                                        src={formData.images[0] || "/images/placeholder.png"}
                                        alt="Preview"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        id="image-upload"
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="image-upload"
                                        className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer shadow-sm transition-colors mb-2"
                                    >
                                        Choose New Image
                                    </label>
                                    <p className="text-xs text-gray-500">
                                        Recommended size: 800x600px. JPG, PNG or WebP.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                            <textarea
                                rows={4}
                                placeholder="Describe the package details..."
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Price (GH₵)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-2.5 text-gray-500 font-medium">GH₵</span>
                                <input
                                    required
                                    type="number"
                                    min="0"
                                    placeholder="0.00"
                                    className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <input
                            type="checkbox"
                            id="featured"
                            className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary"
                            checked={formData.isFeatured}
                            onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                        />
                        <label htmlFor="featured" className="ml-3 text-sm text-gray-700 font-medium cursor-pointer select-none">Feature this package on homepage</label>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                        >
                            {isLoading ? (
                                <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
                            ) : (
                                <PackageIcon size={18} className="mr-2" />
                            )}
                            {isLoading ? "Saving..." : "Save Package"}
                        </button>
                    </div>
                </form>
            </Modal>
        </motion.div >
    );
}
