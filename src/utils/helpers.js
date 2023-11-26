const addingZone = (hour) => {
	if (hour >= 0 && hour < 8) {
		return 'Valle';
	} else if ((hour >= 8 && hour < 10) || (hour >= 14 && hour < 18) || (hour >= 22 && hour < 24)) {
		return 'Llano';
	}
	return 'Punta';
};

export const formattingJson = (PVPC) => {
    return PVPC.map(({ Dia, Hora, PCB }) => {
        const getFirstHour = Hora.split('-')[0];
        return {
            day: Dia,
            hour: +getFirstHour,
            formattedHour: `${getFirstHour}:00`,
            price: (+PCB.split(',')[0] / 1000).toFixed(3),
            zone: addingZone(+getFirstHour)
        };
    });
};

export const setColorAndExpensive = (sortedByPrice) => {
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
};
