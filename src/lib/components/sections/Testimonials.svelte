<script lang="ts">
	import { TESTIMONIALS } from '$lib/utils/constants';

</script>

<section class="py-20 lg:py-28 bg-slate-50 dark:bg-slate-800/50">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
			<h2 class="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
				What Our <span class="text-blue-600">Patients Say</span>
			</h2>
			<p class="text-slate-600 dark:text-slate-400">
				Real feedback from real patients. We take pride in every smile we help create.
			</p>
		</div>

		<div class="grid md:grid-cols-2 gap-6 lg:gap-8">
			{#each TESTIMONIALS as testimonial}
				<div class="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
					<div class="flex items-center gap-1 mb-3">
						{#each [0,1,2,3,4] as star, i}
							<svg class="w-4 h-4 {i < testimonial.rating ? 'text-amber-400' : 'text-slate-200 dark:text-slate-700'}" fill="currentColor" viewBox="0 0 20 20">
								<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
							</svg>
						{/each}
					</div>
					<p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">"{testimonial.text}"</p>
					<div class="flex items-center justify-between">
						<span class="font-medium text-slate-900 dark:text-white text-sm">{testimonial.name}</span>
						<span class="text-xs text-slate-400">{testimonial.date}</span>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
