<script>
	export let data;
	let todayData = data.todayData;
	let tomorrowData = data.tomorrowData;

	import { browser } from '$app/environment';
	import CardHour from '$lib/cardHour/CardHour.svelte';
	import PromotedData from '$lib/promotedData/PromotedData.svelte';
	import Chart from '$lib/chart/Chart.svelte';
	import { fly, fade } from 'svelte/transition';

	const tomorrowVisible = 1225;
	let userHour = new Date().getHours();
	let userMinutes = new Date().getMinutes();
	let userTotalMinutes = userHour * 60 + userMinutes;
	let formatTime = (hour, minutes) => {
		let formattedHour = hour < 10 ? `0${hour}` : hour;
		let formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

		return `${formattedHour}:${formattedMinutes}h`;
	};
	let userTime = formatTime(userHour, userMinutes);
	let { price, color } = todayData.find((data) => data.hour === userHour);
	let nextCheapestTodayData = todayData.slice(userHour);
	let [nextCheapestHour] = nextCheapestTodayData.sort(({ price: a }, { price: b }) => a - b);
	let {
		formattedHour: nextFormattedHour,
		color: nextColor,
		price: nextPrice,
		hour: nextHour
	} = nextCheapestHour;
	let showTomorrow;
	let showPastHours;
	let removingHours = browser ? todayData.slice(userHour): todayData;
	$: innerWidth = 0;
</script>

<svelte:head>
	<title>Ahorra electricidad</title>
</svelte:head>

<svelte:window bind:innerWidth />

<section class="m-6 mt-3 sm:m-auto md:min-w-[700px] lg:min-w-[976px]">
	<h1 class="mb-3">Ahorra en electricidad.</h1>

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

	{#if browser && userTotalMinutes > tomorrowVisible && userHour < 24}
		<label class="flex items-baseline gap-2 mt-2">
			<input type="checkbox" bind:checked={showTomorrow} />
			Mostrar los precios de mañana:
		</label>
		{#if showTomorrow}
			<p class="px-4 py-2 bg-white rounded-xl shadow-md w-fit my-4">{tomorrowData[0].day}</p>
			<div transition:fly="{{ y: 200, duration: 500 }}" class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-4">
				{#each tomorrowData as { hour, formattedHour, price, zone, expensive, color }, i (hour)}
					<CardHour {hour} {formattedHour} {price} {zone} {expensive} {color} />
				{/each}
			</div>
		{/if}
	{/if}
	<label class="flex items-baseline sm:hidden gap-2 mt-2">
		<input type="checkbox" bind:checked={showPastHours} />
		Mostrar las horas anteriores:
	</label>
	<p class="px-4 py-2 bg-white rounded-xl shadow-md w-fit my-4">{todayData[0].day}</p>
	{#if innerWidth < 639 && !showPastHours}
		<div  out:fade="{{ duration: 200}}" in:fly="{{y: 300, duration: 700, delay: 300}}"  class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
			{#each removingHours as { hour, formattedHour, price, zone, expensive, color }, i (hour)}
				<CardHour {hour} {formattedHour} {price} {zone} {expensive} {color} {userHour}/>
			{/each}
		</div>
	{:else}
		<div transition:fly="{{ y: -300, duration: 700 }}" class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
			{#each todayData as { hour, formattedHour, price, zone, expensive, color }, i (hour)}
				<CardHour {hour} {formattedHour} {price} {zone} {expensive} {color} {userHour}/>
			{/each}
		</div>
	{/if}
</section>
