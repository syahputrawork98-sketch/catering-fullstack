<script lang="ts">
  import { page } from '$app/state';
  import { signOut } from '@auth/sveltekit/client';
  import { cart } from '$lib/stores/cartStore.svelte';
  import CartDrawer from '$lib/components/CartDrawer.svelte';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  
  let { children } = $props();
  
  const user = $derived(page.data.session?.user);
  
  const navigation = [
    { name: 'Ringkasan', href: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Pesanan Saya', href: '/dashboard/orders', icon: 'M16 11V7a4 4 0 118 0v4M5 9h14l1 12H4L5 9z' },
    { name: 'Menu Hari Ini', href: '/dashboard/menu', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { name: 'Profil & Billing', href: '/dashboard/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  ];
</script>

<div class="flex h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300 overflow-hidden">
  <!-- Sidebar -->
  <aside class="hidden md:flex md:w-64 md:flex-col bg-brand-charcoal text-white">
    <div class="flex flex-col flex-1 min-h-0">
      <!-- Logo Area -->
      <div class="flex items-center h-20 px-6 border-b border-white/5">
        <div class="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white font-bold mr-3">G</div>
        <span class="text-lg font-black tracking-tighter transition-all">Gourmet<span class="text-brand-primary">Hub</span></span>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {#each navigation as item}
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
          {#if page.url.pathname === '/dashboard'}
            Ringkasan Dashboard
          {:else if page.url.pathname.includes('/orders')}
            Pesanan Saya
          {:else if page.url.pathname.includes('/menu')}
            Menu Catering
          {:else}
            Profil Saya
          {/if}
        </h2>
      </div>

      <div class="flex items-center gap-6">
        <ThemeToggle />
        <div class="flex items-center gap-4">
          <!-- Cart Button -->
          <button 
            onclick={() => cart.toggleDrawer()}
            class="relative w-12 h-12 flex items-center justify-center rounded-2xl bg-zinc-50 dark:bg-white/10 border border-zinc-100 dark:border-white/10 text-brand-charcoal dark:text-white hover:bg-brand-primary/10 hover:border-brand-primary/20 hover:text-brand-primary transition-all mr-2"
          >
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 118 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {#if cart.totalItems > 0}
              <span class="absolute -top-1 -right-1 w-5 h-5 bg-brand-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-brand-primary/20 animate-in zoom-in">
                {cart.totalItems}
              </span>
            {/if}
          </button>

          <div class="text-right hidden sm:block">
            <p class="text-sm font-bold text-brand-charcoal dark:text-white">{user?.name || 'User'}</p>
            <p class="text-xs text-zinc-500 capitalize">{user?.role?.toLowerCase() || 'Personal'}</p>
          </div>
          <div class="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary font-bold border border-brand-primary/20">
            {user?.name?.charAt(0) || 'U'}
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

<CartDrawer />
