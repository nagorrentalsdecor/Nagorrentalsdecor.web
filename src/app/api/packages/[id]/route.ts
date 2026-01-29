import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;

    try {
        const body = await request.json();

        const dbPayload: any = {};

        // Map fields appropriately
        if (body.name !== undefined) dbPayload.name = body.name;
        if (body.description !== undefined) dbPayload.description = body.description;
        if (body.price !== undefined) dbPayload.price = body.price;
        if (body.items !== undefined) dbPayload.items = body.items;
        if (body.features !== undefined) dbPayload.features = body.features;
        if (body.isPopular !== undefined || body.is_popular !== undefined) {
            dbPayload.is_popular = body.isPopular !== undefined ? body.isPopular : body.is_popular;
        }

        const { data, error } = await supabase
            .from('packages')
            .update(dbPayload)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({
            ...data,
            _id: data.id,
            isPopular: data.is_popular
        });

    } catch (err: any) {
        console.error("Supabase Update Error:", err.message);
        return NextResponse.json(
            { error: `Failed to update package: ${err.message}` },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;

    try {
        const { error } = await supabase
            .from('packages')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });

    } catch (err: any) {
        console.error("Supabase Delete Error:", err.message);
        return NextResponse.json(
            { error: `Failed to delete package: ${err.message}` },
            { status: 500 }
        );
    }
}
