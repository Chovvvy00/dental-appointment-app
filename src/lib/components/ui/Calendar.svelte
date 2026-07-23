<script lang="ts">
	import dayjs from 'dayjs';
	import { getMonthDays, getWeekdayHeaders, isDateDisabled } from '$lib/utils';
	import { CLINIC_HOLIDAYS } from '$lib/utils/constants';

	let {
		selectedDate = '',
		bookedDates = [] as string[],
		appointmentDates = [] as string[],
		onselect,
	}: {
		selectedDate?: string;
		bookedDates?: string[];
		appointmentDates?: string[];
		onselect?: (date: string) => void;
	} = $props();

	let currentMonth = $state(dayjs().month());
	let currentYear = $state(dayjs().year());
	let days = $derived(getMonthDays(currentYear, currentMonth));
	let weekdayHeaders = $derived(getWeekdayHeaders());
	let today = $derived(dayjs().format('YYYY-MM-DD'));

	function prevMonth() {
		if (currentMonth === 0) {
			currentMonth = 11;
			currentYear--;
		} else {
			currentMonth--;
		}
	}

	function nextMonth() {
		if (currentMonth === 11) {
			currentMonth = 0;
			currentYear++;
		} else {
			currentMonth++;
		}
	}

	function handleDateClick(date: dayjs.Dayjs) {
		if (!isDateClickable(date)) return;
		onselect?.(date.format('YYYY-MM-DD'));
	}

	function isDateClickable(date: dayjs.Dayjs): boolean {
		return !isDateDisabled(date);
	}

	function isBooked(date: dayjs.Dayjs): boolean {
		return bookedDates.includes(date.format('YYYY-MM-DD'));
	}

	function hasAppointments(date: dayjs.Dayjs): boolean {
		return appointmentDates.includes(date.format('YYYY-MM-DD'));
	}

	function isHoliday(date: dayjs.Dayjs): boolean {
		return CLINIC_HOLIDAYS.includes(date.format('YYYY-MM-DD'));
	}

	function isSelected(date: dayjs.Dayjs): boolean {
		return date.format('YYYY-MM-DD') === selectedDate;
	}

	function isToday(date: dayjs.Dayjs): boolean {
		return date.format('YYYY-MM-DD') === today;
	}

	function isCurrentMonth(date: dayjs.Dayjs): boolean {
		return date.month() === currentMonth;
	}
</script>

<div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
	<div class="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
		<button
			type="button"
			onclick={prevMonth}
			class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
			aria-label="Previous month"
		>
			<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
		</button>
		<h3 class="text-base font-semibold text-slate-900 dark:text-white">
			{dayjs(new Date(currentYear, currentMonth)).format('MMMM YYYY')}
		</h3>
		<button
			type="button"
			onclick={nextMonth}
			class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
			aria-label="Next month"
		>
			<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
		</button>
	</div>

	<div class="p-4">
		<div class="grid grid-cols-7 mb-2">
			{#each weekdayHeaders as day}
				<div class="text-center text-xs font-medium text-slate-400 dark:text-slate-500 py-2">{day}</div>
			{/each}
		</div>

		<div class="grid grid-cols-7 gap-1">
			{#each days as date}
				<button
					type="button"
					disabled={!isDateClickable(date)}
					onclick={() => handleDateClick(date)}
					class="relative p-2 text-sm rounded-xl transition-all duration-150 {isSelected(date) ? 'bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-blue-900/30' : isToday(date) ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400 font-semibold' : isDateClickable(date) ? 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300' : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'} {!isCurrentMonth(date) ? 'opacity-40' : ''}"
					aria-label={date.format('MMMM D, YYYY')}
				>
					{date.date()}
					{#if hasAppointments(date) && !isSelected(date)}
						<span class="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500" />
					{/if}
					{#if isBooked(date)}
						<span class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500" />
					{/if}
					{#if isHoliday(date)}
						<span class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500" />
					{/if}
				</button>
			{/each}
		</div>
	</div>

	<div class="flex items-center gap-4 px-4 pb-4 text-xs text-slate-400 dark:text-slate-500">
		<span class="flex items-center gap-1.5">
			<span class="w-2.5 h-2.5 rounded-full bg-blue-500" /> Appointments
		</span>
		<span class="flex items-center gap-1.5">
			<span class="w-2.5 h-2.5 rounded-full bg-red-500" /> Booked
		</span>
		<span class="flex items-center gap-1.5">
			<span class="w-2.5 h-2.5 rounded-full bg-amber-500" /> Holiday
		</span>
	</div>
</div>
