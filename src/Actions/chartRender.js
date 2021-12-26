import { Chart, registerables } from 'chart.js';
Chart.register(...registerables); 
import data from '$data/cleaned-price.json';

const colorObject = {
	green: {
		bg: 'rgb(134 239 172)',
		border: 'rgb(34 197 94)'
	},
	yellow: {
		bg: 'rgb(253 224 71)',
		border: 'rgb(234 179 8)'
	},
	red: {
		bg: 'rgb(252 165 165)',
		border: 'rgb(239 68 68)'
	}
};

let labels = data.map(d => d.hour);
let price = data.map(d => d.price);
let backgroundColor = data.map((d) => colorObject[d.color].bg);
let borderColor = data.map((d) => colorObject[d.color].border);


let barData = {
	type: 'bar',
	data: {
		labels,
		datasets: [
			{
				label: 'Precio electricidad',
				data: price,
				backgroundColor,
				borderColor,
				borderWidth: 1
			}
		]
	},
	options: {
		scales: {
			y: {
				beginAtZero: false
			}
		}
	}
};

export const chartRender = (node) => {
	new Chart(node, barData);
};
