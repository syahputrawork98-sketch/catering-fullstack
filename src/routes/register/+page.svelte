<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';

	let loading = false;
	let category = 'PUBLIK';

	const message = page.form?.message;
</script>

<div class="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-zinc-950 sm:px-6 lg:px-8">
	<div class="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-sm dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
		<div>
			<h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
				Daftar Akun Baru
			</h2>
			<p class="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
				Mulai memesan katering sehat harian Anda
			</p>
		</div>

		{#if message}
			<div class="rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/50">
				{message}
			</div>
		{/if}

		<form class="mt-8 space-y-6" method="POST" use:enhance={() => {
			loading = true;
			return async ({ update }) => {
				loading = false;
				update();
			};
		}}>
			<div class="space-y-4 rounded-md shadow-sm">
				<div>
					<label for="name" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Nama Lengkap</label>
					<input
						id="name"
						name="name"
						type="text"
						required
						class="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-orange-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white sm:text-sm"
						placeholder="Nama Lengkap"
					/>
				</div>

				<div>
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

				<div>
					<label for="category" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Kategori Pelanggan</label>
					<select
						id="category"
						name="category"
						bind:value={category}
						class="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:border-orange-500 focus:outline-none focus:ring-orange-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white sm:text-sm"
					>
						<option value="PUBLIK">Umum / Publik</option>
						<option value="INSTANSI">Instansi / Kantor</option>
					</select>
				</div>

				{#if category === 'INSTANSI'}
					<div>
						<label for="instansiName" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Nama Instansi</label>
						<input
							id="instansiName"
							name="instansiName"
							type="text"
							required
							class="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-orange-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white sm:text-sm"
							placeholder="Masukkan Nama Instansi"
						/>
					</div>
				{/if}
			</div>

			<div>
				<button
					type="submit"
					disabled={loading}
					class="group relative flex w-full justify-center rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50"
				>
					{#if loading}
						<span class="mr-2">Mendaftarkan...</span>
					{:else}
						Daftar Sekarang
					{/if}
				</button>
			</div>
		</form>

		<p class="text-center text-sm text-zinc-600 dark:text-zinc-400">
			Sudah punya akun?
			<a href="/login" class="font-medium text-orange-600 hover:text-orange-500">Masuk di sini</a>
		</p>
	</div>
</div>
