/* global Deno */
import { formattingJson, setColorAndExpensive } from './src/utils/helpers.ts';
import { getPriceUpdateTarget, getTomorrowDate } from './src/utils/price-dates.ts';

const filename = Deno.args[0] ?? 'electricity-price-api-tomorrow.json';
const json = JSON.parse(await Deno.readTextFile(filename));

const formattedData = formattingJson(json.PVPC);
const now = new Date();
const target = getPriceUpdateTarget(formattedData, now);

if (!target) {
	console.log(
		`Precios del ${getTomorrowDate(now)} aún no disponibles; recibidos: ${formattedData[0]?.day ?? 'sin datos'}. Se volverá a intentar.`
	);
	Deno.exit(0);
}

const sortedByPrice = formattedData.sort(({ price: a }, { price: b }) => a - b);

const sortedWithColorAndExpensive = setColorAndExpensive(sortedByPrice);

const sortedByHour = sortedWithColorAndExpensive.sort(({ hour: a }, { hour: b }) => a - b);

const suffix = target === 'tomorrow' ? '-tomorrow' : '';
await Deno.writeTextFile(
	`electricity-price-api${suffix}.json`,
	JSON.stringify(json, null, 2) + '\n'
);
await Deno.writeTextFile(
	`src/lib/data/cleaned-price${suffix}.json`,
	JSON.stringify(sortedByHour, null, 2) + '\n'
);
console.log(`Guardadas ${sortedByHour.length} horas del ${sortedByHour[0].day} (${target}).`);
