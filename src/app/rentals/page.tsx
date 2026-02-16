"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import ProductCard from "@/components/features/ProductCard";
import { Search } from "lucide-react";

const RentalsPage = () => {
    const categories = ["All", "Chairs", "Tents", "Tables", "Lighting", "Backdrops", "Flooring", "Decor", "Tableware", "Kitchen ware", "Flowers", "Systems", "Electronics", "Others"];
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [items, setItems] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
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

    const filteredItems = items.filter(item => {
        const standardCategories = categories.filter(c => c !== "All" && c !== "Others").map(c => c.toLowerCase());
        const itemCat = (item.category || "").toLowerCase();

        const matchesCategory = selectedCategory === "All"
            ? true
            : selectedCategory === "Others"
                ? !standardCategories.includes(itemCat)
                : itemCat === selectedCategory.toLowerCase();

        const matchesSearch = (item.name || "").toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

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
                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-12">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Search className="w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search rentals (e.g. White Tent, Golden Chair...)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-lg"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <span className="text-sm font-medium">Clear</span>
                            </button>
                        )}
                    </div>
                </div>

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

                {/* Search & Filter Info */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 text-gray-500 text-sm">
                    <p>
                        Showing <span className="font-bold text-gray-900">{filteredItems.length}</span> {filteredItems.length === 1 ? 'item' : 'items'}
                        {searchQuery && <span> matching "<span className="text-primary">{searchQuery}</span>"</span>}
                        {selectedCategory !== "All" && <span> in <span className="text-primary">{selectedCategory}</span></span>}
                    </p>
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
                    <div className="text-center py-20 text-gray-500 bg-white rounded-3xl border border-dashed border-gray-200">
                        <p className="text-xl font-medium mb-2">No items found</p>
                        <p className="text-gray-400">
                            {searchQuery
                                ? `We couldn't find anything matching "${searchQuery}"`
                                : `No items available in the ${selectedCategory} category.`}
                        </p>
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="mt-6 text-primary font-bold hover:underline"
                            >
                                Clear search and try again
                            </button>
                        )}
                    </div>
                )}
            </section>

            <Footer />
        </main>
    );
};

export default RentalsPage;
