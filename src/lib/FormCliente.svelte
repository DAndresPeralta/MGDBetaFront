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
	import { mostrarFormCliente, toast, spinner } from './js/store.js';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let client = null;
	let companyName = client ? client.companyName : '';
	let cuil = client ? client.cuil : '';
	let email = client ? client.email : '';
	let address = client ? client.address : '';
	let taxpayer = client ? client.taxpayer : '';

	let items = [
		{ id: '0', text: 'Responsable Inscripto' },
		{ id: '1', text: 'Monotributista' },
		{ id: '2', text: 'Iva Excento' },
		{ id: '3', text: 'Consumidor Final' },
		{ id: '4', text: 'Consumidor Final - Mat. Primas' },
		{ id: '5', text: 'Presupuesto' }
	];

	const tax = (e) => {
		taxpayer = e.detail.selectedItem.text;
	};

	const manejadorFormulario = async (e) => {
		e.preventDefault();

		if (client) {
			spinner.set(false);
			toast.set({ openToast: false });
			dispatch('actualizarCliente', { companyName, cuil, email, address, taxpayer });
		} else {
			spinner.set(false);
			toast.set({ openToast: false });
			dispatch('crearCliente', { companyName, cuil, email, address, taxpayer });
		}
	};

	const cancelar = async (e) => {
		e.preventDefault();
		mostrarFormCliente.set(false);
	};
</script>

<div class="form-container">
	<FluidForm on:submit={manejadorFormulario}>
		<h1>Cliente</h1>
		<div class="input-group">
			<TextInput
				type="text"
				labelText="Cliente"
				placeholder="Ingrese la razón social del cliente"
				bind:value={companyName}
				required
			/>
		</div>
		<div class="input-group">
			<TextInput
				type="text"
				labelText="CUIL"
				placeholder="11-11111111-1"
				bind:value={cuil}
				minlength="13"
				maxlength="13"
				required
			/>
		</div>
		<div class="input-group">
			<TextInput
				type="text"
				labelText="Email"
				placeholder="Ingrese el correo electrónico del cliente"
				bind:value={email}
				required
			/>
		</div>
		<div class="input-group">
			<TextInput
				type="text"
				labelText="Domicilio"
				placeholder="Ingrese la dirección del cliente"
				bind:value={address}
				required
			/>
		</div>
		<div class="input-group">
			<Dropdown
				on:select={tax}
				{items}
				size="xl"
				label={taxpayer ? taxpayer : 'Condición Fiscal'}
				required
			/>
		</div>

		<div class="button-group">
			<Button type="submit" kind="tertiary" title={client ? 'Actualizar' : 'Crear'} />
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
