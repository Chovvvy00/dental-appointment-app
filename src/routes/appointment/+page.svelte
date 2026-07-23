<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import Calendar from '$lib/components/ui/Calendar.svelte';
	import TimeSlotPicker from '$lib/components/ui/TimeSlotPicker.svelte';
	import DentistCard from '$lib/components/ui/DentistCard.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
	import { SERVICES, DENTISTS, TIME_SLOTS, CLINIC_HOLIDAYS } from '$lib/utils/constants';
	import { toastMessage } from '$lib/stores/appointment';
	import dayjs from 'dayjs';

	let step = $state(1);
	let loading = $state(false);
	let submitting = $state(false);
	let showConfirm = $state(false);

	let formData = $state({
		patientName: '',
		email: '',
		phone: '',
		service: '',
		dentist: '',
		appointmentDate: '',
		appointmentTime: '',
	});

	let errors = $state<Record<string, string>>({});
	let bookedSlots = $state<string[]>([]);
	let bookedDates = $state<string[]>([]);

	let serviceOptions = $derived(SERVICES.map(s => ({ value: s.title, label: s.title })));
	let selectedService = $derived(SERVICES.find(s => s.title === formData.service));

	async function validateStep(stepNum: number): Promise<boolean> {
		const newErrors: Record<string, string> = {};
		if (stepNum === 1) {
			if (!formData.patientName || formData.patientName.length < 2) newErrors.patientName = 'Name is required (min 2 characters)';
			if (!formData.email || !formData.email.includes('@')) newErrors.email = 'Valid email is required';
			if (!formData.phone || formData.phone.length < 7) newErrors.phone = 'Valid phone number is required';
		} else if (stepNum === 2) {
			if (!formData.service) newErrors.service = 'Please select a service';
		} else if (stepNum === 3) {
			if (!formData.dentist) newErrors.dentist = 'Please select a dentist';
		} else if (stepNum === 4) {
			if (!formData.appointmentDate) newErrors.appointmentDate = 'Please select a date';
		} else if (stepNum === 5) {
			if (!formData.appointmentTime) newErrors.appointmentTime = 'Please select a time';
		}
		errors = newErrors;
		return Object.keys(newErrors).length === 0;
	}

	async function nextStep() {
		if (await validateStep(step)) {
			if (step < 5) step++;
		}
	}

	function prevStep() {
		if (step > 1) step--;
	}

	async function handleDateSelect(date: string) {
		formData.appointmentDate = date;
		formData.appointmentTime = '';
		errors.appointmentDate = '';
		loading = true;

		try {
			const res = await fetch(`/api/appointments/slots?date=${date}`);
			if (res.ok) {
				const data = await res.json();
				bookedSlots = data.slots || [];
			}
		} catch {
			bookedSlots = [];
		} finally {
			loading = false;
		}
	}

	async function handleSubmit() {
		submitting = true;
		try {
			const res = await fetch('/api/appointments', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData),
			});

			if (!res.ok) {
				const err = await res.json();
				throw new Error(err.message || 'Failed to create appointment');
			}

			showConfirm = false;
			toastMessage.set({ type: 'success', message: 'Appointment booked successfully! Check your email for confirmation.' });

			// Reset form
			formData = { patientName: '', email: '', phone: '', service: '', dentist: '', appointmentDate: '', appointmentTime: '' };
			step = 1;
			bookedSlots = [];
		} catch (e: any) {
			toastMessage.set({ type: 'error', message: e.message || 'Something went wrong. Please try again.' });
		} finally {
			submitting = false;
		}
	}

	async function confirmBooking() {
		if (await validateStep(5) && await validateStep(4) && await validateStep(3) && await validateStep(2) && await validateStep(1)) {
			showConfirm = true;
		}
	}

	const summary = $derived({
		name: formData.patientName,
		service: formData.service,
		dentist: formData.dentist,
		date: formData.appointmentDate ? dayjs(formData.appointmentDate).format('MMMM D, YYYY') : '',
		time: formData.appointmentTime,
	});
</script>

<div class="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-16">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-8 lg:mb-12">
			<h1 class="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3">Book an Appointment</h1>
			<p class="text-slate-500 dark:text-slate-400">Complete the steps below to schedule your visit</p>
		</div>

		<div class="mb-8 lg:mb-10">
			<div class="flex items-center justify-between max-w-2xl mx-auto">
				{#each ['Info', 'Service', 'Dentist', 'Date', 'Time'] as label, i}
					<div class="flex flex-col items-center">
						<div class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold {step > i ? 'bg-blue-600 text-white' : step === i + 1 ? 'bg-blue-600 text-white ring-4 ring-blue-200 dark:ring-blue-800' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'} transition-all">
							{step > i ? '✓' : i + 1}
						</div>
						<span class="text-xs mt-1.5 text-slate-500 dark:text-slate-400 hidden sm:block">{label}</span>
					</div>
					{#if i < 4}
						<div class="flex-1 h-0.5 mx-2 rounded {step > i + 1 ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'} transition-colors" />
					{/if}
				{/each}
			</div>
		</div>

		<div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 lg:p-8 shadow-sm">
			{#if step === 1}
				<div class="space-y-6">
					<h2 class="text-xl font-semibold text-slate-900 dark:text-white">Patient Information</h2>
					<div class="grid sm:grid-cols-2 gap-5">
						<Input label="Full Name" name="patientName" value={formData.patientName} placeholder="John Doe" required error={errors.patientName} oninput={(e) => { formData.patientName = (e.target as HTMLInputElement).value; errors.patientName = ''; }} />
						<Input label="Email" name="email" type="email" value={formData.email} placeholder="john@example.com" required error={errors.email} oninput={(e) => { formData.email = (e.target as HTMLInputElement).value; errors.email = ''; }} />
					</div>
					<Input label="Phone Number" name="phone" type="tel" value={formData.phone} placeholder="(555) 123-4567" required error={errors.phone} oninput={(e) => { formData.phone = (e.target as HTMLInputElement).value; errors.phone = ''; }} />
				</div>
			{:else if step === 2}
				<div>
					<h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-6">Select Service</h2>
					<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{#each SERVICES as service}
							<button
								type="button"
								onclick={() => { formData.service = service.title; errors.service = ''; }}
								class="p-4 rounded-xl border-2 text-left transition-all duration-200 {formData.service === service.title ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 shadow-sm' : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'}"
							>
								<div class="text-2xl mb-2">{service.icon}</div>
								<h3 class="font-semibold text-slate-900 dark:text-white text-sm">{service.title}</h3>
								<p class="text-xs text-slate-500 dark:text-slate-400 mt-1">{service.duration}</p>
								<p class="text-sm font-bold text-blue-600 mt-2">{service.price}</p>
							</button>
						{/each}
					</div>
					{#if errors.service}
						<p class="text-sm text-red-500 mt-2">{errors.service}</p>
					{/if}
				</div>
			{:else if step === 3}
				<div>
					<h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-6">Choose Your Dentist</h2>
					<div class="grid sm:grid-cols-2 gap-4">
						{#each DENTISTS as dentist}
							<DentistCard {dentist} selected={formData.dentist === dentist.name} onselect={() => { formData.dentist = dentist.name; errors.dentist = ''; }} />
						{/each}
					</div>
					{#if errors.dentist}
						<p class="text-sm text-red-500 mt-2">{errors.dentist}</p>
					{/if}
				</div>
			{:else if step === 4}
				<div>
					<h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-2">Choose Date</h2>
					<p class="text-sm text-slate-500 dark:text-slate-400 mb-6">Select an available date for your appointment</p>
					<div class="max-w-md mx-auto">
						<Calendar
							selectedDate={formData.appointmentDate}
							bookedDates={bookedDates}
							onselect={handleDateSelect}
						/>
					</div>
					{#if errors.appointmentDate}
						<p class="text-sm text-red-500 mt-2 text-center">{errors.appointmentDate}</p>
					{/if}
				</div>
			{:else if step === 5}
				<div>
					<h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-2">Choose Time</h2>
					<p class="text-sm text-slate-500 dark:text-slate-400 mb-6">
						{formData.appointmentDate ? dayjs(formData.appointmentDate).format('MMMM D, YYYY') : ''}
					</p>
					{#if loading}
						<LoadingSpinner text="Loading available slots..." />
					{:else}
						<TimeSlotPicker
							selectedTime={formData.appointmentTime}
							bookedSlots={bookedSlots}
							onselect={(time) => { formData.appointmentTime = time; errors.appointmentTime = ''; }}
						/>
					{/if}
					{#if errors.appointmentTime}
						<p class="text-sm text-red-500 mt-2">{errors.appointmentTime}</p>
					{/if}
				</div>
			{/if}

			<div class="flex items-center justify-between mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
				<Button variant="ghost" onclick={prevStep} disabled={step === 1}>
					<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
					Back
				</Button>

				{#if step < 5}
					<Button onclick={nextStep}>
						Next
						<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
					</Button>
				{:else}
					<Button onclick={confirmBooking} loading={submitting}>
						Review Booking
					</Button>
				{/if}
			</div>
		</div>
	</div>
</div>

<Modal open={showConfirm} title="Confirm Appointment" onclose={() => showConfirm = false}>
	<div class="space-y-4">
		<div class="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 space-y-3">
			<div class="flex justify-between text-sm">
				<span class="text-slate-500 dark:text-slate-400">Patient</span>
				<span class="font-medium text-slate-900 dark:text-white">{summary.name}</span>
			</div>
			<div class="flex justify-between text-sm">
				<span class="text-slate-500 dark:text-slate-400">Service</span>
				<span class="font-medium text-slate-900 dark:text-white">{summary.service}</span>
			</div>
			<div class="flex justify-between text-sm">
				<span class="text-slate-500 dark:text-slate-400">Dentist</span>
				<span class="font-medium text-slate-900 dark:text-white">{summary.dentist}</span>
			</div>
			<div class="flex justify-between text-sm">
				<span class="text-slate-500 dark:text-slate-400">Date</span>
				<span class="font-medium text-slate-900 dark:text-white">{summary.date}</span>
			</div>
			<div class="flex justify-between text-sm">
				<span class="text-slate-500 dark:text-slate-400">Time</span>
				<span class="font-medium text-slate-900 dark:text-white">{summary.time}</span>
			</div>
		</div>
		<p class="text-xs text-slate-500 dark:text-slate-400">
			By confirming, you agree to our appointment policy. Cancellations must be made at least 24 hours in advance.
		</p>
		<div class="flex gap-3 pt-2">
			<Button variant="outline" fullWidth onclick={() => showConfirm = false}>Cancel</Button>
			<Button fullWidth onclick={handleSubmit} loading={submitting}>Confirm Appointment</Button>
		</div>
	</div>
</Modal>
