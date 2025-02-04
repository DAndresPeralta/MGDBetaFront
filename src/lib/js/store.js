import { writable } from 'svelte/store';

// -- Estados de componentes
export const mostrarForm = writable(false);
export const mostrarTabla = writable(false);
export const spinner = writable(false);
export const modalStore = writable({
	isOpen: false,
	id: ''
});
export const toast = writable({ openToast: false, messageToast: '', kind: '' });

// -- Reactividad de arrays
export const orderStore = writable([]);

// -- Métricas
export const metric1Order = writable({
	ri: 0,
	mt: 0,
	cf: 0,
	ie: 0,
	cfm: 0,
	p: O
});
