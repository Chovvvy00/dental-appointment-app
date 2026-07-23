<script lang="ts">
	let {
		value = '',
		placeholder = 'Search...',
		oninput,
	}: {
		value?: string;
		placeholder?: string;
		oninput?: (value: string) => void;
	} = $props();

	let searchValue = $state(value);
	let debounceTimer: ReturnType<typeof setTimeout>;

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		searchValue = target.value;
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => oninput?.(searchValue), 300);
	}
</script>

<div class="relative">
	<svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
	</svg>
	<input
		type="text"
		value={searchValue}
		placeholder={placeholder}
		oninput={handleInput}
		class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:placeholder-slate-500 transition-colors"
	/>
</div>
