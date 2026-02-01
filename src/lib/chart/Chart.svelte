<script lang="ts">
    import Chart from 'chart.js/auto';
    import type { ChartConfiguration } from 'chart.js';
    import type { Attachment } from 'svelte/attachments';
    import type { formattedData } from '$utils/helpers';
    import data from '$data/cleaned-price.json';
    
    type ChartPoint = Pick<formattedData, 'hour' | 'price' | 'color'>;
    type ChartColor = ChartPoint['color'];
    
    const chartData = data as ChartPoint[];
    
    const colorObject: Record<ChartColor, { bg: string; border: string }> = {
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
    
    const labels = chartData.map((d) => d.hour);
    const price = chartData.map((d) => d.price);
    const backgroundColor = chartData.map((d) => colorObject[d.color].bg);
    const borderColor = chartData.map((d) => colorObject[d.color].border);
    
    const barData: ChartConfiguration<'bar', number[], number> = {
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
    
    const chartAttachment: Attachment<HTMLCanvasElement> = (node) => {
	const chart = new Chart(node, barData);
    
	return () => {
		chart.destroy();
	};
    };
</script>

<canvas {@attach chartAttachment} >

</canvas>
