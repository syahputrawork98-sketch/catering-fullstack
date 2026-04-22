<script lang="ts">
  import OrderStatusBadge from '$lib/components/OrderStatusBadge.svelte';
  import StatusStepper from '$lib/components/StatusStepper.svelte';
  import { generateThermalReceipt } from '$lib/utils/pdfGenerator';
  import { enhance } from '$app/forms';
  
  let { data } = $props<{ data: { orders: any[] } }>();
  const orders = $derived(data.orders || []);

  function formatPrice(val: number | string) {
		const price = typeof val === 'string' ? parseFloat(val) : val;
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(price);
	}

  function formatDate(date: string | Date) {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date(date));
  }

  // --- Image Resizing Logic (Max 400px) ---
  async function handleFileUpload(event: Event, orderId: string, form: HTMLFormElement) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        const base64 = canvas.toDataURL('image/jpeg', 0.9);
        
        // Inject into hidden fields and submit
        const imageInput = form.querySelector('input[name="image"]') as HTMLInputElement;
        imageInput.value = base64;
        form.requestSubmit();
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
</script>

<div class="px-6 py-8 max-w-5xl mx-auto h-full overflow-y-auto">
  <!-- Header -->
  <div class="mb-10">
    <h1 class="text-3xl font-extrabold text-brand-charcoal tracking-tight">Riwayat Pesanan</h1>
    <p class="text-zinc-500 text-sm mt-1">Pantau status pengiriman dan draf keranjang katering Anda.</p>
  </div>

  {#if orders.length === 0}
    <div class="py-20 text-center">
      <div class="w-20 h-20 bg-brand-primary/10 rounded-3xl flex items-center justify-center text-brand-primary mx-auto mb-6 text-2xl font-black">
        G
      </div>
      <h2 class="text-xl font-bold text-brand-charcoal mb-4 text-center">Belum ada pesanan</h2>
      <p class="text-zinc-500 mb-8 max-w-xs mx-auto text-center">Anda belum memiliki pesanan aktif di Gourmet Hub. Silakan pilih menu untuk memulai pesanan pertama Anda.</p>
      <a href="/dashboard/menu" class="btn-primary">Lihat Menu Hari Ini</a>
    </div>
  {:else}
    <div class="space-y-8 pb-20">
      {#each orders as order}
        <div class="bg-white rounded-[32px] border border-zinc-100 p-8 shadow-sm hover:shadow-xl hover:shadow-brand-primary/5 transition-all group">
          <!-- Card Header -->
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-zinc-50 pb-6">
            <div class="flex items-center gap-6">
              <div class="w-16 h-16 bg-brand-charcoal rounded-2xl flex items-center justify-center text-white shadow-lg">
                <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 118 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <div class="flex items-center gap-3 mb-1">
                  <span class="text-sm font-black text-brand-charcoal uppercase tracking-tighter">ID: {order.id.slice(0, 8)}</span>
                  <OrderStatusBadge status={order.status} />
                </div>
                <p class="text-xs text-zinc-400 font-medium">{formatDate(order.createdAt)} • {order.orderItems?.length || 0} Jenis Menu</p>
              </div>
            </div>

            <div class="flex flex-col items-end gap-3">
              <div class="text-right">
                <p class="text-[10px] text-zinc-400 uppercase font-black tracking-widest mb-1">Total Pembayaran</p>
                <p class="text-3xl font-black text-brand-primary">{formatPrice(order.grandTotal)}</p>
              </div>

              <div class="flex items-center gap-2">
                <button 
                  onclick={() => generateThermalReceipt(order)}
                  class="flex items-center gap-2 px-4 py-2.5 bg-zinc-100 text-brand-charcoal rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all"
                >
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Cetak Struk
                </button>

                {#if order.status === 'PENDING'}
                  <form 
                    method="POST" 
                    action="?/uploadProof" 
                    class="relative"
                    use:enhance
                  >
                    <input type="hidden" name="orderId" value={order.id} />
                    <input type="hidden" name="image" value="" />
                    <input 
                      type="file" 
                      accept="image/*" 
                      class="hidden" 
                      id="upload-{order.id}" 
                      onchange={(e) => handleFileUpload(e, order.id, e.currentTarget.form!)}
                    />
                    <label 
                      for="upload-{order.id}"
                      class="flex items-center gap-2 px-5 py-2.5 bg-brand-charcoal text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all cursor-pointer shadow-lg shadow-brand-charcoal/20"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      {order.paymentProof ? 'Update Bukti' : 'Upload Bukti'}
                    </label>
                  </form>
                {/if}
              </div>
            </div>
          </div>

          <!-- Payment Proof Preview (User Side) -->
          {#if order.paymentProof}
            <div class="mb-8 p-4 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200 flex items-center gap-4">
               <div class="w-12 h-16 bg-white rounded-lg overflow-hidden border border-zinc-100 shadow-sm">
                 <img src={order.paymentProof} alt="Bukti" class="w-full h-full object-cover" />
               </div>
               <div>
                 <p class="text-[10px] font-black text-brand-charcoal uppercase tracking-widest">Bukti Pembayaran Terkirim</p>
                 <p class="text-xs text-zinc-400 font-medium">Staff CS akan segera memverifikasi pesanan Anda.</p>
               </div>
            </div>
          {/if}

          <!-- Stepper Integration -->
          <div class="mb-12 px-4">
             <StatusStepper currentStatus={order.status} />
          </div>

          <!-- Item Preview (Optional but Premium) -->
          <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {#each order.orderItems as item}
              <div class="flex-shrink-0 flex items-center gap-3 bg-zinc-50 px-4 py-2 rounded-2xl border border-zinc-100">
                <div class="w-8 h-8 rounded-lg overflow-hidden bg-white border border-zinc-200">
                  <img src={item.menu?.image} alt="" class="w-full h-full object-cover" />
                </div>
                <div class="text-xs">
                  <p class="font-bold text-brand-charcoal leading-tight inline-block max-w-[120px] truncate">{item.menu?.name}</p>
                  <p class="text-zinc-400">{item.quantity} Porsi</p>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
