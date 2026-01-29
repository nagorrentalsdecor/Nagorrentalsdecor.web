"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function TermsPage() {
    const [terms, setTerms] = useState<any>(null);

    useEffect(() => {
        const fetchTerms = async () => {
            try {
                const res = await fetch("/api/content");
                const data = await res.json();
                if (data.termsOfService) setTerms(data.termsOfService);
            } catch (err) {
                console.error(err);
            }
        };
        fetchTerms();
    }, []);

    if (!terms) return <div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>;

    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <div className="pt-32 pb-16 bg-gray-900 text-white text-center">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-heading font-bold mb-4">Terms of Service</h1>
                </div>
            </div>
            <div className="container mx-auto px-4 py-16 max-w-4xl text-gray-600 space-y-6 font-body">
                <p>Last updated: {terms.lastUpdated}</p>
                {terms.sections.map((section: any, idx: number) => (
                    <div key={idx} className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 font-heading">{section.title}</h2>
                        <p className="leading-relaxed">
                            {section.content}
                        </p>
                    </div>
                ))}
            </div>
            <Footer />
        </main>
    );
}
