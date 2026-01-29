import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    try {
        const body = await request.json();
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
        return NextResponse.json({
            ...rest,
            _id: data.id,
            isFirstLogin: data.is_first_login
        });

    } catch (err: any) {
        console.error("User update error:", err.message);
        return NextResponse.json(
            { error: `Failed to update user: ${err.message}` },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    try {
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });

    } catch (err: any) {
        console.error("User delete error:", err.message);
        return NextResponse.json(
            { error: `Failed to delete user: ${err.message}` },
            { status: 500 }
        );
    }
}
