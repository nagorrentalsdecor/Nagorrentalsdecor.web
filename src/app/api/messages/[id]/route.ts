
import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    let body: any = {};

    try {
        body = await request.json().catch(() => ({}));

        // Update message (typically marking as read)
        const { data, error } = await supabase
            .from('messages')
            .update({ is_read: body.isRead !== undefined ? body.isRead : true })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({
            ...data,
            _id: data.id,
            isRead: data.is_read,
            createdAt: data.created_at
        });

    } catch (err: any) {
        console.warn("Supabase Update Error, attempting local:", err.message);

        try {
            const { getDB, saveDB } = await import('@/lib/db');
            const db = getDB();
            const index = db.messages.findIndex((m: any) => m._id === id || m.id === id);

            if (index !== -1) {
                db.messages[index].isRead = body.isRead !== undefined ? body.isRead : true;
                saveDB(db);
                return NextResponse.json(db.messages[index]);
            } else {
                return NextResponse.json({ error: "Message not found locally" }, { status: 404 });
            }
        } catch (localErr) {
            return NextResponse.json(
                { error: `Failed to update local message: ${localErr}` },
                { status: 500 }
            );
        }
    }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;

    try {
        const { error } = await supabase
            .from('messages')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });

    } catch (err: any) {
        console.warn("Supabase Delete Error, attempting local:", err.message);

        try {
            const { getDB, saveDB } = await import('@/lib/db');
            const db = getDB();
            const initialLen = db.messages.length;
            db.messages = db.messages.filter((m: any) => m._id !== id && m.id !== id);

            if (db.messages.length !== initialLen) {
                saveDB(db);
                return NextResponse.json({ success: true });
            } else {
                // If not found, maybe it was already deleted or never existed. Return success anyway.
                return NextResponse.json({ success: true, warning: 'Not found locally' });
            }
        } catch (localErr) {
            return NextResponse.json(
                { error: `Failed to delete local message: ${localErr}` },
                { status: 500 }
            );
        }
    }
}
