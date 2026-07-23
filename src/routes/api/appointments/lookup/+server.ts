import { json } from '@sveltejs/kit';
import { getAppointmentById, getAppointmentByReferenceNumber, updateAppointment } from '$lib/server/db';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export async function GET({ url }) {
	const ref = url.searchParams.get('id');
	if (!ref || ref.trim().length < 2) {
		return json({ error: 'A valid reference number or appointment ID is required' }, { status: 400 });
	}

	try {
		const trimmed = ref.trim();
		let appointment;

		if (!isNaN(Number(trimmed))) {
			appointment = await getAppointmentById(Number(trimmed));
		} else {
			appointment = await getAppointmentByReferenceNumber(trimmed);
		}

		if (!appointment) {
			return json({ error: 'Appointment not found' }, { status: 404 });
		}

		if (appointment.status === 'Confirmed') {
			const appointmentDateTime = dayjs(`${appointment.appointmentDate} ${appointment.appointmentTime}`, 'YYYY-MM-DD HH:mm');
			if (appointmentDateTime.isBefore(dayjs())) {
				await updateAppointment(appointment.id, { status: 'NoShow', notes: 'Patient did not show up' });
				appointment.status = 'NoShow';
				appointment.notes = 'Patient did not show up';
			}
		}

		return json(appointment);
	} catch (e) {
		console.error('Error looking up appointment:', e);
		return json({ error: 'Failed to look up appointment' }, { status: 500 });
	}
}
