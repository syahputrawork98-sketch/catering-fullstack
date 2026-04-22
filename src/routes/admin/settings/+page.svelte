<script lang="ts">
  import { fade } from 'svelte/transition';
  
  let { data } = $props();
</script>

<div class="space-y-12" in:fade>
  <!-- Header -->
  <div class="flex justify-between items-end">
    <div>
      <h1 class="text-4xl font-black text-white tracking-tighter">Konfigurasi Sistem</h1>
      <p class="text-zinc-500 text-sm mt-2 font-medium">Pengaturan parameter inti Gourmet Hub V1.</p>
    </div>
    <div class="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl">
        <p class="text-[10px] font-black text-brand-primary uppercase tracking-widest leading-none mb-1">Status Sistem</p>
        <p class="text-xs font-black text-green-500 uppercase">ONLINE - AUDIT ACTIVE</p>
    </div>
  </div>

  <div class="grid lg:grid-cols-2 gap-10">
    <!-- Branding Section -->
    <div class="bg-zinc-900 border border-white/5 p-10 rounded-[2.5rem] shadow-2xl space-y-8">
      <div class="flex items-center gap-4 mb-4">
        <div class="w-12 h-12 bg-brand-primary/10 text-brand-primary rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.828 2.828a2 2 0 010 2.828l-8.486 8.486L5 19" />
            </svg>
        </div>
        <h2 class="text-2xl font-black text-white tracking-tight">Identitas Brand</h2>
      </div>

      <div class="space-y-6">
        <div>
          <label class="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">Nama Aplikasi / Bisnis</label>
          <input type="text" readonly value={data.config.appName} class="w-full px-6 py-4 bg-zinc-800 border border-white/5 rounded-2xl text-white font-bold opacity-50 cursor-not-allowed" />
        </div>
        <div>
          <label class="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">Versi Infrastruktur</label>
          <input type="text" readonly value={data.config.version} class="w-full px-6 py-4 bg-zinc-800 border border-white/5 rounded-2xl text-white font-bold opacity-50 cursor-not-allowed" />
        </div>
      </div>

      <div class="mt-10 p-6 bg-brand-primary/5 border border-brand-primary/20 rounded-2xl">
         <p class="text-xs text-brand-primary font-bold leading-relaxed">
            Catatan: Pengubahan nama aplikasi secara permanen pada V1 memerlukan update pada file konfigurasi inti di `/constants`.
         </p>
      </div>
    </div>

    <!-- Security & Access -->
    <div class="bg-zinc-900 border border-white/5 p-10 rounded-[2.5rem] shadow-2xl space-y-8">
      <div class="flex items-center gap-4 mb-4">
        <div class="w-12 h-12 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002-2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
        </div>
        <h2 class="text-2xl font-black text-white tracking-tight">Hak Akses & Keamanan</h2>
      </div>

      <div class="p-8 bg-zinc-800 rounded-3xl border border-white/5">
        <div class="flex items-start gap-4">
            <div class="w-10 h-10 bg-amber-500/20 text-amber-500 rounded-lg flex items-center justify-center shrink-0">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <div>
                <p class="text-white font-black uppercase text-xs tracking-widest mb-1">Security Mode: STRICT (ENFORCED)</p>
                <p class="text-[10px] text-zinc-500 font-bold leading-relaxed">
                    Sistem saat ini sepenuhnya dijaga oleh RBAC (Role-Based Access Control). Bypass rute telah dinonaktifkan. Seluruh akses divalidasi dengan Auth.js.
                </p>
            </div>
        </div>
        <div class="mt-6 flex gap-3">
            <button class="flex-1 py-3 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-all cursor-not-allowed opacity-50" disabled>
                Sistem Aman
            </button>
            <button class="flex-1 py-3 bg-white/5 border border-white/10 text-zinc-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all">
                Reset Kebijakan
            </button>
        </div>
      </div>

      <div class="p-8 bg-zinc-800 rounded-3xl border border-white/5">
         <div class="flex items-center justify-between">
            <p class="text-xs font-black text-white/60 uppercase tracking-widest">Pembersihan Cache Data</p>
            <button class="text-[10px] font-black text-brand-primary uppercase underline">Bersihkan</button>
         </div>
      </div>
    </div>
  </div>
</div>
