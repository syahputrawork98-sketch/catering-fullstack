<script lang="ts">
	import { enhance } from '$app/forms';

	let loading = $state(false);
</script>

<div class="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-zinc-950 sm:px-6 lg:px-8">
	<div class="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-sm dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
		<div>
			<h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
				Selamat Datang Kembali
			</h2>
			<p class="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
				Silakan masuk ke akun katering Anda
			</p>
		</div>
		<form class="mt-8 space-y-6" method="POST" use:enhance={() => {
			loading = true;
			return async ({ update }) => {
				loading = false;
				update();
			};
		}}>
			<div class="-space-y-px rounded-md shadow-sm">
				<div class="mb-4">
					<label for="phone" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Nomor Telepon</label>
					<input
						id="phone"
						name="phone"
						type="tel"
						required
						class="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-orange-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white sm:text-sm"
						placeholder="08123456789"
					/>
				</div>
				<div>
					<label for="password" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Kata Sandi</label>
					<input
						id="password"
						name="password"
						type="password"
						required
						class="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-orange-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white sm:text-sm"
						placeholder="••••••••"
					/>
				</div>
			</div>

			<div class="flex items-center justify-between">
				<div class="flex items-center">
					<input
						id="remember-me"
						name="remember-me"
						type="checkbox"
						class="h-4 w-4 rounded border-zinc-300 text-orange-600 focus:ring-orange-500 dark:border-zinc-700"
					/>
					<label for="remember-me" class="ml-2 block text-sm text-zinc-900 dark:text-zinc-300">Ingat saya</label>
				</div>

				<div class="text-sm">
					<a href="/forgot-password" class="font-medium text-orange-600 hover:text-orange-500">Lupa kata sandi?</a>
				</div>
			</div>

			<div>
				<button
					type="submit"
					disabled={loading}
					class="group relative flex w-full justify-center rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50"
				>
					{#if loading}
						<span class="mr-2">Memproses...</span>
					{:else}
						Masuk Ke Akun
					{/if}
				</button>
			</div>
		</form>

		<p class="text-center text-sm text-zinc-600 dark:text-zinc-400">
			Belum punya akun?
			<a href="/register" class="font-medium text-orange-600 hover:text-orange-500">Daftar sekarang</a>
		</p>
	</div>
</div>
