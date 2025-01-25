<script>
	// --- Components
	import Footer from '../lib/Footer.svelte';
	import Header from '../lib/Header.svelte';
	import Form from '../lib/Form.svelte';

	// --- Modules
	import axios from 'axios';
	import { onMount } from 'svelte';

	const initialize = async () => {
		try {
			const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/init`);
			console.log(response.status);
		} catch (error) {
			console.error('Error al conectar al back: ', error);
		}
	};

	onMount(() => {
		initialize();
	});
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
