<script lang="ts">
	let { children } = $props();

	let sidebarOpen = $state(false);
	let currentPath = $state('/admin');

	$effect(() => {
		if (typeof window !== 'undefined') {
			currentPath = window.location.pathname;
		}
	});

	const navItems = [
		{ href: '/admin', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
		{ href: '/admin/appointments', label: 'Appointments', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
	];
</script>

<div class="min-h-screen bg-slate-50 dark:bg-slate-900 pt-16">
	<!-- Mobile sidebar overlay -->
	{#if sidebarOpen}
		<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
		<div
			class="fixed inset-0 z-40 bg-black/50 lg:hidden"
			role="button"
			tabindex="-1"
			onclick={() => sidebarOpen = false}
		></div>
	{/if}

	<!-- Sidebar -->
	<aside class="fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-200 lg:translate-x-0 lg:top-16 {sidebarOpen ? 'translate-x-0' : '-translate-x-full'}">
		<div class="p-6">
			<h2 class="text-lg font-bold text-slate-900 dark:text-white">Admin Panel</h2>
			<p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">DentalCare Management</p>
		</div>
		<nav class="px-3 space-y-1">
			{#each navItems as item}
				<a
					href={item.href}
					onclick={() => sidebarOpen = false}
					class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors {currentPath === item.href ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}"
				>
					<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="{item.icon}" /></svg>
					{item.label}
				</a>
			{/each}
		</nav>
	</aside>

	<!-- Mobile toggle -->
	<button
		type="button"
		onclick={() => sidebarOpen = !sidebarOpen}
		class="lg:hidden fixed bottom-6 right-6 z-30 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
		aria-label="Toggle sidebar"
	>
		<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
	</button>

	<main class="lg:ml-64 p-6">
		{@render children()}
	</main>
</div>
