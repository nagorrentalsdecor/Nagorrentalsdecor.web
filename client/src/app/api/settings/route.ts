import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('site_data')
            .select('value')
            .eq('key', 'settings')
            .single();

        if (error) throw error;

        return NextResponse.json(data.value || {});
    } catch (err) {
        const { getDB } = await import('@/lib/db');
        return NextResponse.json(getDB().settings || {});
    }
}

export async function POST(request: Request) {
    const body = await request.json();

    try {
        const { data, error } = await supabase
            .from('site_data')
            .upsert({ key: 'settings', value: body })
            .select();

        if (error) throw error;

        return NextResponse.json(body);
    } catch (err) {
        const { getDB, saveDB } = await import('@/lib/db');
        const db = getDB();
        db.settings = body;
        saveDB(db);
        return NextResponse.json(db.settings);
    }
}
