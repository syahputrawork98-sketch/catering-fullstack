<script lang="ts">
	import MenuCard from "$lib/components/MenuCard.svelte";
	import CategoryFilter from "$lib/components/CategoryFilter.svelte";
	import { page } from "$app/state";
	import { fade, fly } from "svelte/transition";

	let { data } = $props();

	let categories = ["Nasi Kotak", "Bento Box", "Healty Salad", "Snack & Drink"];
	let activeCategory = $state("Semua");
	let searchQuery = $state("");

	// Filter logic for the already fetched menus
	let filteredItems = $derived(
		(data.menus || []).filter(item => 
			(activeCategory === "Semua" || item.category === activeCategory) &&
			(item.name.toLowerCase().includes(searchQuery.toLowerCase()))
		)
	);

	const selectedDate = $derived(data.selectedDate);
</script>

<div class="px-6 py-8 h-full overflow-y-auto bg-zinc-50/30">
	<!-- Header -->
	<div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
		<div>
			<h1 class="text-3xl font-black text-brand-charcoal tracking-tight">Katalog Menu</h1>
			<p class="text-zinc-500 text-sm mt-1">Sajian sehat harian, disiapkan dengan penuh cinta.</p>
		</div>

		<div class="relative w-full md:w-80">
			<input 
				type="text" 
				bind:value={searchQuery}
				placeholder="Cari menu favorit..."
				class="w-full pl-12 pr-4 py-3 bg-white border border-zinc-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all shadow-sm"
			/>
			<svg class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
			</svg>
		</div>
	</div>

	<!-- Date Scroller (Premium UI) -->
	<div class="mb-10">
		<p class="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4">Pilih Tanggal Pengiriman</p>
		<div class="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar -mx-2 px-2 snap-x">
			{#each data.dateItems as item}
				<a 
					href="?date={item.date}"
					class="flex-none snap-start group"
				>
					<div class="w-16 h-24 rounded-3xl flex flex-col items-center justify-center transition-all duration-300 border-2 
						{selectedDate === item.date 
							? 'bg-brand-charcoal text-white border-brand-charcoal shadow-xl shadow-brand-charcoal/20 -translate-y-1' 
							: 'bg-white text-zinc-400 border-zinc-100 hover:border-brand-primary/30 hover:text-brand-charcoal hover:-translate-y-1 shadow-sm'}"
					>
						<span class="text-[10px] font-bold uppercase tracking-tighter mb-1">{item.label}</span>
						<span class="text-2xl font-black">{item.dayNum}</span>
						<span class="text-[10px] font-bold opacity-60">{item.fullLabel.split(' ')[1]}</span>
					</div>
				</a>
			{/each}
		</div>
	</div>

	<!-- Category Filter -->
	<div class="mb-10">
		<div class="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
			<button 
				onclick={() => activeCategory = "Semua"}
				class="px-5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap
					{activeCategory === "Semua" ? 'bg-brand-primary text-white shadow-lg' : 'bg-white text-zinc-500 border border-zinc-100 hover:bg-zinc-50'}"
			>
				Semua
			</button>
			{#each categories as cat}
				<button 
					onclick={() => activeCategory = cat}
					class="px-5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap
						{activeCategory === cat ? 'bg-brand-primary text-white shadow-lg' : 'bg-white text-zinc-500 border border-zinc-100 hover:bg-zinc-50'}"
				>
					{cat}
				</button>
			{/each}
		</div>
	</div>

	<!-- Menu Grid -->
	{#key selectedDate}
		<div 
			in:fade={{ duration: 300, delay: 100 }}
			class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
		>
			{#each filteredItems as item}
				<MenuCard 
					id={item.id}
					name={item.name} 
					price={item.basePrice} 
					category={item.category} 
					stock={item.stock} 
					image={item.image} 
					deliveryDate={selectedDate}
				/>
			{/each}
		</div>
	{/key}

	<!-- No Result -->
	{#if filteredItems.length === 0}
		<div class="flex flex-col items-center justify-center py-24 text-zinc-400" in:fade>
			<div class="w-24 h-24 bg-zinc-100 rounded-full flex items-center justify-center mb-6">
				<svg class="w-12 h-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
				</svg>
			</div>
			<p class="text-xl font-black text-brand-charcoal">Menu Tidak Tersedia</p>
			<p class="text-sm mt-1">Maaf, belum ada menu yang dijadwalkan untuk tanggal ini.</p>
		</div>
	{/if}
</div>

<style>
	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}
	.no-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>
