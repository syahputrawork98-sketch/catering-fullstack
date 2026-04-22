import { signIn } from '../../auth';
import { redirect, isRedirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// Kita biarkan user tetap di halaman login agar tidak mengganggu proses logout/switch account
	return {};
};

export const actions = {
	default: async (event) => {
		try {
			console.log("[LOGIN ACTION] Calling signIn...");
			return await signIn(event);
		} catch (error: any) {
			console.log("[LOGIN ACTION] Caught error:", error);
			if (error && typeof error === 'object' && 'status' in error && 'location' in error) {
				// This is a SvelteKit redirect
				throw error;
			}
			return { success: false, error: error.message || String(error) };
		}
	}
} satisfies Actions;
