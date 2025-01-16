<script>
	import Footer from '../lib/Footer.svelte';
	import Header from '../lib/Header.svelte';
	import Form from '../lib/Form.svelte';
</script>

<Header />
<main>
	<Form />
</main>
<Footer />

<style>
	main {
		display: flex;
		justify-content: center;
		margin-top: 15%; /* Deja espacio para el header */
		margin-bottom: 50px; /* Deja espacio para el footer */
	}
</style>
