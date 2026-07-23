<script lang="ts">
	import type { Service } from '$lib/types';

	let {
		service,
	}: {
		service: Service;
	} = $props();
</script>

<div class="group relative bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-lg hover:shadow-blue-100 dark:hover:shadow-blue-900/20 transition-all duration-300 hover:-translate-y-1">
	<div class="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform duration-300">
		{service.icon}
	</div>
	<h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-2">{service.title}</h3>
	<p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">{service.description}</p>
	<div class="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
		<span class="text-sm text-slate-400 dark:text-slate-500">{service.duration}</span>
		<span class="text-lg font-bold text-blue-600">{service.price}</span>
	</div>
</div>
