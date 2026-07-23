import { pgTable, serial, text, timestamp, date, time, varchar } from 'drizzle-orm/pg-core';

export const appointments = pgTable('appointments', {
	id: serial('id').primaryKey(),
	referenceNumber: varchar('reference_number', { length: 50 }),
	patientName: varchar('patient_name', { length: 255 }).notNull(),
	email: varchar('email', { length: 255 }).notNull(),
	phone: varchar('phone', { length: 50 }).notNull(),
	service: varchar('service', { length: 100 }).notNull(),
	dentist: varchar('dentist', { length: 100 }).notNull(),
	appointmentDate: date('appointment_date').notNull(),
	appointmentTime: time('appointment_time').notNull(),
	status: varchar('status', { length: 20 }).notNull().default('Pending'),
	notes: text('notes').default(''),
	createdAt: timestamp('created_at').notNull().defaultNow(),
});
