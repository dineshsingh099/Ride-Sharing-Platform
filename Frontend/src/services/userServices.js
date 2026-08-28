import api from "./api";

export const userService = {
	register: async (name, email, password) => {
		const { data } = await api.post("/user/register", {
			name,
			email,
			password,
		});
		return data;
	},

	login: async (email, password) => {
		const { data } = await api.post("/user/login", {
			email,
			password,
		});
		return data;
	},

	verifyOtp: async (email, otp) => {
		const { data } = await api.post("/user/verify-otp", {
			email,
			otp,
		});
		return data;
	},

	resendOtp: async (email) => {
		const { data } = await api.post("/user/resend-otp", {
			email,
		});
		return data;
	},

	logout: async () => {
		const { data } = await api.post("/user/logout");
		return data;
	},

	refreshToken: async () => {
		const { data } = await api.post("/user/refresh-token");
		return data;
	},

	getCurrentUser: async () => {
		const { data } = await api.get("/user/me");
		return data;
	},

	getGoogleNonce: async () => {
		const { data } = await api.get("/user/google/nonce");
		return data;
	},

	googleLogin: async (credential, nonce) => {
		const { data } = await api.post("/user/google", {
			credential,
			nonce,
		});
		return data;
	},
};
