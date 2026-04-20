<script lang="ts">
  import { enhance } from '$app/forms';
  import { fade, fly } from 'svelte/transition';
  
  let { data } = $props();
  
  let formLoading = $state(false);

  function formatPrice(val: string) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(parseInt(val));
  }
</script>

<div class="space-y-10" in:fade>
  <!-- Welcome Banner -->
  <div class="bg-brand-charcoal rounded-[2rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-brand-charcoal/20">
    <div class="relative z-10">
      <h1 class="text-4xl font-black tracking-tight mb-2">Selamat Datang, Operasional Staf</h1>
      <p class="text-zinc-400 max-w-xl font-medium">Dashboard ini adalah pusat kendali Gourmet Hub. Pantau pesanan, kelola menu, dan pastikan kepuasan instansi terjaga.</p>
    </div>
    <div class="absolute right-[-20px] top-[-20px] w-64 h-64 bg-brand-primary/10 rounded-full blur-[100px]"></div>
  </div>

  <!-- Stats Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <div class="bg-white p-8 rounded-[2rem] border border-zinc-100 shadow-sm hover:shadow-xl transition-all group">
      <p class="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Pesanan Hari Ini</p>
      <div class="flex items-end justify-between">
        <h3 class="text-4xl font-black text-brand-charcoal">{data.stats.ordersToday}</h3>
        <div class="w-10 h-10 bg-brand-primary/10 text-brand-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </div>
    </div>

    <div class="bg-white p-8 rounded-[2rem] border border-zinc-100 shadow-sm hover:shadow-xl transition-all group">
      <p class="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Butuh Verifikasi</p>
      <div class="flex items-end justify-between">
        <h3 class="text-4xl font-black text-orange-500">{data.stats.pendingOrders}</h3>
        <div class="w-10 h-10 bg-orange-100/50 text-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
    </div>

    <div class="bg-white p-8 rounded-[2rem] border border-zinc-100 shadow-sm hover:shadow-xl transition-all group">
      <p class="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Stok Menipis (Today)</p>
      <div class="flex items-end justify-between">
        <h3 class="text-4xl font-black text-red-500">{data.stats.lowStockItems}</h3>
        <div class="w-10 h-10 bg-red-100/50 text-red-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
      </div>
    </div>

    <div class="bg-white p-8 rounded-[2rem] border border-zinc-100 shadow-sm hover:shadow-xl transition-all group">
      <p class="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Klien Instansi</p>
      <div class="flex items-end justify-between">
        <h3 class="text-4xl font-black text-blue-600">{data.stats.totalInstansi}</h3>
        <div class="w-10 h-10 bg-blue-100/50 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
      </div>
    </div>
  </div>

  <!-- Main Tools Section -->
  <div class="grid lg:grid-cols-2 gap-10">
    <!-- Quick Menu Creator -->
    <div class="bg-white rounded-[2rem] border border-zinc-100 p-10 shadow-sm">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-2xl font-black text-brand-charcoal">Registrasi Menu Baru</h2>
        <span class="text-[10px] font-black text-zinc-400 uppercase tracking-widest bg-zinc-50 px-3 py-1 rounded-lg">Master Data</span>
      </div>

      <form 
        method="POST" 
        action="?/createMenu" 
        use:enhance={() => {
          formLoading = true;
          return async ({ result }) => {
            formLoading = false;
          };
        }}
        class="space-y-6"
      >
        <div class="grid grid-cols-2 gap-6">
          <div class="col-span-2">
            <label class="block text-[10px] font-black text-zinc-400 uppercase mb-2 tracking-widest">Nama Makanan</label>
            <input type="text" name="name" required class="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all font-bold text-brand-charcoal" placeholder="E.g. Healthy Salmon Soba" />
          </div>
          <div>
            <label class="block text-[10px] font-black text-zinc-400 uppercase mb-2 tracking-widest">Kategori</label>
            <select name="category" class="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all font-bold text-brand-charcoal appearance-none">
              <optgroup label="Main Course">
                <option>Nasi Kotak</option>
                <option>Bento Box</option>
                <option>Healthy Salad</option>
              </optgroup>
              <optgroup label="Others">
                <option>Snack & Drink</option>
              </optgroup>
            </select>
          </div>
          <div>
            <label class="block text-[10px] font-black text-zinc-400 uppercase mb-2 tracking-widest">Harga Dasar (IDR)</label>
            <input type="number" name="price" required class="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all font-bold text-brand-charcoal" placeholder="55000" />
          </div>
        </div>

        <button 
          disabled={formLoading}
          class="w-full py-4 bg-brand-primary text-white rounded-2xl font-black shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          {#if formLoading}
            <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Menyimpan...
          {:else}
            Simpan ke Master Menu
          {/if}
        </button>
      </form>
    </div>

    <!-- Recent Menus List -->
    <div class="bg-white rounded-[2rem] border border-zinc-100 p-10 shadow-sm flex flex-col">
      <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl font-black text-brand-charcoal">Master Menu Terbaru</h2>
          <a href="/cs/menu" class="text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-brand-primary transition-colors">Lihat Semua</a>
      </div>

      <div class="space-y-4 flex-1">
        {#each data.menus as item}
          <div class="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100 group hover:border-brand-primary/20 transition-all">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 bg-zinc-200 rounded-xl overflow-hidden shadow-inner">
                <img src={item.image} alt="" class="w-full h-full object-cover" />
              </div>
              <div>
                <p class="font-black text-brand-charcoal leading-tight">{item.name}</p>
                <p class="text-[10px] text-brand-primary font-black uppercase tracking-tighter">{item.category}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-black text-brand-charcoal text-sm">{formatPrice(item.basePrice)}</p>
              <p class="text-[8px] text-zinc-400 font-bold uppercase tracking-widest mt-0.5">Base Price</p>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
