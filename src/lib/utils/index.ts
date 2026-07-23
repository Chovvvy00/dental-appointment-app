import dayjs from 'dayjs';
import { TIME_SLOTS, CLINIC_HOLIDAYS } from './constants';

export function formatDate(date: string | Date, format = 'MMMM D, YYYY'): string {
	return dayjs(date).format(format);
}

export function formatTime(time: string): string {
	return time;
}

export function isDateDisabled(date: dayjs.Dayjs): boolean {
	const dateStr = date.format('YYYY-MM-DD');
	if (CLINIC_HOLIDAYS.includes(dateStr)) return true;
	if (date.isBefore(dayjs().startOf('day'))) return true;
	if (date.day() === 0) return true;
	return false;
}

export function getMonthDays(year: number, month: number): dayjs.Dayjs[] {
	const startOfMonth = dayjs(new Date(year, month, 1));
	const endOfMonth = startOfMonth.endOf('month');
	const startDay = startOfMonth.day();

	const days: dayjs.Dayjs[] = [];
	for (let i = 0; i < startDay; i++) {
		days.push(startOfMonth.subtract(startDay - i, 'day'));
	}
	for (let d = 1; d <= endOfMonth.date(); d++) {
		days.push(dayjs(new Date(year, month, d)));
	}
	const remaining = 42 - days.length;
	for (let i = 1; i <= remaining; i++) {
		days.push(endOfMonth.add(i, 'day'));
	}
	return days;
}

export function getWeekdayHeaders(): string[] {
	return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
}

export function generateTimeSlots(booked: string[] = []) {
	return TIME_SLOTS.map(time => ({
		time,
		available: !booked.includes(time),
	}));
}

export function cn(...classes: (string | undefined | null | false)[]): string {
	return classes.filter(Boolean).join(' ');
}
