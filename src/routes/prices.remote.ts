import { query } from '$app/server';
import type { formattedData } from '$utils/helpers';
import todayData from '$data/cleaned-price.json';
import tomorrowData from '$data/cleaned-price-tomorrow.json';
import { createPriceSource } from '$utils/live-prices';

// Kept at module level so warm server instances share the ESIOS cache between requests.
const getPriceData = createPriceSource({
	today: todayData as unknown as formattedData[],
	tomorrow: tomorrowData as unknown as formattedData[]
});

export const getPrices = query(getPriceData);
