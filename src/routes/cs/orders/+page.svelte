<script lang="ts">
	import { enhance } from '$app/forms';
	import { fade } from 'svelte/transition';
	import { cart } from '$lib/stores/cartStore.svelte'; // Just for price formatting if shared

	let { data } = $props();

	let searchQuery = $state('');
	let selectedStatus = $state('ALL');

	const todayStr = new Date().toISOString().split('T')[0];

	function formatPrice(val: number) {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(val);
	}

	function formatDate(dateStr: string) {
		const d = new Date(dateStr);
		return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
	}

	let filteredOrders = $derived(
		(data.orders || []).filter((order: any) => {
			const matchesSearch = 
				order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
				order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesStatus = selectedStatus === 'ALL' || order.status === selectedStatus;
			return matchesSearch && matchesStatus;
		})
	);

	// Stats for logic cards
	let stats = $derived({
		total: data.orders.length,
		pending: data.orders.filter((o: any) => o.status === 'PENDING').length,
		today: data.orders.filter((o: any) => o.deliveryDate === todayStr).length
	});

	let updatingId = $state<string | null>(null);
</script>

<div class="px-6 py-8 h-full overflow-y-auto bg-zinc-50/30">
	<!-- Header -->
	<div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
		<div>
			<h1 class="text-3xl font-black text-brand-charcoal tracking-tight">Operation Center</h1>
			<p class="text-zinc-500 text-sm mt-1">Kelola pesanan dan prioritaskan pengiriman hari ini.</p>
		</div>

		<div class="flex items-center gap-4">
			<div class="relative w-full md:w-64">
				<input 
					type="text" 
					bind:value={searchQuery}
					placeholder="Cari ID atau Nama..."
					class="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 shadow-sm"
				/>
				<svg class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				</svg>
			</div>
			
			<select 
				bind:value={selectedStatus}
				class="bg-white border border-zinc-100 rounded-xl px-4 py-2.5 text-xs font-bold text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-brand-primary/20 shadow-sm"
			>
				<option value="ALL">Semua Status</option>
				<option value="PENDING">Pending</option>
				<option value="PAID">Dibayar</option>
				<option value="SHIPPED">Dikirim</option>
				<option value="COMPLETED">Selesai</option>
				<option value="CANCELLED">Dibatalkan</option>
			</select>
		</div>
	</div>

	<!-- Quick Stats -->
	<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
		<div class="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm">
			<p class="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Total Pesanan</p>
			<h3 class="text-3xl font-black text-brand-charcoal">{stats.total}</h3>
		</div>
		<div class="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm">
			<p class="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Butuh Verifikasi</p>
			<h3 class="text-3xl font-black text-brand-primary">{stats.pending}</h3>
		</div>
		<div class="bg-brand-charcoal p-6 rounded-3xl shadow-xl shadow-brand-charcoal/20 text-white relative overflow-hidden">
			<div class="relative z-10">
				<p class="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Pengiriman Hari Ini</p>
				<h3 class="text-3xl font-black">{stats.today}</h3>
			</div>
			<svg class="absolute right-[-10px] bottom-[-10px] w-24 h-24 text-white/5" fill="currentColor" viewBox="0 0 24 24">
				<path d="M11 20H4a2 2 0 01-2-2V5c0-1.1.9-2 2-2h8l2 2h7a2 2 0 012 2v10a2 2 0 01-2 2h-1" />
			</svg>
		</div>
	</div>

	<!-- Order Table -->
	<div class="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden">
		<div class="overflow-x-auto">
			<table class="w-full text-left border-collapse">
				<thead>
					<tr class="bg-zinc-50 border-b border-zinc-100">
						<th class="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-tighter">ID & Pelanggan</th>
						<th class="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-tighter">Dibuat Pada</th>
						<th class="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-tighter">Tanggal Kirim</th>
						<th class="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-tighter">Item</th>
						<th class="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-tighter">Total</th>
						<th class="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-tighter text-right">Status</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-zinc-50">
					{#each filteredOrders as order (order.id)}
						<tr class="hover:bg-zinc-50/50 transition-colors {order.deliveryDate === todayStr ? 'bg-brand-primary/5' : ''}">
							<td class="px-6 py-5">
								<div class="flex flex-col">
									<span class="text-xs font-mono text-zinc-400">#{order.id.slice(0, 8)}</span>
									<span class="text-sm font-bold text-brand-charcoal">{order.user?.name}</span>
									<span class="text-[10px] text-zinc-500">{order.user?.category}</span>
								</div>
							</td>
							<td class="px-6 py-5 text-xs text-zinc-500">
								{new Date(order.createdAt).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}
							</td>
							<td class="px-6 py-5">
								<div class="flex items-center gap-2">
									{#if order.deliveryDate === todayStr}
										<span class="w-2 h-2 rounded-full bg-brand-primary animate-pulse"></span>
										<span class="text-xs font-black text-brand-primary">HARI INI</span>
									{:else}
										<span class="text-xs text-zinc-500 font-medium">{formatDate(order.deliveryDate)}</span>
									{/if}
								</div>
							</td>
							<td class="px-6 py-5 text-xs text-zinc-500">
								{order.orderItems.length} menu ({order.orderItems.reduce((acc: number, item: any) => acc + item.quantity, 0)} porsi)
							</td>
							<td class="px-6 py-5 font-bold text-sm text-brand-charcoal">
								{formatPrice(parseFloat(order.grandTotal))}
							</td>
							<td class="px-6 py-5 text-right">
								<form 
									method="POST" 
									action="?/updateStatus" 
									use:enhance={() => {
										updatingId = order.id;
										return async () => { updatingId = null; };
									}}
								>
									<input type="hidden" name="orderId" value={order.id} />
									<div class="relative inline-flex items-center">
										{#if updatingId === order.id}
											<div class="absolute -left-6" in:fade>
												<svg class="animate-spin h-4 w-4 text-brand-primary" viewBox="0 0 24 24">
													<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
													<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
												</svg>
											</div>
										{/if}
										<select 
											name="status"
											value={order.status}
											onchange={(e) => e.currentTarget.form?.requestSubmit()}
											class="bg-zinc-100 border-none rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-brand-primary/20 cursor-pointer"
										>
											<option value="PENDING">Pending</option>
											<option value="PAID">Dibayar</option>
											<option value="SHIPPED">Dikirim</option>
											<option value="COMPLETED">Selesai</option>
											<option value="CANCELLED">Dibatalkan</option>
										</select>
									</div>
								</form>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		
		{#if filteredOrders.length === 0}
			<div class="py-20 text-center text-zinc-400 bg-white">
				<p class="italic text-sm">Tidak ada pesanan ditemukan.</p>
			</div>
		{/if}
	</div>
</div>
