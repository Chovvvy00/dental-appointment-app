import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { appointments } from './schema';
import { eq, and, gte, lte, sql, inArray, or, lt } from 'drizzle-orm';
// import { DATABASE_URL } from '$env/static/private';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const connectionString = 'postgresql://postgres.pczatzjxiesriccwliwi:SomethingWentWrong000@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres';

const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema: { appointments } });

export async function getAppointments() {
	return await db.select().from(appointments).orderBy(appointments.appointmentDate);
}

export async function getAppointmentById(id: number) {
	const result = await db.select().from(appointments).where(eq(appointments.id, id));
	return result[0] || null;
}

export async function getAppointmentByReferenceNumber(ref: string) {
	const result = await db.select().from(appointments).where(eq(appointments.referenceNumber, ref));
	return result[0] || null;
}

export async function getActiveAppointmentByEmail(email: string) {
	const result = await db.select()
		.from(appointments)
		.where(and(
			eq(appointments.email, email),
			inArray(appointments.status, ['Pending', 'Confirmed'])
		))
		.orderBy(appointments.appointmentDate)
		.limit(1);
	return result[0] || null;
}

export async function createAppointment(data: {
	patientName: string;
	email: string;
	phone: string;
	service: string;
	dentist: string;
	appointmentDate: string;
	appointmentTime: string;
	notes?: string;
}) {
	const result = await db.insert(appointments).values({
		patientName: data.patientName,
		email: data.email,
		phone: data.phone,
		service: data.service,
		dentist: data.dentist,
		appointmentDate: data.appointmentDate,
		appointmentTime: data.appointmentTime,
		status: 'Pending',
		notes: data.notes || '',
	}).returning();
	return result[0];
}

export async function updateAppointmentStatus(id: number, status: string) {
	const result = await db.update(appointments)
		.set({ status })
		.where(eq(appointments.id, id))
		.returning();
	return result[0];
}

export async function updateAppointment(id: number, data: Partial<{
	patientName: string;
	email: string;
	phone: string;
	service: string;
	dentist: string;
	appointmentDate: string;
	appointmentTime: string;
	status: string;
	notes: string;
}>) {
	const result = await db.update(appointments)
		.set(data)
		.where(eq(appointments.id, id))
		.returning();
	return result[0];
}

export async function deleteAppointment(id: number) {
	await db.delete(appointments).where(eq(appointments.id, id));
}

export async function getAppointmentsByDate(date: string) {
	return await db.select()
		.from(appointments)
		.where(eq(appointments.appointmentDate, date));
}

export async function getBookedSlots(date: string) {
	const result = await db.select({ time: appointments.appointmentTime })
		.from(appointments)
		.where(and(
			eq(appointments.appointmentDate, date),
			eq(appointments.status, 'Confirmed')
		));
	return result.map(r => r.time);
}

export async function isSlotBooked(date: string, time: string) {
	const result = await db.select({ id: appointments.id })
		.from(appointments)
		.where(and(
			eq(appointments.appointmentDate, date),
			eq(appointments.appointmentTime, time),
			eq(appointments.status, 'Confirmed')
		))
		.limit(1);
	return result.length > 0;
}

export async function getAppointmentsByDateRange(startDate: string, endDate: string) {
	return await db.select()
		.from(appointments)
		.where(and(
			gte(appointments.appointmentDate, startDate),
			lte(appointments.appointmentDate, endDate)
		))
		.orderBy(appointments.appointmentDate);
}

export async function markMissedAppointments() {
	const today = new Date().toISOString().split('T')[0];
	const now = new Date();
	const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

	const result = await db.update(appointments)
		.set({ status: 'NoShow', notes: 'Auto-marked as no-show' })
		.where(and(
			eq(appointments.status, 'Confirmed'),
			or(
				lt(appointments.appointmentDate, today),
				and(eq(appointments.appointmentDate, today), lte(appointments.appointmentTime, currentTime))
			)
		))
		.returning();
	return result;
}

export async function cancelAppointment(id: number) {
	const appointment = await getAppointmentById(id);
	if (!appointment) return null;

	const now = dayjs();
	const appointmentDateTime = dayjs(`${appointment.appointmentDate} ${appointment.appointmentTime}`, 'YYYY-MM-DD HH:mm');
	const hoursUntilAppointment = appointmentDateTime.diff(now, 'hour');

	if (hoursUntilAppointment < 6) {
		throw new Error('Appointments can only be cancelled at least 6 hours before the scheduled time.');
	}

	const result = await db.update(appointments)
		.set({ status: 'Cancelled', notes: 'Cancelled by patient' })
		.where(eq(appointments.id, id))
		.returning();
	return result[0];
}

export async function getDashboardStats() {
	const today = new Date().toISOString().split('T')[0];
	const result = await db.select({
		total: sql<number>`count(*)`,
		today: sql<number>`sum(case when ${appointments.appointmentDate} = ${today} then 1 else 0 end)`,
		upcoming: sql<number>`sum(case when ${appointments.appointmentDate} >= ${today} and ${appointments.status} = 'Confirmed' then 1 else 0 end)`,
		completed: sql<number>`sum(case when ${appointments.status} = 'Completed' then 1 else 0 end)`,
		cancelled: sql<number>`sum(case when ${appointments.status} = 'Cancelled' then 1 else 0 end)`,
		pending: sql<number>`sum(case when ${appointments.status} = 'Pending' then 1 else 0 end)`,
	}).from(appointments);
	return result[0] || { total: 0, today: 0, upcoming: 0, completed: 0, cancelled: 0, pending: 0 };
}
