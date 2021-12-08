<script>
    export let color, price, hour, text
</script>

<div
	class="px-4 py-2 bg-white rounded-xl shadow-md overflow-hidden flex flex-col items-center justify-center flex-grow mb-4 max-w-[150px] "
>
	<p>{text}</p>
	<p>{hour}</p>
	<p
		class:bgGreen={color === 'green'}
		class:bgYellow={color === 'yellow'}
		class:bgRed={color === 'red'}
		class="px-3 py-1 rounded-md"
	>
		{price} €/kWh
	</p>
</div>
