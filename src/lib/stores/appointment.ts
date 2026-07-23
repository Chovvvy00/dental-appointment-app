import { writable } from 'svelte/store';
import type { Appointment, DashboardStats } from '$lib/types';

export const appointments = writable<Appointment[]>([]);
export const selectedAppointment = writable<Appointment | null>(null);
export const dashboardStats = writable<DashboardStats | null>(null);
export const isLoading = writable(false);
export const error = writable<string | null>(null);
export const selectedDate = writable<string>('');
export const selectedTime = writable<string>('');
export const selectedService = writable<string>('');
export const selectedDentist = writable<string>('');
export const bookedSlots = writable<string[]>([]);
export const toastMessage = writable<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
export const isDarkMode = writable<boolean>(false);
