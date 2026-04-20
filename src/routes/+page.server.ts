import { db } from '$lib/server/db';
import { dailySchedules, menus } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	// 1. Resolve selected date for Catalog (default to today)
	const selectedDate = url.searchParams.get('date') || new Date().toISOString().split('T')[0];

	// 2. Fetch daily schedules for Catalog
	const schedules = await db.query.dailySchedules.findMany({
		where: eq(dailySchedules.availableDate, selectedDate),
		with: {
			menu: true
		}
	});

	const catalogMenus = schedules.map(s => ({
		...s.menu,
		stock: s.currentStock
	}));

	// 3. Fetch Always-Available PACKAGES (Paket)
	const packageMenus = await db.query.menus.findMany({
		where: eq(menus.category, 'PAKET')
	});

	// 4. Generate metadata for the 7-day Date Scroller
	const dateItems = Array.from({ length: 7 }).map((_, i) => {
		const d = new Date();
		d.setDate(d.getDate() + i);
		const dateStr = d.toISOString().split('T')[0];
		
		return {
			date: dateStr,
			label: i === 0 ? 'HARI INI' : d.toLocaleDateString('id-ID', { weekday: 'short' }).toUpperCase(),
			dayNum: d.getDate(),
			fullLabel: d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
		};
	});

	return {
		menus: catalogMenus,
		packages: packageMenus,
		selectedDate,
		dateItems
	};
};
