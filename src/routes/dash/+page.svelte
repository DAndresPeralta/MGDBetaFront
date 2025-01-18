<script>
	// --- Modules
	import axios from 'axios';
	// --- Components
	import FormRemito from '$lib/FormRemito.svelte';
	import Table from '$lib/Table.svelte';
	import Charts from '$lib/Charts.svelte';
	import Notify from '$lib/Notify.svelte';
	import Footer from '$lib/Footer.svelte';
	// - Carbon Components
	import { Modal, Loading } from 'carbon-components-svelte';
	// --- Stores
	import {
		mostrarForm,
		mostrarTabla,
		orderStore,
		modalStore,
		toast,
		spinner,
		metric1Order
	} from '../../lib/js/store.js';
	// --- States
	import { onMount } from 'svelte';

	// -- Variables
	let order = [];
	let metrics = [
		{ id: 1, title: 'Ventas Totales', value: '-', icon: '💰' },
		{ id: 2, title: 'Clientes Activos', value: '-', icon: '👥' },
		{ id: 3, title: 'Productos Vendidos', value: '-', icon: '📦' },
		{ id: 4, title: 'Ingresos Mensuales', value: '-', icon: '📈' }
	];

	// --- Remito
	const remitero = async (event) => {
		try {
			const data = {
				client: event.detail.client,
				cuil: event.detail.cuil,
				email: event.detail.email,
				taxpayer: event.detail.taxpayer,
				product: event.detail.products.map((product) => ({
					name: product.name,
					quantity: product.quantity,
					price: product.price
				}))
			};

			const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/order`, data, {
				withCredentials: true,
				headers: {
					'Content-Type': 'application/json'
				}
			});

			console.log(response.status);

			if (response) {
				spinner.set(false);
				mostrarForm.set(false);
				toast.set({ openToast: true, messageToast: 'Remito creado exitosamente', kind: 'success' });
			}
			getOrders();
			metricas();
		} catch (error) {
			spinner.set(false);
			mostrarForm.set(false);
			toast.set({
				openToast: true,
				messageToast: 'Error en la creación del remito',
				kind: 'error'
			});
			console.error('Error al obtener el PDF:', error);
		}
	};
	// --- Remito
	// --- Tabla
	const getOrders = async () => {
		const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/order`, {
			withCredentials: true
		});
		order = response.data.result.map((item) => ({
			id: item._id,
			serie: item.serie,
			date: item.date,
			client: item.client,
			cuil: item.cuil,
			email: item.email,
			taxpayer: item.taxpayer,
			product: item.product,
			total: item.total
		}));
		orderStore.set(order);
	};

	const cerrarTabla = () => {
		mostrarTabla.set(false);
	};

	const abrirPDF = async (e) => {
		try {
			const response = await fetch(`${import.meta.env.VITE_API_URL}/api/pdfview/${e.detail.id}`, {
				method: 'GET',
				credentials: 'include'
			});

			const pdfBlob = await response.blob();
			if (pdfBlob.size === 0) {
				modalStore.set({
					isOpen: true,
					id: `${e.detail.id}`
				});

				return;
			}

			const pdfUrl = URL.createObjectURL(pdfBlob);
			window.open(pdfUrl, '_blank');
			setTimeout(() => URL.revokeObjectURL(pdfUrl), 60000);
		} catch (error) {
			console.error('Error al obtener el PDF:', error);
		}
	};

	const generarPDF = async (id) => {
		try {
			const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/pdfrec/${id}`, {
				responseType: 'blob',
				withCredentials: true,
				headers: {
					'Content-Type': 'application/json'
				}
			});

			const pdfUrl = URL.createObjectURL(response.data);
			window.open(pdfUrl, '_blank');
			setTimeout(() => URL.revokeObjectURL(pdfUrl), 60000);
		} catch (error) {
			console.error('Error al obtener el PDF:', error);
		}
	};

	const eliminarOrden = async (data) => {
		const status = {
			status: false
		};

		const response = await axios.put(
			`${import.meta.env.VITE_API_URL}/api/order/${data.detail.id}`,
			status,
			{
				withCredentials: true
			}
		);
		getOrders();
	};
	// --- Tabla

	// --- Métricas
	const metricas = async () => {
		try {
			let riCounter = 0;
			let mtCounter = 0;
			let cfCounter = 0;
			let ieCounter = 0;

			const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/order`);
			const orders = response.data.result;

			orders.forEach((item) => {
				if (item.taxpayer === 'MONOTRIBUTISTA') mtCounter++;
				if (item.taxpayer === 'CONSUMIDOR FINAL') cfCounter++;
				if (item.taxpayer === 'IVA EXCENTO') ieCounter++;
				if (item.taxpayer === 'RESPONSABLE INSCRIPTO') riCounter++;
			});

			metric1Order.set({
				ri: riCounter,
				mt: mtCounter,
				cf: cfCounter,
				ie: ieCounter
			});
		} catch (error) {}
	};

	onMount(() => {
		getOrders();
		metricas();
	});
</script>

<main>
	<section>
		{#if $mostrarForm}
			<FormRemito on:crearRemito={(spinner.set(true), remitero)} />
		{:else if $mostrarTabla}
			<Table on:volver={cerrarTabla} on:verPDF={abrirPDF} on:eliminar={eliminarOrden} />
		{:else}
			<Charts />
		{/if}

		{#if $spinner}
			<Loading />
		{/if}
		{#if $toast.openToast}
			<Notify title={$toast.messageToast} kind={$toast.kind} />
		{/if}
	</section>
	<Modal
		primary
		size="xs"
		open={$modalStore.isOpen}
		modalHeading="Advertencia"
		primaryButtonText="Generar PDF"
		secondaryButtonText="Cancelar"
		on:click:button--primary={() => {
			let id = $modalStore.id;
			spinner.set(true);
			modalStore.set({ isOpen: false, id: '' });
			generarPDF(id).finally(() => {
				spinner.set(false);
			});
		}}
		on:click:button--secondary={() => {
			modalStore.set({ isOpen: false, id: '' });
		}}
		on:open
		on:close={() => {
			modalStore.set({ isOpen: false, id: '' });
		}}
		on:submit
	>
		<p>No existe PDF asociado a la orden. ¿Desea generar uno?</p>
	</Modal>
</main>
<Footer />

<style>
	main {
		flex: 1;
	}
	section {
		margin-top: 5rem;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
