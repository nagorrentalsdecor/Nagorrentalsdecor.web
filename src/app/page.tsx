"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/features/Hero";
import SectionTitle from "@/components/ui/SectionTitle";
import ServiceCard from "@/components/features/ServiceCard";
import ProductCard from "@/components/features/ProductCard";
import TestimonialSlider from "@/components/features/TestimonialSlider";
import Link from "next/link";
import { ArrowRight, Star, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

import { useState, useEffect } from "react";

export default function Home() {
  const [featuredServices, setFeaturedServices] = useState<any[]>([]);
  const [featuredRentals, setFeaturedRentals] = useState<any[]>([]);
  const [siteContent, setSiteContent] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching home page data...");

        // Fetch packages
        try {
          const res = await fetch("/api/packages");
          if (res.ok) {
            const data = await res.json();
            setFeaturedServices(Array.isArray(data) ? data.slice(0, 3) : []);
          }
        } catch (e) {
          console.error("Packages fetch error:", e);
        }

        // Fetch items
        try {
          const res = await fetch("/api/items");
          if (res.ok) {
            const data = await res.json();
            setFeaturedRentals(Array.isArray(data) ? data.slice(0, 4) : []);
          }
        } catch (e) {
          console.error("Items fetch error:", e);
        }

        // Fetch content
        try {
          const res = await fetch("/api/content");
          if (res.ok) {
            const data = await res.json();
            setSiteContent(data);
          }
        } catch (e) {
          console.error("Content fetch error:", e);
        }

      } catch (error) {
        console.error("General error in home data fetch", error);
      }
    };
    fetchData();
  }, []);

  const whyChooseUs = siteContent?.whyChooseUs || {
    title: "Why Nagor?",
    description: "We don't just supply equipment; we supply peace of mind. With over 5 years of experience in the Ghanaian event industry, we understand that reliability is just as important as aesthetics.",
    benefits: [
      "Premium quality furniture and tents",
      "On-time delivery and setup guarantee",
      "Professional styling advice included",
      "Competitive pricing with no hidden fees"
    ]
  };

  const homeCTA = siteContent?.homeCTA || {
    title: "Ready to Transform Your Event?",
    subtitle: "From intimate gatherings to grand celebrations, we have the perfect inventory for you.",
    primaryBtn: "Book Consultation",
    secondaryBtn: "WhatsApp Us"
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
    <main className="min-h-screen bg-white text-gray-800 overflow-x-hidden">
      <Navbar />

      <Hero initialContent={siteContent?.hero} />

      {/* Featured Services Section */}
      <section className="py-24 container mx-auto px-4 md:px-8 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionTitle
            title="Our Premium Services"
            subtitle="Designed to Impress"
            className="mb-16 text-center"
          />
        </motion.div>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"
        >
          {featuredServices.map((service) => (
            <div key={service._id || service.id}>
              <ServiceCard
                title={service.name}
                description={service.description}
                image={service.images?.[0] || service.image || "/images/placeholder.png"}
                price={service.price}
                link={"/book"}
              />
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/services"
            className="group inline-flex items-center px-8 py-3.5 bg-gray-900 text-white rounded-full font-bold shadow-lg hover:shadow-xl hover:bg-primary transition-all duration-300"
          >
            View All Services <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Featured Rentals Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative">
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionTitle
              title="Rental Essentials"
              subtitle="Quality Equipment"
              className="mb-16 text-center"
            />
          </motion.div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          >
            {featuredRentals.map((rental) => (
              <div key={rental._id || rental.id}>
                <ProductCard
                  id={rental._id || rental.id}
                  name={rental.name}
                  category={rental.category}
                  image={rental.images?.[0] || rental.image || "/images/placeholder.png"}
                  pricePerDay={rental.pricePerDay || rental.price}
                  availableQuantity={rental.quantity}
                />
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/rentals"
              className="group inline-flex items-center px-8 py-3.5 border-2 border-secondary text-secondary rounded-full font-bold hover:bg-secondary hover:text-white transition-all duration-300"
            >
              Browse Inventory <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us / Value Prop */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl relative z-10 border-4 border-white">
                <img src="/images/why-us-setup.jpg" alt="Event Setup" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl z-0"></div>
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl z-0"></div>
            </motion.div>
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6 text-secondary">
                  {whyChooseUs.title.includes('Nagor') ? (
                    <>{whyChooseUs.title.split('Nagor')[0]} <span className="text-gradient-primary">Nagor</span>{whyChooseUs.title.split('Nagor')[1]}</>
                  ) : whyChooseUs.title}
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-8 font-light">
                  {whyChooseUs.description}
                </p>
                <ul className="space-y-6">
                  {whyChooseUs.benefits.map((benefit: string, i: number) => (
                    <li key={i} className="flex items-center text-secondary font-medium text-lg">
                      <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4 shadow-sm">
                        <Star size={14} fill="currentColor" />
                      </span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white container mx-auto">
        <TestimonialSlider />
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent"></div>

        <motion.div
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-heading font-bold mb-6 text-white tracking-tight drop-shadow-md">{homeCTA.title}</h2>
            <p className="text-xl md:text-2xl font-body max-w-3xl mx-auto mb-12 text-white/95 font-light">
              {homeCTA.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link
                href="/contact"
                className="px-10 py-4 bg-white text-primary text-lg font-bold rounded-full hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center"
              >
                {homeCTA.primaryBtn}
              </Link>
              <Link
                href="https://wa.me/233244594702"
                className="px-10 py-4 bg-transparent border-2 border-white text-white text-lg font-bold rounded-full hover:bg-white/10 transition-all flex items-center justify-center backdrop-blur-sm"
              >
                <MessageCircle size={20} className="mr-2" />
                {homeCTA.secondaryBtn}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
