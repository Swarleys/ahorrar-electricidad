import { query } from '$app/server';
import type { formattedData } from '$utils/helpers';
import todayData from '$data/cleaned-price.json';
import tomorrowData from '$data/cleaned-price-tomorrow.json';

type PricesResponse = {
	todayData: formattedData[];
	tomorrowData: formattedData[];
};

export const getPrices = query(async (): Promise<PricesResponse> => {
	return {
		todayData: todayData as unknown as formattedData[],
		tomorrowData: tomorrowData as unknown as formattedData[]
	};
});
