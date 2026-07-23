<script lang="ts">
	let {
		class: className = '',
		variant = 'text',
	}: {
		class?: string;
		variant?: 'text' | 'circular' | 'rectangular' | 'card';
	} = $props();

	const variants: Record<string, string> = {
		text: 'h-4 w-full rounded',
		circular: 'h-12 w-12 rounded-full',
		rectangular: 'h-32 w-full rounded-xl',
		card: 'h-48 w-full rounded-xl',
	};
</script>

<div class="animate-pulse bg-slate-200 dark:bg-slate-700 {variants[variant]} {className}" />
