/* global Deno */
import { cleanPrices } from './src/utils/helpers.ts';
import { getPriceUpdateTarget, getTomorrowDate } from './src/utils/price-dates.ts';

const filename = Deno.args[0] ?? 'electricity-price-api-tomorrow.json';
const json = JSON.parse(await Deno.readTextFile(filename));

const prices = cleanPrices(json.PVPC);
const now = new Date();
const target = getPriceUpdateTarget(prices, now);

if (!target) {
	console.log(
		`Precios del ${getTomorrowDate(now)} aún no disponibles; recibidos: ${prices[0]?.day ?? 'sin datos'}. Se volverá a intentar.`
	);
	Deno.exit(0);
}

const suffix = target === 'tomorrow' ? '-tomorrow' : '';
await Deno.writeTextFile(
	`electricity-price-api${suffix}.json`,
	JSON.stringify(json, null, 2) + '\n'
);
await Deno.writeTextFile(
	`src/lib/data/cleaned-price${suffix}.json`,
	JSON.stringify(prices, null, 2) + '\n'
);
console.log(`Guardadas ${prices.length} horas del ${prices[0].day} (${target}).`);
