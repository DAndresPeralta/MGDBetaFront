<script>
	import {
		FluidForm,
		TextInput,
		Dropdown,
		DatePicker,
		DatePickerInput,
		Toggle
	} from 'carbon-components-svelte';
	import Button from './Button.svelte';
	import { mostrarForm, orderStore, toast } from './js/store.js';
	import api from '../lib/js/api.js';
	import { createEventDispatcher, onMount } from 'svelte';
	import axios from 'axios';

	const dispatch = createEventDispatcher();

	export let order = null;
	let clientId = order ? order.clientId : '';
	let client = order ? order.client : '';
	let cuil = order ? order.cuil : '';
	let email = order ? order.email : '';
	let address = order ? order.address : '';
	let taxpayer = order ? order.taxpayer : '';
	let products = order ? order.product : [{ name: '', quantity: null, price: null }];
	let date = order ? order.date : '';
	let sendEmail = true;

	// To renderize clients on dropdown
	let clients = [];
	let clientsToSelect = [];
	let selectedTax = null;

	let items = [
		{ id: '0', text: 'Responsable Inscripto' },
		{ id: '1', text: 'Monotributista' },
		{ id: '2', text: 'Iva Excento' },
		{ id: '3', text: 'Consumidor Final' },
		{ id: '4', text: 'Consumidor Final - Mat. Primas' },
		{ id: '5', text: 'Presupuesto' }
	];

	// --- Renderizado de clientes desde el back

	onMount(async () => {
		try {
			// Get clients from DB
			const response = await api.get(`/api/client`);

			// Store clients, if there is no client will declar like empty array. We avoid null (broke)
			clients = (await response.data.result) || [];

			// We store client with id and text, both required for dropdown component
			clientsToSelect = clients.map((client) => ({
				id: client._id,
				text: client.companyName
			}));
		} catch (error) {
			console.error('Error al obtener clientes:', error);
		}
	});

	const selectClient = (e) => {
		// Get id from client selected on dropdown
		const id = e.detail.selectedItem.id;
		// Match id from dropdown with id client DB
		const selected = clients.find((client) => client._id === id);
		// Assign DB client atributes to array client to renderize
		if (selected) {
			clientId = selected._id;
			client = selected.companyName;
			cuil = selected.cuil;
			email = selected.email;
			address = selected.address;
			taxpayer = selected.taxpayer;
		}
	};

	const tax = (e) => {
		taxpayer = e.detail.selectedItem.text;
	};

	// --- Renderizado de clientes desde el back

	const manejadorFormulario = async (e) => {
		e.preventDefault();

		if (order) {
			toast.set({ openToast: false });
			dispatch('actualizarRemito', { clientId, products, date, sendEmail });
		} else {
			toast.set({ openToast: false });
			dispatch('crearRemito', { clientId, products, date, sendEmail });
		}
	};

	const cancelar = async (e) => {
		e.preventDefault();
		console.log('Cancelando...');
		mostrarForm.set(false);
	};

	const agregar = async (e) => {
		e.preventDefault();
		products = [...products, { name: '', quantity: null, price: null, discount: null }];
	};

	const quitar = async (e) => {
		e.preventDefault();
		if (products.length > 1) {
			products = products.slice(0, -1);
		}
	};
</script>

<div class="form-container">
	<FluidForm on:submit={manejadorFormulario}>
		<h1>Cliente</h1>
		<div class="input-group">
			<Dropdown
				items={clientsToSelect || []}
				on:select={selectClient}
				bind:selectedItem={clientsToSelect}
				size="xl"
				label={client ? client : 'Seleccione un Cliente'}
				required
			/>
		</div>
		<div class="input-group">
			<TextInput
				type="text"
				labelText="CUIL"
				placeholder="Ingrese el cuil del cliente"
				bind:value={cuil}
				minlength="13"
				maxlength="13"
				disabled
				required
			/>
		</div>
		<div class="input-group">
			<TextInput
				type="text"
				labelText="Email"
				placeholder="Ingrese el correo electrónico del cliente"
				bind:value={email}
				disabled
				required
			/>
		</div>
		<div class="input-group">
			<TextInput
				type="text"
				labelText="Direccion Fiscal"
				placeholder="Ingrese la dirección fiscal del cliente"
				bind:value={address}
				disabled
				required
			/>
		</div>
		<div class="input-group">
			<TextInput
				type="text"
				labelText="Condicion Fiscal"
				placeholder="Ingrese condición fiscal del cliente"
				bind:value={taxpayer}
				disabled
				required
			/>
		</div>
		<div class="input-group">
			<div>
				<DatePicker datePickerType="single" dateFormat="d/m/Y" on:change bind:value={date}>
					<DatePickerInput size="xl" placeholder="Seleccione una fecha" />
				</DatePicker>
			</div>
			<div style="margin: 1rem 0 1rem">
				<Toggle labelText="¿Desea enviar el comprobante al cliente?" bind:toggled={sendEmail} />
			</div>
		</div>
		<h1>Producto</h1>

		{#each products as product, index}
			<div class="product-group mb-4">
				<div class="input-group">
					<TextInput
						type="text"
						labelText={`Producto ${index + 1}`}
						placeholder="Ingrese el producto"
						bind:value={product.name}
						required
					/>
				</div>
				<div class="input-group">
					<TextInput
						type="number"
						labelText="Cantidad"
						placeholder="Ingrese la cantidad"
						bind:value={product.quantity}
						min="0"
						required
					/>
				</div>
				<div class="input-group">
					<TextInput
						type="number"
						labelText="Precio Unitario"
						placeholder="Ingrese el precio unitario"
						bind:value={product.price}
						step="0.01"
						min="0"
						required
					/>
				</div>
				<div class="input-group">
					<TextInput
						type="number"
						labelText="Porcentaje de Descuento"
						placeholder="Ingrese el procentaje de descuento"
						bind:value={product.discount}
						step="0.01"
						min="0"
						required
					/>
				</div>
			</div>
		{/each}

		<Button type="button" kind="secondary" title="+" on:click={agregar} />
		<Button type="button" kind="danger" title="-" on:click={quitar} />

		<!-- <div class="input-group">
			<TextInput
				type="text"
				labelText="Producto"
				placeholder="Ingrese el producto"
				bind:value={name}
				required
			/>
		</div>
		<div class="input-group">
			<TextInput
				type="number"
				labelText="Cantidad"
				placeholder="Ingrese la cantidad"
				bind:value={quantity}
				required
			/>
		</div>
		<div class="input-group">
			<TextInput
				type="number"
				labelText="Precio Unitario"
				placeholder="Ingrese el precio unitario"
				bind:value={price}
				required
			/>
		</div> -->
		<div class="button-group">
			<Button type="submit" kind="tertiary" title={order ? 'Actualizar' : 'Crear'} />
			<Button on:click={cancelar} kind="danger" title="Cancelar" />
		</div>
	</FluidForm>
</div>

<style>
	h1 {
		margin-bottom: 0.5rem;
		font-size: large;
		font-weight: 400;
	}
	.form-container {
		justify-content: center;
		align-items: center;
		margin-bottom: 7rem;
		padding-top: 1rem;
		padding-bottom: 1rem;
		padding-left: 1rem;
		padding-right: 1rem;
		width: 97%;
		/* background-color: rgb(32, 32, 32); */
		background-color: #525252;
	}

	/* Asegura que los elementos del form estén alineados y con espaciado */
	.input-group {
		display: flexbox;
		margin-bottom: 10px;
		width: 100%; /* Hace que los inputs y el botón ocupen el 100% del ancho disponible */
	}

	/* Opcional: Estilo del botón */
	.button-group {
		padding-top: 1%;
		margin-left: 40%;
	}
</style>
