<script>
	import Header from '$lib/header/Header.svelte';
	import '../app.css';
	export let data;
</script>

<Header />

<slot />

<footer>
	<p>
		Realizado por <a href="http://www.estebanramos.work" target="_blank" rel="noopener noreferrer"
			>Esteban Ramos</a
		> en Barcelona
	</p>
</footer>

<style>
	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 40px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 40px 0;
		}
	}
</style>
