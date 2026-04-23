import { db } from '$lib/server/db';
import { menus, menuTypes, menuCategories } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth();
	if (session?.user?.role !== 'ADMIN') throw error(403, 'Akses ditolak');

	const allMenus = await db.query.menus.findMany({
		with: {
			type: true,
			category: true
		},
		orderBy: [desc(menus.createdAt)]
	});

	const allTypes = await db.select().from(menuTypes);
	const allCategories = await db.select().from(menuCategories);

	return {
		menus: allMenus,
		types: allTypes,
		categories: allCategories
	};
};

export const actions: Actions = {
	createMenu: async ({ request, locals }) => {
		const session = await locals.auth();
		if (session?.user?.role !== 'ADMIN') return fail(403, { message: 'Unauthorized' });

		const formData = await request.formData();
		const name = formData.get('name') as string;
		const typeId = formData.get('typeId') as string;
		const categoryId = formData.get('categoryId') as string;
		const basePrice = formData.get('basePrice') as string;
		const description = formData.get('description') as string;
		const image = formData.get('image') as string;

		try {
			await db.insert(menus).values({
				name,
				typeId,
				categoryId,
				basePrice,
				description,
				image,
				createdBy: session.user.id
			});
			return { success: true, message: 'Menu berhasil ditambahkan' };
		} catch (e) {
			console.error('Error creating menu:', e);
			return fail(500, { message: 'Gagal menambah menu' });
		}
	},

	updateMenu: async ({ request, locals }) => {
		const session = await locals.auth();
		if (session?.user?.role !== 'ADMIN') return fail(403, { message: 'Unauthorized' });

		const formData = await request.formData();
		const id = formData.get('id') as string;
		const name = formData.get('name') as string;
		const basePrice = formData.get('basePrice') as string;
		const description = formData.get('description') as string;

		try {
			await db.update(menus)
				.set({ 
					name, 
					basePrice,
					description
				})
				.where(eq(menus.id, id));
			return { success: true, message: 'Menu berhasil diperbarui' };
		} catch (e) {
			console.error('Error updating menu:', e);
			return fail(500, { message: 'Gagal memperbarui menu' });
		}
	},

	deleteMenu: async ({ request, locals }) => {
		const session = await locals.auth();
		if (session?.user?.role !== 'ADMIN') return fail(403, { message: 'Unauthorized' });

		const formData = await request.formData();
		const id = formData.get('id') as string;

		try {
			await db.delete(menus).where(eq(menus.id, id));
			return { success: true, message: 'Menu berhasil dihapus' };
		} catch (e) {
			console.error('Error deleting menu:', e);
			return fail(500, { message: 'Gagal menghapus menu' });
		}
	}
};
