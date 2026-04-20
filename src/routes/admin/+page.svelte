<script lang="ts">
  import { enhance } from '$app/forms';
  import { fade } from 'svelte/transition';
  
  let { data, form } = $props();
  let loading = $state(false);

  function formatPrice(val: number) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(val);
  }
</script>

<div class="space-y-10" in:fade>
  <!-- Header Stats -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
    <div class="bg-zinc-800/50 border border-white/5 p-8 rounded-[2rem] shadow-xl relative overflow-hidden group">
      <div class="relative z-10">
        <p class="text-[10px] font-black text-brand-primary uppercase tracking-widest mb-2">Total Pendapatan</p>
        <h3 class="text-3xl font-black text-white">{formatPrice(data.stats.revenue)}</h3>
        <p class="text-[10px] text-zinc-500 mt-1 uppercase font-bold tracking-tighter">Gross dari {data.stats.totalOrders} Pesanan</p>
      </div>
      <div class="absolute right-6 top-1/2 -translate-y-1/2 opacity-10 group-hover:opacity-20 transition-all">
        <svg class="w-16 h-16 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    </div>

    <div class="bg-zinc-800/50 border border-white/5 p-8 rounded-[2rem] shadow-xl relative overflow-hidden group">
      <div class="relative z-10">
        <p class="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Klien Instansi</p>
        <h3 class="text-3xl font-black text-white">{data.stats.instansiCount} <span class="text-xs text-zinc-500 font-bold">Lembaga</span></h3>
        <p class="text-[10px] text-zinc-500 mt-1 uppercase font-bold tracking-tighter">Aktif dalam kontrak katering</p>
      </div>
      <div class="absolute right-6 top-1/2 -translate-y-1/2 opacity-10 group-hover:opacity-20 transition-all">
        <svg class="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
    </div>

    <div class="bg-zinc-800/50 border border-white/5 p-8 rounded-[2rem] shadow-xl relative overflow-hidden group">
        <div class="relative z-10">
          <p class="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Total Pengguna</p>
          <h3 class="text-3xl font-black text-white">{data.stats.totalUsers} <span class="text-xs text-zinc-500 font-bold">Jiwa</span></h3>
          <p class="text-[10px] text-zinc-500 mt-1 uppercase font-bold tracking-tighter">{data.stats.personalCount} Personal + {data.stats.instansiCount} Instansi</p>
        </div>
        <div class="absolute right-6 top-1/2 -translate-y-1/2 opacity-10 group-hover:opacity-20 transition-all">
          <svg class="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
      </div>
  </div>

  <!-- Tools Section -->
  <div class="grid lg:grid-cols-5 gap-8">
    
    <!-- Manual Account Creation (B2B Tool) -->
    <div class="lg:col-span-2 bg-zinc-900 border border-white/5 p-10 rounded-[2rem] shadow-2xl">
      <div class="mb-10">
        <h2 class="text-2xl font-black text-white tracking-tighter">B2B Account Creator</h2>
        <p class="text-zinc-500 text-xs mt-1">Gunakan form ini untuk membuat akun instansi setelah diskusi offline.</p>
      </div>

      <form 
        method="POST" 
        action="?/createInstansi" 
        use:enhance={() => {
          loading = true;
          return async ({ update }) => {
            loading = false;
            update();
          };
        }}
        class="space-y-6"
      >
        <div class="space-y-4">
          <div>
            <label class="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Nama PJ / Admin Instansi</label>
            <input name="name" required type="text" placeholder="Nama Penanggung Jawab" class="w-full px-6 py-4 bg-zinc-800 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all font-bold" />
          </div>
          <div>
            <label class="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Nama Instansi / Dinas</label>
            <input name="instansiName" required type="text" placeholder="E.g. Dinas Kesehatan Jakarta" class="w-full px-6 py-4 bg-zinc-800 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all font-bold" />
          </div>
          <div>
            <label class="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Nomor Telepon (ID Akun)</label>
            <input name="phone" required type="text" placeholder="08xxxx" class="w-full px-6 py-4 bg-zinc-800 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all font-bold" />
          </div>
          <div>
            <label class="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Password Sementara</label>
            <input name="password" required type="text" placeholder="Set password privat" class="w-full px-6 py-4 bg-zinc-800 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all font-bold" />
          </div>
        </div>

        {#if form?.message}
          <p class="text-xs font-bold {form?.success ? 'text-green-500' : 'text-red-500'}">{form.message}</p>
        {/if}

        <button 
          disabled={loading}
          class="w-full py-4 bg-brand-primary text-white rounded-2xl font-black shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          {#if loading}
            <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Memproses...
          {:else}
            Buat Akun Instansi
          {/if}
        </button>
      </form>
    </div>

    <!-- User Audit List -->
    <div class="lg:col-span-3 bg-zinc-900 border border-white/5 p-10 rounded-[2rem] shadow-2xl flex flex-col">
       <div class="mb-10 flex justify-between items-center">
          <div>
            <h2 class="text-2xl font-black text-white tracking-tighter">Audit Pengguna Terbaru</h2>
            <p class="text-zinc-500 text-xs mt-1">Log pendaftaran terakhir di seluruh kasta katering.</p>
          </div>
          <a href="/admin/users" class="text-[10px] font-black text-brand-primary uppercase tracking-widest hover:underline">Kelola Penuh</a>
       </div>

       <div class="space-y-4 flex-1">
          {#each data.recentUsers as user}
            <div class="flex items-center justify-between p-6 bg-white/5 rounded-[1.5rem] border border-white/10 hover:border-brand-primary/50 transition-all transition-colors group">
              <div class="flex items-center gap-5">
                 <div class="w-12 h-12 bg-brand-primary/20 text-brand-primary rounded-xl flex items-center justify-center font-black">
                   {(user.name ?? '?').charAt(0)}
                 </div>
                 <div>
                   <p class="text-white font-black leading-tight">{user.name ?? 'Anonymous'}</p>
                   <p class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{user.category} {user.instansiName ? `| ${user.instansiName}` : ''}</p>
                 </div>
              </div>
              <div class="text-right flex flex-col items-end">
                <span class="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest 
                  {user.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}">
                  {user.status}
                </span>
                <p class="text-[10px] text-zinc-500 mt-2 font-mono">{user.phone}</p>
              </div>
            </div>
          {/each}
       </div>
    </div>
  </div>
</div>
