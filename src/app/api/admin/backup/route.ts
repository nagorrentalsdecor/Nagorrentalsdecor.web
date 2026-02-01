import { NextResponse } from 'next/server';
import { getDB, saveDB } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const data = getDB();
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Basic validation
        if (!body.bookings || !body.items || !body.packages) {
            throw new Error("Invalid backup data format");
        }

        saveDB(body);
        return NextResponse.json({ success: true, message: "System data restored successfully" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
