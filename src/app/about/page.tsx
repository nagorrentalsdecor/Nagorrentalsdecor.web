"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Image from "next/image";

const AboutPage = () => {
    const [siteContent, setSiteContent] = useState<any>(null);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await fetch('/api/content');
                const data = await res.json();
                setSiteContent(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchContent();
    }, []);

    const about = siteContent?.about || {
        title: "Who We Are",
        heading: "Crafting Unforgettable Experiences Since 2015",
        paragraphs: [
            "Nagor Rental & Decor is a premier event styling and rental company based in Accra, Ghana. We specialize in transforming ordinary spaces into breathtaking environments that reflect our clients' unique style and vision.",
            "Whether you are planning an intimate wedding, a grand corporate gala, or a lively birthday party, our team of experienced designers and logistics experts works tirelessly to ensure every detail is perfect.",
            "We pride ourselves on our extensive inventory of high-quality furniture, lighting, and decor props, allowing us to offer competitive pricing without compromising on style or elegance."
        ],
        stats: [
            { label: "Events Executed", value: "500+" },
            { label: "Client Satisfaction", value: "100%" }
        ]
    };

    return (
        <main className="min-h-screen bg-background text-secondary">
            <Navbar />

            {/* Header */}
            <div className="pt-40 pb-20 bg-secondary text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-secondary to-secondary/80"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-heading font-bold mb-4"
                    >
                        About Us
                    </motion.h1>
                    <p className="text-gray-300 max-w-2xl mx-auto text-lg">
                        Discover the passion and creativity behind Nagor Rental & Decor.
                    </p>
                </div>
            </div>

            <section className="py-24 container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center gap-16">
                    {/* Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="w-full md:w-1/2"
                    >
                        <div className="relative h-[600px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white">
                            <Image
                                src="/images/wedding.png"
                                alt="Our Team at Work"
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6 mt-6">
                            <div className="relative h-56 rounded-3xl overflow-hidden shadow-xl group">
                                <Image src="/images/corporate.png" alt="Corporate Event" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div className="relative h-56 rounded-3xl overflow-hidden shadow-xl group">
                                <Image src="/images/birthday.png" alt="Birthday setup" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Content */}
                    <div className="w-full md:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h4 className="text-primary font-bold tracking-[0.2em] uppercase mb-3 text-sm">{about.title}</h4>
                            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-8 text-secondary leading-tight">
                                {about.heading}
                            </h2>
                            <div className="space-y-6 text-gray-600 font-body text-lg leading-relaxed mb-10">
                                {about.paragraphs.map((p: string, i: number) => (
                                    <p key={i}>{p}</p>
                                ))}
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                {about.stats.map((stat: any, i: number) => (
                                    <div key={i} className="p-6 bg-gray-50 rounded-2xl text-center border border-gray-100 shadow-sm">
                                        <span className="block text-4xl font-bold text-primary mb-2">{stat.value}</span>
                                        <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">{stat.label}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
};

export default AboutPage;
