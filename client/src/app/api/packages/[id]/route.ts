import { NextResponse } from 'next/server';
import { getDB, saveDB } from '@/lib/db';

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    const body = await request.json();
    const db = getDB();

    const index = db.packages.findIndex((p: any) => p._id === id);
    if (index !== -1) {
        db.packages[index] = { ...db.packages[index], ...body };
        saveDB(db);
        return NextResponse.json(db.packages[index]);
    }

    return NextResponse.json({ error: "Package not found" }, { status: 404 });
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    const db = getDB();

    const initialLength = db.packages.length;
    db.packages = db.packages.filter((p: any) => p._id !== id);

    if (db.packages.length < initialLength) {
        saveDB(db);
        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Package not found" }, { status: 404 });
}
