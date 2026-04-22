import { handle as authHandle } from './auth';
import { sequence } from '@sveltejs/kit/hooks';
import { redirect, type Handle } from '@sveltejs/kit';


const rbacHandle: Handle = async ({ event, resolve }) => {
	const session = await event.locals.auth();
	const path = event.url.pathname;

	// 🛡️ RBAC Guard Logic
	const userRole = (session?.user as any)?.role?.toUpperCase();

	if (path.startsWith('/admin')) {
		if (!session || userRole !== 'ADMIN') {
			throw redirect(303, '/cs'); 
		}
	}

	if (path.startsWith('/cs')) {
		if (!session || (userRole !== 'ADMIN' && userRole !== 'CUSTOMER_SERVICE')) {
			throw redirect(303, '/dashboard');
		}
	}

    if (path.startsWith('/dashboard')) {
        if (!session) {
            throw redirect(303, '/login');
        }
    }

	return resolve(event);
};

export const handle = sequence(authHandle, rbacHandle);


