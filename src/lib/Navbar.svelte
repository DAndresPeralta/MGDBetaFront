<script>
	import {
		Header,
		HeaderNav,
		HeaderNavItem,
		HeaderNavMenu,
		SkipToContent,
		Content,
		Grid,
		Row,
		Column
	} from 'carbon-components-svelte';
	import Button from './Button.svelte';
	import axios from 'axios';
	import { goto } from '$app/navigation';
	import errores from '../utils/errors.js';
	import {
		mostrarTabla,
		mostrarForm,
		mostrarFormCliente,
		mostrarTablaCliente
	} from './js/store.js';
	let isSideNavOpen = false;

	// export const mostrarProdutos = (e) => {
	// 	e.preventDefault();
	// 	// Cambia el estado a true
	// 	mostrarTable.set(true);
	// 	mostrarFormulario.set(false);
	// };

	// export const mostrarFormularioAdd = (e) => {
	// 	e.preventDefault();
	// 	mostrarTable.set(false);
	// 	mostrarFormulario.set(false);
	// 	mostrarFormularioAgregar.set(true);
	// };

	const crearRemito = (e) => {
		e.preventDefault();
		mostrarForm.set(true);
		mostrarTabla.set(false);
		mostrarFormCliente.set(false);
		mostrarTablaCliente.set(false);
	};

	const crearCliente = (e) => {
		e.preventDefault();
		mostrarTablaCliente.set(false);
		mostrarFormCliente.set(true);
	};

	const tabla = (e) => {
		e.preventDefault();
		mostrarTabla.set(true);
		mostrarForm.set(false);
		mostrarFormCliente.set(false);
		mostrarTablaCliente.set(false);
	};

	const tablaCliente = (e) => {
		e.preventDefault();
		mostrarFormCliente.set(false);
		mostrarTablaCliente.set(true);
	};

	const cerrarSesion = async (e) => {
		try {
			e.preventDefault();
			const response = await axios.post(
				`${import.meta.env.VITE_API_URL}/api/logout`,
				{},
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json'
					}
				}
			);
			const res = response.data;
			console.log(res);

			if (res.status === 'success') goto('/');
		} catch (error) {
			goto('/');
			errores.manejoDeErrores(error);
		}
	};
</script>

<Header company="Milessima" platformName="Gestión de Depósitos" bind:isSideNavOpen>
	<svelte:fragment slot="skip-to-content">
		<SkipToContent />
	</svelte:fragment>
	<HeaderNav>
		<!-- <HeaderNavMenu text="Productos">
			Llamo a la funcion mostrarProductos para que le cambie el estado a mostrarTable a true
			<HeaderNavItem on:click={mostrarProdutos} text="Consulta" />
			<HeaderNavItem on:click={mostrarFormularioAdd} text="Agregar" />
			<HeaderNavItem href="/" text="Modificar" />
			<HeaderNavItem href="/" text="Eliminar" />
		</HeaderNavMenu> -->
		<HeaderNavMenu text="Comprobantes">
			<HeaderNavItem on:click={crearRemito} href="/" text="Crear" />
			<HeaderNavItem on:click={tabla} href="/" text="Consultar" />
		</HeaderNavMenu>
		<HeaderNavMenu text="Clientes">
			<HeaderNavItem on:click={crearCliente} href="/" text="Crear" />
			<HeaderNavItem on:click={tablaCliente} ref="/" text="Consultar" />
		</HeaderNavMenu>
	</HeaderNav>
	<div class="botonCerrarSesion">
		<!-- para que on:click funcione se tiene que agregar un dispatch en el componente hijo Button, para que se propague el evento desde el hacia el componente
		padre, en este caso, Navbar -->
		<Button type="button" kind="danger" title="Cerrar Sesión" on:click={cerrarSesion} />
	</div>
</Header>

<style>
	.botonCerrarSesion {
		margin-left: auto;
		display: flex;
		align-items: center;
	}
</style>
