<script lang="ts">
	let {
		icon = '📋',
		title = 'No data found',
		description = '',
		action,
	}: {
		icon?: string;
		title?: string;
		description?: string;
		action?: import('svelte').Snippet;
	} = $props();
</script>

<div class="flex flex-col items-center justify-center py-16 px-4 text-center">
	<span class="text-5xl mb-4">{icon}</span>
	<h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-1">{title}</h3>
	{#if description}
		<p class="text-sm text-slate-500 dark:text-slate-400 max-w-sm">{description}</p>
	{/if}
	{#if action}
		<div class="mt-6">
			{@render action()}
		</div>
	{/if}
</div>
