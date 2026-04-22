<script lang="ts">
  import OrderHub from '$lib/components/operations/OrderHub.svelte';
  let { data } = $props();
</script>

<OrderHub {data} basePath="/admin" />
