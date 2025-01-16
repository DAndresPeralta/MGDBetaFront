// Proteccion de rutas *****************

import { redirect } from '@sveltejs/kit';

// export async function load({ fetch }) {
// 	const userLoggedInStatus = async () => {
// 		const result = await fetch(`${import.meta.env.VITE_API_URL}/api/auth`, {
// 			method: 'GET',
// 			credentials: 'include',
// 			headers: {
// 				Accept: 'application/json',
// 				'content-type': 'application/json'
// 			}
// 		});
// 		console.log(result);
// 		return result;
// 	};

// 	const result = await userLoggedInStatus();
// 	// const text = await result.text(); // Obtener la respuesta como texto
// 	// console.log('Respuesta del servidor:', text);
// 	const returnedData = await result.json();
// 	console.log("Dentro de +page.server.js");
// 	console.log(returnedData.success);

// 	if (returnedData.success !== true) {
// 		throw redirect(303, '/');
// 	}

// 	return {
// 		returnedData
// 	};
// }
