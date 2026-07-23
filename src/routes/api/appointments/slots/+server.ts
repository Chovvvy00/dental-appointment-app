import { json } from '@sveltejs/kit';
import { getBookedSlots } from '$lib/server/db';

export async function GET({ url }) {
	const date = url.searchParams.get('date');
	if (!date) {
		return json({ slots: [] });
	}

	try {
		const slots = await getBookedSlots(date);
		return json({ slots });
	} catch (e) {
		console.error('Error fetching slots:', e);
		return json({ slots: [] });
	}
}
