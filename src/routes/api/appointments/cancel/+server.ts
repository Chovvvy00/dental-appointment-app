import { json } from '@sveltejs/kit';
import { cancelAppointment } from '$lib/server/db';
import { N8N_WEBHOOK_URL } from '$env/static/private';

export async function POST({ request }) {
	try {
		const { id } = await request.json();
		if (!id || isNaN(Number(id))) {
			return json({ error: 'Valid appointment ID is required' }, { status: 400 });
		}

		const appointment = await cancelAppointment(Number(id));
		if (!appointment) {
			return json({ error: 'Appointment not found' }, { status: 404 });
		}

		if (N8N_WEBHOOK_URL) {
			fetch(N8N_WEBHOOK_URL, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					id: appointment.id,
					patientName: appointment.patientName,
					email: appointment.email,
					service: appointment.service,
					dentist: appointment.dentist,
					date: appointment.appointmentDate,
					time: appointment.appointmentTime,
					status: 'Cancelled',
					referenceNumber: appointment.referenceNumber,
					reason: 'patient_cancelled',
				}),
			}).catch(e => console.error('Cancel webhook error:', e));
		}

		return json(appointment);
	} catch (e: any) {
		const message = e.message || 'Failed to cancel appointment';
		const status = message.includes('6 hours') ? 400 : 500;
		return json({ error: message }, { status });
	}
}
