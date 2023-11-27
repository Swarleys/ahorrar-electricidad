<script>
	import Header from '$lib/header/Header.svelte';
	import '../app.css';
</script>

<Header />

<slot />

<footer class="flex flex-col justify-center items-center p-10 sm:py-10 sm:px-0">
	<p>
		Realizado por <a href="https://www.estebanramos.work" target="_blank" rel="noopener noreferrer" class="font-bold"
			>Esteban Ramos</a
		> en Barcelona
	</p>
</footer>

