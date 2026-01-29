"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2, ArrowLeft, CheckCircle, CreditCard, Calendar, Truck, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
    const { items, totalAmount, updateQuantity, removeFromCart, clearCart } = useCart();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        eventDate: "",
        eventType: "Wedding",
        notes: ""
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call using our mock API logic
        try {
            const bookingData = {
                customerName: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                phone: formData.phone,
                eventDate: formData.eventDate,
                eventType: formData.eventType,
                items: items,
                totalAmount: totalAmount,
                status: "Pending",
                location: `${formData.address}, ${formData.city}`,
                notes: formData.notes
            };

            const { createBooking } = await import("@/lib/api");
            await createBooking(bookingData);

            // Clear cart and show success
            clearCart();
            alert("Booking request submitted successfully! We will contact you shortly.");
            router.push("/");
        } catch (error: any) {
            console.error("Booking failed", error);
            alert(error.message || "Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (items.length === 0) {
        return (
            <main className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center container mx-auto px-4 py-20 text-center">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                        <CreditCard size={40} className="text-gray-400" />
                    </div>
                    <h1 className="text-3xl font-heading font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
                    <p className="text-gray-500 max-w-md mb-8">
                        Looks like you haven't added any rental items yet. Browse our inventory to start planning your event.
                    </p>
                    <Link
                        href="/rentals"
                        className="px-8 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-hover transition-all"
                    >
                        Browse Rentals
                    </Link>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="pt-32 pb-20 container mx-auto px-4 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-8">Checkout</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Forms */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* Steps Indicator */}
                            <div className="flex items-center space-x-4 mb-8">
                                <div className={`flex items-center space-x-2 ${step >= 1 ? "text-primary" : "text-gray-400"}`}>
                                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? "bg-primary text-white" : "bg-gray-200"}`}>1</span>
                                    <span className="font-medium">Details</span>
                                </div>
                                <div className="w-12 h-0.5 bg-gray-200"></div>
                                <div className={`flex items-center space-x-2 ${step >= 2 ? "text-primary" : "text-gray-400"}`}>
                                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 2 ? "bg-primary text-white" : "bg-gray-200"}`}>2</span>
                                    <span className="font-medium">Confirm</span>
                                </div>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8"
                            >
                                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                    <User className="mr-2 text-primary" size={20} />
                                    Contact Information
                                </h2>

                                <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                                            <input
                                                required
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                                placeholder="John"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                                            <input
                                                required
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                                placeholder="Doe"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                            <input
                                                required
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                                            <input
                                                required
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                                placeholder="024 XXX XXXX"
                                            />
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-100 pt-6 mt-6">
                                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                            <Calendar className="mr-2 text-primary" size={20} />
                                            Event Details
                                        </h2>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Event Date</label>
                                                <input
                                                    required
                                                    type="date"
                                                    name="eventDate"
                                                    value={formData.eventDate}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Event Type</label>
                                                <select
                                                    name="eventType"
                                                    value={formData.eventType}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                                >
                                                    <option>Wedding</option>
                                                    <option>Birthday Party</option>
                                                    <option>Corporate Event</option>
                                                    <option>Funeral</option>
                                                    <option>Engagement</option>
                                                    <option>Other</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Event Location (City/Town)</label>
                                            <input
                                                required
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                                placeholder="e.g. Accra, Tema, Kumasi"
                                            />
                                        </div>

                                        <div className="mb-6">
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Specific Venue Address</label>
                                            <input
                                                required
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                                placeholder="e.g. Community 18, Block D"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Additional Notes</label>
                                            <textarea
                                                name="notes"
                                                value={formData.notes}
                                                onChange={handleInputChange}
                                                rows={3}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                                                placeholder="Any specific instructions or requests?"
                                            ></textarea>
                                        </div>
                                    </div>
                                </form>
                            </motion.div>
                        </div>

                        {/* Right Column - Order Summary */}
                        <div className="lg:col-span-1">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24"
                            >
                                <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>

                                <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                                    {items.map(item => (
                                        <div key={item.id} className="flex justify-between items-start text-sm">
                                            <div className="flex items-start">
                                                <span className="font-bold mr-2 text-gray-500">{item.quantity}x</span>
                                                <span className="text-gray-700">{item.name}</span>
                                            </div>
                                            <span className="font-medium text-gray-900">GH₵ {item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-gray-100 pt-4 space-y-2 mb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>GH₵ {totalAmount}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Delivery (Estimated)</span>
                                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">Pending</span>
                                    </div>
                                    <div className="flex justify-between text-gray-800 font-bold text-lg pt-2 border-t border-gray-100 mt-2">
                                        <span>Total Estimate</span>
                                        <span className="text-primary">GH₵ {totalAmount}</span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    form="checkout-form"
                                    disabled={isSubmitting}
                                    className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary-hover transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                                >
                                    {isSubmitting ? "Processing..." : "Place Booking Request"}
                                </button>

                                <p className="text-xs text-center text-gray-400 mt-4">
                                    By placing this order, you agree to our rental terms and conditions.
                                    Payment is not required now. We will contact you to confirm the booking.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
