<script context="module">
	export const prerender = true;
	import data from '$data/cleaned-price.json';
	import tomorrowData from '$data/cleaned-price-tomorrow.json';
</script>

<script>
	import { browser } from '$app/env';
	import CardHour from '$lib/cardHour/CardHour.svelte';
	import PromotedData from '$lib/promotedData/PromotedData.svelte';
	import Chart from '$lib/chart/Chart.svelte';

	const tomonrrowVisible = 1225;
	let userHour = new Date().getHours();
	let userMinutes = new Date().getMinutes();
	let userTotalMinutes = userHour * 60 + userMinutes;
	let formatTime = (hour, minutes) => {
		let formattedHour = hour < 10 ? `0${hour}` : hour;
		let formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

		return `${formattedHour}:${formattedMinutes}h`;
	};
	let userTime = formatTime(userHour, userMinutes);
	let { price, color } = data.find((data) => data.hour === userHour);
	let nextCheapestData = data.slice(userHour);
	let [nextCheapestHour] = nextCheapestData.sort(({ price: a }, { price: b }) => a - b);
	let {
		formattedHour: nextFormattedHour,
		color: nextColor,
		price: nextPrice,
		hour: nextHour
	} = nextCheapestHour;
	let showTomorrow = false;
</script>

<svelte:head>
	<title>Ahorra electricidad</title>
</svelte:head>

<section class="m-6 sm:m-auto md:min-w-[700px] lg:min-w-[976px]">
	<h1>Ahorra en electricidad.</h1>

	<section class="flex gap-3 justify-between sm:justify-center">
		<PromotedData {color} {price} hour={userTime} text="Hora actual" />
		{#if userHour !== nextHour}
			<PromotedData
				color={nextColor}
				price={nextPrice}
				hour={`${nextFormattedHour}h`}
				text="Siguiente ahorro"
			/>
		{:else}
			<PromotedData {color} {price} hour={userTime} text="¡Aprovecha!" />
		{/if}
	</section>
	<Chart/>

	{#if browser && userTotalMinutes > tomonrrowVisible && userHour < 24}
		<label>
			<input type="checkbox" bind:checked={showTomorrow} />
			Mostrar los precios para mañana:
		</label>
		{#if showTomorrow}
			<p class="px-4 py-2 bg-white rounded-xl shadow-md w-fit my-4">{tomorrowData[0].day}</p>
			<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
				{#each tomorrowData as { hour, formattedHour, price, zone, expensive, color }, i (hour)}
					<CardHour {hour} {formattedHour} {price} {zone} {expensive} {color} />
				{/each}
			</div>
		{/if}
	{:else}
		<!-- else content here -->
	{/if}
	<p class="px-4 py-2 bg-white rounded-xl shadow-md w-fit my-4">{data[0].day}</p>
	<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
		{#each data as { hour, formattedHour, price, zone, expensive, color }, i (hour)}
			<CardHour {hour} {formattedHour} {price} {zone} {expensive} {color} {userHour} />
		{/each}
	</div>
</section>
