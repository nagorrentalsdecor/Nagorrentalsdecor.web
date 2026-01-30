"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const Hero = () => {
    const [content, setContent] = useState<any>(null);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await fetch('/api/content');
                const data = await res.json();
                if (data.hero) setContent(data.hero);
            } catch (err) {
                console.error(err);
            }
        };
        fetchContent();
    }, []);

    const hero = content || {
        badge: "Premium Event Rentals",
        title: "Elevate Your Events with Elegance",
        subtitle: "Nagor Rental & Decor transforms ordinary spaces into extraordinary experiences. From luxury weddings to corporate galas, we bring your vision to life.",
        ctaPrimary: "Explore Services",
        ctaSecondary: "Rent Items"
    };

    return (
        <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/images/hero-bg.png')" }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40"></div> {/* Reduced Overlay */}
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white flex flex-col items-center pt-32 pb-20 sm:py-0">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    className="mb-3 sm:mb-4 inline-block px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-xs sm:text-sm font-medium tracking-widest uppercase"
                >
                    {hero.badge}
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="text-white/90 font-heading text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-3 sm:mb-4"
                >
                    Reliable Rentals, Remarkable Decor
                </motion.p>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-heading font-bold mb-6 sm:mb-8 leading-tight drop-shadow-2xl px-2"
                >
                    {hero.title.split(' with ').map((part: string, i: number) => (
                        <span key={i}>
                            {i === 1 ? <><br className="hidden sm:block" /> <span className="sm:inline">with </span><span className="italic text-gradient-primary">{part}</span></> : part}
                        </span>
                    ))}
                    {!hero.title.includes(' with ') && hero.title}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-base sm:text-lg md:text-xl lg:text-2xl font-body font-light max-w-3xl mx-auto mb-8 sm:mb-12 text-gray-100/90 leading-relaxed px-4"
                >
                    {hero.subtitle}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 w-full max-w-md mx-auto px-4"
                >
                    <Link
                        href="/services"
                        className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-primary text-white text-base sm:text-lg font-bold rounded-full overflow-hidden shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] transition-all transform hover:-translate-y-1"
                    >
                        <span className="relative z-10">{hero.ctaPrimary}</span>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    </Link>
                    <Link
                        href="/rentals"
                        className="px-6 sm:px-8 py-3 sm:py-4 bg-white/5 backdrop-blur-md border border-white/30 text-white text-base sm:text-lg font-medium rounded-full hover:bg-white hover:text-secondary transition-all shadow-lg transform hover:-translate-y-1"
                    >
                        {hero.ctaSecondary}
                    </Link>
                </motion.div>
            </div>


            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-6 sm:bottom-10 left-1/2 transform -translate-x-1/2 hidden sm:block"
            >
                <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center pt-2 opacity-70">
                    <div className="w-1 h-2 bg-white rounded-full"></div>
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;
