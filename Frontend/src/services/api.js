import axios from "axios";

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	withCredentials: true,
});

const refreshState = {
	user: { isRefreshing: false, queue: [] },
	partner: { isRefreshing: false, queue: [] },
};

const processQueue = (role, error) => {
	refreshState[role].queue.forEach((prom) => {
		if (error) {
			prom.reject(error);
		} else {
			prom.resolve();
		}
	});
	refreshState[role].queue = [];
};

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (
			error.response?.status === 401 &&
			!originalRequest._retry &&
			!originalRequest.url.includes("/login") &&
			!originalRequest.url.includes("/refresh-token") &&
			!originalRequest.url.includes("/google")
		) {
			const role = originalRequest.url.includes("/partner")
				? "partner"
				: "user";
			const state = refreshState[role];

			if (state.isRefreshing) {
				return new Promise((resolve, reject) => {
					state.queue.push({ resolve, reject });
				})
					.then(() => api(originalRequest))
					.catch((err) => Promise.reject(err));
			}

			originalRequest._retry = true;
			state.isRefreshing = true;

			try {
				await api.post(`/${role}/refresh-token`);
				processQueue(role, null);
				return api(originalRequest);
			} catch (refreshError) {
				processQueue(role, refreshError);
				return Promise.reject(refreshError);
			} finally {
				state.isRefreshing = false;
			}
		}

		return Promise.reject(error);
	},
);

export default api;
