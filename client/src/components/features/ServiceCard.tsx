"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface ServiceCardProps {
    title: string;
    description: string;
    image: string;
    price?: number;
    link: string;
}

const ServiceCard = ({ title, description, image, price, link }: ServiceCardProps) => {
    return (
        <motion.div
            whileHover={{ y: -8 }}
            className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-[0_20px_50px_rgba(147,_51,_234,_0.07)] transition-all duration-500 border border-gray-100/50"
        >
            <div className="relative h-72 w-full overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

                <div className="absolute bottom-4 left-4 right-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100">
                    <Link
                        href={link}
                        className="w-full block text-center py-3 bg-white/90 backdrop-blur-sm text-secondary text-sm font-bold uppercase tracking-wider rounded shadow-lg hover:bg-white transition-colors"
                    >
                        View Details
                    </Link>
                </div>
            </div>

            <div className="p-8 relative z-10 bg-white">
                <h3 className="text-2xl font-heading font-bold mb-3 text-secondary group-hover:text-primary transition-colors">
                    {title}
                </h3>
                <p className="text-gray-500 mb-6 font-body leading-relaxed line-clamp-2">
                    {description}
                </p>

                <div className="flex justify-between items-end border-t border-gray-100 pt-6">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-1">Starting from</span>
                        {price ? (
                            <span className="text-xl font-bold text-gradient-primary">
                                GH₵ {price.toLocaleString()}
                            </span>
                        ) : (
                            <span className="text-lg font-bold text-gray-300">
                                Custom Quote
                            </span>
                        )}
                    </div>

                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                        <ArrowRight size={18} className="transform group-hover:-rotate-45 transition-transform duration-300" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ServiceCard;
