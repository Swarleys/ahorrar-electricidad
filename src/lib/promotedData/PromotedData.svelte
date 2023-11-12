<svelte:options runes={true} />
<script>
	const { color = '', price = '', hour = '', text = '' } = $props();
	const setCardHourColor = (color) => `bg${color}`;
</script>

<div
	class="px-4 py-2 bg-white rounded-xl shadow-md overflow-hidden flex flex-col items-center justify-center flex-grow mb-4 max-w-[150px] "
>
	<p>{text}</p>
	<p>{hour}</p>
	<p class="px-3 py-1 rounded-md {setCardHourColor(color)}">
		{price} €/kWh
	</p>
</div>
