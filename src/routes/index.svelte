<script context="module">
	export const prerender = true;
	import data from '$data/cleaned-price.json';
</script>

<script>
	import CardHour from '$lib/cardHour/CardHour.svelte';
	import PromotedData from '$lib/promotedData/PromotedData.svelte';
	let userHour = new Date().getHours();
	let userMinutes = new Date().getMinutes();

	let formatTime = (hour, minutes) => {
		let formattedHour = hour < 10 ? `0${hour}` : hour;
		let formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

		return `${formattedHour}:${formattedMinutes}h`;
	};
	let userTime = formatTime(userHour, userMinutes);
	let { price, color } = data.find((data) => data.hour === userHour);
	let nextCheapestData = data.slice(userHour);
	let [nextCheapestHour] = nextCheapestData.sort(({ price: a }, { price: b }) => a - b);
	let { formattedHour: nextFormattedHour, color: nextColor, price: nextPrice, hour: nextHour } = nextCheapestHour;
</script>

<svelte:head>
	<title>Ahorra electricidad</title>
</svelte:head>

<section class="m-6">
	<h1>Ahorra en electricidad.</h1>

	<section class="flex gap-3 justify-between md:justify-center">
		<PromotedData {color} {price} hour={userTime} text="Hora actual" />
		{#if userHour !== nextHour}
		<PromotedData color={nextColor}
		price={nextPrice}
		hour={`${nextFormattedHour}h`}
		text="Siguiente ahorro"
		/>
		{:else}
		<PromotedData {color} {price} hour={userTime} text="¡Aprovecha!" />
		{/if}
	</section>
	<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
		{#each data as { hour, formattedHour, price, zone, expensive, color }, i (hour)}
			<CardHour {hour} {formattedHour} {price} {zone} {expensive} {color} {userHour} />
		{/each}
	</div>
</section>
