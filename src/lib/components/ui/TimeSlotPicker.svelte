<script lang="ts">
	import { TIME_SLOTS } from '$lib/utils/constants';

	let {
		selectedTime = '',
		bookedSlots = [] as string[],
		onselect,
	}: {
		selectedTime?: string;
		bookedSlots?: string[];
		onselect?: (time: string) => void;
	} = $props();
</script>

<div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
	{#each TIME_SLOTS as time}
		<button
			type="button"
			disabled={bookedSlots.includes(time)}
			onclick={() => onselect?.(time)}
			class="px-3 py-2.5 text-sm font-medium rounded-xl border transition-all duration-150 {selectedTime === time ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : bookedSlots.includes(time) ? 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600 dark:border-slate-700' : 'bg-white text-slate-700 border-slate-300 hover:border-blue-400 hover:text-blue-600 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-600 dark:hover:border-blue-500 dark:hover:text-blue-400'}"
		>
			{time}
		</button>
	{/each}
</div>
