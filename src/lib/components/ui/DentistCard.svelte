<script lang="ts">
	import type { Dentist } from '$lib/types';

	let {
		dentist,
		selected = false,
		onselect,
	}: {
		dentist: Dentist;
		selected?: boolean;
		onselect?: () => void;
	} = $props();
</script>

<button
	type="button"
	onclick={onselect}
	class="w-full text-left p-4 rounded-xl border-2 transition-all duration-200 {selected ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 dark:border-blue-500 shadow-sm' : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'}"
>
	<div class="flex items-center gap-4">
		<div class="w-14 h-14 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40 flex items-center justify-center text-lg font-bold text-blue-600 flex-shrink-0">
			{dentist.name.split(' ').map(n => n[0]).join('')}
		</div>
		<div class="flex-1 min-w-0">
			<h4 class="font-semibold text-slate-900 dark:text-white">{dentist.name}</h4>
			<p class="text-sm text-blue-600">{dentist.specialty}</p>
			<div class="flex items-center gap-2 mt-1 text-xs text-slate-400 dark:text-slate-500">
				<svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
				{dentist.experience} experience
			</div>
		</div>
		<div class="w-6 h-6 rounded-full border-2 {selected ? 'bg-blue-600 border-blue-600' : 'border-slate-300 dark:border-slate-600'} flex items-center justify-center">
			{#if selected}
				<svg class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
			{/if}
		</div>
	</div>
</button>
