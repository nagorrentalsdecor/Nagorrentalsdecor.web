import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;

    try {
        const body = await request.json();

        // Prepare data (supporting both camelCase and snake_case for input)
        const dbPayload: any = {
            name: body.name,
            category: body.category,
            quantity: body.quantity,
        };

        // Only include these fields if they're provided
        if (body.pricePerDay !== undefined || body.price_per_day !== undefined) {
            dbPayload.price_per_day = body.pricePerDay || body.price_per_day;
        }
        if (body.images !== undefined) {
            dbPayload.images = body.images;
        }
        if (body.isFeatured !== undefined || body.is_featured !== undefined) {
            dbPayload.is_featured = body.isFeatured !== undefined ? body.isFeatured : body.is_featured;
        }

        // Update in Supabase
        const { data, error } = await supabase
            .from('items')
            .update(dbPayload)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({
            ...data,
            _id: data.id,
            pricePerDay: data.price_per_day,
            isFeatured: data.is_featured
        });

    } catch (err: any) {
        console.error("Supabase Update Error:", err.message);
        return NextResponse.json(
            { error: `Failed to update item: ${err.message}` },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;

    try {
        const { error } = await supabase
            .from('items')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });

    } catch (err: any) {
        console.error("Supabase Delete Error:", err.message);
        return NextResponse.json(
            { error: `Failed to delete item: ${err.message}` },
            { status: 500 }
        );
    }
}
