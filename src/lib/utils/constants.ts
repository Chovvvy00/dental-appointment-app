export const SERVICES = [
	{ title: 'Dental Cleaning', description: 'Professional cleaning to remove plaque and tartar buildup for healthier gums and brighter smile.', icon: '🦷', duration: '45 min', price: '$80' },
	{ title: 'Tooth Extraction', description: 'Gentle removal of damaged or problematic teeth with minimal discomfort.', icon: '🔧', duration: '60 min', price: '$150' },
	{ title: 'Root Canal', description: 'Save infected teeth with precise endodontic treatment for long-lasting relief.', icon: '⚕️', duration: '90 min', price: '$500' },
	{ title: 'Braces Consultation', description: 'Comprehensive orthodontic evaluation to create your perfect smile alignment plan.', icon: '🦷', duration: '30 min', price: '$50' },
	{ title: 'Teeth Whitening', description: 'Professional whitening treatment for a noticeably brighter, more confident smile.', icon: '✨', duration: '60 min', price: '$200' },
	{ title: 'Dental Filling', description: 'Tooth-colored composite fillings that restore function and natural appearance.', icon: '🛠️', duration: '30 min', price: '$120' },
	{ title: 'General Consultation', description: 'Comprehensive dental examination and personalized treatment recommendations.', icon: '📋', duration: '30 min', price: '$40' },
];

export const DENTISTS = [
	{
		name: 'Dr. John Santos',
		specialty: 'General Dentist',
		experience: '12 years',
		image: '/dentists/dr-santos.jpg',
		bio: 'Specializing in restorative dentistry and cosmetic procedures with advanced training in laser dentistry.',
	},
	{
		name: 'Dr. Maria Lopez',
		specialty: 'Orthodontist',
		experience: '15 years',
		image: '/dentists/dr-lopez.jpg',
		bio: 'Expert in braces, Invisalign, and complex orthodontic cases for children and adults.',
	},
	{
		name: 'Dr. James Chen',
		specialty: 'Oral Surgeon',
		experience: '10 years',
		image: '/dentists/dr-chen.jpg',
		bio: 'Skilled in complex extractions, dental implants, and corrective jaw surgeries.',
	},
	{
		name: 'Dr. Sarah Johnson',
		specialty: 'Periodontist',
		experience: '14 years',
		image: '/dentists/dr-johnson.jpg',
		bio: 'Specialist in gum disease treatment, dental implants, and periodontal plastic surgery.',
	},
];

export const TESTIMONIALS = [
	{ name: 'Emily R.', text: 'The team made my root canal completely painless. I was nervous but they were so professional and caring. Highly recommend!', rating: 5, date: '2024-12-15' },
	{ name: 'Michael T.', text: 'Best dental clinic in town. Dr. Santos is incredibly skilled and the staff is very welcoming. My whole family comes here.', rating: 5, date: '2024-11-28' },
	{ name: 'Jessica L.', text: 'My teeth whitening results are amazing! I got so many compliments. The consultation was thorough and the price was fair.', rating: 5, date: '2024-10-10' },
	{ name: 'David K.', text: 'I had a dental emergency and they fit me in same day. Quick, professional, and affordable. Thank you!', rating: 4, date: '2024-09-05' },
];

export const TIME_SLOTS = [
	'8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM',
	'10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
	'1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
	'3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
	'5:00 PM',
];

export const CLINIC_HOLIDAYS = [
	'2025-12-25', '2025-12-26', '2026-01-01',
	'2025-12-31',
];

export const STATUS_COLORS: Record<string, string> = {
	Pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
	Confirmed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
	Completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
	Cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
	NoShow: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
};
