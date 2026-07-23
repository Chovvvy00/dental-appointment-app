<script lang="ts">
	let {
		open = false,
		title = '',
		onclose,
		children,
	}: {
		open?: boolean;
		title?: string;
		onclose?: () => void;
		children: import('svelte').Snippet;
	} = $props();

	function handleBackdrop(e: MouseEvent) {
		if (e.target === e.currentTarget) onclose?.();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') onclose?.();
	}
</script>

<svelte:window {onkeydown} />

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
		role="dialog"
		aria-modal="true"
		aria-label={title}
		onclick={handleBackdrop}
	>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			class="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 animate-scale-in"
		onclick={(e) => e.stopPropagation()}
		role="document"
		>
			{#if title}
				<div class="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800">
					<h2 class="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
					<button
						type="button"
						onclick={onclose}
						class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-800 transition-colors"
						aria-label="Close"
					>
						<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
					</button>
				</div>
			{/if}
			<div class="p-6">
				{@render children()}
			</div>
		</div>
	</div>
{/if}

<style>
	@keyframes fade-in {
		from { opacity: 0; }
		to { opacity: 1; }
	}
	@keyframes scale-in {
		from { opacity: 0; transform: scale(0.95); }
		to { opacity: 1; transform: scale(1); }
	}
	.animate-fade-in { animation: fade-in 0.2s ease-out; }
	.animate-scale-in { animation: scale-in 0.2s ease-out; }
</style>
