import todayData from '$data/cleaned-price.json';
import tomorrowData from '$data/cleaned-price-tomorrow.json';

export function load() {
  return {
    todayData: todayData,
    tomorrowData: tomorrowData
  };
    
}
