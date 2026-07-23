import { json } from '@sveltejs/kit';
import { getDashboardStats } from '$lib/server/db';

export async function GET() {
	try {
		const stats = await getDashboardStats();
		return json(stats);
	} catch (e) {
		console.error('Error fetching stats:', e);
		return json({
			totalAppointments: 0,
			todayAppointments: 0,
			upcomingAppointments: 0,
			completedAppointments: 0,
			cancelledAppointments: 0,
			pendingAppointments: 0,
		});
	}
}
