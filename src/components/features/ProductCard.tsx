"use client";

import Image from "next/image";
import { Plus, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

interface ProductCardProps {
    id: string | number;
    name: string;
    category: string;
    image: string;
    pricePerDay: number;
    availableQuantity: number;
}

const ProductCard = ({ id, name, category, image, pricePerDay, availableQuantity }: ProductCardProps) => {
    const { addToCart } = useCart();
    const [isAdded, setIsAdded] = useState(false);

    const handleAddToCart = () => {
        addToCart({
            id,
            name,
            category,
            price: pricePerDay,
            quantity: 1,
            image,
            stock: availableQuantity
        });

        // Show added feedback
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all border border-gray-100 overflow-hidden group font-body"
        >
            <div className="relative h-64 w-full bg-gray-50 group-hover:bg-white transition-colors duration-500">
                <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-contain p-6 group-hover:scale-110 transition-transform duration-500 ease-out"
                />

                {availableQuantity > 0 ? (
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-green-700 text-[10px] font-bold px-2.5 py-1 rounded shadow-sm border border-green-100 uppercase tracking-wider">
                        In Stock
                    </span>
                ) : (
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-red-600 text-[10px] font-bold px-2.5 py-1 rounded shadow-sm border border-red-100 uppercase tracking-wider">
                        Out of Stock
                    </span>
                )}

                {/* Quick Action Overlay */}
                <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            <div className="p-4">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">{category}</p>
                <h3 className="text-lg font-heading font-bold text-secondary mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                    {name}
                </h3>

                <div className="flex justify-between items-center mt-3">
                    <div>
                        <span className="text-lg font-bold text-secondary">
                            GH₵ {pricePerDay.toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">/ day</span>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={availableQuantity === 0}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${isAdded
                            ? "bg-green-500 text-white hover:bg-green-600 scale-110"
                            : "bg-primary text-white hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
                            }`}
                    >
                        <AnimatePresence mode="wait">
                            {isAdded ? (
                                <motion.div
                                    key="check"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                >
                                    <Check size={16} />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="plus"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                >
                                    <Plus size={18} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
