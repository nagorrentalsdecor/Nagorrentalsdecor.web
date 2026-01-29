import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    const { email, password } = await request.json();

    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .eq('password', password)
            .single();

        if (error || !user) {
            // Fallback for primary admin if Supabase is not ready
            if (email === "admin@nagor.com" && password === "admin123") {
                return NextResponse.json({
                    success: true,
                    user: { _id: "admin_001", name: "Super Admin", email: "admin@nagor.com", role: "Super Admin" },
                    requirePasswordChange: true
                });
            }
            return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
        }

        const { password: _, ...userInfo } = user;
        return NextResponse.json({
            success: true,
            user: { ...userInfo, _id: user.id },
            requirePasswordChange: user.is_first_login
        });

    } catch (err) {
        // Local DB Fallback
        const { getDB } = await import('@/lib/db');
        const db = getDB();
        const user = db.users?.find((u: any) => u.email === email && u.password === password);

        if (user) {
            const { password, ...userInfo } = user;
            return NextResponse.json({
                success: true,
                user: userInfo,
                requirePasswordChange: user.isFirstLogin
            });
        }
        return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }
}

export async function PUT(request: Request) {
    const { email, newPassword } = await request.json();

    try {
        const { error } = await supabase
            .from('users')
            .update({ password: newPassword, is_first_login: false })
            .eq('email', email);

        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (err) {
        const { getDB, saveDB } = await import('@/lib/db');
        const db = getDB();
        const index = db.users?.findIndex((u: any) => u.email === email);
        if (index !== -1) {
            db.users[index].password = newPassword;
            db.users[index].isFirstLogin = false;
            saveDB(db);
            return NextResponse.json({ success: true });
        }
        return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }
}
