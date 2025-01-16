import { error } from '@sveltejs/kit';
import axios from 'axios';

const manejoDeErrores = (error) => {
	if (axios.isAxiosError(error)) {
		console.error(`Error de API: ${error.response?.data || error.message}.`);
		return error.response?.data?.message || `Error al comunicarse con el servidor.`;
	} else {
		console.error(`Error inesperado: ${error.message || error}`);
		return `Error inesperado`;
	}
};

export default manejoDeErrores;
