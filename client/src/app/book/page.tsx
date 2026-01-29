"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import { createBooking } from "@/lib/api";

const BookingPage = () => {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.target as HTMLFormElement);
        const data = {
            customerName: formData.get("customerName"),
            phone: formData.get("phone"),
            email: formData.get("email"), // Added email field
            eventType: formData.get("eventType"),
            eventDate: formData.get("eventDate"),
            location: formData.get("location"),
            selectedPackage: formData.get("serviceType"),
            rentedItems: [],
            totalCost: 0,
            status: "Pending"
        };

        try {
            await createBooking(data);
            setSubmitted(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (err) {
            console.error(err);
            setError("Failed to submit booking. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Header */}
            <div className="pt-32 pb-16 bg-secondary text-white text-center">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Book Now</h1>
                    <p className="text-gray-300 max-w-2xl mx-auto">
                        Secure your decoration package or rental items for your upcoming event.
                    </p>
                </div>
            </div>

            <section className="py-20 container mx-auto px-4">
                {submitted ? (
                    <div className="max-w-2xl mx-auto bg-white p-12 rounded-3xl shadow-xl text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                            <CheckCircle size={40} />
                        </div>
                        <h2 className="text-3xl font-heading font-bold text-secondary mb-4">Booking Received!</h2>
                        <p className="text-gray-600 mb-8 font-body">
                            Thank you for choosing Nagor Rental & Decor. We have received your booking request and will contact you shortly to confirm details and pricing.
                        </p>
                        <button
                            onClick={() => setSubmitted(false)}
                            className="px-8 py-3 bg-secondary text-white rounded-full font-medium hover:bg-primary transition-colors"
                        >
                            Make Another Booking
                        </button>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="md:flex">
                            <div className="md:w-1/3 bg-primary text-secondary p-8 hidden md:block">
                                <h3 className="text-2xl font-bold mb-6">Why Book With Us?</h3>
                                <ul className="space-y-4 text-sm font-medium">
                                    <li className="flex items-center">
                                        <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                                        Premium Quality Items
                                    </li>
                                    <li className="flex items-center">
                                        <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                                        Professional Setup
                                    </li>
                                    <li className="flex items-center">
                                        <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                                        Timely Delivery
                                    </li>
                                    <li className="flex items-center">
                                        <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                                        Competitive Pricing
                                    </li>
                                </ul>
                            </div>

                            <div className="md:w-2/3 p-8 md:p-12">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <h3 className="text-2xl font-bold text-secondary mb-6">Event Details</h3>

                                    {error && (
                                        <div className="p-4 bg-red-100 text-red-700 rounded-lg text-sm">
                                            {error}
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                                            <input name="customerName" required type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                            <input name="phone" required type="tel" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                        <input name="email" type="email" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none" />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
                                            <select name="eventType" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none">
                                                <option>Wedding</option>
                                                <option>Birthday Party</option>
                                                <option>Corporate Event</option>
                                                <option>Funeral</option>
                                                <option>Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Event Date</label>
                                            <input name="eventDate" required type="date" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Event Location</label>
                                        <input name="location" required type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none" placeholder="Venue Address or City" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Service Interested In</label>
                                        <select name="serviceType" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none">
                                            <option>Full Decoration Package</option>
                                            <option>Item Rental Only</option>
                                            <option>Consultation</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Additional Details</label>
                                        <textarea name="details" rows={3} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none" placeholder="Specific items needed, color themes, location..."></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-4 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover transition-colors shadow-lg transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                                    >
                                        {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : null}
                                        {loading ? "Submitting..." : "Submit Booking Request"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            <Footer />
        </main>
    );
};

export default BookingPage;
