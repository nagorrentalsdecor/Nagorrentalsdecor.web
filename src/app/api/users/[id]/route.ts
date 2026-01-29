import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const body = await request.json();

    try {
        let updateData: any = {};

        if (body.resetPassword) {
            updateData = {
                password: body.newPassword,
                is_first_login: true
            };
        } else {
            // General update
            updateData = {
                name: body.name,
                email: body.email,
                role: body.role,
                is_first_login: body.isFirstLogin !== undefined ? body.isFirstLogin : undefined
            };
            // Remove undefined fields
            Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);
        }

        const { data, error } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        const { password, ...rest } = data;
        return NextResponse.json({ ...rest, _id: data.id, isFirstLogin: data.is_first_login });

    } catch (err: any) {
        console.error("User update error:", err.message);
        const { getDB, saveDB } = await import('@/lib/db');
        const db = getDB();
        const index = db.users.findIndex((u: any) => u._id === id);
        if (index === -1) return NextResponse.json({ error: "User not found" }, { status: 404 });

        if (body.resetPassword) {
            db.users[index].password = body.newPassword;
            db.users[index].isFirstLogin = true;
        } else {
            db.users[index] = { ...db.users[index], ...body };
        }

        saveDB(db);
        const { password, ...rest } = db.users[index];
        return NextResponse.json(rest);
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    try {
        const { error } = await supabase.from('users').delete().eq('id', id);
        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (err: any) {
        const { getDB, saveDB } = await import('@/lib/db');
        const db = getDB();
        const newUsers = db.users.filter((u: any) => u._id !== id);
        if (newUsers.length === db.users.length) return NextResponse.json({ error: "User not found" }, { status: 404 });
        db.users = newUsers;
        saveDB(db);
        return NextResponse.json({ success: true });
    }
}
