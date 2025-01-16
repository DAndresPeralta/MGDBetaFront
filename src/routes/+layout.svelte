<script>
	import 'carbon-components-svelte/css/g90.css';
	import '../app.css';
	let { children } = $props();
</script>

{@render children()}
