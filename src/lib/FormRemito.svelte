<script>
	import { FluidForm, TextInput, Dropdown } from 'carbon-components-svelte';
	import Button from './Button.svelte';
	import { mostrarForm } from './js/store.js';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let client;
	let cuil;
	let email;
	let taxpayer;
	let products = [{ name: '', quantity: null, price: null }];

	let items = [
		{ id: '0', text: 'Responsable Inscripto' },
		{ id: '1', text: 'Monotributista' },
		{ id: '2', text: 'Consumidor Final' },
		{ id: '3', text: 'Iva Excento' }
	];

	const tax = (e) => {
		taxpayer = e.detail.selectedItem.text;
	};

	const crear = async (e) => {
		e.preventDefault();
		dispatch('crearRemito', { client, cuil, email, taxpayer, products });
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
</script>

<div class="form-container">
	<FluidForm on:submit={crear}>
		<h1>Cliente</h1>
		<div class="input-group">
			<TextInput
				type="text"
				labelText="Cliente"
				placeholder="Ingrese la razón social del cliente"
				bind:value={client}
				required
			/>
		</div>
		<div class="input-group">
			<TextInput
				type="text"
				labelText="CUIL"
				placeholder="Ingrese el cuil del cliente"
				bind:value={cuil}
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
			<Dropdown on:select={tax} {items} size="xl" label="Condición Fiscal" required />

			<!-- <TextInput
				type="text"
				labelText="Condición"
				placeholder="Ingrese la condición frente a AFIP del cliente"
				bind:value={taxpayer}
				required
			/> -->
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
						required
					/>
				</div>
				<div class="input-group">
					<TextInput
						type="number"
						labelText="Precio Unitario"
						placeholder="Ingrese el precio unitario"
						bind:value={product.price}
						required
					/>
				</div>
				<div class="input-group">
					<TextInput
						type="number"
						labelText="Porcentaje de Descuento"
						placeholder="Ingrese el procentaje de descuento"
						bind:value={product.discount}
						required
					/>
				</div>
			</div>
		{/each}

		<Button type="button" kind="secondary" title="+" on:click={agregar} />

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
			<Button type="submit" kind="tertiary" title="Ingresar" />
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
