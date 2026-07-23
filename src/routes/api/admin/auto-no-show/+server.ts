import { json } from '@sveltejs/kit';
import { markMissedAppointments } from '$lib/server/db';

export async function POST() {
	try {
		const marked = await markMissedAppointments();
		return json({ marked: marked.length });
	} catch (e) {
		console.error('Auto no-show error:', e);
		return json({ marked: 0 });
	}
}
