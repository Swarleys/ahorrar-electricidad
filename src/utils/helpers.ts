const addingZone = (hour: number) => {
	if (hour >= 0 && hour < 8) {
		return 'Valle';
	} else if ((hour >= 8 && hour < 10) || (hour >= 14 && hour < 18) || (hour >= 22 && hour < 24)) {
		return 'Llano';
	}
	return 'Punta';
};

export interface Pvpc {
	Dia: string;
	Hora: string;
	PCB: string;
}

export interface baseFormattedData {
	day: string;
	hour: number;
	formattedHour: string;
	price: number;
	zone: 'Valle' | 'Llano' | 'Punta';
}

export interface formattedData extends baseFormattedData {
	expensive: '€' | '€€' | '€€€';
	color: 'green' | 'yellow' | 'red';
}

export const formattingJson = (PVPC: Pvpc[]) => {
	return PVPC.map(({ Dia, Hora, PCB }) => {
		const getFirstHour: string = Hora.split('-')[0];
		const hourlyData: baseFormattedData = {
			day: Dia,
			hour: +getFirstHour,
			formattedHour: `${getFirstHour}:00`,
			price: +(+PCB.split(',')[0] / 1000).toFixed(3),
			zone: addingZone(+getFirstHour)
		};
		return hourlyData;
	});
};

export const setColorAndExpensive = (sortedByPrice: baseFormattedData[]): formattedData[] => {
	const withColorAndExpensive: formattedData[] = sortedByPrice.map((element, index) => {
		if (index < 8) {
			return {
				...element,
				expensive: '€',
				color: 'green'
			};
		} else if (index >= 8 && index < 16) {
			return {
				...element,
				expensive: '€€',
				color: 'yellow'
			};
		}
		return {
			...element,
			expensive: '€€€',
			color: 'red'
		};
	});
	return withColorAndExpensive;
};
