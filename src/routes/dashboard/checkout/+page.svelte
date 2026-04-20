<script lang="ts">
	import { cart } from '$lib/stores/cartStore.svelte';
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';

	function formatPrice(val) {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(val);
	}

	let loading = $state(false);
</script>

<div class="px-6 py-8 max-w-5xl mx-auto h-full overflow-y-auto">
	<div class="mb-10">
		<h1 class="text-3xl font-extrabold text-brand-charcoal tracking-tight">Ringkasan Pesanan</h1>
		<p class="text-zinc-500 text-sm mt-1">Periksa kembali detail pesanan katering Anda sebelum pembayaran.</p>
	</div>

	<div class="grid lg:grid-cols-3 gap-10">
		<!-- Main Content -->
		<div class="lg:col-span-2 space-y-8">
			<!-- Order Items Card -->
			<div class="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden">
				<div class="p-6 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
					<h2 class="font-bold text-brand-charcoal">Menu Terpilih</h2>
					<span class="text-xs font-bold text-brand-primary">{cart.totalItems} Porsi</span>
				</div>
				<div class="p-6 divide-y divide-zinc-100">
					{#if cart.items.length === 0}
						<div class="py-10 text-center">
							<p class="text-zinc-400 italic">Keranjang kosong. <a href="/dashboard/menu" class="text-brand-primary font-bold">Cari menu?</a></p>
						</div>
					{:else}
						{#each cart.items as item}
							<div class="py-4 flex items-center justify-between first:pt-0 last:pb-0">
								<div class="flex items-center gap-4">
									<div class="w-16 h-16 rounded-2xl overflow-hidden bg-zinc-100">
										<img src={item.image} alt="" class="w-full h-full object-cover" />
									</div>
									<div>
										<h3 class="text-sm font-bold text-brand-charcoal">{item.name}</h3>
										<p class="text-xs text-zinc-400">{item.quantity} x {formatPrice(item.price)}</p>
									</div>
								</div>
								<p class="font-bold text-brand-charcoal text-sm">{formatPrice(item.price * item.quantity)}</p>
							</div>
						{/each}
					{/if}
				</div>
			</div>

			<!-- Delivery Info Card -->
			<div class="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden p-6">
				<h2 class="font-bold text-brand-charcoal mb-6 flex items-center">
					<svg class="w-5 h-5 mr-2 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
					</svg>
					Alamat Pengiriman
				</h2>
				<div class="p-5 bg-zinc-50 rounded-2xl border border-zinc-100">
					<p class="text-sm font-bold text-brand-charcoal">Kantor Pusat - Departemen Kepegawaian</p>
					<p class="text-xs text-zinc-500 mt-1">Lantai 4, Gedung A. Jl. Mangga Dua No. 12, Jakarta Pusat.</p>
					<button class="text-xs font-bold text-brand-primary mt-3 hover:underline">Ubah Alamat</button>
				</div>
			</div>
		</div>

		<!-- Summary Column -->
		<div class="lg:col-span-1">
			<div class="bg-brand-charcoal rounded-3xl p-8 text-white sticky top-24 shadow-2xl shadow-brand-charcoal/30">
				<h2 class="text-xl font-bold mb-8">Rincian Pembayaran</h2>
				<div class="space-y-4 mb-8">
					<div class="flex justify-between text-zinc-400 text-sm">
						<span>Subtotal ({cart.totalItems} menu)</span>
						<span class="text-white">{formatPrice(cart.totalPrice)}</span>
					</div>
					<div class="flex justify-between text-zinc-400 text-sm">
						<span>Biaya Antar</span>
						<span class="text-green-400">Gratis (Promo)</span>
					</div>
					<div class="flex justify-between text-zinc-400 text-sm">
						<span>PPN (11%)</span>
						<span class="text-white">{formatPrice(cart.totalPrice * 0.11)}</span>
					</div>
					<div class="pt-4 border-t border-white/10 flex justify-between items-center">
						<span class="text-lg font-bold">Total Akhir</span>
						<span class="text-2xl font-black text-brand-primary">{formatPrice(cart.totalPrice * 1.11)}</span>
					</div>
				</div>

				<form 
					method="POST" 
					action="?/checkout" 
					use:enhance={() => {
						loading = true;
						return async ({ result }) => {
							loading = false;
							if (result.type === 'success') {
								cart.clear();
								goto('/dashboard/orders?success=1');
							}
						};
					}}
				>
					<input type="hidden" name="cartData" value={JSON.stringify(cart.items)} />
					<input type="hidden" name="grandTotal" value={(cart.totalPrice * 1.11).toFixed(2)} />
					
					<button 
						type="submit"
						disabled={cart.items.length === 0 || loading}
						class="w-full bg-brand-primary text-white py-4 rounded-2xl font-bold hover:bg-white hover:text-brand-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-brand-primary/20 flex items-center justify-center gap-2"
					>
						{#if loading}
							<svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							Memproses...
						{:else}
							Konfirmasi Pesanan
						{/if}
					</button>
				</form>
				
				<p class="text-[10px] text-center text-zinc-500 mt-6 leading-relaxed">
					Dengan menyetujui, pesanan ini akan dicatat dan Anda wajib melakukan pembayaran sesuai metode yang dipilih.
				</p>
			</div>
		</div>
	</div>
</div>
