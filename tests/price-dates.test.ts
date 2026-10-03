import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getTomorrowDate, hasTomorrowPrices } from '../src/utils/price-dates.ts';

const now = new Date('2026-10-03T20:00:00Z');

test('rejects today’s prices in the tomorrow response', () => {
	assert.equal(hasTomorrowPrices([{ day: '03/10/2026' }], now), false);
});

test('accepts tomorrow’s prices and rejects missing or mixed dates', () => {
	assert.equal(hasTomorrowPrices([{ day: '04/10/2026' }], now), true);
	assert.equal(hasTomorrowPrices([], now), false);
	assert.equal(hasTomorrowPrices([{ day: '04/10/2026' }, { day: '03/10/2026' }], now), false);
});

test('uses Madrid’s date even when UTC is still on the previous day', () => {
	assert.equal(getTomorrowDate(new Date('2026-10-03T22:30:00Z')), '05/10/2026');
});

test('handles year boundaries and both daylight saving transitions', () => {
	assert.equal(getTomorrowDate(new Date('2026-12-31T21:00:00Z')), '01/01/2027');
	assert.equal(getTomorrowDate(new Date('2026-03-28T22:30:00Z')), '29/03/2026');
	assert.equal(getTomorrowDate(new Date('2026-10-24T21:30:00Z')), '25/10/2026');
});
