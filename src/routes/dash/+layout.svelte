<!-- en layout van los estilos y diseño del pages -->
<!-- Tambien los componentes que queremos que todas nuestras paginas (dentro de la carpeta) hereden -->
<script>
	import 'carbon-components-svelte/css/g90.css';
	import '../../app.css';
	// import '@carbon/charts/styles.css';
	// /* @import '@carbon/charts-svelte/styles.css'; */
	import '@carbon/charts/styles.css';
	import Navbar from '../../lib/Navbar.svelte';
</script>

<header>
	<Navbar />
</header>

<slot />
