<script lang="ts">
	let {
		currentPage,
		totalPages,
		onpagechange,
	}: {
		currentPage: number;
		totalPages: number;
		onpagechange: (page: number) => void;
	} = $props();

	function getPages(): (number | '...')[] {
		const pages: (number | '...')[] = [];
		if (totalPages <= 7) {
			for (let i = 1; i <= totalPages; i++) pages.push(i);
		} else {
			pages.push(1);
			if (currentPage > 3) pages.push('...');
			for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
				pages.push(i);
			}
			if (currentPage < totalPages - 2) pages.push('...');
			pages.push(totalPages);
		}
		return pages;
	}
</script>

{#if totalPages > 1}
	<nav class="flex items-center justify-center gap-1" aria-label="Pagination">
		<button
			type="button"
			disabled={currentPage <= 1}
			onclick={() => onpagechange(currentPage - 1)}
			class="px-3 py-2 text-sm rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
			aria-label="Previous page"
		>
			<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
		</button>
		{#each getPages() as page}
			{#if page === '...'}
				<span class="px-3 py-2 text-sm text-slate-400">...</span>
			{:else}
				<button
					type="button"
					onclick={() => onpagechange(page)}
					class="px-3 py-2 text-sm rounded-lg font-medium transition-colors {page === currentPage ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}"
					aria-current={page === currentPage ? 'page' : undefined}
				>
					{page}
				</button>
			{/if}
		{/each}
		<button
			type="button"
			disabled={currentPage >= totalPages}
			onclick={() => onpagechange(currentPage + 1)}
			class="px-3 py-2 text-sm rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
			aria-label="Next page"
		>
			<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
		</button>
	</nav>
{/if}
