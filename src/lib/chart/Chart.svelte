<script lang="ts">
	import { untrack } from 'svelte';
	import Chart from 'chart.js/auto';
	import type { ChartConfiguration } from 'chart.js';
	import type { Attachment } from 'svelte/attachments';
	import type { formattedData } from '$utils/helpers';
    
	type ChartPoint = Pick<formattedData, 'hour' | 'price' | 'color'>;
	type ChartColor = ChartPoint['color'];

	interface Props {
		data: ChartPoint[];
	}

	let { data: chartData }: Props = $props();
    
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
    
	const labels = $derived(chartData.map((d) => d.hour));
	const price = $derived(chartData.map((d) => d.price));
	const backgroundColor = $derived(chartData.map((d) => colorObject[d.color].bg));
	const borderColor = $derived(chartData.map((d) => colorObject[d.color].border));

	const barData: ChartConfiguration<'bar', number[], number> = $derived({
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
	});
    
	let chart = $state<Chart<'bar', number[], number> | null>(null);

	const chartAttachment: Attachment<HTMLCanvasElement> = (node) => {
		const chartInstance = new Chart(node, untrack(() => barData));
		chart = chartInstance;

		return () => {
			chartInstance.destroy();
			chart = null;
		};
	};

	const chartSync = {
		get run() {
			const chartInstance = chart;
			if (!chartInstance) return;

			chartInstance.data.labels = labels;
			const dataset = chartInstance.data.datasets[0];
			dataset.data = price;
			dataset.backgroundColor = backgroundColor;
			dataset.borderColor = borderColor;
			chartInstance.update();
		}
	};

	$effect(() => {
		chartSync.run;
	});
</script>

<canvas {@attach chartAttachment}></canvas>
