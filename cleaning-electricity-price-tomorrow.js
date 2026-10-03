import { readJSON, writeJSON } from 'https://deno.land/x/flat@0.0.10/src/json.ts';
import { formattingJson, setColorAndExpensive } from './src/utils/helpers.ts';
import { hasTomorrowPrices, getTomorrowDate } from './src/utils/price-dates.ts';

const filename = 'electricity-price-api-tomorrow.json';
const json = await readJSON(filename);

const formattedData = formattingJson(json.PVPC);

if (!hasTomorrowPrices(formattedData)) {
	throw new Error(
		`Se esperaban precios del ${getTomorrowDate()}, recibidos: ${formattedData[0]?.day ?? 'sin datos'}`
	);
}

const sortedByPrice = formattedData.sort(({ price: a }, { price: b }) => a - b);

const sortedWithColorAndExpensive = setColorAndExpensive(sortedByPrice);

const sortedByHour = sortedWithColorAndExpensive.sort(({ hour: a }, { hour: b }) => a - b);

const newFilename = 'src/lib/data/cleaned-price-tomorrow.json';
await writeJSON(newFilename, sortedByHour);
