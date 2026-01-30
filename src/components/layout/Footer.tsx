"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
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
        email: "nagorrentalsdecor@gmail.com"
    };

    return (
        <footer className="bg-secondary text-white pt-24 pb-12 relative overflow-hidden mt-0">
            {/* Golden Top Border */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-primary"></div>

            {/* Decorative Background */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="container mx-auto px-4 sm:px-6 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12 sm:mb-16 text-center sm:text-left">
                    {/* Brand Info */}
                    <div className="space-y-4 sm:space-y-6 flex flex-col items-center sm:items-start">
                        <Link href="/" className="inline-block">
                            <h2 className="text-2xl sm:text-3xl font-heading font-bold tracking-tight">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-200">Nagor</span>
                                <span className="text-white"> Rental & Decor</span>
                            </h2>
                            <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-500 mt-1">
                                Reliable Rentals, Remarkable Decor
                            </p>
                        </Link>
                        <p className="text-gray-400 font-body leading-relaxed text-sm max-w-xs mx-auto sm:mx-0">
                            {siteContent?.footer?.description || "Premium event decoration and equipment rental services in Ghana. Making your special moments unforgettable with elegance, style, and reliability."}
                        </p>
                        <div className="flex space-x-4 pt-2">
                            <a href="https://instagram.com/nagorrentalsdecor" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all text-white group">
                                <Instagram size={18} className="group-hover:scale-110 transition-transform" />
                            </a>
                            <a href="https://tiktok.com/@nagorrentals_decor" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-black hover:border-black transition-all text-white font-bold group overflow-hidden relative" aria-label="TikTok">
                                <Image
                                    src="/images/tiktok.png"
                                    alt="TikTok"
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform"
                                />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-heading font-bold mb-4 sm:mb-6 text-white border-b border-primary/30 pb-2 inline-block">Quick Links</h3>
                        <ul className="space-y-3 font-body text-gray-400 flex flex-col items-center sm:items-start">
                            <li><Link href="/" className="hover:text-primary transition-colors flex items-center"><span className="hidden sm:block w-1.5 h-1.5 bg-primary rounded-full mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>Home</Link></li>
                            <li><Link href="/services" className="hover:text-primary transition-colors flex items-center"><span className="hidden sm:block w-1.5 h-1.5 bg-primary rounded-full mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>Decoration Services</Link></li>
                            <li><Link href="/rentals" className="hover:text-primary transition-colors flex items-center"><span className="hidden sm:block w-1.5 h-1.5 bg-primary rounded-full mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>Rental Items</Link></li>
                            <li><Link href="/about" className="hover:text-primary transition-colors flex items-center"><span className="hidden sm:block w-1.5 h-1.5 bg-primary rounded-full mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors flex items-center"><span className="hidden sm:block w-1.5 h-1.5 bg-primary rounded-full mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>Contact</Link></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-lg font-heading font-bold mb-4 sm:mb-6 text-white border-b border-primary/30 pb-2 inline-block">Our Services</h3>
                        <ul className="space-y-3 font-body text-gray-400 flex flex-col items-center sm:items-start">
                            <li><Link href="/services" className="hover:text-primary transition-colors flex items-center"><span className="hidden sm:block w-1.5 h-1.5 bg-primary rounded-full mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>Wedding Decoration</Link></li>
                            <li><Link href="/services" className="hover:text-primary transition-colors flex items-center"><span className="hidden sm:block w-1.5 h-1.5 bg-primary rounded-full mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>Corporate Events</Link></li>
                            <li><Link href="/services" className="hover:text-primary transition-colors flex items-center"><span className="hidden sm:block w-1.5 h-1.5 bg-primary rounded-full mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>Birthday Parties</Link></li>
                            <li><Link href="/services" className="hover:text-primary transition-colors flex items-center"><span className="hidden sm:block w-1.5 h-1.5 bg-primary rounded-full mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>Engagements</Link></li>
                            <li><Link href="/services" className="hover:text-primary transition-colors flex items-center"><span className="hidden sm:block w-1.5 h-1.5 bg-primary rounded-full mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>Private Parties</Link></li>
                            <li><Link href="/services" className="hover:text-primary transition-colors flex items-center"><span className="hidden sm:block w-1.5 h-1.5 bg-primary rounded-full mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>Funeral Decor</Link></li>
                            <li><Link href="/rentals" className="hover:text-primary transition-colors flex items-center"><span className="hidden sm:block w-1.5 h-1.5 bg-primary rounded-full mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>Equipment Rental</Link></li>
                            <li><Link href="/services" className="hover:text-primary transition-colors flex items-center"><span className="hidden sm:block w-1.5 h-1.5 bg-primary rounded-full mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>etc</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-heading font-bold mb-4 sm:mb-6 text-white border-b border-primary/30 pb-2 inline-block">Contact Us</h3>
                        <ul className="space-y-5 font-body text-gray-400 flex flex-col items-center sm:items-start">
                            <li className="flex items-start group text-center sm:text-left">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary mr-0 sm:mr-3 mb-2 sm:mb-0 flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                                    <MapPin size={16} />
                                </div>
                                <span className="text-sm max-w-[200px] sm:max-w-none">{contact.address}</span>
                            </li>
                            <li className="flex items-center group flex-col sm:flex-row">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary mr-0 sm:mr-3 mb-2 sm:mb-0 flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                                    <Phone size={16} />
                                </div>
                                <div className="flex flex-col text-sm text-center sm:text-left">
                                    <span>{contact.phone}</span>
                                    {contact.phoneSecondary && <span>{contact.phoneSecondary}</span>}
                                </div>
                            </li>
                            <li className="flex items-center group flex-col sm:flex-row">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary mr-0 sm:mr-3 mb-2 sm:mb-0 flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                                    <Mail size={16} />
                                </div>
                                <span className="text-sm">{contact.email}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Separator */}
                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 font-body">
                    <p>&copy; {new Date().getFullYear()} Nagor Rental & Decor. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
