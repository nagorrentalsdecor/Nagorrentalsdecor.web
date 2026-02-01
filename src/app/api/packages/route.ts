import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
    console.log('[Packages API] GET request received');
    try {
        const { data: supaPackages, error } = await supabase
            .from('packages')
            .select('*')
            .order('name');

        if (error) {
            console.log('[Packages API] Supabase error:', error.message);
            throw error;
        }

        // If Supabase table is empty, fallback to local DB
        if (!supaPackages || supaPackages.length === 0) {
            console.warn("[Packages API] Supabase packages empty, falling back to local DB");
            const { getDB } = await import('@/lib/db');
            const localPackages = getDB().packages;
            console.log('[Packages API] Returning local packages:', localPackages.length);
            return NextResponse.json(localPackages);
        }

        const packages = supaPackages.map((p: any) => ({
            ...p,
            _id: p.id,
            isFeatured: p.is_featured
        }));

        console.log('[Packages API] Returning Supabase packages:', packages.length);
        return NextResponse.json(packages);
    } catch (err: any) {
        console.log('[Packages API] Catch block - using local DB. Error:', err.message);
        const { getDB } = await import('@/lib/db');
        const localPackages = getDB().packages;
        console.log('[Packages API] Returning local packages from catch:', localPackages.length);
        return NextResponse.json(localPackages);
    }
}

export async function POST(request: Request) {
    const body = await request.json().catch(() => ({}));
    try {
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
