import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { data: testimonials, error } = await supabase
            .from('testimonials')
            .select('*')
            .order('name');

        if (error) throw error;

        return NextResponse.json(testimonials.map((t: any) => ({ ...t, _id: t.id })));
    } catch (err) {
        const { getDB } = await import('@/lib/db');
        return NextResponse.json(getDB().testimonials || []);
    }
}

export async function POST(request: Request) {
    const body = await request.json();

    try {
        const dbPayload = {
            name: body.name,
            role: body.role,
            content: body.content,
            initial: body.name.charAt(0).toUpperCase()
        };

        const { data, error } = await supabase.from('testimonials').insert(dbPayload).select().single();
        if (error) throw error;

        return NextResponse.json({ ...data, _id: data.id });
    } catch (err) {
        const { getDB, saveDB } = await import('@/lib/db');
        const db = getDB();
        const newTestimonial = {
            _id: Math.random().toString(36).substr(2, 9),
            name: body.name,
            role: body.role,
            content: body.content,
            initial: body.name.charAt(0).toUpperCase(),
            createdAt: new Date().toISOString()
        };
        db.testimonials = db.testimonials || [];
        db.testimonials.push(newTestimonial);
        saveDB(db);
        return NextResponse.json(newTestimonial);
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    try {
        const { error } = await supabase.from('testimonials').delete().eq('id', id);
        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (err) {
        const { getDB, saveDB } = await import('@/lib/db');
        const db = getDB();
        db.testimonials = (db.testimonials || []).filter((t: any) => t._id !== id);
        saveDB(db);
        return NextResponse.json({ success: true });
    }
}
