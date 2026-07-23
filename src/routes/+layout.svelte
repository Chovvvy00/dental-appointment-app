<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import Toast from '$lib/components/ui/Toast.svelte';
	import { toastMessage, isDarkMode } from '$lib/stores/appointment';

	let { children } = $props();

	let toast = $state<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
	let dark = $state(false);

	toastMessage.subscribe(v => {
		if (v) {
			toast = v;
			setTimeout(() => {
				toast = null;
				toastMessage.set(null);
			}, 4000);
		}
	});

	isDarkMode.subscribe(v => {
		dark = v;
		if (typeof document !== 'undefined') {
			document.documentElement.classList.toggle('dark', v);
		}
	});

	let path = $state('');

	$effect(() => {
		if (typeof window !== 'undefined') {
			path = window.location.pathname;
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
</svelte:head>

{#if toast}
	<Toast type={toast.type} message={toast.message} ondismiss={() => { toast = null; toastMessage.set(null); }} />
{/if}

<Navbar currentPath={path} />
<main>
	{@render children()}
</main>
<Footer />
