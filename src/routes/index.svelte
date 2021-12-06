<script context="module">
	export const prerender = true;
	import data from '$data/cleaned-price.json';
</script>

<script>
	let userHour = new Date().getHours();
	let userMinutes = new Date().getMinutes();

	let formatTime = (hour, minutes) => {
		let formattedHour = hour < 10 ? `0${hour}` : hour;
		let formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

		return `${formattedHour}:${formattedMinutes}h`;
	};
	let userTime = formatTime(userHour, userMinutes);

	let newData = data.map((time) => {
		let hour = time.hour;
		if (!time.formattedHour) {
			time.formattedHour = hour < 10 ? `0${hour}:00` : `${hour}:00`;
		}

		return time;
	});

	let sortedData = newData.sort(({ price: a }, { price: b }) => a - b);

	for (let [index, element] of sortedData.entries()) {
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

	let orderedData = sortedData.sort(({ hour: a }, { hour: b }) => a - b);

	let { price } = orderedData.find((data) => data.hour === userHour);

	let nextCheapestData = orderedData.slice(userHour + 1);
	let [nextCheapestHour, ...rest] = nextCheapestData.sort(({ price: a }, { price: b }) => a - b);
</script>

<svelte:head>
	<title>Ahorra electricidad</title>
</svelte:head>

<section class="m-6">
	<h1>Ahorra en electricidad.</h1>

	<p>Son las {userTime} y el precio es {price} €/kWh</p>
	<p>
		La hora más barata de lo que queda de dia es las {nextCheapestHour.formattedHour} a un precio de
		{nextCheapestHour.price} €/kWh
	</p>
	<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
		{#each orderedData as { hour, formattedHour, price, zone, expensive, color }, i (hour)}
			<div
				class:hourPassed={userHour > hour}
				class="px-4 py-2 max-w-s  bg-white rounded-xl shadow-md overflow-hidden flex flex-row items-center justify-center flex-grow"
			>
				<div class="flex flex-row flex-1">
					<span class="text-s leading-5 font-semibold">{formattedHour}h </span>
					<span class="text-s leading-5 font-semibold capitalize ml-2">{zone}</span>
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
		{/each}
	</div>
</section>

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
