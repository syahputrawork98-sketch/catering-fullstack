import { db } from '$lib/server/db';
import { orders, orderItems, dailySchedules } from '$lib/server/db/schema';
import { error, fail } from '@sveltejs/kit';
import { eq, and, sql } from 'drizzle-orm';
import type { Actions } from './$types';

export const actions: Actions = {
	checkout: async ({ request, locals }) => {
		const session = await locals.auth();
		if (!session?.user?.id) {
			throw error(401, 'Silakan login terlebih dahulu');
		}

		const formData = await request.formData();
		const cartJson = formData.get('cartData') as string;
		const grandTotal = formData.get('grandTotal') as string;

		if (!cartJson || !grandTotal) {
			return fail(400, { message: 'Keranjang belanja kosong' });
		}

		const cartItems = JSON.parse(cartJson);
		if (cartItems.length === 0) {
			return fail(400, { message: 'Keranjang belanja kosong' });
		}

		// Grouping Strategy: For this implementation, we take the delivery date from the first item
		// to set the overall order's delivery date.
		const mainDeliveryDate = cartItems[0].deliveryDate;

		try {
			// Atomic Transaction: All or Nothing
			const result = await db.transaction(async (tx) => {
				
				// 1. Stock Verification and Decrement Loop
				for (const item of cartItems) {
					// Find the specific schedule entry
					const [schedule] = await tx
						.select()
						.from(dailySchedules)
						.where(
							and(
								eq(dailySchedules.menuId, item.id),
								eq(dailySchedules.availableDate, item.deliveryDate)
							)
						);

					if (!schedule) {
						throw new Error(`Menu "${item.name}" tidak tersedia untuk tanggal tersebut.`);
					}

					if (schedule.currentStock < item.quantity) {
						throw new Error(`Stok "${item.name}" tidak cukup. Sisa: ${schedule.currentStock}`);
					}

					// 2. Atomic Decrement
					await tx
						.update(dailySchedules)
						.set({
							currentStock: sql`${dailySchedules.currentStock} - ${item.quantity}`
						})
						.where(eq(dailySchedules.id, schedule.id));
				}

				// 3. Create Order Master record
				const [newOrder] = await tx.insert(orders).values({
					userId: session.user.id,
					grandTotal: grandTotal,
					deliveryDate: mainDeliveryDate,
					status: 'PENDING'
				}).returning();

				// 4. Create Order Items detail records
				const itemsToInsert = cartItems.map((item: any) => ({
					orderId: newOrder.id,
					menuId: item.id,
					priceSnapshot: item.price.toString(),
					quantity: item.quantity
				}));

				await tx.insert(orderItems).values(itemsToInsert);

				return newOrder;
			});

			return { success: true, orderId: result.id };
		} catch (e: any) {
			console.error('Checkout error:', e);
			return fail(400, { 
				message: e instanceof Error ? e.message : 'Gagal memproses pesanan silakan ulangi' 
			});
		}
	}
};
