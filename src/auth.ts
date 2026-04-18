import { SvelteKitAuth } from '@auth/sveltekit';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import Credentials from '@auth/sveltekit/providers/credentials';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import argon2 from 'argon2';

export const { handle, signIn, signOut } = SvelteKitAuth({
	adapter: DrizzleAdapter(db),
	session: {
		strategy: 'database'
	},
	providers: [
		Credentials({
			name: 'Credentials',
			credentials: {
				phone: { label: 'Phone Number', type: 'text' },
				password: { label: 'Password', type: 'password' }
			},
			async authorize(credentials) {
				if (!credentials?.phone || !credentials?.password) return null;

				const [user] = await db.select().from(users).where(eq(users.phone, credentials.phone as string));

				if (!user || !user.password) return null;

				const isValid = await argon2.verify(user.password, credentials.password as string);

				if (!isValid) return null;

				return {
					id: user.id,
					name: user.name,
					phone: user.phone,
					role: user.role,
					status: user.status
				};
			}
		})
	],
	callbacks: {
		async session({ session, user }) {
			if (session.user) {
				// Inject role & status into the session object for RBAC
				session.user.id = user.id;
				(session.user as any).role = (user as any).role;
				(session.user as any).status = (user as any).status;
			}
			return session;
		}
	}
});
