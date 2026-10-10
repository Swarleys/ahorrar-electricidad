import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, copyFileSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';

const publish = (instant: string, days: string[]) => {
	const directory = mkdtempSync(join(tmpdir(), 'electricity-publishing-'));
	try {
		mkdirSync(join(directory, 'src/utils'), { recursive: true });
		mkdirSync(join(directory, 'src/lib/data'), { recursive: true });
		for (const file of [
			'cleaning-electricity-price-tomorrow.js',
			'src/utils/helpers.ts',
			'src/utils/price-dates.ts'
		]) {
			copyFileSync(file, join(directory, file));
		}
		const original = [{ day: '05/10/2026' }];
		writeFileSync(
			join(directory, 'src/lib/data/cleaned-price-tomorrow.json'),
			JSON.stringify(original)
		);
		writeFileSync(join(directory, 'src/lib/data/cleaned-price.json'), JSON.stringify(original));
		for (const file of ['electricity-price-api.json', 'electricity-price-api-tomorrow.json']) {
			writeFileSync(join(directory, file), JSON.stringify({ PVPC: [{ Dia: '05/10/2026' }] }));
		}
		const raw = {
			PVPC: days.flatMap((Dia) =>
				Array.from({ length: 24 }, (_, hour) => ({
					Dia,
					Hora: `${String(hour).padStart(2, '0')}-${String(hour + 1).padStart(2, '0')}`,
					PCB: '180,42'
				}))
			)
		};
		writeFileSync(join(directory, 'download.json'), JSON.stringify(raw));
		writeFileSync(
			join(directory, 'run.js'),
			`const OriginalDate = Date;
globalThis.Date = class extends OriginalDate {
  constructor(...args) { super(...(args.length ? args : [${JSON.stringify(instant)}])); }
  static now() { return new OriginalDate(${JSON.stringify(instant)}).getTime(); }
};
await import('./cleaning-electricity-price-tomorrow.js');`
		);
		const result = spawnSync(
			'deno',
			['run', '--no-lock', '--allow-read', '--allow-write', 'run.js', 'download.json'],
			{ cwd: directory, encoding: 'utf8', timeout: 30000 }
		);
		assert.equal(result.status, 0, result.stderr || result.error?.message);
		return {
			today: JSON.parse(readFileSync(join(directory, 'src/lib/data/cleaned-price.json'), 'utf8')),
			tomorrow: JSON.parse(
				readFileSync(join(directory, 'src/lib/data/cleaned-price-tomorrow.json'), 'utf8')
			),
			todayRaw: JSON.parse(readFileSync(join(directory, 'electricity-price-api.json'), 'utf8')),
			tomorrowRaw: JSON.parse(
				readFileSync(join(directory, 'electricity-price-api-tomorrow.json'), 'utf8')
			)
		};
	} finally {
		rmSync(directory, { recursive: true, force: true });
	}
};

test('recovers prices as today when a scheduled publication crosses Madrid midnight', () => {
	const result = publish('2026-10-09T22:45:58Z', ['10/10/2026']);
	assert.equal(result.today.length, 24);
	assert.ok(result.today.every(({ day }: { day: string }) => day === '10/10/2026'));
	assert.equal(result.todayRaw.PVPC[0].Dia, '10/10/2026');
	assert.deepEqual(result.tomorrow, [{ day: '05/10/2026' }]);
	assert.equal(result.tomorrowRaw.PVPC[0].Dia, '05/10/2026');
});

test('publishes tomorrow normally before midnight', () => {
	const result = publish('2026-10-09T20:25:00Z', ['10/10/2026']);
	assert.equal(result.tomorrow.length, 24);
	assert.ok(result.tomorrow.every(({ day }: { day: string }) => day === '10/10/2026'));
	assert.deepEqual(result.today, [{ day: '05/10/2026' }]);
	assert.equal(result.todayRaw.PVPC[0].Dia, '05/10/2026');
	assert.equal(result.tomorrowRaw.PVPC[0].Dia, '10/10/2026');
});

test('waits without changing prices when ESIOS has not published tomorrow yet', () => {
	const result = publish('2026-10-09T17:17:00Z', ['09/10/2026']);
	assert.deepEqual(result.today, [{ day: '05/10/2026' }]);
	assert.deepEqual(result.tomorrow, [{ day: '05/10/2026' }]);
	assert.equal(result.todayRaw.PVPC[0].Dia, '05/10/2026');
	assert.equal(result.tomorrowRaw.PVPC[0].Dia, '05/10/2026');
});

test('does not publish stale, empty or mixed dates', () => {
	for (const days of [['08/10/2026'], [], ['09/10/2026', '10/10/2026']]) {
		const result = publish('2026-10-09T20:25:00Z', days);
		assert.deepEqual(result.today, [{ day: '05/10/2026' }]);
		assert.deepEqual(result.tomorrow, [{ day: '05/10/2026' }]);
		assert.equal(result.todayRaw.PVPC[0].Dia, '05/10/2026');
		assert.equal(result.tomorrowRaw.PVPC[0].Dia, '05/10/2026');
	}
});

test('recovery uses Madrid time in winter and stops at 06:00', () => {
	const recovery = publish('2026-12-31T23:45:00Z', ['01/01/2027']);
	assert.equal(recovery.today[0].day, '01/01/2027');
	const daytime = publish('2027-01-01T05:00:00Z', ['01/01/2027']);
	assert.deepEqual(daytime.today, [{ day: '05/10/2026' }]);
	assert.deepEqual(daytime.tomorrow, [{ day: '05/10/2026' }]);
});
