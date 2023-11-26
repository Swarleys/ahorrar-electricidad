import { readJSON, writeJSON } from 'https://deno.land/x/flat@0.0.10/src/json.ts';
import { formattingJson, setColorAndExpensive } from '$utils/helpers.js';

const filename = 'electricity-price-api.json';
const json = await readJSON(filename);

formattingJson(json.PVPC);

const sortedByPrice = filteredData.sort(({ price: a }, { price: b }) => a - b);

setColorAndExpensive(sortedByPrice);

const sortedByHour = sortedByPrice.sort(({ hour: a }, { hour: b }) => a - b);

const newFilename = 'src/lib/data/cleaned-price.json';
await writeJSON(newFilename, sortedByHour);
