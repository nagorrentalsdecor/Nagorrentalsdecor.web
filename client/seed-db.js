const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data.json');

const initialServices = [
    {
        _id: "pkg_1",
        name: "Luxury Wedding Package",
        description: "Complete hall decoration with premium stage styling, lighting, and royal throne setup.",
        price: 5000,
        images: ["/images/rental-backdrop-red.jpg"],
        isFeatured: true
    },
    {
        _id: "pkg_2",
        name: "Corporate Event Setup",
        description: "Professional stage, PA system integration, branding backdrop, and VIP seating. Perfect for conferences, galas, and award nights.",
        price: 3500,
        images: ["/images/corporate.png"],
        isFeatured: true
    },
    {
        _id: "pkg_3",
        name: "Birthday Party Standard",
        description: "Balloon arch, backdrop, cake table decor, and mood lighting. Make your birthday celebration vibrant and memorable.",
        price: 1500,
        images: ["/images/birthday.png"],
        isFeatured: true
    },
    {
        _id: "pkg_4",
        name: "Funeral Decor Service",
        description: "Respectful and elegant setup with tents, chairs, and fresh flowers. We provide a dignified setting for saying goodbye.",
        price: 2000,
        images: ["/images/funeral.png"],
        isFeatured: false
    },
    {
        _id: "pkg_5",
        name: "Private Dinners",
        description: "Intimate settings for anniversaries or proposals with candlelit tables and subtle floral arrangements.",
        price: 1200,
        images: ["/images/table-round.png"],
        isFeatured: false
    }
];

const initialItems = [
    {
        _id: "item_1",
        name: "Gold Phoenix Chair",
        category: "Chairs",
        pricePerDay: 25,
        quantity: 200,
        images: ["/images/chair-gold.png"]
    },
    {
        _id: "item_2",
        name: "Marquee Tent (Canopy)",
        category: "Tents",
        pricePerDay: 500,
        quantity: 5,
        images: ["/images/tent.png"]
    },
    {
        _id: "item_3",
        name: "Luxury Floral Backdrop",
        category: "Backdrops",
        pricePerDay: 450,
        quantity: 2,
        images: ["/images/rental-backdrop-red.jpg"]
    },
    {
        _id: "item_4",
        name: "LED Mood Lights",
        category: "Lighting",
        pricePerDay: 50,
        quantity: 20,
        images: ["/images/lights.png"]
    },
    {
        _id: "item_5",
        name: "Round 10-Seater Table",
        category: "Tables",
        pricePerDay: 40,
        quantity: 30,
        images: ["/images/table-round.png"]
    },
    {
        _id: "item_6",
        name: "Royal Throne Chairs (Pair)",
        category: "Chairs",
        pricePerDay: 350,
        quantity: 4,
        images: ["/images/rental-throne-chairs.jpg"]
    },
    {
        _id: "item_7",
        name: "Crystal Candelabra",
        category: "Decor",
        pricePerDay: 80,
        quantity: 10,
        images: ["/images/rental-candelabra.jpg"]
    },
    {
        _id: "item_8",
        name: "Red Carpet Runner",
        category: "Flooring",
        pricePerDay: 150,
        quantity: 6,
        images: ["/images/rental-red-carpet.jpg"]
    },
    {
        _id: "item_9",
        name: "Artificial Grass Turf",
        category: "Flooring",
        pricePerDay: 120,
        quantity: 20,
        images: ["/images/rental-grass-turf.jpg"]
    }
];

// Read existing DB to preserve bookings/messages if any
let db = { bookings: [], messages: [], packages: [], items: [], settings: {} };

try {
    if (fs.existsSync(DB_PATH)) {
        const raw = fs.readFileSync(DB_PATH, 'utf-8');
        const existing = JSON.parse(raw);
        db = { ...db, ...existing }; // Merge safely
    }
} catch (e) {
    console.log("No existing DB found or error reading it. Creating new.");
}

// Only overwrite packages and items if they are empty
if (!db.packages || db.packages.length === 0) {
    console.log("Seeding packages...");
    db.packages = initialServices;
} else {
    console.log("Packages already exist. Skipping package seed.");
}

if (!db.items || db.items.length === 0) {
    console.log("Seeding items...");
    db.items = initialItems;
} else {
    console.log("Items already exist. Skipping item seed.");
}

// Save back
fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
console.log("Database seeded successfully!");
