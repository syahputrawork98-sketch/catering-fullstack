<script lang="ts">
  import { page } from '$app/state';
  import { signOut } from '@auth/sveltekit/client';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  import { theme } from '$lib/stores/theme.svelte';
  import { STRATEGIC_NAV, OPERATIONAL_NAV_ADMIN as operationalNav } from '$lib/config/navigation';
  
  let { children } = $props();
  
  const user = $derived(page.data.session?.user);
</script>

<div class="flex h-screen transition-colors duration-300 overflow-hidden font-sans {theme.current === 'dark' ? 'dark' : ''}" style:background-color="var(--bg-app)" style:color="var(--text-app)">
  <!-- Sidebar -->
  <aside class="hidden md:flex md:w-64 md:flex-col bg-brand-charcoal text-white border-r border-white/5 transition-colors">
    <div class="flex flex-col flex-1 min-h-0">
      <!-- Logo Area -->
      <div class="flex items-center h-20 px-6 border-b border-white/5">
        <div class="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white font-bold mr-3">G</div>
        <span class="text-lg font-black tracking-tight text-white">Gourmet<span class="text-brand-primary">Admin</span></span>
      </div>

       <!-- Label -->
       <div class="px-6 py-4 border-b border-white/5 bg-white/5">
        <span class="text-[10px] font-black text-brand-primary uppercase tracking-widest">MASTER CONTROL</span>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 py-6 space-y-8 overflow-y-auto scrollbar-none">
        <!-- Strategic Section -->
        <div>
          <span class="px-4 text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block mb-4">Strategic Tools</span>
          <div class="space-y-1">
            {#each STRATEGIC_NAV as item}
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
          </div>
        </div>

        <!-- Operational Section -->
        <div>
          <span class="px-4 text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block mb-4">Operational Hub</span>
          <div class="space-y-1">
            {#each operationalNav as item}
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
          </div>
        </div>
      </nav>

      <!-- Bottom Profile -->
      <div class="p-4 border-t border-zinc-200 dark:border-white/5">
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
  <div class="flex flex-col flex-1 overflow-hidden transition-colors" style:background-color="var(--bg-app)">
    <!-- Header -->
    <header class="h-20 transition-colors border-b relative z-20 flex items-center justify-between px-8" style:background-color="var(--bg-app)" style:border-color="var(--border-app)">
      <div class="flex items-center">
        <h2 class="text-xl font-bold text-brand-charcoal dark:text-white">
          {#if page.url.pathname === '/admin'}
            Control Hub
          {:else if page.url.pathname.includes('/users')}
            Manajemen Pengguna
          {:else}
            Panel Administrator
          {/if}
        </h2>
      </div>

      <div class="flex items-center gap-6">
        <ThemeToggle />
        <div class="flex items-center gap-4">
          <div class="text-right hidden sm:block">
            <p class="text-sm font-bold text-brand-charcoal dark:text-zinc-100">{user?.name || 'Administrator'}</p>
            <p class="text-[10px] font-black text-brand-primary uppercase tracking-widest">SUPER ADMIN</p>
          </div>
          <div class="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary font-bold border border-brand-primary/20">
            {user?.name?.charAt(0) || 'A'}
          </div>
        </div>
      </div>
    </header>

    <!-- Page Content -->
    <main class="flex-1 overflow-y-auto p-10 relative">
      {@render children()}
    </main>
  </div>
</div>
