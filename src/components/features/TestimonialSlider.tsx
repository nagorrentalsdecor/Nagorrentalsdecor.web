"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useState, useEffect } from "react";

export default function TestimonialSlider() {
    const [testimonials, setTestimonials] = useState<any[]>([]);

    useEffect(() => {
        async function fetchTestimonials() {
            try {
                const res = await fetch("/api/testimonials");
                if (res.ok) {
                    const data = await res.json();
                    // Ensure we have an array
                    if (Array.isArray(data)) {
                        setTestimonials(data);
                    } else {
                        // Fallback data if API returns weird structure
                        setTestimonials([
                            { _id: 1, name: "Sarah Osei", role: "Bride", content: "Magical experience!", initial: "S" },
                            { _id: 2, name: "Kwame Mensah", role: "Planner", content: "Professional service.", initial: "K" }
                        ]);
                    }
                }
            } catch (e) {
                console.error("Error fetching testimonials", e);
            }
        }
        fetchTestimonials();
    }, []);

    if (testimonials.length === 0) return null;

    // Duplicate list 4 times to ensure it fills the screen and loops smoothly
    const marqueeList = [...testimonials, ...testimonials, ...testimonials, ...testimonials];

    return (
        <div className="w-full relative overflow-hidden py-16 bg-white">
            <div className="container mx-auto px-4 mb-12 text-center">
                <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4 text-secondary">
                    What Our Clients Say
                </h2>
                <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
            </div>

            <div className="w-full overflow-hidden flex relative">
                {/* Gradients to fade edges */}
                <div className="absolute top-0 left-0 h-full w-20 md:w-40 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
                <div className="absolute top-0 right-0 h-full w-20 md:w-40 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

                <motion.div
                    className="flex gap-8 px-4"
                    animate={{ x: "-50%" }}
                    initial={{ x: "0%" }}
                    transition={{
                        ease: "linear",
                        duration: 50, // Slower speed specifically requested for readability
                        repeat: Infinity,
                        repeatType: "loop"
                    }}
                    style={{ width: "fit-content", display: "flex" }} // Ensure width fits content for smooth loop
                >
                    {marqueeList.map((t, i) => (
                        <div
                            key={`${t._id}-${i}`}
                            className="flex-shrink-0 w-[300px] md:w-[400px] p-8 bg-gray-50 rounded-2xl shadow-sm border border-gray-100 relative hover:shadow-md transition-shadow"
                        >
                            <Quote className="absolute top-6 right-6 text-primary/20 w-8 h-8" />
                            <div className="flex gap-1 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} className="fill-primary text-primary" />
                                ))}
                            </div>
                            <p className="text-gray-600 mb-6 italic leading-relaxed text-lg line-clamp-4">
                                "{t.content}"
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-xl shrink-0">
                                    {t.initial || (t.name ? t.name[0] : "C")}
                                </div>
                                <div>
                                    <h4 className="font-bold text-secondary text-lg truncate w-[180px]">{t.name}</h4>
                                    <p className="text-sm text-primary font-medium">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
