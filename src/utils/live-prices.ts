import { cleanPrices, type formattedData } from './helpers.ts';
import { getMadridHour, getTodayDate, getTomorrowDate, hasPricesFor } from './price-dates.ts';

const ESIOS_URL = 'https://api.esios.ree.es/archives/70/download_json';

// ESIOS publishes the next day's PVPC around 20:15 Madrid time; asking earlier is wasted.
export const TOMORROW_PUBLICATION_HOUR = 20;

type Options = {
	/** Prices bundled at build time; used whenever they already cover the requested day. */
	today: formattedData[];
	tomorrow: formattedData[];
	fetch?: typeof fetch;
	now?: () => Date;
	/** How long to wait before asking ESIOS again after a miss or a failure. */
	retryAfterMs?: number;
	timeoutMs?: number;
};

type CacheEntry = {
	prices?: formattedData[];
	pending?: Promise<formattedData[] | undefined>;
	retryAt: number;
};

// dd/mm/yyyy -> yyyy-mm-dd, the format ESIOS expects.
const toIsoDate = (date: string) => date.split('/').reverse().join('-');

/**
 * Serves today's and tomorrow's prices without waiting for the scheduled workflows to
 * commit and redeploy: when the bundled data does not cover a day, it asks ESIOS directly.
 * Published prices never change, so hits are kept until the day rolls over; misses are
 * retried after `retryAfterMs`. Any failure falls back to the bundled data.
 */
export const createPriceSource = ({
	today: bundledToday,
	tomorrow: bundledTomorrow,
	fetch: fetchPrices = fetch,
	now = () => new Date(),
	retryAfterMs = 5 * 60_000,
	timeoutMs = 5_000
}: Options) => {
	const cache = new Map<string, CacheEntry>();

	const download = async (date: string): Promise<formattedData[] | undefined> => {
		try {
			const response = await fetchPrices(`${ESIOS_URL}?date=${toIsoDate(date)}`, {
				signal: AbortSignal.timeout(timeoutMs)
			});
			if (!response.ok) return undefined;
			const json = await response.json();
			// Before publication ESIOS answers 200 with { message: 'No values for specified archive' }.
			if (!Array.isArray(json?.PVPC)) return undefined;
			const prices = cleanPrices(json.PVPC);
			return hasPricesFor(prices, date) ? prices : undefined;
		} catch {
			return undefined;
		}
	};

	const getLivePrices = (date: string): Promise<formattedData[] | undefined> => {
		const entry = cache.get(date);
		if (entry?.prices) return Promise.resolve(entry.prices);
		if (entry?.pending) return entry.pending;
		if (entry && now().getTime() < entry.retryAt) return Promise.resolve(undefined);

		const pending = download(date).then((prices) => {
			cache.set(date, { prices, retryAt: prices ? 0 : now().getTime() + retryAfterMs });
			return prices;
		});
		cache.set(date, { pending, retryAt: 0 });
		return pending;
	};

	return async (): Promise<{ todayData: formattedData[]; tomorrowData: formattedData[] }> => {
		const at = now();
		const today = getTodayDate(at);
		const tomorrow = getTomorrowDate(at);
		for (const date of cache.keys()) {
			if (date !== today && date !== tomorrow) cache.delete(date);
		}

		// After midnight, last evening's "tomorrow" file already holds today's prices.
		const bundledForToday = [bundledToday, bundledTomorrow].find((data) =>
			hasPricesFor(data, today)
		);
		const bundledForTomorrow = hasPricesFor(bundledTomorrow, tomorrow)
			? bundledTomorrow
			: undefined;

		const [todayData, tomorrowData] = await Promise.all([
			bundledForToday ?? getLivePrices(today).then((prices) => prices ?? bundledToday),
			bundledForTomorrow ??
				(getMadridHour(at) >= TOMORROW_PUBLICATION_HOUR
					? getLivePrices(tomorrow).then((prices) => prices ?? [])
					: [])
		]);
		return { todayData, tomorrowData };
	};
};
