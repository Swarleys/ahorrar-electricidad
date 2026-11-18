import { readJSON, writeJSON } from 'https://deno.land/x/flat@0.0.10/src/json.ts';
import { cleanPrices } from './src/utils/helpers.ts';

const filename = 'electricity-price-api.json';
const json = await readJSON(filename);

const sortedByHour = cleanPrices(json.PVPC);

const newFilename = 'src/lib/data/cleaned-price.json';
await writeJSON(newFilename, sortedByHour);
