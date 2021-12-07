<script context="module">
	export const prerender = true;
	import data from '$data/cleaned-price.json';
	import CardHour from '$lib/cardHour/CardHour.svelte';
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
	let { price } = data.find((data) => data.hour === userHour);
	let nextCheapestData = data.slice(userHour);
	let [nextCheapestHour] = nextCheapestData.sort(({ price: a }, { price: b }) => a - b);
</script>

<svelte:head>
	<title>Ahorra electricidad</title>
</svelte:head>

<section class="m-6">
	<h1>Ahorra en electricidad.</h1>

	<p>Son las {userTime} y el precio es {price} €/kWh</p>
	<p>
		La hora más barata de lo que queda de dia es a las {nextCheapestHour.formattedHour}h a un precio
		de
		{nextCheapestHour.price} €/kWh
	</p>
	<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
		{#each data as { hour, formattedHour, price, zone, expensive, color }, i (hour)}
			<CardHour {hour} {formattedHour} {price} {zone} {expensive} {color} {userHour} />
		{/each}
	</div>
</section>
