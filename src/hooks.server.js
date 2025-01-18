// /** @type {import('@sveltejs/kit').Handle} */

// export async function handle({ event, resolve }) {
// 	const cookie = event.cookies.get('jwt');
// 	console.log(cookie);

// 	const public = ['/'];

// 	if (!public.includes(event.url.pathname && !cookie)) {
// 		return new Response(null, {
// 			status: 303,
// 			headers: { location: '/login' }
// 		});
// 	}

// 	if (cookie && !event.url.pathname.startsWith('/dash')) {
// 		try {
// 			const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth`, {
// 				method: 'GET',
// 				credentials: 'include', // Asegúrate de incluir las cookies
// 				headers: {
// 					Accept: 'application/json'
// 				}
// 			});

// 			const data = await res.json();

// 			if (data.success) {
// 				// VER SUCCESS OJO!
// 				return await resolve(event);
// 			}
// 		} catch (error) {
// 			console.error('Error al verificar el token:', error.message);
// 			return new Response(null, {
// 				status: 303,
// 				headers: { location: '/' }
// 			});
// 		}
// 	}
// }

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	const cookie = event.cookies.get('jwt');

	// Lista de rutas públicas que no requieren autenticación
	const publicRoutes = ['/'];

	if (!publicRoutes.includes(event.url.pathname) && !cookie) {
		return new Response(null, {
			status: 303,
			headers: { location: '/' }
		});
	}

	if (cookie && !event.url.pathname.startsWith('/dash')) {
		try {
			const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth`, {
				method: 'GET',
				credentials: 'include', // Asegúrate de incluir las cookies
				headers: {
					Accept: 'application/json'
				}
			});

			const data = await res.json();

			if (!data.success) {
				// Limpiar la cookie inválida
				// event.cookies.delete('jwt', { path: '/' });
				return new Response(null, {
					status: 303,
					headers: { location: '/' }
				});
			}

			// Añadir información del usuario al evento para uso posterior
			event.locals.user = data.user;
		} catch (error) {
			console.error('Error al verificar el token:', error.message);
			return new Response(null, {
				status: 303,
				headers: { location: '/' }
			});
		}
	}
	return await resolve(event);
}
