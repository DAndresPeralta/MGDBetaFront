<script>
	// --- Modules
	import axios from 'axios';
	// --- Components
	import FormRemito from '$lib/FormRemito.svelte';
	import Table from '$lib/Table.svelte';
	import TableClient from '$lib/TableClient.svelte';
	import Charts from '$lib/Charts.svelte';
	import Notify from '$lib/Notify.svelte';
	import Footer from '$lib/Footer.svelte';
	import FormCliente from '$lib/FormCliente.svelte';
	import Form from '$lib/Form.svelte';
	// - Carbon Components
	import { Modal, Loading } from 'carbon-components-svelte';
	// --- Stores
	import {
		mostrarForm,
		mostrarFormCliente,
		mostrarTabla,
		orderStore,
		modalStore,
		toast,
		spinner,
		metric1Order,
		mostrarTablaCliente,
		clientStore
	} from '../../lib/js/store.js';
	import api from '../../lib/js/api.js';
	// --- States
	import { onMount } from 'svelte';

	// -- Variables
	let order = [];
	let client = [];
	let orderToUpdate = null;
	let clientToUpdate = null;
	let metrics = [
		{ id: 1, title: 'Ventas Totales', value: '-', icon: '💰' },
		{ id: 2, title: 'Clientes Activos', value: '-', icon: '👥' },
		{ id: 3, title: 'Productos Vendidos', value: '-', icon: '📦' },
		{ id: 4, title: 'Ingresos Mensuales', value: '-', icon: '📈' }
	];

	const dateFormat = (date) => {
		const newDate = new Date(date);

		const year = newDate.getFullYear();
		const month = String(newDate.getMonth() + 1).padStart(2, '0');
		const day = String(newDate.getDate()).padStart(2, '0');

		return `${day}/${month}/${year}`;
	};

	// --- COMPROBANTES ------------------------------------------------------------------------------------------------------------

	const remitero = async (event) => {
		try {
			const data = {
				clientId: event.detail.clientId,
				date: event.detail.date,
				product: event.detail.products.map((product) => ({
					name: product.name,
					quantity: product.quantity,
					price: product.price,
					discount: product.discount
				})),
				sendEmail: event.detail.sendEmail
			};

			const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/order`, data, {
				withCredentials: true,
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (response) {
				spinner.set(false);
				mostrarForm.set(false);
				toast.set({ openToast: true, messageToast: 'Remito creado exitosamente', kind: 'success' });
			}
			getOrders();
			// metricas();
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

	const actualizarOrden = async (event) => {
		try {
			const data = {
				clientId: event.detail.clientId,
				date: event.detail.date,
				product: event.detail.products.map((product) => ({
					name: product.name,
					quantity: product.quantity,
					price: product.price,
					discount: product.discount
				})),
				sendEmail: event.detail.sendEmail
			};

			const response = await axios.put(
				`${import.meta.env.VITE_API_URL}/api/orderUpdate/${orderToUpdate.id}`,
				data,
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json'
					}
				}
			);

			orderToUpdate = null;

			if (response) {
				spinner.set(false);
				mostrarForm.set(false);
				toast.set({ openToast: true, messageToast: 'Remito modificado', kind: 'success' });
			}

			getOrders();
		} catch (error) {
			spinner.set(false);
			mostrarForm.set(false);
			toast.set({
				openToast: true,
				messageToast: 'Error al modificicar el comprobante',
				kind: 'error'
			});
			console.error('Error al modificar la orden:', error);
		}
	};

	const eliminarOrden = async (data) => {
		try {
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

			if (response) {
				spinner.set(false);
				toast.set({ openToast: true, messageToast: 'Remito eliminado', kind: 'success' });
			}
			getOrders();
		} catch (error) {
			spinner.set(false);
			toast.set({
				openToast: true,
				messageToast: 'Error al eliminar orden. No posee permisos.',
				kind: 'error'
			});
			console.error('Error al obtener el PDF:', error);
		}
	};

	const modificarOrden = (data) => {
		orderToUpdate = data.detail;
		mostrarForm.set(true);
	};

	// --- TABLA -------------------------

	const getOrders = async () => {
		try {
			const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/order`, {
				withCredentials: true
			});
			const item = response.data.result || [];
			order = item.map((item) => ({
				id: item._id,
				serie: item.serie,
				date: dateFormat(item.date),
				client: item.client.companyName,
				clientId: item.client._id,
				cuil: item.client.cuil,
				email: item.client.email,
				address: item.client.address,
				taxpayer: item.client.taxpayer,
				product: item.product,
				total: item.total
			}));
			metricas(order);
			orderStore.set(order);
		} catch (error) {
			console.error('Error al traer comprobantes:', error);
		}
	};

	const abrirPDF = async (e) => {
		try {
        const response = await api.get(`/api/pdfview/${e.detail.id}`, {
            responseType: 'blob',
        });

			const pdfBlob = response.data;
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

	const cerrarTabla = () => {
		mostrarTabla.set(false);
		mostrarTablaCliente.set(false);
	};

	// --- TABLA -------------------------

	// --- COMPROBANTES ------------------------------------------------------------------------------------------------------------

	// **************************************

	// --- CLIENTE -----------------------------------------------------------------------------------------------------------------

	const cliente = async (event) => {
		try {
			const data = {
				companyName: event.detail.companyName,
				cuil: event.detail.cuil,
				email: event.detail.email,
				address: event.detail.address,
				taxpayer: event.detail.taxpayer
			};

			const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/client`, data, {
				withCredentials: true,
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (response.status >= 200 && response.status < 300) {
				setTimeout(() => {
					spinner.set(false);
					mostrarFormCliente.set(false);
					toast.set({
						openToast: true,
						messageToast: response.data.message,
						kind: 'success'
					});
				}, 1400);
			}
		} catch (error) {
			setTimeout(() => {
				spinner.set(false);
				toast.set({
					openToast: true,
					messageToast: error.response.data.message,
					kind: 'error'
				});
				console.error('Error al crear el cliente:', error);
			}, 1400);
		}
		getClient();
	};

	const actualizarCliente = async (event) => {
		try {
			const data = {
				companyName: event.detail.companyName,
				cuil: event.detail.cuil,
				email: event.detail.email,
				address: event.detail.address,
				taxpayer: event.detail.taxpayer
			};

			const response = await axios.put(
				`${import.meta.env.VITE_API_URL}/api/client/${clientToUpdate.id}`,
				data,
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json'
					}
				}
			);

			clientToUpdate = null;

			if (response) {
				setTimeout(() => {
					spinner.set(false);
					mostrarFormCliente.set(false);
					toast.set({ openToast: true, messageToast: response.data.message, kind: 'success' });
				}, 1400);
			}

			getClient();
		} catch (error) {
			setTimeout(() => {
				spinner.set(false);
				mostrarFormCliente.set(false);
				toast.set({
					openToast: true,
					messageToast: response.data.message,
					kind: 'error'
				});
				console.error('Error al modificar el cliente:', error);
			}, 1200);
		}
	};

	const eliminarCliente = async (data) => {
		try {
			const status = {
				status: false
			};

			const response = await axios.put(
				`${import.meta.env.VITE_API_URL}/api/delclient/${data.detail.id}`,
				status,
				{
					withCredentials: true
				}
			);

			setTimeout(() => {
				if (response.status >= 200 && response.status < 300) {
					spinner.set(false);
					toast.set({ openToast: true, messageToast: response.data.message, kind: 'success' });
				}
			}, 1200);

			getClient();
		} catch (error) {
			spinner.set(false);
			toast.set({
				openToast: true,
				messageToast: error.response.data.message,
				kind: 'error'
			});
			console.error('Error al eliminar el cliente:', error);
		}
	};

	const modificarCliente = async (data) => {
		clientToUpdate = data.detail;
		mostrarFormCliente.set(true);
	};

	// --- TABLA ------------------------

	const getClient = async () => {
		try {
			const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/client`);
			const item = response.data.result || [];

			client = item.map((item) => ({
				id: item._id,
				code: item.code,
				companyName: item.companyName,
				cuil: item.cuil,
				email: item.email,
				address: item.address,
				taxpayer: item.taxpayer
			}));

			clientStore.set(client);
		} catch (error) {
			console.error('Error al traer clientes:', error);
		}
	};

	// --- TABLA ------------------------

	// --- CLIENTE -----------------------------------------------------------------------------------------------------------------

	// --- METRICAS ----------------------------------------------------------------------------------------------------------------

	// --- Métricas
	const metricas = async (orders) => {
		try {
			let riCounter = 0;
			let mtCounter = 0;
			let cfCounter = 0;
			let ieCounter = 0;
			let mtpCounter = 0;
			let prCounter = 0;

			// const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/order`);
			// const orders = response.data.result;

			orders.forEach((item) => {
				if (item.taxpayer === 'MONOTRIBUTISTA') mtCounter++;
				if (item.taxpayer === 'CONSUMIDOR FINAL') cfCounter++;
				if (item.taxpayer === 'IVA EXCENTO') ieCounter++;
				if (item.taxpayer === 'RESPONSABLE INSCRIPTO') riCounter++;
				if (item.taxpayer === 'CONSUMIDOR FINAL - MAT. PRIMAS') mtpCounter++;
				if (item.taxpayer === 'PRESUPUESTO') prCounter++;
			});

			metric1Order.set({
				ri: riCounter,
				mt: mtCounter,
				cf: cfCounter,
				ie: ieCounter,
				cfm: mtpCounter,
				p: prCounter
			});
		} catch (error) {
			console.error('Error al obtener métricas', error);
		}
	};

	onMount(() => {
		getOrders();
		getClient();
		// metricas();
	});
</script>

<main>
	<section>
		{#if $mostrarForm}
			<FormRemito
				order={orderToUpdate}
				on:crearRemito={(spinner.set(true), remitero)}
				on:actualizarRemito={(spinner.set(true), actualizarOrden)}
			/>
		{:else if $mostrarFormCliente}
			<FormCliente
				client={clientToUpdate}
				on:crearCliente={(spinner.set(true), cliente)}
				on:actualizarCliente={(spinner.set(true), actualizarCliente)}
			/>
		{:else if $mostrarTabla}
			<Table
				on:volver={cerrarTabla}
				on:verPDF={abrirPDF}
				on:modificar={modificarOrden}
				on:eliminar={eliminarOrden}
			/>
		{:else if $mostrarTablaCliente}<TableClient
				on:volver={cerrarTabla}
				on:modificar={modificarCliente}
				on:eliminar={eliminarCliente}
			/>
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
