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

	import { clientStore, spinner, toast } from '../lib/js/store.js';

	import { createEventDispatcher } from 'svelte';

	// -- Variables
	let client = [];
	let clientToDelete = null;
	let clientToUpdate = null;
	// -- Variable de estado Modal
	let open = false;

	const dispatch = createEventDispatcher();

	clientStore.subscribe((clients) => {
		client = clients;
	});

	const headers = [
		{ key: 'code', value: 'Código' },
		{ key: 'companyName', value: 'Cliente' },
		{ key: 'cuil', value: 'CUIL' },
		{ key: 'email', value: 'Email' },
		{ key: 'address', value: 'Dirección' },
		{ key: 'taxpayer', value: 'Condición Fiscal' },
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
	$: pagedClients = client.slice((page - 1) * pageSize, page * pageSize);
</script>

<div class="table-container">
	<DataTable sortable {headers} rows={pagedClients}>
		<svelte:fragment slot="cell" let:cell let:row>
			{#if cell.key === 'overflow'}
				<OverflowMenu flipped>
					<OverflowMenuItem
						on:click={() => {
							clientToUpdate = row;
							modificar(clientToUpdate);
						}}
						text="Modificar"
					/>
					<OverflowMenuItem
						danger
						on:click={() => {
							clientToDelete = row;
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
		totalItems={client.length}
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
		eliminar(clientToDelete);
		spinner.set(true);
		toast.set({ openToast: false });
		clientToDelete = null;
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
