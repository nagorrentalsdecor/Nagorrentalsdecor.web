import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data.json');

const INITIAL_DATA = {
    "bookings": [
        {
            "customerName": "Louis Kemenyo",
            "email": "louiskemenyo@gmail.com",
            "phone": "0541718716",
            "eventDate": "2026-01-28",
            "eventType": "Wedding",
            "items": [
                {
                    "id": "1",
                    "name": "Gold Phoenix Chair",
                    "category": "Chairs",
                    "price": 25,
                    "quantity": 2,
                    "image": "/images/chair-gold.png"
                },
                {
                    "id": "2",
                    "name": "Marquee Tent",
                    "category": "Tents",
                    "price": 500,
                    "quantity": 1,
                    "image": "/images/tent.png"
                }
            ],
            "totalAmount": 550,
            "status": "Approved",
            "location": "Tema community 22 Annex, Accra",
            "notes": "",
            "_id": "vctvf9hyv",
            "createdAt": "2026-01-27T21:13:26.352Z"
        },
        {
            "customerName": "Louis Kemenyo",
            "phone": "0541718716",
            "email": "louiskemenyo@gmail.com",
            "eventType": "Wedding",
            "eventDate": "2026-12-12",
            "location": "Saki & Afariwa(weekends)",
            "selectedPackage": "Full Decoration Package",
            "rentedItems": [],
            "totalCost": 0,
            "status": "Cancelled",
            "_id": "rugrqgwcz",
            "createdAt": "2026-01-27T17:42:08.986Z"
        }
    ],
    "messages": [
        {
            "name": "louis kemenyo",
            "email": "louiskemenyo@gmail.com",
            "subject": "inquiry on wedding same day package",
            "message": "inquiry on wedding same day package",
            "phone": "0541718716",
            "_id": "nplrav4h4",
            "createdAt": "2026-01-27T21:39:57.451Z",
            "isRead": false
        },
        {
            "_id": "msg_12345",
            "name": "Sarah Connor",
            "email": "sarah@skynet.com",
            "phone": "0555555555",
            "subject": "Inquiry about Wedding Package",
            "message": "Hi, I would like to know if the Luxury Wedding Package includes lighting?",
            "createdAt": "2026-01-27T10:00:00Z",
            "isRead": false
        }
    ],
    "packages": [
        {
            "_id": "1",
            "name": "Luxury Wedding Package",
            "description": "Complete wedding decoration with premium stage styling",
            "price": 5000,
            "images": [
                "/images/rental-backdrop-red.jpg"
            ],
            "isFeatured": true
        },
        {
            "_id": "2",
            "name": "Corporate Event Setup",
            "description": "Professional stage setup",
            "price": 3500,
            "images": [
                "/images/corporate.png"
            ],
            "isFeatured": true
        },
        {
            "_id": "3",
            "name": "Birthday Party Standard",
            "description": "Fun and colorful decoration",
            "price": 1500,
            "images": [
                "/images/birthday.png"
            ],
            "isFeatured": false
        },
        {
            "_id": "4",
            "name": "Funeral Decor Service",
            "description": "Respectful setting",
            "price": 2000,
            "images": [
                "/images/funeral.png"
            ],
            "isFeatured": false
        },
        {
            "name": "Wedding Reception",
            "description": "",
            "price": 29999,
            "images": [
                "/images/wedding.png"
            ],
            "isFeatured": true,
            "_id": "mrors1jo4"
        }
    ],
    "items": [
        {
            "_id": "1",
            "name": "Gold Phoenix Chair",
            "category": "Chairs",
            "pricePerDay": 25,
            "quantity": 200,
            "images": [
                "/images/chair-gold.png"
            ],
            "isFeatured": true
        },
        {
            "_id": "2",
            "name": "Marquee Tent",
            "category": "Tents",
            "pricePerDay": 500,
            "quantity": 3,
            "images": [
                "/images/tent.png"
            ],
            "isFeatured": true
        },
        {
            "_id": "3",
            "name": "Luxury Floral Backdrop",
            "category": "Backdrops",
            "pricePerDay": 450,
            "quantity": 20,
            "images": [
                "/images/rental-backdrop-red.jpg"
            ],
            "isFeatured": true
        },
        {
            "_id": "4",
            "name": "LED Lights",
            "category": "Lighting",
            "pricePerDay": 50,
            "quantity": 20,
            "images": [
                "/images/lights.png"
            ],
            "isFeatured": false
        },
        {
            "_id": "5",
            "name": "Round Table",
            "category": "Tables",
            "pricePerDay": 40,
            "quantity": 47,
            "images": [
                "/images/table-round.png"
            ],
            "isFeatured": false
        },
        {
            "name": "Royal Throne Chairs (Pair)",
            "category": "Chairs",
            "pricePerDay": 350,
            "quantity": 44,
            "images": [
                "/images/rental-throne-chairs.jpg"
            ],
            "_id": "8orgxkazx",
            "isFeatured": true
        },
        {
            "name": "Crystal Candelabra",
            "category": "Decor",
            "pricePerDay": 80,
            "quantity": 10,
            "images": [
                "/images/rental-candelabra.jpg"
            ],
            "_id": "newitem1",
            "isFeatured": true
        },
        {
            "name": "Red Carpet Runner",
            "category": "Flooring",
            "pricePerDay": 150,
            "quantity": 6,
            "images": [
                "/images/rental-red-carpet.jpg"
            ],
            "_id": "newitem2",
            "isFeatured": false
        },
        {
            "name": "Artificial Grass Turf",
            "category": "Flooring",
            "pricePerDay": 120,
            "quantity": 20,
            "images": [
                "/images/rental-grass-turf.jpg"
            ],
            "_id": "newitem3",
            "isFeatured": false
        }
    ],
    "settings": {
        "siteName": "Nagor Rental & Decor",
        "contactEmail": "info@nagor.com",
        "paymentPaystack": true,
        "paymentMomo": true,
        "notifyEmail": true,
        "notifyWhatsapp": true,
        "notifyDaily": true
    },
    "users": [
        {
            "_id": "admin_001",
            "name": "Super Admin",
            "email": "admin@nagor.com",
            "password": "admin123",
            "role": "Super Admin",
            "isFirstLogin": true
        },
        {
            "_id": "e8rsi00z5",
            "name": "louis Kemenyo",
            "email": "louiskemenyo@gmail.com",
            "role": "Admin",
            "password": "Quekubrymiz@23",
            "isFirstLogin": false,
            "createdAt": "2026-01-27T22:55:15.182Z"
        }
    ],
    "testimonials": [
        {
            "_id": "1",
            "name": "Sarah Osei",
            "role": "Bride",
            "content": "Nagor Rental & Decor made my wedding absolutely magical! The floral arrangements were breathtaking, and the gold phoenix chairs added such a regal touch. Highly recommended!",
            "initial": "S"
        },
        {
            "_id": "2",
            "name": "Kwame Mensah",
            "role": "Event Planner",
            "content": "I've worked with many vendors, but the professionalism and quality of items from Nagor are unmatched. Their delivery is always on time, and the items are in pristine condition.",
            "initial": "K"
        },
        {
            "_id": "3",
            "name": "Ama Boateng",
            "role": "Birthday Celebrant",
            "content": "The decoration for my 30th birthday was stunning. The mood lighting transformed the venue completely. Thank you for making my day so special!",
            "initial": "A"
        },
        {
            "_id": "4",
            "name": "Jessica & David",
            "role": "Couple",
            "content": "We were blown away by the attention to detail. Every single chair, table, and light was placed perfectly. Our guests couldn't stop talking about the decor.",
            "initial": "J"
        }
    ],
    "content": {
        "hero": {
            "badge": "Premium Event Rentals",
            "title": "Elevate Your Events with Elegance",
            "subtitle": "Nagor Rental & Decor transforms ordinary spaces into breathtaking environments. From luxury weddings to corporate galas, we bring your vision to life.",
            "ctaPrimary": "Explore Services",
            "ctaSecondary": "Rent Items"
        },
        "whyChooseUs": {
            "title": "Why Nagor?",
            "description": "We don't just supply equipment; we supply peace of mind. With over 5 years of experience in the Ghanaian event industry, we understand that reliability is just as important as aesthetics.",
            "benefits": [
                "Premium quality furniture and tents",
                "On-time delivery and setup guarantee",
                "Professional styling advice included",
                "Competitive pricing with no hidden fees"
            ]
        },
        "about": {
            "title": "Who We Are",
            "heading": "Crafting Unforgettable Experiences Since 2015",
            "paragraphs": [
                "Nagor Rental & Decor is a premier event styling and rental company based in Accra, Ghana. We specialize in transforming ordinary spaces into breathtaking environments that reflect our clients' unique style and vision.",
                "Whether you are planning an intimate wedding, a grand corporate gala, or a lively birthday party, our team of experienced designers and logistics experts works tirelessly to ensure every detail is perfect.",
                "We pride ourselves on our extensive inventory of high-quality furniture, lighting, and decor props, allowing us to offer competitive pricing without compromising on style or elegance."
            ],
            "stats": [
                {
                    "label": "Events Executed",
                    "value": "500+"
                },
                {
                    "label": "Client Satisfaction",
                    "value": "100%"
                }
            ]
        },
        "contact": {
            "address": "Ashaiman Lebanon & Tema Community 22 Annex",
            "phone": "0244 594 702 (WhatsApp)",
            "phoneSecondary": "0554 884 954",
            "email": "nagorrentalsdecor@gmail.com",
            "workingHours": "Mon - Sat: 8:00 AM - 6:00 PM"
        },
        "servicesPage": {
            "title": "Our Services",
            "subtitle": "We offer a wide range of decoration services tailored to your specific event needs, ensuring every detail is perfect."
        },
        "rentalsPage": {
            "title": "Rental Essentials",
            "subtitle": "Browse our collection of premium event furniture, tents, and decor accessories for your next celebration."
        },
        "footer": {
            "description": "Premium event decoration and equipment rental services in Ghana. Making your special moments unforgettable with elegance, style, and reliability."
        },
        "homeCTA": {
            "title": "Ready to Transform Your Event?",
            "subtitle": "From intimate gatherings to grand celebrations, we have the perfect inventory for you.",
            "primaryBtn": "Book Consultation",
            "secondaryBtn": "WhatsApp Us"
        }
    }
};

export function getDB() {
    console.log("Loading DB from:", DB_PATH);
    if (!fs.existsSync(DB_PATH)) {
        console.warn(`DB file not found at ${DB_PATH}. Using initial data.`);
        // In read-only environments (like Netlify build), we cannot write.
        // fs.writeFileSync(DB_PATH, JSON.stringify(INITIAL_DATA, null, 2));
        return INITIAL_DATA;
    }
    const fileContent = fs.readFileSync(DB_PATH, 'utf-8');
    try {
        const data = JSON.parse(fileContent);
        console.log(`DB loaded successfully. Bookings: ${data.bookings?.length}, Packages: ${data.packages?.length}`);
        return data;
    } catch (e) {
        console.error("Error parsing DB JSON:", e);
        return INITIAL_DATA;
    }
}

export function saveDB(data: any) {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Failed to save DB (ReadOnly FS?):", e);
    }
}
