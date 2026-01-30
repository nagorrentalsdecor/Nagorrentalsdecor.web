import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { data: supaItems, error } = await supabase
            .from('items')
            .select('*')
            .order('name');

        if (error) throw error;

        // If Supabase table is empty, fallback to local DB
        if (!supaItems || supaItems.length === 0) {
            console.warn("Supabase items empty, falling back to local DB");
            const { getDB } = await import('@/lib/db');
            return NextResponse.json(getDB().items);
        }

        // Map snake_case to camelCase for the frontend
        const items = supaItems.map((item: any) => ({
            ...item,
            _id: item.id,
            pricePerDay: item.price_per_day,
            isFeatured: item.is_featured
        }));

        return NextResponse.json(items);
    } catch (err) {
        console.warn("Supabase fetch error, fallback to local:", err);
        const { getDB } = await import('@/lib/db');
        return NextResponse.json(getDB().items);
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // 1. Prepare data (supporting both camelCase and snake_case for input)
        const dbPayload = {
            name: body.name,
            category: body.category,
            price_per_day: body.pricePerDay || body.price_per_day,
            quantity: body.quantity,
            images: body.images || [],
            is_featured: body.isFeatured !== undefined ? body.isFeatured : body.is_featured
        };

        // 2. Insert into Supabase
        const { data, error } = await supabase
            .from('items')
            .insert(dbPayload)
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
        console.error("Supabase Save Error:", err.message);
        // Fallback to local
        const { getDB, saveDB } = await import('@/lib/db');
        const db = getDB();
        const body = await request.json().catch(() => ({}));
        const newItem = {
            ...body,
            _id: body._id || Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString()
        };

        // If updating
        if (body._id) {
            const index = db.items.findIndex((i: any) => i._id === body._id);
            if (index !== -1) db.items[index] = newItem;
            else db.items.push(newItem);
        } else {
            db.items.push(newItem);
        }

        saveDB(db);
        return NextResponse.json(newItem);
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    try {
        const { error } = await supabase.from('items').delete().eq('id', id);
        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (err: any) {
        // Fallback
        const { getDB, saveDB } = await import('@/lib/db');
        const db = getDB();
        db.items = db.items.filter((i: any) => i._id !== id);
        saveDB(db);
        return NextResponse.json({ success: true });
    }
}
