<script lang="ts">
	import { browser } from '$app/environment';
	import { fly, fade } from 'svelte/transition';

	import CardHour from '$lib/cardHour/CardHour.svelte';
	import PromotedData from '$lib/promotedData/PromotedData.svelte';
	import Chart from '$lib/chart/Chart.svelte';
	import type { formattedData } from '$utils/helpers.js';
	import { getPrices } from './prices.remote';

	const prices = getPrices();

	let showTomorrow = $state<boolean>();
	let showPastHours = $state<boolean>();
	let innerWidth = $state<number>();

	const tomorrowVisible = 1225;
	let userHour = new Date().getHours();
	let userMinutes = new Date().getMinutes();
	let userTotalMinutes = userHour * 60 + userMinutes;
	let formatTime = (hour: number, minutes: number) => {
		let formattedHour = hour < 10 ? `0${hour}` : hour;
		let formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

		return `${formattedHour}:${formattedMinutes}h`;
	};
	let userTime = formatTime(userHour, userMinutes);
</script>

<svelte:head>
	<title>Ahorra electricidad</title>
</svelte:head>

<svelte:window bind:innerWidth />

<section class="m-6 mt-3 sm:m-auto md:min-w-175 lg:min-w-244">
	<h1 class="mb-3">Ahorra en electricidad.</h1>

	{#await prices}
		<p class="px-4 py-2 bg-white rounded-xl shadow-md w-fit my-4">Cargando precios...</p>
	{:then result}
		{@const todayData = (result?.todayData ?? []) as formattedData[]}
		{@const tomorrowData = (result?.tomorrowData ?? []) as formattedData[]}
		{@const currentData = todayData.find((data) => data.hour === userHour)}
		{@const nextCheapestTodayData = todayData.slice(userHour)}
		{@const nextCheapestHour = nextCheapestTodayData.length
			? [...nextCheapestTodayData].sort(({ price: a }, { price: b }) => a - b)[0]
			: undefined}
		{@const nextFormattedHour = nextCheapestHour?.formattedHour}
		{@const nextHour = nextCheapestHour?.hour}
		{@const removedHours = browser ? todayData.slice(userHour) : todayData}

		{#if currentData}
			<section class="flex gap-3 justify-between sm:justify-center">
				<PromotedData
					color={currentData.color}
					price={currentData.price}
					hour={userTime}
					text="Hora actual"
				/>
				{#if nextCheapestHour && userHour !== nextHour}
					<PromotedData
						color={nextCheapestHour.color}
						price={nextCheapestHour.price}
						hour={`${nextFormattedHour}h`}
						text="Siguiente ahorro"
					/>
				{:else}
					<PromotedData
						color={currentData.color}
						price={currentData.price}
						hour={userTime}
						text="¡Aprovecha!"
					/>
				{/if}
			</section>
		{/if}
		<Chart data={todayData} />

		{#if browser && userTotalMinutes > tomorrowVisible && userHour < 24}
			<label class="flex items-baseline gap-2 mt-2">
				<input type="checkbox" bind:checked={showTomorrow} />
				Mostrar los precios de mañana:
			</label>
			{#if showTomorrow}
				{#if tomorrowData.length > 0}
					<p class="px-4 py-2 bg-white rounded-xl shadow-md w-fit my-4">
						{tomorrowData[0].day}
					</p>
				{/if}
				<div
					transition:fly={{ y: 200, duration: 500 }}
					class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-4"
				>
					{#each tomorrowData as tomorrowHourlyData (tomorrowHourlyData.hour)}
						<CardHour {...tomorrowHourlyData} />
					{/each}
				</div>
			{/if}
		{/if}
		<label class="flex items-baseline sm:hidden gap-2 mt-2">
			<input type="checkbox" bind:checked={showPastHours} />
			Mostrar las horas anteriores:
		</label>
		{#if todayData.length > 0}
			<p class="px-4 py-2 bg-white rounded-xl shadow-md w-fit my-4">{todayData[0].day}</p>
		{/if}
		{#if innerWidth && innerWidth < 639 && !showPastHours}
			<div
				out:fade={{ duration: 200 }}
				in:fly={{ y: 300, duration: 700, delay: 300 }}
				class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
			>
				{#each removedHours as removedHourlyData (removedHourlyData.hour)}
					<CardHour {...removedHourlyData} {userHour} />
				{/each}
			</div>
		{:else}
			<div
				transition:fly={{ y: -300, duration: 700 }}
				class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
			>
				{#each todayData as hourlyData (hourlyData.hour)}
					<CardHour {...hourlyData} {userHour} />
				{/each}
			</div>
		{/if}
	{:catch error}
		<p class="px-4 py-2 bg-white rounded-xl shadow-md w-fit my-4">
			No se pudieron cargar los precios: {error?.message ?? 'Error inesperado'}
		</p>
	{/await}
</section>
