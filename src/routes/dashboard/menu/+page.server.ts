import { db } from '$lib/server/db';
import { dailySchedules } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	// 1. Resolve selected date (Default to Today)
	const todayStr = new Date().toISOString().split('T')[0];
	const selectedDate = url.searchParams.get('date') || todayStr;

	// 2. Fetch Scheduled Menus for the selected date
	// We use the relational API for a clean join
	const scheduledEntries = await db.query.dailySchedules.findMany({
		where: eq(dailySchedules.availableDate, selectedDate),
		with: {
			menu: true
		}
	});

	// 3. Generate Date Scroller Items (Next 7 Days)
	const dateItems = Array.from({ length: 7 }).map((_, i) => {
		const d = new Date();
		d.setDate(d.getDate() + i);
		const dateStr = d.toISOString().split('T')[0];
		
		return {
			date: dateStr,
			label: i === 0 ? 'Hari Ini' : d.toLocaleDateString('id-ID', { weekday: 'short' }),
			dayNum: d.getDate(),
			fullLabel: d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
		};
	});

	return {
		selectedDate,
		dateItems,
		menus: scheduledEntries.map(entry => ({
			...entry.menu,
			scheduleId: entry.id,
			stock: entry.currentStock,
			basePrice: parseFloat(entry.menu.basePrice as string)
		}))
	};
};
