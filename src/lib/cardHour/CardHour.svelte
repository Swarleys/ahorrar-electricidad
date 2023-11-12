
<script>
	let { hour, formattedHour, zone, price, expensive, color, userHour = 0 } = $props();
	const setCardHourColor = (color) => `bg${color}`;
</script>

<div
	class:hourPassed={userHour > hour}
	class="px-4 py-2 max-w-s bg-white rounded-xl shadow-md overflow-hidden flex flex-row items-center justify-center flex-grow text-stone-800"
>
	<div class="flex flex-row flex-1 pr-2">
		<span class="text-s leading-5 font-semibold">{formattedHour}h </span>
		<span class="text-s leading-5 font-semibold ml-2">{zone}</span>
	</div>
	<div class="flex flex-row">
		<span
			class=" flex text-s leading-5 font-semibold rounded-md content-around items-center justify-center"
			>{price} €/kWh
		</span>
		<span
			class="px-3 py-1 flex text-s leading-5 font-semibold rounded-md items-center justify-center ml-2 min-w-[50px] {setCardHourColor(color)}"
			>{expensive}
		</span>
	</div>
</div>

<style>
	.hourPassed {
		@apply opacity-40;
	}
</style>
