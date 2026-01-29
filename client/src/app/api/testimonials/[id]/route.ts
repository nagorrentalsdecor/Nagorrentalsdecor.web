import { NextResponse } from 'next/server';
import { getDB, saveDB } from '@/lib/db';

export const dynamic = 'force-dynamic';

// DELETE existing implementation...
export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    const db = getDB();

    if (!db.testimonials) return NextResponse.json({ error: "No testimonials found" }, { status: 404 });

    const initialLength = db.testimonials.length;
    db.testimonials = db.testimonials.filter((t: any) => t._id !== id);

    if (db.testimonials.length === initialLength) {
        return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }

    saveDB(db);
    return NextResponse.json({ success: true });
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    const db = getDB();
    const body = await request.json();

    if (!db.testimonials) return NextResponse.json({ error: "No testimonials found" }, { status: 404 });

    const index = db.testimonials.findIndex((t: any) => t._id === id);

    if (index === -1) {
        return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }

    // Update fields
    const updatedTestimonial = {
        ...db.testimonials[index],
        name: body.name || db.testimonials[index].name,
        role: body.role || db.testimonials[index].role,
        content: body.content || db.testimonials[index].content,
        initial: (body.name || db.testimonials[index].name).charAt(0).toUpperCase()
    };

    db.testimonials[index] = updatedTestimonial;
    saveDB(db);

    return NextResponse.json(updatedTestimonial);
}
