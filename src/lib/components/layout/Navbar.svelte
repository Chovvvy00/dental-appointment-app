<script lang="ts">
	let {
		currentPath = '/',
	}: {
		currentPath?: string;
	} = $props();

	let isMenuOpen = $state(false);
	let isScrolled = $state(false);

	function handleScroll() {
		isScrolled = window.scrollY > 20;
	}

	$effect(() => {
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});

	const links = [
		{ href: '/', label: 'Home' },
		{ href: '/#services', label: 'Services' },
		{ href: '/#dentists', label: 'Dentists' },
		{ href: '/status', label: 'Check Status' },
		{ href: '/#contact', label: 'Contact' },
	];

	function closeMenu() {
		isMenuOpen = false;
	}
</script>

<nav class="fixed top-0 left-0 right-0 z-40 transition-all duration-300 {isScrolled ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg shadow-xs' : 'bg-transparent'}">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex items-center justify-between h-16 lg:h-20">
			<a href="/" class="flex items-center gap-2.5 group">
				<div class="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg transition-transform group-hover:scale-105">
					D
				</div>
				<span class="text-lg font-bold text-slate-900 dark:text-white">DentalCare</span>
			</a>

			<div class="hidden md:flex items-center gap-1">
				{#each links as link}
					<a
						href={link.href}
						class="px-4 py-2 text-sm font-medium rounded-lg transition-colors {currentPath === link.href ? 'text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800'}"
					>
						{link.label}
					</a>
				{/each}
				<a
					href="/appointment"
					class="ml-3 inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all hover:shadow-lg hover:shadow-blue-200 dark:hover:shadow-blue-900/30 active:scale-[0.98]"
				>
					Book Appointment
				</a>
			</div>

			<button
				type="button"
				onclick={() => isMenuOpen = !isMenuOpen}
				class="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
				aria-label="Toggle menu"
			>
				<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					{#if isMenuOpen}
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					{:else}
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
					{/if}
				</svg>
			</button>
		</div>
	</div>

	<!-- Mobile menu -->
	{#if isMenuOpen}
		<div class="md:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 animate-slide-down">
			<div class="px-4 py-4 space-y-1">
				{#each links as link}
				<a
					href={link.href}
					class="block px-4 py-2.5 text-sm font-medium rounded-lg {currentPath === link.href ? 'text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}"
				>
						{link.label}
					</a>
				{/each}
				<a
					href="/appointment"
					class="block px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 text-center mt-3"
				>
					Book Appointment
				</a>
			</div>
		</div>
	{/if}
</nav>

<style>
	@keyframes slide-down {
		from { opacity: 0; transform: translateY(-10px); }
		to { opacity: 1; transform: translateY(0); }
	}
	.animate-slide-down { animation: slide-down 0.2s ease-out; }
</style>
