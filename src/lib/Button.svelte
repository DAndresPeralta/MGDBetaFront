<script>
	import { createEventDispatcher } from 'svelte';
	import { Button } from 'carbon-components-svelte';
	export let title;
	export let type;
	export let kind;

	const dispatch = createEventDispatcher();
</script>

<Button {type} {kind} on:click={(event) => dispatch('click', event)}>{title}</Button>
