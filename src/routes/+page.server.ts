import { db } from '$lib/server/db';
import { dailySchedules, menus, menuTypes } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
    try {
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
            with: {
                type: true
            }
        });

        // Filter packages in JS to ensure we get only 'paket' type
        const filteredPackages = packageMenus.filter(m => m.type?.slug === 'paket');

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
            packages: filteredPackages,
            selectedDate,
            dateItems
        };
    } catch (e) {
        console.error('Index load error:', e);
        return {
            menus: [],
            packages: [],
            selectedDate: new Date().toISOString().split('T')[0],
            dateItems: []
        };
    }
};
