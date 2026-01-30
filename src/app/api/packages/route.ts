import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { data: supaPackages, error } = await supabase
            .from('packages')
            .select('*')
            .order('name');

        if (error) throw error;

        const packages = supaPackages.map((p: any) => ({
            ...p,
            _id: p.id,
            isFeatured: p.is_featured
        }));

        return NextResponse.json(packages);
    } catch (err) {
        const { getDB } = await import('@/lib/db');
        return NextResponse.json(getDB().packages);
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const dbPayload = {
            name: body.name,
            description: body.description,
            price: body.price,
            images: body.images || [],
            is_featured: body.isFeatured !== undefined ? body.isFeatured : body.is_featured
        };

        const { data, error } = await supabase
            .from('packages')
            .insert(dbPayload)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ ...data, isFeatured: data.is_featured, _id: data.id });
    } catch (err: any) {
        console.error("Supabase package save error:", err.message);
        const { getDB, saveDB } = await import('@/lib/db');
        const db = getDB();
        const body = await request.json().catch(() => ({}));
        const newPkg = { ...body, _id: body._id || Math.random().toString(36).substr(2, 9) };

        if (body._id) {
            const index = db.packages.findIndex((p: any) => p._id === body._id);
            if (index !== -1) db.packages[index] = newPkg;
            else db.packages.push(newPkg);
        } else {
            db.packages.push(newPkg);
        }

        saveDB(db);
        return NextResponse.json(newPkg);
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    try {
        const { error } = await supabase.from('packages').delete().eq('id', id);
        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (err) {
        const { getDB, saveDB } = await import('@/lib/db');
        const db = getDB();
        db.packages = db.packages.filter((p: any) => p._id !== id);
        saveDB(db);
        return NextResponse.json({ success: true });
    }
}
