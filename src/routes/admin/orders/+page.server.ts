import { db } from '$lib/server/db';
import { orders } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';
import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth();
	
	if (session?.user?.role !== 'ADMIN') {
		throw error(403, 'Akses ditolak.');
	}

	const allOrders = await db.query.orders.findMany({
		with: {
			user: true,
			orderItems: {
				with: {
					menu: true
				}
			}
		},
		orderBy: [desc(orders.createdAt)]
	});

	return {
		orders: allOrders
	};
};

export const actions: Actions = {
	updateStatus: async ({ request, locals }) => {
		const session = await locals.auth();
		if (session?.user?.role !== 'ADMIN') return fail(403, { message: 'Unauthorized' });
        
		const formData = await request.formData();
		const orderId = formData.get('orderId') as string;
		const status = formData.get('status') as any;

		if (!orderId || !status) return fail(400, { message: 'Missing fields' });

		try {
			await db.update(orders).set({ status }).where(eq(orders.id, orderId));
			return { success: true };
		} catch (e) {
			return fail(500, { message: 'Gagal' });
		}
	}
};
