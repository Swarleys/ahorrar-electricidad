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

export const getMadridHour = (now = new Date()): number =>
	Number(
		new Intl.DateTimeFormat('en-GB', {
			timeZone: 'Europe/Madrid',
			hour: '2-digit',
			hourCycle: 'h23'
		}).format(now)
	);

/** True when every row belongs to `date` (dd/mm/yyyy) and there is at least one. */
export const hasPricesFor = (data: { day: string }[], date: string): boolean =>
	data.length > 0 && data.every(({ day }) => day === date);

export const hasTomorrowPrices = (data: { day: string }[], now = new Date()): boolean =>
	hasPricesFor(data, getTomorrowDate(now));

export const getPriceUpdateTarget = (
	data: { day: string }[],
	now = new Date()
): 'today' | 'tomorrow' | undefined => {
	if (hasTomorrowPrices(data, now)) return 'tomorrow';

	// An evening run may reach the runner after midnight. Recover its prices as today.
	if (getMadridHour(now) < 6 && hasPricesFor(data, getTodayDate(now))) return 'today';

	return undefined;
};
