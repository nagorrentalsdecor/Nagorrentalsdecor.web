import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;

    try {
        const body = await request.json();

        const dbPayload: any = {};

        // Map fields appropriately
        if (body.status !== undefined) dbPayload.status = body.status;
        if (body.customerName !== undefined) dbPayload.customer_name = body.customerName;
        if (body.customerEmail !== undefined) dbPayload.customer_email = body.customerEmail;
        if (body.customerPhone !== undefined) dbPayload.customer_phone = body.customerPhone;
        if (body.eventDate !== undefined) dbPayload.event_date = body.eventDate;
        if (body.eventLocation !== undefined) dbPayload.event_location = body.eventLocation;
        if (body.totalPrice !== undefined) dbPayload.total_price = body.totalPrice;

        const { data, error } = await supabase
            .from('bookings')
            .update(dbPayload)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({
            ...data,
            _id: data.id,
            customerName: data.customer_name,
            customerEmail: data.customer_email,
            customerPhone: data.customer_phone,
            eventDate: data.event_date,
            eventLocation: data.event_location,
            totalPrice: data.total_price,
            createdAt: data.created_at
        });

    } catch (err: any) {
        console.error("Supabase Update Error:", err.message);
        return NextResponse.json(
            { error: `Failed to update booking: ${err.message}` },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;

    try {
        const { error } = await supabase
            .from('bookings')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });

    } catch (err: any) {
        console.error("Supabase Delete Error:", err.message);
        return NextResponse.json(
            { error: `Failed to delete booking: ${err.message}` },
            { status: 500 }
        );
    }
}
