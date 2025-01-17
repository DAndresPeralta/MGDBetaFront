// Proteccion de rutas *****************

import { redirect } from '@sveltejs/kit';
import axios from 'axios';

export async function load({ fetch }) {
	const userLoggedInStatus = async () => {
	const result = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth`, {
				withCredentials: true,
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				}
			});
		console.log(result);
		return result;
	};

	const result = await userLoggedInStatus();
	// const text = await result.text(); // Obtener la respuesta como texto
	// console.log('Respuesta del servidor:', text);
	const returnedData = await result.json();
	console.log("Dentro de +page.server.js");
	console.log(returnedData.success);

	if (returnedData.success !== true) {
		throw redirect(303, '/');
	}

	return {
		returnedData
	};
}
