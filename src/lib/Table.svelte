<script>
	import {
		DataTable,
		OverflowMenu,
		OverflowMenuItem,
		Pagination,
		Button,
		Modal
	} from 'carbon-components-svelte';

	import Btn from './Button.svelte';

	import { orderStore, spinner, toast } from '../lib/js/store.js';

	import axios from 'axios';
	import { createEventDispatcher } from 'svelte';

	// -- Variables
	let order = [];
	let orderToPDF = null;
	let orderToUpdate = null;
	let orderToDelete = null;
	// -- Variable de estado Modal
	let open = false;

	const dispatch = createEventDispatcher();

	orderStore.subscribe((orders) => {
		order = orders;
	});

	const headers = [
		{ key: 'serie', value: 'Remito' },
		{ key: 'date', value: 'Fecha' },
		{ key: 'client', value: 'Cliente' },
		{ key: 'cuil', value: 'CUIL' },
		{ key: 'email', value: 'Email' },
		{ key: 'total', value: 'Total' },
		{ key: 'overflow', empty: true }
	];

	// --Event Dispatcher
	const volver = () => {
		dispatch('volver');
	};
	const verPdf = (data) => {
		dispatch('verPDF', data);
	};
	const modificar = (data) => {
		dispatch('modificar', data);
	};
	const eliminar = (data) => {
		dispatch('eliminar', data);
	};

	// -- Paginación
	let pageSize = 10;
	let page = 1;
	$: pagedOrders = order.slice((page - 1) * pageSize, page * pageSize);
</script>

<div class="table-container">
	<DataTable sortable {headers} rows={pagedOrders}>
		<svelte:fragment slot="cell" let:cell let:row>
			{#if cell.key === 'overflow'}
				<OverflowMenu flipped>
					<OverflowMenuItem
						on:click={() => {
							orderToPDF = row;
							verPdf(orderToPDF);
						}}
						text="Ver PDF"
					/>
					<OverflowMenuItem
						on:click={() => {
							orderToUpdate = row;
							modificar(orderToUpdate);
						}}
						text="Modificar"
					/>
					<OverflowMenuItem
						danger
						on:click={() => {
							orderToDelete = row;
							open = true;
						}}
						text="Eliminar"
					/>
				</OverflowMenu>
			{:else}{cell.value}{/if}
		</svelte:fragment>
	</DataTable>
	<Pagination
		bind:page
		bind:pageSize
		totalItems={order.length}
		pageSizeInputDisabled
		on:pageChange={({ detail }) => {
			page = detail.page;
		}}
	/>
	<Btn title="Volver" kind="secondary" on:click={volver} />
</div>

<Modal
	danger
	size="xs"
	bind:open
	modalHeading="Advertencia"
	primaryButtonText="Borrar"
	secondaryButtonText="Cancelar"
	on:click:button--primary={() => {
		eliminar(orderToDelete);
		spinner.set(true);
		toast.set({ openToast: false });
		orderToDelete = null;
		open = false;
	}}
	on:click:button--secondary={() => (open = false)}
	on:open
	on:close={() => (open = false)}
	on:submit
>
	<p>Se eliminará un producto. ¿Esta seguro que desea continuar?</p>
</Modal>

<style>
	.table-container {
		width: 97%;
		height: auto;
	}
</style>
