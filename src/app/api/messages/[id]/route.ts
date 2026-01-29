import { NextResponse } from 'next/server';

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    const { getDB, saveDB } = await import('@/lib/db');
    const db = getDB();

    // Find the message
    const msgIndex = db.messages.findIndex((m: any) => m._id === id || m.id === id);
    if (msgIndex === -1) {
        return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    // Update to read
    db.messages[msgIndex].isRead = true;
    saveDB(db);

    return NextResponse.json(db.messages[msgIndex]);
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    const { getDB, saveDB } = await import('@/lib/db');
    const db = getDB();

    db.messages = db.messages.filter((m: any) => m._id !== id && m.id !== id);
    saveDB(db);

    return NextResponse.json({ success: true });
}
