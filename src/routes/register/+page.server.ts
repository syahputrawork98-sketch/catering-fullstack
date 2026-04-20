import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import argon2 from 'argon2';

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const phone = formData.get('phone') as string;
		const password = formData.get('password') as string;
		const category = formData.get('category') as 'PUBLIK' | 'INSTANSI';
		const instansiName = formData.get('instansiName') as string;

		if (!name || !phone || !password || !category) {
			return fail(400, { message: 'Data tidak lengkap' });
		}

		if (category === 'INSTANSI' && !instansiName) {
			return fail(400, { message: 'Nama instansi wajib diisi untuk kategori Instansi' });
		}

		// Hash password
		const hashedPassword = await argon2.hash(password);

		// Determine status
		const status = category === 'INSTANSI' ? 'PENDING' : 'ACTIVE';

		try {
			await db.insert(users).values({
				name,
				phone,
				password: hashedPassword,
				category,
				instansiName: category === 'INSTANSI' ? instansiName : null,
				status,
				role: 'USER'
			});
		} catch (e: any) {
			if (e.message.includes('unique constraint')) {
				return fail(400, { message: 'Nomor telepon sudah terdaftar' });
			}
			return fail(500, { message: 'Gagal mendaftarkan akun' });
		}

		throw redirect(303, '/login?registered=true');
	}
} satisfies Actions;
