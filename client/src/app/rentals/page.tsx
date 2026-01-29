"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import ProductCard from "@/components/features/ProductCard";

const RentalsPage = () => {
    const categories = ["All", "Chairs", "Tents", "Tables", "Lighting", "Backdrops", "Flooring", "Decor", "Tableware", "Kitchen ware", "Flowers", "Systems", "Electronics"];
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [items, setItems] = useState<any[]>([]);
    const [siteContent, setSiteContent] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resItems, resContent] = await Promise.all([
                    fetch('/api/items'),
                    fetch('/api/content')
                ]);

                if (resItems.ok) {
                    const data = await resItems.json();
                    setItems(data);
                }

                if (resContent.ok) {
                    const content = await resContent.json();
                    setSiteContent(content);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    const rentalsPage = siteContent?.rentalsPage || {
        title: "Rental Inventory",
        subtitle: "Browse our extensive collection of high-quality event equipment available for rent."
    };

    const filteredItems = selectedCategory === "All"
        ? items
        : items.filter(item => (item.category || "").toLowerCase() === selectedCategory.toLowerCase());

    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Header */}
            <div className="pt-32 pb-20 bg-gray-900 text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/10"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">{rentalsPage.title}</h1>
                        <p className="text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">
                            {rentalsPage.subtitle}
                        </p>
                    </motion.div>
                </div>
            </div>

            <section className="py-20 container mx-auto px-4">
                {/* Filter Tabs */}
                <div className="flex flex-wrap justify-center gap-3 mb-16">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 transform hover:scale-105 ${selectedCategory === cat
                                ? "bg-primary text-white shadow-lg shadow-primary/30"
                                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {filteredItems.map((item) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            key={item._id || item.id}
                        >
                            <ProductCard
                                id={item._id || item.id}
                                name={item.name}
                                category={item.category}
                                image={item.images?.[0] || item.image || "/images/placeholder.png"}
                                pricePerDay={item.pricePerDay}
                                availableQuantity={item.quantity}
                            />
                        </motion.div>
                    ))}
                </div>

                {filteredItems.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        <p className="text-lg">No items found in this category.</p>
                    </div>
                )}
            </section>

            <Footer />
        </main>
    );
};

export default RentalsPage;
