<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import SearchBar from '$lib/components/ui/SearchBar.svelte';
	import Calendar from '$lib/components/ui/Calendar.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import { STATUS_COLORS } from '$lib/utils/constants';
	import { toastMessage } from '$lib/stores/appointment';
	import dayjs from 'dayjs';
	import type { Appointment, DashboardStats } from '$lib/types';

	let stats = $state<DashboardStats | null>(null);
	let appointments = $state<Appointment[]>([]);
	let loading = $state(true);
	let searchQuery = $state('');
	let statusFilter = $state('All');
	let sortBy = $state('date');
	let currentPage = $state(1);
	let selectedDate = $state('');
	let appointmentDates = $state<string[]>([]);
	let pageSize = 10;

	onMount(async () => {
		await loadData();
	});

	async function loadData() {
		loading = true;
		try {
			// Auto-mark missed appointments as NoShow
			await fetch('/api/admin/auto-no-show', { method: 'POST' });

			const [statsRes, appointmentsRes] = await Promise.all([
				fetch('/api/admin/stats'),
				fetch('/api/appointments'),
			]);
			if (statsRes.ok) stats = await statsRes.json();
			if (appointmentsRes.ok) {
				const data = await appointmentsRes.json();
				appointments = data;
				appointmentDates = [...new Set(data.map((a: Appointment) => a.appointmentDate))];
			}
		} catch (e) {
			console.error('Error loading admin data:', e);
		} finally {
			loading = false;
		}
	}

	let filteredAppointments = $derived.by(() => {
		let result = [...appointments];

		if (searchQuery) {
			const q = searchQuery.toLowerCase();
			result = result.filter(a =>
				a.patientName.toLowerCase().includes(q) ||
				a.email.toLowerCase().includes(q) ||
				a.service.toLowerCase().includes(q) ||
				a.dentist.toLowerCase().includes(q)
			);
		}

		if (statusFilter !== 'All') {
			result = result.filter(a => a.status === statusFilter);
		}

		if (selectedDate) {
			result = result.filter(a => a.appointmentDate === selectedDate);
		}

		result.sort((a, b) => {
			if (sortBy === 'date') return a.appointmentDate.localeCompare(b.appointmentDate);
			if (sortBy === 'name') return a.patientName.localeCompare(b.patientName);
			if (sortBy === 'status') return a.status.localeCompare(b.status);
			return 0;
		});

		return result;
	});

	let totalPages = $derived(Math.max(1, Math.ceil(filteredAppointments.length / pageSize)));
	let paginatedAppointments = $derived(filteredAppointments.slice((currentPage - 1) * pageSize, currentPage * pageSize));

	async function updateStatus(id: number, status: string) {
		try {
			const res = await fetch(`/api/appointments/${id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ status }),
			});
			if (res.ok) {
				toastMessage.set({ type: 'success', message: `Appointment ${status.toLowerCase()} successfully` });
				await loadData();
			}
		} catch {
			toastMessage.set({ type: 'error', message: 'Failed to update appointment' });
		}
	}

	async function deleteAppt(id: number) {
		if (!confirm('Are you sure you want to delete this appointment?')) return;
		try {
			const res = await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
			if (res.ok) {
				toastMessage.set({ type: 'success', message: 'Appointment deleted successfully' });
				await loadData();
			}
		} catch {
			toastMessage.set({ type: 'error', message: 'Failed to delete appointment' });
		}
	}

	const statusBadgeVariant: Record<string, 'warning' | 'success' | 'info' | 'danger' | 'default'> = {
		Pending: 'warning',
		Confirmed: 'success',
		Completed: 'info',
		Cancelled: 'danger',
		NoShow: 'default',
	};
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
			<p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Overview of your clinic's appointments</p>
		</div>
		<Button variant="primary" href="/appointment">+ New Appointment</Button>
	</div>

	{#if loading && !stats}
		<div class="py-20">
			<LoadingSpinner size="lg" text="Loading dashboard..." />
		</div>
	{:else}
		<!-- Stats cards -->
		{@const statItems = [
			{ label: "Today's Appointments", value: stats?.todayAppointments ?? 0, color: 'bg-blue-500', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
			{ label: 'Upcoming', value: stats?.upcomingAppointments ?? 0, color: 'bg-emerald-500', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
			{ label: 'Pending', value: stats?.pendingAppointments ?? 0, color: 'bg-amber-500', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
			{ label: 'Completed', value: stats?.completedAppointments ?? 0, color: 'bg-emerald-500', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
			{ label: 'Cancelled', value: stats?.cancelledAppointments ?? 0, color: 'bg-red-500', icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' },
		] as const}
		<div class="grid grid-cols-2 lg:grid-cols-5 gap-4">
			{#each statItems as item}
				<div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
					<div class="flex items-center justify-between mb-3">
						<div class="w-10 h-10 rounded-lg {item.color}/10 dark:{item.color}/20 flex items-center justify-center">
							<svg class="w-5 h-5 {item.color} text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d={item.icon} /></svg>
						</div>
					</div>
					<div class="text-2xl font-bold text-slate-900 dark:text-white">{item.value}</div>
					<div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.label}</div>
				</div>
			{/each}
		</div>

		<div class="grid lg:grid-cols-3 gap-6">
			<!-- Calendar -->
			<div class="lg:col-span-1">
				<Calendar
					selectedDate={selectedDate}
					appointmentDates={appointmentDates}
					onselect={(date) => { selectedDate = selectedDate === date ? '' : date; currentPage = 1; }}
				/>
			</div>

			<!-- Appointments list -->
			<div class="lg:col-span-2 space-y-4">
				<div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
					<div class="flex-1 w-full sm:max-w-xs">
						<SearchBar value={searchQuery} oninput={(v) => { searchQuery = v; currentPage = 1; }} placeholder="Search appointments..." />
					</div>
					<div class="flex gap-2 w-full sm:w-auto">
						<select
							value={statusFilter}
							onchange={(e) => { statusFilter = (e.target as HTMLSelectElement).value; currentPage = 1; }}
							class="text-sm rounded-xl border border-slate-300 bg-white px-3 py-2 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300"
						>
							<option value="All">All Status</option>
							<option value="Pending">Pending</option>
							<option value="Confirmed">Confirmed</option>
							<option value="Completed">Completed</option>
							<option value="Cancelled">Cancelled</option>
							<option value="NoShow">No Show</option>
						</select>
						<select
							value={sortBy}
							onchange={(e) => { sortBy = (e.target as HTMLSelectElement).value; }}
							class="text-sm rounded-xl border border-slate-300 bg-white px-3 py-2 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300"
						>
							<option value="date">Sort by Date</option>
							<option value="name">Sort by Name</option>
							<option value="status">Sort by Status</option>
						</select>
					</div>
				</div>

				{#if filteredAppointments.length === 0}
					<EmptyState
						icon="📅"
						title="No appointments found"
						description={searchQuery || statusFilter !== 'All' || selectedDate ? 'Try adjusting your filters' : 'No appointments have been booked yet'}
					>
						{#snippet action()}
							<Button href="/appointment">Book an Appointment</Button>
						{/snippet}
					</EmptyState>
				{:else}
					<div class="space-y-3">
						{#each paginatedAppointments as appt}
							<div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-sm transition-shadow">
								<div class="flex items-start justify-between gap-4">
									<div class="flex-1 min-w-0">
										<div class="flex items-center gap-3 mb-2">
											<h3 class="font-semibold text-slate-900 dark:text-white text-sm">{appt.patientName}</h3>
											{#if appt.referenceNumber}
												<span class="text-xs text-blue-600 dark:text-blue-400 font-mono">{appt.referenceNumber}</span>
											{/if}
											<Badge text={appt.status} variant={statusBadgeVariant[appt.status] || 'default'} />
										</div>
										<div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-500 dark:text-slate-400">
											<span class="flex items-center gap-1">
												<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
												{appt.service}
											</span>
											<span class="flex items-center gap-1">
												<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
												{appt.dentist}
											</span>
											<span class="flex items-center gap-1">
												<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
												{dayjs(appt.appointmentDate).format('MMM D, YYYY')}
											</span>
											<span class="flex items-center gap-1">
												<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
												{appt.appointmentTime}
											</span>
										</div>
									</div>
									<div class="flex gap-1.5 flex-shrink-0">
										{#if appt.status === 'Pending'}
											<button type="button" onclick={() => updateStatus(appt.id, 'Confirmed')} class="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/40 transition-colors" title="Confirm">
												<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
											</button>
											<button type="button" onclick={() => updateStatus(appt.id, 'Cancelled')} class="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 transition-colors" title="Cancel">
												<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
											</button>
										{/if}
										{#if appt.status === 'Confirmed'}
											<button type="button" onclick={() => updateStatus(appt.id, 'Completed')} class="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 transition-colors" title="Complete">
												<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
											</button>
										{/if}
										<button type="button" onclick={() => deleteAppt(appt.id)} class="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Delete">
											<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
										</button>
									</div>
								</div>
							</div>
						{/each}
					</div>

					<Pagination currentPage={currentPage} totalPages={totalPages} onpagechange={(p) => currentPage = p} />
				{/if}
			</div>
		</div>
	{/if}
</div>
