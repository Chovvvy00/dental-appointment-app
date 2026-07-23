<script lang="ts">
	let {
		label,
		name,
		value = '',
		options,
		placeholder = 'Select...',
		error = '',
		required = false,
		disabled = false,
		class: className = '',
		onchange,
		...rest
	}: {
		label?: string;
		name: string;
		value?: string;
		options: { value: string; label: string }[];
		placeholder?: string;
		error?: string;
		required?: boolean;
		disabled?: boolean;
		class?: string;
		onchange?: (e: Event) => void;
	} = $props();

	let selectValue = $state(value);

	function handleChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		selectValue = target.value;
		onchange?.(e);
	}
</script>

<div class="space-y-1.5 {className}">
	{#if label}
		<label for={name} class="block text-sm font-medium text-slate-700 dark:text-slate-300">
			{label}
			{#if required}<span class="text-red-500 ml-0.5">*</span>{/if}
		</label>
	{/if}
	<select
		{name}
		id={name}
		value={selectValue}
		{required}
		{disabled}
		{onchange}
		class="block w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 transition-colors duration-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:focus:ring-blue-400 {error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 dark:border-slate-600'}"
		{...rest}
	>
		<option value="" disabled>{placeholder}</option>
		{#each options as opt}
			<option value={opt.value}>{opt.label}</option>
		{/each}
	</select>
	{#if error}
		<p class="text-sm text-red-500">{error}</p>
	{/if}
</div>
