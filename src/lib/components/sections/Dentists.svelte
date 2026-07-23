<script lang="ts">
	import { DENTISTS } from '$lib/utils/constants';

</script>

<section id="dentists" class="py-20 lg:py-28 bg-white dark:bg-slate-900">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
			<h2 class="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
				Meet Our <span class="text-blue-600">Dentists</span>
			</h2>
			<p class="text-slate-600 dark:text-slate-400">
				Experienced professionals dedicated to giving you the best dental care experience.
			</p>
		</div>

		<div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
			{#each DENTISTS as dentist}
				<div class="group text-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-lg hover:shadow-blue-100 dark:hover:shadow-blue-900/20 transition-all duration-300 hover:-translate-y-1">
					<div class="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40 mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-blue-600 group-hover:scale-110 transition-transform duration-300">
						{dentist.name.split(' ').map(n => n[0]).join('')}
					</div>
					<h3 class="text-lg font-semibold text-slate-900 dark:text-white">{dentist.name}</h3>
					<p class="text-sm text-blue-600 font-medium mt-1">{dentist.specialty}</p>
					<div class="inline-flex items-center gap-1 mt-3 text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
						<svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
						{dentist.experience} experience
					</div>
					<p class="text-sm text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">{dentist.bio}</p>
				</div>
			{/each}
		</div>
	</div>
</section>
