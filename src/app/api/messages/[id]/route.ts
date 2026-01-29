import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;

    try {
        const body = await request.json();

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
        console.error("Supabase Update Error:", err.message);
        return NextResponse.json(
            { error: `Failed to update message: ${err.message}` },
            { status: 500 }
        );
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
        console.error("Supabase Delete Error:", err.message);
        return NextResponse.json(
            { error: `Failed to delete message: ${err.message}` },
            { status: 500 }
        );
    }
}
