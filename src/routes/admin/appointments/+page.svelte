<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import SearchBar from '$lib/components/ui/SearchBar.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import { toastMessage } from '$lib/stores/appointment';
	import dayjs from 'dayjs';
	import type { Appointment } from '$lib/types';

	let appointments = $state<Appointment[]>([]);
	let loading = $state(true);
	let searchQuery = $state('');
	let statusFilter = $state('All');
	let sortBy = $state('date');
	let currentPage = $state(1);
	let pageSize = 10;
	let editingAppt = $state<Appointment | null>(null);
	let editNotes = $state('');
	let showEditModal = $state(false);

	onMount(async () => {
		await loadAppointments();
	});

	async function loadAppointments() {
		loading = true;
		try {
			const res = await fetch('/api/appointments');
			if (res.ok) appointments = await res.json();
		} catch (e) {
			console.error('Error loading appointments:', e);
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
				a.service.toLowerCase().includes(q)
			);
		}
		if (statusFilter !== 'All') result = result.filter(a => a.status === statusFilter);
		result.sort((a, b) => {
			if (sortBy === 'date') return a.appointmentDate.localeCompare(b.appointmentDate);
			if (sortBy === 'name') return a.patientName.localeCompare(b.patientName);
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
				toastMessage.set({ type: 'success', message: `Appointment ${status.toLowerCase()}` });
				await loadAppointments();
			}
		} catch {
			toastMessage.set({ type: 'error', message: 'Update failed' });
		}
	}

	async function deleteAppt(id: number) {
		if (!confirm('Delete this appointment permanently?')) return;
		try {
			const res = await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
			if (res.ok) {
				toastMessage.set({ type: 'success', message: 'Appointment deleted' });
				await loadAppointments();
			}
		} catch {
			toastMessage.set({ type: 'error', message: 'Delete failed' });
		}
	}

	function openEditModal(appt: Appointment) {
		editingAppt = appt;
		editNotes = appt.notes || '';
		showEditModal = true;
	}

	async function saveNotes() {
		if (!editingAppt) return;
		try {
			const res = await fetch(`/api/appointments/${editingAppt.id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ notes: editNotes }),
			});
			if (res.ok) {
				toastMessage.set({ type: 'success', message: 'Notes updated' });
				showEditModal = false;
				editingAppt = null;
				await loadAppointments();
			}
		} catch {
			toastMessage.set({ type: 'error', message: 'Failed to update notes' });
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
			<h1 class="text-2xl font-bold text-slate-900 dark:text-white">Appointments</h1>
			<p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage all patient appointments</p>
		</div>
		<Button href="/appointment">+ New Appointment</Button>
	</div>

	<div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
		<div class="flex-1 w-full sm:max-w-xs">
			<SearchBar value={searchQuery} oninput={(v) => { searchQuery = v; currentPage = 1; }} placeholder="Search patients..." />
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
			</select>
		</div>
	</div>

	{#if loading}
		<div class="py-20"><LoadingSpinner size="lg" text="Loading appointments..." /></div>
	{:else if filteredAppointments.length === 0}
		<EmptyState icon="📅" title="No appointments" description={searchQuery || statusFilter !== 'All' ? 'No matches found' : 'No appointments yet'}>
			{#snippet action()}<Button href="/appointment">Book Appointment</Button>{/snippet}
		</EmptyState>
	{:else}
		<div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
			<div class="overflow-x-auto">
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
							<th class="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400">Patient</th>
							<th class="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400">Service</th>
							<th class="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400">Dentist</th>
							<th class="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400">Date</th>
							<th class="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400">Time</th>
							<th class="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400">Status</th>
							<th class="text-right px-4 py-3 font-medium text-slate-500 dark:text-slate-400">Actions</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-slate-100 dark:divide-slate-800">
						{#each paginatedAppointments as appt}
							<tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
								<td class="px-4 py-3">
									<div class="font-medium text-slate-900 dark:text-white">
										{appt.patientName}
										{#if appt.referenceNumber}
											<span class="ml-2 text-xs text-blue-600 dark:text-blue-400 font-mono">{appt.referenceNumber}</span>
										{/if}
									</div>
									<div class="text-xs text-slate-400">{appt.email}</div>
								</td>
								<td class="px-4 py-3 text-slate-600 dark:text-slate-400">{appt.service}</td>
								<td class="px-4 py-3 text-slate-600 dark:text-slate-400">{appt.dentist}</td>
								<td class="px-4 py-3 text-slate-600 dark:text-slate-400">{dayjs(appt.appointmentDate).format('MMM D, YYYY')}</td>
								<td class="px-4 py-3 text-slate-600 dark:text-slate-400">{appt.appointmentTime}</td>
								<td class="px-4 py-3"><Badge text={appt.status} variant={statusBadgeVariant[appt.status] || 'default'} /></td>
								<td class="px-4 py-3 text-right">
									<div class="flex items-center justify-end gap-1">
										{#if appt.status === 'Pending'}
											<button type="button" onclick={() => updateStatus(appt.id, 'Confirmed')} class="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20" title="Confirm"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg></button>
											<button type="button" onclick={() => updateStatus(appt.id, 'Cancelled')} class="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" title="Cancel"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
										{/if}
										{#if appt.status === 'Confirmed'}
											<button type="button" onclick={() => updateStatus(appt.id, 'Completed')} class="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20" title="Complete"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></button>
										{/if}
										<button type="button" onclick={() => openEditModal(appt)} class="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20" title="Edit Notes"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
										<button type="button" onclick={() => deleteAppt(appt.id)} class="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" title="Delete"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
		<Pagination currentPage={currentPage} totalPages={totalPages} onpagechange={(p) => currentPage = p} />
	{/if}
</div>

<Modal open={showEditModal} title="Edit Appointment Notes" onclose={() => showEditModal = false}>
	<div class="space-y-4">
		<div class="text-sm text-slate-500 dark:text-slate-400">
			<p><strong class="text-slate-900 dark:text-white">Patient:</strong> {editingAppt?.patientName}</p>
		</div>
		<textarea
			value={editNotes}
			oninput={(e) => editNotes = (e.target as HTMLTextAreaElement).value}
			class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300"
			rows={4}
			placeholder="Add notes about this appointment..."
		/>
		<div class="flex gap-3 pt-2">
			<Button variant="outline" fullWidth onclick={() => showEditModal = false}>Cancel</Button>
			<Button fullWidth onclick={saveNotes}>Save Notes</Button>
		</div>
	</div>
</Modal>
