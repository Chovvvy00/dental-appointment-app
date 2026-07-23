import { json } from '@sveltejs/kit';
import { getAppointmentById, updateAppointment, deleteAppointment, isSlotBooked } from '$lib/server/db';
import { N8N_WEBHOOK_URL } from '$env/static/private';

export async function GET({ params }) {
	try {
		const id = parseInt(params.id);
		const appointment = await getAppointmentById(id);
		if (!appointment) {
			return json({ error: 'Appointment not found' }, { status: 404 });
		}
		return json(appointment);
	} catch (e) {
		console.error('Error fetching appointment:', e);
		return json({ error: 'Failed to fetch appointment' }, { status: 500 });
	}
}

export async function PATCH({ params, request }) {
	try {
		const id = parseInt(params.id);
		const body = await request.json();

		const appointment = await getAppointmentById(id);
		if (!appointment) {
			return json({ error: 'Appointment not found' }, { status: 404 });
		}

		if (body.status === 'Confirmed') {
			const slotTaken = await isSlotBooked(appointment.appointmentDate, appointment.appointmentTime);
			if (slotTaken) {
				await updateAppointment(id, { status: 'Cancelled', notes: 'Slot already taken by another confirmed appointment.' });

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
							reason: 'slot_unavailable',
						}),
					}).catch(e => console.error('Webhook error:', e));
				}

				return json({
					error: 'Slot already booked',
					message: 'This time slot was already confirmed for another patient. The appointment has been cancelled.',
					autoCancelled: true,
				}, { status: 409 });
			}
		}

		const updated = await updateAppointment(id, body);
		return json(updated);
	} catch (e) {
		console.error('Error updating appointment:', e);
		return json({ error: 'Failed to update appointment' }, { status: 500 });
	}
}

export async function DELETE({ params }) {
	try {
		const id = parseInt(params.id);
		await deleteAppointment(id);
		return json({ success: true });
	} catch (e) {
		console.error('Error deleting appointment:', e);
		return json({ error: 'Failed to delete appointment' }, { status: 500 });
	}
}
