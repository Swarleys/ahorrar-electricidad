import todayData from '../lib/data/cleaned-price.json';
import tomorrowData from '../lib/data/cleaned-price-tomorrow.json';
import type { formattedData } from '../utils/helpers';

export function load(): { todayData: formattedData[]; tomorrowData: formattedData[] } {
	return {
		todayData: todayData as unknown as formattedData[],
		tomorrowData: tomorrowData as unknown as formattedData[]
	};
}
