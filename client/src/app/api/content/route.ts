import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('site_data')
            .select('value')
            .eq('key', 'content')
            .single();

        if (error) {
            // If table doesn't exist or entry missing, fallback to local DB for now
            console.warn("Supabase content fetch error, falling back to local DB:", error.message);
            const { getDB } = await import('@/lib/db');
            return NextResponse.json(getDB().content || {});
        }

        return NextResponse.json(data.value || {});
    } catch (err) {
        const { getDB } = await import('@/lib/db');
        return NextResponse.json(getDB().content || {});
    }
}

export async function POST(request: Request) {
    const body = await request.json();

    try {
        const { data, error } = await supabase
            .from('site_data')
            .upsert({ key: 'content', value: body })
            .select();

        if (error) throw error;

        return NextResponse.json(body);
    } catch (err: any) {
        console.error("Supabase Save Error:", err.message);
        // Fallback to local DB save
        const { getDB, saveDB } = await import('@/lib/db');
        const db = getDB();
        db.content = body;
        saveDB(db);
        return NextResponse.json(db.content);
    }
}
