<script lang="ts">
	import { SERVICES } from '$lib/utils/constants';
	import ServiceCard from '$lib/components/sections/ServiceCard.svelte';
</script>

<section id="services" class="py-20 lg:py-28 bg-slate-50 dark:bg-slate-800/50">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
			<h2 class="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
				Our <span class="text-blue-600">Services</span>
			</h2>
			<p class="text-slate-600 dark:text-slate-400">
				Comprehensive dental care tailored to your needs. From routine checkups to advanced procedures.
			</p>
		</div>

		<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
			{#each SERVICES as service}
				<ServiceCard {service} />
			{/each}
		</div>
	</div>
</section>
