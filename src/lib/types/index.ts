export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'NoShow';

export interface Appointment {
	id: number;
	referenceNumber: string | null;
	patientName: string;
	email: string;
	phone: string;
	service: string;
	dentist: string;
	appointmentDate: string;
	appointmentTime: string;
	status: AppointmentStatus;
	notes: string;
	createdAt: string;
}

export interface Dentist {
	name: string;
	specialty: string;
	experience: string;
	image: string;
	bio: string;
}

export interface Service {
	title: string;
	description: string;
	icon: string;
	duration: string;
	price: string;
}

export interface Testimonial {
	name: string;
	text: string;
	rating: number;
	date: string;
}

export interface TimeSlot {
	time: string;
	available: boolean;
}

export interface BookingFormData {
	patientName: string;
	email: string;
	phone: string;
	service: string;
	dentist: string;
	appointmentDate: string;
	appointmentTime: string;
}

export interface DashboardStats {
	totalAppointments: number;
	todayAppointments: number;
	upcomingAppointments: number;
	completedAppointments: number;
	cancelledAppointments: number;
	pendingAppointments: number;
}
