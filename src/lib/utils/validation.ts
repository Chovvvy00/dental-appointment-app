import { z } from 'zod';

export const bookingSchema = z.object({
	patientName: z.string().min(2, 'Name must be at least 2 characters').max(100),
	email: z.string().email('Please enter a valid email address'),
	phone: z.string().min(7, 'Please enter a valid phone number').regex(/^[\d\s\-\(\)\+]+$/, 'Invalid phone format'),
	service: z.string().min(1, 'Please select a service'),
	dentist: z.string().min(1, 'Please select a dentist'),
	appointmentDate: z.string().min(1, 'Please select a date'),
	appointmentTime: z.string().min(1, 'Please select a time'),
});

export type BookingSchema = typeof bookingSchema;
