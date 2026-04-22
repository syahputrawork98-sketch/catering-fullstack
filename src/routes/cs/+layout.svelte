<script lang="ts">
  import { page } from '$app/state';
  import { signOut } from '@auth/sveltekit/client';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  
  let { children } = $props();
  
  const user = $derived(page.data.session?.user);
  const isAdmin = $derived(user?.role === 'ADMIN');
  
  const csNavigation = [
    { name: 'Operation Hub', href: '/cs', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Daftar Pesanan', href: '/cs/orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { name: 'Master Menu Hub', href: '/cs/menu', icon: 'M4 6h16M4 12h16M4 18h16' },
    { name: 'Stok Harian', href: '/cs/stock', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { name: 'Manajemen Client', href: '/cs/clients', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
  ];

  const strategicNav = [
    { name: 'Control Hub', href: '/admin', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { name: 'Manajemen User', href: '/admin/users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { name: 'Laporan Keuangan', href: '/admin/reports', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { name: 'Konfigurasi Sistem', href: '/admin/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
  ];
</script>

<div class="flex h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300 overflow-hidden">
  <!-- Sidebar -->
  <aside class="hidden md:flex md:w-64 md:flex-col {isAdmin ? 'bg-zinc-900 border-r border-white/5' : 'bg-brand-charcoal'} text-white">
    <div class="flex flex-col flex-1 min-h-0">
      <!-- Logo Area -->
      <div class="flex items-center h-20 px-6 border-b border-white/5">
        <div class="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white font-bold mr-3">G</div>
        <span class="text-lg font-black tracking-tight">Gourmet<span class="text-brand-primary">{isAdmin ? 'Admin' : 'Hub'}</span></span>
      </div>

      <!-- User Label -->
      <div class="px-6 py-4 border-b border-white/5 {isAdmin ? 'bg-white/5' : ''}">
        <span class="text-[10px] font-black text-brand-primary uppercase tracking-widest">{isAdmin ? 'MASTER CONTROL' : 'STAFF INTERFACE'}</span>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {#if isAdmin}
            <!-- Admin View of CS Area -->
            <div class="space-y-8">
                <div>
                    <span class="px-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-4">Strategic Tools</span>
                    <div class="space-y-1">
                        {#each strategicNav as item}
                            <a
                                href={item.href}
                                class="group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all
                                    {page.url.pathname === item.href 
                                    ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                                    : 'text-zinc-500 hover:bg-white/5 hover:text-white'}"
                            >
                                <svg class="w-5 h-5 mr-3 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={item.icon} />
                                </svg>
                                {item.name}
                            </a>
                        {/each}
                    </div>
                </div>

                <div>
                    <span class="px-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-4">Operational Hub</span>
                    <div class="space-y-1">
                        {#each csNavigation as item}
                            <a
                                href={item.href}
                                class="group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all
                                    {page.url.pathname === item.href 
                                    ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                                    : 'text-zinc-500 hover:bg-white/5 hover:text-white'}"
                            >
                                <svg class="w-5 h-5 mr-3 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={item.icon} />
                                </svg>
                                {item.name}
                            </a>
                        {/each}
                    </div>
                </div>
            </div>
        {:else}
            <!-- Regular CS View -->
            {#each csNavigation as item}
                <a
                    href={item.href}
                    class="group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all
                        {page.url.pathname === item.href 
                        ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                        : 'text-zinc-400 hover:bg-white/5 hover:text-white'}"
                >
                    <svg class="w-5 h-5 mr-3 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={item.icon} />
                    </svg>
                    {item.name}
                </a>
            {/each}
        {/if}
      </nav>

      <!-- Bottom Profile -->
      <div class="p-4 border-t border-white/5">
        <button 
          onclick={() => signOut()}
          class="flex items-center w-full px-4 py-3 text-sm font-medium text-zinc-400 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all"
        >
          <svg class="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Keluar
        </button>
      </div>
    </div>
  </aside>

  <!-- Main Content -->
  <div class="flex flex-col flex-1 overflow-hidden">
    <!-- Header -->
    <header class="h-20 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-white/5 flex items-center justify-between px-8 relative z-20 transition-colors">
      <div class="flex items-center">
        <h2 class="text-xl font-bold text-brand-charcoal dark:text-white">
          {#if page.url.pathname === '/cs'}
            Operation Hub
          {:else if page.url.pathname.includes('/orders')}
            Daftar Pesanan
          {:else}
            Manajemen Staf
          {/if}
        </h2>
      </div>

      <div class="flex items-center gap-6">
        <ThemeToggle />
        <div class="flex items-center gap-4">
          <div class="text-right hidden sm:block">
            <p class="text-sm font-bold text-brand-charcoal dark:text-white">{user?.name || 'Staff'}</p>
            <p class="text-[10px] font-black text-brand-primary uppercase tracking-widest">{user?.role || 'CUSTOMER_SERVICE'}</p>
          </div>
          <div class="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary font-bold border border-brand-primary/20">
            {user?.name?.charAt(0) || 'S'}
          </div>
        </div>
      </div>
    </header>

    <!-- Page Content -->
    <main class="flex-1 overflow-y-auto p-8 relative">
      {@render children()}
    </main>
  </div>
</div>
