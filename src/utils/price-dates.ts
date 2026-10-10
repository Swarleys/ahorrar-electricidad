export const getTodayDate = (now = new Date()): string =>
	new Intl.DateTimeFormat('en-GB', {
		timeZone: 'Europe/Madrid'
	}).format(now);

export const getTomorrowDate = (now = new Date()): string => {
	const [day, month, year] = getTodayDate(now).split('/').map(Number);

	// Advance the calendar date, rather than adding 24 hours across a DST change.
	return new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC' }).format(
		new Date(Date.UTC(year, month - 1, day + 1))
	);
};

export const hasTomorrowPrices = (data: { day: string }[], now = new Date()): boolean => {
	const tomorrow = getTomorrowDate(now);
	return data.length > 0 && data.every(({ day }) => day === tomorrow);
};

export const getPriceUpdateTarget = (
	data: { day: string }[],
	now = new Date()
): 'today' | 'tomorrow' | undefined => {
	if (hasTomorrowPrices(data, now)) return 'tomorrow';

	const hour = Number(
		new Intl.DateTimeFormat('en-GB', {
			timeZone: 'Europe/Madrid',
			hour: '2-digit',
			hourCycle: 'h23'
		}).format(now)
	);
	// An evening run may reach the runner after midnight. Recover its prices as today.
	const today = getTodayDate(now);
	if (hour < 6 && data.length > 0 && data.every(({ day }) => day === today)) return 'today';

	return undefined;
};
