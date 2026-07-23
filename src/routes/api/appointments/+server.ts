import { json } from '@sveltejs/kit';
import { createAppointment, getAppointments, getActiveAppointmentByEmail, isSlotBooked } from '$lib/server/db';
import { N8N_WEBHOOK_URL } from '$env/static/private';

export async function GET() {
	try {
		const appointments = await getAppointments();
		return json(appointments);
	} catch (e) {
		console.error('Error fetching appointments:', e);
		return json({ error: 'Failed to fetch appointments' }, { status: 500 });
	}
}

export async function POST({ request }) {
	try {
		const body = await request.json();
		const { patientName, email, phone, service, dentist, appointmentDate, appointmentTime, notes } = body;

		if (!patientName || !email || !phone || !service || !dentist || !appointmentDate || !appointmentTime) {
			return json({ message: 'All required fields must be provided' }, { status: 400 });
		}

		const existing = await getActiveAppointmentByEmail(email);
		if (existing) {
			return json({
				message: 'An active appointment already exists for this email. Please complete or cancel your existing appointment before booking a new one.',
			}, { status: 409 });
		}

		const slotTaken = await isSlotBooked(appointmentDate, appointmentTime);
		if (slotTaken) {
			return json({
				message: 'This time slot has already been booked. Please select a different time.',
			}, { status: 409 });
		}

		const appointment = await createAppointment({
			patientName,
			email,
			phone,
			service,
			dentist,
			appointmentDate,
			appointmentTime,
			notes,
		});

		// Fire webhook synchronously so n8n gets the id before the response
		if (N8N_WEBHOOK_URL) {
			try {
				await fetch(N8N_WEBHOOK_URL, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						id: appointment.id,
						patientName,
						email,
						phone,
						service,
						dentist,
						date: appointmentDate,
						time: appointmentTime,
						status: 'Pending',
					}),
				});
			} catch (e) {
				console.error('Webhook error:', e);
			}
		}

		return json(appointment, { status: 201 });
	} catch (e: any) {
		console.error('Error creating appointment:', e);
		return json({ message: e.message || 'Failed to create appointment' }, { status: 500 });
	}
}
