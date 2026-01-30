import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function DELETE() {
    try {
        // Clear Supabase Bookings
        const { error } = await supabase.from('bookings').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

        if (error) {
            console.error('Supabase Delete Error:', error);
            // Don't throw, try local DB too
        }

        // Clear Local DB
        try {
            const { getDB, saveDB } = await import('@/lib/db');
            const db = getDB();
            db.bookings = [];
            // Preserve other data?
            // "Clear all monitories". Stats depend on bookings. So clearing bookings is enough.
            saveDB(db);
        } catch (e) {
            console.error('Local DB Clear Error:', e);
        }

        return NextResponse.json({ success: true, message: 'All booking data cleared.' });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
