import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq, sql, and, desc, inArray } from 'drizzle-orm';
import { error, fail } from '@sveltejs/kit';
import argon2 from 'argon2';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth();
	/*
	if (session?.user?.role !== 'CUSTOMER_SERVICE' && session?.user?.role !== 'ADMIN') {
		throw error(403, 'Akses ditolak');
	}
	*/


	// Fetch all Clients (INSTANSI)
	const clients = await db.query.users.findMany({
		where: inArray(users.category, ['INSTANSI_BISNIS', 'INSTANSI_PEGAWAI']),
		orderBy: [desc(users.createdAt)]
	});


	return {
		clients
	};
};

export const actions: Actions = {
	createClient: async ({ request, locals }) => {
		const session = await locals.auth();
		/*
		if (session?.user?.role !== 'CUSTOMER_SERVICE' && session?.user?.role !== 'ADMIN') {
			throw error(403, 'Akses ditolak');
		}
		*/


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
				category: 'INSTANSI_PEGAWAI',

				instansiName,
				status: 'ACTIVE',
				role: 'USER'
			});
			return { success: true, message: 'Akun instansi berhasil didaftarkan' };
		} catch (e) {
			console.error('Failed to create client account:', e);
			return fail(500, { message: 'Gagal mendaftarkan instansi' });
		}
	},

	toggleStatus: async ({ request, locals }) => {
		const session = await locals.auth();
		/*
		if (session?.user?.role !== 'CUSTOMER_SERVICE' && session?.user?.role !== 'ADMIN') {
			throw error(403, 'Akses ditolak');
		}
		*/


		const formData = await request.formData();
		const id = formData.get('id') as string;
		const currentStatus = formData.get('status') as string;

		if (!id || !currentStatus) return fail(400, { message: 'ID tidak ditemukan' });

		const nextStatus = currentStatus === 'ACTIVE' ? 'PENDING' : 'ACTIVE';

		try {
			await db.update(users)
				.set({ status: nextStatus as any })
				.where(eq(users.id, id));
			
			return { success: true, message: 'Status client diperbarui' };
		} catch (e) {
			return fail(500, { message: 'Gagal memperbarui status' });
		}
	}
};
