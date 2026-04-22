<script lang="ts">
  import StockHub from '$lib/components/operations/StockHub.svelte';
  let { data, form } = $props();
</script>

<StockHub {data} {form} basePath="/admin" />
