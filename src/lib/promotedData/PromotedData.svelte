<script lang="ts">
	import type { formattedData } from 'src/utils/helpers';

	interface PromotedDataProps {
		color: formattedData['color'];
		price: number;
		hour: string;
		text: string;
	}
	const { color, price, hour, text } = $props<PromotedDataProps>();
	const setCardHourColor = (color: formattedData['color']) => `bg${color}`;
</script>

<div
	class="px-4 py-2 bg-white rounded-xl shadow-md overflow-hidden flex flex-col items-center justify-center flex-grow mb-4 max-w-[150px]"
>
	<p>{text}</p>
	<p>{hour}</p>
	<p class="px-3 py-1 rounded-md {setCardHourColor(color)}">
		{price} €/kWh
	</p>
</div>
