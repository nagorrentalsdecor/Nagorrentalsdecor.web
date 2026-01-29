"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Send, MapPin, Phone, Mail, Loader2 } from "lucide-react";

const ContactPage = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
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

    const contact = siteContent?.contact || {
        address: "Ashaiman Lebanon & Tema Community 22 Annex",
        phone: "0244 594 702 (WhatsApp)",
        phoneSecondary: "0554 884 954",
        email: "nagorrentalsdecor@gmail.com",
        workingHours: "Mon - Sat: 8:00 AM - 6:00 PM"
    };

    return (
        <main className="min-h-screen bg-gray-50 text-secondary">
            <Navbar />

            {/* Header */}
            <div className="pt-40 pb-20 bg-gray-900 text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/10"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">Contact Us</h1>
                        <p className="text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">
                            Get in touch with us to discuss your upcoming event or rental needs. We are here to help make your vision a reality.
                        </p>
                    </motion.div>
                </div>
            </div>

            <section className="py-24 container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 text-gray-900">Let&apos;s Talk</h2>
                        <p className="text-gray-600 mb-12 font-body text-lg leading-relaxed">
                            We'd love to hear from you! Fill out the form or reach us directly via phone or email.
                            Our office is open {contact.workingHours}.
                        </p>

                        <div className="space-y-6">
                            <motion.div
                                whileHover={{ x: 10 }}
                                className="flex items-start p-6 bg-white rounded-2xl shadow-sm border border-gray-100 transition-all group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0 mr-5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900 mb-1">Our Location</h4>
                                    <p className="text-gray-600">{contact.address}</p>
                                </div>
                            </motion.div>

                            <motion.div
                                whileHover={{ x: 10 }}
                                className="flex items-start p-6 bg-white rounded-2xl shadow-sm border border-gray-100 transition-all group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 flex-shrink-0 mr-5 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900 mb-1">Phone Number</h4>
                                    <p className="text-gray-600">{contact.phone}<br />{contact.phoneSecondary}</p>
                                </div>
                            </motion.div>

                            <motion.div
                                whileHover={{ x: 10 }}
                                className="flex items-start p-6 bg-white rounded-2xl shadow-sm border border-gray-100 transition-all group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0 mr-5 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900 mb-1">Email Address</h4>
                                    <p className="text-gray-600">{contact.email}</p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100"
                    >
                        <h3 className="text-2xl font-bold mb-8 text-gray-900">Send a Message</h3>
                        <form className="space-y-6" onSubmit={async (e) => {
                            e.preventDefault();
                            setIsSubmitting(true);
                            const formData = new FormData(e.target as HTMLFormElement);
                            const data = {
                                name: formData.get("name"),
                                email: formData.get("email"),
                                phone: formData.get("phone"),
                                subject: formData.get("subject"),
                                message: formData.get("message")
                            };

                            try {
                                const { createMessage } = await import("@/lib/api");
                                await createMessage(data);
                                alert("Message Sent! We will get back to you soon.");
                                (e.target as HTMLFormElement).reset();
                            } catch (error) {
                                alert("Failed to send message. Please try again.");
                            } finally {
                                setIsSubmitting(false);
                            }
                        }}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                                    <input
                                        required
                                        name="name"
                                        type="text"
                                        id="name"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                    <input
                                        required
                                        name="email"
                                        type="email"
                                        id="email"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                                    <input
                                        required
                                        name="phone"
                                        type="tel"
                                        id="phone"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        placeholder="054 123 4567"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                                <input
                                    required
                                    name="subject"
                                    type="text"
                                    id="subject"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    placeholder="Inquiry about Wedding Decor"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                                <textarea
                                    required
                                    name="message"
                                    id="message"
                                    rows={5}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                                    placeholder="Tell us more about your event..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition-all shadow-lg shadow-primary/25 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center transform active:scale-[0.98]"
                            >
                                {isSubmitting ? (
                                    <Loader2 size={20} className="mr-2 animate-spin" />
                                ) : (
                                    <Send size={20} className="mr-2" />
                                )}
                                {isSubmitting ? "Sending..." : "Send Message"}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </main >
    );
};

export default ContactPage;
