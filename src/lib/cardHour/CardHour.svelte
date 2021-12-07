<script>
    export let hour, userHour, formattedHour, zone, price, expensive, color;
</script>

<div
	class:hourPassed={userHour > hour}
	class="px-4 py-2 max-w-s  bg-white rounded-xl shadow-md overflow-hidden flex flex-row items-center justify-center flex-grow"
>
	<div class="flex flex-row flex-1">
		<span class="text-s leading-5 font-semibold">{formattedHour}h </span>
		<span class="text-s leading-5 font-semibold ml-2">{zone}</span>
	</div>
	<div class="flex flex-row ">
		<span
			class=" flex text-s leading-5 font-semibold rounded-md content-around  items-center justify-center"
			>{price} €/kWh
		</span>
		<span
			class:bgGreen={color === 'green'}
			class:bgYellow={color === 'yellow'}
			class:bgRed={color === 'red'}
			class="px-3 py-1 flex text-s leading-5 font-semibold rounded-md  items-center justify-center ml-2 min-w-[50px]"
			>{expensive}
		</span>
	</div>
</div>

<style>
	.bgGreen {
		@apply bg-green-300 text-green-800 border-green-500 border-[1px];
	}
	.bgYellow {
		@apply bg-yellow-300 text-yellow-800 border-yellow-500 border-[1px];
	}
	.bgRed {
		@apply bg-red-300 text-red-800 border-red-500 border-[1px];
	}
	.hourPassed {
		@apply opacity-40;
	}
</style>