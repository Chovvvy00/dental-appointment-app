<script lang="ts">
	let isVisible = $state(false);

	$effect(() => {
		const timer = setTimeout(() => isVisible = true, 100);
		return () => clearTimeout(timer);
	});
</script>

<section class="relative min-h-[85vh] flex items-center bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950 overflow-hidden">
	<div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iLjAzIj48cGF0aCBkPSJNMzYgMzR2LTRoMnY0aC0yem0wIDB2LTRoLTR2NGgyem0tNCAwaC00djRoNHYtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40" />
	<div class="absolute top-20 right-20 w-72 h-72 bg-blue-200/30 dark:bg-blue-600/10 rounded-full blur-3xl" />
	<div class="absolute bottom-20 left-20 w-96 h-96 bg-cyan-200/20 dark:bg-cyan-600/10 rounded-full blur-3xl" />

	<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
		<div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
			<div class="space-y-8 transition-all duration-1000" class:opacity-0={!isVisible} class:opacity-100={isVisible} class:translate-y-4={!isVisible} class:translate-y-0={isVisible}>
				<div class="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
					<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10.362 1.093a.75.75 0 00-.724 0L2.523 5.018 10 9.143l7.477-4.125-7.115-3.925zM2.52 7.21l6.98 3.85v6.844l-6.98-3.85V7.21zM10.5 17.905v-6.844l6.98-3.85v6.844l-6.98 3.85z"/></svg>
					Trusted by 5,000+ patients
				</div>

				<h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-tight">
					Your Smile,
					<span class="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-cyan-500">Our Passion</span>
				</h1>

				<p class="text-lg text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
					Experience world-class dental care in a comfortable, modern environment. 
					From routine cleanings to advanced procedures, we treat every patient like family.
				</p>

				<div class="flex flex-wrap gap-4">
					<a
						href="/appointment"
						class="inline-flex items-center px-7 py-3.5 text-base font-medium rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all hover:shadow-lg hover:shadow-blue-200 dark:hover:shadow-blue-900/30 active:scale-[0.98]"
					>
						Book Appointment
						<svg class="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
					</a>
					<a
						href="#services"
						class="inline-flex items-center px-7 py-3.5 text-base font-medium rounded-xl border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-blue-600 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-all"
					>
						Our Services
					</a>
				</div>

				<div class="flex items-center gap-8 pt-4">
				<div class="flex -space-x-2">
					{#each [1,2,3,4] as num}
						<div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800 border-2 border-white dark:border-slate-900 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-300">
							{num}
						</div>
					{/each}
				</div>
					<div>
						<div class="flex items-center gap-1 text-amber-400">
						{#each [1,2,3,4,5] as _}
							<svg class="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
						{/each}
						</div>
						<p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">4.9/5 from 2,500+ reviews</p>
					</div>
				</div>
			</div>

			<div class="hidden lg:flex items-center justify-center transition-all duration-1000 delay-200" class:opacity-0={!isVisible} class:opacity-100={isVisible} class:translate-x-4={!isVisible} class:translate-x-0={isVisible}>
				<div class="relative">
					<div class="w-96 h-96 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-3xl rotate-6 opacity-20 dark:opacity-10" />
					<div class="absolute top-0 left-0 w-full h-full flex items-center justify-center">
						<div class="w-80 h-80 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center">
							<svg class="w-24 h-24 text-blue-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
							<p class="text-lg font-semibold text-slate-900 dark:text-white">Healthy Smile</p>
							<p class="text-sm text-slate-500 dark:text-slate-400 text-center mt-2">Comprehensive dental care for the whole family</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
