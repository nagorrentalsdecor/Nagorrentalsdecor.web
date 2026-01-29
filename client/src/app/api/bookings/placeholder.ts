import { NextResponse } from 'next/server';
import { getDB, saveDB } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    // Note: Next.js App Router params are async in some versions, but usually available in context.
    // However, we are in a dynamic route [...id] or similar if we want ID.
    // Actually, for a single route like `api/bookings/[id]/route.ts` we need a new file.
    return NextResponse.json({ error: "Use dynamic route" }, { status: 400 });
}
