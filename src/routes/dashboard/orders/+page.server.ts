import { db } from '$lib/server/db';
import { orders } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth();
	/*
	if (!session?.user?.id) {
		throw error(401, 'Silakan login terlebih dahulu');
	}



	try {
        // Fetch orders with related items and menus for the current user
        const userOrders = await db.query.orders.findMany({
            where: eq(orders.userId, session.user.id),
            with: {
                orderItems: {
                    with: {
                        menu: true
                    }
                }
            },
            orderBy: [desc(orders.createdAt)]
        });

        return {
            orders: userOrders
        };
    } catch (e) {
        console.error('Error loading user orders:', e);
        return {
            orders: []
        };
    }
};

export const actions = {
    uploadProof: async ({ request, locals }) => {
        const session = await locals.auth();
        if (!session?.user?.id) throw error(401, 'Unauthorized');

        const formData = await request.formData();
        const orderId = formData.get('orderId') as string;
        const image = formData.get('image') as string; // Base64 resized image

        if (!orderId || !image) return { success: false, message: 'Data tidak lengkap' };

        try {
            await db.update(orders)
                .set({ paymentProof: image })
                .where(eq(orders.id, orderId));
            
            return { success: true, message: 'Bukti pembayaran berhasil diunggah' };
        } catch (e) {
            console.error('Upload proof error:', e);
            return { success: false, message: 'Gagal mengunggah bukti' };
        }
    }
};
