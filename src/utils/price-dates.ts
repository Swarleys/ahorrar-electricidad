export const getTomorrowDate = (now = new Date()): string => {
	const [day, month, year] = new Intl.DateTimeFormat('en-GB', {
		timeZone: 'Europe/Madrid'
	})
		.format(now)
		.split('/')
		.map(Number);

	// Advance the calendar date, rather than adding 24 hours across a DST change.
	return new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC' }).format(
		new Date(Date.UTC(year, month - 1, day + 1))
	);
};

export const hasTomorrowPrices = (data: { day: string }[], now = new Date()): boolean => {
	const tomorrow = getTomorrowDate(now);
	return data.length > 0 && data.every(({ day }) => day === tomorrow);
};
