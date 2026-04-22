import { db } from '$lib/server/db';
import { users, orders, expenses } from '$lib/server/db/schema';
import { sql, desc, eq, inArray } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth();
	/*
	if (session?.user?.role !== 'ADMIN') {
		throw error(403, 'Akses Terbatas');
	}
	*/


	// 1. Omzet Aggregation (Total)
	const [revenueData] = await db
		.select({
			total: sql<number>`COALESCE(sum(${orders.grandTotal}), 0)`,
			count: sql<number>`count(*)`
		})
		.from(orders)
		.where(inArray(orders.status, ['PAID', 'SHIPPED', 'COMPLETED']));

	// 1.1 Omzet Breakdown by Category
	const revenueByCategory = await db
		.select({
			category: users.category,
			total: sql<number>`COALESCE(sum(${orders.grandTotal}), 0)`
		})
		.from(orders)
		.innerJoin(users, eq(orders.userId, users.id))
		.where(inArray(orders.status, ['PAID', 'SHIPPED', 'COMPLETED']))
		.groupBy(users.category);

	// 2. Expense Aggregation
	const [expenseData] = await db
		.select({
			total: sql<number>`COALESCE(sum(${expenses.amount}), 0)`,
			count: sql<number>`count(*)`
		})
		.from(expenses);

	// 3. Monthly Trend Aggregation
	const monthlyTrends = await db
		.select({
			month: sql<string>`to_char(${orders.createdAt}, 'YYYY-MM')`,
			revenue: sql<number>`COALESCE(sum(${orders.grandTotal}), 0)`
		})
		.from(orders)
		.where(inArray(orders.status, ['PAID', 'SHIPPED', 'COMPLETED']))
		.groupBy(sql`to_char(${orders.createdAt}, 'YYYY-MM')`)
		.orderBy(sql`to_char(${orders.createdAt}, 'YYYY-MM')`);

	// 4. Detailed Expense List
	const allExpenses = await db.query.expenses.findMany({
		orderBy: [desc(expenses.expenseDate)]
	});

	return {
		stats: {
			revenue: Number(revenueData?.total) || 0,
			expense: Number(expenseData?.total) || 0,
			orderCount: revenueData?.count || 0,
			expenseCount: expenseData?.count || 0,
			breakdown: revenueByCategory.reduce((acc, curr) => {
				acc[curr.category] = Number(curr.total);
				return acc;
			}, {} as Record<string, number>)
		},
		trends: {
			monthlyRevenue: monthlyTrends
		},
		allExpenses
	};

};
