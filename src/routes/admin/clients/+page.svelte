<script lang="ts">
  import ClientHub from '$lib/components/operations/ClientHub.svelte';
  let { data, form } = $props();
</script>

<ClientHub {data} {form} basePath="/admin" />
