"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function NotFound() {
    return (
        <main className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-9xl font-heading font-bold text-primary opacity-20">404</h1>
                <h2 className="text-4xl font-bold text-gray-800 -mt-10 mb-4">Page Not Found</h2>
                <p className="text-gray-500 max-w-md mb-8">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>
                <Link
                    href="/"
                    className="px-8 py-3 bg-primary text-white rounded-full font-bold hover:bg-primary-hover transition-all shadow-lg"
                >
                    Go Back Home
                </Link>
            </div>
            <Footer />
        </main>
    );
}
