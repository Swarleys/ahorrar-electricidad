<svelte:options runes={true} />
<script>
	let priceWithVat = 0;
	const priceWithExtraVat = $derived((priceWithVat / 1.21) * 1.262);
</script>

<section class="m-6 mt-3 sm:m-auto md:min-w-[700px] lg:min-w-[976px]">
	<h1 class="mb-3">Calcula el recargo de equivalencia.</h1>
	<p class="mb-4 text-xl self-start mx-auto w-fit ml-4">
		Si estas registrado como autonomo con recargo de equivalencia para hacer arbitrage, aqui podras
		calcular rapidamente cual es el precio que tienes que pagar partiendo desde el precio con IVA
		que ves en la tienda.
	</p>
	<div
		class="flex flex-col justify-center items-center gap-3 mt-5 self-center w-full md:w-2/3 pr-4 pl-4"
	>
		<div class="relative z-0 mb-6 w-full group">
			<input
				type="number"
				name="priceWithVat"
				id="priceWithVat"
                bind:value={priceWithVat}
				class="block py-2.5 px-0 w-full text-md text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
				placeholder=""
			/>
			<label
				for="priceWithVat"
				class="absolute text-xl text-gray-500 pb-1 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0  peer-focus:-translate-y-6"
				>Precio con IVA</label
			>
		</div>
		<p>{priceWithExtraVat.toFixed(2)}</p>
	</div>
</section>
