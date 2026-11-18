import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createPriceSource } from '../src/utils/live-prices.ts';

const rows = (day: string) =>
	Array.from({ length: 24 }, (_, hour) => ({
		day,
		hour,
		formattedHour: `${hour}:00`,
		price: 0.1,
		zone: 'Valle' as const,
		expensive: '€' as const,
		color: 'green' as const
	}));

const esios = (day: string) => ({
	PVPC: Array.from({ length: 24 }, (_, hour) => ({
		Dia: day,
		Hora: `${String(hour).padStart(2, '0')}-${String(hour + 1).padStart(2, '0')}`,
		PCB: `${100 + hour},00`
	}))
});

/** A fake ESIOS keyed by yyyy-mm-dd; records every requested date. */
const fakeFetch = (responses: Record<string, unknown>) => {
	const requested: string[] = [];
	const fetch = (async (url: string) => {
		const date = new URL(url).searchParams.get('date')!;
		requested.push(date);
		const body = responses[date];
		if (body instanceof Error) throw body;
		if (body === undefined) {
			return Response.json({ message: 'No values for specified archive' });
		}
		return Response.json(body);
	}) as typeof globalThis.fetch;
	return { fetch, requested };
};

const clock = (instant: string) => {
	let current = new Date(instant).getTime();
	return {
		now: () => new Date(current),
		advance: (minutes: number) => (current += minutes * 60_000)
	};
};

test('fetches tomorrow from ESIOS once published, then serves it from cache', async () => {
	const esiosApi = fakeFetch({ '2026-11-19': esios('19/11/2026') });
	const time = clock('2026-11-18T19:20:00Z'); // 20:20 Madrid
	const getPrices = createPriceSource({
		today: rows('18/11/2026'),
		tomorrow: rows('17/11/2026'),
		fetch: esiosApi.fetch,
		now: time.now
	});

	const first = await getPrices();
	assert.equal(first.tomorrowData.length, 24);
	assert.ok(first.tomorrowData.every(({ day }) => day === '19/11/2026'));
	assert.deepEqual(
		first.tomorrowData.map(({ color }) => color).slice(0, 9),
		[...Array(8).fill('green'), 'yellow'],
		'ranks hours like the publishing script'
	);
	assert.equal(first.todayData[0].day, '18/11/2026');

	time.advance(60);
	await getPrices();
	assert.deepEqual(esiosApi.requested, ['2026-11-19']);
});

test('does not ask ESIOS for tomorrow before the evening publication', async () => {
	const esiosApi = fakeFetch({ '2026-11-19': esios('19/11/2026') });
	const getPrices = createPriceSource({
		today: rows('18/11/2026'),
		tomorrow: rows('17/11/2026'),
		fetch: esiosApi.fetch,
		now: clock('2026-11-18T17:00:00Z').now // 18:00 Madrid
	});

	assert.deepEqual((await getPrices()).tomorrowData, []);
	assert.deepEqual(esiosApi.requested, []);
});

test('retries an unpublished day only after the retry interval', async () => {
	const esiosApi = fakeFetch({});
	const time = clock('2026-11-18T19:05:00Z');
	const getPrices = createPriceSource({
		today: rows('18/11/2026'),
		tomorrow: rows('17/11/2026'),
		fetch: esiosApi.fetch,
		now: time.now,
		retryAfterMs: 5 * 60_000
	});

	assert.deepEqual((await getPrices()).tomorrowData, []);
	time.advance(2);
	await getPrices();
	assert.equal(esiosApi.requested.length, 1);
	time.advance(4);
	await getPrices();
	assert.equal(esiosApi.requested.length, 2);
});

test('shares one in-flight request between concurrent visitors', async () => {
	const esiosApi = fakeFetch({ '2026-11-19': esios('19/11/2026') });
	const getPrices = createPriceSource({
		today: rows('18/11/2026'),
		tomorrow: rows('17/11/2026'),
		fetch: esiosApi.fetch,
		now: clock('2026-11-18T19:20:00Z').now
	});

	await Promise.all([getPrices(), getPrices(), getPrices()]);
	assert.deepEqual(esiosApi.requested, ['2026-11-19']);
});

test('uses bundled data without calling ESIOS when it already covers both days', async () => {
	const esiosApi = fakeFetch({});
	const getPrices = createPriceSource({
		today: rows('18/11/2026'),
		tomorrow: rows('19/11/2026'),
		fetch: esiosApi.fetch,
		now: clock('2026-11-18T19:20:00Z').now
	});

	const prices = await getPrices();
	assert.equal(prices.tomorrowData[0].day, '19/11/2026');
	assert.deepEqual(esiosApi.requested, []);
});

test('after midnight, serves last evening’s tomorrow file as today', async () => {
	const esiosApi = fakeFetch({});
	const getPrices = createPriceSource({
		today: rows('18/11/2026'),
		tomorrow: rows('19/11/2026'),
		fetch: esiosApi.fetch,
		now: clock('2026-11-18T23:30:00Z').now // 00:30 Madrid on the 19th
	});

	const prices = await getPrices();
	assert.equal(prices.todayData[0].day, '19/11/2026');
	assert.deepEqual(prices.tomorrowData, []);
	assert.deepEqual(esiosApi.requested, []);
});

test('fetches today live when the overnight commit has not landed', async () => {
	const esiosApi = fakeFetch({ '2026-11-19': esios('19/11/2026') });
	const getPrices = createPriceSource({
		today: rows('18/11/2026'),
		tomorrow: rows('18/11/2026'),
		fetch: esiosApi.fetch,
		now: clock('2026-11-19T07:00:00Z').now // 08:00 Madrid
	});

	const prices = await getPrices();
	assert.ok(prices.todayData.every(({ day }) => day === '19/11/2026'));
	assert.deepEqual(esiosApi.requested, ['2026-11-19']);
});

test('falls back to bundled data when ESIOS fails or answers for another day', async () => {
	for (const failure of [new Error('network down'), esios('18/11/2026'), { PVPC: [] }]) {
		const getPrices = createPriceSource({
			today: rows('18/11/2026'),
			tomorrow: rows('17/11/2026'),
			fetch: fakeFetch({ '2026-11-19': failure }).fetch,
			now: clock('2026-11-18T19:20:00Z').now
		});

		const prices = await getPrices();
		assert.deepEqual(prices.tomorrowData, []);
		assert.equal(prices.todayData[0].day, '18/11/2026');
	}
});

test('falls back to bundled data on HTTP errors', async () => {
	const getPrices = createPriceSource({
		today: rows('18/11/2026'),
		tomorrow: rows('17/11/2026'),
		fetch: (async () => new Response('busy', { status: 503 })) as typeof fetch,
		now: clock('2026-11-18T19:20:00Z').now
	});

	assert.deepEqual((await getPrices()).tomorrowData, []);
});
