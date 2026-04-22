import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	// Memastikan kita mendapatkan sesi terbaru
	const session = await locals.auth();

	if (!session || !session.user) {
		// Tunggu sejenak dan coba sekali lagi jika gagal (Hydration safety)
		await new Promise(resolve => setTimeout(resolve, 500));
		const retrySession = await locals.auth();
		if (!retrySession || !retrySession.user) {
			throw redirect(303, '/login');
		}
		// Jika retry berhasil, gunakan sesi tersebut
		(session as any) = retrySession;
	}

	const role = (session.user as any).role?.toUpperCase();
	let target = '/dashboard';

	if (role === 'ADMIN') target = '/admin';
	else if (role === 'CUSTOMER_SERVICE') target = '/cs';

	// Menggunakan HTML Response untuk memaksa Full Page Reload 
	// guna membersihkan cache sidebar dan client-side state
	return new Response(
		`<html>
			<head>
				<meta http-equiv="refresh" content="0;url=${target}">
			</head>
			<body>
				<script>window.location.href = "${target}";</script>
			</body>
		</html>`,
		{
			headers: {
				'Content-Type': 'text/html'
			}
		}
	);
};
