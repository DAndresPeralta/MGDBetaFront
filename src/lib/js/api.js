import axios from 'axios';

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json'
	}
});

let isRefreshing = false;
let failedRefresh = [];

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalReq = error.config;

		if (error.response?.status === 401 && !originalReq._retry) {
			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					failedRefresh.push({ resolve, reject });
				})
					.then(() => {
						return api(originalReq);
					})
					.catch((err) => {
						return Promise.reject(err);
					});
			}
			originalReq._retry = true;
			isRefreshing = true;

			try {
				await axios.post(
					`${import.meta.env.VITE_API_URL}/api/refresh`,
					{},
					{
						withCredentials: true
					}
				);

				const retryRes = await api(originalReq);

				failedRefresh.forEach(({ resolve }) => resolve());
				failedRefresh = [];

				return retryRes;
			} catch (refreshError) {
				failedRefresh.forEach(({ reject }) => reject(refreshError));
				failedRefresh = [];

				console.error('Error al refrescar el token:', refreshError);
				window.location.href = '/';
				return Promise.reject(refreshError);
			} finally {
				isRefreshing = false;
			}
		}
		return Promise.reject(error);
	}
);

export default api;
