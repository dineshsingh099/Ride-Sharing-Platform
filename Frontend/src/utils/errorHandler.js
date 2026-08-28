export function extractErrorMessage(error) {
	const data = error?.response?.data;

	if (!data) {
		return "Network error. Please check your connection and try again.";
	}

	if (Array.isArray(data.errors) && data.errors.length > 0) {
		return data.errors.join(" ");
	}

	if (data.message) {
		return data.message;
	}

	return "Something went wrong, please try again";
}
