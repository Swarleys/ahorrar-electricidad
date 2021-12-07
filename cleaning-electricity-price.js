import { readJSON, writeJSON } from 'https://deno.land/x/flat@0.0.10/src/json.ts';

const filename = 'electricity-price-api.json';
const json = await readJSON(filename);

const createZone = (hour) => {
	if (hour >= 0 && hour < 8) {
		return 'Valle';
	} else if ((hour >= 8 && hour < 10) || (hour >= 14 && hour < 18) || (hour >= 22 && hour < 24)) {
		return 'Llano';
	} else {
		return 'Punta';
	}
};

const filteredData = json.PVPC.map(({ Dia, Hora, PCB }) => {
	const getFirstHour = Hora.split('-')[0];
	return {
		day: Dia,
		hour: +getFirstHour,
		formattedHour: `${getFirstHour}:00`,
		price: (+PCB.split(',')[0] / 1000).toFixed(3),
		zone: createZone(+getFirstHour)
	};
});

const sortedByPrice = filteredData.sort(({ price: a }, { price: b }) => a - b);

for (let [index, element] of sortedByPrice.entries()) {
	if (index < 8) {
		element.expensive = '€';
		element.color = 'green';
	} else if (index >= 8 && index < 16) {
		element.expensive = '€€';
		element.color = 'yellow';
	} else {
		element.expensive = '€€€';
		element.color = 'red';
	}
}

const sortedByHour = sortedByPrice.sort(({ hour: a }, { hour: b }) => a - b);

const newFilename = 'src/lib/data/cleaned-price.json';
await writeJSON(newFilename, sortedByHour);
