<script lang="ts">
  import { enhance } from '$app/forms';
  import { fade, fly, slide } from 'svelte/transition';
  import { 
    Search, 
    ChevronLeft, 
    X, 
    Trash2, 
    Eye, 
    Info, 
    Calendar,
    ArrowRight
  } from 'lucide-svelte';

  
  interface Menu {
    id: string;
    name: string;
    description: string | null;
    image: string;
    basePrice: string;
    typeId: string | null;
    categoryId: string | null;
    createdAt: Date;
    type?: { name: string };
    category?: { name: string };
  }

  let { data } = $props<{ data: { menus: Menu[], types: any[], categories: any[] } }>();

  
  // State
  let searchQuery = $state('');
  let selectedType = $state<string | null>(null);
  let selectedMenu = $state<Menu | null>(null);

  let isDeleting = $state<string | null>(null);
  let isEditing = $state(false);

  // Derived filtered menus
  let filteredMenus = $derived(
    data.menus.filter((m: Menu) => {
      const matchSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchType = selectedType ? m.typeId === selectedType : true;
      return matchSearch && matchType;
    })
  );

  function formatPrice(val: string) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(parseInt(val));
  }
</script>

<div class="min-h-screen bg-zinc-50 pb-20">
  <!-- Header & Navigation -->
  <div class="bg-white border-b border-zinc-100 px-8 py-8">
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <a href="/cs" class="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-brand-primary transition-colors mb-2">
          <ChevronLeft size={14} /> Kembali ke Dashboard
        </a>
        <h1 class="text-4xl font-black text-brand-charcoal tracking-tight">Master Menu Management</h1>
        <p class="text-zinc-400 font-medium mt-1">Kelola dan telusuri seluruh aset hidangan Gourmet Hub.</p>
      </div>

      <!-- Search & Filters -->
      <div class="flex flex-col sm:flex-row items-center gap-4">
            <div class="relative w-full sm:w-80 group">
              <label for="menu-search" class="sr-only">Cari Masakan</label>
              <Search class="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-brand-primary transition-colors" size={20} />
              <input 
                id="menu-search"
                type="text" 
                bind:value={searchQuery}
                placeholder="Cari masakan..." 
                class="w-full pl-14 pr-8 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all font-bold text-brand-charcoal"
              />
            </div>

        
        <div class="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none w-full sm:w-auto">
          <button 
            onclick={() => selectedType = null}
            class="px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap {selectedType === null ? 'bg-brand-charcoal text-white shadow-xl shadow-brand-charcoal/20' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'}"
          >
            Semua
          </button>
          {#each data.types as type}
            <button 
              onclick={() => selectedType = type.id}
              class="px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap {selectedType === type.id ? 'bg-brand-primary text-white shadow-xl shadow-brand-primary/20' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'}"
            >
              {type.name}
            </button>
          {/each}
        </div>
      </div>
    </div>
  </div>

  <!-- Content Grid -->
  <main class="max-w-7xl mx-auto px-8 mt-12">
    {#if filteredMenus.length === 0}
      <div class="flex flex-col items-center justify-center py-40 text-center" in:fade>
        <div class="w-24 h-24 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-300 mb-6">
          <Search size={48} />
        </div>
        <h3 class="text-2xl font-black text-brand-charcoal">Tidak Ada Menu Ditemukan</h3>
        <p class="text-zinc-400 font-medium mt-2">Coba sesuaikan pencarian atau filter Anda.</p>
        <button onclick={() => { searchQuery = ''; selectedType = null; }} class="mt-8 text-brand-primary font-black uppercase text-[10px] tracking-widest underline underline-offset-8">Reset Semua Filter</button>
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {#each filteredMenus as menu (menu.id)}
          <div 
            transition:fly={{ y: 20, duration: 400 }}
            class="group bg-white rounded-[2.5rem] border border-zinc-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all relative"
          >
            <!-- Card Image -->
            <div class="aspect-[4/5] bg-zinc-100 relative overflow-hidden flex items-center justify-center">
              <img 
                src={menu.image} 
                alt={menu.name} 
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                onerror={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/placeholder-menu.jpg' }}
              />


              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8 gap-4">
                <button 
                  onclick={() => selectedMenu = menu}
                  class="w-full py-4 bg-white text-brand-charcoal rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-brand-primary hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300"
                >
                  <Eye size={14} /> Detail Hidangan
                </button>
                <form 
                  method="POST" 
                  action="?/deleteMenu" 
                  use:enhance={() => {
                    return async ({ result, update }) => {
                      if (result.type === 'success') {
                        isDeleting = null;
                        await update();
                      }
                    };
                  }}

                  class="w-full"
                >
                  <input type="hidden" name="id" value={menu.id} />
                  {#if isDeleting === menu.id}
                    <div class="flex gap-2" in:slide>
                        <button type="submit" class="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all">Yakin?</button>
                        <button type="button" onclick={() => isDeleting = null} class="px-4 py-4 bg-white/20 backdrop-blur-md text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/30 transition-all">Batal</button>
                    </div>
                  {:else}
                    <button 
                      type="button"
                      onclick={() => isDeleting = menu.id}
                      class="w-full py-4 bg-red-500/20 backdrop-blur-md border border-red-500/30 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-500 hover:border-red-500 transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75"
                    >
                      <Trash2 size={14} /> Hapus Menu
                    </button>
                  {/if}
                </form>
              </div>
            </div>

            <!-- Card Body -->
            <div class="p-8">
              <div class="flex gap-2 mb-4">
                <span class="px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-lg text-[9px] font-black uppercase tracking-wider">{menu.type?.name}</span>
                <span class="px-3 py-1 bg-zinc-100 text-zinc-500 rounded-lg text-[9px] font-black uppercase tracking-wider">{menu.category?.name}</span>
              </div>
              <h3 class="text-2xl font-black text-brand-charcoal leading-tight mb-2 uppercase tracking-tight">{menu.name}</h3>
              <p class="text-zinc-400 text-sm font-medium line-clamp-2 mb-6">{menu.description || 'Tidak ada deskripsi.'}</p>
              
              <div class="flex items-center justify-between pt-6 border-t border-zinc-50">
                <div>
                  <p class="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Base Price</p>
                  <p class="text-xl font-black text-brand-charcoal italic">{formatPrice(menu.basePrice)}</p>
                </div>
                <div class="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-300 group-hover:bg-brand-primary group-hover:text-white transition-all transform group-hover:rotate-12">
                   <ArrowRight size={20} />
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </main>

  <!-- Gourmet Modal (Detail & Edit) -->
  {#if selectedMenu}
    <!-- Backdrop Overlay -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div 
      class="fixed inset-0 bg-brand-charcoal/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-8" 
      onclick={() => { if(!isEditing) selectedMenu = null }}
      transition:fade
    >
      <!-- Modal Container -->
      <div 
        class="bg-white w-full max-w-5xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row relative"
        onclick={(e) => e.stopPropagation()}
        transition:fly={{ y: 50, duration: 500 }}
      >
        <!-- Close Button -->
        <button 
          onclick={() => { selectedMenu = null; isEditing = false; }}
          class="absolute top-6 right-6 w-10 h-10 bg-zinc-100 hover:bg-brand-primary hover:text-white rounded-full flex items-center justify-center transition-all z-20"
        >
          <X size={20} />
        </button>

        <!-- Left: Visual Side -->
        <div class="w-full md:w-5/12 h-64 md:h-auto relative bg-zinc-100">
          <img 
            src={selectedMenu.image} 
            alt={selectedMenu.name} 
            class="w-full h-full object-cover" 
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent md:hidden"></div>
        </div>

        <!-- Right: Content Side -->
        <div class="w-full md:w-7/12 p-8 md:p-12 overflow-y-auto scrollbar-none flex flex-col">
          
          {#if !isEditing}
            <!-- VIEW MODE -->
            <div in:fade={{ duration: 300 }}>
              <div class="flex gap-2 mb-6">
                <span class="px-4 py-2 bg-brand-primary/10 text-brand-primary rounded-xl text-[10px] font-black uppercase tracking-widest">{selectedMenu.type?.name}</span>
                <span class="px-4 py-2 bg-zinc-100 text-zinc-500 rounded-xl text-[10px] font-black uppercase tracking-widest">{selectedMenu.category?.name}</span>
              </div>

              <h2 class="text-4xl md:text-5xl font-black text-brand-charcoal mb-4 leading-tight uppercase tracking-tighter">{selectedMenu.name}</h2>
              <p class="text-2xl font-black text-brand-primary italic mb-8">{formatPrice(selectedMenu.basePrice)}</p>

              <div class="space-y-8">
                <div>
                  <h4 class="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase mb-3 tracking-widest">
                    <Info size={14} /> Deskripsi Menu
                  </h4>
                  <p class="text-zinc-500 leading-relaxed font-medium text-lg">
                    {selectedMenu.description || 'Belum ada deskripsi untuk menu ini.'}
                  </p>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div class="p-6 bg-zinc-50 rounded-3xl border border-zinc-100">
                    <p class="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1 text-center">Dibuat Pada</p>
                    <p class="text-xs font-bold text-brand-charcoal text-center">{new Date(selectedMenu.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div class="p-6 bg-zinc-50 rounded-3xl border border-zinc-100">
                    <p class="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1 text-center">ID Menu</p>
                    <p class="text-[10px] font-mono font-bold text-zinc-400 text-center truncate">{selectedMenu.id}</p>
                  </div>
                </div>
              </div>

              <div class="mt-12 flex gap-4">
                <button 
                  onclick={() => isEditing = true}
                  class="flex-1 py-5 bg-brand-charcoal text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-brand-charcoal/20 hover:scale-105 active:scale-95 transition-all"
                >
                  Edit Menu
                </button>
                <button class="px-8 py-5 bg-zinc-100 text-zinc-500 rounded-2xl font-black uppercase tracking-widest hover:bg-zinc-200 transition-all">
                  <Calendar size={20} />
                </button>
              </div>
            </div>
          {:else}
            <!-- EDIT MODE -->
            <form 
              method="POST" 
              action="?/updateMenu" 
              use:enhance={() => {
                return async ({ result, update }) => {
                  if (result.type === 'success') {
                    isEditing = false;
                    selectedMenu = null;
                    await update();
                  }
                };
              }}
              class="flex-1 flex flex-col"
              in:fade={{ duration: 300 }}
            >
              <input type="hidden" name="id" value={selectedMenu.id} />
              
              <h3 class="text-2xl font-black text-brand-charcoal mb-8 uppercase tracking-tight border-l-4 border-brand-primary pl-4">Edit Detail Hidangan</h3>
              
              <div class="space-y-6 flex-1">
                <!-- Name -->
                <div class="space-y-2">
                  <label for="edit-name" class="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Nama Masakan</label>
                  <input 
                    id="edit-name"
                    name="name" 
                    type="text" 
                    value={selectedMenu.name}
                    class="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all font-bold text-brand-charcoal"
                    required
                  />
                </div>

                <!-- Price -->
                <div class="space-y-2">
                  <label for="edit-price" class="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Harga Dasar (Rp)</label>
                  <input 
                    id="edit-price"
                    name="basePrice" 
                    type="number" 
                    value={selectedMenu.basePrice}
                    class="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all font-bold text-brand-charcoal"
                    required
                  />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <!-- Type Selection -->
                  <div class="space-y-2">
                    <label for="edit-type" class="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Tipe</label>
                    <select 
                      id="edit-type"
                      name="typeId" 
                      class="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all font-bold text-brand-charcoal appearance-none"
                    >
                      <option value="">Pilih Tipe</option>
                      {#each data.types as type}
                        <option value={type.id} selected={selectedMenu.typeId === type.id}>{type.name}</option>
                      {/each}
                    </select>
                  </div>

                  <!-- Category Selection -->
                  <div class="space-y-2">
                    <label for="edit-category" class="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Kategori</label>
                    <select 
                      id="edit-category"
                      name="categoryId" 
                      class="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all font-bold text-brand-charcoal appearance-none"
                    >
                      <option value="">Pilih Kategori</option>
                      {#each data.categories as cat}
                        <option value={cat.id} selected={selectedMenu.categoryId === cat.id}>{cat.name}</option>
                      {/each}
                    </select>
                  </div>
                </div>

                <!-- Description -->
                <div class="space-y-2">
                  <label for="edit-description" class="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Deskripsi</label>
                  <textarea 
                    id="edit-description"
                    name="description" 
                    rows="3"
                    class="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all font-bold text-brand-charcoal resize-none"
                  >{selectedMenu.description || ''}</textarea>
                </div>
              </div>

              <div class="mt-8 flex gap-4">
                <button 
                  type="submit"
                  class="flex-1 py-5 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-brand-primary/20 hover:scale-105 active:scale-95 transition-all"
                >
                  Simpan Perubahan
                </button>
                <button 
                  type="button"
                  onclick={() => isEditing = false}
                  class="px-8 py-5 bg-zinc-100 text-zinc-500 rounded-2xl font-black uppercase tracking-widest hover:bg-zinc-200 transition-all"
                >
                  Batal
                </button>
              </div>
            </form>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  :global(.scrollbar-none::-webkit-scrollbar) {
    display: none;
  }
  :global(.scrollbar-none) {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>
