import { NextResponse } from 'next/server';
import { getDB, saveDB } from '@/lib/db';

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    const body = await request.json();
    const db = getDB();

    const index = db.items.findIndex((i: any) => i._id === id);
    if (index !== -1) {
        db.items[index] = { ...db.items[index], ...body };
        saveDB(db);
        return NextResponse.json(db.items[index]);
    }

    return NextResponse.json({ error: "Item not found" }, { status: 404 });
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    const db = getDB();

    const initialLength = db.items.length;
    db.items = db.items.filter((i: any) => i._id !== id);

    if (db.items.length < initialLength) {
        saveDB(db);
        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Item not found" }, { status: 404 });
}
