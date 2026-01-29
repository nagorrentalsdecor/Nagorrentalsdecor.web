import { NextResponse } from 'next/server';
import { getDB, saveDB } from '@/lib/db';

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    const body = await request.json();
    const db = getDB();

    const index = db.bookings.findIndex((b: any) => b._id === id);
    if (index !== -1) {
        db.bookings[index] = { ...db.bookings[index], ...body };
        saveDB(db);
        return NextResponse.json(db.bookings[index]);
    }

    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
}
