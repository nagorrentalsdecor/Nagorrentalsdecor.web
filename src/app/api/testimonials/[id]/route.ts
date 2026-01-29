import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;

    try {
        const { error } = await supabase
            .from('testimonials')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });

    } catch (err: any) {
        console.error("Supabase Delete Error:", err.message);
        return NextResponse.json(
            { error: `Failed to delete testimonial: ${err.message}` },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;

    try {
        const body = await request.json();

        const dbPayload = {
            name: body.name,
            role: body.role,
            content: body.content,
        };

        const { data, error } = await supabase
            .from('testimonials')
            .update(dbPayload)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({
            ...data,
            _id: data.id,
            initial: data.name.charAt(0).toUpperCase()
        });

    } catch (err: any) {
        console.error("Supabase Update Error:", err.message);
        return NextResponse.json(
            { error: `Failed to update testimonial: ${err.message}` },
            { status: 500 }
        );
    }
}
