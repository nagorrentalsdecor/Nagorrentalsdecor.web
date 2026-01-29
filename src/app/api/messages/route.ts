import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { data: supaMessages, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        const messages = supaMessages.map((m: any) => ({
            ...m,
            _id: m.id,
            isRead: m.is_read,
            createdAt: m.created_at
        }));

        return NextResponse.json(messages);
    } catch (err) {
        const { getDB } = await import('@/lib/db');
        return NextResponse.json(getDB().messages);
    }
}

export async function POST(request: Request) {
    const body = await request.json();

    try {
        const dbPayload = {
            name: body.name,
            email: body.email,
            subject: body.subject,
            message: body.message,
            phone: body.phone || "",
            is_read: false
        };

        const { data, error } = await supabase.from('messages').insert(dbPayload).select().single();
        if (error) throw error;

        return NextResponse.json({ ...data, _id: data.id });
    } catch (err) {
        const { getDB, saveDB } = await import('@/lib/db');
        const db = getDB();
        const newMessage = {
            ...body,
            _id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString(),
            isRead: false,
            phone: body.phone || ""
        };
        db.messages.unshift(newMessage);
        saveDB(db);
        return NextResponse.json(newMessage);
    }
}

export async function PATCH(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();

    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    try {
        const { error } = await supabase.from('messages').update({ is_read: body.isRead }).eq('id', id);
        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (err) {
        const { getDB, saveDB } = await import('@/lib/db');
        const db = getDB();
        const index = db.messages.findIndex((m: any) => m._id === id);
        if (index !== -1) {
            db.messages[index].isRead = body.isRead;
            saveDB(db);
        }
        return NextResponse.json({ success: true });
    }
}
