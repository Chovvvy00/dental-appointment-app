<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
	import dayjs from 'dayjs';
	import type { Appointment } from '$lib/types';

	let referenceId = $state('');
	let appointment = $state<Appointment | null>(null);
	let loading = $state(false);
	let error = $state('');
	let searched = $state(false);

	let cancelling = $state(false);
	let cancelError = $state('');

	const statusBadge: Record<string, 'warning' | 'success' | 'info' | 'danger' | 'default'> = {
		Pending: 'warning',
		Confirmed: 'success',
		Completed: 'info',
		Cancelled: 'danger',
		NoShow: 'default',
	};

	async function lookupStatus() {
		const id = referenceId.trim();
		if (!id || id.length < 2) {
			error = 'Please enter a valid reference number';
			return;
		}

		loading = true;
		error = '';
		appointment = null;
		searched = false;

		try {
			const res = await fetch(`/api/appointments/lookup?id=${id}`);
			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || 'Appointment not found');
			}
			appointment = await res.json();
		} catch (e: any) {
			error = e.message || 'Failed to look up appointment. Please check your reference number.';
		} finally {
			loading = false;
			searched = true;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') lookupStatus();
	}
</script>

<div class="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-16">
	<div class="max-w-lg mx-auto px-4 sm:px-6">
		<div class="text-center mb-8">
			<h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-3">Check Appointment Status</h1>
			<p class="text-slate-500 dark:text-slate-400">Enter your appointment reference number to check the status</p>
		</div>

		<div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
			<div class="flex gap-3">
				<div class="flex-1">
					<Input
						name="reference"
						value={referenceId}
						placeholder="e.g. REF-072326-1404"
						oninput={(e) => { referenceId = (e.target as HTMLInputElement).value; error = ''; }}
					/>
				</div>
				<div class="pt-1.5">
					<Button onclick={lookupStatus} loading={loading}>
						Search
					</Button>
				</div>
			</div>
			{#if error}
				<p class="text-sm text-red-500 mt-3">{error}</p>
			{/if}
		</div>

		{#if loading}
			<div class="mt-8 py-12">
				<LoadingSpinner text="Looking up your appointment..." />
			</div>
		{/if}

		{#if appointment}
			<div class="mt-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-fade-in">
				<div class="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
					<h2 class="text-lg font-semibold text-slate-900 dark:text-white">Appointment Details</h2>
					<Badge text={appointment.status} variant={statusBadge[appointment.status] || 'default'} />
				</div>
				<div class="p-6 space-y-4">
					{#if appointment.referenceNumber}
						<div class="bg-blue-50 dark:bg-blue-950/30 rounded-xl px-4 py-3 flex items-center justify-between">
							<p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Reference No.</p>
							<p class="text-sm font-bold text-blue-700 dark:text-blue-400 font-mono">{appointment.referenceNumber}</p>
						</div>
					{/if}
					<div class="grid grid-cols-2 gap-4">
						<div>
							<p class="text-xs text-slate-400 uppercase tracking-wider">Patient</p>
							<p class="text-sm font-medium text-slate-900 dark:text-white mt-1">{appointment.patientName}</p>
						</div>
						<div>
							<p class="text-xs text-slate-400 uppercase tracking-wider">Email</p>
							<p class="text-sm font-medium text-slate-900 dark:text-white mt-1">{appointment.email}</p>
						</div>
						<div>
							<p class="text-xs text-slate-400 uppercase tracking-wider">Service</p>
							<p class="text-sm font-medium text-slate-900 dark:text-white mt-1">{appointment.service}</p>
						</div>
						<div>
							<p class="text-xs text-slate-400 uppercase tracking-wider">Dentist</p>
							<p class="text-sm font-medium text-slate-900 dark:text-white mt-1">{appointment.dentist}</p>
						</div>
						<div>
							<p class="text-xs text-slate-400 uppercase tracking-wider">Date</p>
							<p class="text-sm font-medium text-slate-900 dark:text-white mt-1">{dayjs(appointment.appointmentDate).format('MMMM D, YYYY')}</p>
						</div>
						<div>
							<p class="text-xs text-slate-400 uppercase tracking-wider">Time</p>
							<p class="text-sm font-medium text-slate-900 dark:text-white mt-1">{appointment.appointmentTime}</p>
						</div>
					</div>
					{#if appointment.notes}
						<div>
							<p class="text-xs text-slate-400 uppercase tracking-wider">Notes</p>
							<p class="text-sm text-slate-600 dark:text-slate-400 mt-1">{appointment.notes}</p>
						</div>
					{/if}
					<div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
						<p class="text-xs text-slate-400">
							Booked on {dayjs(appointment.createdAt).format('MMMM D, YYYY [at] h:mm A')}
						</p>
						{#if appointment.status === 'Pending' || appointment.status === 'Confirmed'}
							<Button
								variant="danger"
								size="sm"
								loading={cancelling}
								onclick={async () => {
									if (!confirm('Are you sure you want to cancel this appointment?')) return;
									cancelling = true;
									cancelError = '';
									try {
										const res = await fetch('/api/appointments/cancel', {
											method: 'POST',
											headers: { 'Content-Type': 'application/json' },
											body: JSON.stringify({ id: appointment.id }),
										});
										if (!res.ok) {
											const data = await res.json();
											throw new Error(data.error);
										}
										const updated = await res.json();
										appointment = updated;
									} catch (e: any) {
										cancelError = e.message;
									} finally {
										cancelling = false;
									}
								}}
							>
								Cancel Appointment
							</Button>
						{/if}
					</div>
					{#if cancelError}
						<div class="bg-red-50 dark:bg-red-900/20 rounded-xl px-4 py-3 mt-2">
							<p class="text-sm text-red-600 dark:text-red-400">{cancelError}</p>
						</div>
					{/if}
				</div>
			</div>
		{:else if searched && !loading}
			<div class="mt-8 text-center py-12 text-slate-400 dark:text-slate-500">
				<svg class="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				</svg>
				<p>Enter a reference number above to check your appointment status</p>
			</div>
		{/if}
	</div>
</div>

<style>
	@keyframes fade-in {
		from { opacity: 0; transform: translateY(10px); }
		to { opacity: 1; transform: translateY(0); }
	}
	.animate-fade-in { animation: fade-in 0.3s ease-out; }
</style>
