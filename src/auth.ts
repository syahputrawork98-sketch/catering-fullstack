import { SvelteKitAuth } from '@auth/sveltekit';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import Credentials from '@auth/sveltekit/providers/credentials';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import argon2 from 'argon2';
import { AUTH_SECRET } from '$env/static/private';

export const { handle, signIn, signOut } = SvelteKitAuth({
	// adapter: DrizzleAdapter(db), // Temporarily disabled to debug JWT loop
	secret: AUTH_SECRET,
	trustHost: true,
	session: {
		strategy: 'jwt'
	},
	pages: {
		signIn: '/login',
		error: '/login'
	},
	providers: [
		Credentials({
			name: 'Credentials',
			credentials: {
				phone: { label: 'Phone Number', type: 'text' },
				password: { label: 'Password', type: 'password' }
			},
			async authorize(credentials) {
				console.log("[AUTH] Authorize called with phone:", credentials?.phone);
				if (!credentials?.phone || !credentials?.password) return null;

				try {
					const [user] = await db.select().from(users).where(eq(users.phone, credentials.phone as string));

					if (!user || !user.password) {
						console.log("[AUTH] User not found or no password");
						return null;
					}

					const isValid = await argon2.verify(user.password, credentials.password as string);

					if (!isValid) {
						console.log("[AUTH] Invalid password");
						return null;
					}

					console.log("[AUTH] User authorized:", user.id);
					return {
						id: user.id,
						name: user.name,
						phone: user.phone,
						role: user.role,
						status: user.status
					};
				} catch (err) {
					console.error("[AUTH] Database error in authorize:", err);
					return null;
				}
			}
		})
	],
	callbacks: {
		async jwt({ token, user }) {
			// Jika ini adalah login pertama (user objek ada)
			if (user) {
				token.id = user.id;
				token.role = (user as any).role?.toUpperCase();
				token.status = (user as any).status;
			} 
			// Jika role hilang tapi kita punya ID, coba ambil ulang dari DB (Fallback Safety)
			else if (token.id && !token.role) {
				const [dbUser] = await db.select().from(users).where(eq(users.id, token.id as string));
				if (dbUser) {
					token.role = dbUser.role.toUpperCase();
					token.status = dbUser.status;
				}
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user && token) {
				session.user.id = token.id as string;
				(session.user as any).role = (token.role as string)?.toUpperCase() || 'USER';
				(session.user as any).status = token.status as string;
				
				// Debug log ke terminal (dan nanti bisa kita cek)
				console.log(`[SESSION_ACTIVE] User: ${session.user.id}, Role: ${(session.user as any).role}`);
			}
			return session;
		}
	}
});
