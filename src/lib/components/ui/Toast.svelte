<script lang="ts">
	let {
		message,
		type = 'info',
		ondismiss,
	}: {
		message: string;
		type?: 'success' | 'error' | 'info';
		ondismiss?: () => void;
	} = $props();

	const icons: Record<string, string> = {
		success: '✓',
		error: '✕',
		info: 'ℹ',
	};

	const colors: Record<string, string> = {
		success: 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/40 dark:border-emerald-700 dark:text-emerald-300',
		error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/40 dark:border-red-700 dark:text-red-300',
		info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/40 dark:border-blue-700 dark:text-blue-300',
	};

	const iconColors: Record<string, string> = {
		success: 'bg-emerald-500',
		error: 'bg-red-500',
		info: 'bg-blue-500',
	};
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	class="fixed top-4 right-4 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg animate-slide-in cursor-pointer max-w-sm {colors[type]}"
	role="alert"
	onclick={(e) => e.stopPropagation()}
>
	<div class="flex-shrink-0 w-6 h-6 rounded-full {iconColors[type]} flex items-center justify-center text-white text-xs font-bold">
		{icons[type]}
	</div>
	<p class="text-sm font-medium flex-1">{message}</p>
	<button type="button" {ondismiss} class="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity" aria-label="Dismiss">
		<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
	</button>
</div>

<style>
	@keyframes slide-in {
		from { opacity: 0; transform: translateX(100%); }
		to { opacity: 1; transform: translateX(0); }
	}
	.animate-slide-in { animation: slide-in 0.3s ease-out; }
</style>
