const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Package = require('./models/Package');
const Item = require('./models/Item');

dotenv.config();

connectDB();

const services = [
    { name: "Luxury Wedding Package", description: "Complete wedding decoration with flowers, lighting, and stage.", price: 5000, images: ["/images/wedding.png"], isFeatured: true },
    { name: "Corporate Event Setup", description: "Professional stage and seating setup for conferences.", price: 3500, images: ["/images/corporate.png"], isFeatured: true },
    { name: "Birthday Party Standard", description: "Fun and colorful decoration for birthday parties.", price: 1500, images: ["/images/birthday.png"], isFeatured: false },
    { name: "Funeral Decor Service", description: "Respectful and dignified funeral setting.", price: 2000, images: ["/images/funeral.png"], isFeatured: false },
];

const inventory = [
    { name: "Gold Phoenix Chair", category: "Chairs", pricePerDay: 25, quantity: 200, images: ["/images/chair-gold.png"], isFeatured: true },
    { name: "Marquee Tent", category: "Tents", pricePerDay: 500, quantity: 5, images: ["/images/tent.png"], isFeatured: true },
    { name: "Flower Wall", category: "Backdrops", pricePerDay: 300, quantity: 2, images: ["/images/flower-wall.png"], isFeatured: true },
    { name: "LED Lights", category: "Lighting", pricePerDay: 50, quantity: 20, images: ["/images/lights.png"], isFeatured: false },
    { name: "Round Table", category: "Tables", pricePerDay: 40, quantity: 15, images: ["/images/table-round.png"], isFeatured: false },
];

const importData = async () => {
    try {
        await Package.deleteMany();
        await Item.deleteMany();

        await Package.insertMany(services);
        await Item.insertMany(inventory);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
