import api from "./api";

export const adminService = {
	login: async (email, password) => {
		const { data } = await api.post("/admin/login", {
			email,
			password,
		});
		return data;
	},

	logout: async () => {
		const { data } = await api.post("/admin/logout");
		return data;
	},

	refreshToken: async () => {
		const { data } = await api.post("/admin/refresh-token");
		return data;
	},

	getCurrentAdmin: async () => {
		const { data } = await api.get("/admin/me");
		return data;
	},
};
