const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase URL and Anon Key are required in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function migrate() {
    console.log('Starting migration from data.json to Supabase...');

    const dbPath = path.join(__dirname, '..', 'data.json');
    if (!fs.existsSync(dbPath)) {
        console.error('data.json not found');
        return;
    }

    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

    // 1. Migrate Items
    console.log('Migrating Items...');
    for (const item of db.items) {
        const { error } = await supabase.from('items').upsert({
            name: item.name,
            category: item.category,
            price_per_day: item.pricePerDay || item.price,
            quantity: item.quantity,
            images: item.images,
            is_featured: item.isFeatured
        });
        if (error) console.error(`Error migrating item ${item.name}:`, error.message);
    }

    // 2. Migrate Packages
    console.log('Migrating Packages...');
    for (const pkg of db.packages) {
        const { error } = await supabase.from('packages').upsert({
            name: pkg.name,
            description: pkg.description,
            price: pkg.price,
            images: pkg.images,
            is_featured: pkg.isFeatured
        });
        if (error) console.error(`Error migrating package ${pkg.name}:`, error.message);
    }

    // 3. Migrate Messages
    console.log('Migrating Messages...');
    for (const msg of db.messages) {
        const { error } = await supabase.from('messages').upsert({
            name: msg.name,
            email: msg.email,
            subject: msg.subject,
            message: msg.message,
            phone: msg.phone,
            is_read: msg.isRead || false,
            created_at: msg.createdAt
        });
        if (error) console.error(`Error migrating message from ${msg.name}:`, error.message);
    }

    // 4. Migrate Bookings
    console.log('Migrating Bookings...');
    for (const booking of db.bookings) {
        const { error } = await supabase.from('bookings').upsert({
            customer_name: booking.customerName,
            email: booking.email,
            phone: booking.phone,
            event_date: booking.eventDate,
            event_type: booking.eventType,
            items: booking.items || booking.rentedItems,
            total_amount: booking.totalAmount || booking.totalCost,
            status: booking.status,
            location: booking.location,
            notes: booking.notes,
            created_at: booking.createdAt
        });
        if (error) console.error(`Error migrating booking for ${booking.customerName}:`, error.message);
    }

    // 5. Migrate Testimonials
    console.log('Migrating Testimonials...');
    for (const t of db.testimonials) {
        const { error } = await supabase.from('testimonials').upsert({
            name: t.name,
            role: t.role,
            content: t.content,
            initial: t.initial
        });
        if (error) console.error(`Error migrating testimonial from ${t.name}:`, error.message);
    }

    // 6. Migrate Users
    console.log('Migrating Users...');
    for (const user of db.users) {
        const { error } = await supabase.from('users').upsert({
            name: user.name,
            email: user.email,
            password: user.password,
            role: user.role,
            is_first_login: user.isFirstLogin
        });
        if (error) console.error(`Error migrating user ${user.email}:`, error.message);
    }

    // 7. Site Content & Settings
    console.log('Migrating Content & Settings...');
    await supabase.from('site_data').upsert([
        { key: 'content', value: db.content },
        { key: 'settings', value: db.settings }
    ]);

    console.log('Migration complete!');
}

migrate();
