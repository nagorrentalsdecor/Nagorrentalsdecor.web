import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { data: supaBookings, error } = await supabase
            .from('bookings')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        const bookings = supaBookings.map((b: any) => ({
            ...b,
            _id: b.id,
            customerName: b.customer_name,
            eventDate: b.event_date,
            eventType: b.event_type,
            totalAmount: b.total_amount,
            createdAt: b.created_at
        }));

        return NextResponse.json(bookings);
    } catch (err) {
        const { getDB } = await import('@/lib/db');
        return NextResponse.json(getDB().bookings);
    }
}

export async function POST(request: Request) {
    const body = await request.json();

    try {
        // STOCK VALIDATION (Before Supabase Insert)
        const { data: items, error: itemsError } = await supabase.from('items').select('*');

        if (!itemsError && body.items && Array.isArray(body.items)) {
            for (const bookingItem of body.items) {
                const invItem = items.find((i: any) => i.id === bookingItem.id || i.id === bookingItem._id);
                if (invItem) {
                    if (bookingItem.quantity > invItem.quantity) {
                        return NextResponse.json(
                            { error: `Insufficient stock for ${invItem.name}. Available: ${invItem.quantity}` },
                            { status: 400 }
                        );
                    }

                    // Update stock in Supabase
                    await supabase.from('items')
                        .update({ quantity: invItem.quantity - bookingItem.quantity })
                        .eq('id', invItem.id);
                }
            }
        }

        const dbPayload = {
            customer_name: body.customerName,
            email: body.email,
            phone: body.phone,
            event_date: body.eventDate,
            event_type: body.eventType,
            items: body.items,
            total_amount: body.totalAmount,
            status: body.status || 'Pending',
            location: body.location,
            notes: body.notes
        };

        const { data, error } = await supabase.from('bookings').insert(dbPayload).select().single();
        if (error) throw error;

        return NextResponse.json({ ...data, _id: data.id });
    } catch (err: any) {
        console.error("Booking migration fallback:", err.message);
        // Fallback to local DB logic
        const { getDB, saveDB } = await import('@/lib/db');
        const db = getDB();

        // Local stock validation
        if (body.items && Array.isArray(body.items)) {
            for (const bookingItem of body.items) {
                const inventoryItemIndex = db.items.findIndex((i: any) => i._id === bookingItem.id || i.id === bookingItem.id);
                if (inventoryItemIndex !== -1) {
                    const inventoryItem = db.items[inventoryItemIndex];
                    if (bookingItem.quantity > inventoryItem.quantity) {
                        return NextResponse.json(
                            { error: `Insufficient stock for ${inventoryItem.name}. Available: ${inventoryItem.quantity}` },
                            { status: 400 }
                        );
                    }
                    db.items[inventoryItemIndex].quantity -= bookingItem.quantity;
                }
            }
        }

        const newBooking = { ...body, _id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString() };
        db.bookings.unshift(newBooking);
        saveDB(db);
        return NextResponse.json(newBooking);
    }
}
