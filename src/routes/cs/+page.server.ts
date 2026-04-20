import { db } from '$lib/server/db';
import { orders, dailySchedules, menus, users } from '$lib/server/db/schema';
import { eq, sql, and, desc } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth();
	if (session?.user?.role !== 'CUSTOMER_SERVICE' && session?.user?.role !== 'ADMIN') {
		throw error(403, 'Akses ditolak');
	}

	const today = new Date().toISOString().split('T')[0];

	// 1. Fetch Stats
	const [orderStats] = await db
		.select({
			totalToday: sql<number>`count(*) filter (where date(${orders.createdAt}) = current_date)`,
			pending: sql<number>`count(*) filter (where ${orders.status} = 'PENDING')`,
		})
		.from(orders);

	const [clientStats] = await db
		.select({
			totalInstansi: sql<number>`count(*) filter (where ${users.category} = 'INSTANSI')`,
		})
		.from(users);

	const [menuStats] = await db
		.select({
			lowStock: sql<number>`count(*) filter (where ${dailySchedules.currentStock} < 10 and ${dailySchedules.availableDate} = ${today})`,
		})
		.from(dailySchedules);

	// 2. Fetch Recent Master Menus
	const masterMenus = await db.query.menus.findMany({
		limit: 5,
		orderBy: [desc(menus.id)]
	});

	return {
		stats: {
			ordersToday: orderStats?.totalToday || 0,
			pendingOrders: orderStats?.pending || 0,
			lowStockItems: menuStats?.lowStock || 0,
			totalInstansi: clientStats?.totalInstansi || 0
		},
		menus: masterMenus
	};
};

export const actions: Actions = {
	createMenu: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const category = formData.get('category') as string;
		const price = formData.get('price') as string;

		if (!name || !category || !price) {
			return { success: false, message: 'Data tidak lengkap' };
		}

		const dbCategory = category.toUpperCase().includes('PAKET') ? 'PAKET' : 'DAILY';

		await db.insert(menus).values({
			name,
			category: dbCategory,
			basePrice: price,
			image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400' // Placeholder
		});

		return { success: true };
	}
};
