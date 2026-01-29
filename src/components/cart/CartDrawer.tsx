"use client";

import { useCart } from "@/context/CartContext";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function CartDrawer() {
    const {
        items,
        isCartOpen,
        setIsCartOpen,
        removeFromCart,
        updateQuantity,
        totalAmount,
    } = useCart();

    const drawerRef = useRef<HTMLDivElement>(null);

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsCartOpen(false);
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [setIsCartOpen]);

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        ref={drawerRef}
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col font-body"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div className="flex items-center">
                                <ShoppingBag className="mr-2 text-primary" size={20} />
                                <h2 className="text-xl font-heading font-bold text-gray-800">Your Cart</h2>
                                <span className="ml-2 bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-full">
                                    {items.length} items
                                </span>
                            </div>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Items List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 space-y-4">
                                    <ShoppingBag size={64} className="opacity-20" />
                                    <p className="text-lg font-medium">Your cart is empty</p>
                                    <button
                                        onClick={() => setIsCartOpen(false)}
                                        className="text-primary hover:underline font-bold"
                                    >
                                        Start Browsing
                                    </button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <motion.div
                                        layout
                                        key={item.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="flex gap-4 p-4 rounded-xl border border-gray-50 bg-white hover:border-gray-100 transition-colors shadow-sm"
                                    >
                                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="font-bold text-gray-800 line-clamp-1">{item.name}</h3>
                                                <p className="text-xs text-gray-500">{item.category}</p>
                                            </div>
                                            <div className="flex justify-between items-end mt-2">
                                                <div className="flex items-center space-x-2 border border-gray-200 rounded-lg p-1">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded text-gray-600"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus size={12} />
                                                    </button>
                                                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded text-gray-600"
                                                    >
                                                        <Plus size={12} />
                                                    </button>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-primary">GH₵ {item.price * item.quantity}</p>
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-[10px] text-red-500 hover:text-red-700 flex items-center mt-1"
                                                    >
                                                        <Trash2 size={10} className="mr-1" /> Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-gray-100 bg-gray-50/30">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-gray-600 font-medium">Subtotal</span>
                                    <span className="text-2xl font-bold text-gray-800">GH₵ {totalAmount}</span>
                                </div>
                                <p className="text-xs text-gray-400 mb-6 text-center">
                                    Shipping and taxes calculated at checkout.
                                </p>
                                <Link
                                    href="/checkout"
                                    onClick={() => setIsCartOpen(false)}
                                    className="w-full py-4 bg-primary text-white font-bold rounded-xl flex items-center justify-center hover:bg-primary-hover transition-all shadow-lg active:scale-95"
                                >
                                    Proceed to Checkout
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
