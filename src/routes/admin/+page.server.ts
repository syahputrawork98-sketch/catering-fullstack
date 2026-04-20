import { db } from '$lib/server/db';
import { users, orders } from '$lib/server/db/schema';
import { sql, desc, eq } from 'drizzle-orm';
import { error, fail } from '@sveltejs/kit';
import argon2 from 'argon2';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth();
	if (session?.user?.role !== 'ADMIN') {
		throw error(403, 'Akses Terbatas');
	}

	// 1. Database Stats
	const [userStats] = await db
		.select({
			total: sql<number>`count(*)`,
			instansi: sql<number>`count(*) filter (where ${users.category} = 'INSTANSI')`,
			personal: sql<number>`count(*) filter (where ${users.category} = 'PUBLIK')`,
		})
		.from(users);

	const [financeStats] = await db
		.select({
			totalRevenue: sql<number>`sum(${orders.grandTotal})`,
			orderCount: sql<number>`count(*)`,
		})
		.from(orders);

	// 2. Recent Users
	const recentUsers = await db.query.users.findMany({
		limit: 5,
		orderBy: [desc(users.id)]
	});

	return {
		stats: {
			totalUsers: userStats?.total || 0,
			instansiCount: userStats?.instansi || 0,
			personalCount: userStats?.personal || 0,
			revenue: financeStats?.totalRevenue || 0,
			totalOrders: financeStats?.orderCount || 0
		},
		recentUsers
	};
};

export const actions: Actions = {
	createInstansi: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const phone = formData.get('phone') as string;
		const instansiName = formData.get('instansiName') as string;
		const password = formData.get('password') as string;

		if (!name || !phone || !instansiName || !password) {
			return fail(400, { message: 'Data tidak lengkap' });
		}

		try {
			const hashedPassword = await argon2.hash(password);
			await db.insert(users).values({
				name,
				phone,
				password: hashedPassword,
				category: 'INSTANSI',
				instansiName,
				status: 'ACTIVE',
				role: 'USER'
			});
			return { success: true };
		} catch (e) {
			console.error('Failed to create instansi account:', e);
			return fail(500, { message: 'Gagal membuat akun instansi' });
		}
	}
};
