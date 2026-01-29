import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { data: users, error } = await supabase
            .from('users')
            .select('id, name, email, role, is_first_login, created_at')
            .order('name');

        if (error) throw error;

        return NextResponse.json(users.map((u: any) => ({
            ...u,
            _id: u.id,
            isFirstLogin: u.is_first_login,
            createdAt: u.created_at
        })));
    } catch (err) {
        const { getDB } = await import('@/lib/db');
        const db = getDB();
        return NextResponse.json((db.users || []).map((u: any) => {
            const { password, ...rest } = u;
            return rest;
        }));
    }
}

export async function POST(request: Request) {
    const body = await request.json();

    try {
        const dbPayload = {
            name: body.name,
            email: body.email,
            password: body.password,
            role: body.role || "Editor",
            is_first_login: true
        };

        const { data, error } = await supabase.from('users').insert(dbPayload).select().single();

        if (error) {
            if (error.code === '23505') return NextResponse.json({ error: "Email already exists" }, { status: 400 });
            throw error;
        }

        const { password, ...rest } = data;
        return NextResponse.json({ ...rest, _id: data.id, isFirstLogin: data.is_first_login });
    } catch (err: any) {
        console.error("User save error:", err.message);
        const { getDB, saveDB } = await import('@/lib/db');
        const db = getDB();
        if (db.users?.find((u: any) => u.email === body.email)) {
            return NextResponse.json({ error: "Email already exists" }, { status: 400 });
        }
        const newUser = {
            _id: Math.random().toString(36).substr(2, 9),
            name: body.name,
            email: body.email,
            role: body.role || "Editor",
            password: body.password,
            isFirstLogin: true,
            createdAt: new Date().toISOString()
        };
        db.users = db.users || [];
        db.users.push(newUser);
        saveDB(db);
        const { password, ...rest } = newUser;
        return NextResponse.json(rest);
    }
}
