import api from "./api";

export const partnerService = {
	register: async (name, email, password) => {
		const { data } = await api.post("/partner/register", {
			name,
			email,
			password,
		});
		return data;
	},

	login: async (email, password) => {
		const { data } = await api.post("/partner/login", {
			email,
			password,
		});
		return data;
	},

	verifyOtp: async (email, otp) => {
		const { data } = await api.post("/partner/verify-otp", {
			email,
			otp,
		});
		return data;
	},

	resendOtp: async (email) => {
		const { data } = await api.post("/partner/resend-otp", {
			email,
		});
		return data;
	},

	logout: async () => {
		const { data } = await api.post("/partner/logout");
		return data;
	},

	refreshToken: async () => {
		const { data } = await api.post("/partner/refresh-token");
		return data;
	},

	getCurrentPartner: async () => {
		const { data } = await api.get("/partner/me");
		return data;
	},

	getGoogleNonce: async () => {
		const { data } = await api.get("/partner/google/nonce");
		return data;
	},

	googleLogin: async (credential, nonce) => {
		const { data } = await api.post("/partner/google", {
			credential,
			nonce,
		});
		return data;
	},

	getOnboardingStatus: async () => {
		const { data } = await api.get("/partner/onboarding/status");
		return data;
	},

	submitVehicleDetails: async ({ type, vehicleModel, number }) => {
		const { data } = await api.post("/partner/onboarding/vehicle", {
			type,
			vehicleModel,
			number,
		});
		return data;
	},

	submitDocuments: async ({ license, rc, insurance, aadhar }) => {
		const formData = new FormData();
		formData.append("license", license);
		formData.append("rc", rc);
		formData.append("insurance", insurance);
		formData.append("aadhar", aadhar);

		const { data } = await api.post("/partner/onboarding/documents", formData, {
			headers: { "Content-Type": "multipart/form-data" },
		});
		return data;
	},

	submitBankDetails: async ({
		accountHolderName,
		accountNumber,
		ifscCode,
		phoneNumber,
		upiId,
	}) => {
		const { data } = await api.post("/partner/onboarding/bank", {
			accountHolderName,
			accountNumber,
			ifscCode,
			phoneNumber,
			upiId,
		});
		return data;
	},
};
