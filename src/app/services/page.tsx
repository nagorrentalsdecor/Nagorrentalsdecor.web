"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionTitle from "@/components/ui/SectionTitle";
import ServiceCard from "@/components/features/ServiceCard";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const ServicesPage = () => {
    const [services, setServices] = useState<any[]>([]);
    const [siteContent, setSiteContent] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resPackages, resContent] = await Promise.all([
                    fetch('/api/packages'),
                    fetch('/api/content')
                ]);

                if (resPackages.ok) {
                    const data = await resPackages.json();
                    setServices(data);
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

    const servicesPage = siteContent?.servicesPage || {
        title: "Our Services",
        subtitle: "We offer a wide range of decoration services tailored to your specific event needs, ensuring every detail is perfect."
    };

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
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Header */}
            <div className="pt-32 pb-20 bg-gray-900 text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/10"></div>
                {/* Decorative circles */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">{servicesPage.title}</h1>
                        <p className="text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">
                            {servicesPage.subtitle}
                        </p>
                    </motion.div>
                </div>
            </div>

            <section className="py-24 container mx-auto px-4">
                <motion.div
                    variants={container}
                    initial="show"
                    animate="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {services.map((service) => (
                        <motion.div key={service._id || service.id} variants={item}>
                            <ServiceCard
                                title={service.name}
                                description={service.description}
                                image={service.images?.[0] || service.image || "/images/placeholder.png"}
                                price={service.price}
                                link="/book"
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            <Footer />
        </main>
    );
};

export default ServicesPage;
