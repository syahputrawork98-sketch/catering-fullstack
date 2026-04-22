import { db } from '$lib/server/db';
import { dailySchedules } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const session = await locals.auth();
	if (session?.user?.role !== 'ADMIN') throw error(403, 'Akses ditolak');

	const today = new Date().toISOString().split('T')[0];
	const selectedDate = url.searchParams.get('date') || today;

	const schedules = await db.query.dailySchedules.findMany({
		where: eq(dailySchedules.availableDate, selectedDate),
		with: {
			menu: true
		}
	});

	return {
		selectedDate,
		schedules: schedules.map(s => ({
			...s,
			basePrice: Number(s.menu.basePrice)
		}))
	};
};

export const actions: Actions = {
	updateStock: async ({ request, locals }) => {
		const session = await locals.auth();
		if (session?.user?.role !== 'ADMIN') throw error(403, 'Akses ditolak');
		const formData = await request.formData();
		const id = formData.get('id') as string;
		const stock = formData.get('stock') as string;

		if (!id || !stock) return fail(400, { message: 'Missing data' });

		try {
			await db.update(dailySchedules)
				.set({ currentStock: parseInt(stock) })
				.where(eq(dailySchedules.id, parseInt(id)));
			return { success: true, message: 'Updated' };
		} catch (e) {
			return fail(500, { message: 'Failed' });
		}
	}
};
